const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Availability = require('./models/Availability');

dotenv.config();

// ──────────────────────────────────────────────
// Seed Data (matches frontend mockData.js)
// ──────────────────────────────────────────────

const users = [
  // Patients
  { name: 'Alex Johnson', email: 'alex@medibook.com', password: 'password123', role: 'patient', phone: '+1 (555) 123-4567' },
  { name: 'Sarah Miller', email: 'sarah.miller@email.com', password: 'password123', role: 'patient' },
  { name: 'John Davis', email: 'john.davis@email.com', password: 'password123', role: 'patient' },
  { name: 'Emily Clark', email: 'emily.clark@email.com', password: 'password123', role: 'patient' },
  { name: 'Robert Brown', email: 'robert.brown@email.com', password: 'password123', role: 'patient' },
  { name: 'Lisa Wang', email: 'lisa.wang@email.com', password: 'password123', role: 'patient' },
  { name: 'Marcus Webb', email: 'marcus.webb@email.com', password: 'password123', role: 'patient' },
  { name: 'Linda Hartley', email: 'linda.hartley@email.com', password: 'password123', role: 'patient' },
  { name: 'Kevin Brooks', email: 'kevin.brooks@email.com', password: 'password123', role: 'patient' },

  // Doctors
  { name: 'Dr. Sarah Mitchell', email: 'doctor@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. James Wilson', email: 'wilson@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. Elena Rodriguez', email: 'rodriguez@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. David Chen', email: 'dchen@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. Lisa Thompson', email: 'thompson@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. Michael Foster', email: 'foster@medibook.com', password: 'password123', role: 'doctor', isVerified: true },
  { name: 'Dr. Jonathan Sterling', email: 'sterling@medibook.com', password: 'password123', role: 'doctor', isVerified: true },

  // Admin
  { name: 'Admin User', email: 'admin@medibook.com', password: 'password123', role: 'admin' },
];

const doctorProfiles = [
  {
    email: 'doctor@medibook.com',
    profile: {
      specialty: 'Senior Cardiologist',
      fee: 120,
      rating: 4.9,
      reviews: 248,
      experience: '15+ Years',
      location: 'New York, NY',
      available: true,
      languages: ['English', 'Spanish'],
      bio: 'Board-certified cardiologist with over 15 years of experience. Known for a patient-centric approach, combining cutting-edge medical technology with empathetic care.',
      education: [
        { degree: 'Doctor of Medicine (MD)', institution: 'Johns Hopkins University School of Medicine', year: '2005' },
      ],
      experienceHistory: [
        { title: 'Senior Cardiologist', hospital: 'HeartCare Institute', period: '2015 - Present' },
        { title: 'Consultant Physician', hospital: 'Metro General Hospital', period: '2009 - 2015' },
      ],
    },
  },
  {
    email: 'wilson@medibook.com',
    profile: {
      specialty: 'Neurologist',
      fee: 150,
      rating: 4.8,
      reviews: 312,
      experience: '12+ Years',
      location: 'Boston, MA',
      available: true,
      languages: ['English'],
      bio: 'Expert neurologist specializing in brain disorders and neural conditions.',
    },
  },
  {
    email: 'rodriguez@medibook.com',
    profile: {
      specialty: 'Pediatric Specialist',
      fee: 95,
      rating: 4.9,
      reviews: 189,
      experience: '10+ Years',
      location: 'Miami, FL',
      available: true,
      languages: ['English', 'Spanish', 'Portuguese'],
      bio: "Dedicated pediatric specialist passionate about children's health.",
    },
  },
  {
    email: 'dchen@medibook.com',
    profile: {
      specialty: 'Dermatologist',
      fee: 110,
      rating: 4.7,
      reviews: 156,
      experience: '8+ Years',
      location: 'San Francisco, CA',
      available: false,
      languages: ['English', 'Mandarin'],
      bio: 'Experienced dermatologist treating skin conditions with modern techniques.',
    },
  },
  {
    email: 'thompson@medibook.com',
    profile: {
      specialty: 'General Physician',
      fee: 80,
      rating: 4.6,
      reviews: 421,
      experience: '20+ Years',
      location: 'Chicago, IL',
      available: true,
      languages: ['English'],
      bio: 'Trusted general physician with two decades of family medicine experience.',
    },
  },
  {
    email: 'foster@medibook.com',
    profile: {
      specialty: 'Orthopedic Surgeon',
      fee: 180,
      rating: 4.8,
      reviews: 203,
      experience: '14+ Years',
      location: 'Houston, TX',
      available: true,
      languages: ['English', 'French'],
      bio: 'Skilled orthopedic surgeon specializing in joint replacements and sports medicine.',
    },
  },
  {
    email: 'sterling@medibook.com',
    profile: {
      specialty: 'Cardiologist',
      fee: 140,
      rating: 4.9,
      reviews: 300,
      experience: '18+ Years',
      location: 'New York, NY',
      available: true,
      languages: ['English'],
      bio: 'Renowned cardiologist with expertise in interventional cardiology.',
    },
  },
];

const defaultAvailability = [
  { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Wednesday', enabled: true, start: '10:00', end: '16:00' },
  { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
  { day: 'Friday', enabled: true, start: '09:00', end: '14:00' },
  { day: 'Saturday', enabled: false, start: '10:00', end: '13:00' },
  { day: 'Sunday', enabled: false, start: '', end: '' },
];

// ──────────────────────────────────────────────
// Seed Function
// ──────────────────────────────────────────────
const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Availability.deleteMany({});

    // Create users
    console.log('👤 Creating users...');
    const createdUsers = {};
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers[userData.email] = user;
      console.log(`   ✅ ${user.role}: ${user.name} (${user.email})`);
    }

    // Create doctor profiles
    console.log('\n🩺 Creating doctor profiles...');
    const createdDoctors = {};
    for (const dp of doctorProfiles) {
      const user = createdUsers[dp.email];
      const doctor = await Doctor.create({
        user: user._id,
        ...dp.profile,
      });
      createdDoctors[dp.email] = doctor;
      console.log(`   ✅ ${user.name} — ${dp.profile.specialty}`);

      // Create availability
      await Availability.create({
        doctor: doctor._id,
        schedule: defaultAvailability,
      });
    }

    // Create sample appointments
    console.log('\n📅 Creating sample appointments...');
    const appointmentData = [
      {
        patient: createdUsers['alex@medibook.com']._id,
        doctor: createdDoctors['doctor@medibook.com']._id,
        date: '2024-05-20',
        time: '10:00 AM',
        status: 'confirmed',
        type: 'Follow-up',
        notes: 'Regular check-up for heart condition monitoring.',
      },
      {
        patient: createdUsers['alex@medibook.com']._id,
        doctor: createdDoctors['wilson@medibook.com']._id,
        date: '2024-05-18',
        time: '2:30 PM',
        status: 'confirmed',
        type: 'Consultation',
        notes: 'Annual physical examination.',
      },
      {
        patient: createdUsers['alex@medibook.com']._id,
        doctor: createdDoctors['rodriguez@medibook.com']._id,
        date: '2024-05-15',
        time: '11:00 AM',
        status: 'cancelled',
        type: 'Check-up',
        notes: 'Cancelled due to personal emergency.',
      },
      {
        patient: createdUsers['alex@medibook.com']._id,
        doctor: createdDoctors['dchen@medibook.com']._id,
        date: '2024-05-22',
        time: '9:00 AM',
        status: 'pending',
        type: 'New Consultation',
        notes: 'First appointment for skin evaluation.',
      },
      {
        patient: createdUsers['alex@medibook.com']._id,
        doctor: createdDoctors['doctor@medibook.com']._id,
        date: '2024-05-25',
        time: '3:00 PM',
        status: 'confirmed',
        type: 'Follow-up',
        notes: 'Post-surgery follow-up visit.',
      },
      // Doctor view appointments (patients booking with Dr. Sterling)
      {
        patient: createdUsers['marcus.webb@email.com']._id,
        doctor: createdDoctors['sterling@medibook.com']._id,
        date: '2024-05-20',
        time: '09:00 AM',
        status: 'confirmed',
        type: 'General Check-up',
        notes: 'Patient reports dull aching in the lumbar region for 3 weeks.',
      },
      {
        patient: createdUsers['linda.hartley@email.com']._id,
        doctor: createdDoctors['sterling@medibook.com']._id,
        date: '2024-05-20',
        time: '10:30 AM',
        status: 'confirmed',
        type: 'Follow-up',
        notes: 'Regular follow-up for hypertensive heart disease.',
      },
      {
        patient: createdUsers['kevin.brooks@email.com']._id,
        doctor: createdDoctors['sterling@medibook.com']._id,
        date: '2024-05-20',
        time: '02:00 PM',
        status: 'cancelled',
        type: 'Consultation',
        notes: 'Appointment cancelled by patient.',
      },
    ];

    for (const appt of appointmentData) {
      await Appointment.create(appt);
    }
    console.log(`   ✅ Created ${appointmentData.length} sample appointments`);

    // Summary
    console.log('\n══════════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('══════════════════════════════════════════');
    console.log(`   Users:        ${users.length}`);
    console.log(`   Doctors:      ${doctorProfiles.length}`);
    console.log(`   Appointments: ${appointmentData.length}`);
    console.log('══════════════════════════════════════════');
    console.log('\n🔑 Login credentials:');
    console.log('   Patient:  alex@medibook.com / password123');
    console.log('   Doctor:   sterling@medibook.com / password123');
    console.log('   Admin:    admin@medibook.com / password123');
    console.log('══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
