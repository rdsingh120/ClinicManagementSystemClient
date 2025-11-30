import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInUser } from '../api/user.api'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'

const SignInPage = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const { setUser } = useContext(UserContext)

  const handleCredentialsState = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  const handleSignIn = async (e) => {
    e.preventDefault()

    try {
      const { success, message, token, userFound } = await signInUser(credentials)

      // validate API response and show error if failed
      if (!success || !token || !userFound) {
        toast.error(message || 'Sign in failed')
        return
      }

      // persist session and hydrate user context
      localStorage.setItem('token', token)
      setUser(userFound)

      toast.success(message)
      window.location.href = "/"; // Redirect to homepage once signed in
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Sign in failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-5">
  <form
    onSubmit={handleSignIn}
    className="w-full max-w-[500px] bg-white rounded-xl shadow-xl p-8"
  >
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
      <p className="text-gray-500">Enter your credentials to continue</p>
    </div>

    {/* Inputs */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          name="email"
          value={credentials.email}
          onChange={handleCredentialsState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          autoComplete="username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={credentials.password}
          onChange={handleCredentialsState}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          autoComplete="current-password"
        />
      </div>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
    >
      Sign In
    </button>

    {/* Footer */}
    <p className="text-center mt-6 text-gray-600">
      Don't have an account?{' '}
      <span
        onClick={() => navigate('/signup')}
        className="text-blue-600 font-semibold cursor-pointer hover:underline"
      >
        Create one
      </span>
    </p>
  </form>
</div>
  )
}
export default SignInPage
