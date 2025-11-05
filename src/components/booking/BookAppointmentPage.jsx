// =====================================================
// BookAppointmentPage.jsx (Default Export)
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, MOCK_PATIENT_ID } 
  from '../../api/booking.api';
  
export default function BookAppointmentPage() {
  const [doctorId, setDoctorId] = useState('')
  const [slot, setSlot] = useState(null)
  const [bookingResult, setBookingResult] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  function resetAfterClose() {
    setModalOpen(false)
    // keep doctor selection for convenience, but clear slot
    setSlot(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Book an Appointment</h1>
        <p className="text-sm text-gray-600">Select a doctor, pick a time, add notes, and confirm.</p>
      </header>

      {/* Step 1: Doctor */}
      <section className="rounded-2xl border p-4">
        <DoctorPicker value={doctorId} onChange={setDoctorId} />
      </section>

      {/* Step 2: Slots */}
      <section className="rounded-2xl border p-4">
        <SlotCalendar
          doctorId={doctorId}
          value={slot}
          onChange={setSlot}
          disabled={!doctorId}
        />
      </section>

      {/* Step 3: Notes & Book */}
      <section className="rounded-2xl border p-4">
        <div className="mb-3 text-sm text-gray-700">
          <div><span className="font-semibold">Selected doctor:</span> {doctorId || '—'}</div>
          <div><span className="font-semibold">Selected slot:</span> {slot ? `${formatLocal(slot.startTime)} → ${formatLocal(slot.endTime)}` : '—'}</div>
        </div>
        <BookingForm
          doctorId={doctorId}
          slot={slot}
          onBooked={(result) => { setBookingResult(result); setModalOpen(true) }}
          disabled={!doctorId || !slot}
        />
      </section>

      <ConfirmationModal
        open={modalOpen}
        onClose={resetAfterClose}
        result={bookingResult}
      />

      <footer className="pt-2 text-xs text-gray-500">
        * Times shown in your local timezone. Backend stores UTC ISO strings.
      </footer>
    </div>
  )
}
