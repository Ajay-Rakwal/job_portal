/**
 * ============================================================
 * JobConnect API — End-to-End Test Suite
 * ============================================================
 * Tests: Auth flow, Job CRUD, Application workflow
 * Runner: Vitest + Supertest
 *
 * Run: npm test
 * ============================================================
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

// ─── Test State ──────────────────────────────────────────────
let candidateToken = '';
let employerToken = '';
let candidateUser = null;
let employerUser = null;
let createdJobId = '';
let applicationId = '';

const testCandidate = {
  name: 'Test Candidate',
  email: `candidate_${Date.now()}@test.com`,
  password: 'TestPass@123',
  role: 'candidate',
  headline: 'Full Stack Developer'
};

const testEmployer = {
  name: 'Test Employer',
  email: `employer_${Date.now()}@test.com`,
  password: 'TestPass@123',
  role: 'employer',
  companyName: 'Test Corp'
};

// ─── Setup / Teardown ────────────────────────────────────────
beforeAll(async () => {
  // Allow mongoose to connect (server.js already initiates it)
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal');
  }
  // Wait for connection
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once('open', resolve);
  });
});

afterAll(async () => {
  // Cleanup test users and jobs created during tests
  await mongoose.connection.db.collection('users').deleteMany({
    email: { $in: [testCandidate.email, testEmployer.email] }
  });
  if (createdJobId) {
    await mongoose.connection.db.collection('jobs').deleteMany({ id: createdJobId });
  }
  if (applicationId) {
    await mongoose.connection.db.collection('applications').deleteMany({ id: applicationId });
  }
});


// ═══════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION TESTS
// ═══════════════════════════════════════════════════════════

describe('🔐 Authentication Flow', () => {
  // ── Registration ──────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('registers a new candidate account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testCandidate);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.role).toBe('candidate');
      expect(res.body.user.email).toBe(testCandidate.email);
      expect(res.body.user).not.toHaveProperty('password'); // password must NOT be returned

      candidateToken = res.body.token;
      candidateUser = res.body.user;
    });

    it('registers a new employer account', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testEmployer);

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('employer');
      expect(res.body).toHaveProperty('token');

      employerToken = res.body.token;
      employerUser = res.body.user;
    });

    it('rejects duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testCandidate); // same email again

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/already exists/i);
    });

    it('rejects registration with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@test.com' }); // no name or password

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ── Login ─────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials and returns JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testCandidate.email, password: testCandidate.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testCandidate.email);

      candidateToken = res.body.token; // refresh token
    });

    it('rejects login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testCandidate.email, password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('rejects login for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@nowhere.com', password: 'anything' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ── Protected Route ───────────────────────────────────
  describe('GET /api/auth/me', () => {
    it('returns current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testCandidate.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('returns 401 without token (protected route check)', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 403 with invalid/expired token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer this.is.not.valid.jwt');

      expect(res.status).toBe(403);
    });
  });

  // ── Profile Update ────────────────────────────────────
  describe('PUT /api/auth/profile', () => {
    it('updates user profile successfully', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({ bio: 'Updated bio for testing', location: 'Mumbai, India' });

      expect(res.status).toBe(200);
      expect(res.body.user.bio).toBe('Updated bio for testing');
      expect(res.body.user.location).toBe('Mumbai, India');
    });

    it('rejects profile update without authentication', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .send({ bio: 'Should fail' });

      expect(res.status).toBe(401);
    });
  });
});


// ═══════════════════════════════════════════════════════════
// 💼 JOB LISTINGS TESTS
// ═══════════════════════════════════════════════════════════

describe('💼 Job Listings', () => {
  // ── Create Job ────────────────────────────────────────
  describe('POST /api/jobs', () => {
    it('employer can create a new job posting', async () => {
      const newJob = {
        title: 'Test Software Engineer',
        company: 'Test Corp',
        category: 'Technology',
        type: 'Full-Time',
        location: 'Bangalore, India',
        salary: '₹8,00,000 - ₹12,00,000 / yr',
        experience: '2-4 Years',
        description: 'We are looking for a talented software engineer to join our team.',
        requirements: ['React', 'Node.js', 'MongoDB'],
        responsibilities: ['Build features', 'Write tests', 'Code review']
      };

      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send(newJob);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('job');
      expect(res.body.job.title).toBe(newJob.title);
      expect(res.body.job).toHaveProperty('id');

      createdJobId = res.body.job.id;
    });

    it('rejects job creation without authentication', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({ title: 'Unauthorized Job', company: 'Hacker Corp', description: 'test', salary: '$1' });

      expect(res.status).toBe(401);
    });

    it('rejects job with missing required fields', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ title: 'Incomplete Job' }); // missing company, description, salary

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // ── List & Search Jobs ────────────────────────────────
  describe('GET /api/jobs', () => {
    it('returns list of jobs without authentication', async () => {
      const res = await request(app)
        .get('/api/jobs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('filters jobs by keyword', async () => {
      const res = await request(app)
        .get('/api/jobs?keyword=Test Software Engineer');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Should find the job we just created
      const found = res.body.find(j => j.title === 'Test Software Engineer');
      expect(found).toBeDefined();
    });

    it('filters jobs by category', async () => {
      const res = await request(app)
        .get('/api/jobs?category=Technology');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(job => {
        expect(job.category).toBe('Technology');
      });
    });
  });

  // ── Get Single Job ────────────────────────────────────
  describe('GET /api/jobs/:id', () => {
    it('returns a specific job by ID', async () => {
      const res = await request(app)
        .get(`/api/jobs/${createdJobId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdJobId);
      expect(res.body.title).toBe('Test Software Engineer');
    });

    it('returns 404 for non-existent job ID', async () => {
      const res = await request(app)
        .get('/api/jobs/job-000000000000');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});


// ═══════════════════════════════════════════════════════════
// 📝 JOB APPLICATION TESTS
// ═══════════════════════════════════════════════════════════

describe('📝 Job Applications', () => {
  // ── Submit Application ────────────────────────────────
  describe('POST /api/applications', () => {
    it('candidate can submit a job application', async () => {
      const payload = {
        jobId: createdJobId,
        jobTitle: 'Test Software Engineer',
        company: 'Test Corp',
        coverNote: 'I am very interested in this position. I have 3 years of experience.',
        resumeName: 'Test_Resume_2026.pdf'
      };

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('application');
      expect(res.body.application.status).toBe('Pending');
      expect(res.body.application.jobId).toBe(createdJobId);

      applicationId = res.body.application.id;
    });

    it('prevents duplicate application to same job', async () => {
      const payload = {
        jobId: createdJobId,
        jobTitle: 'Test Software Engineer',
        company: 'Test Corp'
      };

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/already submitted/i);
    });

    it('rejects application without authentication', async () => {
      const res = await request(app)
        .post('/api/applications')
        .send({ jobId: createdJobId, jobTitle: 'Test Software Engineer' });

      expect(res.status).toBe(401);
    });
  });

  // ── Fetch Applications ────────────────────────────────
  describe('GET /api/applications', () => {
    it('candidate sees only their own applications', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${candidateToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // All returned applications must belong to this candidate
      res.body.forEach(app => {
        expect(app.applicantEmail).toBe(testCandidate.email);
      });
    });

    it('employer sees all applications', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${employerToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 for unauthenticated requests', async () => {
      const res = await request(app)
        .get('/api/applications');

      expect(res.status).toBe(401);
    });
  });

  // ── Update Application Status ─────────────────────────
  describe('PATCH /api/applications/:id/status', () => {
    it('updates application status to Shortlisted', async () => {
      const res = await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'Shortlisted' });

      expect(res.status).toBe(200);
      expect(res.body.application.status).toBe('Shortlisted');
    });

    it('updates application status to Accepted', async () => {
      const res = await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'Accepted' });

      expect(res.status).toBe(200);
      expect(res.body.application.status).toBe('Accepted');
    });

    it('returns 404 for non-existent application', async () => {
      const res = await request(app)
        .patch('/api/applications/app-0000/status')
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'Rejected' });

      expect(res.status).toBe(404);
    });
  });
});


// ═══════════════════════════════════════════════════════════
// 🗑️ CLEANUP — Delete Job
// ═══════════════════════════════════════════════════════════

describe('🗑️ Job Deletion', () => {
  it('employer can delete their job posting', async () => {
    const res = await request(app)
      .delete(`/api/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${employerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('returns 404 when deleting an already-deleted job', async () => {
    const res = await request(app)
      .delete(`/api/jobs/${createdJobId}`)
      .set('Authorization', `Bearer ${employerToken}`);

    expect(res.status).toBe(404);
  });

  it('returns 401 when deleting without auth', async () => {
    const res = await request(app)
      .delete('/api/jobs/job-101');

    expect(res.status).toBe(401);
  });
});
