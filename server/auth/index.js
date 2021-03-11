const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

  // hash the password
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  // create our new user
  const user = new User({
    username,
    password: hash,
  });

  // check if username is in database, if so return error, else, add user
  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      const error = new Error('Username already taken');
      res.status(409);
      next(error);
    } else {
      user.save().then((newUser) => {
        res.json({
          username: newUser.username,
          _id: newUser._id,
        });
      });
    }
  });
});

// @POST /login
// @desc login an account
// @access public
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  console.log('incoming: ', req.body);

  if (!username || !password) {
    const error = new Error('Missing Username of Password');
    res.status(422);
    return next(error);
  }

  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      if (bcrypt.compareSync(password, foundUser.password)) {
        return res.json({ message: 'Party time 🎈🎊' });
      }
    }

    const error = new Error('Invalid Username or Password');
    res.status(401);
    next(error);
  });
});

module.exports = router;
