const express = require('express');
const router = express.Router();
const {
  getRazorpayInstance,
  getPublicConfig,
  testRazorpayConnection,
} = require('../services/razorpay');
const { verifyPaymentSignature } = require('../utils/verifyPayment');

/**
 * Server-Side Product Catalog
 * Critical Security Rule: Never trust client-side prices.
 * The server always calculates the final payable order amount.
 */
const PRODUCT_CATALOG = {
  'nova-headphones': {
    id: 'nova-headphones',
    name: 'NOVA Wireless Headphones',
    price: 2499, // INR
    currency: 'INR',
    description: 'Immersive sound, premium comfort and all-day battery life',
    inStock: true,
  },
  'single-room': {
    id: 'single-room',
    name: 'Single Deluxe AC Room (1 Month)',
    price: 12000,
    currency: 'INR',
    description: 'Private room with attached washroom, AC, work desk & 3 meals',
    inStock: true,
  },
  'double-sharing': {
    id: 'double-sharing',
    name: 'Double Sharing Premium AC Room (1 Month)',
    price: 8500,
    currency: 'INR',
    description: 'Spacious 2-sharing room with AC, individual wardrobes & 3 meals',
    inStock: true,
  },
  'triple-sharing': {
    id: 'triple-sharing',
    name: 'Triple Sharing Standard Room (1 Month)',
    price: 6500,
    currency: 'INR',
    description: 'Budget-friendly 3-sharing room with high-speed WiFi & 3 meals',
    inStock: true,
  },
  'token-advance': {
    id: 'token-advance',
    name: 'Bed Reservation Token - Tejus PG',
    price: 2000,
    currency: 'INR',
    description: 'Advance seat booking deposit (deductible from 1st month rent)',
    inStock: true,
  },
  'token-triple': {
    id: 'token-triple',
    name: 'Bed Reservation Token - Triple Sharing',
    price: 1500,
    currency: 'INR',
    description: 'Advance seat booking deposit for Triple Sharing',
    inStock: true,
  },
  '1-share-ac': {
    id: '1-share-ac',
    name: '1-Share AC Room (Tejus PG)',
    price: 11500,
    currency: 'INR',
    description: 'Single Private Room with Split AC & Study Station',
    inStock: true,
  },
  '2-share-non-ac': {
    id: '2-share-non-ac',
    name: '2-Share Non-AC Room (Tejus PG)',
    price: 7500,
    currency: 'INR',
    description: 'Double Sharing Room with Personal Wardrobe & Cooler',
    inStock: true,
  },
  '2-share-ac': {
    id: '2-share-ac',
    name: '2-Share AC Room (Tejus PG)',
    price: 8800,
    currency: 'INR',
    description: 'Double Sharing AC Room with Geyser & Study Desk',
    inStock: true,
  },
  '3-share-ac': {
    id: '3-share-ac',
    name: '3-Share AC Room (Tejus PG)',
    price: 7200,
    currency: 'INR',
    description: 'Triple Sharing AC Room with Individual Lockers',
    inStock: true,
  },
};

/**
 * GET /api/payment/config
 * Returns public configuration (Key ID only, test mode flag)
 * NEVER returns Key Secret.
 */
router.get('/config', (req, res) => {
  try {
    const config = getPublicConfig();
    return res.json({
      success: true,
      ...config,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment gateway configuration',
      error: error.message,
    });
  }
});

/**
 * GET /api/payment/test-connection
 * Tests communication with Razorpay API and validates credentials
 */
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testRazorpayConnection();
    const statusCode = result.success ? 200 : 400;
    return res.status(statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error during connection test',
      error: error.message,
    });
  }
});

/**
 * GET /api/payment/products
 * Returns available products from server catalog
 */
router.get('/products', (req, res) => {
  return res.json({
    success: true,
    products: Object.values(PRODUCT_CATALOG),
  });
});

/**
 * POST /api/payment/create-order
 * Creates a new Razorpay order.
 * Calculates order amount securely on the server when productId is provided.
 */
router.post('/create-order', async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      customer = {},
      shippingAddress = {},
      amount: directAmount,
      currency = 'INR',
      notes = {},
      receipt,
    } = req.body;

    let finalAmountInRupees;
    let productName = 'Tejus PG Booking';

    // 1. Server-Side Price Calculation (E-Commerce Flow)
    if (productId) {
      const product = PRODUCT_CATALOG[productId];
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      const parsedQty = parseInt(quantity, 10);
      if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 10) {
        return res.status(400).json({
          success: false,
          message: 'Invalid quantity. Must be an integer between 1 and 10.',
        });
      }

      // Calculate total strictly on backend
      finalAmountInRupees = product.price * parsedQty;
      productName = product.name;
    } else {
      // 2. Direct Amount Flow (API compatibility for tests)
      const parsedAmount = parseFloat(directAmount);
      if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount. Amount must be a positive number greater than 0.',
        });
      }
      finalAmountInRupees = parsedAmount;
    }

    // Convert rupees to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(finalAmountInRupees * 100);

    const razorpay = getRazorpayInstance();
    const uniqueReceipt = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderOptions = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: uniqueReceipt,
      notes: {
        store: 'Tejus PG',
        productName,
        productId: productId || 'custom',
        quantity: String(quantity),
        customerName: customer.name || 'Guest',
        customerEmail: customer.email || '',
        city: shippingAddress.city || '',
        ...notes,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Return ONLY safe public properties to frontend
    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount, // in paise
      amountInRupees: finalAmountInRupees,
      currency: order.currency,
      receipt: order.receipt,
      productName,
      keyId: process.env.RAZORPAY_KEY_ID,
      createdAt: order.created_at,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message || error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.error?.description || error.message || 'Failed to create Razorpay order',
      code: error.error?.code || 'ORDER_CREATION_FAILED',
    });
  }
});

/**
 * POST /api/payment/verify
 * Cryptographically verifies HMAC-SHA256 signature from Razorpay Checkout
 */
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency = 'INR',
      orderData = {},
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature)',
      });
    }

    // Verify HMAC-SHA256 signature
    const verification = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!verification.isValid) {
      console.warn(`[SECURITY] Signature verification failed for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: verification.error || 'Payment verification failed: Invalid signature',
      });
    }

    // Optional: Fetch live payment details from Razorpay to get method, bank, email, etc.
    let paymentDetails = null;
    try {
      const razorpay = getRazorpayInstance();
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      paymentDetails = {
        method: payment.method,
        status: payment.status,
        email: payment.email,
        contact: payment.contact,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa,
        fee: payment.fee,
        tax: payment.tax,
      };
    } catch (fetchErr) {
      // Non-critical if fetch fails, signature is already verified
      console.warn('Could not fetch extra payment details from Razorpay:', fetchErr.message);
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully! Test transaction completed.',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signatureVerified: true,
      amount: amount || undefined,
      currency: currency || 'INR',
      productName: orderData.productName || 'NOVA Wireless Headphones',
      quantity: orderData.quantity || 1,
      paymentDetails,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error during payment verification:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during payment verification',
      error: error.message,
    });
  }
});

/**
 * POST /api/payment/create-payment-link
 * Creates an official Razorpay Hosted Payment Link for direct new-tab checkout.
 */
router.post('/create-payment-link', async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      customer = {},
      amount: directAmount,
      currency = 'INR',
      notes = {},
      callbackUrl,
    } = req.body;

    let finalAmountInRupees;
    let productName = 'Tejus PG Bed Reservation';

    if (productId) {
      const product = PRODUCT_CATALOG[productId];
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }
      finalAmountInRupees = product.price * parseInt(quantity, 10);
      productName = product.name;
    } else {
      const parsedAmount = parseFloat(directAmount);
      if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount. Amount must be a positive number greater than 0.',
        });
      }
      finalAmountInRupees = parsedAmount;
    }

    const amountInPaise = Math.round(finalAmountInRupees * 100);
    const razorpay = getRazorpayInstance();

    // Clean phone number (Razorpay requires valid contact if provided)
    let contact;
    if (customer.phone) {
      const cleaned = customer.phone.replace(/\D/g, '').slice(-10);
      if (cleaned.length === 10) {
        contact = `+91${cleaned}`;
      }
    }

    const linkPayload = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      accept_partial: false,
      description: `${productName} Booking`,
      customer: {
        name: customer.name || 'Resident',
        email: customer.email || 'resident@tejuspg.com',
        ...(contact ? { contact } : {}),
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: false,
      notes: {
        store: 'Tejus PG',
        productName,
        productId: productId || 'custom',
        customerName: customer.name || '',
        ...notes,
      },
    };

    if (callbackUrl) {
      linkPayload.callback_url = callbackUrl;
      linkPayload.callback_method = 'get';
    }

    const paymentLink = await razorpay.paymentLink.create(linkPayload);

    return res.status(201).json({
      success: true,
      paymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.short_url,
      amount: paymentLink.amount,
      amountInRupees: finalAmountInRupees,
      currency: paymentLink.currency,
      productName,
    });
  } catch (error) {
    console.error('Error creating Razorpay payment link:', error.message || error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.error?.description || error.message || 'Failed to create payment link',
      code: error.error?.code || 'PAYMENT_LINK_CREATION_FAILED',
    });
  }
});

module.exports = router;