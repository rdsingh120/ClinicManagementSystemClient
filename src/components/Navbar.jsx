import { GiHamburgerMenu } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signOutUser } from '../api/user.api'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { IoLogOutOutline } from 'react-icons/io5'

const Navbar = ({ name, role }) => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  const HandleSignOut = async (e) => {
    e.preventDefault()
    const { success, message } = await signOutUser()
    if (success) {
      setUser(null)
      toast.success(message)
      navigate('/signin')
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-[100px] pl-5 md:px-20 sticky top-0 flex justify-between shadow-lg z-50">
      {/* Logo */}
      <div className="flex flex-col justify-center items-start text-white">
        <span className="font-bold text-xl md:text-2xl lg:text-3xl tracking-tight">
          Health Care
        </span>
        <span className="font-semibold text-xs md:text-sm lg:text-base text-cyan-200 tracking-wide">
          Medical Clinic
        </span>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2">
          <img
            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            alt="User avatar"
            className="w-11 h-11 rounded-full border-2 border-white shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-sm md:text-base lg:text-lg text-white font-semibold">
              {name}
            </span>
            <span className="text-xs md:text-sm text-blue-100 font-medium">
              {role}
            </span>
          </div>
        </div>

        <button 
          onClick={HandleSignOut} 
          className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          <IoLogOutOutline className="text-xl group-hover:translate-x-1 transition-transform" />
          <span className="hidden md:inline">Sign Out</span>
        </button>

        <GiHamburgerMenu className="text-white text-2xl mr-5 md:hidden cursor-pointer hover:text-blue-100 transition-colors" />
      </div>
    </div>
  )
}

export default Navbar