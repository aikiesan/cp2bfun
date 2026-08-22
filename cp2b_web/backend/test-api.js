/**
 * API Test Script - Validates all endpoints are working
 * Run: node test-api.js
 */

const BASE_URL = 'http://localhost:3001/api';

const tests = [
  { name: 'Health Check', url: '/health' },
  { name: 'Get Partners', url: '/partners' },
  { name: 'Get Grouped Partners', url: '/partners/grouped' },
  { name: 'Get Publications', url: '/publications' },
  { name: 'Get Featured Publications', url: '/publications/featured' },
  { name: 'Get Publications by Year', url: '/publications/by-year' },
  { name: 'Get Events', url: '/events' },
  { name: 'Get Upcoming Events', url: '/events/upcoming' },
  { name: 'Get Featured Events', url: '/events/featured' },
  { name: 'Get News', url: '/news' },
  { name: 'Get Featured News', url: '/news/featured' },
  { name: 'Get Team', url: '/team' },
  { name: 'Get Axes', url: '/axes' },
  { name: 'Get Contact Messages', url: '/contact' },
];

async function testEndpoint(test) {
  try {
    const response = await fetch(BASE_URL + test.url);
    const data = await response.json();

    if (response.ok) {
      const count = Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : '-');
      console.log(`✅ ${test.name.padEnd(35)} [${response.status}] (${count} items)`);
      return true;
    } else {
      console.log(`❌ ${test.name.padEnd(35)} [${response.status}] ${data.error || 'Error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${test.name.padEnd(35)} Connection failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🧪 CP2b API Test Suite\n');
  console.log('Testing backend at:', BASE_URL);
  console.log('─'.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(test);
    if (result) passed++;
    else failed++;
  }

  console.log('─'.repeat(70));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed (${tests.length} total)\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Backend is working correctly.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check backend logs for details.\n');
    process.exit(1);
  }
}

// Run tests
runTests();
