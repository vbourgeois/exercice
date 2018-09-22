const app = require('src/app');
const request = require('supertest');

describe('rest API', () => {
  it('GET /rest', async () => {
    const { status, body } = await request(app).get('/rest');

    expect(status).toBe(200);
    expect(body).toEqual({
      test: 'some data',
    });
  });
});
