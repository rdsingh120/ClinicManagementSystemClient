import { useContext } from 'react'
import Footer from '../components/footer'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import { Outlet } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
const Dashboard = () => {
  const { user } = useContext(UserContext)
  
  const fullName = `${user?.firstName} ${user?.lastName}`
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar name={fullName} role={user?.role} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-[300px] overflow-y-auto">
          <Outlet/>
          <Footer />
        </div>
      </div>
    </div>
  )
}
export default Dashboard
