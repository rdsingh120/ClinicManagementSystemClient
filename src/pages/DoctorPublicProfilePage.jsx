import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getDoctorPublicProfile } from '../api/doctor.api'
import { getAvailability } from '../api/availability.api'

const DEFAULT_AVATAR =
    'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'

const isAbs = (u) => typeof u === 'string' && /^https?:\/\//i.test(u)

/* ---------- UI helpers ---------- */
const Section = ({ title, children }) => (
    <section className="rounded-2xl border bg-white">
        <div className="rounded-t-2xl bg-indigo-50/60 px-5 py-3 font-semibold text-indigo-900">
            {title}
        </div>
        <div className="p-5">{children}</div>
    </section>
)

/** Secure image loader for auth-protected photo endpoints */
function SecureImage({ src, alt, className = '', fallback = DEFAULT_AVATAR }) {
    const [blobUrl, setBlobUrl] = useState(null)
    const [usingFallback, setUsingFallback] = useState(false)
    const createdRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        setUsingFallback(false)

        if (!src || isAbs(src)) {
            setBlobUrl(null)
            if (!src) setUsingFallback(true)
            return
        }

        const path = src.startsWith('/') ? src : `/${src}`
        const url = `${API_ROOT}${path}`

            ; (async () => {
                try {
                    const resp = await fetch(url, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    if (!resp.ok) throw new Error('img fetch failed')
                    const blob = await resp.blob()
                    const o = URL.createObjectURL(blob)
                    createdRef.current = o
                    if (!cancelled) setBlobUrl(o)
                } catch {
                    if (!cancelled) {
                        setBlobUrl(null)
                        setUsingFallback(true)
                    }
                }
            })()

        return () => {
            cancelled = true
            if (createdRef.current) {
                URL.revokeObjectURL(createdRef.current)
                createdRef.current = null
            }
        }
    }, [src])

    const effective = isAbs(src) ? src : blobUrl || fallback
    const fit = usingFallback || effective === fallback ? 'object-contain bg-gray-50' : 'object-cover'
    return <img src={effective} alt={alt} className={`${className} ${fit}`} />
}

/* ---------- Availability helpers ---------- */
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const toHHMM = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function buildWeeklySummary(weekly = []) {
    const out = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
    weekly.forEach((w) => {
        const dow = Number.isInteger(w?.dayOfWeek)
            ? w.dayOfWeek
            : DAY_LABELS.findIndex((d) =>
                d.toLowerCase().startsWith(String(w?.day ?? '').slice(0, 3).toLowerCase())
            )
        if (dow < 0 || dow > 6) return
        const label = DAY_LABELS[dow]
        if (Number.isInteger(w?.startMinute) && Number.isInteger(w?.endMinute)) {
            out[label].push(`${toHHMM(w.startMinute)} — ${toHHMM(w.endMinute)}`)
        }
    })
    return out
}

/* ---------- Formatting helpers ---------- */
const fmtDate = (d) => {
    const dt = new Date(d)
    if (isNaN(dt)) return ''
    return dt.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' })
}
const formatPhone = (v) => {
    if (!v) return ''
    const digits = String(v).replace(/\D/g, '')
    if (digits.length !== 10) return v
    const a = digits.slice(0, 3)
    const b = digits.slice(3, 6)
    const c = digits.slice(6)
    return `(${a})-${b}-${c}`
}

function EducationCard({ item }) {
    if (!item) return null
    const { degree, school, field, startDate, endDate, description } = item
    return (
        <li className="rounded-2xl border p-5 shadow-sm">
            {degree && <h3 className="text-xl font-semibold">{degree}</h3>}
            {school && <p className="mt-1 text-lg text-gray-700">{school}</p>}
            {field && <p className="mt-1 text-lg text-gray-600">{field}</p>}
            {(startDate || endDate) && (
                <p className="mt-1 text-gray-500">
                    {fmtDate(startDate)} — {fmtDate(endDate)}
                </p>
            )}
            {description && <p className="mt-4 text-gray-800">{description}</p>}
        </li>
    )
}

function ExperienceCard({ item }) {
    if (!item) return null
    const { organization, title, startDate, endDate, description } = item
    return (
        <li className="rounded-2xl border p-5 shadow-sm">
            {title && <h3 className="text-xl font-semibold">{title}</h3>}
            {organization && <p className="mt-1 text-lg text-gray-700">{organization}</p>}
            {(startDate || endDate) && (
                <p className="mt-1 text-gray-500">
                    {fmtDate(startDate)} — {fmtDate(endDate) || 'Present'}
                </p>
            )}
            {description && <p className="mt-4 text-gray-800">{description}</p>}
        </li>
    )
}

const DayChip = ({ children }) => (
    <span className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-indigo-100">
        {children}
    </span>
)

/* =================================================================== */

export default function DoctorPublicProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { state } = useLocation()

    const [doctor, setDoctor] = useState(state?.doctor || null)
    const [loading, setLoading] = useState(!state?.doctor)
    const [error, setError] = useState('')

    const [weeklySummary, setWeeklySummary] = useState(null)

    const fullName = useMemo(() => {
        const fn = doctor?.firstName
        const ln = doctor?.lastName
        return ['Dr.', [fn, ln].filter(Boolean).join(' ')].filter(Boolean).join(' ')
    }, [doctor])

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    setError('')
                    if (!state?.doctor) {
                        setLoading(true)
                        const { success, doctor: d, message } = await getDoctorPublicProfile(id)
                        if (!mounted) return
                        if (!success) throw new Error(message || 'Failed to load doctor')
                        setDoctor(d)
                    } else {
                        setDoctor(state.doctor)
                    }

                    const { success: ok, availability } = await getAvailability(id)
                    if (!mounted) return
                    const weekly = availability?.weekly || availability?.data?.weekly || []
                    setWeeklySummary(buildWeeklySummary(weekly))
                } catch (e) {
                    if (mounted) setError(e.message || 'Failed to load profile')
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => {
            mounted = false
        }
    }, [id, state?.doctor])

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <div className="mb-4 h-7 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-[360px] w-full animate-pulse rounded-2xl bg-gray-100" />
            </div>
        )
    }

    if (error || !doctor) {
        return (
            <div className="flex-1 overflow-y-auto bg-white p-6">
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error || 'Doctor not found.'}
                </p>
                <button
                    className="mt-4 rounded-xl border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        )
    }

    const dp = doctor.doctorProfile || {}
    const specialty = dp.specialty || 'General Practitioner'
    const bio = dp.bio
    const education = Array.isArray(dp.education) ? dp.education : []
    const experience = Array.isArray(dp.experience) ? dp.experience : []
    const phone = formatPhone(dp.phone)
    const workEmail = dp.workEmail
    const timezone = dp.timezone

    const photoSrc = dp.photoUrl && isAbs(dp.photoUrl) ? dp.photoUrl : `/doctors/${doctor._id}/photo`

    const availableDays = weeklySummary
        ? Object.entries(weeklySummary).filter(([, ranges]) => ranges?.length)
        : []

    return (
        <div className="flex-1 overflow-y-auto">
            <header className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="mx-auto flex max-w-5xl items-center gap-6 p-6">
                    <div className="h-28 w-28 overflow-hidden rounded-full border shadow">
                        <SecureImage
                            src={photoSrc}
                            alt={`${fullName} profile photo`}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">{fullName}</h1>
                        <p className="mt-1 text-gray-600">{specialty}</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            className="rounded-xl border px-4 py-2 font-medium text-gray-700 hover:bg-white"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                        <button
                            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
                            onClick={() => navigate(`/dashboard/book-appointment`,
                                {
                                    state: {
                                        doctor: {id: String(doctor._id),
                                            name: `${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.trim(),
                                        }}
                                })}
                        >
                            Book appointment
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-6 md:grid-cols-3">
                {/* Left column */}
                <div className="space-y-6 md:col-span-2">
                    <Section title="About">
                        <p className="whitespace-pre-line text-gray-700">
                            {bio || 'No bio provided.'}
                        </p>
                    </Section>

                    <Section title="Professional Experience">
                        {experience.length > 0 ? (
                            <ul className="space-y-4">
                                {experience.map((x, i) => (
                                    <ExperienceCard key={i} item={x} />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700">Not provided.</p>
                        )}
                    </Section>

                    <Section title="Education & Credentials">
                        {education.length > 0 ? (
                            <ul className="space-y-4">
                                {education.map((e, i) => (
                                    <EducationCard key={i} item={e} />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700">Not provided.</p>
                        )}
                    </Section>
                </div>

                {/* Right column */}
                <aside className="space-y-6">
                    <Section title="Weekly availability">
                        {availableDays.length ? (
                            <ul className="space-y-3">
                                {availableDays.map(([day, ranges]) => (
                                    <li
                                        key={day}
                                        className="group rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                                    {/* clock icon */}
                                                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                </span>
                                                <h4 className="text-base font-semibold text-indigo-900">{day}</h4>
                                            </div>

                                            <div className="rounded-md bg-white/70 px-3 py-1 text-sm font-medium text-indigo-800 ring-1 ring-indigo-100">
                                                {ranges.join(', ')}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No schedule posted.</p>
                        )}
                    </Section>

                    <Section title="Contact & Timezone">
                        <dl className="space-y-3 text-sm text-gray-800">
                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-600">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    Email
                                </dt>
                                <dd className="truncate">{workEmail || '—'}</dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-600">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M5 4h3l2 5-2 1a12 12 0 006 6l1-2 5 2v3a2 2 0 01-2 2A16 16 0 014 7a2 2 0 012-3z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Phone
                                </dt>
                                <dd>{phone || '—'}</dd>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <dt className="flex items-center gap-2 text-gray-600">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    Timezone
                                </dt>
                                <dd className="truncate">{timezone || '—'}</dd>
                            </div>
                        </dl>
                    </Section>
                </aside>
            </main>
        </div>
    )
}
