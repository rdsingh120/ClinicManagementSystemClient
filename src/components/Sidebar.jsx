import { CgProfile } from 'react-icons/cg'
import { MdEditDocument } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AiOutlineSchedule } from 'react-icons/ai'

const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <div className="w-full md:w-[300px] h-[calc(100vh-100px)] fixed top-[5.9rem] left-0 bg-blue-500 px-5">
      <div className="mt-10 flex flex-col gap-5">
        <div
          onClick={() => navigate('/dashboard/find-a-doctor')}
          className="bg-white rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5"
        >
          <CgProfile className="text-xl" />
          <span className="text-lg">Find a doctor</span>
        </div>

       <div
          onClick={() => navigate('/dashboard/book-appointment')}
          className="bg-white rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5"
        >
          <AiOutlineSchedule className="text-xl" />
          <span className="text-lg">Book Appointment</span>
        </div>

        <div
          onClick={() => navigate('/dashboard')}
          className="bg-white rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5"
        >
          <CgProfile className="text-xl" />
          <span className="text-lg">Patient Profile</span>
        </div>

        <div
          onClick={() => navigate('/dashboard/update-profile')}
          className="bg-white rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5"
        >
          <MdEditDocument className="text-xl" />
          <span className="text-lg">Update Profile</span>
        </div>
      </div>
    </div>
  )
}
export default Sidebar
