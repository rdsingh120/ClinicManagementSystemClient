// src/api/availability.js
import axios from 'axios'

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'
const BASE = `${API_ROOT}/availability`

const auth = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

/* ---------------------------
   Helpers
--------------------------- */

// minutes from a JS Date in local time
const minutesFromDate = (d) => d.getHours() * 60 + d.getMinutes()

// minutes from an ISO string or Date or "HH:mm" string
const toMinutes = (v) => {
    if (!v) return null
    if (typeof v === 'string') {
        // HH:mm?
        const m = v.match(/^(\d{1,2}):(\d{2})$/)
        if (m) {
            const hh = Math.max(0, Math.min(23, parseInt(m[1], 10)))
            const mm = Math.max(0, Math.min(59, parseInt(m[2], 10)))
            return hh * 60 + mm
        }
        // ISO string
        const d = new Date(v)
        if (!isNaN(d)) return minutesFromDate(d)
        return null
    }
    if (v instanceof Date) return minutesFromDate(v)
    if (Number.isInteger(v)) return v
    return null
}

// Normalize `weekly` entries into { dayOfWeek, startMinute, endMinute }
const normalizeWeekly = (weeklyArr) => {
    if (!Array.isArray(weeklyArr)) return []
    return weeklyArr
        .map((w) => {
            // already in minute form?
            if (
                Number.isInteger(w?.dayOfWeek) &&
                Number.isInteger(w?.startMinute) &&
                Number.isInteger(w?.endMinute)
            ) {
                return {
                    dayOfWeek: w.dayOfWeek,
                    startMinute: w.startMinute,
                    endMinute: w.endMinute
                }
            }

            // allow { start, end } as ISO/Date/HH:mm
            const startMinute = toMinutes(w?.start)
            const endMinute = toMinutes(w?.end)
            if (
                Number.isInteger(w?.dayOfWeek) &&
                Number.isInteger(startMinute) &&
                Number.isInteger(endMinute)
            ) {
                return {
                    dayOfWeek: w.dayOfWeek,
                    startMinute,
                    endMinute
                }
            }
            // if invalid, drop it
            return null
        })
        .filter(Boolean)
}

// Normalize blackout/date windows: ensure ISO strings
const normalizeWindows = (arr) => {
    if (!Array.isArray(arr)) return []
    return arr
        .map((w) => {
            const s = w?.start ? new Date(w.start) : null
            const e = w?.end ? new Date(w.end) : null
            if (s && !isNaN(s) && e && !isNaN(e) && e > s) {
                return { start: s.toISOString(), end: e.toISOString() }
            }
            return null
        })
        .filter(Boolean)
}

const isoOrNull = (d) => (d ? new Date(d).toISOString() : undefined)

/* ---------------------------
   API Calls
--------------------------- */

export const getAvailability = async (doctorId) => {
    try {
        const { data } = await axios.get(`${BASE}/${doctorId}`, auth())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

/**
 * Upsert full availability document
 * payload supports:
 *  - weekly: [{ dayOfWeek, startMinute, endMinute }] OR [{ dayOfWeek, start, end }]
 *  - blackoutWindows: [{ start, end }]
 *  - dateWindows: [{ start, end }]
 *  - slotSizeMinutes: number
 *  - bufferMinutes: number
 *  - effectiveFrom: date
 *  - effectiveTo: date
 */
export const upsertAvailability = async (doctorId, payload = {}) => {
    try {
        const body = {
            ...payload,
            weekly: normalizeWeekly(payload.weekly),
            blackoutWindows: normalizeWindows(payload.blackoutWindows),
            dateWindows: normalizeWindows(payload.dateWindows),
            effectiveFrom: isoOrNull(payload.effectiveFrom),
            effectiveTo: isoOrNull(payload.effectiveTo)
        }
        const { data } = await axios.put(`${BASE}/${doctorId}`, body, auth())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

/**
 * Patch subset of fields. You can pass the same shapes as upsert.
 */
export const patchAvailability = async (doctorId, payload = {}) => {
    try {
        const body = { ...payload }
        if ('weekly' in payload) body.weekly = normalizeWeekly(payload.weekly)
        if ('blackoutWindows' in payload) body.blackoutWindows = normalizeWindows(payload.blackoutWindows)
        if ('dateWindows' in payload) body.dateWindows = normalizeWindows(payload.dateWindows)
        if ('effectiveFrom' in payload) body.effectiveFrom = isoOrNull(payload.effectiveFrom)
        if ('effectiveTo' in payload) body.effectiveTo = isoOrNull(payload.effectiveTo)

        const { data } = await axios.patch(`${BASE}/${doctorId}`, body, auth())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

export const deleteAvailability = async (doctorId) => {
    try {
        const { data } = await axios.delete(`${BASE}/${doctorId}`, auth())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

/**
 * Get available slots
 * @param {string} doctorId
 * @param {object} params { from, to, slotSizeMinutes?, bufferMinutes? }
 *   - from, to can be Date|string and will be ISO-serialized
 */
export const getAvailableSlots = async (doctorId, params) => {
    try {
        const query = {
            from: isoOrNull(params?.from) || params?.from, // already ISO? ok
            to: isoOrNull(params?.to) || params?.to,
            ...(params?.slotSizeMinutes != null ? { slotSizeMinutes: params.slotSizeMinutes } : {}),
            ...(params?.bufferMinutes != null ? { bufferMinutes: params.bufferMinutes } : {})
        }
        const { data } = await axios.get(`${BASE}/${doctorId}/slots`, {
            ...auth(),
            params: query
        })
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}
