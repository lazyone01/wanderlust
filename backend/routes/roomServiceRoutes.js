const express = require('express');
const router = express.Router();
const roomServiceController = require('../controllers/roomServiceController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
router.get('/approved', roomServiceController.getApprovedRoomServices);
router.get('/:id', roomServiceController.getRoomServiceById);
router.post('/', roomServiceController.submitRoomService);
router.get('/', authMiddleware, adminMiddleware, roomServiceController.getAllRoomServices);
router.get('/pending/list', authMiddleware, adminMiddleware, roomServiceController.getPendingRoomServices);
router.put('/:id/approve', authMiddleware, adminMiddleware, roomServiceController.approveRoomService);
router.put('/:id/reject', authMiddleware, adminMiddleware, roomServiceController.rejectRoomService);

module.exports = router;
