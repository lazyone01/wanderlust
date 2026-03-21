const RoomService = require('../models/RoomService');
const { sendEmail } = require('../utils/sendEmails');


exports.submitRoomService = async (req, res) => {
  try {
    const {
      ownerEmail,
      ownerPhone,
      ownerName,
      cityName,
      cityState,
      roomName,
      description,
      capacity,
      pricePerNight,
      amenities,
      images,
      roomPhone,
    } = req.body;

    
    if (!ownerEmail || !ownerPhone || !ownerName || !cityName || !cityState || 
        !roomName || !description || !pricePerNight || !roomPhone) {
      return res.status(400).json({ 
        message: 'All required fields must be provided',
        required: ['ownerEmail', 'ownerPhone', 'ownerName', 'cityName', 'cityState', 
                   'roomName', 'description', 'pricePerNight', 'roomPhone']
      });
    }

    
    const existing = await RoomService.findOne({ 
      ownerEmail, 
      roomName,
      cityName 
    });
    if (existing) {
      return res.status(400).json({ 
        message: 'You already have a room service with this name in this city' 
      });
    }

    
    const roomService = await RoomService.create({
      ownerEmail,
      ownerPhone,
      ownerName,
      cityName,
      cityState,
      roomName,
      description,
      capacity: capacity || 2,
      pricePerNight,
      amenities: amenities || [],
      images: images || ['https://via.placeholder.com/400x300?text=Room'],
      roomPhone,
      status: 'pending',
    });

    
    try {
      await sendEmail(
        ownerEmail,
        ' Room Service Submission Received - Wanderlust Rooms',
        `
Dear ${ownerName},

Your room service submission has been received successfully!

Room Details:
- Room Name: ${roomName}
- City: ${cityName}, ${cityState}
- Price per Night: ₹${pricePerNight}
- Capacity: ${capacity || 2} guests
- Amenities: ${(amenities || []).join(', ') || 'None specified'}

Status:  Pending Approval

Our admin team will verify your room details and contact you if needed. Once approved, your room will be visible to all users on the Wanderlust platform!

Thank you for choosing Wanderlust Rooms!

Best regards,
Wanderlust Rooms Admin Team
        `
      );
    } catch (emailError) {
      console.warn('Could not send confirmation email:', emailError.message);
      
    }

    res.status(201).json({
      success: true,
      message: 'Room service submitted successfully. Awaiting admin approval.',
      data: roomService,
    });
  } catch (error) {
    console.error('Error submitting room service:', error);
    res.status(500).json({ 
      message: 'Error submitting room service', 
      error: error.message 
    });
  }
};


exports.getPendingRoomServices = async (req, res) => {
  try {
    const pendingServices = await RoomService.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingServices.length,
      data: pendingServices,
    });
  } catch (error) {
    console.error('Error fetching pending room services:', error);
    res.status(500).json({ 
      message: 'Error fetching pending room services', 
      error: error.message 
    });
  }
};


exports.getAllRoomServices = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const services = await RoomService.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching room services:', error);
    res.status(500).json({ 
      message: 'Error fetching room services', 
      error: error.message 
    });
  }
};


exports.approveRoomService = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const roomService = await RoomService.findById(id);
    if (!roomService) {
      return res.status(404).json({ message: 'Room service not found' });
    }

    if (roomService.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot approve a room service with status: ${roomService.status}` 
      });
    }

    
    roomService.status = 'approved';
    roomService.isVerified = true;
    roomService.approvedAt = new Date();
    roomService.adminNotes = adminNotes || '';
    await roomService.save();

    
    try {
      await sendEmail(
        roomService.ownerEmail,
        ' Room Service Approved - Wanderlust Rooms',
        `
Dear ${roomService.ownerName},

Great news! Your room service has been approved and is now live on Wanderlust Rooms! 🎉

Room Details:
- Room Name: ${roomService.roomName}
- City: ${roomService.cityName}, ${roomService.cityState}
- Price per Night: ₹${roomService.pricePerNight}
- Capacity: ${roomService.capacity} guests

Your room is now visible to all users on the platform. Users can book your room and you will receive notifications for each booking.

Admin Notes: ${adminNotes || 'None'}

Thank you for being part of the Wanderlust Rooms community!

Best regards,
Wanderlust Rooms Admin Team
        `
      );
    } catch (emailError) {
      console.warn(' Could not send approval email:', emailError.message);
    }

    res.json({
      success: true,
      message: 'Room service approved successfully',
      data: roomService,
    });
  } catch (error) {
    console.error('Error approving room service:', error);
    res.status(500).json({ 
      message: 'Error approving room service', 
      error: error.message 
    });
  }
};


exports.rejectRoomService = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const roomService = await RoomService.findById(id);
    if (!roomService) {
      return res.status(404).json({ message: 'Room service not found' });
    }

    if (roomService.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot reject a room service with status: ${roomService.status}` 
      });
    }

    
    roomService.status = 'rejected';
    roomService.rejectedAt = new Date();
    roomService.adminNotes = reason;
    await roomService.save();

    
    try {
      await sendEmail(
        roomService.ownerEmail,
        ' Room Service Rejection - Wanderlust Rooms',
        `
Dear ${roomService.ownerName},

We regret to inform you that your room service submission has been rejected.

Room Name: ${roomService.roomName}
City: ${roomService.cityName}, ${roomService.cityState}

Rejection Reason:
${reason}

Please address these concerns and resubmit your room service. We would love to have your property on Wanderlust Rooms!

If you have any questions, please contact our support team.

Best regards,
Wanderlust Rooms Admin Team
        `
      );
    } catch (emailError) {
      console.warn('Could not send rejection email:', emailError.message);
    }

    res.json({
      success: true,
      message: 'Room service rejected successfully',
      data: roomService,
    });
  } catch (error) {
    console.error('Error rejecting room service:', error);
    res.status(500).json({ 
      message: 'Error rejecting room service', 
      error: error.message 
    });
  }
};


exports.getApprovedRoomServices = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    let filter = { status: 'approved' };

    if (city) filter.cityName = new RegExp(city, 'i'); 
    if (minPrice) filter.pricePerNight = { ...filter.pricePerNight, $gte: minPrice };
    if (maxPrice) filter.pricePerNight = { ...filter.pricePerNight, $lte: maxPrice };

    const approvedServices = await RoomService.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: approvedServices.length,
      data: approvedServices,
    });
  } catch (error) {
    console.error('Error fetching approved room services:', error);
    res.status(500).json({ 
      message: 'Error fetching approved room services', 
      error: error.message 
    });
  }
};


exports.getRoomServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const roomService = await RoomService.findById(id);

    if (!roomService) {
      return res.status(404).json({ message: 'Room service not found' });
    }

    
    if (roomService.status !== 'approved' && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'This room service is not yet approved' });
    }

    res.json({
      success: true,
      data: roomService,
    });
  } catch (error) {
    console.error('Error fetching room service:', error);
    res.status(500).json({ 
      message: 'Error fetching room service', 
      error: error.message 
    });
  }
};
