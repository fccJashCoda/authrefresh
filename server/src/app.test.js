const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');

const app = require('./app');

mongoose.models = {};
mongoose.modelSchemas = {};

describe('app', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/').expect(200);
    expect(response.body.message).to.equal('Hello World!');
  });
});
