import axios from 'axios'

const API_ROOT =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, ''))
    || 'http://localhost:3000/api'

const BASE = `${API_ROOT}/testimonials`

const auth = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
})

// GET testimonials for a doctor
export const getDoctorTestimonials = async (doctorId) => {
    try {
        const { data } = await axios.get(`${BASE}/${doctorId}`)
        return data
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            testimonials: []
        }
    }
}

// CREATE or UPDATE testimonial
export const submitTestimonial = async ({ doctorId, rating, comment }) => {
    try {
        const payload = { doctorId, rating, comment }

        const { data } = await axios.post(
            `${BASE}`,
            payload,
            auth()
        )

        return data
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message
        }
    }
}