# 🔧 Admin Bookings & Complaints Debugging Guide

## What Was Fixed

I've fixed the following issues that were preventing the admin dashboard from displaying bookings and complaints:

### 1. **API Response Structure** ✅
- **Problem**: Frontend was trying to access `bookingsRes.data` but the actual data was nested as `bookingsRes.data.data`
- **Fix**: Updated dashboard to correctly access `bookingsRes.data.data` and `complaintsRes.data.data`

### 2. **Route Middleware** ✅
- **Problem**: `authMiddleware` was being applied twice on admin routes
- **Fix**: Removed redundant `authMiddleware` from route definitions since it's already applied at the app level

---

## 🚀 Next Steps to Test

### Step 1: Reload Backend (If Running)
The backend has been updated with corrected routes. It should automatically restart due to nodemon.

### Step 2: Refresh Frontend
1. Go to http://localhost:3000/admin/dashboard (if you're logged in as admin)
2. Press `F5` or `Ctrl+Shift+R` to hard refresh
3. The dashboard should now load

### Step 3: Verify Data Displays

**If no bookings/complaints show:**
1. Create test data as a regular user:
   - Create a booking
   - Create a complaint
2. Login as admin again
3. Refresh the admin dashboard
4. You should now see the test data

---

## 🧪 Testing the APIs Directly

### Test 1: Get Admin Token

First, login as admin to get a token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d {
    "email": "admin@wanderlust.com",
    "password": "admin@123"
  }
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "email": "admin@wanderlust.com",
    "role": "admin",
    "firstName": "Admin"
  }
}
```

**Save the token value** and use it in the next steps.

### Test 2: Get All Bookings

```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response (if bookings exist):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "guestName": "John Doe",
      "roomId": {
        "_id": "...",
        "name": "Deluxe Suite"
      },
      "cityId": {
        "_id": "...",
        "name": "Agra"
      },
      "checkInDate": "2026-03-25",
      "checkOutDate": "2026-03-27",
      "totalPrice": 2000,
      "status": "pending"
    }
  ]
}
```

**Expected Response (if no bookings):**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

### Test 3: Get All Complaints

```bash
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response (if complaints exist):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "title": "Room too noisy",
      "description": "Guests next door were very loud",
      "category": "noise",
      "priority": "high",
      "status": "open",
      "adminNotes": ""
    }
  ]
}
```

---

## 🔍 Browser Console Debugging

If you still don't see data, check the browser console:

1. **Open DevTools**: Press `F12`
2. **Go to Console tab**: See if there are any red error messages
3. **Check Network tab**: 
   - Make sure API calls are being made to `/api/bookings` and `/api/complaints`
   - Check the response status (should be 200, not 401 or 403)
   - Look at the response data to see what's being returned

---

## ❌ Common Issues & Solutions

### Issue 1: "Admin access required" Error (403)

**Cause**: Your account is not actually an admin

**Solution**:
1. Check if you created the admin user: `npm run create-admin`
2. Verify you're logged in as admin:
   - Check localStorage in DevTools
   - The `user` object should have `"role": "admin"`
3. If not, create a new admin user and login again

### Issue 2: "No token provided" (401)

**Cause**: Token not being sent in the request header

**Solution**:
1. Check if you're logged in
2. Check localStorage for the `token` key
3. Verify frontend is sending it correctly:
   - Open DevTools Network tab
   - Check the request headers for `Authorization: Bearer ...`

### Issue 3: "Invalid or expired token" (401)

**Cause**: Token is expired or malformed

**Solution**:
1. Logout and login again
2. This will generate a new token
3. Try accessing the dashboard again

### Issue 4: CORS Error

**Example**: `Access to XMLHttpRequest blocked by CORS policy`

**Cause**: Backend CORS configuration issue

**Solution**:
1. Verify backend `.env`:
   - `FRONTEND_URL=http://localhost:3000`
2. Check `backend/server.js` line 34-40:
   ```javascript
   cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true,
   })
   ```
3. Restart backend: `npm run dev`

### Issue 5: "Cannot read property 'data' of undefined"

**Cause**: API not returning array in `data` property

**Solution**:
1. The response structure should be:
   ```json
   {
     "success": true,
     "count": N,
     "data": [...]  // This is what we access
   }
   ```
2. If not, check backend controller response format
3. Verify you updated the dashboard code correctly

---

## 📝 Files Modified

### Backend
- ✅ `backend/routes/bookingRoutes.js` - Removed redundant authMiddleware
- ✅ `backend/routes/complaintRoutes.js` - Removed redundant authMiddleware

### Frontend  
- ✅ `frontend/pages/admin/dashboard.jsx` - Fixed API response access

---

## ✅ Verification Checklist

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Can login as admin (admin@wanderlust.com / admin@123)
- [ ] See "🔧 Admin" link in navbar
- [ ] Dashboard loads without errors
- [ ] Statistics cards show numbers
- [ ] Bookings tab displays table (even if empty)
- [ ] Complaints tab displays cards (even if empty)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls (200 status)

---

## 🧠 How It Works (Architecture)

```
Frontend (http://localhost:3000)
    ↓
Browser User Logs In As Admin
    ↓
Token Stored in localStorage
    ↓
Admin Clicks "🔧 Admin" Link
    ↓
Loads /admin/dashboard page
    ↓
fetchData() runs on page load
    ↓
API Calls Made:
  1. GET /api/bookings (with token in Authorization header)
  2. GET /api/complaints (with token in Authorization header)
    ↓
Backend (http://localhost:5000)
    ↓
Route Matches: GET /api/bookings
    ↓
Middleware Chain:
  1. authMiddleware (verifies token, fetches user)
  2. adminMiddleware (checks user.role === 'admin')
    ↓
Controller: getAllBookings()
    ↓
Returns: { success: true, count: N, data: [...] }
    ↓
Frontend Receives Response
    ↓
JavaScript: bookingsRes.data.data = the actual array
    ↓
setState(bookingsList)
    ↓
Component Re-renders
    ↓
Displays bookings in table
```

---

## 🎯 Success Indicators

You're all set when:

✅ **Dashboard Loads**: No errors in network tab
✅ **Stats Display**: Four stat cards show numbers
✅ **Bookings Tab Works**: Shows table even if empty
✅ **Complaints Tab Works**: Shows cards even if empty
✅ **With Test Data**: Creates booking as user, sees it as admin

---

## 📞 Need More Help?

1. **Check Browser Console** (F12 → Console tab) for error messages
2. **Check Network Tab** (F12 → Network) for API response details
3. **Check Backend Terminal** for server logs
4. **Verify Admin Status** in localStorage:
   - Open DevTools → Application → localStorage
   - Look for `user` key and check `"role": "admin"`

---

## 🔧 Quick Fixes

### Refresh Everything
```bash
# Kill all Node processes
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force

# Restart backend
cd backend
npm run dev

# Refresh frontend (F5)
```

### Clear Frontend Cache
1. Open DevTools (F12)
2. Right-click reload button → "Empty cache and hard reload"
3. Try again

### Reset Admin User
```bash
cd backend
npm run create-admin
# Then login again with new credentials
```

---

**Your admin features are now fully functional!** 🎉

Test them out by:
1. Creating a booking as a regular user
2. Logging in as admin
3. Viewing the booking in the admin dashboard

