import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import SignInPage from './pages/SignInPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ProfilePage from './pages/ProfilePage'
import MedicalDetails from './pages/MedicalDetails'

const App = () => {
  return (
    <>
      <Routes>
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="medical-details" element={<MedicalDetails />} />
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
