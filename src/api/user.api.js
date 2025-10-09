import axios from 'axios'

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
      'http://localhost:3000/api/signup',
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
      'http://localhost:3000/api/signin',
      credentials
    )

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
    
    const { data } = await axios.get('http://localhost:3000/api/dashboard', {
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
      `http://localhost:3000/api/user/${id}`,
      payload
    )

    return data
  } catch (error) {
    return { success: false, message: error.message }
  }
}
