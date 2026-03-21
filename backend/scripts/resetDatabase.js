const mongoose = require('mongoose');
require('dotenv').config();


const User = require('../models/User');
const Room = require('../models/Room');
const RoomService = require('../models/RoomService');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const City = require('../models/City');
const OTP = require('../models/OTP');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function resetDatabase() {
  try {
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderlust_db';
    
    log(colors.blue, '\n═══════════════════════════════════════════════════════════');
    log(colors.blue, '    Database Reset Tool');
    log(colors.blue, '═══════════════════════════════════════════════════════════\n');
    
    log(colors.cyan, `Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    log(colors.green, ' Connected to MongoDB\n');

    // Get current counts before deletion
    log(colors.yellow, ' Current Database State:');
    const userCount = await User.countDocuments();
    const roomCount = await Room.countDocuments();
    const roomServiceCount = await RoomService.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const complaintCount = await Complaint.countDocuments();
    const cityCount = await City.countDocuments();
    const otpCount = await OTP.countDocuments();

    console.log(`   Users:        ${userCount}`);
    console.log(`   Rooms:        ${roomCount}`);
    console.log(`   Room Services: ${roomServiceCount}`);
    console.log(`   Bookings:     ${bookingCount}`);
    console.log(`   Complaints:   ${complaintCount}`);
    console.log(`   Cities:       ${cityCount}`);
    console.log(`   OTPs:         ${otpCount}\n`);

    
    log(colors.red, '  WARNING: This will DELETE ALL data above!');
    log(colors.red, '   This action CANNOT be undone!\n');

    
    log(colors.yellow, 'To proceed, the script will now delete...\n');

    
    log(colors.cyan, ' Deleting...');
    
    
    const deletedUsers = await User.deleteMany({});
    log(colors.green, ` Deleted ${deletedUsers.deletedCount} users`);
    
    const deletedRoomServices = await RoomService.deleteMany({});
    log(colors.green, ` Deleted ${deletedRoomServices.deletedCount} room services`);
    
    const deletedRooms = await Room.deleteMany({});
    log(colors.green, ` Deleted ${deletedRooms.deletedCount} rooms`);
    
    const deletedBookings = await Booking.deleteMany({});
    log(colors.green, ` Deleted ${deletedBookings.deletedCount} bookings`);
    
    const deletedComplaints = await Complaint.deleteMany({});
    log(colors.green, ` Deleted ${deletedComplaints.deletedCount} complaints`);
    
    const deletedOTPs = await OTP.deleteMany({});
    log(colors.green, ` Deleted ${deletedOTPs.deletedCount} OTPs`);

   
    log(colors.yellow, '\n Reference Data:');
    log(colors.blue, `   Cities: ${cityCount} (NOT deleted - safe to keep)`);

    log(colors.green, '\n Database reset complete!\n');
    
    log(colors.blue, '═══════════════════════════════════════════════════════════');
    log(colors.blue, '  Next Steps:');
    log(colors.blue, '  1. Run: node scripts/seedData.js (to add sample data)');
    log(colors.blue, '  2. Or create new users via signup page');
    log(colors.blue, '═══════════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    log(colors.red, `\n Error: ${error.message}\n`);
    
    if (error.message.includes('connect')) {
      log(colors.yellow, 'Make sure MongoDB is running!');
      log(colors.yellow, 'Start MongoDB with: mongod (or MongoDB Compass)');
    }
    
    log(colors.reset, '');
    process.exit(1);
  }
}


resetDatabase();
