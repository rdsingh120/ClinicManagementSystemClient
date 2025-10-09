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

    const data = await signUpUser(user)
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <form
        action=""
        onSubmit={handleSignUp}
        className="max-w-[500px] mt-[150px] mx-5 sm:mx-auto flex flex-col gap-3 p-5 border border-black "
      >
        <h1 className="text-2xl text-center">Sign Up</h1>
        <p className="text-center mb-5">Sign up to continue</p>
        <select
          name="role"
          value={user.role}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        >
          <option value={''} disabled hidden>
            Please Select
          </option>
          <option value="DOCTOR">I am a doctor</option>
          <option value="PATIENT">I am a patient</option>
        </select>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        />
        <input
          type="email"
          placeholder="Confirm Email"
          name="confirmEmail"
          value={user.confirmEmail}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={user.password}
          onChange={handleUserState}
          className="border border-black px-4 py-2"
        />
        <input
          type="submit"
          value={'Sign Up'}
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer"
        />
        <p className="text-center mt-2">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  )
}
export default SignUpPage
