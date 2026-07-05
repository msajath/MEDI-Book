const fs = require('fs');

const data = fs.readFileSync('d:\\4th sem\\Test website\\frontend\\src\\assets\\assets.js', 'utf-8');

// Find the doctors array
const match = data.match(/export const doctors = (\[[\s\S]*?\]);?/);
if (match) {
  let arrStr = match[1];
  
  // Replace unquoted keys with quoted keys
  arrStr = arrStr.replace(/([a-zA-Z0-9_]+):/g, '"$1":');
  // Replace unquoted image variables (like doc1, doc2) with string paths
  arrStr = arrStr.replace(/"image":\s*(doc\d+)/g, '"image": "/images/$1.png"');
  // Fix single quotes in string values (like 'Dr. Davis') to double quotes
  arrStr = arrStr.replace(/'([^']*)'/g, '"$1"');
  // Fix trailing commas
  arrStr = arrStr.replace(/,\s*}/g, '}');
  arrStr = arrStr.replace(/,\s*\]/g, ']');
  
  try {
    const arr = JSON.parse(arrStr);
    fs.writeFileSync('d:\\4th sem\\Test website\\doctors.json', JSON.stringify(arr, null, 2));
    console.log('Successfully extracted', arr.length, 'doctors.');
  } catch (err) {
    console.error('Failed to parse:', err.message);
    // Write out the arrStr so we can see what failed
    fs.writeFileSync('d:\\4th sem\\Test website\\failed_arrStr.txt', arrStr);
  }
} else {
  console.log('No match found');
}
