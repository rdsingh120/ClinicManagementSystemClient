const Doctor = ({name, specialty}) => {
  return (
    <div className="flex flex-col items-center gap-1 border border-black px-10 py-2 h-fit">
      <img
        src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
        className="w-40 h-40 rounded-full border border-black mb-5"
        alt=""
      />
      <h1 className="font-bold">Dr. {name}</h1>
      <h2 className="text-gray-600">{specialty}</h2>
      <button className="bg-blue-500 px-4 py-1 text-white text-lg cursor-pointer">Book Appointment</button>
    </div>
  )
}
export default Doctor