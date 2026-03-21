const Complaint = require('../models/Complaint');


exports.createComplaint = async (req, res) => {
  try {
    const { bookingId, roomId, title, description, category, priority, attachments } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const complaint = await Complaint.create({
      userId: req.userId,
      bookingId: bookingId || null,
      roomId: roomId || null,
      title,
      description,
      category,
      priority: priority || 'medium',
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error: error.message });
  }
};


exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.userId })
      .populate('bookingId')
      .populate('roomId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};


exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone')
      .populate('bookingId')
      .populate('roomId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    
    if (complaint.userId._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint', error: error.message });
  }
};


exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .populate('bookingId')
      .populate('roomId')
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};


exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes: adminNotes || complaint.adminNotes,
        resolvedAt: status === 'resolved' || status === 'closed' ? new Date() : null,
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};
