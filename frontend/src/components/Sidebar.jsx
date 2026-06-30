import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const patientLinks = [
  { to: '/patient/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/patient/appointments', icon: 'calendar_today', label: 'My Appointments' },
  { to: '/patient/records', icon: 'description', label: 'Medical Records', comingSoon: true },
  { to: '/patient/messages', icon: 'mail', label: 'Messages' },
  { to: '/patient/profile', icon: 'settings', label: 'Settings' },
]

const doctorLinks = [
  { to: '/doctor/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/doctor/appointments', icon: 'calendar_today', label: 'My Appointments' },
  { to: '/doctor/availability', icon: 'schedule', label: 'Set Availability' },
  { to: '/doctor/messages', icon: 'mail', label: 'Messages' },
  { to: '/doctor/profile', icon: 'settings', label: 'Settings' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/appointments', icon: 'calendar_today', label: 'My Appointments', comingSoon: true },
  { to: '/admin/records', icon: 'description', label: 'Medical Records', comingSoon: true },
  { to: '/admin/messages', icon: 'mail', label: 'Messages' },
  { to: '/admin/settings', icon: 'settings', label: 'Settings', comingSoon: true },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'doctor' ? doctorLinks : user?.role === 'admin' ? adminLinks : patientLinks

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="fixed top-0 left-0 w-[260px] h-screen bg-gradient-to-b from-[#f0fdfa] via-[#ecfeff] to-[#f0f9ff] border-r border-outline-variant flex flex-col z-50 overflow-y-auto max-lg:-translate-x-full max-lg:transition-transform max-lg:duration-300" id="dashboard-sidebar">
      <div className="p-6 border-b border-outline-variant">
        <Link to="/" className="flex items-center gap-2">
          <span className="material-icons-outlined text-primary text-[28px]">local_hospital</span>
          <span className="text-xl font-bold text-primary">MediBook</span>
        </Link>
      </div>

      {user && (
        <div className="p-5 px-6 flex items-center gap-3 border-b border-outline-variant">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-navy">{user.name}</span>
            <span className="text-xs text-outline">Premium Member</span>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 px-3 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink 
            key={link.label} 
            to={link.to} 
            className={({ isActive }) => `flex items-center gap-3 p-3 px-4 rounded-2xl text-sm transition-all w-full text-left relative ${isActive ? 'bg-[#0891b21f] text-primary font-semibold' : 'text-navy-muted font-medium hover:bg-[#0891b214] hover:text-primary'}`} 
            end
            onClick={(e) => {
              if (link.comingSoon) {
                e.preventDefault();
                alert(`${link.label} feature coming soon!`);
              }
            }}
          >
            {({ isActive }) => (
              <>
                <span className="material-icons-outlined">{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r"></span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 px-3 border-t border-outline-variant">
        <button className="flex items-center gap-3 p-3 px-4 rounded-2xl text-sm font-medium transition-all w-full text-left text-error hover:bg-error-bg" onClick={handleLogout}>
          <span className="material-icons-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
