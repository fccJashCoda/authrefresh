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

module.exports = {
  validateBody,
};
