const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const tools = require('../utils/tools');

const saltRounds = 12;

const router = express.Router();
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

router.get('/', (req, res) => {
  res.json({
    message: 'auth router says hi',
  });
});

router.get('/science', (req, res, next) => {
  tools.returnError(418, "I'm a teapot!", res, next);
});

// @POST /signup
// @desc create a new account
// @access public
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  const value = schema.validate({ username, password });
  if (value.error) {
    return next(value.error);
  }

  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      return tools.returnError(409, 'Username already taken', res, next);
    }
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => {
        const user = new User({
          username,
          password: hash,
        });

        user.save().then((newUser) => {
          res.json({
            username: newUser.username,
            _id: newUser._id,
          });
        });
      })
      .catch((err) => {
        tools.returnError(500, 'Unexpected server error', res, next);
      });
  });
});

// @POST /login
// @desc login an account
// @access public
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return tools.returnError(422, 'Missing Username or Password', res, next);
  }

  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password).then((valid) => {
          if (valid) {
            return res.json({ message: 'Party time 🎈🎊' });
          }
          return tools.returnError(
            401,
            'Invalid Username or Password',
            res,
            next
          );
        });
      } else {
        return tools.returnError(
          401,
          'Invalid Username or Password',
          res,
          next
        );
      }
    })
    .catch((err) => {
      tools.returnError(500, 'RuhRoh! 😱 Unexpected server error!', res, next);
    });
});

module.exports = router;
