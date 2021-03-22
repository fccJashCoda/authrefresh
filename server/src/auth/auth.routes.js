const express = require('express');
const middleware = require('./auth.middleware');

const controller = require('./auth.controller');

const router = express.Router();

const foo = (message) => (req, res, next) => {
  if (req.params.test === 'fish') {
    next();
  } else {
    const error = new Error(message || 'bar');
    next(error);
  }
};

router.get('/', controller.get);

router.get('/science', controller.science);

router.post('/signup', middleware.validateBody(), controller.signup);

router.post('/login', middleware.validateBody(), controller.login);

router.get('/:test', foo(), (req, res) => {
  res.json({ message: 'Goodbye and thanks for all the fish!' });
});

module.exports = router;
