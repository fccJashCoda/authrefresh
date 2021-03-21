const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const auth = require('./auth/index');
const notes = require('./api/notes');
const users = require('./api/users');
const middlewares = require('./auth/middleware');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8080',
  })
);
app.use(helmet());
app.use(middlewares.checkTokenSetUser);

// Router
app.use('/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);
app.use('/api/v1/users', middlewares.isLoggedIn, middlewares.isAdmin, users);

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    message: 'Hello World!',
  });
});

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  if (res.statusCode === 200) {
    res.status(500);
  }
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

let dbURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === 'test') {
  dbURL = process.env.TEST_MONGO_URI;
}

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch(() => {
    throw new Error('Failed to connect to the database.');
  });

module.exports = app;