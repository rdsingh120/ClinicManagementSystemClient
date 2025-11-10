import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAvailability } from '../api/availability.api'

const DEFAULT_AVATAR =
    'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'

const isAbsoluteUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url)

const Badge = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
        {children}
    </span>
)

/** Fetch relative API photos with Authorization */
function SecureImage({ src, alt, fallback = DEFAULT_AVATAR }) {
    const [blobUrl, setBlobUrl] = useState(null)
    const [usingFallback, setUsingFallback] = useState(false)
    const createdUrlRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        setUsingFallback(false)

        if (!src || isAbsoluteUrl(src)) {
            setBlobUrl(null)
            if (!src) setUsingFallback(true)
            return
        }

        const path = src.startsWith('/') ? src : `/${src}`
        const url = `${API_ROOT}${path}`

            ; (async () => {
                try {
                    const resp = await fetch(url, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    })
                    if (!resp.ok) throw new Error(`Image fetch failed: ${resp.status}`)
                    const blob = await resp.blob()
                    const o = URL.createObjectURL(blob)
                    createdUrlRef.current = o
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
            if (createdUrlRef.current) {
                URL.revokeObjectURL(createdUrlRef.current)
                createdUrlRef.current = null
            }
        }
    }, [src])

    const effectiveSrc = isAbsoluteUrl(src) ? src : blobUrl || fallback
    const fitClass =
        usingFallback || effectiveSrc === fallback ? 'object-contain bg-gray-50' : 'object-cover'

    return (
        <div className="h-96 w-full overflow-hidden rounded-2xl">
            <img src={effectiveSrc} alt={alt} className={`h-full w-full ${fitClass}`} loading="lazy" />
        </div>
    )
}

const DayPill = ({ children }) => (
    <span className="inline-flex items-center rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
        {children}
    </span>
)

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const normalizeDay = (d) => {
    if (!d) return null
    const s = String(d).slice(0, 3).toLowerCase()
    const map = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }
    return map[s] || null
}
const fromDayOfWeek = (n) => DAY_ORDER[((n ?? -1) + 6) % 7] // 0=Sun → index 6; 1=Mon → 0

function daysFromWeekly(weekly = []) {
    if (!Array.isArray(weekly) || weekly.length === 0) return []
    const set = new Set()
    weekly.forEach((w) => {
        if (typeof w === 'string') { const d = normalizeDay(w); if (d) set.add(d); return }
        if (Number.isInteger(w?.dayOfWeek)) { const d = fromDayOfWeek(w.dayOfWeek); if (d) set.add(d); return }
        const d = normalizeDay(w?.day); if (d) set.add(d)
    })
    return DAY_ORDER.filter((d) => set.has(d))
}

export function DoctorCard({ doc }) {
    const navigate = useNavigate()
    const { _id, firstName, lastName, doctorProfile = {} } = doc || {}

    const name = useMemo(
        () => [firstName, lastName].filter(Boolean).join(' '),
        [firstName, lastName]
    )

    const {
        photoUrl,
        specialty = 'General Practitioner',
        clinicName,
        clinicAddress,
        weeklyAvailability,
    } = doctorProfile

    const coverSrc = isAbsoluteUrl(photoUrl) ? photoUrl : `/doctors/${_id}/photo`

    // Availability: prefer profile value, else fetch from API
    const [days, setDays] = useState(() => daysFromWeekly(weeklyAvailability))
    useEffect(() => {
        let mounted = true
        if (days.length > 0) return
            ; (async () => {
                const { success, availability } = await getAvailability(_id)
                if (!mounted) return
                const weekly = availability?.weekly || availability?.data?.weekly || []
                const derived = daysFromWeekly(weekly)
                if (success && derived.length) setDays(derived)
            })()
        return () => { mounted = false }
    }, [_id, days.length])

    return (
        <article
            className="group relative flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            role="region"
            aria-label={`Doctor card for ${name || 'doctor'}`}
        >
            <SecureImage
                src={coverSrc}
                alt={name ? `Profile of Dr. ${name}` : 'Doctor profile photo'}
                fallback={DEFAULT_AVATAR}
            />

            <h3 className="mt-4 text-lg font-semibold">Dr. {name || '—'}</h3>

            <div className="mt-2">
                <Badge>{specialty}</Badge>
            </div>

            <div className="mt-3 text-sm text-gray-600">
                {clinicName && (
                    <p className="truncate">
                        At {clinicName}
                        {clinicAddress ? `, ${clinicAddress}` : ''}
                    </p>
                )}
            </div>

            {/* Availability row */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {days.length > 0 ? (
                        days.map((d) => <DayPill key={d}>{d}</DayPill>)
                    ) : (
                        <span className="text-sm text-gray-500">Schedule not posted</span>
                    )}
                </div>

                {/* Goes to the public profile */}
                <button
                    type="button"
                    onClick={() => navigate(`/dashboard/doctors/${_id}`, { state: { doctor: doc } })}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-blue-600 text-white shadow transition hover:bg-blue-700"
                    aria-label={name ? `View profile of Dr. ${name}` : 'View profile'}
                    title="View profile"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </article>
    )
}

export default DoctorCard
