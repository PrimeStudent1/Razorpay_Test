const request = require('supertest');
const app = require('../server');

describe('GET /api/health - Health Check Endpoint', () => {
  it('should return 200 with service name, healthy status, and test mode', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('service', 'Razorpay Test Gateway');
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('mode');
    expect(res.body).toHaveProperty('timestamp');
  });
});
