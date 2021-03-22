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

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        return returnError(500, res, next);
      }
      return res.json({
        token,
        user: user.username,
      });
    },
  );
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

const signup = (req, res, next) => {
  const { username, password } = req.body;

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
        });
      })
      .catch(() => {
        returnError(500, res, next);
      });
  });
};

const login = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser && foundUser.active) {
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
    .catch(() => {
      returnError(500, res, next);
    });
};

module.exports = {
  get,
  science,
  signup,
  login,
};
