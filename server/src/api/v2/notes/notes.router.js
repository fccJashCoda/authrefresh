const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../../../models/Note');
const middleware = require('./notes.middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token, process.env.SECRET_KEY);
    const notes = await Note.find({ user_id: decoded._id });

    res.json(notes);
  } catch (err) {
    const error = new Error('Server Error');
    res.status(500);
    next(error);
  }
});

router.post('/', middleware.validateBody, async (req, res, next) => {
  const { title, text } = req.body;
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token, process.env.SECRET_KEY);

    const newNote = new Note({
      title,
      text,
      user_id: decoded._id,
    });
    const savedNote = await newNote.save();
    res.json({ message: 'Note created', note: savedNote });
  } catch (err) {
    const error = new Error('Server Error');
    res.status(500);
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: `Deleted note with id: ${req.params.id}` });
  } catch (err) {
    const error = new Error('Invalid note Id');
    res.status(500);
    next(error);
  }
});

module.exports = router;
