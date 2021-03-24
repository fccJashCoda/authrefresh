const express = require('express');
const Joi = require('joi');
const controller = require('./notes.controller');

const router = express.Router();
const Note = require('../models/Note');

const schema = new Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  text: Joi.string().trim().required(),
});

// @route GET /api/v1/notes/
// @desc get all notes
// @access private
router.get('/', controller.getAll);

// @route POST /api/v1/notes/
// @desc add a new note
// @access private
router.post('/', (req, res, next) => {
  const { title, text } = req.body;
  const value = schema.validate({ title, text });

  if (value.error) {
    res.status(422);
    next(value.error);
  } else {
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
  }
});

// @POST /login
// @desc login an account
// @access public
router.delete('/:id', (req, res, next) => {
  Note.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: `Deleted note with id: ${req.params.id}` }))
    .catch(() => {
      const error = new Error('Invalid note Id');
      res.status(500);
      next(error);
    });
});

module.exports = router;
