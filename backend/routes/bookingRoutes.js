const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const adminMiddleware = require('../middleware/admin');
router.post('/', bookingController.createBooking);
router.get('/user/my-bookings', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);
router.get('/', adminMiddleware, bookingController.getAllBookings);

module.exports = router;
