const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 5431;
const db = mongoose.connection;

db.on('error', () => console.log('RuhRoh! 😱'));
db.once('open', () => app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
}));
