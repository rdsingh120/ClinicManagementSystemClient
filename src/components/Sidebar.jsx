import { CgProfile } from 'react-icons/cg'
import { MdEditDocument } from 'react-icons/md'
import { AiOutlineSchedule } from 'react-icons/ai'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { AiFillHome } from 'react-icons/ai';

const NavItem = ({ onClick, active, icon: Icon, text }) => (
  <div
    onClick={onClick}
    className={`rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5 ${active ? 'bg-blue-100' : 'bg-white'
      }`}
  >
    <Icon className="text-xl" />
    <span className="text-lg">{text}</span>
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(UserContext)
  const role = user?.role

  return (
    <div className="w-full md:w-[300px] h-[calc(100vh-100px)] fixed top-[5.9rem] left-0 bg-blue-500 px-5">
      <div className="mt-10 flex flex-col gap-5">

        {role === 'DOCTOR' ? (
          <>
            <NavItem
              onClick={() => navigate('/dashboard/doctor-profile')}
              active={location.pathname.startsWith('/dashboard/doctor-profile')}
              icon={MdEditDocument}
              text="Doctor Profile"
            />
            <NavItem
              onClick={() => navigate('/dashboard/update-doctor-profile')}
              active={location.pathname.startsWith('/dashboard/update-doctor-profile')}
              icon={CgProfile}
              text="Update Profile"
            />
            <NavItem
              onClick={() => navigate('/dashboard/manage-availability')}
              active={location.pathname.startsWith('/dashboard/manage-availability')}
              icon={AiOutlineSchedule}
              text="Manage Availability"
            />
            <NavItem
              onClick={() => navigate('/dashboard/doctor-appointments')}
              active={location.pathname.startsWith('/dashboard/doctor-appointments')}
              icon={AiOutlineSchedule}
              text="My Appointments"
            />
            <NavItem // Nav to Homepage
              onClick={() => navigate('/')}
              active={location.pathname === '/'}
              icon={AiFillHome}
              text="Homepage"
/>
          </>
        ) : (
          <>
            {/* Patient menu (your original options) */}
            <NavItem
              onClick={() => navigate('/dashboard/find-a-doctor')}
              active={location.pathname.startsWith('/dashboard/find-a-doctor')}
              icon={CgProfile}
              text="Find a doctor"
            />
            <NavItem
              onClick={() => navigate('/dashboard/book-appointment')}
              active={location.pathname.startsWith('/dashboard/book-appointment')}
              icon={AiOutlineSchedule}
              text="Book Appointment"
            />
            <NavItem
              onClick={() => navigate('/dashboard/patient-appointments')}
              active={location.pathname.startsWith('/dashboard/patient-appointments')}
              icon={AiOutlineSchedule}
              text="My Appointments"
            />
            <NavItem
              onClick={() => navigate('/dashboard')}
              active={location.pathname === '/dashboard'}
              icon={CgProfile}
              text="Patient Profile"
            />
            <NavItem
              onClick={() => navigate('/dashboard/update-profile')}
              active={location.pathname.startsWith('/dashboard/update-profile')}
              icon={MdEditDocument}
              text="Update Profile"
            />
            <NavItem //Nav to Homepage
              onClick={() => navigate('/')}
              active={location.pathname === '/'}
              icon={AiFillHome}
              text="Homepage"
              />
          </>
        )}

      </div>
    </div>
  )
}

export default Sidebar
