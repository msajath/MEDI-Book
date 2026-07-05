const fs = require('fs');

const mockDataNew = fs.readFileSync('d:\\4th sem\\Test website\\mockData_doctors.txt', 'utf8');
const mockDataPath = 'd:\\4th sem\\Test website\\frontend\\src\\data\\mockData.js';
let mockData = fs.readFileSync(mockDataPath, 'utf8');
mockData = mockData.replace(/export const doctors = \[\s*[\s\S]*?\]/, mockDataNew.trim());
fs.writeFileSync(mockDataPath, mockData);

const seederNew = fs.readFileSync('d:\\4th sem\\Test website\\seeder_replacements.txt', 'utf8');
const [usersNew, profilesNew] = seederNew.split('\n\nconst doctorProfiles =');
const seederPath = 'd:\\4th sem\\Test website\\backend\\seeder.js';
let seeder = fs.readFileSync(seederPath, 'utf8');
seeder = seeder.replace(/const users = \[\s*[\s\S]*?\];/, usersNew);
seeder = seeder.replace(/const doctorProfiles = \[\s*[\s\S]*?\];/, 'const doctorProfiles =' + profilesNew);
fs.writeFileSync(seederPath, seeder);

console.log('Successfully updated mockData.js and seeder.js');
