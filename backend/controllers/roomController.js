const Room = require('../models/Room');
const City = require('../models/City');


exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
};


exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching city', error: error.message });
  }
};


exports.getAllRooms = async (req, res) => {
  try {
    const { cityId, minPrice, maxPrice, facilities } = req.query;
    let filter = {};

    if (cityId) {
      filter.cityId = cityId;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    if (facilities) {
      const facilitiesArray = Array.isArray(facilities) ? facilities : [facilities];
      filter.facilities = { $in: facilitiesArray };
    }

    const rooms = await Room.find(filter).populate('cityId');
    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};


exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('cityId');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};


exports.getRoomsByCity = async (req, res) => {
  try {
    const rooms = await Room.find({ cityId: req.params.cityId }).populate('cityId');
    res.json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};
