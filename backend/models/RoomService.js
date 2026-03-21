const mongoose = require('mongoose');

const roomServiceSchema = new mongoose.Schema(
  {
    
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },

    
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    cityState: {
      type: String,
      required: true,
      trim: true,
    },

    
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      default: 2,
      min: 1,
      max: 10,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 100,
      max: 10000,
    },
    amenities: [{
      type: String,
      enum: [
        'WiFi',
        'AC',
        'Parking',
        'Kitchen',
        'Hot Water',
        'Laundry',
        'TV',
        'Balcony',
        'Gym',
        'Swimming Pool',
        'CCTV',
        'Security Guard',
        'Lift',
        'Restaurant',
        'Housekeeping'
      ]
    }],
    images: [{
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Room'
    }],
    roomPhone: {
      type: String,
      required: true,
    },

    
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },

    
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoomService', roomServiceSchema);
