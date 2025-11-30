import { CgProfile } from 'react-icons/cg'
import { MdEditDocument } from 'react-icons/md'
import { AiOutlineSchedule } from 'react-icons/ai'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { AiFillHome } from 'react-icons/ai'
import { IoChevronForward } from 'react-icons/io5'

const NavItem = ({ onClick, active, icon: Icon, text }) => (
  <div
    onClick={onClick}
    className={`rounded-lg px-4 py-3 cursor-pointer flex items-center justify-between group transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    <div className="flex items-center gap-4">
      <Icon className="text-xl" />
      <span className="text-base font-medium">{text}</span>
    </div>
    <IoChevronForward className={`text-lg transition-transform ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
  </div>
)

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(UserContext)
  const role = user?.role

  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length === 0) return 'Home'
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="w-[300px] h-[calc(100vh-100px)] fixed top-[5.9rem] left-0 bg-blue-500 px-5 flex flex-col">
      
      {/* Divider */}
      <div className="border-t border-blue-400 mb-6"></div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-3">
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
            <NavItem
              onClick={() => navigate('/')}
              active={location.pathname === '/'}
              icon={AiFillHome}
              text="Homepage"
            />
          </>
        ) : (
          <>
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
            <NavItem
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