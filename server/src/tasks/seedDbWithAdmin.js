const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function seedDbWithAdmin() {
  const password = process.argv[2] || process.env.DEFAULT_ADMIN_PASSWORD;
  const options = {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  };
  const URI = 'mongodb://localhost:27017/authrefresh';

  try {
    await mongoose.connect(URI, options);
    const db = mongoose.connection;

    const dbAdmin = await User.findOne({ role: 'admin' });
    if (dbAdmin) {
      console.log('Database already has an admin');
    } else {
      const hash = await bcrypt.hash(password, 12);

      const admin = new User({
        username: 'Superuser',
        password: hash,
        role: 'admin',
      });

      await admin.save();
      console.log('Admin seeded');
    }

    await db.close();
    console.log('Terminating.');
  } catch (error) {
    console.error(error);
  }
}

seedDbWithAdmin();
