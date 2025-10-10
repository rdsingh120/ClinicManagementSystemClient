import { useEffect, useState } from 'react'
import Doctor from '../components/Doctor'
import { getAllUsers } from '../api/user.api'

const FindADoctorPage = () => {
  const [doctors, setDoctors] = useState([])


  const handleFetchDoctors = async () => {
    const { success, users } = await getAllUsers('doctor')
    setDoctors(users)
  }

  useEffect(() => {
    handleFetchDoctors()
  }, [])

  
  if (doctors.length == 0) return <h1>Loading...</h1>

  

  return (
    <div className="bg-white flex flex-wrap justify-start gap-10 flex-1 p-6 overflow-y-auto rounded-tl-2xl">
      {doctors.map(({_id, firstName, lastName, doctorProfile}) => {
        return <Doctor key={_id} name={`${firstName} ${lastName}`} specialty={doctorProfile?.specialty} />
      })}
    </div>
  )
}
export default FindADoctorPage
