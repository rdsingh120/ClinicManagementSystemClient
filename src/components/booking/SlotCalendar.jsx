// =====================================================
// SlotCalendar.jsx
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, MOCK_PATIENT_ID } 
  from '../../api/booking.api';
  
export function SlotCalendar({ doctorId, value, onChange, disabled }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [slots, setSlots] = useState([])

  useEffect(() => {
    if (!doctorId) return
    let mounted = true
    setLoading(true); setError(null); setSlots([])
    fetchJSON(`/availability/${doctorId}/slots`)
      .then((data) => {
        if (!mounted) return
        // Expecting data like [{ startTime, endTime }]
        const arr = data?.data || data || []
        setSlots(arr)
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [doctorId])

  const grouped = useMemo(() => groupSlotsByDay(slots), [slots])

  if (!doctorId) {
    return <div className="text-sm text-gray-500">Pick a doctor to view available slots.</div>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Available Slots</label>
        {loading && <span className="text-xs text-gray-500">Refreshing…</span>}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {grouped.length === 0 && !loading && (
        <div className="text-sm text-gray-500">No slots available.</div>
      )}

      <div className="space-y-4">
        {grouped.map(({ day, slots }) => (
          <div key={day} className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-semibold">
              {new Date(day + 'T00:00:00Z').toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {slots.map((s) => {
                const id = `${s.startTime}-${s.endTime}`
                const selected = value && value.startTime === s.startTime && value.endTime === s.endTime
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(s)}
                    className={`rounded-lg border px-3 py-2 text-sm text-left hover:shadow ${selected ? 'border-blue-600 ring-2 ring-blue-300' : ''}`}
                    title={`${formatLocal(s.startTime)} → ${formatLocal(s.endTime)}`}
                  >
                    <div className="font-medium">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs text-gray-500">{new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
