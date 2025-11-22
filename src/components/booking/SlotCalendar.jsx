// =====================================================
// SlotCalendar.jsx (with user-controlled date range)
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { fetchJSON, formatLocal, groupSlotsByDay, normalizeSlots } from '../../api/booking.api';

function toISOStartOfDayUTC(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function parseDateInput(val) {
  // from "YYYY-MM-DD" → Date at local midnight (we’ll convert to 00:00Z later)
  if (!val) return null;
  const [y, m, d] = val.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function toDateInputValue(date) {
  // Date → "YYYY-MM-DD" for <input type="date">
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function SlotCalendar({ doctorId, value, onChange, disabled,refreshKey }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [slots, setSlots]     = useState([]);
  

  // default: today → +7 days
  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );
  const defaultTo = useMemo(() => addDays(defaultFrom, 7), [defaultFrom]);

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate]     = useState(defaultTo);

  // Fetch whenever doctorId or date range changes
  useEffect(() => {
    if (!doctorId) { setSlots([]); return; }

    // Guard invalid range
    if (!fromDate || !toDate || toDate <= fromDate) {
      setError('Invalid date range. "To" must be after "From".');
      setSlots([]);
      return;
    }

    let mounted = true;
    setLoading(true); setError(null); setSlots([]);

    const qs = new URLSearchParams({
      from: toISOStartOfDayUTC(fromDate), // 00:00Z on fromDate
      to:   toISOStartOfDayUTC(toDate),   // 00:00Z on toDate (exclusive)
    }).toString();

    // NOTE: fetchJSON prefixes '/api'
    fetchJSON(`/availability/${doctorId}/slots?${qs}`)
      .then((res) => {
        if (!mounted) return;
        const arr = normalizeSlots(res);
        setSlots(arr);
      })
      .catch((e) => mounted && setError(e.message || 'Failed to load slots'))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [doctorId, fromDate, toDate, refreshKey]);

  // group by day: { 'YYYY-MM-DD': [ ... ] } — safe even if slots is empty
  const groupedObj = useMemo(() => groupSlotsByDay(slots), [slots]);

  // convert to [{ day, slots: [...] }]
  const grouped = useMemo(() => {
    return Object.entries(groupedObj).map(([day, daySlots]) => ({
      day,
      slots: Array.isArray(daySlots) ? daySlots : [],
    }));
  }, [groupedObj]);

  // Quick range helpers
  const setThisWeek = () => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = addDays(start, 7);
    setFromDate(start);
    setToDate(end);
  };
  const setNextWeek = () => {
    const start = addDays(fromDate, 7);
    const end = addDays(toDate, 7);
    setFromDate(start);
    setToDate(end);
  };
  const setPrevWeek = () => {
    const start = addDays(fromDate, -7);
    const end = addDays(toDate, -7);
    setFromDate(start);
    setToDate(end);
  };

  if (!doctorId) {
    return <div className="text-sm text-gray-500">Pick a doctor to view available slots.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Available Slots</label>
          {loading && <span className="ml-2 text-xs text-gray-500">Refreshing…</span>}
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">From</label>
            <input
              type="date"
              className="rounded-md border px-2 py-1 text-sm"
              value={toDateInputValue(fromDate)}
              onChange={(e) => {
                const d = parseDateInput(e.target.value);
                if (d) setFromDate(d);
              }}
              disabled={disabled || loading}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">To</label>
            <input
              type="date"
              className="rounded-md border px-2 py-1 text-sm"
              value={toDateInputValue(toDate)}
              onChange={(e) => {
                const d = parseDateInput(e.target.value);
                if (d) setToDate(d);
              }}
              disabled={disabled || loading}
              min={toDateInputValue(addDays(fromDate, 1))}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={setPrevWeek}
              disabled={disabled || loading}
              title="Previous week"
            >
              ← Prev week
            </button>
            <button
              type="button"
              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={setThisWeek}
              disabled={disabled || loading}
              title="Today → +7 days"
            >
              This week
            </button>
            <button
              type="button"
              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={setNextWeek}
              disabled={disabled || loading}
              title="Next week"
            >
              Next week →
            </button>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {!loading && !error && grouped.length === 0 && (
        <div className="text-sm text-gray-500">No slots available for this range.</div>
      )}

      <div className="space-y-4">
        {grouped.map(({ day, slots }) => (
          <div key={day} className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-semibold">
              {new Date(`${day}T00:00:00`).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {slots.map((s) => {
                const id = `${s.startTime}-${s.endTime}`;
                const selected =
                  value && value.startTime === s.startTime && value.endTime === s.endTime;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(s)}
                    className={`rounded-lg border px-3 py-2 text-sm text-left hover:shadow ${selected ? 'border-blue-600 ring-2 ring-blue-300' : ''}`}
                    title={`${formatLocal(s.startTime)} → ${formatLocal(s.endTime)}`}
                  >
                    <div className="font-medium">
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
