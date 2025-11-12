import { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { getDoctorProfile } from '../api/doctor.api'
import { getAvailability } from '../api/availability.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { MdEdit } from 'react-icons/md'

const Section = ({ title, action, children }) => (
    <section className="bg-white rounded-xl shadow p-6 mb-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            {action}
        </div>
        {children}
    </section>
)

const Row = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="sm:w-60 text-gray-600">{label}</div>
        <div className="flex-1">{value ?? <span className="text-gray-400">—</span>}</div>
    </div>
)

const fmtPhone = (v) => {
    if (!v) return v
    const digits = String(v).replace(/\D/g, '')
    const ten = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
    if (ten.length !== 10) return v
    return `${ten.slice(0, 3)}-${ten.slice(3, 6)}-${ten.slice(6)}`
}

const fdate = (v) =>
    v
        ? new Intl.DateTimeFormat(undefined, {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(new Date(v))
        : ''

const dayName = (n) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n]

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'
const toAbsApi = (u) => (u?.startsWith('http') ? u : `${API_ROOT}${(u || '').replace(/^\/api/, '')}`)

export default function DoctorProfilePage() {
    const { user } = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const [basic, setBasic] = useState(null)
    const [availability, setAvailability] = useState(null)
    const [photoSrc, setPhotoSrc] = useState(null)
    const doctorId = user?._id || user?.id
    const navigate = useNavigate()

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const res = await getDoctorProfile()
                if (!res?.success) return toast.error(res?.message || 'Failed to load profile')
                if (mounted) {
                    setProfile(res.doctor || {})
                    setBasic(res.basic || null)
                }
            })()
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (!profile?.photoUrl) {
            setPhotoSrc(null)
            return
        }
        let cancelled = false
        let url = null
            ; (async () => {
                try {
                    const resp = await fetch(toAbsApi(profile.photoUrl), {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                        cache: 'no-store'
                    })
                    if (!resp.ok) throw new Error('Photo request failed')
                    const blob = await resp.blob()
                    url = URL.createObjectURL(blob)
                    if (!cancelled) setPhotoSrc(url)
                } catch {
                    setPhotoSrc(null)
                }
            })()
        return () => {
            cancelled = true
            if (url) URL.revokeObjectURL(url)
        }
    }, [profile?.photoUrl])

    useEffect(() => {
        if (!doctorId) return
        let mounted = true
            ; (async () => {
                try {
                    const res = await getAvailability(doctorId)
                    if (mounted) setAvailability(res?.availability || null)
                } catch { }
            })()
        return () => {
            mounted = false
        }
    }, [doctorId])

    const edu = profile?.education || []
    const exp = profile?.experience || []
    const weekly = useMemo(
        () => (availability?.weekly || []).slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek),
        [availability]
    )

    if (!profile) return <div className="flex-1 p-6">Loading...</div>

    const fullName = `${basic?.firstName ?? user?.firstName ?? ''} ${basic?.lastName ?? user?.lastName ?? ''
        }`.trim()

    return (
        <div className="flex-1 rounded-tl-2xl overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-50 p-6">
                <Section
                    title="Common Information"
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/update-doctor-profile')}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white"
                        >
                            <MdEdit className="text-lg" />
                            <span className="text-sm font-medium">Edit Profile</span>
                        </button>
                    }
                >
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                        <div className="w-full md:w-56 lg:w-64 shrink-0 md:self-start">
                            <div className="w-full max-w-[256px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                                {photoSrc ? (
                                    <img
                                        src={photoSrc}
                                        alt="Profile"
                                        className="block w-full h-[340px] object-cover select-none"
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="w-full h-[340px] flex items-center justify-center text-gray-400">
                                        No Photo
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <Row label="Full Name" value={fullName} />
                            <Row label="Work Email" value={profile?.workEmail} />
                            <Row label="Work Phone" value={fmtPhone(profile?.phone)} />
                            <Row label="Medical Licence #" value={profile?.medicalLicenceNumber} />
                            <Row label="Specialty" value={profile?.specialty} />
                            <Row label="Timezone" value={profile?.timezone || 'America/Toronto'} />
                            <Row label="Bio" value={<p className="whitespace-pre-wrap">{profile?.bio}</p>} />
                        </div>
                    </div>
                </Section>

                <Section
                    title="Education"
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/update-doctor-profile')}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white"
                        >
                            <MdEdit className="text-lg" />
                            <span className="text-sm font-medium">Edit Education</span>
                        </button>
                    }
                >
                    {edu.length === 0 ? (
                        <div className="text-gray-500">No education added.</div>
                    ) : (
                        <ul className="space-y-3">
                            {edu.map((e, idx) => (
                                <li key={idx} className="border rounded-lg p-4">
                                    <div className="font-medium">{e?.degree || 'Degree'}</div>
                                    <div className="text-gray-700">{e?.school}</div>
                                    {e?.field && <div className="text-gray-700">{e.field}</div>}
                                    <div className="text-gray-500 text-sm">
                                        {fdate(e?.startDate)} {e?.endDate ? '—' : ''} {fdate(e?.endDate)}
                                    </div>
                                    {e?.description && (
                                        <p className="text-sm mt-2 whitespace-pre-wrap">{e.description}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <Section
                    title="Professional Experience"
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/update-doctor-profile')}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white"
                        >
                            <MdEdit className="text-lg" />
                            <span className="text-sm font-medium">Edit Experience</span>
                        </button>
                    }
                >
                    {exp.length === 0 ? (
                        <div className="text-gray-500">No experience added.</div>
                    ) : (
                        <ul className="space-y-3">
                            {exp.map((x, idx) => (
                                <li key={idx} className="border rounded-lg p-4">
                                    <div className="font-medium">{x?.title || 'Title'}</div>
                                    <div className="text-gray-700">{x?.organization}</div>
                                    <div className="text-gray-500 text-sm">
                                        {fdate(x?.startDate)} {x?.endDate ? '—' : ''} {fdate(x?.endDate)}
                                    </div>
                                    {x?.description && (
                                        <p className="text-sm mt-2 whitespace-pre-wrap">{x.description}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>

                <Section
                    title="Availability (Recurring Weekly)"
                    action={
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/manage-availability')}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white"
                        >
                            <MdEdit className="text-lg" />
                            <span className="text-sm font-medium">Edit Availability</span>
                        </button>
                    }
                >
                    {!availability || !weekly.length ? (
                        <div className="text-gray-500">No availability configured.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {weekly.map((w, idx) => {
                                const fmt = (m) =>
                                    `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
                                const start = Number.isInteger(w.startMinute) ? fmt(w.startMinute) : ''
                                const end = Number.isInteger(w.endMinute) ? fmt(w.endMinute) : ''
                                return (
                                    <div key={idx} className="border rounded-lg p-4">
                                        <div className="font-medium mb-1">{dayName(w.dayOfWeek)}</div>
                                        <div className="text-sm text-gray-600">
                                            {start} — {end}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="mt-4 text-sm text-gray-500">
                        Slot size: {availability?.slotSizeMinutes ?? 30} minutes
                    </div>
                </Section>
            </div>
        </div>
    )
}
