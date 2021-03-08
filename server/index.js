const express = require('express');
const morgan = require('morgan');
const auth = require('./auth/index');

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded());
app.use(express.json());

// Router
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5431;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
