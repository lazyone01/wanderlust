#!/usr/bin/env node

/**
 * 🔍 Quick Status Check - Room Services Debugging
 * 
 * Usage: node check-status.js
 * 
 * This script will check:
 * 1. Backend running on port 5000
 * 2. Room services API returning data
 * 3. Database has approved rooms
 * 4. Count of approved rooms
 */

const http = require('http');

const checks = {
  backend: {
    name: '🔧 Backend Server',
    status: '⏳ Checking...',
    details: ''
  },
  api: {
    name: '📡 API Endpoint',
    status: '⏳ Checking...',
    details: ''
  },
  data: {
    name: '💾 Database Records',
    status: '⏳ Checking...',
    details: ''
  }
};

// Check 1: Backend Running
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      checks.backend.status = '✅ Running';
      checks.backend.details = `Port 5000 responding`;
      resolve(true);
    });
    
    req.on('error', () => {
      checks.backend.status = '❌ Not Running';
      checks.backend.details = 'Make sure: npm start in backend/';
      resolve(false);
    });
    
    setTimeout(() => {
      req.abort();
      checks.backend.status = '❌ Timeout';
      checks.backend.details = 'Backend not responding within 5s';
      resolve(false);
    }, 5000);
  });
}

// Check 2: API Endpoint
function checkAPI(backendRunning) {
  return new Promise((resolve) => {
    if (!backendRunning) {
      checks.api.status = '⏭️  Skipped';
      checks.api.details = 'Backend not running';
      resolve(false);
      return;
    }

    const req = http.get('http://localhost:5000/api/room-services/approved', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.success) {
            checks.api.status = '✅ Working';
            checks.api.details = `Endpoint returning data (Status: ${res.statusCode})`;
            resolve(true);
          } else {
            checks.api.status = '⚠️  Error Response';
            checks.api.details = `API returned success: false`;
            resolve(false);
          }
        } catch (e) {
          checks.api.status = '❌ Invalid Response';
          checks.api.details = `Response is not valid JSON`;
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      checks.api.status = '❌ Failed';
      checks.api.details = `${err.code || err.message}`;
      resolve(false);
    });
    
    setTimeout(() => {
      req.abort();
      checks.api.status = '❌ Timeout';
      checks.api.details = 'API not responding within 10s';
      resolve(false);
    }, 10000);
  });
}

// Check 3: Database - Make an actual request to see count
function checkData(apiWorking) {
  return new Promise((resolve) => {
    if (!apiWorking) {
      checks.data.status = '⏭️  Skipped';
      checks.data.details = 'API not working';
      resolve(false);
      return;
    }

    const req = http.get('http://localhost:5000/api/room-services/approved', (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = json.data ? json.data.length : 0;
          
          if (count > 0) {
            checks.data.status = '✅ Found Data';
            checks.data.details = `${count} approved room(s) in database`;
            resolve(true);
          } else {
            checks.data.status = '⚠️  No Results';
            checks.data.details = `Database has 0 approved rooms. Check admin/room-services to approve rooms.`;
            resolve(false);
          }
        } catch (e) {
          checks.data.status = '❌ Parse Error';
          checks.data.details = 'Could not parse API response';
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      checks.data.status = '❌ Failed';
      checks.data.details = `${err.message}`;
      resolve(false);
    });
  });
}

// Print Results
function printResults() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  🏠 Room Services Status Check');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  Object.values(checks).forEach(check => {
    console.log(`${check.status}`);
    console.log(`${check.name}`);
    console.log(`   └─ ${check.details}\n`);
  });
  
  const allPassing = Object.values(checks).every(c => c.status.includes('✅'));
  
  console.log('═══════════════════════════════════════════════════════════');
  
  if (allPassing) {
    console.log('\n  ✨ All systems operational! Room services should display on /rooms\n');
  } else {
    console.log('\n  ⚠️  Some checks failed. See details above.\n');
    console.log('  QUICK FIXES:');
    
    if (checks.backend.status.includes('❌')) {
      console.log('  1️⃣  Start backend: cd backend && npm start');
    }
    if (checks.api.status.includes('❌')) {
      console.log('  2️⃣  Check roomServiceRoutes.js has /approved endpoint');
    }
    if (checks.data.status.includes('⚠️')) {
      console.log('  3️⃣  Go to /admin/room-services and approve a room');
    }
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run All Checks
async function runChecks() {
  console.log('Starting checks...\n');
  
  const backendRunning = await checkBackend();
  console.log(`${checks.backend.status}\n`);
  
  const apiWorking = await checkAPI(backendRunning);
  console.log(`${checks.api.status}\n`);
  
  const dataExists = await checkData(apiWorking);
  console.log(`${checks.data.status}\n`);
  
  setTimeout(printResults, 500);
}

runChecks();
