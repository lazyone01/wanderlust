const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
        default: 'https://via.placeholder.com/500x400?text=Room+Image',
      },
    ],
    capacity: {
      type: Number,
      default: 2,
    },
    price: {
      type: Number,
      required: true,
      min: 500,
      max: 2500,
    },
    currency: {
      type: String,
      default: '₹',
    },
    contactPhone: {
      type: String,
      required: true,
    },
    facilities: [
      {
        type: String,
        enum: [
          'Free WiFi',
          'Hot Water',
          'Private Bathroom',
          '24/7 Access',
          'Security',
          'Clean Room',
          'Air Conditioning',
          'Wardrobe',
        ],
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
