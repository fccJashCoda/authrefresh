const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');

const app = require('../app');

mongoose.models = {};
mongoose.modelSchemas = {};

describe('GET /auth/', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/auth/').expect(200);
    expect(response.body.message).to.equal('auth router 🐾');
  });
});

describe('POST /auth/signup', () => {
  it('should require a username', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({})
      .expect(422);
    expect(response.message).to.equal('');
  });
});

describe('POST /auth/signup', () => {
  it('should require a password', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'TestDummy' })
      .expect(422);
  });
});
