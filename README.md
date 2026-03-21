# 🌍 Wanderlust Rooms - Budget Tourist Room Booking Platform

A complete production-ready full-stack web application for booking budget tourist rooms across 15 major destinations in India.

**Live Demo**: Coming Soon  
**GitHub**: [wanderlust-rooms](https://github.com)  
**Contact**: jayjaiswal655@gmail.com | 9771147497

---

## 🎯 Project Overview

Wanderlust Rooms is an **Airbnb-inspired platform** that connects budget-conscious travelers with verified, affordable accommodation across India. Each room listing displays verified facilities, transparent pricing in Indian Rupees (₹), and verified contact information.

### Key Features

✅ **User Authentication**
- OTP-based signup with JWT authentication
- Secure password hashing with bcryptjs
- Console-based OTP verification (ready for real SMS integration)

✅ **Room Booking System**
- Browse 90 rooms across 15 Indian cities
- Filter by price, facilities, and location
- Instant booking confirmation
- Booking management & cancellation

✅ **Complaints Management**
- Submit complaints by category (cleanliness, facilities, service, etc.)
- Priority-based complaint tracking
- Admin response system
- Complete complaint history

✅ **Modern UI/UX**
- Airbnb-level design with Framer Motion animations
- Responsive design (mobile, tablet, desktop)
- Light Blue + White gradient theme
- Smooth page transitions & hover effects

✅ **Admin Dashboard**
- View all bookings & users
- Manage complaints
- Monitor platform statistics

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT + OTP
- **Password Hashing**: bcryptjs

### Databases
- **Primary**: MongoDB (Cloud or Local)
- **TTL Index**: Auto-delete expired OTPs

---

## 📁 Project Structure

```
wanderlust02/
├── frontend/                    # Next.js Frontend
│   ├── pages/                  # Page components
│   │   ├── index.jsx          # Homepage with search
│   │   ├── rooms.jsx          # Room listing & filtering
│   │   ├── signup.jsx         # OTP signup
│   │   ├── login.jsx          # Login
│   │   ├── my-bookings.jsx    # User bookings
│   │   ├── complaints.jsx     # Complaints management
│   │   └── _app.jsx           # Root app
│   ├── components/            # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── RoomCard.jsx
│   │   ├── CityCard.jsx
│   │   └── Modal.jsx
│   ├── lib/                   # Utilities
│   │   └── api.js            # API client with interceptors
│   ├── store/                # State management
│   │   └── store.js          # Zustand stores
│   ├── styles/               # Global styles
│   │   └── globals.css
│   ├── .env.local            # Local env variables
│   └── package.json

└── backend/                    # Express Backend
    ├── models/                # MongoDB schemas
    │   ├── User.js
    │   ├── City.js
    │   ├── Room.js
    │   ├── Booking.js
    │   ├── Complaint.js
    │   └── OTP.js
    ├── controllers/           # Route handlers
    │   ├── authController.js
    │   ├── roomController.js
    │   ├── bookingController.js
    │   └── complaintController.js
    ├── routes/                # API routes
    │   ├── authRoutes.js
    │   ├── roomRoutes.js
    │   ├── bookingRoutes.js
    │   └── complaintRoutes.js
    ├── middleware/            # Custom middleware
    │   ├── auth.js
    │   ├── admin.js
    │   └── errorHandler.js
    ├── utils/                 # Helper functions
    │   ├── auth.js            # JWT & OTP generation
    │   └── password.js        # Password hashing
    ├── config/                # Configuration
    │   └── database.js
    ├── scripts/               # Utility scripts
    │   └── seedData.js        # Auto-seed 15 cities + 90 rooms
    ├── server.js              # Main server file
    ├── .env                   # Environment variables
    ├── .env.example           # Example env file
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v16+ (Download from [nodejs.org](https://nodejs.org))
- **MongoDB**: Local or Cloud (MongoDB Atlas)
- **Git**: For version control
- **npm or yarn**: Package manager

### 1. Clone Repository

```bash
cd wanderlust02
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env and add your MongoDB URI and JWT secret:
# MONGODB_URI=mongodb://localhost:27017/wanderlust_rooms
# JWT_SECRET=your_secret_key_min_32_chars
# PORT=5000
# FRONTEND_URL=http://localhost:3000

# Seed database with 15 cities and 90 rooms
npm run seed

# Start the backend server
npm run dev
```

**Backend will be running on**: `http://localhost:5000`

**API Base URL**: `http://localhost:5000/api`

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be running on**: `http://localhost:3000`

---

## 📚 API Documentation

### Authentication Endpoints

#### Send OTP
```
POST /api/auth/send-otp
Body: { email: "user@example.com" }
Response: { success: true, message: "OTP sent", email: "user@example.com" }
```

#### Signup with OTP
```
POST /api/auth/signup
Body: {
  email: "user@example.com",
  phone: "+919876543210",
  password: "secure_password",
  firstName: "John",
  lastName: "Doe",
  otp: "123456"
}
Response: { success: true, token: "jwt_token", user: {...} }
```

#### Login
```
POST /api/auth/login
Body: { email: "user@example.com", password: "password" }
Response: { success: true, token: "jwt_token", user: {...} }
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, user: {...} }
```

### Room Endpoints

#### Get All Cities
```
GET /api/rooms/cities
Response: { success: true, count: 15, data: [...] }
```

#### Get All Rooms
```
GET /api/rooms
Query Params: ?cityId=xxx&minPrice=500&maxPrice=2500
Response: { success: true, count: 90, data: [...] }
```

#### Get Room by ID
```
GET /api/rooms/:id
Response: { success: true, data: {...} }
```

#### Get Rooms by City
```
GET /api/rooms/city/:cityId/rooms
Response: { success: true, count: 6, data: [...] }
```

### Booking Endpoints (Protected)

#### Create Booking
```
POST /api/bookings
Headers: { Authorization: "Bearer jwt_token" }
Body: {
  roomId: "room_id",
  checkInDate: "2024-01-15",
  checkOutDate: "2024-01-20",
  numberOfGuests: 2,
  guestName: "John Doe",
  guestPhone: "+919876543210",
  specialRequests: "Extra pillow please"
}
Response: { success: true, message: "Booking created", data: {...} }
```

#### Get My Bookings
```
GET /api/bookings/user/my-bookings
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, count: 5, data: [...] }
```

#### Cancel Booking
```
PUT /api/bookings/:id/cancel
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, message: "Booking cancelled", data: {...} }
```

### Complaint Endpoints (Protected)

#### Create Complaint
```
POST /api/complaints
Headers: { Authorization: "Bearer jwt_token" }
Body: {
  title: "Room not clean",
  description: "The room was not properly cleaned",
  category: "cleanliness",
  priority: "high"
}
Response: { success: true, message: "Complaint created", data: {...} }
```

#### Get My Complaints
```
GET /api/complaints/user/my-complaints
Headers: { Authorization: "Bearer jwt_token" }
Response: { success: true, count: 2, data: [...] }
```

---

## 🔐 Authentication Flow

### Signup Process
1. User enters email → `POST /api/auth/send-otp`
2. OTP generated and logged in terminal
3. User enters OTP → Verification
4. User fills form (name, phone, password)
5. `POST /api/auth/signup` → Account created, JWT token returned
6. Token stored in localStorage

### Login Process
1. User enters email & password → `POST /api/auth/login`
2. JWT token returned
3. Token automatically added to all subsequent requests

### OTP Details
- OTP generated: 6-digit random number
- Validity: 15 minutes
- Console logging: Check backend terminal for OTP
- Max attempts: 3 (then OTP expires)
- Real SMS integration: Ready for future implementation

---

## 📊 Database Schema

### User
```javascript
{
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: "user" | "admin",
  isVerified: Boolean,
  otpVerifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### City
```javascript
{
  name: String (unique),
  state: String,
  description: String,
  imageUrl: String,
  latitude: Number,
  longitude: Number,
  roomCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Room
```javascript
{
  roomId: String (unique),
  cityId: ObjectId (ref: City),
  name: String,
  description: String,
  images: [String],
  capacity: Number (default: 2),
  price: Number (500-2500),
  currency: String (₹),
  contactPhone: String,
  facilities: [String], // WiFi, Hot Water, Bathroom, etc.
  availability: Boolean,
  rating: Number (0-5),
  reviews: [{ userId, rating, comment, createdAt }],
  createdAt: Date,
  updatedAt: Date
}
```

### Booking
```javascript
{
  userId: ObjectId (ref: User),
  roomId: ObjectId (ref: Room),
  cityId: ObjectId (ref: City),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  totalPrice: Number,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  guestName: String,
  guestPhone: String,
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint
```javascript
{
  userId: ObjectId (ref: User),
  bookingId: ObjectId (ref: Booking),
  roomId: ObjectId (ref: Room),
  title: String,
  description: String,
  category: "cleanliness" | "facilities" | "service" | "noise" | "security" | "other",
  status: "open" | "in-progress" | "resolved" | "closed",
  priority: "low" | "medium" | "high" | "critical",
  adminNotes: String,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI Features

### Homepage
- ✨ Hero section with search bar
- 🏙️ Featured destinations (6 cities)
- 🎯 Filter by dates and guests
- 📱 Fully responsive design

### Room Listing
- 🔍 Grid-based room display
- 💰 Price filtering (₹500-₹2500)
- 🎪 Facility badges
- ⭐ Rating system
- 📞 Contact number display

### Room Cards Include
- Room image
- Room name & description
- Price per night (₹)
- Capacity (2 persons)
- Available facilities
- Contact phone number
- "Book Now" button

### Animations
- Page load fade-in
- Card hover 3D effects
- Smooth button transitions
- Modal animations
- Stagger animations for lists

### Design Theme
- **Primary Colors**: Light Blue (#0099ff) + White
- **Accents**: Cyan (#00d4ff), Rose (#ff6b6b)
- **Shadows**: Soft, medium, premium
- **Typography**: Clean, modern sans-serif
- **Border Radius**: 12px (rounded cards)

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/wanderlust_rooms
JWT_SECRET=wanderlust_super_secret_jwt_key_2026_min_32_chars_long
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📱 Device Support

- ✅ Desktop (1920px and above)
- ✅ Laptop (1366px - 1919px)
- ✅ Tablet (768px - 1365px)
- ✅ Mobile (320px - 767px)

---

## 🚀 Deployment Guide

### Deploy Backend (Heroku / Railway / Render)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy automatically

### Deploy Frontend (Vercel / Netlify)
1. Connect GitHub repo to Vercel
2. Set `NEXT_PUBLIC_API_URL` env variable
3. Auto-deploy on push

### MongoDB Atlas Setup
1. Create account at [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in backend .env

---

## 🧪 Testing the Platform

### Test Signup
1. Go to `/signup`
2. Enter email
3. Check backend terminal for OTP
4. Copy OTP and verify
5. Fill form and create account

### Test Room Booking
1. Login to account
2. Go to `/rooms`
3. Select a city and dates
4. Click "Book Now"
5. Fill booking details
6. Confirm booking
7. Check `/my-bookings`

### Test Complaints
1. Go to `/complaints`
2. Click "Raise Complaint"
3. Fill complaint form
4. Submit and view history

---

## 🔒 Security Features

✅ JWT Authentication  
✅ Password Hashing (bcryptjs)  
✅ CORS Protection  
✅ Environment Variable Protection  
✅ Role-Based Access Control (User/Admin)  
✅ OTP Verification  
✅ Secure Token Storage  
✅ Input Validation  
✅ Error Handling Middleware  

---

## 🚦 Future Enhancements

- [ ] Real OTP via Twilio/AWS SNS
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Review & rating system
- [ ] Wishlist feature
- [ ] Email notifications
- [ ] Admin dashboard UI
- [ ] Image upload to S3
- [ ] Availability calendar
- [ ] Multi-language support
- [ ] Google/Facebook authentication
- [ ] API rate limiting
- [ ] Advanced analytics

---

## 📞 Support & Contact

**Email**: jayjaiswal655@gmail.com  
**Phone**: 9771147497  
**Website**: www.wanderlustrooms.com

---

## 📜 License

MIT License - Feel free to use this project for personal and commercial purposes.

---

## 👨‍💻 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 | React-based framework |
| Styling | TailwindCSS | Utility-first CSS |
| Animation | Framer Motion | Smooth animations |
| State | Zustand | Lightweight state management |
| Backend | Express.js | Node.js web framework |
| Database | MongoDB | NoSQL database |
| Auth | JWT + OTP | Secure authentication |
| Password | bcryptjs | Password hashing |
| HTTP | Axios | HTTP client |

---

**Made with ❤️ for budget travelers across India**

🌍 Explore. Book. Stay. Enjoy!
