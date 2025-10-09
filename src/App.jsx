import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import SignInPage from './pages/SignInPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import UpdateProfile from './pages/UpdateProfile'
import Profile from './pages/Profile'
import Doctors from './pages/Doctors'

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="*"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Profile />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="find-a-doctor" element={<Doctors />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}
export default App
