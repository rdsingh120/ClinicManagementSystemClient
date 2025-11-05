// =====================================================
// DoctorPicker.jsx
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, MOCK_PATIENT_ID } 
  from '../../lib/booking.api';

export function DoctorPicker({ value, onChange, disabled }) {
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [doctors, setDoctors] = useState([])


useEffect(() => {
let mounted = true
setLoading(true); setError(null)
fetchJSON('/users/doctor')
.then((data) => {
if (!mounted) return
setDoctors(data?.data || data || [])
})
.catch((e) => mounted && setError(e.message))
.finally(() => mounted && setLoading(false))
return () => { mounted = false }
}, [])


return (
<div className="space-y-2">
<label className="block text-sm font-medium text-gray-700">Select Doctor</label>
{loading && <div className="text-sm text-gray-500">Loading doctors…</div>}
{error && <div className="text-sm text-red-600">{error}</div>}
<select
className="w-full rounded-lg border px-3 py-2"
value={value || ''}
onChange={(e) => onChange(e.target.value)}
disabled={disabled || loading}
>
<option value="" disabled>
{loading ? 'Loading…' : 'Choose a doctor'}
</option>
{doctors.map((doc) => (
<option key={doc._id} value={doc._id}>
{doc.firstName} {doc.lastName} {doc.doctorProfile?.specialty ? `— ${doc.doctorProfile.specialty}` : ''}
</option>
))}
</select>
</div>
)
}