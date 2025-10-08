import { useState } from 'react'
import Footer from '../components/footer'
import Navbar from '../components/Navbar'
import Sidebar from '../components/sidebar'
import axios from 'axios'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
const Dashboard = () => {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState({})
  const token = localStorage.getItem('token')

  const fetchUserId = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserId(data?.user?.id)

    } catch (error) {
      console.log(error.message);
      
    }
  }

  const fetchUser = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/user/${id}`)
      setUser(data?.user)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    fetchUserId()
  }, [])

  useEffect(() => {
    if(userId) fetchUser(userId)
  }, [userId])

  
const fullName = `${user?.firstName} ${user?.lastName}`
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar name={fullName} role={user?.role} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 md:ml-[300px] overflow-y-auto">
          <Outlet context={{user}}/>
          <Footer />
        </div>
      </div>
    </div>
  )
}
export default Dashboard
