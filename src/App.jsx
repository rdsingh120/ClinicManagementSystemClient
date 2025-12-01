import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import SignInPage from './pages/SignInPage'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import UpdateProfile from './pages/UpdateProfile'
import Profile from './pages/Profile'
import FindADoctorPage from './pages/FindADoctorPage'
import BookAppointmentPage from './components/booking/BookAppointmentPage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import ManageAvailability from './pages/ManageAvailability'
import DoctorUpdateProfile from './pages/DoctorUpdateProfile'
import DoctorPublicProfilePage from './pages/DoctorPublicProfilePage'
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage";
import PatientAppointmentsPage from "./pages/PatientAppointmentsPage";
import HomePage from './pages/HomePage'
import DoctorTestimonialsPage from './pages/DoctorTestimonialsPage'



const App = () => {
  return (
    <>
      <Routes>

        <Route path="/" element={<HomePage />} />

        {/* Public doctor profile (NO auth required) */}
        <Route path="/doctors/:id" element={<DoctorPublicProfilePage />} />

        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<SignInPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Profile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="find-a-doctor" element={<FindADoctorPage />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
            <Route path="doctor-profile" element={<DoctorProfilePage />} />
            <Route path="manage-availability" element={<ManageAvailability />} />
            <Route path="update-doctor-profile" element={<DoctorUpdateProfile />} />
            <Route path="doctor-appointments" element={<DoctorAppointmentsPage />} />
            <Route path="patient-appointments" element={<PatientAppointmentsPage />} />
            <Route path="doctor-testimonials" element={<DoctorTestimonialsPage />} />
          </Route>
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