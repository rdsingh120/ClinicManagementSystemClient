
// =====================================================
// BookingForm.jsx
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, MOCK_PATIENT_ID } 
  from '../../api/booking.api'
;
  
export function BookingForm({ patientId = MOCK_PATIENT_ID, doctorId, slot, onBooked, disabled }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const canSubmit = Boolean(patientId && doctorId && slot && !loading)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true); setError(null)
    try {
      const payload = {
        patientId,
        doctorId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        notes: notes?.trim() || undefined,
      }
      const result = await fetchJSON('/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      onBooked?.(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes for doctor (optional)</label>
        <textarea
          className="mt-1 w-full resize-y rounded-lg border px-3 py-2"
          rows={4}
          placeholder="Brief reason for visit, symptoms, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full rounded-lg px-4 py-2 font-medium text-white ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {loading ? 'Booking…' : 'Book Appointment'}
      </button>

      <div className="text-xs text-gray-500">
        Submitting: {doctorId ? 'Doctor selected' : '—'} • {slot ? `${formatLocal(slot.startTime)} → ${formatLocal(slot.endTime)}` : 'No slot chosen'}
      </div>
    </form>
  )
}

