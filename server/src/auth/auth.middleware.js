const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20)
    .required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')).required(),
});

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          const error = new Error('Token expired');
          res.status(401);
          return next(error);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorized access');
    res.status(401);
    next(error);
  }
}

async function isAdmin(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(401);
      throw new Error('Unauthorized access');
    }
  } catch (error) {
    next(error);
  }
}

const validateBody = (defaultErrorMessage) => (req, res, next) => {
  const value = schema.validate(req.body);
  if (!value.error) {
    next();
  } else {
    res.status(422);
    const error = defaultErrorMessage
      ? new Error(defaultErrorMessage)
      : value.error;
    next(error);
  }
};

const findUser = (defaultLoginError, isError, errorCode = 422) => async (
  req,
  res,
  next,
) => {
  const user = await User.findOne({ username: req.body.username });
  if (isError(user)) {
    const error = new Error(defaultLoginError);
    res.status(errorCode);
    next(error);
  } else {
    req.loggingInUser = user;
    next();
  }
};

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
  validateBody,
  findUser,
};
