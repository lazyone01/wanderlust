const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendEmail } = require("../utils/sendEmails");
const { hashPassword, comparePassword } = require('../utils/password');
const { generateOTP, generateToken } = require('../utils/auth');


exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

   
    await OTP.deleteMany({ email });

    
    await OTP.create({ email, otp, expiresAt });

   
    await sendEmail(
      email,
      "Your OTP for Wanderlust",
      `Your OTP is ${otp}. It is valid for 15 minutes.`
    );

    res.json({
      success: true,
      message: 'OTP sent to email',
      email,
    });
  } catch (error) {
    console.error(" Error in sendOTP:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ 
      message: 'Error sending OTP', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


exports.signupWithOTP = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, otp } = req.body;

   
    if (!email || !phone || !password || !firstName || !lastName || !otp) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone already registered' });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found. Please request a new OTP.' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({ message: 'Max OTP attempts exceeded. Request new OTP.' });
      }
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    
    const hashedPassword = await hashPassword(password);

   
    const user = await User.create({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      isVerified: true,
      otpVerifiedAt: new Date(),
    });

    
    await OTP.deleteOne({ _id: otpRecord._id });

    
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup error', error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
