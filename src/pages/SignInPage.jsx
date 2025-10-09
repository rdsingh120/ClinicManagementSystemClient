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
const {setUser} = useContext(UserContext)

  const handleCredentialsState = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  const handleSignIn = async (e) => {
    e.preventDefault()

    const { success, message, token, userFound } = await signInUser(credentials)
    
    
    if(success) {
      localStorage.setItem('token', token)
      setUser(userFound)
      toast.success(message)
      navigate('/dashboard')
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
          value={credentials.email}
          onChange={handleCredentialsState}
          className="border border-black px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={credentials.password}
          onChange={handleCredentialsState}
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
