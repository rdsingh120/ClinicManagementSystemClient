import { useEffect, useState } from 'react'
import { getAllUsers } from '../api/user.api'
import DoctorCard from '../components/DoctorCard'

const FindADoctorPage = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
      ; (async () => {
        setLoading(true)
        setError('')
        const { success, users, message } = await getAllUsers('doctor')
        if (!mounted) return
        if (success && Array.isArray(users)) setDoctors(users)
        else setError(message || 'Failed to load doctors')
        setLoading(false)
      })()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto rounded-tl-2xl bg-white p-6">
        <div className="mb-4 h-6 w-56 animate-pulse rounded bg-gray-200" />
        <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border bg-white" />
          ))}
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto rounded-tl-2xl bg-white p-6">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
      </div>
    )
  }

  if (!doctors.length) {
    return (
      <div className="flex-1 overflow-y-auto rounded-tl-2xl bg-white p-6">
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          No doctors found. Please check back later.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto rounded-tl-2xl bg-white p-6">
      <section className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {doctors.map((d) => (
          <DoctorCard key={d._id} doc={d} />
        ))}
      </section>
    </div>
  )
}

export default FindADoctorPage
