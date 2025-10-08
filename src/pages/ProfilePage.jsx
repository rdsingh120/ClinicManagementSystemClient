import axios from 'axios'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  })
  const { user } = useOutletContext()
  useEffect(() => {
    if (user) {
      const profile = user.patientProfile || {}
      setInput({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
  }, [user])

  const handleInputState = (e) => {
    const { name, value } = e.target
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const payload = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      patientProfile: {
        ...(user.patientProfile || {}),
        phone: input.phone,
        address: input.address,
      },
    }
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/user/${user._id}`,
        payload
      )
      return toast.success(data.message)
    } catch (error) {
      return toast.error(error.message)
    }
  }

  return (
    <div className="bg-white flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        action=""
        className="max-w-[600px] mx-auto flex flex-col items-center gap-5 p-5 rounded"
        onSubmit={updateProfile}
      >
        <h1 className="text-2xl text-center text-black font-bold">
          Update Your Profile
        </h1>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={input.firstName}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={input.lastName}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />
        </div>

        <div className="flex gap-2 w-full">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={input.phone}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          name="address"
          value={input.address}
          onChange={handleInputState}
          className="border border-black px-4 py-2 w-full"
        />

        <input
          type="submit"
          value="Update Profile"
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer w-full"
        />
      </form>
    </div>
  )
}
export default ProfilePage
