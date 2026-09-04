const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

/**
 * Masks a string for safe terminal logging.
 * Shows first few characters and masks the rest.
 */
function maskSecret(str, showChars = 4) {
  if (!str) return 'NOT_SET';
  if (str.length <= showChars) return '****';
  return str.substring(0, showChars) + '*'.repeat(Math.max(str.length - showChars, 6));
}

function maskKeyId(keyId) {
  if (!keyId) return 'NOT_SET';
  if (keyId.startsWith('rzp_test_')) {
    return 'rzp_test_' + '*'.repeat(Math.max(keyId.length - 9, 8));
  }
  return keyId.substring(0, 4) + '*'.repeat(Math.max(keyId.length - 4, 8));
}

/**
 * Searches for an Excel file in config/ or root directory.
 */
function findExcelFile(customPath) {
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  const possiblePaths = [
    path.join(__dirname, '..', 'config', 'credentials.xlsx'),
    path.join(__dirname, '..', 'credentials.xlsx'),
    path.join(__dirname, '..', 'config', 'credentials.example.xlsx'),
    path.join(__dirname, '..', 'credentials.example.xlsx')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

/**
 * Extracts credentials from a workbook sheet.
 * Supports multiple table formats:
 * Format A (Key-Value rows):
 *   | Setting             | Value              |
 *   | RAZORPAY_KEY_ID     | rzp_test_xxxxxxxxx |
 *   | RAZORPAY_KEY_SECRET | xxxxxxxxxxxxxxxx   |
 *
 * Format B (Header columns):
 *   | key_id             | key_secret       |
 *   | rzp_test_xxxxxxxxx | xxxxxxxxxxxxxxxx |
 */
function extractCredentials(workbook) {
  let keyId = null;
  let keySecret = null;
  let foundSheet = '';

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // Read as 2D array
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rows || rows.length === 0) continue;

    // Check Format A: Key-Value pairs in rows
    for (const row of rows) {
      if (!Array.isArray(row) || row.length < 2) continue;
      const cell0 = String(row[0] || '').trim().toUpperCase();
      const cell1 = String(row[1] || '').trim();

      if (cell0 === 'RAZORPAY_KEY_ID' || cell0 === 'KEY_ID' || cell0 === 'KEY ID') {
        keyId = cell1;
        foundSheet = sheetName;
      }
      if (cell0 === 'RAZORPAY_KEY_SECRET' || cell0 === 'KEY_SECRET' || cell0 === 'KEY SECRET' || cell0 === 'SECRET_KEY') {
        keySecret = cell1;
        foundSheet = sheetName;
      }
    }

    if (keyId && keySecret) break;

    // Check Format B: Column headers
    // Row 0 has headers, Row 1 has values
    const headers = (rows[0] || []).map(h => String(h).trim().toLowerCase().replace(/[\s_-]+/g, ''));
    const idIdx = headers.findIndex(h => h.includes('keyid') || h === 'keyid' || h === 'razorpaykeyid');
    const secretIdx = headers.findIndex(h => h.includes('keysecret') || h === 'keysecret' || h === 'secret' || h === 'razorpaykeysecret');

    if (idIdx !== -1 && secretIdx !== -1 && rows.length > 1) {
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const valId = String(row[idIdx] || '').trim();
        const valSecret = String(row[secretIdx] || '').trim();
        if (valId && valSecret) {
          keyId = valId;
          keySecret = valSecret;
          foundSheet = sheetName;
          break;
        }
      }
    }

    if (keyId && keySecret) break;
  }

  return { keyId, keySecret, sheetName: foundSheet };
}

function runImporter() {
  console.log('====================================================');
  console.log('  Razorpay Credentials Importer (Test Mode)        ');
  console.log('====================================================\n');

  const customArg = process.argv[2];
  const excelFilePath = findExcelFile(customArg);

  if (!excelFilePath) {
    console.error('❌ Error: No Excel credential file found.');
    console.error('Please place your credentials in config/credentials.xlsx or provide the file path:');
    console.error('  node scripts/importCredentials.js path/to/credentials.xlsx\n');
    process.exit(1);
  }

  console.log(`📁 Reading Excel file: ${path.relative(process.cwd(), excelFilePath)}`);

  let workbook;
  try {
    workbook = xlsx.readFile(excelFilePath);
  } catch (err) {
    console.error(`❌ Error reading Excel file: ${err.message}`);
    process.exit(1);
  }

  const { keyId, keySecret, sheetName } = extractCredentials(workbook);

  if (!keyId || !keySecret) {
    console.error('❌ Error: Could not find RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the Excel file.');
    console.error('Supported formats:');
    console.error('  Format 1 (Key-Value): Column A = "RAZORPAY_KEY_ID", Column B = "rzp_test_..."');
    console.error('  Format 2 (Headers):   Row 1 = "key_id", "key_secret", Row 2 = values\n');
    process.exit(1);
  }

  // Validate Test Mode
  if (!keyId.startsWith('rzp_test_')) {
    console.warn('\n⚠️  WARNING: The provided Key ID does not start with "rzp_test_".');
    console.warn('   This application is strictly intended for TEST MODE.');
    console.warn('   Ensure you are using your Razorpay Test API keys from your dashboard.\n');
  }

  // Destination backend .env
  const backendDir = path.join(__dirname, '..', 'backend');
  const envPath = path.join(backendDir, '.env');

  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }

  // Read existing .env if exists to preserve other settings like PORT
  let existingContent = '';
  let port = '5000';
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, 'utf8');
    const portMatch = existingContent.match(/^PORT=(.*)$/m);
    if (portMatch) {
      port = portMatch[1].trim();
    }
  }

  const newEnvContent = `# Razorpay Test Mode Configuration
# Generated automatically by scripts/importCredentials.js
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

RAZORPAY_KEY_ID=${keyId}
RAZORPAY_KEY_SECRET=${keySecret}
PORT=${port}
NODE_ENV=development
`;

  try {
    fs.writeFileSync(envPath, newEnvContent, 'utf8');
    console.log(`\n✅ Razorpay credentials imported successfully from sheet [${sheetName}].`);
    console.log(`📄 Written to: ${path.relative(process.cwd(), envPath)}`);
    console.log('\n---------------- Credential Summary ----------------');
    console.log(`  Key ID     : ${maskKeyId(keyId)}`);
    console.log(`  Key Secret : ${maskSecret(keySecret)}`);
    console.log(`  Mode       : ${keyId.startsWith('rzp_test_') ? 'TEST MODE ✓' : 'CUSTOM / LIVE ⚠️'}`);
    console.log(`  Port       : ${port}`);
    console.log('----------------------------------------------------\n');
    console.log('🔒 Security Notice: Secret keys are never printed in plaintext.');
    console.log('You are now ready to run `npm run dev` to start testing!\n');
  } catch (err) {
    console.error(`❌ Failed to write backend .env: ${err.message}`);
    process.exit(1);
  }
}

runImporter();
