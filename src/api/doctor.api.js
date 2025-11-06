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
