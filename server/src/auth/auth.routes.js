const express = require('express');

const controller = require('./auth.controller');

const router = express.Router();

router.get('/', controller.get);

router.get('/science', controller.science);

// @POST /signup
// @desc create a new account
// @access public
router.post('/signup', controller.signup);

// @POST /login
// @desc login an account
// @access public
router.post('/login', controller.login);

module.exports = router;
