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

