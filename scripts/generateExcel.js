const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const configDir = path.join(__dirname, '..', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// 1. Generate credentials.example.xlsx
const exampleData = [
  ['Setting', 'Value'],
  ['RAZORPAY_KEY_ID', 'rzp_test_your_key_id_here'],
  ['RAZORPAY_KEY_SECRET', 'your_secret_key_here']
];
const exampleWs = xlsx.utils.aoa_to_sheet(exampleData);
const exampleWb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(exampleWb, exampleWs, 'Credentials');
const examplePath = path.join(configDir, 'credentials.example.xlsx');
xlsx.writeFile(exampleWb, examplePath);
console.log(`✅ Generated template: ${path.relative(process.cwd(), examplePath)}`);

// 2. Generate config/credentials.xlsx with placeholder test credentials
const testData = [
  ['Setting', 'Value'],
  ['RAZORPAY_KEY_ID', process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id_here'],
  ['RAZORPAY_KEY_SECRET', process.env.RAZORPAY_KEY_SECRET || 'your_secret_key_here']
];
const testWs = xlsx.utils.aoa_to_sheet(testData);
const testWb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(testWb, testWs, 'Razorpay_Test_Credentials');
const testPath = path.join(configDir, 'credentials.xlsx');
xlsx.writeFile(testWb, testPath);
console.log(`✅ Generated test credentials spreadsheet: ${path.relative(process.cwd(), testPath)}`);
