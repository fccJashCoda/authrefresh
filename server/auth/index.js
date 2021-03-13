const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 12;

const returnError = (code, res, next) => {
  const messages = {
    401: 'Invalid Username or Password',
    409: 'Username already taken',
    418: "I'm a teapot!",
    422: 'Missing Username or Password',
    500: 'RuhRoh! 😱 Unexpected server error!',
  };
  const error = new Error(messages[code]);
  res.status(code);
  next(error);
};

const router = express.Router();
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: '1h' },
    (err, token) => {
      if (err) {
        return returnError(500, res, next);
      } else {
        return res.json({
          token,
        });
      }
    }
  );
};

router.get('/', (req, res) => {
  res.json({
    message: 'auth router 🐾',
    user: req.user,
  });
});

router.get('/science', (req, res, next) => {
  returnError(418, res, next);
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
      return returnError(409, res, next);
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
          createTokenSendResponse(newUser, res, next);
          // res.json({
          //   username: newUser.username,
          //   _id: newUser._id,
          // });
        });
      })
      .catch((err) => {
        returnError(500, res, next);
      });
  });
});

// @POST /login
// @desc login an account
// @access public
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return returnError(422, res, next);
  }

  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password).then((valid) => {
          if (valid) {
            createTokenSendResponse(foundUser, res, next);
          } else {
            return returnError(401, res, next);
          }
        });
      } else {
        return returnError(401, res, next);
      }
    })
    .catch((err) => {
      returnError(500, res, next);
    });
});

module.exports = router;
