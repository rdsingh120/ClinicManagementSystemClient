import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const SignInPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const handleUserState = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value })

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!user.email || !user.password) {
      return toast.error('Enter valid email & password')
    }
    
    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/signin',
        user
      )
      if (data?.success) {
        localStorage.setItem('token', data?.token)
        toast.success(data?.message)
        return navigate('/dashboard');
      }
    } catch (error) {
      return toast.error(error.message)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <form
        action=""
        onSubmit={handleSignIn}
        className="max-w-[500px] mt-[300px] mx-5 sm:mx-auto flex flex-col gap-3 p-5 border border-black "
      >
        <h1 className="text-2xl text-center">Sign In</h1>
        <p className="text-center mb-5">Enter your credentials to continue</p>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
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
          value={'Sign In'}
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer"
        />
        <p className="text-center mt-2">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  )
}
export default SignInPage
