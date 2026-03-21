const mongoose = require('mongoose');
require('dotenv').config();

const City = require('../models/City');
const Room = require('../models/Room');

const cities = [
  { name: 'Agra', state: 'Uttar Pradesh', description: 'Home of the Taj Mahal' },
  { name: 'Jaipur', state: 'Rajasthan', description: 'The Pink City' },
  { name: 'Goa', state: 'Goa', description: 'Beach Paradise' },
  { name: 'Kerala', state: 'Kerala', description: 'Gods Own Country' },
  { name: 'Varanasi', state: 'Uttar Pradesh', description: 'Spiritual Heart of India' },
  { name: 'Delhi', state: 'Delhi', description: 'National Capital' },
  { name: 'Mumbai', state: 'Maharashtra', description: 'City of Dreams' },
  { name: 'Bangalore', state: 'Karnataka', description: 'IT Hub' },
  { name: 'Udaipur', state: 'Rajasthan', description: 'City of Lakes' },
  { name: 'Kolkata', state: 'West Bengal', description: 'City of Joy' },
  { name: 'Hyderabad', state: 'Telangana', description: 'City of Pearls' },
  { name: 'Amritsar', state: 'Punjab', description: 'Golden Temple City' },
  { name: 'Mysore', state: 'Karnataka', description: 'Palace City' },
  { name: 'Jaisalmer', state: 'Rajasthan', description: 'Desert City' },
  { name: 'Rishikesh', state: 'Uttarakhand', description: 'Yoga Capital' },
];

const facilities = [
  'Free WiFi',
  'Hot Water',
  'Private Bathroom',
  '24/7 Access',
  'Security',
  'Clean Room',
];

const roomNames = [
  'Deluxe Room',
  'Standard Room',
  'Comfort Room',
  'Budget Room',
  'Economy Room',
  'Classic Room',
];

const roomImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1618886996285-e5f8874a2c9d?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596178065887-2f2c85c235a9?w=500&h=400&fit=crop',
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    
    await City.deleteMany({});
    await Room.deleteMany({});
    console.log('  Cleared existing data');

   
    const createdCities = await City.insertMany(cities);
    console.log(` Created ${createdCities.length} cities`);

    
    let roomCount = 0;
    for (const city of createdCities) {
      for (let i = 0; i < 6; i++) {
        const room = await Room.create({
          roomId: `${city.name.toLowerCase()}-room-${i + 1}`,
          cityId: city._id,
          name: roomNames[i % roomNames.length],
          description: `Comfortable stay in ${city.name} with modern amenities`,
          images: roomImages,
          capacity: 2,
          price: Math.floor(Math.random() * (2500 - 500 + 1)) + 500,
          currency: '₹',
          contactPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          facilities: facilities.slice(0, 4 + Math.floor(Math.random() * 2)),
          availability: Math.random() > 0.2,
          rating: Math.floor(Math.random() * 20) / 4,
        });
        roomCount++;
      }
    }
    console.log(` Created ${roomCount} rooms`);

    console.log('\n Seed data created successfully!');
    console.log(` Summary: ${createdCities.length} cities with ${roomCount} rooms`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
