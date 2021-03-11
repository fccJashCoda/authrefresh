const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
  res.status(418);
  const error = new Error("I'm a teapot!");
  next(error);
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
      const error = new Error('Username already taken');
      res.status(409);
      return next(error);
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
        const error = new Error('Unexpected server error');
        res.status(500);
        next(error);
      });
  });
});

// @POST /login
// @desc login an account
// @access public
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const error = new Error('Missing Username or Password');
    res.status(422);
    return next(error);
  }

  User.findOne({ username }).then((foundUser) => {
    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      return res.json({ message: 'Party time 🎈🎊' });
    }

    const error = new Error('Invalid Username or Password');
    res.status(401);
    next(error);
  });
});

module.exports = router;
