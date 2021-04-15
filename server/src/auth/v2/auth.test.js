const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');

const app = require('../../app');

mongoose.models = {};
mongoose.modelSchemas = {};

describe('GET /auth/v2/', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/auth/v2/').expect(200);
    expect(response.body.message).to.equal('auth router v2 🐾');
  });
});

describe('Sign-up Suite', () => {
  describe('POST /auth/v2/signup', () => {
    it('should require a username', async () => {
      const response = await request(app)
        .post('/auth/v2/signup')
        .send({})
        .expect(422);
      expect(response.body.message).to.equal('"username" is required');
    });
    it('should require a password', async () => {
      const response = await request(app)
        .post('/auth/v2/signup')
        .send({ username: 'TestDummy' })
        .expect(422);
      expect(response.body.message).to.equal('"password" is required');
    });
    it('username should be at least 3 characters long', async () => {
      const response = await request(app)
        .post('/auth/v2/signup')
        .send({ username: 'ab' })
        .expect(422);
      expect(response.body.message).to.equal(
        '"username" length must be at least 3 characters long'
      );
    });
    it('password should match the base regex pattern', async () => {
      const response = await request(app)
        .post('/auth/v2/signup')
        .send({
          username: 'steve',
          password: 'ab',
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"password" with value "ab" fails to match the required pattern: /^[a-zA-Z0-9_]{8,30}$/'
      );
    });
  });

  describe('POST /auth/v2/signup - Registration test', () => {
    before(async () => {
      await mongoose.connection.db.dropCollection('users');
    });
    it('should return a token and username on signup success', async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/v2/signup')
        .send(newUser)
        .expect(200);
      expect(response.body).to.have.property('token');
      expect(response.body.data.payload.username).to.equal(newUser.username);
    });
    it("doesn't allow registration with an existing username", async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/v2/signup')
        .send(newUser)
        .expect(409);
      expect(response.body.message).to.equal('Username unavailable');
    });
  });
});

describe('Login Suite', () => {
  describe('POST /auth/v2/login', () => {
    it('returns an error if no username is provided', async () => {
      const invalidUser = {
        username: '',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/v2/login')
        .send(invalidUser)
        .expect(422);
      expect(response.body.message).to.equal('Unable to login');
    });
    it('returns an error if no password is provided', async () => {
      const invalidUser = {
        username: 'steve',
        password: '',
      };

      const response = await request(app)
        .post('/auth/v2/login')
        .send(invalidUser)
        .expect(422);
      expect(response.body.message).to.equal('Unable to login');
    });
    it('returns a 422 with an invalid username', async () => {
      const invalidUser = {
        username: 'STEVE',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/v2/login')
        .send(invalidUser)
        .expect(422);
      expect(response.body.message).to.equal('Unable to login');
    });
    it('returns a 401 with an invalid password', async () => {
      const invalidUser = {
        username: 'steve',
        password: 'ABSOLUTELY',
      };

      const response = await request(app)
        .post('/auth/v2/login')
        .send(invalidUser)
        .expect(401);
      expect(response.body.message).to.equal('Invalid Username or Password');
    });
    it('returns a token when logged in with valid credentials', async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/v2/login')
        .send(newUser)
        .expect(200);
      expect(response.body).to.have.property('token');
    });
  });
});
