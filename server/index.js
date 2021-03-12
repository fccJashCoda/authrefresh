const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const auth = require('./auth/index');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8080',
  })
);

// Router
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log('something went wrong', res.statusCode || 'potato');
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5431;
mongoose
  .connect('mongodb://localhost:27017/authrefresh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    })
  )
  .catch((err) => console.log('RuhRoh!😱'));
