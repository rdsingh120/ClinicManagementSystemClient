import axios from 'axios'
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  signUpUser: async (newUser) => {
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

      await axios.post('http://localhost:3000/api/signup', payload)
      return {
        success: true,
        message: 'Sign-up successful',
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  },
}))
