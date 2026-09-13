const http = require('http');

// Simple test runner for PixelResolve API
const BASE_URL = 'http://127.0.0.1:3099';
process.env.PORT = '3099';
process.env.DB_PATH = ':memory:'; // In-memory database for testing
process.env.NODE_ENV = 'test';

const app = require('./index');

let server;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

async function runTests() {
  server = app.listen(3099, '127.0.0.1');

  try {
    console.log('--- STARTING BACKEND INTEGRATION TESTS ---');

    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.body.status === 'ok', 'GET /api/health responds ok');

    // 2. Signup User 1
    const signupRes = await request('POST', '/api/auth/signup', {
      name: 'Pixel Knight',
      email: 'knight@example.com',
      password: 'questpassword123'
    });
    assert(signupRes.status === 201, 'Signup succeeds with 201');
    assert(signupRes.body.token, 'Signup returns JWT token');
    assert(signupRes.body.user.name === 'Pixel Knight', 'User name is correct');
    assert(signupRes.body.user.level === 1, 'Initial level is 1');
    const token1 = signupRes.body.token;

    // 3. Signup duplicate email should fail
    const dupRes = await request('POST', '/api/auth/signup', {
      name: 'Imposter',
      email: 'knight@example.com',
      password: 'password123'
    });
    assert(dupRes.status === 400, 'Duplicate email returns 400');

    // 4. Login User 1
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'knight@example.com',
      password: 'questpassword123'
    });
    assert(loginRes.status === 200, 'Login succeeds');
    assert(loginRes.body.token, 'Login returns JWT');

    // 5. Auth /me
    const meRes = await request('GET', '/api/auth/me', null, token1);
    assert(meRes.status === 200 && meRes.body.user.email === 'knight@example.com', 'GET /api/auth/me returns user');

    // 6. Signup User 2 (for isolation testing)
    const user2Signup = await request('POST', '/api/auth/signup', {
      name: 'Pixel Rogue',
      email: 'rogue@example.com',
      password: 'roguepassword123'
    });
    const token2 = user2Signup.body.token;

    // 7. User 1 creates a resolution: Read 12 Books
    const createRes = await request('POST', '/api/resolutions', {
      title: 'Read 12 Books',
      description: 'Finish 12 sci-fi and fantasy books this year',
      goal_value: 12,
      current_value: 0,
      unit: 'Books'
    }, token1);
    assert(createRes.status === 201, 'Create resolution returns 201');
    assert(createRes.body.resolution.title === 'Read 12 Books', 'Resolution title matches');
    assert(createRes.body.resolution.status === 'active', 'Initial status is active');
    const resId = createRes.body.resolution.id;

    // 8. User 2 lists resolutions -> must be EMPTY (isolation test)
    const listRes2 = await request('GET', '/api/resolutions', null, token2);
    assert(listRes2.body.resolutions.length === 0, 'User 2 cannot see User 1 resolutions');

    // 9. User 2 tries to GET User 1's resolution by ID -> must fail (404)
    const getRes2 = await request('GET', `/api/resolutions/${resId}`, null, token2);
    assert(getRes2.status === 404, 'User 2 cannot GET User 1 resolution by ID');

    // 10. User 2 tries to UPDATE User 1's resolution -> must fail (404)
    const updateRes2 = await request('PUT', `/api/resolutions/${resId}`, { current_value: 5 }, token2);
    assert(updateRes2.status === 404, 'User 2 cannot UPDATE User 1 resolution');

    // 11. User 2 tries to DELETE User 1's resolution -> must fail (404)
    const deleteRes2 = await request('DELETE', `/api/resolutions/${resId}`, null, token2);
    assert(deleteRes2.status === 404, 'User 2 cannot DELETE User 1 resolution');

    // 12. User 1 updates progress from 0 to 6 (partial progress, awards +5 XP)
    const updateRes1 = await request('PUT', `/api/resolutions/${resId}`, { current_value: 6 }, token1);
    assert(updateRes1.status === 200, 'User 1 updates progress to 6');
    assert(updateRes1.body.xpGained === 5, 'User 1 gained 5 XP for progress update');
    assert(updateRes1.body.resolution.status === 'active', 'Status remains active at 50%');

    // 13. User 1 updates progress to 12 (completes quest! awards +100 XP)
    const completeRes1 = await request('PUT', `/api/resolutions/${resId}`, { current_value: 12 }, token1);
    assert(completeRes1.status === 200, 'User 1 completes quest');
    assert(completeRes1.body.questCompleted === true, 'questCompleted flag is true');
    assert(completeRes1.body.xpGained === 100, 'Gained 100 XP for quest completion');
    assert(completeRes1.body.resolution.status === 'completed', 'Status transitioned to completed');
    assert(completeRes1.body.resolution.completed_at !== null, 'completed_at timestamp recorded');

    // 14. User 1 deletes resolution
    const delRes1 = await request('DELETE', `/api/resolutions/${resId}`, null, token1);
    assert(delRes1.status === 200, 'User 1 deletes resolution');

    const listRes1After = await request('GET', '/api/resolutions', null, token1);
    assert(listRes1After.body.resolutions.length === 0, 'User 1 resolutions list is now empty');

    console.log('🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
