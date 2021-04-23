const express = require('express');
const middleware = require('./notes.middleware');
const controller = require('./notes.controller');

const router = express.Router();

router.get('/', middleware.setUser, controller.getNotes);

router.post(
  '/',
  middleware.validateBody,
  middleware.setUser,
  controller.postNote,
);

router.delete('/:id', controller.deleteNote);

module.exports = router;
