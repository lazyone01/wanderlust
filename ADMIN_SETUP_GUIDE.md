# 🔐 Admin Setup & Dashboard Guide

## Quick Summary

The application now has a **complete admin system** with:
- ✅ Admin user creation script
- ✅ Admin login (same as regular users)
- ✅ Admin dashboard to view all bookings and complaints
- ✅ Role-based access control
- ✅ Admin navbar link

---

## 🚀 Step-by-Step Setup

### Step 1: Create Admin User

Run this command in the **backend folder**:

```bash
cd backend
npm run create-admin
```

You should see:
```
✅ MongoDB connected
✅ Admin user created successfully!
📧 Email: admin@wanderlust.com
🔐 Password: admin@123

⚠️  IMPORTANT: Change this password after first login!
```

### Step 2: Login as Admin

1. Open your browser: `http://localhost:3000/login`
2. Enter credentials:
   - **Email**: `admin@wanderlust.com`
   - **Password**: `admin@123`
3. Click "Login"

### Step 3: Access Admin Dashboard

After login, you'll see a new **"🔧 Admin"** link in the navigation bar.

**Click it** → You'll be redirected to the admin dashboard!

---

## 📊 Admin Dashboard Features

### Overview

The admin dashboard shows **4 key statistics**:

| Stat | Description |
|------|-------------|
| 📊 Total Bookings | All bookings made by users |
| ⏳ Pending Bookings | Bookings awaiting confirmation |
| 📝 Total Complaints | All complaints submitted |
| 🚨 Open Complaints | Complaints not yet resolved |

### Bookings Tab

View all bookings in a **table format** with:

- **Guest Name** - Who booked the room
- **Room Name** - Which room was booked
- **City** - Which city
- **Check-In Date** - When they arrive
- **Check-Out Date** - When they leave
- **Total Price** - How much they paid (₹)
- **Status** - Current booking status:
  - 🟡 Pending (awaiting confirmation)
  - 🟢 Confirmed (approved)
  - 🔴 Cancelled (user cancelled)
  - 🔵 Completed (stay finished)

### Complaints Tab

View all complaints with **detailed cards** showing:

- **Title** - Complaint subject
- **Category** - Type of issue:
  - Cleanliness
  - Facilities
  - Service
  - Noise
  - Security
  - Other
- **Priority Level** - Urgency:
  - 🔴 Critical (red)
  - 🟠 High (orange)
  - 🟡 Medium (yellow)
  - 🔵 Low (blue)
- **Status** - Current state:
  - 🟠 Open (new complaint)
  - 🔵 In-Progress (being handled)
  - 🟢 Resolved (fixed)
  - ⚫ Closed (completed)
- **Admin Notes** - Your responses/updates
- **Submission Date** - When it was filed

---

## 🔧 API Endpoints (Admin)

These endpoints **require admin role**:

### Get All Bookings
```bash
GET /api/bookings
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "guestName": "John Doe",
      "roomId": { "name": "Deluxe Suite" },
      "cityId": { "name": "Agra" },
      "checkInDate": "2026-03-23",
      "checkOutDate": "2026-03-25",
      "totalPrice": 2000,
      "status": "confirmed"
    }
  ]
}
```

### Get All Complaints
```bash
GET /api/complaints
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "title": "Room too noisy",
      "description": "Guests next door were very loud",
      "category": "noise",
      "priority": "high",
      "status": "in-progress",
      "adminNotes": "Speaking with neighboring guests"
    }
  ]
}
```

---

## 🔄 Admin Workflow

### Managing Bookings

1. **View all bookings** in the Bookings tab
2. **Monitor pending bookings** using the stat card
3. **Check guest details** (name, phone, room, dates)
4. **Track completion** as stays finish

### Managing Complaints

1. **View all complaints** in the Complaints tab
2. **Prioritize by level** (critical → high → medium → low)
3. **Check category** to understand issue type
4. **Monitor resolution** through status changes
5. **Add notes** to track your responses

---

## 🔐 Security Notes

### Password Management

**DEFAULT PASSWORD**: `admin@123`

⚠️ **IMPORTANT**: Change this immediately after first login!

Add password change endpoint to backend if needed:
```javascript
PUT /api/auth/change-password
```

### Role-Based Access

- **Regular users** cannot access admin endpoints
- **Admin endpoints** require both:
  1. Valid JWT token
  2. User role = "admin"

### Data Protection

- Admin can only see bookings/complaints
- Cannot modify user passwords or roles (yet)
- Cannot delete bookings/complaints (yet - can be added)

---

## 📱 Dashboard Layout

```
┌─────────────────────────────────────────┐
│         ADMIN DASHBOARD                 │
│  Manage bookings and complaints         │
└─────────────────────────────────────────┘

┌──┐  ┌──┐  ┌──┐  ┌──┐
│15│  │ 3│  │ 8│  │ 2│
│Booking│Pending│Complaints│ Open
└──┘  └──┘  └──┘  └──┘

      [📅 Bookings]  [📝 Complaints]

      ┌─────────────────────┐
      │ Guest │ Room │ Price│
      ├─────────────────────┤
      │ John  │Suite│ ₹2000│
      │ Jane  │Room │ ₹1500│
      └─────────────────────┘
```

---

## ❓ FAQ

### Q: Can I create more admin users?
**A:** Yes! Modify `backend/scripts/createAdmin.js` to accept email/password as arguments, then run it multiple times.

### Q: How do I delete a booking?
**A:** Currently, you can only view. Add a `DELETE /bookings/:id` endpoint to the backend if needed.

### Q: Can I update complaint status manually?
**A:** Currently dashboard is view-only. Add a `PUT /complaints/:id/update-status` endpoint for manual updates.

### Q: What if I forget the admin password?
**A:** Delete the admin user from MongoDB and run `npm run create-admin` again to generate a new one.

### Q: How do I logout?
**A:** Click your name in the navbar, then "Logout" button.

---

## 🛠️ Future Enhancements

### Add These Features:

1. **Password Change**
   - Allow admin to change password
   - Add: `PUT /api/auth/change-password`

2. **Booking Management**
   - Confirm/cancel bookings from dashboard
   - Add: `PUT /api/bookings/:id/status`

3. **Complaint Management**
   - Update complaint status with notes
   - Add: `PUT /api/complaints/:id/status`

4. **User Management**
   - View all users
   - Block/unblock users
   - Reset user passwords

5. **Reports**
   - Revenue reports (total bookings × price)
   - Trending complaints
   - Peak booking dates

6. **Multiple Admins**
   - Create admin accounts with different permissions
   - Admin roles (Super Admin, Moderator, Support)

---

## 🎯 Testing Admin Features

### Test 1: Create Admin
```bash
cd backend
npm run create-admin
# Expected: Admin user created
```

### Test 2: Admin Login
1. Go to http://localhost:3000/login
2. Email: `admin@wanderlust.com`
3. Password: `admin@123`
4. Expected: Should redirect to home

### Test 3: View Dashboard
1. After login, look for "🔧 Admin" in navbar
2. Click it
3. Expected: See stats and bookings/complaints tabs

### Test 4: View Bookings
1. Click "📅 Bookings" tab
2. Expected: See table with all bookings (if any)

### Test 5: View Complaints
1. Click "📝 Complaints" tab
2. Expected: See complaint cards (if any)

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `backend/scripts/createAdmin.js` | Create admin user |
| `backend/models/User.js` | User schema with role field |
| `backend/middleware/admin.js` | Admin role verification |
| `backend/controllers/bookingController.js` | getAllBookings endpoint |
| `backend/controllers/complaintController.js` | getAllComplaints endpoint |
| `frontend/pages/admin/dashboard.jsx` | Admin dashboard UI |
| `frontend/components/Navbar.jsx` | Admin link in navbar |
| `frontend/lib/api.js` | Admin API calls |

---

## 📞 Support

Having issues? Check these:

1. **Admin won't login?**
   - Ensure backend is running on port 5000
   - Check if admin user was created: `npm run create-admin`
   - Check MongoDB connection in `.env`

2. **Dashboard shows no bookings?**
   - Create a test booking as regular user
   - Make sure you're logged in as admin
   - Check backend console for errors

3. **Can't see admin link in navbar?**
   - Make sure you're logged in as admin user (role: "admin")
   - Check browser console for errors
   - Refresh page

4. **API returning 403 Forbidden?**
   - Your account might not be admin
   - Check your user role in MongoDB
   - Try creating a new admin with `npm run create-admin`

---

## 🎉 You're All Set!

Your admin system is now **fully functional**! 

**Next Steps:**
1. Create admin user: `npm run create-admin`
2. Login: admin@wanderlust.com / admin@123
3. Access dashboard via navbar 🔧 link
4. Monitor bookings and complaints

Happy managing! 🚀

---

**Wanderlust Rooms Admin** - Stay in Control 👑
