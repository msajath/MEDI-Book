import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import Footer from '../components/Footer'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    monthlyAppointments: 0,
    revenue: '$0'
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || data || {
          totalDoctors: 0,
          totalPatients: 0,
          monthlyAppointments: 0,
          revenue: '$0'
        })
        setRecentActivity(data.recentActivity || [])
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      // Set default values on error
      setStats({
        totalDoctors: 0,
        totalPatients: 0,
        monthlyAppointments: 0,
        revenue: '$0'
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 md:p-8 ml-0 md:ml-64 transition-all duration-300" id="admin-dashboard">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-navy">Admin Overview</h1>
            <p className="mt-2 text-base text-navy-muted">Platform performance and user activity.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline text-navy text-sm font-semibold rounded-lg hover:bg-surface-container-lowest transition-colors" onClick={() => alert("Downloading report...")}><span className="material-icons-outlined text-[18px]">download</span> Download Report</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="medical_services" value={stats.totalDoctors} label="Registered Doctors" color="var(--color-primary)" trend={5} />
          <StatCard icon="groups" value={stats.totalPatients} label="Registered Patients" color="var(--color-success)" trend={12} />
          <StatCard icon="calendar_month" value={stats.monthlyAppointments} label="Monthly Appointments" color="var(--color-warning)" trend={8} />
          <StatCard icon="account_balance" value={stats.revenue} label="Total Revenue" color="#8b5cf6" trend={15} />
        </div>

        {loading ? (
          <div className="text-center p-8 text-navy-muted">
            <p>Loading dashboard data...</p>
          </div>
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div>
            <h3 className="text-xl font-semibold text-navy mb-5">Recent Activity</h3>
            <div className="flex flex-col bg-white rounded-xl shadow-sm border border-outline-variant py-2">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity._id || activity.id} className="flex gap-4 p-4 px-6 border-b border-surface-container-high last:border-b-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'registration' ? 'bg-blue-50 text-blue-600' : activity.type === 'booking' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      <span className="material-icons-outlined text-[20px]">
                        {activity.type === 'registration' ? 'person_add' : activity.type === 'booking' ? 'calendar_today' : 'rate_review'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-navy">{activity.message}</p>
                      <span className="text-xs text-outline">{activity.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-navy mb-5">System Health</h3>
            <div className="flex flex-col gap-5 p-6 bg-white rounded-xl shadow-sm border border-outline-variant">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-navy-muted">Server Uptime</span>
                  <span className="text-sm font-semibold text-success">99.99%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-success rounded-full" style={{ width: '99.99%' }}></div></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-navy-muted">API Response Time</span>
                  <span className="text-sm font-semibold text-navy">124ms</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: '30%' }}></div></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-navy-muted">Database Load</span>
                  <span className="text-sm font-semibold text-warning">65%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-warning rounded-full" style={{ width: '65%' }}></div></div>
              </div>
            </div>

            <div className="p-6 mt-5 bg-white rounded-xl shadow-sm border border-outline-variant">
              <h4 className="text-lg font-semibold text-navy mb-2">Pending Doctor Approvals</h4>
              <p className="text-sm text-navy-muted">There are <strong>4</strong> new doctor profiles awaiting verification.</p>
              <button className="mt-3 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors" onClick={() => alert("Loading pending doctor approvals...")}>Review Now</button>
            </div>
          </div>
        </div>
        )}

        <div className="mt-auto pt-12 -mx-6 md:-mx-8 -mb-6 md:-mb-8">
          <Footer />
        </div>
      </main>
    </div>
  )
}
