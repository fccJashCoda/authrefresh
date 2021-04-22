const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
// const auth = require('./auth/auth.routes');
const notes = require('./api/notes/notes.router');
// const users = require('./api/users/users.router');
const notesv2 = require('./api/v2/notes/notes.router');
const usersv2 = require('./api/v2/users/users.router');
const middlewares = require('./auth/auth.middleware');
const middleware = require('./auth/v2/auth.middleware');
const auth = require('./auth/v2/auth.routes');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('tiny'));
}
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(helmet());
app.use(middlewares.checkTokenSetUser);

// Router
// app.use('/auth', auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes);
// app.use('/api/v1/users', middlewares.isLoggedIn, middlewares.isAdmin, users);
app.use('/auth/v2/', auth);
app.use('/api/v2/notes', middleware.checkCookies, notesv2);
app.use('/api/v2/users', middlewares.isLoggedIn, middlewares.isAdmin, usersv2);

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
  res.status(res.statusCode === 200 ? 500 : res.statusCode);
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
