const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
router.post('/send-otp', authController.sendOTP);
router.post('/signup', authController.signupWithOTP);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;
