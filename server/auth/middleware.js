const User = require('../models/User');
const jwt = require('jsonwebtoken');

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
    console.log(user);
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

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
};
