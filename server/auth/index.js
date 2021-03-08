const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'auth router says hi',
  });
});

// @POST /signup
// @desc create a new account
// @access public
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  res.json({
    message: '🍔',
    username,
    password,
  });
});

module.exports = router;
