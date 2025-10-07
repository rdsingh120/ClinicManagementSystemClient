import { CgProfile } from 'react-icons/cg'

const Sidebar = () => {
  return (
    <div className="w-full md:w-[300px] h-[calc(100vh-100px)] fixed top-[5.9rem] left-0 bg-blue-500 px-5">
      <div className="mt-10 flex flex-col gap-5">
        <div className="bg-white rounded-lg px-4 py-1 cursor-pointer flex items-center gap-5">
          <CgProfile className="text-xl" />
          <span className='text-lg'>Profile</span>
        </div>
      </div>
    </div>
  )
}
export default Sidebar
