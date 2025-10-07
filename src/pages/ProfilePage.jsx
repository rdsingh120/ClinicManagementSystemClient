import { useState } from "react"
import { useOutletContext } from "react-router-dom"

const ProfilePage = () => {
    const [input, setInput] = useState({})
    const {user} = useOutletContext()

    const handleInputState = (e) =>
      setInput({ ...user, [e.target.name]: e.target.value })
    
  return (
    <div className="bg-white flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <form
        action=""
        className="max-w-[600px] mx-auto flex flex-col items-center gap-5 p-5 rounded"
      >
        <h1 className="text-2xl text-center text-black font-bold">
          Update Your Profile
        </h1>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={user.firstName}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={user.lastName}
            onChange={handleInputState}
            className="border border-black px-4 py-2 w-full"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={user.email}
          onChange={handleInputState}
          className="border border-black px-4 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Health Card Number"
          name="healthCardNumber"
          value=""
          className="border border-black px-4 py-2 w-full"
        />

        <div className="w-full flex items-end gap-2">
          <div className="w-full">
            <label htmlFor="" className="text-lg text-black font-bold">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value=""
              className="border border-black px-4 py-2 w-full h-[43px]"
            />
          </div>

          <div className="w-full">
            <label htmlFor="" className="text-lg text-black font-bold">
              Sex
            </label>
            <select name="sex" className="border border-black px-4 py-2 w-full">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        <div className="w-full flex gap-2">
          <select
            name="bloodGroup"
            className="border border-black px-4 py-2 w-full"
          >
            <option value="" disabled>
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

          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value=""
            className="border border-black px-4 py-2 w-full"
          />
        </div>

        <input
          type="text"
          placeholder="Address"
          name="address"
          value=""
          className="border border-black px-4 py-2 w-full"
        />

        <div className="flex justify-start items-center gap-5 w-full">
          <label htmlFor="">
            In the event of my death, I concent to donate my organs
          </label>
          <input type="checkbox" name="isOrganDonor" id="" />
        </div>

        <input
          type="submit"
          value={'Update Profile'}
          className="bg-blue-500 px-4 py-2 text-white font-medium cursor-pointer w-full"
        />
      </form>
    </div>
  )
}
export default ProfilePage
