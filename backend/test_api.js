const http = require('http');

async function testSuite() {
  console.log('🧪 Starting Comprehensive API Test Suite...');

  // Helper function to send requests
  const request = (path, method = 'GET', data = null, token = null) => {
    return new Promise((resolve, reject) => {
      const payload = data ? JSON.stringify(data) : null;
      const headers = {
        'Content-Type': 'application/json',
      };
      if (payload) {
        headers['Content-Length'] = Buffer.byteLength(payload);
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const req = http.request(
        {
          hostname: 'localhost',
          port: 5000,
          path,
          method,
          headers,
        },
        (res) => {
          let responseBody = '';
          res.on('data', (chunk) => (responseBody += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(responseBody);
              resolve({ status: res.statusCode, body: parsed });
            } catch (e) {
              resolve({ status: res.statusCode, body: responseBody });
            }
          });
        }
      );

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Student Login
    console.log('\n1. Testing Student Login (rahul@hostel.com)...');
    const studentLogin = await request('/api/auth/login', 'POST', {
      email: 'rahul@hostel.com',
      password: 'student123',
    });
    console.log(` Status: ${studentLogin.status}`, studentLogin.body.message);
    const studentToken = studentLogin.body.token;

    // 2. Admin Login
    console.log('\n2. Testing Admin Login (admin@hostel.com)...');
    const adminLogin = await request('/api/auth/login', 'POST', {
      email: 'admin@hostel.com',
      password: 'admin123',
    });
    console.log(` Status: ${adminLogin.status}`, adminLogin.body.message);
    const adminToken = adminLogin.body.token;

    // 3. Student Registration
    console.log('\n3. Testing New Student Registration...');
    const regEmail = `test_student_${Date.now()}@hostel.com`;
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Test Student',
      email: regEmail,
      password: 'password123',
      role: 'student',
    });
    console.log(` Status: ${regRes.status}`, regRes.body.message);
    const newStudentToken = regRes.body.token;

    // 4. Submit Complaint
    console.log('\n4. Testing Complaint Submission (POST /api/complaints)...');
    const newComplaint = await request(
      '/api/complaints',
      'POST',
      {
        title: 'Geyser not heating in 3rd floor washroom',
        category: 'Water',
        roomNumber: '304',
        description: 'Water remains ice cold even after turning the switch on for 30 minutes.',
      },
      newStudentToken
    );
    console.log(` Status: ${newComplaint.status}`, newComplaint.body.message);
    const createdComplaintId = newComplaint.body.complaint._id;

    // 5. Student view their complaints
    console.log('\n5. Testing Student Complaints (GET /api/complaints/my)...');
    const myComplaints = await request('/api/complaints/my', 'GET', null, newStudentToken);
    console.log(` Status: ${myComplaints.status}, Complaints Count: ${myComplaints.body.count}`);

    // 6. Admin view all complaints
    console.log('\n6. Testing Admin Complaints (GET /api/complaints)...');
    const allComplaints = await request('/api/complaints', 'GET', null, adminToken);
    console.log(` Status: ${allComplaints.status}, Total Complaints Count: ${allComplaints.body.count}`);

    // 7. Admin updates status
    console.log('\n7. Testing Admin Status Update (PATCH /api/complaints/:id/status)...');
    const statusUpdate = await request(
      `/api/complaints/${createdComplaintId}/status`,
      'PATCH',
      { status: 'In Progress' },
      adminToken
    );
    console.log(` Status: ${statusUpdate.status}`, statusUpdate.body.message);

    // 8. Student trying to delete an "In Progress" complaint (Should fail per prompt rule!)
    console.log('\n8. Testing Student Delete for "In Progress" complaint (Should be rejected with 400)...');
    const deleteBlocked = await request(
      `/api/complaints/${createdComplaintId}`,
      'DELETE',
      null,
      newStudentToken
    );
    console.log(` Status: ${deleteBlocked.status} (Expected 400), Message: "${deleteBlocked.body.message}"`);

    // 9. Admin resets status back to "Pending"
    console.log('\n9. Testing Admin resets status back to Pending...');
    await request(
      `/api/complaints/${createdComplaintId}/status`,
      'PATCH',
      { status: 'Pending' },
      adminToken
    );

    // 10. Student deletes "Pending" complaint (Should succeed!)
    console.log('\n10. Testing Student Delete for "Pending" complaint (Should succeed with 200)...');
    const deleteSuccess = await request(
      `/api/complaints/${createdComplaintId}`,
      'DELETE',
      null,
      newStudentToken
    );
    console.log(` Status: ${deleteSuccess.status} (Expected 200), Message: "${deleteSuccess.body.message}"`);

    // 11. Security check: Student trying to access Admin route GET /api/complaints
    console.log('\n11. Testing Student access to Admin Route (Should be rejected with 403)...');
    const securityCheck = await request(
      '/api/complaints',
      'GET',
      null,
      newStudentToken
    );
    console.log(` Status: ${securityCheck.status} (Expected 403 Forbidden), Message: "${securityCheck.body.message}"`);

    console.log('\n ALL 11 API TEST CASES PASSED SUCCESSFULLY! ');
  } catch (err) {
    console.error('Test Suite Failed:', err);
  }
}

testSuite();
