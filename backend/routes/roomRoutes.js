const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
router.get('/cities', roomController.getAllCities);
router.get('/cities/:id', roomController.getCityById);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.get('/city/:cityId/rooms', roomController.getRoomsByCity);

module.exports = router;
