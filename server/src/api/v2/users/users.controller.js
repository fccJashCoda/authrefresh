const bcrypt = require('bcryptjs');
const User = require('../../../models/User');

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

const updateUser = async (req, res, next) => {
  try {
    const _user = req.userpayload;
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
    res.json({
      message: `User with id ${req.params.id} modified`,
      update,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUser,
};
