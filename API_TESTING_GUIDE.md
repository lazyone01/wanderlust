# API Testing Guide - Wanderlust Rooms

This guide helps you test all API endpoints using tools like Postman or cURL.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require Bearer token in headers:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Send OTP
**Endpoint**: `POST /auth/send-otp`

**Request Body**:
```json
{
  "email": "testuser@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent to email (check terminal for console-based OTP)",
  "email": "testuser@example.com"
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com"}'
```

---

### 1.2 Signup with OTP
**Endpoint**: `POST /auth/signup`

**Request Body**:
```json
{
  "email": "testuser@example.com",
  "phone": "+919876543210",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "otp": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f7c1a2b4c5d6e7f8g9h0i1",
    "email": "testuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser@example.com",
    "phone":"+919876543210",
    "password":"SecurePassword123",
    "firstName":"John",
    "lastName":"Doe",
    "otp":"123456"
  }'
```

---

### 1.3 Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "testuser@example.com",
  "password": "SecurePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "63f7c1a2b4c5d6e7f8g9h0i1",
    "email": "testuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser@example.com",
    "password":"SecurePassword123"
  }'
```

---

### 1.4 Get Profile (Protected)
**Endpoint**: `GET /auth/profile`

**Headers Required**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "63f7c1a2b4c5d6e7f8g9h0i1",
    "email": "testuser@example.com",
    "phone": "+919876543210",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your_token>"
```

---

## 2. Room Endpoints (No Auth Required)

### 2.1 Get All Cities
**Endpoint**: `GET /rooms/cities`

**Response**:
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i1",
      "name": "Agra",
      "state": "Uttar Pradesh",
      "description": "Home of the Taj Mahal",
      "roomCount": 6
    },
    {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i2",
      "name": "Jaipur",
      "state": "Rajasthan",
      "description": "The Pink City",
      "roomCount": 6
    }
  ]
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/rooms/cities
```

---

### 2.2 Get All Rooms
**Endpoint**: `GET /rooms`

**Query Parameters**:
- `cityId` - Optional, filter by city ID
- `minPrice` - Optional, minimum price (₹)
- `maxPrice` - Optional, maximum price (₹)

**Example URLs**:
```
/rooms                                           # All rooms
/rooms?cityId=63f7c1a2b4c5d6e7f8g9h0i1          # Rooms in specific city
/rooms?minPrice=500&maxPrice=1500               # Price range
/rooms?cityId=xxx&minPrice=500&maxPrice=1500    # Combined filters
```

**Response**:
```json
{
  "success": true,
  "count": 90,
  "data": [
    {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i3",
      "roomId": "agra-room-1",
      "name": "Deluxe Room",
      "description": "Comfortable stay with modern amenities",
      "images": ["https://images.unsplash.com/..."],
      "capacity": 2,
      "price": 1200,
      "currency": "₹",
      "contactPhone": "+919876543210",
      "facilities": ["Free WiFi", "Hot Water", "Private Bathroom", "24/7 Access"],
      "availability": true,
      "rating": 4.5,
      "cityId": {
        "_id": "63f7c1a2b4c5d6e7f8g9h0i1",
        "name": "Agra"
      }
    }
  ]
}
```

**cURL**:
```bash
# All rooms
curl -X GET "http://localhost:5000/api/rooms"

# Filtered rooms
curl -X GET "http://localhost:5000/api/rooms?minPrice=500&maxPrice=1500"
```

---

### 2.3 Get Room by ID
**Endpoint**: `GET /rooms/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "63f7c1a2b4c5d6e7f8g9h0i3",
    "roomId": "agra-room-1",
    "name": "Deluxe Room",
    "description": "Comfortable stay with modern amenities",
    "images": ["https://images.unsplash.com/..."],
    "capacity": 2,
    "price": 1200,
    "currency": "₹",
    "contactPhone": "+919876543210",
    "facilities": ["Free WiFi", "Hot Water", "Private Bathroom"],
    "availability": true,
    "rating": 4.5,
    "cityId": {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i1",
      "name": "Agra",
      "state": "Uttar Pradesh"
    }
  }
}
```

**cURL**:
```bash
curl -X GET "http://localhost:5000/api/rooms/63f7c1a2b4c5d6e7f8g9h0i3"
```

---

### 2.4 Get Rooms by City
**Endpoint**: `GET /rooms/city/:cityId/rooms`

**Response**: Array of 6 rooms for that city

**cURL**:
```bash
curl -X GET "http://localhost:5000/api/rooms/city/63f7c1a2b4c5d6e7f8g9h0i1/rooms"
```

---

## 3. Booking Endpoints (Auth Required)

### 3.1 Create Booking
**Endpoint**: `POST /bookings`

**Headers**: 
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "roomId": "63f7c1a2b4c5d6e7f8g9h0i3",
  "checkInDate": "2024-02-01T00:00:00Z",
  "checkOutDate": "2024-02-05T00:00:00Z",
  "numberOfGuests": 2,
  "guestName": "John Doe",
  "guestPhone": "+919876543210",
  "specialRequests": "Extra pillow needed"
}
```

**Response** (Booking created for 4 nights = ₹1200 × 4 = ₹4800):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "63f7c1a2b4c5d6e7f8g9h0i4",
    "userId": "63f7c1a2b4c5d6e7f8g9h0i1",
    "roomId": {...},
    "checkInDate": "2024-02-01T00:00:00Z",
    "checkOutDate": "2024-02-05T00:00:00Z",
    "numberOfGuests": 2,
    "totalPrice": 4800,
    "status": "pending",
    "guestName": "John Doe",
    "guestPhone": "+919876543210",
    "specialRequests": "Extra pillow needed",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId":"63f7c1a2b4c5d6e7f8g9h0i3",
    "checkInDate":"2024-02-01T00:00:00Z",
    "checkOutDate":"2024-02-05T00:00:00Z",
    "numberOfGuests":2,
    "guestName":"John Doe",
    "guestPhone":"+919876543210",
    "specialRequests":"Extra pillow"
  }'
```

---

### 3.2 Get My Bookings
**Endpoint**: `GET /bookings/user/my-bookings`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i4",
      "roomId": {...},
      "checkInDate": "2024-02-01T00:00:00Z",
      "checkOutDate": "2024-02-05T00:00:00Z",
      "totalPrice": 4800,
      "status": "pending"
    }
  ]
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/bookings/user/my-bookings \
  -H "Authorization: Bearer <your_token>"
```

---

### 3.3 Cancel Booking
**Endpoint**: `PUT /bookings/:id/cancel`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "63f7c1a2b4c5d6e7f8g9h0i4",
    "status": "cancelled"
  }
}
```

**cURL**:
```bash
curl -X PUT http://localhost:5000/api/bookings/63f7c1a2b4c5d6e7f8g9h0i4/cancel \
  -H "Authorization: Bearer <your_token>"
```

---

## 4. Complaint Endpoints (Auth Required)

### 4.1 Create Complaint
**Endpoint**: `POST /complaints`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Room was not clean",
  "description": "The room had dust and was not properly cleaned before check-in",
  "category": "cleanliness",
  "priority": "high",
  "bookingId": "63f7c1a2b4c5d6e7f8g9h0i4"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "_id": "63f7c1a2b4c5d6e7f8g9h0i5",
    "userId": "63f7c1a2b4c5d6e7f8g9h0i1",
    "title": "Room was not clean",
    "description": "The room had dust...",
    "category": "cleanliness",
    "priority": "high",
    "status": "open",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**cURL**:
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Room was not clean",
    "description":"The room had dust...",
    "category":"cleanliness",
    "priority":"high"
  }'
```

---

### 4.2 Get My Complaints
**Endpoint**: `GET /complaints/user/my-complaints`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "63f7c1a2b4c5d6e7f8g9h0i5",
      "title": "Room was not clean",
      "category": "cleanliness",
      "status": "open",
      "priority": "high",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/complaints/user/my-complaints \
  -H "Authorization: Bearer <your_token>"
```

---

## 5. Health Check

### Server Status
**Endpoint**: `GET /health`

**Response**:
```json
{
  "success": true,
  "message": "Server is running"
}
```

**cURL**:
```bash
curl -X GET http://localhost:5000/api/health
```

---

## Testing Workflow

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```
✓ Check backend terminal for OTP

### 2. Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "phone":"+919876543210",
    "password":"Test@123",
    "firstName":"Test",
    "lastName":"User",
    "otp":"XXXXXX"
  }'
```
✓ Save the token

### 3. Get Cities
```bash
curl -X GET http://localhost:5000/api/rooms/cities
```
✓ Copy a city ID

### 4. Get Rooms for City
```bash
curl -X GET http://localhost:5000/api/rooms/city/<city_id>/rooms
```
✓ Copy a room ID

### 5. Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"roomId":"<room_id>","checkInDate":"2024-02-01T00:00:00Z","checkOutDate":"2024-02-05T00:00:00Z","numberOfGuests":2,"guestName":"John","guestPhone":"+919876543210"}'
```

### 6. Create Complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test complaint","category":"other","priority":"low"}'
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 404 Not Found
```json
{
  "message": "Room not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Postman Collection

Import this JSON into Postman for easy testing:

1. Create new collection: "Wanderlust Rooms"
2. Add requests using the examples above
3. Use environment variables for token and IDs
4. Test all endpoints sequentially

---

**Happy Testing! 🚀**
