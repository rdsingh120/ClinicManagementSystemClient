import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { updateUser } from '../api/user.api'
import { UserContext } from '../context/UserContext'

const UpdateProfile = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    healthCardNumber: '',
    dob: '',
    sex: '',
    bloodGroup: '',
    isOrganDonor: false,
  })

  useEffect(() => {
    if (user) {
      const patientProfile = user.patientProfile || {}
      setInput({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: patientProfile.phone || '',
        address: patientProfile.address || '',
        healthCardNumber: patientProfile.healthCardNumber || '',
        dob: patientProfile.dob?.split('T')[0] || '',
        sex: patientProfile.sex || '',
        bloodGroup: patientProfile.bloodGroup || '',
        isOrganDonor: patientProfile.isOrganDonor || false,
      })
    }
  }, [user])

  const handleInputState = (e) => {
    const { name, value, type, checked } = e.target
    setInput((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }
    })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const { success, message, updatedUser } = await updateUser(input, user._id)
    
    if (success) {
      setUser({ ...updatedUser })
      toast.success(message)
      navigate('profile')
    } else toast.error(message)
  }

  return (
    <div className="bg-white flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        action=""
        className="max-w-[600px] mx-auto flex flex-col items-center gap-5 p-5 rounded"
        onSubmit={handleUpdateProfile}
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
          type="text"
          placeholder="Health Card Number"
          name="healthCardNumber"
          value={input.healthCardNumber}
          onChange={handleInputState}
          className="border border-black px-4 py-2 w-full"
        />

        <div className="w-full flex items-end gap-2">
          <input
            type="date"
            name="dob"
            value={input.dob}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full h-[43px]"
          />

          <select
            name="sex"
            value={input.sex}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          >
            <option value="" disabled hidden>
              Sex
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="w-full flex gap-2">
          <select
            name="bloodGroup"
            value={input.bloodGroup}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          >
            <option value="" disabled hidden>
              Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="flex justify-start items-center gap-5 w-full">
          <label htmlFor="">
            In the event of my death, I concent to donate my organs
          </label>
          <input
            type="checkbox"
            checked={input.isOrganDonor}
            onChange={handleInputState}
            name="isOrganDonor"
          />
        </div>

        <input
          type="submit"
          value="Update Profile"
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer w-full"
        />
      </form>
    </div>
  )
}
export default UpdateProfile
