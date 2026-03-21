Creating directories for frontend lib, store, and styles...

# Wanderlust Rooms Project Setup Guide

## Prerequisites Installation

### Windows Users
1. **Node.js & npm**
   - Download from https://nodejs.org
   - Version 16+ required
   - Verify: `node --version` and `npm --version`

2. **MongoDB**
   - Local: Download from https://www.mongodb.com/try/download/community
   - OR Cloud: https://www.mongodb.com/cloud/atlas (Free tier available)

3. **Git** (Optional)
   - Download from https://git-scm.com

4. **VS Code** (Recommended)
   - Download from https://code.visualstudio.com

## Installation Steps

### Step 1: Navigate to Project
```bash
cd d:\Projects02\wanderlust02
```

### Step 2: Backend Installation
```bash
cd backend

# Install all dependencies
npm install

# Check if MongoDB is running locally or have cloud URI ready
# Edit .env file with your MongoDB URI

# Seed database with data (15 cities, 90 rooms)
npm run seed

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 3: Frontend Installation (In new terminal)
```bash
cd frontend

# Install all dependencies
npm install

# Start frontend server
npm run dev
```

Frontend runs on `http://localhost:3000`

## First Time Setup Checklist

- [ ] MongoDB is running (local or cloud connection verified)
- [ ] Backend `.env` file configured with valid MONGODB_URI
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on port 3000
- [ ] Browser opens to http://localhost:3000

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running: `mongod` command or MongoDB Compass
- Check connection string in `.env` file
- For Atlas: Whitelist your IP address

### Port Already in Use
Backend port 5000:
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Frontend port 3000:
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm install fails
- Delete `node_modules` folder and `package-lock.json`
- Clear npm cache: `npm cache clean --force`
- Run `npm install` again

## Testing the Platform

1. **Homepage**: http://localhost:3000
2. **Signup**: http://localhost:3000/signup
3. **Login**: http://localhost:3000/login
4. **Browse Rooms**: http://localhost:3000/rooms
5. **My Bookings**: http://localhost:3000/my-bookings (after login)
6. **Complaints**: http://localhost:3000/complaints (after login)

## OTP Testing

When you signup:
1. Enter email
2. Check **backend terminal** for printed OTP
3. Copy the 6-digit OTP from terminal
4. Paste in verification screen
5. Complete signup

## Default Test Account (After Seeding)

Can create own accounts via signup process.

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/wanderlust_rooms
JWT_SECRET=wanderlust_super_secret_jwt_key_2026_min_32_chars_long
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## File Structure

```
wanderlust02/
├── backend/              # Express + MongoDB
│   ├── models/          # Database schemas
│   ├── controllers/     # API logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling
│   ├── scripts/         # Seed data script
│   └── server.js        # Main server
├── frontend/            # Next.js + TailwindCSS
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/            # API client
│   └── store/          # State management
└── README.md           # Full documentation
```

## Support

- Documentation: See [README.md](README.md)
- Contact: jayjaiswal655@gmail.com
- Phone: 9771147497

## Next Steps

1. ✅ Run both servers
2. 📝 Create account on signup page
3. 🏨 Browse rooms on rooms page
4. 📅 Make a booking
5. 💬 Raise a complaint if needed

Happy exploring! 🌍
