/**
 * Dedicated API Service for Payment Gateway & Store Communication
 * Clean, modular abstraction layer between React UI and Express backend.
 */

export async function getGatewayConfig() {
  const res = await fetch('/api/payment/config');
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch gateway configuration');
  }
  return data;
}

export async function testGatewayConnection() {
  const res = await fetch('/api/payment/test-connection');
  const data = await res.json();
  return {
    ok: res.ok,
    ...data,
  };
}

export async function createProductOrder({
  productId = 'nova-headphones',
  quantity = 1,
  customer = {},
  shippingAddress = {},
}) {
  const res = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      quantity,
      customer,
      shippingAddress,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to initialize order on server');
  }
  return data;
}

export async function verifyPaymentSignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  amount,
  orderData = {},
}) {
  const res = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      orderData,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Payment signature verification failed');
  }
  return data;
}
