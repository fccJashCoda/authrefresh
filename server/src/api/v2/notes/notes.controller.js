const Note = require('../../../models/Note');

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user_id: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(notes);
  } catch (err) {
    const error = new Error('Server Error');
    res.status(500);
    next(error);
  }
};

const postNote = async (req, res, next) => {
  const { title, text } = req.body;
  try {
    const newNote = new Note({
      title,
      text,
      user_id: req.user._id,
    });
    const savedNote = await newNote.save();
    res.json({ message: 'Note created', note: savedNote });
  } catch (err) {
    const error = new Error('Server Error');
    res.status(500);
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: `Deleted note with id: ${req.params.id}` });
  } catch (err) {
    const error = new Error('Invalid note Id');
    res.status(500);
    next(error);
  }
};

module.exports = {
  getNotes,
  postNote,
  deleteNote,
};
