const express = require('express');
const controller = require('./users.controller');
const middleware = require('./users.middleware');

const router = express.Router();

// @route GET /api/v1/users/
// @desc get a list of all users
// @access admin only
router.get('/', controller.getUsers);

// @route PATCH /api/v1/users/:id
// @desc modify a user
// @access admin only
router.patch(
  '/:id',
  middleware.validateBody,
  middleware.findUser,
  controller.updateUser,
);

module.exports = router;
