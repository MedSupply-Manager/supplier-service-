const request = require('supertest');
const app = require('../src/index');

describe('Product Service API', () => {
  it('GET /api/products should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
