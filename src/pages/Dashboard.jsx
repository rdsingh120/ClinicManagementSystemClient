import { useContext, useEffect } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const Dashboard = () => {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) return
    const path = location.pathname.replace(/\/+$/, '')
    const isDashboardRoot = path === '/dashboard'

    if (isDashboardRoot && user.role === 'DOCTOR') {
      navigate('/dashboard/doctor-profile', { replace: true })
    }
    if (user.role === 'DOCTOR' && path === '/dashboard/update-profile') {
      navigate('/dashboard/update-doctor-profile', { replace: true })
    }
  }, [user, location.pathname, navigate])

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User'

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar name={fullName} role={user?.role} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-[300px] overflow-y-auto">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
