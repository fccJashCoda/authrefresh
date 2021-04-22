const express = require('express');
const controller = require('./notes.controller');
const middleware = require('./notes.middleware');
const authMiddleware = require('../../auth/v2/auth.middleware');

const router = express.Router();

// @route GET /api/v1/notes/
// @desc get all notes
// @access private
router.get('/', authMiddleware.checkCookies, controller.getAll);

// @route POST /api/v1/notes/
// @desc add a new note
// @access private
router.post('/', middleware.validateBody, controller.postNote);

// @DELETE /api/v1/notes/:id
// @desc delete a note with id :id
// @access private
router.delete('/:id', controller.deleteNote);

module.exports = router;
