// DoctorPicker.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../../api/booking.api';

export function DoctorPicker({ value, onChange, disabled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true); setError(null);

    fetchJSON('/doctors')
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setDoctors(list);
      })
      .catch((e) => mounted && setError(e.message || 'Failed to load doctors'))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  // Map id -> "First Last"
  const idToName = useMemo(() => {
    const entries = doctors.map(d => [
      String(d?._id),
      `${d?.firstName ?? ''} ${d?.lastName ?? ''}`.trim()
    ]);
    return Object.fromEntries(entries);
  }, [doctors]);

  const hasOptions = doctors && doctors.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select Doctor</label>

      {loading && <div className="text-sm text-gray-500">Loading doctors…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && !hasOptions && (
        <div className="text-sm text-gray-500">No doctors available.</div>
      )}

      <select
        className="w-full rounded-lg border px-3 py-2"
        // supports either a plain id string OR { id, name }
        value={typeof value === 'string' ? value : (value?.id ?? '')}
        onChange={(e) => {
          const id = e.target.value;
          const name = idToName[id] || '';
          // send both so parent can show the name without extra lookups
          onChange?.({ id, name });
        }}
        disabled={disabled || loading || !hasOptions}
      >
        <option value="" disabled>
          {loading ? 'Loading…' : 'Choose a doctor'}
        </option>

        {doctors.map((doc) => {
          const specialty = doc?.doctorProfile?.specialty;
          const label = `${doc?.firstName ?? ''} ${doc?.lastName ?? ''}${specialty ? ` — ${specialty}` : ''}`;
          return (
            <option key={doc._id} value={String(doc._id)}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
