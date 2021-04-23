const Note = require('../../models/Note');

const getAll = async (req, res, next) => {
  Note.find({ user_id: req.user._id })
    .sort({ createdAt: -1 })
    .then((notes) => {
      res.json(notes);
    })
    .catch(() => {
      const error = new Error("Nobody's home.");
      res.status(500);
      next(error);
    });
};

const postNote = (req, res, next) => {
  const { title, text } = req.body;
  const newNote = new Note({
    title,
    text,
    user_id: req.user._id,
  });

  newNote
    .save()
    .then((note) => {
      res.json({ message: 'Note created', note });
    })
    .catch(() => {
      const error = new Error('Server error');
      res.status(500);
      next(error);
    });
};

const deleteNote = (req, res, next) => {
  Note.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: `Deleted note with id: ${req.params.id}` }))
    .catch(() => {
      const error = new Error('Invalid note Id');
      res.status(500);
      next(error);
    });
};

module.exports = {
  getAll,
  postNote,
  deleteNote,
};
