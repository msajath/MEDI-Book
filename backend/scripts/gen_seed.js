const fs = require('fs');
const doctors = JSON.parse(fs.readFileSync('d:\\4th sem\\Test website\\doctors.json', 'utf8'));

// Generate mockData.js doctors array
let mockDataDoctors = 'export const doctors = [\n';
doctors.forEach((d, i) => {
  mockDataDoctors += `  { id: ${i+1}, _id: '${d._id}', name: '${d.name}', image: '${d.image}', specialty: '${d.speciality}', fee: ${d.fees}, rating: 4.8, reviews: Math.floor(Math.random() * 200) + 50, experience: '${d.experience}', location: '${d.address.line1}, ${d.address.line2}', available: true, languages: ['English'] },\n`;
});
mockDataDoctors += ']\n';
fs.writeFileSync('d:\\4th sem\\Test website\\mockData_doctors.txt', mockDataDoctors);

// Generate backend users and doctorProfiles
let seederUsers = `const users = [
  // Patients
  { name: 'Alex Johnson', email: 'alex@mednexus.com', password: 'password123', role: 'patient', phone: '+1 (555) 123-4567' },
  { name: 'Sarah Miller', email: 'sarah.miller@email.com', password: 'password123', role: 'patient' },
  { name: 'John Davis', email: 'john.davis@email.com', password: 'password123', role: 'patient' },
  { name: 'Emily Clark', email: 'emily.clark@email.com', password: 'password123', role: 'patient' },

  // Doctors
`;
doctors.forEach(d => {
  const emailName = d.name.toLowerCase().replace('dr. ', '').replace(' ', '.');
  const email = `${emailName}@mednexus.com`;
  seederUsers += `  { name: '${d.name}', email: '${email}', password: 'password123', role: 'doctor', isVerified: true, avatar: '${d.image}' },\n`;
});
seederUsers += `
  // Admin
  { name: 'Admin User', email: 'admin@mednexus.com', password: 'password123', role: 'admin' },
];
`;

let seederProfiles = `const doctorProfiles = [\n`;
doctors.forEach(d => {
  const emailName = d.name.toLowerCase().replace('dr. ', '').replace(' ', '.');
  const email = `${emailName}@mednexus.com`;
  seederProfiles += `  {
    email: '${email}',
    profile: {
      specialty: '${d.speciality}',
      fee: ${d.fees},
      rating: 4.8,
      reviews: Math.floor(Math.random() * 200) + 50,
      experience: '${d.experience}',
      location: '${d.address.line1}, ${d.address.line2}',
      available: true,
      languages: ['English'],
      bio: '${d.about.replace(/'/g, "\\'")}',
    },
  },\n`;
});
seederProfiles += '];\n';

fs.writeFileSync('d:\\4th sem\\Test website\\seeder_replacements.txt', seederUsers + '\n\n' + seederProfiles);
console.log('Done generating text files.');
