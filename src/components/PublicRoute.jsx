import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading…</div>
    </div>
  )
}

export default function PublicRoute() {
  const { user, loading } = useContext(UserContext)

  // Wait for rehydration so we don't misroute on refresh
  if (loading) return <FullScreenLoader />

  // Already signed in → go to dashboard
  if (user) return <Navigate to="/dashboard" replace />

  // Not signed in → render the nested public page
  return <Outlet />
}

