// =====================================================
// ConfirmationModal.jsx
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, MOCK_PATIENT_ID } 
  from '../../lib/booking.api';

export function ConfirmationModal({ open, onClose, result }) {
  if (!open) return null

  const confirmationCode = result?.confirmationCode || result?.data?.confirmationCode
  const appt = result?.appointment || result?.data?.appointment || result

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold">Appointment {confirmationCode ? 'Confirmed' : 'Created'}</h2>
        <p className="text-sm text-gray-700">
          {confirmationCode
            ? 'Your confirmation code is shown below. You will also receive it via email/SMS if configured.'
            : 'Your appointment has been created. (If confirmation is required, it will be processed shortly.)'}
        </p>

        <div className="my-4 rounded-lg border p-3">
          <div className="text-sm">
            <div><span className="font-medium">When:</span> {appt?.startTime ? `${formatLocal(appt.startTime)} → ${formatLocal(appt.endTime)}` : '—'}</div>
            <div><span className="font-medium">Doctor:</span> {appt?.doctor?.firstName ? `${appt?.doctor?.firstName} ${appt?.doctor?.lastName}` : appt?.doctorId || '—'}</div>
            {confirmationCode && (
              <div className="mt-1"><span className="font-medium">Confirmation Code:</span> <code className="rounded bg-gray-100 px-2 py-1">{confirmationCode}</code></div>
            )}
            {appt?.status && (
              <div className="mt-1"><span className="font-medium">Status:</span> {appt.status}</div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2">Close</button>
        </div>
      </div>
    </div>
  )
}
