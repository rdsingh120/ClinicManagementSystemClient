// =====================================================
// booking.api.js  (Axios + normalization + safe grouping)
// =====================================================

import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// --- Generic JSON helper (kept compatible) ---
export async function fetchJSON(path, options = {}) {
  try {
    const method = options.method || 'GET';
    const config = {
      url: path,
      method,
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers || {},
    };
    const { data } = await api(config);
    return data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Request failed. Please try again.';
    throw new Error(message);
  }
}

// --- Local formatting helper ---
export function formatLocal(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d)) return '';
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Normalize raw slot data coming from backend.
 * Ensures consistent {startTime,endTime} and filters invalid ones.
 */
export function normalizeSlots(res) {
  const raw =
    Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.slots)
      ? res.slots
      : (res && typeof res === 'object')
      ? Object.values(res)
      : [];

  return raw
    .map((s) => {
      const st = s.startTime ?? s.start ?? s.start_time ?? null;
      const et = s.endTime   ?? s.end   ?? s.end_time   ?? null;

      const sd = st ? new Date(st) : null;
      const ed = et ? new Date(et) : null;

      if (!sd || !ed || isNaN(sd) || isNaN(ed)) return null;

      // Re-emit as ISO for consistency
      return {
        startTime: sd.toISOString(),
        endTime: ed.toISOString(),
      };
    })
    .filter(Boolean);
}

/**
 * Group slots by UTC day.
 * Returns an OBJECT: { 'YYYY-MM-DD': [ {startTime,endTime}, ... ] }
 * (This is what SlotCalendar.jsx expects.)
 */
export function groupSlotsByDay(slots) {
  const out = Object.create(null);

  for (const s of slots || []) {
    // Guard invalid entries
    const sd = new Date(s.startTime ?? s.start);
    const ed = new Date(s.endTime ?? s.end);
    if (isNaN(sd) || isNaN(ed)) continue;

    // UTC day key
    const y = sd.getUTCFullYear();
    const m = String(sd.getUTCMonth() + 1).padStart(2, '0');
    const d = String(sd.getUTCDate()).padStart(2, '0');
    const dayKey = `${y}-${m}-${d}`;

    (out[dayKey] ??= []).push({
      startTime: sd.toISOString(),
      endTime: ed.toISOString(),
    });
  }

  // Sort each day's slots chronologically
  for (const key of Object.keys(out)) {
    out[key].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  return out;
}
