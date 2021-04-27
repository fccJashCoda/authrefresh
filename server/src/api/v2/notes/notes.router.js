const express = require('express');
const middleware = require('./notes.middleware');
// const authMiddleware = require('../../../auth/v2/auth.middleware');
const controller = require('./notes.controller');

const router = express.Router();

router.get('/', controller.getNotes);

router.post('/', middleware.validateBody, controller.postNote);

router.delete('/:id', controller.deleteNote);

module.exports = router;
