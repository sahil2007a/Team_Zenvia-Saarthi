const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { app, server } = require('../src/server');

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('\n=============================================');
  console.log('🧪 Starting SAARTHI Backend API Test Suite');
  console.log('=============================================\n');

  // Wait for server & DB connection
  await new Promise((res) => setTimeout(res, 2000));

  let passed = 0;
  let failed = 0;

  const testUser = {
    name: 'Sahil Test User',
    email: `sahil.test.${Date.now()}@example.com`,
    password: 'password12345',
    language: 'hi',
    interests: ['Architecture', 'History'],
  };

  let authToken = '';

  // Test 1: Health Endpoint
  try {
    const res = await axios.get(`${BASE_URL}/api/health`);
    if (res.status === 200 && res.data.status === 'online') {
      console.log('✅ Test 1 PASSED: GET /api/health returns online (DB: ' + res.data.database.status + ')');
      passed++;
    } else {
      throw new Error(`Unexpected response: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.error('❌ Test 1 FAILED: GET /api/health -', err.message);
    failed++;
  }

  // Test 2: Register New User
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    if (res.status === 201 && res.data.success && res.data.token) {
      authToken = res.data.token;
      console.log('✅ Test 2 PASSED: POST /api/auth/register creates user and returns JWT token');
      passed++;
    } else {
      throw new Error(`Registration failed: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.error('❌ Test 2 FAILED: POST /api/auth/register -', err.response?.data || err.message);
    failed++;
  }

  // Test 3: Duplicate Registration Guard
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    console.error('❌ Test 3 FAILED: Duplicate registration should have been rejected');
    failed++;
  } catch (err) {
    if (err.response?.status === 400) {
      console.log('✅ Test 3 PASSED: Duplicate registration correctly rejected with 400');
      passed++;
    } else {
      console.error('❌ Test 3 FAILED with unexpected error:', err.message);
      failed++;
    }
  }

  // Test 4: User Login
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    if (res.status === 200 && res.data.token) {
      authToken = res.data.token;
      console.log('✅ Test 4 PASSED: POST /api/auth/login succeeds with valid credentials');
      passed++;
    } else {
      throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.error('❌ Test 4 FAILED: POST /api/auth/login -', err.response?.data || err.message);
    failed++;
  }

  // Test 5: Invalid Password Rejection
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: 'wrong_password_xyz',
    });
    console.error('❌ Test 5 FAILED: Invalid password was accepted');
    failed++;
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('✅ Test 5 PASSED: Invalid password correctly returns 401 Unauthorized');
      passed++;
    } else {
      console.error('❌ Test 5 FAILED with unexpected status:', err.response?.status || err.message);
      failed++;
    }
  }

  // Test 6: Protected Route GET /api/auth/me
  try {
    const res = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 200 && res.data.user.email === testUser.email) {
      console.log('✅ Test 6 PASSED: GET /api/auth/me returns authorized user profile');
      passed++;
    } else {
      throw new Error(`Failed to retrieve profile: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.error('❌ Test 6 FAILED: GET /api/auth/me -', err.response?.data || err.message);
    failed++;
  }

  // Test 7: Unauthorized Access to Protected Route
  try {
    await axios.get(`${BASE_URL}/api/auth/me`);
    console.error('❌ Test 7 FAILED: Protected route allowed request without token');
    failed++;
  } catch (err) {
    if (err.response?.status === 401) {
      console.log('✅ Test 7 PASSED: Protected route rejected unauthorized request with 401');
      passed++;
    } else {
      console.error('❌ Test 7 FAILED with unexpected status:', err.response?.status || err.message);
      failed++;
    }
  }

  // Test 8: Update Profile & Sync
  try {
    const res = await axios.put(
      `${BASE_URL}/api/auth/profile`,
      {
        bio: 'Explorer of ancient Indian architecture and UNESCO sites',
        savedSites: ['qutub-minar', 'deekshabhoomi', 'india-gate'],
        sitesExplored: 3,
        preferences: {
          travelTime: '2-3 hours',
          audioPreference: true,
          budget: 'high',
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    if (
      res.status === 200 &&
      res.data.user.savedSites.length === 3 &&
      res.data.user.bio.includes('Explorer')
    ) {
      console.log('✅ Test 8 PASSED: PUT /api/auth/profile successfully updates user data & bookmarks');
      passed++;
    } else {
      throw new Error(`Failed update: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.error('❌ Test 8 FAILED: PUT /api/auth/profile -', err.response?.data || err.message);
    failed++;
  }

  console.log('\n=============================================');
  console.log(`📊 Test Summary: Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('=============================================\n');

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  if (server) server.close();
  process.exit(1);
});
