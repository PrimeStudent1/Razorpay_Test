const path = require('path');
// Load environment variables from backend/.env or root .env
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config(); // Fallback to root if any

const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');
const { maskKeyId, isTestMode } = require('./services/razorpay');

const app = express();
const PORT = process.env.PORT || 8080;

// Security & Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health check endpoint required by CI/CD specification
app.get('/api/health', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

  res.status(200).json({
    success: true,
    service: 'Razorpay Test Gateway',
    status: 'healthy',
    mode: isTestMode(keyId) ? 'test' : 'unverified',
    configured: Boolean(keyId && hasSecret),
    maskedKeyId: maskKeyId(keyId),
    timestamp: new Date().toISOString(),
  });
});

// Mount Payment Routes
app.use('/api/payment', paymentRoutes);

// Serve built frontend assets in production mode (Docker / Production build)
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    // Avoid intercepting API routes that returned 404
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 Handler for API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled server error:', err);
  }
  // Ensure we NEVER leak stack traces or secret keys in response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Server Startup (Only listen directly if run as main entry point, not in test runners)
if (require.main === module) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
  const testMode = isTestMode(keyId);

  console.log('\n======================================================');
  console.log('   🚀 Razorpay Test Gateway Backend is Running       ');
  console.log('======================================================');
  console.log(`  🌐 Server URL       : http://localhost:${PORT}`);
  console.log(`  🔍 Health Check     : http://localhost:${PORT}/api/health`);
  console.log(`  🔑 Key ID           : ${maskKeyId(keyId)}`);
  console.log(`  🔒 Key Secret       : ${hasSecret ? 'CONFIGURED (Masked)' : 'MISSING ⚠️'}`);
  console.log(`  ⚡ Gateway Mode     : ${testMode ? 'TEST MODE ✓' : 'WARNING: Non-test key ⚠️'}`);
  console.log(`  🏷️  Deployment Mode  : ${process.env.RAZORPAY_MODE || 'TEST'}`);
  console.log('======================================================\n');

  if (!testMode && keyId) {
    console.warn('⚠️  [SECURITY WARNING] Non-test Key ID detected. This application is restricted to TEST MODE.\n');
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = app;