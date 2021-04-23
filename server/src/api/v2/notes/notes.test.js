const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');

const app = require('../../../app');

const user = {
  username: 'steve',
  password: 'absolutely',
};

describe('GET /api/v2/notes/', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app).get('/api/v2/notes/').expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
  });
  describe('Authorized access tests', async () => {
    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/v2/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
    it('returns a list of notes', async () => {
      const response = await authenticatedUser
        .get('/api/v2/notes/')
        .expect(200);
      expect(response.body).to.be.an('array');
    });
  });
});

describe('POST /api/v2/notes/', () => {
  describe('Unauthorized access tests', () => {
    it('returns a 401 if no user is logged in', async () => {
      const response = await request(app)
        .post('/api/v2/notes/')
        .send({
          title: 'lorem ipsum',
          text:
            "Mi'au miaŭ mjau nyav meogre. Mjá miyav miyāʾūṉ meong mňau miyāʾūṉ mi'au mjá meo miau. Miyāʾūṉ nyav mjau mjau miaŭ miav muning miyav meo miaou. Miaŭ ngiyaw miao miav νιάου mňau. Miauw νιάου miyav mi'au mao νιάου νιάου νιάου.",
        })
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
  });
  describe('Authorized access tests', async () => {
    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/v2/login')
        .send(user)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
    it('returns an error if no title is provided', async () => {
      const response = await authenticatedUser
        .post('/api/v2/notes')
        .send({
          title: '',
          text:
            "Mi'au miaŭ mjau nyav meogre. Mjá miyav miyāʾūṉ meong mňau miyāʾūṉ mi'au mjá meo miau. Miyāʾūṉ nyav mjau mjau miaŭ miav muning miyav meo miaou. Miaŭ ngiyaw miao miav νιάου mňau. Miauw νιάου miyav mi'au mao νιάου νιάου νιάου.",
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"title" is not allowed to be empty',
      );
    });
    it('returns an error if no title is provided', async () => {
      const response = await authenticatedUser
        .post('/api/v2/notes')
        .send({
          title: 'lorem ipsum',
          text: '',
        })
        .expect(422);
      expect(response.body.message).to.equal(
        '"text" is not allowed to be empty',
      );
    });
    it('returns a message when a notes is successfully posted', async () => {
      const response = await authenticatedUser
        .post('/api/v2/notes/')
        .send({
          title: 'lorem ipsum',
          text:
            "Mi'au miaŭ mjau nyav meogre. Mjá miyav miyāʾūṉ meong mňau miyāʾūṉ mi'au mjá meo miau. Miyāʾūṉ nyav mjau mjau miaŭ miav muning miyav meo miaou. Miaŭ ngiyaw miao miav νιάου mňau. Miauw νιάου miyav mi'au mao νιάου νιάου νιάου.",
        })
        .expect(200);
      expect(response.body.message).to.equal('Note created');
    });
  });
});

describe('DELETE /api/v2/notes/:id', () => {
  describe('Unauthorized access tests', () => {
    it('it returns a 401 if no user is logged in', async () => {
      const response = await request(app)
        .delete('/api/v2/notes/:5456465')
        .expect(401);
      expect(response.body.message).to.equal('Unauthorized access');
    });
  });
  describe('Authorized access tests', () => {
    let id = null;
    const authenticatedUser = request.agent(app);
    before((done) => {
      authenticatedUser
        .post('/auth/v2/login')
        .send(user)
        .end(async (err, res) => {
          expect(res.statusCode).to.equal(200);
          const response = await authenticatedUser
            .post('/api/v2/notes/')
            .send({
              title: 'lorem ipsum',
              text:
                "Mi'au miaŭ mjau nyav meogre. Mjá miyav miyāʾūṉ meong mňau miyāʾūṉ mi'au mjá meo miau. Miyāʾūṉ nyav mjau mjau miaŭ miav muning miyav meo miaou. Miaŭ ngiyaw miao miav νιάου mňau. Miauw νιάου miyav mi'au mao νιάου νιάου νιάου.",
            })
            .expect(200);
          id = response.body.note._id;
          done();
        });
    });
    it('throws an error if the id format is not valid', async () => {
      const response = await authenticatedUser
        .delete('/api/v2/notes/605ba95d9b6')
        .expect(500);
      expect(response.body.message).to.equal('Invalid note Id');
    });
    it('returns a confirmation after deleting a note', async () => {
      const response = await authenticatedUser
        .delete(`/api/v2/notes/${id}`)
        .expect(200);
      expect(response.body.message).to.equal(`Deleted note with id: ${id}`);
    });
  });
  after(async () => {
    await mongoose.connection.db.dropCollection('notes');
  });
});
