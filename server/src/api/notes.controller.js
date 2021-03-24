const Note = require('../models/Note');

const getAll = (req, res, next) => {
  Note.find({ user_id: req.user._id })
    .then((notes) => {
      res.json(notes);
    })
    .catch(() => {
      const error = new Error("Nobody's home.");
      res.status(500);
      next(error);
    });
};

module.exports = {
  getAll,
};
