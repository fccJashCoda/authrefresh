const express = require('express');
const authController = require('./auth.controller');
const middleware = require('./auth.middleware');

const router = express.Router();

const defaultLoginError = 'Unable to login';
const signInError = 'Username unavailable';

router.get('/', authController.get);
router.get('/science', authController.science);
router.get('/user', authController.checkUser);
router.post(
  '/signup',
  middleware.validateBody(),
  middleware.findUser(signInError, (user) => user, 409),
  authController.signup,
);
router.post(
  '/login',
  middleware.validateBody(defaultLoginError),
  middleware.findUser(defaultLoginError, (user) => !(user && user.active)),
  authController.login,
);
router.get('/logout', authController.logout);

module.exports = router;
