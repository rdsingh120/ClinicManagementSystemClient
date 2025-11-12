import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const signUpUser = async (newUser) => {
  if (
    !newUser.role ||
    !newUser.firstName ||
    !newUser.lastName ||
    !newUser.email ||
    !newUser.confirmEmail ||
    !newUser.password
  ) {
    return {
      success: false,
      message: 'please complete all the fields with valid information',
    }
  }

  if (newUser.email !== newUser.confirmEmail) {
    return {
      success: false,
      message: 'Emails do not match',
    }
  }

  try {
    const payload = {
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
    }

    const { data } = await axios.post(
      `${API_BASE}/signup`,
      payload
    )
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const signInUser = async (credentials) => {
  if (!credentials.email || !credentials.password) {
    return {
      success: false,
      message: 'Enter valid email & password',
    }
  }

  try {
    const { data } = await axios.post(
      `${API_BASE}/signin`,
      credentials
    )
    if (data?.token) localStorage.setItem('token', data.token) // new
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}
export const signOutUser = () => {
  localStorage.removeItem('token')
  return { success: true, message: 'Sign-out successful' }
}

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token')

    const { data } = await axios.get(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const getAllUsers = async (role) => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/users/${role}`
    )
    return data
  } catch (error) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const updateUser = async (updatedProfile, id) => {
  try {
    const payload = {
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
      email: updatedProfile.email,
      patientProfile: {
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        healthCardNumber: updatedProfile.healthCardNumber,
        dob: updatedProfile.dob,
        sex: updatedProfile.sex,
        bloodGroup: updatedProfile.bloodGroup,
        isOrganDonor: updatedProfile.isOrganDonor,
      },
    }

    const { data } = await axios.put(
      `${API_BASE}/user/${id}`,
      payload,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } // new
    )

    return data
  } catch (error) {
    return { success: false, message: error.message }
  }
}

/**
 * Update only firstName/lastName for user with given id
 */
export const updateUserNames = async (id, { firstName, lastName }) => {
  try {
    const { data } = await axios.put(
      `${API_BASE}/user/${id}`,
      { firstName, lastName },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    return data
  } catch (error) {
    return { success: false, message: error.message }
  }
}
