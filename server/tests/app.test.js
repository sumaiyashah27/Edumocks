const request = require('supertest');
const app = require('../server'); // Or '../server' if inside tests/ folder

describe('Basic route testing', () => {
  it('should return Hello World from /api/hello if route exists', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello World');
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
