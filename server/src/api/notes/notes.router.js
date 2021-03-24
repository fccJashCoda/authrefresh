const express = require('express');
const controller = require('./notes.controller');

const router = express.Router();

// @route GET /api/v1/notes/
// @desc get all notes
// @access private
router.get('/', controller.getAll);

// @route POST /api/v1/notes/
// @desc add a new note
// @access private
router.post('/', controller.postNote);

// @POST /login
// @desc login an account
// @access public
router.delete('/:id', controller.deleteNote);

module.exports = router;
