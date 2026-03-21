const http = require('http');

const tests = [];

function testAPI(name, url, expectedStatus = 200) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      const passed = res.statusCode === expectedStatus;
      tests.push({
        name,
        passed,
        status: res.statusCode,
        message: passed ? ' PASS' : ` FAIL (got ${res.statusCode})`
      });
      resolve(passed);
    }).on('error', (err) => {
      tests.push({
        name,
        passed: false,
        status: 'ERROR',
        message: ` FAIL (${err.message})`
      });
      resolve(false);
    });
  });
}

async function verifyDeployment() {
  console.clear();
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   Post-Deployment Verification');
  console.log('═══════════════════════════════════════════════════════════\n');

  
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  console.log(`Testing Backend:  ${backendUrl}`);
  console.log(`Testing Frontend: ${frontendUrl}\n`);

 
  console.log('🔍 Checking Backend APIs...\n');
  
  await testAPI('Health Check', `${backendUrl}/api/health`, 200);
  await testAPI('Room Services Approved', `${backendUrl}/api/room-services/approved`, 200);
  await testAPI('All Rooms', `${backendUrl}/api/rooms`, 200);

  
  console.log('\n Test Results:\n');
  
  let passed = 0;
  let failed = 0;

  tests.forEach((test) => {
    console.log(`${test.message} - ${test.name}`);
    if (test.passed) passed++;
    else failed++;
  });

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`  ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('   All tests passed! Deployment successful!');
  } else {
    console.log('    Some tests failed. Check the errors above.');
  }

  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(' Manual Tests to Run in Browser:\n');
  console.log(`1. Visit: ${frontendUrl}`);
  console.log('   ✓ Homepage loads');
  console.log('   ✓ Navigation bar visible');
  console.log('   ✓ No console errors (F12)\n');

  console.log(`2. Visit: ${frontendUrl}/rooms`);
  console.log('   ✓ Room cards appear');
  console.log('   ✓ Search/filter works');
  console.log('   ✓ Images load\n');

  console.log(`3. Visit: ${frontendUrl}/login`);
  console.log('   ✓ Login form displays');
  console.log('   ✓ Can login (if user exists)\n');

  console.log(`4. Visit: ${frontendUrl}/admin/dashboard`);
  console.log('   ✓ Admin can access (need admin login)\n');

  console.log('═══════════════════════════════════════════════════════════\n');
}

verifyDeployment();
