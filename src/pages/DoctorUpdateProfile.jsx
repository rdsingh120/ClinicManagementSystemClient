import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getDoctorProfile, updateDoctorProfile, uploadDoctorPhoto } from '../api/doctor.api'
import { UserContext } from '../context/UserContext'
import { updateUserNames } from '../api/user.api'

const Section = ({ title, children }) => (
    <section className="bg-white rounded-xl shadow p-6 mb-6 overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
    </section>
)

const Input = ({ label, ...props }) => (
    <label className="block mb-3">
        <div className="text-gray-600 mb-1">{label}</div>
        <input className="border border-gray-300 rounded px-3 py-2 w-full" {...props} />
    </label>
)

const Textarea = ({ label, ...props }) => (
    <label className="block mb-3">
        <div className="text-gray-600 mb-1">{label}</div>
        <textarea className="border border-gray-300 rounded px-3 py-2 w-full" rows={4} {...props} />
    </label>
)

const dstr = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '')

const API_ROOT = (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'
const toAbsApi = (u) => (u?.startsWith('http') ? u : `${API_ROOT}${(u || '').replace(/^\/api/, '')}`)

export default function DoctorUpdateProfile() {
    const { user, setUser } = useContext(UserContext)
    const userId = user?._id || user?.id

    const [saving, setSaving] = useState(false)
    const [input, setInput] = useState({
        firstName: '',
        lastName: '',
        workEmail: '',
        phone: '',
        medicalLicenceNumber: '',
        specialty: '',
        timezone: 'America/Toronto',
        bio: '',
        education: [],
        experience: []
    })

    const [photoUrl, setPhotoUrl] = useState(null)
    const [photoSrc, setPhotoSrc] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                const res = await getDoctorProfile()
                if (!res?.success) {
                    toast.error(res?.message || 'Failed to load profile')
                    return
                }
                const doc = res?.doctor || {}
                const basic = res?.basic || {}
                if (mounted) {
                    setInput({
                        firstName: basic.firstName || user?.firstName || '',
                        lastName: basic.lastName || user?.lastName || '',
                        workEmail: doc.workEmail || '',
                        phone: doc.phone || '',
                        medicalLicenceNumber: doc.medicalLicenceNumber || '',
                        specialty: doc.specialty || '',
                        timezone: doc.timezone || 'America/Toronto',
                        bio: doc.bio || '',
                        education: Array.isArray(doc.education) ? doc.education : [],
                        experience: Array.isArray(doc.experience) ? doc.experience : []
                    })
                    setPhotoUrl(doc.photoUrl || null)
                }
            })()
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (!photoUrl || preview) {
            if (photoSrc) URL.revokeObjectURL(photoSrc)
            setPhotoSrc(null)
            return
        }
        let cancelled = false
            ; (async () => {
                try {
                    const resp = await fetch(toAbsApi(photoUrl), {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                        cache: 'no-store'
                    })
                    if (!resp.ok) throw new Error('Photo request failed')
                    const blob = await resp.blob()
                    const url = URL.createObjectURL(blob)
                    if (!cancelled) setPhotoSrc(url)
                    else URL.revokeObjectURL(url)
                } catch {
                    setPhotoSrc(null)
                }
            })()
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photoUrl, preview])

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
            if (photoSrc) URL.revokeObjectURL(photoSrc)
        }
    }, [preview, photoSrc])

    const setField = (e) => setInput(s => ({ ...s, [e.target.name]: e.target.value }))

    // Education handlers
    const addEdu = () =>
        setInput(s => ({
            ...s,
            education: [...s.education, { school: '', degree: '', field: '', startDate: '', endDate: '', description: '' }]
        }))
    const updEdu = (i, k, v) =>
        setInput(s => {
            const arr = s.education.slice()
            arr[i] = { ...arr[i], [k]: v }
            return { ...s, education: arr }
        })
    const delEdu = (i) => setInput(s => ({ ...s, education: s.education.filter((_, idx) => idx !== i) }))

    // Experience handlers
    const addExp = () =>
        setInput(s => ({
            ...s,
            experience: [...s.experience, { organization: '', title: '', startDate: '', endDate: '', description: '' }]
        }))
    const updExp = (i, k, v) =>
        setInput(s => {
            const arr = s.experience.slice()
            arr[i] = { ...arr[i], [k]: v }
            return { ...s, experience: arr }
        })
    const delExp = (i) => setInput(s => ({ ...s, experience: s.experience.filter((_, idx) => idx !== i) }))

    const handlePick = async (file, inputEl) => {
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            inputEl.value = ''
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Max 5MB')
            inputEl.value = ''
            return
        }

        if (preview) URL.revokeObjectURL(preview)
        const localUrl = URL.createObjectURL(file)
        setPreview(localUrl)

        const res = await uploadDoctorPhoto(file)
        if (!res?.success) {
            toast.error(res?.message || 'Upload failed')
            return
        }

        setPhotoUrl(res.photoUrl)
        if (preview) URL.revokeObjectURL(preview)
        setPreview(null)
        toast.success('Photo updated')
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        // 1) Update first/last name on User
        const nameRes = await updateUserNames(userId, {
            firstName: input.firstName || '',
            lastName: input.lastName || ''
        })
        if (!nameRes?.success) {
            setSaving(false)
            toast.error(nameRes?.message || 'Failed to update name')
            return
        }
        setUser(prev => ({
            ...prev,
            firstName: input.firstName || '',
            lastName: input.lastName || ''
        }))

        // 2) Update doctor profile
        const payload = {
            workEmail: input.workEmail || undefined,
            phone: input.phone || undefined,
            medicalLicenceNumber: input.medicalLicenceNumber || undefined,
            specialty: input.specialty || undefined,
            timezone: input.timezone || undefined,
            bio: input.bio || undefined,
            education: input.education.map(e => ({
                school: e.school || '',
                degree: e.degree || '',
                field: e.field || '',
                startDate: e.startDate ? new Date(e.startDate).toISOString() : undefined,
                endDate: e.endDate ? new Date(e.endDate).toISOString() : undefined,
                description: e.description || ''
            })),
            experience: input.experience.map(x => ({
                organization: x.organization || '',
                title: x.title || '',
                startDate: x.startDate ? new Date(x.startDate).toISOString() : undefined,
                endDate: x.endDate ? new Date(x.endDate).toISOString() : undefined,
                description: x.description || ''
            }))
        }

        const res = await updateDoctorProfile(payload)
        setSaving(false)
        if (!res?.success) return toast.error(res?.message || 'Update failed')
        toast.success('Doctor profile updated')
    }

    return (
        <div className="bg-gray-50 flex-1 p-6 overflow-y-auto rounded-tl-2xl">
            <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
                <Section title="Common Information">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                        <div className="w-full md:w-56 lg:w-64 shrink-0">
                            <div className="w-full max-w-[256px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
                                {(preview || photoSrc) ? (
                                    <img
                                        src={preview || photoSrc}
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

                            <label className="inline-flex items-center mt-3 px-4 py-2 rounded-lg border cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0]
                                        handlePick(f, e.target)
                                        e.target.value = ''
                                    }}
                                />
                                Upload new photo
                            </label>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="First Name" name="firstName" value={input.firstName} onChange={setField} />
                                <Input label="Last Name" name="lastName" value={input.lastName} onChange={setField} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Work Email" name="workEmail" type="email" value={input.workEmail} onChange={setField} />
                                <Input label="Work Phone" name="phone" value={input.phone} onChange={setField} />
                                <Input label="Medical Licence #" name="medicalLicenceNumber" value={input.medicalLicenceNumber} onChange={setField} />
                                <Input label="Specialty" name="specialty" value={input.specialty} onChange={setField} />
                                <Input label="Timezone" name="timezone" value={input.timezone} onChange={setField} />
                            </div>
                            <Textarea label="Biography" name="bio" value={input.bio} onChange={setField} />
                        </div>
                    </div>
                </Section>

                <Section title="Education">
                    <div className="space-y-4">
                        {input.education.map((e, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="School" value={e.school || ''} onChange={(ev) => updEdu(idx, 'school', ev.target.value)} />
                                    <Input label="Degree" value={e.degree || ''} onChange={(ev) => updEdu(idx, 'degree', ev.target.value)} />
                                    <Input label="Field" value={e.field || ''} onChange={(ev) => updEdu(idx, 'field', ev.target.value)} />
                                    <Input label="Start Date" type="date" value={dstr(e.startDate)} onChange={(ev) => updEdu(idx, 'startDate', ev.target.value)} />
                                    <Input label="End Date" type="date" value={dstr(e.endDate)} onChange={(ev) => updEdu(idx, 'endDate', ev.target.value)} />
                                </div>
                                <Textarea label="Description" value={e.description || ''} onChange={(ev) => updEdu(idx, 'description', ev.target.value)} />
                                <button type="button" className="mt-3 text-red-600" onClick={() => delEdu(idx)}>Remove</button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addEdu}
                            aria-label="Add Special Day"
                            className="mt-3 h-10 w-10 rounded-lg bg-blue-600/90 hover:bg-blue-600/100 text-white flex items-center justify-center"
                        >
                            <span className="text-2xl leading-none font-bold">+</span>
                        </button>
                    </div>
                </Section>

                <Section title="Professional Experience">
                    <div className="space-y-4">
                        {input.experience.map((x, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Organization" value={x.organization || ''} onChange={(ev) => updExp(idx, 'organization', ev.target.value)} />
                                    <Input label="Title" value={x.title || ''} onChange={(ev) => updExp(idx, 'title', ev.target.value)} />
                                    <Input label="Start Date" type="date" value={dstr(x.startDate)} onChange={(ev) => updExp(idx, 'startDate', ev.target.value)} />
                                    <Input label="End Date" type="date" value={dstr(x.endDate)} onChange={(ev) => updExp(idx, 'endDate', ev.target.value)} />
                                </div>
                                <Textarea label="Description" value={x.description || ''} onChange={(ev) => updExp(idx, 'description', ev.target.value)} />
                                <button type="button" className="mt-3 text-red-600" onClick={() => delExp(idx)}>Remove</button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addExp}
                            aria-label="Add Special Day"
                            className="mt-3 h-10 w-10 rounded-lg bg-blue-600/90 hover:bg-blue-600/100 text-white flex items-center justify-center"
                        >
                            <span className="text-2xl leading-none font-bold">+</span>
                        </button>
                    </div>
                </Section>

                <div className="flex justify-end gap-3">
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
