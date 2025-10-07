import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className="bg-blue-500 h-[100px] px-10 md:px-20 flex justify-between">
      {/* Logo */}
      <div className="flex flex-col justify-center items-center text-white">
        <span className="font-bold text-xl md:text-2xl lg:text-3xl">
          Health Care
        </span>
        <span className="font-bold text-xs md:text-sm lg:text-base text-[#5dd0e2]">
          Medical Clinic
        </span>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <img
          src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          alt=""
          className="w-10 h-10 rounded"
        />
        <div className="flex flex-col">
          <span className="text-xs md:text-sm lg:text-base text-white font-medium">John Doe</span>
          <span className="text-xs md:text-sm lg:text-base text-white">Patient</span>
        </div>
      </div>
    </div>
  )
}
export default Navbar