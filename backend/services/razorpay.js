const Razorpay = require('razorpay');

/**
 * Masks a Key ID for safe display
 */
function maskKeyId(keyId) {
  if (!keyId) return 'NOT_CONFIGURED';
  if (keyId.startsWith('rzp_test_')) {
    return 'rzp_test_' + '*'.repeat(Math.max(keyId.length - 9, 8));
  }
  return keyId.substring(0, 4) + '*'.repeat(Math.max(keyId.length - 4, 8));
}

/**
 * Checks if credentials are test mode
 */
function isTestMode(keyId) {
  return typeof keyId === 'string' && keyId.startsWith('rzp_test_');
}

/**
 * Initializes and returns a Razorpay client instance
 */
function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    const error = new Error('Razorpay credentials are not configured in backend/.env');
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Returns public configuration safe for frontend consumption.
 * CRITICAL: NEVER include the secret key here!
 */
function getPublicConfig() {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

  return {
    isConfigured: Boolean(key_id && hasSecret),
    isTestMode: isTestMode(key_id),
    keyId: key_id, // Key ID is public and required by Razorpay Checkout script
    maskedKeyId: maskKeyId(key_id),
    currency: 'INR',
    mode: 'test',
  };
}

/**
 * Validates connection with Razorpay API by querying a minimal list.
 */
async function testRazorpayConnection() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return {
      success: false,
      message: 'Razorpay credentials are missing in backend configuration.',
      configured: false,
      maskedKeyId: 'NOT_SET',
      isTestMode: false,
    };
  }

  try {
    const instance = getRazorpayInstance();
    // Test API call to verify key_id and key_secret validity
    const payments = await instance.payments.all({ count: 1 });
    
    return {
      success: true,
      message: 'Razorpay Test API connection verified successfully.',
      configured: true,
      maskedKeyId: maskKeyId(key_id),
      isTestMode: isTestMode(key_id),
      count: Array.isArray(payments?.items) ? payments.items.length : 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Razorpay API Authentication Error: ${error.error?.description || error.message || 'Invalid credentials'}`,
      configured: true,
      maskedKeyId: maskKeyId(key_id),
      isTestMode: isTestMode(key_id),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  getRazorpayInstance,
  getPublicConfig,
  testRazorpayConnection,
  maskKeyId,
  isTestMode,
};
