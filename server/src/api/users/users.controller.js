// const Joi = require('joi');
const User = require('../../models/User');

// const schema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(20),
//   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')),
//   roles: Joi.string().valid('user', 'admin'),
//   active: Joi.bool(),
// });

const getUsers = async (req, res, next) => {
  try {
    const _users = await User.find().select('-password').sort('username');
    res.json(_users);
  } catch (err) {
    const error = new Error('Database error');
    res.status(500);
    return next(error);
  }
};

module.exports = {
  getUsers,
};
