const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const roomServiceRoutes = require('./routes/roomServiceRoutes');


const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');
const errorHandler = require('./middleware/errorHandler');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' MongoDB connected');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', authMiddleware, bookingRoutes);
app.use('/api/complaints', authMiddleware, complaintRoutes);
app.use('/api/room-services', roomServiceRoutes);


app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});


app.get('/api/admin/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const User = require('./models/User');
    const Booking = require('./models/Booking');
    const Complaint = require('./models/Complaint');

    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalBookings,
        totalComplaints,
        openComplaints,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});


app.use(errorHandler);


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n Server running on http://localhost:${PORT}`);
  console.log(` API Base: http://localhost:${PORT}/api\n`);
});
