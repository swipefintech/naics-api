const assert = require('assert');
const request = require('supertest');
const app = require('../../app');

describe('GET /api/', () => {
  it('returns 200', (done) => {
    request(app)
      .get('/api/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        assert(response.body.alive === true);
        done();
      })
      .catch((err) => done(err));
  });
});
