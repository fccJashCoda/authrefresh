const express = require('express');
const middleware = require('./auth.middleware');
const controller = require('./auth.controller');

const router = express.Router();

const signInError = 'Username unavailable';
const defaultLoginError = 'Unable to login';

// @route GET /auth/
// @desc ping auth
// @access public
router.get('/', controller.get);

// @route GET /auth/science
// @desc it's clearly a teapot
// @access public
router.get('/science', controller.science);

// @route GET /auth/signup
// @desc create a new user
// @access public
router.post(
  '/signup',
  middleware.validateBody(),
  middleware.findUser(signInError, (user) => user, 409),
  controller.signup,
);

// @route GET /auth/login
// @desc login user
// @access public
router.post(
  '/login',
  middleware.validateBody(defaultLoginError),
  middleware.findUser(defaultLoginError, (user) => !(user && user.active)),
  controller.login,
);

module.exports = router;
