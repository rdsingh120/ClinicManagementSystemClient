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
        const { data } = await axios.get(`${API_ROOT}/users/doctor`, authHeader())
        const users = data?.users || data
        const doctor = Array.isArray(users) ? users.find((u) => u._id === id) : null
        if (!doctor) return { success: false, message: 'Doctor not found' }
        return { success: true, doctor }
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || error.message }
    }
}

// GET /api/doctors/:id/photo
export const getDoctorPhotoById = async (id) => {
    try {
        const { data } = await axios.get(`${API_BASE}/${id}/photo`, {
            ...authHeader(),
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


// NEW — Fetch all doctors (public)
export const getDoctors = async () => {
  try {
    const { data } = await axios.get(`${API_ROOT}/users/doctor`);
    return { success: true, doctors: data.users || [] };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message
    };
  }
};
