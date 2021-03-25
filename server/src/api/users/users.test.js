const request = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const app = require('../../app');

const regularUser = {
  username: 'steve',
  password: 'absolutely',
};

const admin = {
  username: 'admin',
  password: 'notadmin1234',
};

async function mockAdmin() {
  console.log('Seeding mock database with a mock admin');
  const hash = await bcrypt.hash('notadmin1234', 12);

  const insertion = new User({
    username: 'admin',
    password: hash,
    role: 'admin',
  });

  await insertion.save();
}

mockAdmin();

describe('GET /api/v1/users/', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app).get('/api/v1/users/').expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/login')
        .send(regularUser)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns a 401 for a regular user', async () => {
      const response = await authenticatedUser
        .post('/api/v1/users/')
        .set('Authorization', `bearer ${token}`)
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
  });
  describe('Authorized access', () => {
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/login')
        .send(admin)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns a list of users when accessed by an admin', async () => {
      const response = await authenticatedUser
        .get('/api/v1/users/')
        .set('Authorization', `bearer ${token}`)
        .expect(200);
      expect(response.body).to.be.an('array');
    });
  });
});

describe('PATCH /api/v1/users/:id', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app)
        .patch('/api/v1/users/1111')
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/login')
        .send(regularUser)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns a 401 for a regular user', async () => {
      const response = await authenticatedUser
        .patch('/api/v1/users/1111')
        .set('Authorization', `bearer ${token}`)
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
  });
  describe('Authorized access', () => {
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/login')
        .send(admin)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns an error if the id is invalid', async () => {
      const response = await authenticatedUser
        .patch('/api/v1/users/potato')
        .set('Authorization', `bearer ${token}`)
        .expect(500);
      expect(response.body.message).to.equal(
        'Cast to ObjectId failed for value "potato" at path "_id" for model "User"',
      );
    });
    it('returns an error if the id is not attributed', async () => {
      const response = await authenticatedUser
        .patch('/api/v1/users/5ead965726509e70bef52f83')
        .set('Authorization', `bearer ${token}`)
        .expect(404);
      expect(response.body.message).to.equal(
        'Not Found - /api/v1/users/5ead965726509e70bef52f83',
      );
    });
  });
});
