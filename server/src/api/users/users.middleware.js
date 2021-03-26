const Joi = require('joi');
const User = require('../../models/User');

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')),
  roles: Joi.string().valid('user', 'admin'),
  active: Joi.bool(),
});

const validateBody = (req, res, next) => {
  const validation = schema.validate(req.body);
  if (!validation.error) {
    next();
  } else {
    res.status(422);
    next(validation.error);
  }
};

const findUser = async (req, res, next) => {
  try {
    const query = { _id: req.params.id };
    const user = await User.findOne(query);
    if (user) {
      req.userpayload = user;
      next();
    } else {
      res.status(404);
      throw new Error(`Not Found - /api/v1/users/${req.params.id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findUser,
  validateBody,
};
