# 📱 Post-Deployment Development Guide

## Quick Overview

**After deploying to Vercel, your workflow becomes:**

```
Make changes in VS Code
    ↓
git commit & git push
    ↓
Vercel auto-deploys (1-2 minutes)
    ↓
Changes live! ✅
```

No need to manually deploy or restart servers!

---

## Complete Development Workflow

### 1. Set Up Your Local Environment

```bash
# Clone your repository (if on new machine)
git clone https://github.com/YOUR_USERNAME/wanderlust.git
cd wanderlust

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Create .env file (NOT in git)
# Copy from .env.example or create manually
```

### 2. Make Code Changes

```bash
# Start both servers locally
# Terminal 1:
cd backend
npm start

# Terminal 2:
cd frontend
npm run dev

# Now edit files in VS Code
# Changes auto-refresh in browser!
```

### 3. Test Locally

```
Before pushing to GitHub:
1. Open http://localhost:3000
2. Test your changes
3. Check browser console (F12) for errors
4. Test on mobile (if responsive design)
```

### 4. Commit and Push

```bash
# From project root
git add .
git commit -m "feat: Describe your change"
git push origin main
```

### 5. Vercel Auto-Deploy

- Watch Vercel dashboard
- See deployment progress
- Get notified when live ✅

---

## Example: Add a New Feature

### Scenario: Add a "Wishlist" Button to Room Cards

#### Step 1: Make Changes Locally

**File: `frontend/components/RoomCard.jsx`**

```jsx
// Find this section
<button onClick={() => handleBook(room._id)}>
  Book Now
</button>

// Add wishlist button
<button onClick={() => handleBook(room._id)}>
  Book Now
</button>
<button onClick={() => addToWishlist(room._id)}>
  ❤️ Wishlist
</button>

// Add the function
const addToWishlist = async (roomId) => {
  // Implementation
};
```

#### Step 2: Test Locally

```bash
# Terminal 1: Backend running
npm start

# Terminal 2: Frontend running
npm run dev

# Browser: http://localhost:3000/rooms
# Click the new ❤️ Wishlist button
# Works? ✅
```

#### Step 3: Commit and Push

```bash
cd frontend

# Check what changed
git status
# Output: RoomCard.jsx modified

# Stage changes
git add components/RoomCard.jsx

# Commit with message
git commit -m "feat: Add wishlist button to room cards"

# Push to GitHub
git push origin main
```

#### Step 4: Watch Deployment

- Open [vercel.com/dashboard](https://vercel.com/dashboard)
- Click your project
- See deployment progress
- Get notification when done

#### Step 5: Verify on Production

```
https://your-app.vercel.app/rooms
See the new ❤️ Wishlist button! ✅
```

---

## Making Backend Changes

### Adding a New API Endpoint

#### Step 1: Create Backend Code

**File: `backend/controllers/roomController.js`**

```js
// Add new function
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.find({ userId });
    
    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

**File: `backend/routes/roomRoutes.js`**

```js
// Add new route
router.get('/wishlist', auth, roomController.getWishlist);
```

#### Step 2: Test on Localhost

```bash
# Terminal: Backend running on localhost:5000

# Test with Postman or curl
curl http://localhost:5000/api/rooms/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return wishlist data
```

#### Step 3: Update Frontend to Use It

**File: `frontend/lib/api.js`**

```js
export const getWishlist = async () => {
  const response = await fetch(
    `${API_BASE_URL}/rooms/wishlist`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

#### Step 4: Commit and Push

```bash
# Commit both frontend and backend changes
git add backend/
git add frontend/
git commit -m "feat: Add wishlist API endpoint and frontend integration"
git push origin main
```

#### Step 5: Vercel Deploys Both

✅ Backend (on Railway/your backend service) re-deploys
✅ Frontend (on Vercel) re-deploys

---

## Handling Bugs After Deployment

### Scenario: Room images not loading on production

#### 1. Identify the Bug

```
User reports: "Images not showing on mobile"
You check production: https://your-app.vercel.app
Confirm: Images missing on /rooms page
```

#### 2. Debug Locally

```bash
# Pull latest code (if on different machine)
git pull

# Start development server
npm run dev

# Check if issue reproduces locally
# Open DevTools → F12 → Network tab
# Look for image request failures (404, 403, etc.)
```

#### 3. Find Root Cause

```
Image URL in database: "https://example.com/room.jpg"
But API response shows: undefined

Root cause: Image URL not included in API response
```

#### 4. Fix the Code

**File: `backend/controllers/roomController.js`**

```js
// Before
const room = await Room.findById(id);  // Missing image

// After
const room = await Room.findById(id).select('+images');  // Include images
```

#### 5. Test Locally

```bash
npm run dev
# Visit http://localhost:3000/rooms
# Images load! ✅
```

#### 6. Commit and Push

```bash
git add backend/controllers/roomController.js
git commit -m "fix: Include room images in API response"
git push origin main
```

#### 7. Deployed in ~2 Minutes

✅ Production fixed!
✅ Images now load!

---

## Database Changes After Deployment

### Adding New Data to Database

If you want to add new data to production database:

#### Option 1: Use MongoDB Atlas UI

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Open your cluster
3. Go to Collections
4. Insert document manually
5. Data added to production ✅

#### Option 2: Create a Seeding Endpoint

**File: `backend/routes/seedRoutes.js`** (Admin only)

```js
router.post('/seed-admin', adminAuth, async (req, res) => {
  // Only accessible in admin panel
  // Adds sample data to production
  const newRoom = new Room({ /* data */ });
  await newRoom.save();
  res.json({ success: true });
});
```

#### Option 3: Use Reset Script

```bash
# Delete all data and reseed
node scripts/resetDatabase.js
# Then seed: node scripts/seedData.js

# This resets your production database
# Use only when you want to clear everything!
```

---

## Environment Variables After Deployment

### Changing Environment Variables

**Don't commit sensitive data!**

#### For Frontend (`frontend/.env`)

Update via Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add/update:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.com/api
   ```
5. Re-deploy
6. Changes applied ✅

#### For Backend (Railway/Render)

1. Go to your backend service dashboard
2. Settings → Environment Variables
3. Update values
4. Service auto-redeploys ✅

### What NOT to Commit

```
❌ Never commit:
  .env (local secrets)
  API keys
  Passwords
  Private tokens

✅ DO commit:
  Code files
  README.md
  Frontend logic
  Routes
  Components
```

---

## Collaborating with Team (Git Workflow)

### Pull Latest Changes

```bash
# Get latest code from GitHub
git pull origin main

# Your local repo now has newest code
# If team made changes, you get them
```

### Push Your Changes

```bash
# Make changes
# Test locally
# Commit and push

git add .
git commit -m "feat: Your feature"
git push origin main
```

### Handle Merge Conflicts (If Collaborating)

```bash
# Both you and teammate edited same file
# Git asks: whose changes do we keep?

# Open the file with conflicts
# Choose what to keep (VS Code helps)
# Commit the merged result

git add .
git commit -m "merge: Resolve conflicts with teammate's changes"
git push origin main
```

---

## Monitoring Deployments

### Vercel Dashboard

```
Dashboard → Deployments tab
├─ "Production" - Current live version
├─ "Preview" - New deployment (still building)
│  ├─ "Building..." (0-2 minutes)
│  ├─ "Ready" (Live!)
│  └─ You can see logs here
└─ "Rollback" - Go back to previous version if needed
```

### Check Deployment Status

```bash
# In terminal, after push
# Watch Vercel dashboard for:
# 1. "Building" status
# 2. "Ready" status → Live! ✅
```

### View Build Logs

If something fails during deployment:

1. Vercel dashboard → Deployments
2. Click the failed deployment
3. See error messages
4. Fix code locally
5. Push again

---

## Useful Git Commands

```bash
# Check what changed
git status

# See commit history
git log

# See what's different from GitHub
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Revert to previous version
git revert HEAD

# Create new branch (for features)
git checkout -b feature/wishlist

# Merge branch back to main
git checkout main
git merge feature/wishlist
```

---

## Typical Development Day

```
10:00 AM - Start work
├─ git pull (get latest code)
├─ npm run dev (start servers)

10:30 AM - Write feature
├─ Edit files in VS Code
├─ Manual testing in browser
├─ Check console for errors

12:00 PM - Done with feature
├─ git add .
├─ git commit -m "feat: New feature"
├─ git push origin main

12:05 PM - Vercel starts deploying
├─ Check dashboard
├─ See "Building..." then "Ready"

12:07 PM - Live in production! ✅
├─ Verify on: your-app.vercel.app
├─ Test feature works on live site

12:30 PM - Continue with next task
├─ Make more changes
├─ Repeat the cycle
```

---

## Quick Reference: Commands You'll Use Most

```bash
# Daily workflow
npm run dev              # Start development
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit with message
git push origin main    # Push to GitHub (Vercel auto-deploys)

# When something breaks
git pull                # Get latest
npm install             # Update dependencies
npm run dev             # Test locally
git revert HEAD         # Undo last commit
git push origin main    # Deploy fix

# Checking deployment
# (Just watch vercel.com/dashboard)
```

---

## Summary

✅ **Local** → Make changes, test with `npm run dev`
✅ **Commit** → `git push origin main`
✅ **Deploy** → Vercel auto-deploys (watch dashboard)
✅ **Production** → Changes live in 1-2 minutes
✅ **Repeat** → Cycle continues for next feature

You can build your entire application this way without touching any server!

🚀 **Ready to deploy and iterate!**
