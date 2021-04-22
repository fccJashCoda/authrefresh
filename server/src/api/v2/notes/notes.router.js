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

router.post('/', middleware.validateBody, (req, res, next) => {
  try {
    res.json({ message: 'Note created' });
    // get the user id from the cookie
    // build the note
    // save the note
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
