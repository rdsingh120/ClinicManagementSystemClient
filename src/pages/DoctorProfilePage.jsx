import { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { getDoctorProfile } from '../api/doctor.api'
import { getAvailability } from '../api/availability.api'
import { toast } from 'react-toastify'

const Section = ({ title, children }) => (
    <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
    </section>
)

const Row = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="sm:w-60 text-gray-600">{label}</div>
        <div className="flex-1">{value ?? <span className="text-gray-400">—</span>}</div>
    </div>
)

const fdate = (v) => (v ? new Date(v).toLocaleDateString() : '')
const dayName = (n) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n]

export default function DoctorProfilePage() {
    const { user } = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const [availability, setAvailability] = useState(null)
    const doctorId = user?._id || user?.id

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const res = await getDoctorProfile()
                if (!res?.success) return toast.error(res?.message || 'Failed to load profile')
                if (mounted) setProfile(res.doctor || {})
            })()
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (!doctorId) return
        let mounted = true
            ; (async () => {
                try {
                    const res = await getAvailability(doctorId)
                    if (mounted) setAvailability(res?.availability || null)
                } catch { }
            })()
        return () => { mounted = false }
    }, [doctorId])

    const edu = profile?.education || []
    const exp = profile?.experience || []
    const weekly = useMemo(
        () => (availability?.weekly || []).slice().sort((a, b) => a.dayOfWeek - b.dayOfWeek),
        [availability]
    )

    if (!profile) return <div className="flex-1 p-6">Loading...</div>

    return (
        <div className="bg-gray-50 flex-1 p-6 overflow-y-auto rounded-tl-2xl">
            <Section title="Common Information">
                <Row label="Full Name" value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()} />
                <Row label="Email" value={user?.email} />
                <Row label="Phone" value={profile?.phone} />
                <Row label="Medical Licence #" value={profile?.medicalLicenceNumber} />
                <Row label="Specialty" value={profile?.specialty} />
                <Row label="Timezone" value={profile?.timezone || 'America/Toronto'} />
                <Row label="Bio" value={<p className="whitespace-pre-wrap">{profile?.bio}</p>} />
            </Section>

            <Section title="Education">
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
                                {e?.description && <p className="text-sm mt-2 whitespace-pre-wrap">{e.description}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <Section title="Professional Experience">
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
                                {x?.description && <p className="text-sm mt-2 whitespace-pre-wrap">{x.description}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </Section>

            <Section title="Availability (Weekly)">
                {!availability || !weekly.length ? (
                    <div className="text-gray-500">No availability configured.</div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {weekly.map((w, idx) => {
                            // support either minute-based or start/end ISO coming back
                            const start =
                                Number.isInteger(w.startMinute)
                                    ? `${String(Math.floor(w.startMinute / 60)).padStart(2, '0')}:${String(w.startMinute % 60).padStart(2, '0')}`
                                    : new Date(w.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            const end =
                                Number.isInteger(w.endMinute)
                                    ? `${String(Math.floor(w.endMinute / 60)).padStart(2, '0')}:${String(w.endMinute % 60).padStart(2, '0')}`
                                    : new Date(w.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            return (
                                <div key={idx} className="border rounded-lg p-4">
                                    <div className="font-medium mb-1">{dayName(w.dayOfWeek)}</div>
                                    <div className="text-sm text-gray-600">{start} — {end}</div>
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
    )
}
