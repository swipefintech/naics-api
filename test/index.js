const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('returns 200', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});
