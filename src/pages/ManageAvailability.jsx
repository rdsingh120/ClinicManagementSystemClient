import { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'
import {
    getAvailability,
    upsertAvailability,
    deleteAvailability,
} from '../api/availability.api'
import { toast } from 'react-toastify'

const Section = ({ title, children }) => (
    <section className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
    </section>
)

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// -------- time helpers (minutes <-> HH:mm) --------
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

// IMPORTANT: upper clamp at 1439 so we never render invalid 24:00
const minutesToHHMM = (mins) => {
    if (mins == null || isNaN(mins)) return ''
    const mm = clamp(mins, 0, 1439)
    const h = Math.floor(mm / 60)
    const m = mm % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const hhmmToMinutes = (hhmm) => {
    if (!hhmm) return null
    const m = hhmm.match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return null
    const h = clamp(parseInt(m[1], 10), 0, 23)
    const min = clamp(parseInt(m[2], 10), 0, 59)
    return h * 60 + min
}

// normalize weekly objects from API to minute-based
const toMinuteWeekly = (w) => {
    if (
        Number.isInteger(w?.dayOfWeek) &&
        Number.isInteger(w?.startMinute) &&
        Number.isInteger(w?.endMinute)
    ) {
        return { dayOfWeek: w.dayOfWeek, startMinute: w.startMinute, endMinute: w.endMinute }
    }
    const toMinutesFromAny = (v) => {
        if (v == null) return null
        if (typeof v === 'string' && /^\d{1,2}:\d{2}$/.test(v)) return hhmmToMinutes(v)
        const d = new Date(v)
        if (!isNaN(d)) return d.getHours() * 60 + d.getMinutes()
        return null
    }
    const sm = toMinutesFromAny(w?.start)
    const em = toMinutesFromAny(w?.end)
    if (
        Number.isInteger(w?.dayOfWeek) &&
        Number.isInteger(sm) &&
        Number.isInteger(em) &&
        em > sm
    ) {
        return { dayOfWeek: w.dayOfWeek, startMinute: sm, endMinute: em }
    }
    return null
}

// Local date/time renderers (avoid timezone drift)
const ymd = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}
const timeStr = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
}

// Parse YYYY-MM-DD as a **local** date (prevents date decrement on time change)
const parseLocalDate = (ymdStr) => {
    if (!ymdStr) return new Date()
    const [y, m, d] = ymdStr.split('-').map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
}

export default function ManageAvailability() {
    const { user } = useContext(UserContext)
    const doctorId = user?._id || user?.id

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [slotSizeMinutes, setSlotSizeMinutes] = useState(30)
    const [effectiveFrom, setEffectiveFrom] = useState('')
    const [effectiveTo, setEffectiveTo] = useState('')

    // weekly is always minutes-based here
    const [weekly, setWeekly] = useState([]) // [{ dayOfWeek, startMinute, endMinute }]
    const [blackouts, setBlackouts] = useState([]) // [{ start ISO, end ISO }]
    const [dateWindows, setDateWindows] = useState([]) // [{ start ISO, end ISO }]

    useEffect(() => {
        if (!doctorId) return
        let mounted = true
            ; (async () => {
                try {
                    const res = await getAvailability(doctorId)
                    const av = res?.availability
                    if (av && mounted) {
                        const wk = Array.isArray(av.weekly) ? av.weekly.map(toMinuteWeekly).filter(Boolean) : []
                        setWeekly(wk)
                        setBlackouts(Array.isArray(av.blackoutWindows) ? av.blackoutWindows : [])
                        setDateWindows(Array.isArray(av.dateWindows) ? av.dateWindows : [])
                        setSlotSizeMinutes(av.slotSizeMinutes ?? 30)
                        setEffectiveFrom(ymd(av.effectiveFrom) || '')
                        setEffectiveTo(ymd(av.effectiveTo) || '')
                    }
                } catch {
                    // no availability yet — keep defaults
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => { mounted = false }
    }, [doctorId])

    const selectedDays = useMemo(() => new Set(weekly.map(w => w.dayOfWeek)), [weekly])

    const toggleDay = (d) => {
        setWeekly((prev) => {
            const exists = prev.find(w => w.dayOfWeek === d)
            if (exists) return prev.filter(w => w.dayOfWeek !== d)
            return [...prev, { dayOfWeek: d, startMinute: 9 * 60, endMinute: 17 * 60 }]
        })
    }

    // FIX: Do not auto-adjust the counterpart field. Only update the one that was changed.
    const setDayTime = (d, which, hhmm) => {
        setWeekly((prev) =>
            prev.map((w) => {
                if (w.dayOfWeek !== d) return w
                const mins = hhmmToMinutes(hhmm)
                if (mins == null) return w
                if (which === 'start') {
                    return { ...w, startMinute: mins }
                } else {
                    return { ...w, endMinute: mins }
                }
            })
        )
    }

    // blackout windows
    const removeBlackout = (i) => setBlackouts((b) => b.filter((_, idx) => idx !== i))
    const addBlackout = () =>
        setBlackouts((b) => [...b, { start: new Date().toISOString(), end: new Date().toISOString() }])

    const setBlackout = (i, k, dateStrValue, timeStrHHMM) => {
        const [h, m] = (timeStrHHMM || '00:00').split(':').map(Number)
        const base = parseLocalDate(dateStrValue) // local date to prevent drift
        const local = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h || 0, m || 0, 0, 0)
        const iso = local.toISOString()
        setBlackouts((b) => {
            const arr = b.slice()
            arr[i] = { ...arr[i], [k]: iso }
            return arr
        })
    }

    // dateWindows (Special Day Hours)
    const removeDateWindow = (i) => setDateWindows((d) => d.filter((_, idx) => idx !== i))
    const addDateWindow = () =>
        setDateWindows((d) => [...d, { start: new Date().toISOString(), end: new Date().toISOString() }])

    const setDateWindow = (i, k, dateStrValue, timeStrHHMM) => {
        const [h, m] = (timeStrHHMM || '00:00').split(':').map(Number)
        const base = parseLocalDate(dateStrValue) // local date to prevent drift
        const local = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h || 0, m || 0, 0, 0)
        const iso = local.toISOString()
        setDateWindows((d) => {
            const arr = d.slice()
            arr[i] = { ...arr[i], [k]: iso }
            return arr
        })
    }

    const onSave = async () => {
        if (!doctorId) return
        setSaving(true)
        try {
            const payload = {
                slotSizeMinutes: Number(slotSizeMinutes) || 30,
                effectiveFrom: effectiveFrom || undefined,
                effectiveTo: effectiveTo || undefined,
                weekly,
                blackoutWindows: blackouts,
                dateWindows,
            }
            const res = await upsertAvailability(doctorId, payload)
            if (!res?.success) toast.error(res?.message || 'Failed to save availability')
            else toast.success('Availability saved')
        } catch {
            toast.error('Failed to save availability')
        } finally {
            setSaving(false)
        }
    }

    const onDelete = async () => {
        if (!doctorId) return
        if (!confirm('Delete your availability configuration?')) return
        try {
            const res = await deleteAvailability(doctorId)
            if (res?.success) {
                setWeekly([])
                setBlackouts([])
                setDateWindows([])
                setSlotSizeMinutes(30)
                setEffectiveFrom('')
                setEffectiveTo('')
                toast.success('Availability deleted')
            } else {
                toast.error(res?.message || 'Delete failed')
            }
        } catch {
            toast.error('Delete failed')
        }
    }

    if (loading) return <div className="flex-1 p-6">Loading...</div>

    return (
        <div className="bg-gray-50 w-full p-6 overflow-y-auto rounded-tl-2xl max-w-4xl mx-auto">
            <Section title="Weekly Availability">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {dayNames.map((name, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => toggleDay(idx)}
                            className={`rounded px-3 py-2 border ${selectedDays.has(idx)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {weekly
                        .slice()
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                        .map((w, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="font-medium mb-2">{dayNames[w.dayOfWeek]}</div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <label className="block">
                                        <div className="text-gray-600 mb-1">Start</div>
                                        <input
                                            type="time"
                                            className="border rounded px-2 py-2 w-full"
                                            value={minutesToHHMM(w.startMinute)}
                                            onChange={(e) => setDayTime(w.dayOfWeek, 'start', e.target.value)}
                                        />
                                    </label>
                                    <label className="block">
                                        <div className="text-gray-600 mb-1">End</div>
                                        <input
                                            type="time"
                                            className="border rounded px-2 py-2 w-full"
                                            value={minutesToHHMM(w.endMinute)}
                                            onChange={(e) => setDayTime(w.dayOfWeek, 'end', e.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                </div>
            </Section>

            {/* Special Day Hours (dateWindows) */}
            <Section title="Special Day Hours">
                <div className="space-y-4">
                    {dateWindows.map((dw, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                            <div className="grid sm:grid-cols-4 gap-3">
                                <label className="block">
                                    <div className="text-gray-600 mb-1">Start Date</div>
                                    <input
                                        type="date"
                                        className="border rounded px-2 py-2 w-full"
                                        value={ymd(dw.start)}
                                        onChange={(e) =>
                                            setDateWindow(idx, 'start', e.target.value, timeStr(dw.start) || '00:00')
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">Start Time</div>
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-2 w-full"
                                        value={timeStr(dw.start)}
                                        onChange={(e) =>
                                            setDateWindow(
                                                idx,
                                                'start',
                                                ymd(dw.start) || new Date().toISOString().slice(0, 10),
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">End Date</div>
                                    <input
                                        type="date"
                                        className="border rounded px-2 py-2 w-full"
                                        value={ymd(dw.end)}
                                        onChange={(e) =>
                                            setDateWindow(idx, 'end', e.target.value, timeStr(dw.end) || '23:59')
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">End Time</div>
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-2 w-full"
                                        value={timeStr(dw.end)}
                                        onChange={(e) =>
                                            setDateWindow(
                                                idx,
                                                'end',
                                                ymd(dw.end) || new Date().toISOString().slice(0, 10),
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <button type="button" className="mt-3 text-red-600" onClick={() => removeDateWindow(idx)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addDateWindow}
                    aria-label="Add Special Day"
                    className="mt-3 h-10 w-10 rounded-lg bg-blue-600/90 hover:bg-blue-600/100 text-white flex items-center justify-center"
                >
                    <span className="text-2xl leading-none font-bold">+</span>
                </button>
            </Section>

            <Section title="Blackout Windows">
                <div className="space-y-4">
                    {blackouts.map((b, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                            <div className="grid sm:grid-cols-4 gap-3">
                                <label className="block">
                                    <div className="text-gray-600 mb-1">Start Date</div>
                                    <input
                                        type="date"
                                        className="border rounded px-2 py-2 w-full"
                                        value={ymd(b.start)}
                                        onChange={(e) =>
                                            setBlackout(idx, 'start', e.target.value, timeStr(b.start) || '00:00')
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">Start Time</div>
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-2 w-full"
                                        value={timeStr(b.start)}
                                        onChange={(e) =>
                                            setBlackout(
                                                idx,
                                                'start',
                                                ymd(b.start) || new Date().toISOString().slice(0, 10),
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">End Date</div>
                                    <input
                                        type="date"
                                        className="border rounded px-2 py-2 w-full"
                                        value={ymd(b.end)}
                                        onChange={(e) =>
                                            setBlackout(idx, 'end', e.target.value, timeStr(b.end) || '23:59')
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <div className="text-gray-600 mb-1">End Time</div>
                                    <input
                                        type="time"
                                        className="border rounded px-2 py-2 w-full"
                                        value={timeStr(b.end)}
                                        onChange={(e) =>
                                            setBlackout(
                                                idx,
                                                'end',
                                                ymd(b.end) || new Date().toISOString().slice(0, 10),
                                                e.target.value
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <button type="button" className="mt-3 text-red-600" onClick={() => removeBlackout(idx)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addBlackout}
                    aria-label="Add Special Day"
                    className="mt-3 h-10 w-10 rounded-lg bg-blue-600/90 hover:bg-blue-600/100 text-white flex items-center justify-center"
                >
                    <span className="text-2xl leading-none font-bold">+</span>
                </button>
            </Section>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onDelete}
                    className="px-4 py-2 rounded border border-red-600 text-red-600"
                >
                    Delete Availability
                </button>
                <button
                    type="button"
                    disabled={saving}
                    onClick={onSave}
                    className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    )
}
