const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function createAdmin() {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB connected');

    
    const adminExists = await User.findOne({ email: 'admin@wanderlust.com' });
    if (adminExists) {
      console.log(' Admin user already exists!');
      process.exit(0);
    }

    
    const hashedPassword = await bcryptjs.hash('admin@123', 10);

    
    const admin = await User.create({
      email: 'admin@wanderlust.com',
      phone: '9999999999',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true,
      otpVerifiedAt: new Date(),
    });

    console.log(' Admin user created successfully!');
    console.log(' Email: admin@wanderlust.com');
    console.log(' Password: admin@123');
    console.log('\n  IMPORTANT: Change this password after first login!');

    process.exit(0);
  } catch (error) {
    console.error(' Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
