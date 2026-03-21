const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const adminMiddleware = require('../middleware/admin');
router.post('/', complaintController.createComplaint);
router.get('/user/my-complaints', complaintController.getUserComplaints);
router.get('/:id', complaintController.getComplaintById);
router.get('/', adminMiddleware, complaintController.getAllComplaints);
router.put('/:id/status', adminMiddleware, complaintController.updateComplaintStatus);

module.exports = router;
