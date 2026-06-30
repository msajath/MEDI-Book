export const doctors = [
  { id: 1, name: 'Dr. Sarah Mitchell', specialty: 'Senior Cardiologist', fee: 120, rating: 4.9, reviews: 248, experience: '15+ Years', location: 'New York, NY', available: true, languages: ['English', 'Spanish'] },
  { id: 2, name: 'Dr. James Wilson', specialty: 'Neurologist', fee: 150, rating: 4.8, reviews: 312, experience: '12+ Years', location: 'Boston, MA', available: true, languages: ['English'] },
  { id: 3, name: 'Dr. Elena Rodriguez', specialty: 'Pediatric Specialist', fee: 95, rating: 4.9, reviews: 189, experience: '10+ Years', location: 'Miami, FL', available: true, languages: ['English', 'Spanish', 'Portuguese'] },
  { id: 4, name: 'Dr. David Chen', specialty: 'Dermatologist', fee: 110, rating: 4.7, reviews: 156, experience: '8+ Years', location: 'San Francisco, CA', available: false, languages: ['English', 'Mandarin'] },
  { id: 5, name: 'Dr. Lisa Thompson', specialty: 'General Physician', fee: 80, rating: 4.6, reviews: 421, experience: '20+ Years', location: 'Chicago, IL', available: true, languages: ['English'] },
  { id: 6, name: 'Dr. Michael Foster', specialty: 'Orthopedic Surgeon', fee: 180, rating: 4.8, reviews: 203, experience: '14+ Years', location: 'Houston, TX', available: true, languages: ['English', 'French'] },
]

export const appointments = [
  { id: 1, doctor: 'Dr. Sarah Chen', specialty: 'Cardiology', date: '2024-05-20', time: '10:00 AM', status: 'confirmed', type: 'Follow-up', notes: 'Regular check-up for heart condition monitoring.' },
  { id: 2, doctor: 'Dr. James Wilson', specialty: 'General Practice', date: '2024-05-18', time: '2:30 PM', status: 'confirmed', type: 'Consultation', notes: 'Annual physical examination.' },
  { id: 3, doctor: 'Dr. Emily Blunt', specialty: 'Pediatrics', date: '2024-05-15', time: '11:00 AM', status: 'cancelled', type: 'Check-up', notes: 'Cancelled due to personal emergency.' },
  { id: 4, doctor: 'Dr. Robert Chen', specialty: 'Cardiology', date: '2024-05-22', time: '9:00 AM', status: 'pending', type: 'New Consultation', notes: 'First appointment for chest pain evaluation.' },
  { id: 5, doctor: 'Dr. Sarah Mitchell', specialty: 'Cardiology', date: '2024-05-25', time: '3:00 PM', status: 'confirmed', type: 'Follow-up', notes: 'Post-surgery follow-up visit.' },
]

export const doctorAppointments = [
  { id: 1, patient: 'Marcus Webb', age: 34, date: '2024-05-20', time: '09:00 AM', status: 'confirmed', type: 'General Check-up', notes: 'Patient reports dull aching in the lumbar region for 3 weeks. No history of injury. Pain radiates slightly to the left hip. Aggravated by prolonged sitting. Patient requests ergonomic assessment and physical therapy referral.' },
  { id: 2, patient: 'Linda Hartley', age: 58, date: '2024-05-20', time: '10:30 AM', status: 'confirmed', type: 'Cardiology Follow-up', notes: 'Regular follow-up for hypertensive heart disease. Patient has been monitoring blood pressure at home with average readings of 135/85. No shortness of breath or edema. Current medication: Lisinopril 10mg.' },
  { id: 3, patient: 'Kevin Brooks', age: 27, date: '2024-05-20', time: '02:00 PM', status: 'cancelled', type: 'Allergy Consultation', notes: "Appointment cancelled by patient. Noted as 'personal emergency'. Need to reschedule for the following week. Patient mentioned seasonal allergies earlier this month." },
]

export const timeSlots = {
  morning: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
  evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
}

export const specialties = ['All Specialties', 'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics', 'General Practice']

export const adminStats = {
  totalUsers: '12,482',
  totalDoctors: '842',
  totalAppointments: '3,912',
  pendingApprovals: '28',
}

export const recentActivity = [
  { id: 1, title: 'New Appointment Booked', desc: 'Patient Sarah Miller with Dr. House', time: '2 mins ago', icon: 'calendar_today', color: 'var(--color-primary)' },
  { id: 2, title: 'New Doctor Registration', desc: 'Dr. Alan Grant (Cardiology)', time: '1 hour ago', icon: 'person_add', color: 'var(--color-success)' },
  { id: 3, title: 'System Update Pending', desc: 'Security patches available for node #42', time: '3 hours ago', icon: 'security', color: 'var(--color-warning)' },
  { id: 4, title: 'Profile Verified', desc: 'MediPlus Clinic profile is now live', time: 'Yesterday', icon: 'verified', color: 'var(--color-success)' },
]

export const weeklyAvailability = [
  { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Wednesday', enabled: true, start: '10:00', end: '16:00' },
  { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Friday', enabled: true, start: '09:00', end: '14:00' },
  { day: 'Saturday', enabled: false, start: '10:00', end: '13:00' },
  { day: 'Sunday', enabled: false, start: '', end: '' },
]
