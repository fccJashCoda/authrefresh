const express = require('express');
const middleware = require('./auth.middleware');

const controller = require('./auth.controller');

const router = express.Router();

router.get('/', controller.get);
router.get('/science', controller.science);
router.post('/signup', middleware.validateBody(), controller.signup);
router.post(
  '/login',
  middleware.validateBody('Unable to login'),
  controller.login,
);

module.exports = router;
