const http = require('http');

// Test runner for PixelResolve API
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

    // 2. Reject fake placeholder email (example.com)
    const fakeEmailRes = await request('POST', '/api/auth/signup', {
      name: 'Fake User',
      email: 'user@example.com',
      username: 'fake_user',
      password: 'password123'
    });
    assert(fakeEmailRes.status === 400, 'Rejects placeholder domain @example.com');

    // 3. Signup User 1 with username
    const signupRes = await request('POST', '/api/auth/signup', {
      name: 'Pixel Knight',
      email: 'knight@gmail.com',
      username: 'pixel_knight',
      password: 'questpassword123'
    });
    assert(signupRes.status === 201, 'Signup succeeds with 201');
    assert(signupRes.body.token, 'Signup returns JWT token');
    assert(signupRes.body.user.name === 'Pixel Knight', 'User name is correct');
    assert(signupRes.body.user.username === 'pixel_knight', 'Username is assigned');
    assert(signupRes.body.user.level === 1, 'Initial level is 1');
    assert(signupRes.body.user.email_verification_status === 'unverified', 'Initial verification status is unverified');
    const token1 = signupRes.body.token;

    // 4. Duplicate username check
    const checkUserRes = await request('GET', '/api/auth/check-username?username=PIXEL_KNIGHT');
    assert(checkUserRes.body.available === false, 'Username check recognizes taken username case-insensitively');

    const dupUserRes = await request('POST', '/api/auth/signup', {
      name: 'Copycat',
      email: 'copycat@gmail.com',
      username: 'pixel_knight',
      password: 'password123'
    });
    assert(dupUserRes.status === 400, 'Duplicate username returns 400');

    // 5. Duplicate email check
    const dupRes = await request('POST', '/api/auth/signup', {
      name: 'Imposter',
      email: 'knight@gmail.com',
      username: 'imposter_hero',
      password: 'password123'
    });
    assert(dupRes.status === 400, 'Duplicate email returns 400');

    // 6. Login User 1 (using username as identifier)
    const loginRes = await request('POST', '/api/auth/login', {
      identifier: 'pixel_knight',
      password: 'questpassword123'
    });
    assert(loginRes.status === 200, 'Login succeeds with username');
    assert(loginRes.body.token, 'Login returns JWT');

    // 7. Mock Verify Email
    const verifyRes = await request('POST', '/api/auth/verify-email', null, token1);
    assert(verifyRes.status === 200, 'Mock verify email responds ok');
    assert(verifyRes.body.email_verification_status === 'verified', 'Email verified status updated');

    // 8. Update Profile (bio, skills, education, achievements)
    const updateProfileRes = await request('PUT', '/api/auth/profile', {
      bio: 'Master of pixelated quests',
      education: 'Pixel Academy',
      skills: ['React', 'Sword Fighting', 'Speed Reading'],
      achievements: [{ title: 'Finished React Course', date: '2026-01-10' }],
      profile_completed: 1
    }, token1);
    assert(updateProfileRes.status === 200, 'Profile update succeeds');
    assert(updateProfileRes.body.user.skills.length === 3, 'Skills updated as array');
    assert(updateProfileRes.body.user.profile_completed === 1, 'Profile completed flagged');

    // 9. Fetch Profile with stats
    const getProfileRes = await request('GET', '/api/auth/profile', null, token1);
    assert(getProfileRes.status === 200, 'GET /api/auth/profile responds ok');
    assert(getProfileRes.body.profile.education === 'Pixel Academy', 'Education persisted');

    // 10. Signup User 2 (for isolation testing)
    const user2Signup = await request('POST', '/api/auth/signup', {
      name: 'Pixel Rogue',
      email: 'rogue@gmail.com',
      username: 'pixel_rogue',
      password: 'roguepassword123'
    });
    const token2 = user2Signup.body.token;

    // 11. User 1 creates a resolution: Read 12 Books (with category, why, deadline)
    const createRes = await request('POST', '/api/resolutions', {
      title: 'Read 12 Books',
      description: 'Finish 12 sci-fi and fantasy books this year',
      why: 'Expand imagination and knowledge',
      category: 'Learning',
      goal_value: 12,
      current_value: 0,
      unit: 'Books',
      deadline: '2026-12-31'
    }, token1);
    assert(createRes.status === 201, 'Create resolution returns 201');
    assert(createRes.body.resolution.title === 'Read 12 Books', 'Resolution title matches');
    assert(createRes.body.resolution.category === 'Learning', 'Category persisted');
    assert(createRes.body.resolution.why === 'Expand imagination and knowledge', 'Why field persisted');
    assert(createRes.body.resolution.status === 'active', 'Initial status is active');
    const resId = createRes.body.resolution.id;

    // 12. User 2 lists resolutions -> must be EMPTY (isolation test)
    const listRes2 = await request('GET', '/api/resolutions', null, token2);
    assert(listRes2.body.resolutions.length === 0, 'User 2 cannot see User 1 resolutions');

    // 13. User 2 tries to GET User 1's resolution by ID -> must fail (404)
    const getRes2 = await request('GET', `/api/resolutions/${resId}`, null, token2);
    assert(getRes2.status === 404, 'User 2 cannot GET User 1 resolution by ID');

    // 14. User 1 updates progress from 0 to 6 (partial progress, awards +5 XP)
    const updateRes1 = await request('PUT', `/api/resolutions/${resId}`, { current_value: 6 }, token1);
    assert(updateRes1.status === 200, 'User 1 updates progress to 6');
    assert(updateRes1.body.xpGained === 5, 'User 1 gained 5 XP for progress update');
    assert(updateRes1.body.resolution.status === 'active', 'Status remains active at 50%');

    // 15. User 1 updates progress to 12 (completes quest! awards +100 XP)
    const completeRes1 = await request('PUT', `/api/resolutions/${resId}`, { current_value: 12 }, token1);
    assert(completeRes1.status === 200, 'User 1 completes quest');
    assert(completeRes1.body.questCompleted === true, 'questCompleted flag is true');
    assert(completeRes1.body.xpGained === 100, 'Gained 100 XP for quest completion');
    assert(completeRes1.body.resolution.status === 'completed', 'Status transitioned to completed');

    // 16. User submits Feedback
    const submitFeedbackRes = await request('POST', '/api/feedback', {
      type: 'Feature Request',
      subject: 'Add Pixel Sound Effects',
      message: 'It would be super awesome to hear 8-bit chiptunes when clearing a quest!',
      rating: 5
    }, token1);
    assert(submitFeedbackRes.status === 201, 'Feedback submitted successfully');
    assert(submitFeedbackRes.body.feedback.subject === 'Add Pixel Sound Effects', 'Feedback subject saved');
    const feedbackId = submitFeedbackRes.body.feedback.id;

    // 17. User gets my feedback
    const myFeedbackRes = await request('GET', '/api/feedback/my', null, token1);
    assert(myFeedbackRes.body.feedback.length >= 1, 'User can list their feedback items');

    // 18. Admin lists feedback and metrics
    const adminFeedbackRes = await request('GET', '/api/feedback/admin', null, token1);
    assert(adminFeedbackRes.status === 200, 'Admin can view feedback list');
    assert(adminFeedbackRes.body.metrics.total >= 1, 'Metrics calculation works');

    // 19. Admin updates feedback status to "In Progress"
    const patchFeedbackRes = await request('PATCH', `/api/feedback/admin/${feedbackId}`, {
      status: 'In Progress',
      priority: 'High',
      internal_note: 'Sound designer assigned'
    }, token1);
    assert(patchFeedbackRes.status === 200, 'Admin can update feedback status');
    assert(patchFeedbackRes.body.feedback.status === 'In Progress', 'Feedback status transitioned');

    // 20. User 1 deletes resolution
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
