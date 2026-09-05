const request = require('supertest');
const crypto = require('crypto');

// Set test environment variables
process.env.RAZORPAY_KEY_ID = 'rzp_test_mockKeyId';
process.env.RAZORPAY_KEY_SECRET = 'test-mock-secret';
process.env.NODE_ENV = 'test';

// Mock Razorpay service to isolate tests from network and real credentials
jest.mock('../services/razorpay', () => {
  const original = jest.requireActual('../services/razorpay');
  const mockOrdersCreate = jest.fn();
  const mockPaymentLinkCreate = jest.fn();
  const mockPaymentsAll = jest.fn();
  const mockPaymentsFetch = jest.fn();

  return {
    ...original,
    getRazorpayInstance: jest.fn(() => ({
      orders: {
        create: mockOrdersCreate,
      },
      paymentLink: {
        create: mockPaymentLinkCreate,
      },
      payments: {
        all: mockPaymentsAll,
        fetch: mockPaymentsFetch,
      },
    })),
    testRazorpayConnection: jest.fn(async () => ({
      success: true,
      message: 'Razorpay Test API connection verified successfully.',
      configured: true,
      maskedKeyId: 'rzp_test_**************',
      isTestMode: true,
      count: 0,
      timestamp: new Date().toISOString(),
    })),
    __mockOrdersCreate: mockOrdersCreate,
    __mockPaymentLinkCreate: mockPaymentLinkCreate,
    __mockPaymentsAll: mockPaymentsAll,
    __mockPaymentsFetch: mockPaymentsFetch,
  };
});

const app = require('../server');
const razorpayService = require('../services/razorpay');

describe('Payment API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/payment/config', () => {
    it('should return public keyId and test mode without leaking secret key', async () => {
      const res = await request(app).get('/api/payment/config');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('keyId', 'rzp_test_mockKeyId');
      expect(res.body).toHaveProperty('isTestMode', true);
      expect(res.body).toHaveProperty('mode', 'test');
      // Critical security check: Never leak secret key
      expect(res.body).not.toHaveProperty('keySecret');
      expect(res.body).not.toHaveProperty('secret');
      expect(res.text).not.toContain('test-mock-secret');
    });
  });

  describe('GET /api/payment/test-connection', () => {
    it('should return 200 when credentials connection check succeeds', async () => {
      const res = await request(app).get('/api/payment/test-connection');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('configured', true);
      expect(res.body).toHaveProperty('isTestMode', true);
    });

    it('should return 400 when connection check fails', async () => {
      razorpayService.testRazorpayConnection.mockResolvedValueOnce({
        success: false,
        message: 'Razorpay API Authentication Error: Invalid credentials',
        configured: true,
        maskedKeyId: 'rzp_test_**************',
        isTestMode: true,
      });

      const res = await request(app).get('/api/payment/test-connection');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Authentication Error');
    });
  });

  describe('POST /api/payment/create-order', () => {
    it('should successfully create an order and convert rupees to paise', async () => {
      razorpayService.__mockOrdersCreate.mockResolvedValueOnce({
        id: 'order_test_mock12345',
        amount: 10000,
        currency: 'INR',
        receipt: 'rcpt_mock_001',
        created_at: 1700000000,
      });

      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 100, currency: 'INR' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('orderId', 'order_test_mock12345');
      expect(res.body).toHaveProperty('amount', 10000); // 100 INR = 10000 paise
      expect(res.body).toHaveProperty('currency', 'INR');
      expect(res.body).toHaveProperty('keyId', 'rzp_test_mockKeyId');

      expect(razorpayService.__mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10000,
          currency: 'INR',
        })
      );
    });

    it('should reject when amount is 0', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid amount');
    });

    it('should reject when amount is negative', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: -50 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid amount');
    });

    it('should reject when amount is invalid / non-numeric', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 'invalid-string' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid amount');
    });

    it('should calculate server-side amount when productId and quantity are provided', async () => {
      razorpayService.__mockOrdersCreate.mockResolvedValueOnce({
        id: 'order_test_product_001',
        amount: 499800, // 2499 * 2 = 4998 INR = 499800 paise
        currency: 'INR',
        receipt: 'rcpt_product_001',
        created_at: 1700000000,
      });

      const res = await request(app)
        .post('/api/payment/create-order')
        .send({
          productId: 'nova-headphones',
          quantity: 2,
          customer: { name: 'Aarav Sharma', email: 'aarav@example.com' },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('amountInRupees', 4998);
      expect(res.body).toHaveProperty('productName', 'NOVA Wireless Headphones');
      expect(razorpayService.__mockOrdersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 499800,
          currency: 'INR',
        })
      );
    });

    it('should reject when productId does not exist in catalog', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ productId: 'non-existent-item', quantity: 1 });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should reject when product quantity is greater than 10', async () => {
      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ productId: 'nova-headphones', quantity: 15 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Invalid quantity');
    });

    it('should handle Razorpay SDK API failure properly', async () => {
      razorpayService.__mockOrdersCreate.mockRejectedValueOnce({
        statusCode: 500,
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'Gateway error from Razorpay',
        },
      });

      const res = await request(app)
        .post('/api/payment/create-order')
        .send({ amount: 150 });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toBe('Gateway error from Razorpay');
    });
  });

  describe('POST /api/payment/verify', () => {
    it('should successfully verify a valid HMAC-SHA256 signature', async () => {
      const orderId = 'order_test_valid_001';
      const paymentId = 'pay_test_valid_001';
      const secret = process.env.RAZORPAY_KEY_SECRET;

      // Compute valid signature
      const validSignature = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      razorpayService.__mockPaymentsFetch.mockResolvedValueOnce({
        method: 'card',
        status: 'captured',
        email: 'test@example.com',
      });

      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: validSignature,
          amount: 100,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('signatureVerified', true);
      expect(res.body).toHaveProperty('paymentId', paymentId);
      expect(res.body).toHaveProperty('orderId', orderId);
    });

    it('should reject an invalid / tampered signature with 400', async () => {
      const orderId = 'order_test_invalid_001';
      const paymentId = 'pay_test_invalid_001';
      const invalidSignature = 'f'.repeat(64); // 64 hex characters but incorrect hash

      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: invalidSignature,
          amount: 100,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('verification failed');
    });

    it('should reject request when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/payment/verify')
        .send({
          razorpay_order_id: 'order_123',
          // missing razorpay_payment_id and razorpay_signature
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toContain('Missing required parameters');
    });
  });

  describe('POST /api/payment/create-payment-link', () => {
    it('should successfully create a payment link and return hosted URL', async () => {
      razorpayService.__mockPaymentLinkCreate.mockResolvedValueOnce({
        id: 'plink_test_mock123',
        short_url: 'https://rzp.io/rzp/testLink',
        amount: 200000,
        currency: 'INR',
      });

      const res = await request(app)
        .post('/api/payment/create-payment-link')
        .send({
          productId: 'token-advance',
          quantity: 1,
          customer: {
            name: 'Aarav Sharma',
            email: 'aarav@example.com',
            phone: '9876543210',
          },
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('paymentLinkId', 'plink_test_mock123');
      expect(res.body).toHaveProperty('paymentLinkUrl', 'https://rzp.io/rzp/testLink');
      expect(res.body).toHaveProperty('amountInRupees', 2000);
    });

    it('should return 404 if product does not exist when creating payment link', async () => {
      const res = await request(app)
        .post('/api/payment/create-payment-link')
        .send({
          productId: 'non-existent-product',
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/unknown-route');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
