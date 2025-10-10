import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'

const Profile = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white flex flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      <div className="flex flex-col items-start gap-5 p-10 pr-20 border-r-2 border-gray-300 h-fit">
        <img
          src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          className="w-40 h-40 rounded-full border border-black"
          alt=""
        />
        <h1 className="text-2xl">
          {user?.firstName} {user?.lastName}
        </h1>
        <div className="flex flex-col gap-1 text-gray-600">
          <h3>{user?.email}</h3>
          <h3>{user?.patientProfile?.phone}</h3>
          <h3>{user?.patientProfile?.address}</h3>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            navigate('update-profile')
          }}
          className="bg-blue-500 text-white px-4 py-1 text-lg"
        >
          Edit profile
        </button>
      </div>
      <div className="flex-1 p-10">
        <div className="flex gap-40 mb-16">
          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Sex</span>
            <span className="text-lg">{user?.patientProfile?.sex}</span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Date of Birth</span>
            <span className="text-lg">
              {user?.patientProfile?.dob?.split('T')[0]}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Blood Group</span>
            <span className="text-lg">{user?.patientProfile?.bloodGroup}</span>
          </div>
        </div>

        <div className="flex gap-40">
          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Status</span>
            <span className="text-lg">
              {user?.isProfileActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Organ Donor</span>
            <span className="text-lg">
              {user?.patientProfile?.isOrganDonor ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-gray-500">Health Card Number</span>
            <span className="text-lg">
              {user?.patientProfile?.healthCardNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile
