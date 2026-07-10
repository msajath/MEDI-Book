import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'

// Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DoctorListing from './pages/DoctorListing'
import DoctorProfile from './pages/DoctorProfile'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ForgotPassword from './pages/ForgotPassword'

// Protected Pages
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import PatientProfile from './pages/PatientProfile'
import DoctorDashboard from './pages/DoctorDashboard'
import ManageAppointments from './pages/ManageAppointments'
import SetAvailability from './pages/SetAvailability'
import AdminDashboard from './pages/AdminDashboard'
import Messages from './pages/Messages'
import DoctorProfileSettings from './pages/DoctorProfileSettings'
import MedicalRecords from './pages/MedicalRecords'
import AdminLogin from './pages/AdminLogin'
import AdminAppointments from './pages/AdminAppointments'
import AdminRecords from './pages/AdminRecords'
import AdminUsers from './pages/AdminUsers'
import AdminDoctors from './pages/AdminDoctors'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they don't have permission
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    return <Navigate to="/patient/appointments" replace />
  }

  return children
}

// Admin-specific protected route
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctors" element={<DoctorListing />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />

        {/* Protected Routes - Patient */}
        <Route path="/book/:id" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        } />
        <Route path="/patient/appointments" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/patient/profile" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientProfile />
          </ProtectedRoute>
        } />
        <Route path="/patient/records" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MedicalRecords />
          </ProtectedRoute>
        } />
        <Route path="/patient/messages" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Messages />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Doctor */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <ManageAppointments />
          </ProtectedRoute>
        } />
        <Route path="/doctor/availability" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <SetAvailability />
          </ProtectedRoute>
        } />
        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorProfileSettings />
          </ProtectedRoute>
        } />
        <Route path="/doctor/messages" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Messages />
          </ProtectedRoute>
        } />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
        <Route path="/admin/records" element={<AdminRoute><AdminRecords /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/doctors" element={<AdminRoute><AdminDoctors /></AdminRoute>} />
        <Route path="/admin/messages" element={<AdminRoute><Messages /></AdminRoute>} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

