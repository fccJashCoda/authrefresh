const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$')),
  roles: Joi.string().valid('user', 'admin'),
  active: Joi.bool(),
});

router.get('/', async (req, res, next) => {
  try {
    const _users = await User.find().select('-password').sort('username');
    res.json(_users);
  } catch (err) {
    const error = new Error('It seems the database vanished');
    res.status(500);
    return next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const validation = schema.validate(req.body);
    if (!validation.error) {
      const query = { _id: req.params.id };
      const _user = await User.findOne(query);
      if (_user) {
        const update = req.body;

        if (update.password) {
          const rounds = 12;
          const salt = await bcrypt.genSalt(rounds);
          const hash = await bcrypt.hash(update.password, salt);
          update.password = hash;
        }

        await _user.updateOne(update, {
          new: true,
          strict: false,
        });

        delete update.password;
        res.json(update);
      } else {
        next();
      }
    } else {
      throw validation.error;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
