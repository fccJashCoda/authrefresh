const express = require('express');
const middleware = require('./auth.middleware');
const controller = require('./auth.controller');

const router = express.Router();

const signInError = 'Username unavailable';
const defaultLoginError = 'Unable to login';

router.get('/', controller.get);
router.get('/science', controller.science);
router.post(
  '/signup',
  middleware.validateBody(),
  middleware.findUser(signInError, (user) => user, 409),
  controller.signup,
);
router.post(
  '/login',
  middleware.validateBody(defaultLoginError),
  middleware.findUser(defaultLoginError, (user) => !(user && user.active)),
  controller.login,
);

module.exports = router;
