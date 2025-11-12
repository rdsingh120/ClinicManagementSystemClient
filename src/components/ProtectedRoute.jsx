import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">Loading…</div>
    </div>
  )
}

export default function ProtectedRoute() {
  const { user, loading } = useContext(UserContext)
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/signin" replace state={{ from: location }} />
  return <Outlet />
}