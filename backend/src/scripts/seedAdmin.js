require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const email = 'admin@baio.in';
    const password = 'AdminPassword123!';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists.');
    } else {
      await Admin.create({
        name: 'Super Admin',
        email,
        password,
        role: 'superadmin',
      });
      console.log('Default admin created successfully.');
    }
    
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
