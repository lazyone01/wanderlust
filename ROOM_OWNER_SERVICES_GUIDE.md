# 🏠 Room Owner Services Feature Guide

## Overview

This feature allows **room owners from ANY city** (not limited to the 15 predefined cities) to list their rooms on the Wanderlust platform. The process includes:

1. ✅ **Room Owner submits** their room details
2. ✅ **Admin reviews** the submission
3. ✅ **Admin approves/rejects** with email notifications
4. ✅ **Approved rooms appear** on the platform for users to book

---

## 🔄 Complete Workflow

### Step 1: Room Owner Submits Room

**URL**: `http://localhost:3000/room-owner/submit-room`

**Form Fields**:
- Owner Info: Name, Email, Phone
- City: Name (any city), State
- Room Details: Name, Description, Capacity, Price per Night, Phone
- Amenities: Select available facilities

**What Happens**:
- Room marked as "pending"
- Confirmation email sent to owner
- Admin sees room in "Pending Approval" section

### Step 2: Admin Checks Pending Rooms

**URL**: `http://localhost:3000/admin/room-services`

**Admin Actions**:
- View all pending room submissions
- See owner details, room info, amenities, price
- **Approve** or **Reject** each room
- Add admin notes

### Step 3: Approval/Rejection Notification

**If Approved** ✅:
- Email sent to owner: "Room approved! Now live on platform"
- Room status changed to "approved"
- Room appears in users' browse page
- Users can now book the room

**If Rejected** ❌:
- Email sent to owner: "Room rejected. Reason: [admin reason]"
- Room status changed to "rejected"
- Owner can resubmit with improvements

### Step 4: Users Browse and Book

**URL**: `http://localhost:3000/rooms` (updated)

**Features**:
- Shows both seeded 15-city rooms AND approved room services
- Can filter by city (now includes new cities)
- Can filter by price
- Can view room details and amenities
- Can book approved rooms

---

## 🗄️ Database Model

### RoomService Collection

```javascript
{
  // Room Owner Info
  ownerEmail: "owner@example.com",
  ownerPhone: "9876543210",
  ownerName: "John Doe",

  // Room Location (New Cities)
  cityName: "Pune",           // Not from 15 predefined
  cityState: "Maharashtra",

  // Room Details
  roomName: "Luxury Suite",
  description: "Beautiful room with...",
  capacity: 2,
  pricePerNight: 1500,
  amenities: ["WiFi", "AC", "Parking"],
  images: ["url1", "url2"],
  roomPhone: "9876543210",

  // Approval Status
  status: "pending" | "approved" | "rejected",
  adminNotes: "",
  approvedAt: Date,
  rejectedAt: Date,
  isVerified: boolean,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 API Endpoints

### Public Endpoints

#### Get Approved Room Services
```bash
GET /api/room-services/approved
Query Parameters:
  - city: "Pune" (optional, case-insensitive)
  - minPrice: 500 (optional)
  - maxPrice: 2000 (optional)

Response:
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### Get Single Room Service
```bash
GET /api/room-services/:id

Response:
{
  "success": true,
  "data": {...}
}
```

### Room Owner Endpoints

#### Submit New Room Service
```bash
POST /api/room-services
No auth required - anyone can submit

Body:
{
  "ownerName": "John",
  "ownerEmail": "john@example.com",
  "ownerPhone": "9876543210",
  "cityName": "Pune",
  "cityState": "Maharashtra",
  "roomName": "Luxury Suite",
  "description": "...",
  "capacity": 2,
  "pricePerNight": 1500,
  "amenities": ["WiFi", "AC"],
  "roomPhone": "9876543210"
}

Response:
{
  "success": true,
  "message": "Room service submitted successfully",
  "data": {...}
}
```

### Admin Endpoints

#### Get All Pending Room Services
```bash
GET /api/room-services/pending/list
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

#### Get All Room Services (All Statuses)
```bash
GET /api/room-services
Authorization: Bearer <admin_token>
Query Parameters:
  - status: "pending" | "approved" | "rejected" (optional)

Response:
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### Approve Room Service
```bash
PUT /api/room-services/:id/approve
Authorization: Bearer <admin_token>

Body:
{
  "adminNotes": "Great room! Welcome to platform." (optional)
}

Response:
{
  "success": true,
  "message": "Room service approved successfully",
  "data": {...}
}
```

#### Reject Room Service
```bash
PUT /api/room-services/:id/reject
Authorization: Bearer <admin_token>

Body:
{
  "reason": "Amenities list incomplete" (required)
}

Response:
{
  "success": true,
  "message": "Room service rejected successfully",
  "data": {...}
}
```

---

## 🎯 Frontend Pages

### Room Owner Submission Page

**Path**: `/room-owner/submit-room`

**Features**:
- Beautiful form with all room details
- Amenity selection checkboxes
- Price validation (₹100-₹10000)
- Capacity validation (1-10 guests)
- Success/error messages
- Confirmation email notification

**Form Sections**:
1. 📋 Owner Information
2. 📍 City Information
3. 🛏️ Room Information
4. ✨ Amenities Selection

### Admin Room Services Management

**Path**: `/admin/room-services`

**Features**:
- View pending room submissions
- Filter by status (pending/approved/rejected)
- Statistics cards (pending count, approved count, etc.)
- Detailed room cards with:
  - Owner contact info
  - Room details and pricing
  - Amenities list
  - Description
  - Admin notes (if any)
- Action buttons (Approve/Reject for pending)

**Modals**:
- **Approval Modal**: Add optional admin notes
- **Rejection Modal**: Required to enter rejection reason

**Statistics Panel**:
- 📋 Pending count
- ✅ Approved count
- ❌ Rejected count
- 🏘️ Total submissions

---

## 📧 Email Notifications

### 1. Submission Confirmation Email
**Sent to**: Room owner email
**When**: Room service submitted
**Content**:
- Thank you message
- Room details summary
- Status: "Pending Approval"
- Next steps

### 2. Approval Email
**Sent to**: Room owner email
**When**: Admin approves the room
**Content**:
- Approval congratulations
- Room details
- Status: "Approved - Now Live!"
- Admin notes (if provided)
- Thank you message

### 3. Rejection Email
**Sent to**: Room owner email
**When**: Admin rejects the room
**Content**:
- Apology and rejection notice
- Rejection reason (from admin)
- Encouragement to resubmit
- Support contact info

---

## 🔐 Security & Validation

### Form Validation
- ✅ All required fields checked
- ✅ Email format validation
- ✅ Phone number format
- ✅ Price range: ₹100-₹10000
- ✅ Capacity range: 1-10 guests
- ✅ Duplicate room check (same owner + room name + city)

### Admin Controls
- ✅ Only admins can approve/reject
- ✅ Only pending rooms can be approved/rejected
- ✅ Rejection reason is required
- ✅ Approval/rejection timestamps recorded
- ✅ Admin notes stored with approval

### Data Protection
- ✅ Email notifications logged
- ✅ All changes timestamped
- ✅ Original submission data preserved
- ✅ Admin actions tracked

---

## 🚀 How to Use

### For Room Owners

1. **Go to**: `http://localhost:3000/room-owner/submit-room`
2. **Fill in** all your room details
3. **Select** amenities available in your room
4. **Submit** the form
5. **Wait** for admin approval (usually within 24 hours)
6. **Check email** for approval/rejection notification
7. **Once approved**, your room will appear for all users!

### For Admins

1. **Go to**: `http://localhost:3000/admin/room-services`
2. **View** pending room submissions
3. **Review** owner details, room info, amenities, pricing
4. **Click "Approve"** to approve the room (optionally add notes)
5. **OR Click "Reject"** if room doesn't meet standards (must provide reason)
6. **Room owner receives email** with decision
7. **Approved rooms** appear in browsing section

### For Users

1. **Go to**: `http://localhost:3000/rooms`
   - Now shows both seeded AND approved room service rooms
2. **Can filter** by new cities (not just predefined 15)
3. **Can browse** all available rooms in any city
4. **Can book** approved rooms just like seeded ones
5. **Can see** all amenities and pricing

---

## 📊 Testing Scenarios

### Test Case 1: Submit a Room
1. Go to `/room-owner/submit-room`
2. Fill in owner: "Test Owner", "test@example.com", "9999999999"
3. Fill in city: "Jaipur", "Rajasthan"
4. Fill in room: "Test Room", "Nice room", capacity 2, price 1200
5. Select 3-4 amenities
6. Submit
7. ✅ Should see success message
8. ✅ Check email for confirmation

### Test Case 2: Admin Reviews Submission
1. Login as admin (admin@wanderlust.com / admin@123)
2. Go to `/admin/room-services`
3. Should see "1 Pending"
4. Click on the submitted room
5. Review details
6. Click "Approve" or "Reject"
7. ✅ Should update status immediately
8. ✅ Check email for notification

### Test Case 3: Users See Approved Room
1. Go to `/rooms`
2. Should show approved room in grid
3. Can be filtered by city name
4. Can be filtered by price
5. Can view details
6. ✅ Should be bookable

### Test Case 4: Duplicate Prevention
1. Try submitting same room twice
2. ✅ Should show error: "You already have a room with this name"

---

## 🛠️ Files Created/Modified

### Backend Files Created
✅ `backend/models/RoomService.js` - New model
✅ `backend/controllers/roomServiceController.js` - New controller
✅ `backend/routes/roomServiceRoutes.js` - New routes
✅ `backend/server.js` - Updated to include new routes

### Frontend Files Created
✅ `frontend/pages/room-owner/submit-room.jsx` - Room owner form
✅ `frontend/pages/admin/room-services.jsx` - Admin management
✅ `frontend/components/Navbar.jsx` - Updated with new links

### Models Affected
- RoomService (new)
- User (unchanged)
- Room (unchanged - separate from RoomService)
- Booking (unchanged)
- Complaint (unchanged)

---

## 📈 Future Enhancements

1. **Room Owner Dashboard**
   - View their submitted rooms
   - Track bookings for their rooms
   - Edit room details
   - Upload multiple images with preview

2. **Advanced Admin Features**
   - Bulk approve/reject
   - Room verification checklist
   - Admin dashboard stats
   - Export approved rooms list
   - Search and advanced filters

3. **User Reviews**
   - Rate approved rooms
   - Leave comments
   - Display reviews on room cards

4. **Payment Integration**
   - Collect commission from room owners
   - Payment processing
   - Earnings dashboard for owners

5. **Room Owner Account**
   - Sign up as room owner
   - Multiple properties
   - Earnings tracking
   - Booking notifications

---

## 🆘 Troubleshooting

### Email Not Sending?
- Check `.env` file has EMAIL_USERNAME and EMAIL_PASSWORD
- Verify Gmail app password (not regular password)
- Check backend terminal for error messages

### Room Not Appearing After Approval?
- Refresh the `/rooms` page
- Check room status is "approved"
- Clear browser cache (Ctrl+Shift+Delete)

### Admin Can't See Pending Rooms?
- Make sure you're logged in as admin
- Check at `/admin/room-services` URL
- Must have 'admin' role in user account

### Form Validation Errors?
- All fields are required
- Email must be valid format
- Price must be ₹100-₹10000
- Capacity must be 1-10

---

## 📞 Support

For issues related to:
- **Room submission**: Check `/room-owner/submit-room` form validation
- **Admin approval**: Check `/admin/room-services` for pending items
- **User browsing**: Check `/rooms` page shows approved rooms
- **Emails**: Check backend terminal for error logs

---

## ✅ Verification Checklist

### Backend
- [ ] RoomService model created
- [ ] roomServiceController with all functions
- [ ] roomServiceRoutes registered
- [ ] Routes added to server.js
- [ ] Email notifications working
- [ ] API endpoints tested with Postman

### Frontend
- [ ] Room owner submit page created
- [ ] Admin room services management page created
- [ ] Navbar updated with new links
- [ ] Form validation working
- [ ] Approved rooms show on /rooms page

### Workflow
- [ ] Owner can submit room
- [ ] Admin can view pending rooms
- [ ] Admin can approve rooms
- [ ] Admin can reject rooms with reason
- [ ] Owner receives approval/rejection email
- [ ] Approved room shows for users to book
- [ ] Users can filter by new cities

---

**Your Room Owner Services feature is now complete!** 🎉

