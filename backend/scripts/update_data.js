const fs = require('fs');

const locations = ['New York, NY', 'Boston, MA', 'Miami, FL', 'San Francisco, CA', 'Chicago, IL', 'Houston, TX', 'London, UK'];

function updateFile(path, isMock) {
  let content = fs.readFileSync(path, 'utf8');
  let matchCount = 0;
  
  // Match lines with `location: '...',` or `location: '...', available: true,`
  // We'll replace the location and availability.
  
  // For mockData.js
  if (isMock) {
    content = content.replace(/(location:\s*)'[^']+'(,\s*available:\s*)true/g, (match, p1, p2) => {
      const loc = locations[matchCount % locations.length];
      const avail = (matchCount % 4 === 0) ? false : true; // Every 4th doctor is unavailable
      matchCount++;
      return `${p1}'${loc}'${p2}${avail}`;
    });
  } else {
    // For seeder.js
    content = content.replace(/(location:\s*)'[^']+'(,\s*available:\s*)true/g, (match, p1, p2) => {
      const loc = locations[matchCount % locations.length];
      const avail = (matchCount % 4 === 0) ? false : true; 
      matchCount++;
      return `${p1}'${loc}'${p2}${avail}`;
    });
  }

  fs.writeFileSync(path, content);
  console.log(`Updated ${matchCount} doctors in ${path}`);
}

updateFile('d:\\4th sem\\Test website\\frontend\\src\\data\\mockData.js', true);
updateFile('d:\\4th sem\\Test website\\backend\\seeder.js', false);
