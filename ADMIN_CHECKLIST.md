# ✅ Admin Setup Checklist

## 🎯 Complete This to Enable Admin Features

### Prerequisites
- [ ] Backend is running on `localhost:5000`
- [ ] Frontend is running on `localhost:3000`
- [ ] MongoDB is connected

### Step 1: Create Admin User
```bash
cd backend
npm run create-admin
```
- [ ] Command executed successfully
- [ ] See message: "✅ Admin user created successfully!"
- [ ] Email: `admin@wanderlust.com`
- [ ] Password: `admin@123`

### Step 2: Admin Login
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter email: `admin@wanderlust.com`
- [ ] Enter password: `admin@123`
- [ ] Click "Login" button
- [ ] Successfully redirected to home page

### Step 3: Find Admin Link
- [ ] Check navbar (top navigation)
- [ ] Should see "🔧 Admin" link next to "Complaints"
- [ ] Link only visible when logged in as admin

### Step 4: Access Dashboard
- [ ] Click "🔧 Admin" link
- [ ] Should load `/admin/dashboard`
- [ ] See 4 stat cards at top

### Step 5: View Statistics
- [ ] 📊 Total Bookings card shows count (0 or more)
- [ ] ⏳ Pending Bookings card shows count
- [ ] 📝 Total Complaints card shows count
- [ ] 🚨 Open Complaints card shows count

### Step 6: Test Bookings Tab
- [ ] Click "📅 Bookings" tab
- [ ] See table with columns: Guest, Room, City, Check-In, Check-Out, Price, Status
- [ ] If any bookings exist, they should be visible

### Step 7: Test Complaints Tab
- [ ] Click "📝 Complaints" tab
- [ ] See complaint cards (if any exist)
- [ ] Each card shows: Title, Category, Priority, Status, Admin Notes

---

## 📊 What You Can Now Do

### View All Bookings
✅ See all user bookings in one place
✅ Filter by status (pending, confirmed, cancelled, completed)
✅ View guest details and booking prices

### View All Complaints
✅ See all user complaints
✅ Filter by status (open, in-progress, resolved, closed)
✅ Filter by priority (low, medium, high, critical)
✅ See admin notes

---

## 🔄 Next Steps (Optional)

### Create Test Data
To see bookings and complaints in the dashboard:

1. **Create a test booking**:
   - Login as regular user
   - Browse rooms
   - Click "Book Now"
   - Fill booking details
   - Submit booking

2. **Create a test complaint**:
   - Go to Complaints page
   - Click "Raise Complaint"
   - Fill complaint form
   - Submit complaint

3. **View as admin**:
   - Login as admin
   - Go to dashboard
   - See your test data

### Future Enhancements
- [ ] Add "Confirm" button for pending bookings
- [ ] Add "Update Status" button for complaints
- [ ] Add search/filter functionality
- [ ] Add export to CSV/PDF
- [ ] Add analytics/charts

---

## 🆘 Troubleshooting

### Admin link not showing?
- [ ] Check if you're logged in
- [ ] Check if `user.role === 'admin'` in localStorage
- [ ] Refresh page
- [ ] Logout and login again

### Dashboard shows 404?
- [ ] Make sure frontend is running
- [ ] Check URL: `http://localhost:3000/admin/dashboard`
- [ ] Check browser console for errors

### Can't login as admin?
- [ ] Run `npm run create-admin` again
- [ ] Check MongoDB connection
- [ ] Verify email/password are correct

### No data in dashboard?
- [ ] Create test bookings/complaints as regular user
- [ ] Refresh dashboard
- [ ] Check backend console for errors

---

## 📝 Files Changed/Created

### Backend
- ✅ `backend/scripts/createAdmin.js` - Create admin user
- ✅ `backend/package.json` - Added `create-admin` script

### Frontend
- ✅ `frontend/pages/admin/dashboard.jsx` - Admin dashboard page
- ✅ `frontend/lib/api.js` - Added admin API methods
- ✅ `frontend/components/Navbar.jsx` - Added admin link
- ✅ `frontend/jsconfig.json` - Path aliases config

### Documentation
- ✅ `ADMIN_SETUP_GUIDE.md` - Comprehensive admin guide

---

## ✨ Features Ready to Use

| Feature | Status | Link |
|---------|--------|------|
| Admin Login | ✅ Ready | `/login` |
| Dashboard | ✅ Ready | `/admin/dashboard` |
| View Bookings | ✅ Ready | Dashboard → Bookings tab |
| View Complaints | ✅ Ready | Dashboard → Complaints tab |
| Update Complaint Status | ⏳ Coming Soon | (Backend ready, UI TBD) |
| Update Booking Status | ⏳ Coming Soon | (Backend ready, UI TBD) |
| User Management | ⏳ Coming Soon | TBD |
| Analytics | ⏳ Coming Soon | TBD |

---

## 🎯 Success Criteria

You've successfully set up admin features when:

✅ Can login as `admin@wanderlust.com` / `admin@123`
✅ See "🔧 Admin" link in navbar
✅ Dashboard loads with statistics
✅ Can view all bookings in table format
✅ Can view all complaints with details
✅ Statistics update when new bookings/complaints are created

---

## 📞 Need Help?

See: `ADMIN_SETUP_GUIDE.md` for detailed instructions

---

**Setup Complete!** 🎉

Your admin system is now fully functional.
