import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB:', MONGODB_URI))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'job_portal_super_secret_jwt_key_2026';


// Middleware
app.use(cors());
app.use(express.json());

// ================= MONGOOSE SCHEMAS =================
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Keeping custom ID for compatibility with existing frontend
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  headline: String,
  companyName: String,
  skills: [String],
  bio: String,
  phone: String,
  location: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: String,
  category: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  experience: String,
  description: { type: String, required: true },
  requirements: [String],
  responsibilities: [String],
  postedDate: String,
  postedBy: String, // references User id
  featured: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  jobId: String,
  jobTitle: String,
  company: String,
  applicantId: String,
  applicantName: String,
  applicantEmail: String,
  applicantPhone: String,
  appliedDate: String,
  status: { type: String, default: 'Pending' },
  resumeName: String,
  coverNote: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);
const Application = mongoose.model('Application', applicationSchema);

// ================= SEED DATA =================
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial database data into MongoDB...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      // Seed Demo Seeker
      await User.create({
        id: 'user-seeker-1',
        name: 'Alex Johnson',
        email: 'alex.seeker@jobportal.com',
        password: hashedPassword,
        role: 'candidate',
        headline: 'Senior React & Frontend Developer',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        skills: ['React', 'JavaScript', 'CSS3', 'Bootstrap', 'Vite', 'Node.js'],
        bio: 'Passionate Web Developer with 5+ years building modern, responsive, and accessible web apps.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });

      // Seed Demo Employer
      await User.create({
        id: 'emp-1',
        name: 'TechPulse Recruiting',
        email: 'recruiter@techpulse.com',
        password: hashedPassword,
        role: 'employer',
        companyName: 'TechPulse Solutions',
        location: 'San Francisco, CA',
        bio: 'Leading innovator in cloud infrastructure and enterprise React web platforms.',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
      });

      // Seed Initial Jobs
      const initialJobs = [
        {
          id: "job-101",
          title: "Senior Frontend Engineer (React)",
          company: "TechPulse Solutions",
          logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
          category: "Technology",
          type: "Full-Time",
          location: "San Francisco, CA (Hybrid)",
          salary: "$120,000 - $145,000 / yr",
          postedDate: "2026-09-10",
          experience: "4-6 Years",
          featured: true,
          description: "We are looking for an experienced Senior Frontend Engineer with deep expertise in modern React, state management, and web performance to build scalable user interfaces for our enterprise cloud platform.",
          requirements: [
            "Proficient in React, JavaScript (ES6+), TypeScript, and CSS3/SASS.",
            "Experience with modern state management, Vite, and component design patterns.",
            "Strong understanding of responsive layouts, accessibility (WCAG), and REST APIs."
          ],
          responsibilities: [
            "Architect modular, reusable React components across client-facing web products.",
            "Collaborate closely with UI/UX designers and backend API engineers.",
            "Optimize web page load speeds, animations, and cross-browser responsiveness."
          ],
          postedBy: "emp-1"
        }
      ];

      await Job.insertMany(initialJobs);

      // Seed Applications
      await Application.create({
        id: 'app-201',
        jobId: 'job-101',
        jobTitle: 'Senior Frontend Engineer (React)',
        company: 'TechPulse Solutions',
        applicantId: 'user-seeker-1',
        applicantName: 'Alex Johnson',
        applicantEmail: 'alex.seeker@jobportal.com',
        applicantPhone: '+1 (555) 234-5678',
        appliedDate: '2026-09-12',
        status: 'Shortlisted',
        resumeName: 'Alex_Johnson_Resume_2026.pdf',
        coverNote: 'I have 5 years of frontend development experience building React and Next.js applications.'
      });
    }
  } catch (error) {
    console.error('Error seeding DB:', error);
  }
};

mongoose.connection.once('open', () => {
  seedDatabase();
});


// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helper: Format DB User object
const formatUser = (user) => {
  if (!user) return null;
  const { password, _id, __v, createdAt, ...rest } = user.toObject();
  return rest;
};

// Helper: Format DB Job object
const formatJob = (job) => {
  const { _id, __v, createdAt, ...rest } = job.toObject();
  return rest;
};

// Helper: Format DB Application object
const formatApp = (app) => {
  const { _id, __v, createdAt, ...rest } = app.toObject();
  return rest;
};

// ================= USER AUTHENTICATION APIS =================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'candidate', headline, companyName, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = (role === 'employer' ? 'emp-' : 'user-') + Date.now();
    const avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newUser = await User.create({
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      headline: headline || (role === 'candidate' ? 'Software Professional' : 'Talent Recruiter'),
      companyName: companyName || null,
      bio: bio || 'Welcome to my profile.',
      avatar: avatarUrl,
      skills: role === 'candidate' ? ['React', 'JavaScript', 'HTML5', 'CSS3'] : []
    });

    const formattedUser = formatUser(newUser);

    const token = jwt.sign(
      { id: userId, email: formattedUser.email, role: formattedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: formattedUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const formattedUser = formatUser(user);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: formattedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User profile not found' });
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, headline, phone, location, bio, skills, companyName } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (headline !== undefined) updateData.headline = headline;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (companyName !== undefined) updateData.companyName = companyName;

    const updatedUser = await User.findOneAndUpdate({ id: req.user.id }, updateData, { returnDocument: 'after' });
    res.json({ user: formatUser(updatedUser), message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ================= JOB LISTINGS APIS =================

app.get('/api/jobs', async (req, res) => {
  try {
    const { keyword, category, type, location } = req.query;

    const query = {};

    if (keyword && keyword.trim() !== '') {
      const term = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: term },
        { company: term },
        { description: term }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs.map(formatJob));
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(formatJob(job));
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving job details' });
  }
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, company, category, type, location, salary, experience, description, requirements, responsibilities, featured, logo } = req.body;

    if (!title || !company || !description || !salary) {
      return res.status(400).json({ error: 'Title, company, salary, and description are required.' });
    }

    const jobId = 'job-' + Date.now();
    const defaultLogo = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80';

    const newJob = await Job.create({
      id: jobId,
      title,
      company,
      logo: logo || defaultLogo,
      category: category || 'Technology',
      type: type || 'Full-Time',
      location: location || 'Remote',
      salary,
      experience: experience || '1-3 Years',
      featured: !!featured,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      postedDate: new Date().toISOString().split('T')[0],
      postedBy: req.user.id
    });

    res.status(201).json({ message: 'Job created successfully', job: formatJob(newJob) });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ id: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ================= JOB APPLICATIONS APIS =================

app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    const { jobId, jobTitle, company, coverNote, resumeName } = req.body;

    if (!jobId || !jobTitle) {
      return res.status(400).json({ error: 'Job ID and title are required.' });
    }

    const existing = await Application.findOne({ jobId, applicantId: req.user.id });
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted an application for this position.' });
    }

    const user = await User.findOne({ id: req.user.id });
    const appId = 'app-' + Date.now();

    const newApp = await Application.create({
      id: appId,
      jobId,
      jobTitle,
      company: company || 'Company',
      applicantId: req.user.id,
      applicantName: user ? user.name : req.user.email,
      applicantEmail: user ? user.email : req.user.email,
      applicantPhone: user ? user.phone : '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      resumeName: resumeName || 'Applicant_Resume.pdf',
      coverNote: coverNote || ''
    });

    res.status(201).json({ message: 'Application submitted successfully', application: formatApp(newApp) });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Failed to submit job application' });
  }
});

app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    let rows;
    if (req.user.role === 'candidate') {
      rows = await Application.find({ applicantId: req.user.id }).sort({ createdAt: -1 });
    } else {
      rows = await Application.find().sort({ createdAt: -1 });
    }
    res.json(rows.map(formatApp));
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});

app.patch('/api/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await Application.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { returnDocument: 'after' }
    );
    if (!updated) return res.status(404).json({ error: 'Application not found' });

    res.json({ message: 'Status updated successfully', application: formatApp(updated) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Only start listening when run directly (not when imported by tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🚀 JobConnect Backend running at http://localhost:${PORT}`);
    console.log(`   API Endpoints: http://localhost:${PORT}/api/auth | /api/jobs | /api/applications\n`);
  });
}

export default app;
