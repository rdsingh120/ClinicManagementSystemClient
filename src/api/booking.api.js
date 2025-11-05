import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const MOCK_PATIENT_ID = '66f0b5a0c0ffee1234567890';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// --- Generic JSON helper ---
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
    // Standardized error handling
    const message =
      err.response?.data?.message ||
      err.message ||
      'Request failed. Please try again.';
    throw new Error(message);
  }
}

// --- Local formatting helpers remain the same ---
export function formatLocal(dt) {
  try {
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dt;
  }
}

export function groupSlotsByDay(slots) {
  const map = new Map();
  for (const s of slots) {
    const dayKey = new Date(s.startTime).toISOString().slice(0, 10);
    if (!map.has(dayKey)) map.set(dayKey, []);
    map.get(dayKey).push(s);
  }
  for (const [, arr] of map)
    arr.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  return Array.from(map.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([key, value]) => ({ day: key, slots: value }));
}
