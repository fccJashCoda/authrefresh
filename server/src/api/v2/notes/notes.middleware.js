const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = new Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  text: Joi.string().trim().required(),
});

const validateBody = (req, res, next) => {
  const validate = schema.validate(req.body);
  if (validate.error) {
    res.status(422);
    next(validate.error);
  } else {
    next();
  }
};

const setUser = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  setUser,
  validateBody,
};
