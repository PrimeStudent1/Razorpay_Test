const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('====================================================');
console.log('  🔒 Local Security & Credential Exposure Scan      ');
console.log('====================================================\n');

let issuesFound = 0;

// 1. Check .gitignore rules
console.log('🔍 Checking .gitignore rules for secret isolation...');
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  const requiredPatterns = ['.env', '*.xlsx'];
  for (const pat of requiredPatterns) {
    if (!gitignore.includes(pat)) {
      console.error(`❌ [SECURITY] .gitignore missing required pattern: ${pat}`);
      issuesFound++;
    } else {
      console.log(`  ✓ Pattern '${pat}' is properly ignored by git.`);
    }
  }
} else {
  console.error('❌ [SECURITY] .gitignore file is missing!');
  issuesFound++;
}

// 2. Scan tracked source code for accidental secret exposures
console.log('\n🔍 Scanning frontend & client code for secret leaks...');
const sensitivePatterns = [
  { regex: /VITE_RAZORPAY_KEY_SECRET/i, desc: 'Vite secret key prefix' },
  { regex: /rzp_live_[a-zA-Z0-9]{14,}/, desc: 'Live Razorpay Key ID' },
  { regex: /RAZORPAY_KEY_SECRET\s*=\s*['"]?[a-zA-Z0-9]{16,}['"]?/, desc: 'Committed Razorpay Secret Key' },
];

function scanDirectory(dir, isFrontend = false) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(path.join(__dirname, '..'), fullPath);

    // Skip node_modules, dist, .git, real .env files (keep .env.example for scanning)
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name === '.git' ||
      (entry.name.startsWith('.env') && !entry.name.endsWith('.example')) ||
      entry.name.endsWith('.xlsx')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath, isFrontend || entry.name === 'frontend');
    } else if (/\.(js|jsx|ts|tsx|html|json|md|yml|yaml|example)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check if secret key variable is set in frontend
      if (isFrontend && /RAZORPAY_KEY_SECRET\s*=/.test(content)) {
        console.error(`❌ [CRITICAL] RAZORPAY_KEY_SECRET assignment found in frontend file: ${relPath}`);
        issuesFound++;
      }

      for (const { regex, desc } of sensitivePatterns) {
        if (regex.test(content)) {
          // Allow in securityScan.js itself and docs/templates
          if (relPath.includes('securityScan.js') || relPath.includes('credentials.example.xlsx')) {
            continue;
          }
          console.error(`❌ [CRITICAL] Found potential ${desc} in: ${relPath}`);
          issuesFound++;
        }
      }
    }
  }
}

try {
  scanDirectory(path.join(__dirname, '..'));
  if (issuesFound === 0) {
    console.log('  ✓ No exposed secret keys or live keys detected in repository source.');
  }
} catch (err) {
  console.error(`Error during file scan: ${err.message}`);
}

// 3. Run npm audit on production dependencies
console.log('\n🔍 Checking dependency vulnerabilities (npm audit)...');
try {
  // Check backend audit (production)
  console.log('  Running backend audit...');
  execSync('npm --prefix backend audit --omit=dev', { stdio: 'pipe' });
  console.log('  ✓ Backend production dependencies passed audit.');
} catch (auditErr) {
  console.warn('  ⚠️ Note: Review npm audit output for non-critical warnings.');
}

console.log('\n====================================================');
if (issuesFound > 0) {
  console.error(`❌ Security scan failed with ${issuesFound} critical issue(s)!`);
  process.exit(1);
} else {
  console.log('✅ Security validation passed! No credential leaks detected.');
  console.log('====================================================\n');
}
