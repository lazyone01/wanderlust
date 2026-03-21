const Booking = require('../models/Booking');
const Room = require('../models/Room');
const RoomService = require('../models/RoomService');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('../utils/sendEmails');


exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests, guestName, guestPhone, specialRequests, isRoomService } = req.body;

    if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests || !guestName || !guestPhone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    
    let room;
    let roomName;
    let cityName;
    let roomPrice;

    if (isRoomService) {
      
      const roomService = await RoomService.findById(roomId);
      if (!roomService) {
        return res.status(404).json({ message: 'Room service not found' });
      }
      if (roomService.status !== 'approved') {
        return res.status(400).json({ message: 'This room service is not approved for booking' });
      }
      roomName = roomService.roomName;
      cityName = roomService.cityName;
      roomPrice = roomService.pricePerNight;
      if (numberOfGuests > roomService.capacity) {
        return res.status(400).json({ message: `Room capacity is ${roomService.capacity} guests` });
      }
    } else {
      
      room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      roomName = room.name;
      roomPrice = room.price;
      if (numberOfGuests > room.capacity) {
        return res.status(400).json({ message: `Room capacity is ${room.capacity} guests` });
      }
    }

    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const totalPrice = nights * roomPrice;

    
    const booking = await Booking.create({
      userId: req.userId,
      roomId,
      cityId: room?.cityId || null,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      guestName,
      guestPhone,
      specialRequests: specialRequests || '',
    });

    const populatedBooking = await booking.populate('roomId cityId');

    
    try {
      const user = await User.findById(req.userId);
      if (user && user.email) {
        await sendBookingConfirmationEmail(user.email, {
          bookingId: booking._id.toString(),
          roomName,
          cityName: cityName || (room?.cityId?.name || 'Unknown'),
          checkInDate,
          checkOutDate,
          numberOfGuests,
          guestName,
          totalPrice,
          nights,
        });
      }
    } catch (emailError) {
      console.error(' Warning: Booking confirmation email failed:', emailError.message);
      
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('roomId')
      .populate('cityId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId')
      .populate('cityId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'firstName lastName email phone')
      .populate('roomId')
      .populate('cityId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
