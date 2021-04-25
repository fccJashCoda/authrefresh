const request = require('supertest');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

const app = require('../../../app');

const regularUser = {
  username: 'steve',
  password: 'absolutely',
};

const admin = {
  username: 'admin',
  password: 'notadmin1234',
};

let userId = null;

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

describe('GET /api/v2/users/', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app).get('/api/v2/users/').expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/v2/login')
        .send(regularUser)
        .end(async (err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          await jwt.verify(token, process.env.SECRET_KEY, (oops, content) => {
            if (oops) console.log(err);
            userId = content._id;
          });
          done();
        });
    });
    it('returns a 401 for a regular user', async () => {
      const response = await authenticatedUser
        .post('/api/v2/users/')
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
        .post('/auth/v2/login')
        .send(admin)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns a list of users when accessed by an admin', async () => {
      const response = await authenticatedUser
        .get('/api/v2/users/')
        .set('Authorization', `bearer ${token}`)
        .expect(200);
      expect(response.body).to.be.an('array');
    });
  });
});

describe('PATCH /api/v2/users/:id', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app)
        .patch('/api/v2/users/1111')
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
    let token = null;

    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/v2/login')
        .send(regularUser)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns a 401 for a regular user', async () => {
      const response = await authenticatedUser
        .patch('/api/v2/users/1111')
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
        .post('/auth/v2/login')
        .send(admin)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          token = res.body.token;
          done();
        });
    });
    it('returns an error if the id is invalid', async () => {
      const response = await authenticatedUser
        .patch('/api/v2/users/potato')
        .set('Authorization', `bearer ${token}`)
        .expect(500);
      expect(response.body.message).to.equal(
        'Cast to ObjectId failed for value "potato" at path "_id" for model "User"'
      );
    });
    it('returns an error if the id is not attributed', async () => {
      const response = await authenticatedUser
        .patch('/api/v2/users/5ead965726509e70bef52f83')
        .set('Authorization', `bearer ${token}`)
        .expect(404);
      expect(response.body.message).to.equal(
        'Not Found - /api/v2/users/5ead965726509e70bef52f83'
      );
    });
    it('returns a confirmation after a successfull operation', async () => {
      const response = await authenticatedUser
        .patch(`/api/v2/users/${userId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);
      expect(response.body.message).to.equal(`User with id ${userId} modified`);
      expect(response.body).to.have.property('update');
    });
    it('returns a 422 if validation fails for username', async () => {
      const response = await authenticatedUser
        .patch(`/api/v2/users/${userId}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          username: 'st',
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"username" length must be at least 3 characters long'
      );
    });
    it('returns a 422 if validation fails for password', async () => {
      const response = await authenticatedUser
        .patch(`/api/v2/users/${userId}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          password: 'st',
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"password" with value "st" fails to match the required pattern: /^[a-zA-Z0-9_]{8,30}$/'
      );
    });
    it('returns a 422 if validation fails for roles', async () => {
      const response = await authenticatedUser
        .patch(`/api/v2/users/${userId}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          roles: 'manager',
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"roles" must be one of [user, admin]'
      );
    });
    it('returns a 422 if validation fails for active', async () => {
      const response = await authenticatedUser
        .patch(`/api/v2/users/${userId}`)
        .set('Authorization', `bearer ${token}`)
        .send({
          active: 'no',
        })
        .expect(422);
      expect(response.body.message).to.equal('"active" must be a boolean');
    });
  });
});
