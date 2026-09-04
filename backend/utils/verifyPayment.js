const crypto = require('crypto');

/**
 * Verifies Razorpay payment signature using HMAC-SHA256.
 *
 * Signature format:
 * HMAC_SHA256(order_id + "|" + payment_id, secret)
 *
 * @param {Object} params
 * @param {string} params.razorpay_order_id - The order ID created by Razorpay
 * @param {string} params.razorpay_payment_id - The payment ID returned after user payment
 * @param {string} params.razorpay_signature - The signature to verify
 * @returns {{ isValid: boolean, error?: string }}
 */
function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      isValid: false,
      error: 'Missing required payment verification parameters (order_id, payment_id, signature)',
    };
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return {
      isValid: false,
      error: 'Server configuration error: Razorpay Secret is not set on the backend',
    };
  }

  try {
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload.toString())
      .digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const signatureBuf = Buffer.from(razorpay_signature, 'utf8');

    if (expectedBuf.length !== signatureBuf.length) {
      return {
        isValid: false,
        error: 'Signature length mismatch. Verification failed.',
      };
    }

    const isValid = crypto.timingSafeEqual(expectedBuf, signatureBuf);

    return {
      isValid,
      error: isValid ? undefined : 'Signature verification failed. The payment authenticity could not be verified.',
    };
  } catch (err) {
    return {
      isValid: false,
      error: `Error calculating signature: ${err.message}`,
    };
  }
}

module.exports = {
  verifyPaymentSignature,
};
