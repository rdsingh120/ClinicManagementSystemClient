import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signUpUser } from '../api/user.api'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
  })

  const handleUserState = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value })

  const handleSignUp = async (e) => {
    e.preventDefault()

    const { success, message } = await signUpUser(user)
    if (success) {
      toast.success(message)
      navigate('/signin')
    } else toast.error(message)
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-5 py-12">
  <form
    onSubmit={handleSignUp}
    className="w-full max-w-[500px] bg-white rounded-xl shadow-xl p-8"
  >
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
      <p className="text-gray-500">Sign up to get started</p>
    </div>

    {/* Inputs */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          name="role"
          value={user.role}
          onChange={handleUserState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled hidden>Please Select</option>
          <option value="DOCTOR">Doctor</option>
          <option value="PATIENT">Patient</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            placeholder="John"
            name="firstName"
            value={user.firstName}
            onChange={handleUserState}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            name="lastName"
            value={user.lastName}
            onChange={handleUserState}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          name="email"
          value={user.email}
          onChange={handleUserState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Email</label>
        <input
          type="email"
          placeholder="Confirm your email"
          name="confirmEmail"
          value={user.confirmEmail}
          onChange={handleUserState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          name="password"
          value={user.password}
          onChange={handleUserState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
    >
      Sign Up
    </button>

    {/* Footer */}
    <p className="text-center mt-6 text-gray-600">
      Already have an account?{' '}
      <span
        onClick={() => navigate('/signin')}
        className="text-blue-600 font-semibold cursor-pointer hover:underline"
      >
        Sign In
      </span>
    </p>
  </form>
</div>
  )
}
export default SignUpPage
