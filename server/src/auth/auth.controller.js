const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 12;

const returnError = (code, res, next) => {
  const messages = {
    401: 'Invalid Username or Password',
    409: 'Username unavailable',
    418: "I'm a teapot!",
    422: 'Missing Username or Password',
    500: 'RuhRoh! 😱 Unexpected server error!',
  };
  const error = new Error(messages[code]);
  res.status(code);
  next(error);
};

const createTokenSendResponse = async (user, res, next) => {
  try {
    const payload = {
      _id: user._id,
      username: user.username,
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });
    res.json({
      token,
      user: user.username,
    });
  } catch (error) {
    returnError(500, res, next);
  }
};

const get = (req, res) => {
  res.json({
    message: 'auth router 🐾',
    user: req.user,
  });
};

const science = (req, res, next) => {
  returnError(418, res, next);
};

const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      password: hash,
    });

    const saved = await user.save();
    createTokenSendResponse(saved, res, next);
  } catch (error) {
    returnError(500, res, next);
  }
};

const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = req.loggingInUser;
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      createTokenSendResponse(user, res, next);
    } else {
      returnError(401, res, next);
    }
  } catch (error) {
    returnError(500, res, next);
  }
};

module.exports = {
  get,
  science,
  signup,
  login,
};
