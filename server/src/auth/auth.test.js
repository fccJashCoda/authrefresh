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

describe('Sign-up Suite', () => {
  describe('POST /auth/signup', () => {
    it('should require a username', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({})
        .expect(422);
      expect(response.body.message).to.equal('"username" is required');
    });
  });

  describe('POST /auth/signup', () => {
    it('should require a password', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'TestDummy' })
        .expect(422);
      expect(response.body.message).to.equal('"password" is required');
    });
  });

  describe('POST /auth/signup', () => {
    it('should require a password', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'ab' })
        .expect(422);
      expect(response.body.message).to.equal(
        '"username" length must be at least 3 characters long'
      );
    });
  });

  describe('POST /auth/signup', () => {
    it('username should be at least 3 characters long', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'ab' })
        .expect(422);
      expect(response.body.message).to.equal(
        '"username" length must be at least 3 characters long'
      );
    });
  });

  describe('POST /auth/signup', () => {
    it('password should match the base regex pattern', async () => {
      const response = await request(app)
        .post('/auth/signup')
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

  describe('POST /auth/signup', () => {
    before(async () => {
      await mongoose.connection.db.dropCollection('users');
    });
    it('password should match the base regex pattern', async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(newUser)
        .expect(200);
      expect(response.body).to.have.property('token');
      expect(response.body.user).to.equal(newUser.username);
    });
  });

  describe('POST /auth/signup', () => {
    it('should not allow you to register with an existing username', async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(newUser)
        .expect(409);
      expect(response.body.message).to.equal('Username unavailable');
    });
  });
});

describe('Login Suite', () => {
  describe('POST /auth/login', () => {
    it('returns a 401 with an invalid username', async () => {
      const invalidUser = {
        username: 'STEVE',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(invalidUser)
        .expect(401);
      expect(response.body.message).to.equal('Invalid Username or Password');
    });
  });

  describe('POST /auth/login', () => {
    it('returns a 401 with an invalid password', async () => {
      const invalidUser = {
        username: 'steve',
        password: 'ABSOLUTELY',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(invalidUser)
        .expect(401);
      expect(response.body.message).to.equal('Invalid Username or Password');
    });
  });

  describe('POST /auth/login', () => {
    it('returns a token when logged in with valid credentials', async () => {
      const newUser = {
        username: 'steve',
        password: 'absolutely',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(newUser)
        .expect(200);
      expect(response.body).to.have.property('token');
    });
  });
});
