import axios from 'axios'

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')) || 'http://localhost:3000/api'

const API_BASE = `${API_ROOT}/doctors`

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

// GET /api/doctors/me/profile
export const getDoctorProfile = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/me/profile`, authHeader())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

// PUT /api/doctors/me/profile
export const updateDoctorProfile = async (profile) => {
    try {
        const { data } = await axios.put(`${API_BASE}/me/profile`, profile, authHeader())
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

// POST /api/doctors/me/profile/photo
export const uploadDoctorPhoto = async (file) => {
    try {
        const fd = new FormData()
        fd.append('photo', file)
        const { data } = await axios.post(
            `${API_BASE}/me/profile/photo`,
            fd,
            {
                headers: {
                    ...authHeader().headers
                }
            }
        )
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}


// GET /api/doctors/:id (public profile)
export const getDoctorPublicProfile = async (id) => {
    try {
        const { data } = await axios.get(`${API_BASE}/${id}`)
        return data
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

// GET /api/doctors/:id/photo (public)
export const getDoctorPhotoById = async (id) => {
    try {
        const { data } = await axios.get(`${API_BASE}/${id}/photo`, {
            responseType: 'blob'
        })
        return { success: true, blob: data }
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

// Helper to construct doctor photo URL with optional versioning
export const makeDoctorPhotoUrl = (id, v) => {
    const ver = v ? `?v=${v}` : ''
    return `${API_BASE}/${id}/photo${ver}`
}

// Search / list doctors for "Find a Doctor" page
// GET /api/doctors/search
export const searchDoctors = async ({ search, specialty, page = 1, limit = 12 } = {}) => {
    try {
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (specialty) params.append('specialty', specialty)
        params.append('page', page)
        params.append('limit', limit)

        const { data } = await axios.get(
            `${API_BASE}/search?${params.toString()}`
        )

        return data
    } catch (err) {
        return {
            success: false,
            message: err?.response?.data?.message || err.message
        }
    }
}

// Optional convenience wrapper to get first page with no filters
export const getDoctors = async () => searchDoctors()
