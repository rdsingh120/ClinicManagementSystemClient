import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

const MedicalDetails = () => {
  const [input, setInput] = useState({
    healthCardNumber: '',
    dob: '',
    sex: '',
    bloodGroup: '',
    organDonar: false,
  })
  const { user } = useOutletContext()

  useEffect(() => {
    if (user) {
      const patientProfile = user.patientProfile || {}
      setInput({
        healthCardNumber: patientProfile.healthCardNumber || '',
        dob: patientProfile.dob || '',
        sex: patientProfile.sex || '',
        bloodGroup: patientProfile.bloodGroup || '',
        organDonar: patientProfile.organDonar || false,
      })
    }
  }, [user])

  const handleInputState = (e) => {
    const { name, value, type, checked } = e.target
    setInput((prev) => {
      return { ...prev, [name]: type == 'checkbox' ? checked : value }
    })
  }

  return (
    <div className="bg-white flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        action=""
        className="max-w-[600px] mx-auto flex flex-col items-center gap-5 p-5 rounded"
      >
        <h1 className="text-2xl text-center text-black font-bold">
          Update Your Profile
        </h1>
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
            checked={input.organDonar}
            onChange={handleInputState}
            name="isOrganDonor"
            id=""
          />
        </div>
        <input
          type="submit"
          value={'Update medical details'}
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer w-full"
        />
      </form>
    </div>
  )
}
export default MedicalDetails
