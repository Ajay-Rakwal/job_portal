# 🚀 JobConnect — Full Stack Job Portal

A complete full-stack job portal application built with **React + Vite** (frontend) and **Express + MongoDB** (backend), featuring JWT authentication, protected routes, and full application workflow.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, Bootstrap 5 |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Bootstrap 5 + Custom CSS (Plus Jakarta Sans) |
| Icons | Bootstrap Icons, Lucide React |

---

## ✨ Features

### 🔐 Authentication
- User **Registration** (Candidate / Employer)
- **Login** with JWT token issuance
- **Token persistence** via `localStorage`
- **Protected routes** — Dashboard accessible only to authenticated users
- Token **auto-validation** on app startup via `/api/auth/me`
- **Demo login** for both candidate and employer roles

### 👤 Candidate Flow
- Browse and **search/filter jobs** (keyword, category, type, location)
- **Save/bookmark** job listings
- **Apply for jobs** with cover note and resume name
- View **application status** (Pending → Shortlisted → Accepted/Rejected)
- **Profile management** — update name, bio, skills, contact info

### 🏢 Employer Flow
- **Post new job** listings with full details
- **Edit/Delete** existing job postings
- View all **incoming applications** by job
- **Update applicant status** (review, shortlist, interview, accept, reject)
- Applicant detail modal with full application info

### 🏠 Home Page
- Hero section with **live job search**
- Featured **category cards** for quick filtering
- **Featured job listings**
- Stats section

---

## ⚙️ Project Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally on port `27017`

### Installation

```bash
# Install dependencies
npm install

# Start backend server (port 5000)
npm run server

# Start frontend dev server (port 5173) — in a separate terminal
npm run dev
```

### Environment Variables (optional)

Create a `.env` file in the root:
```
PORT=5000
JWT_SECRET=your_custom_secret_here
MONGODB_URI=mongodb://localhost:27017/job-portal
```

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update user profile |

### Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | No | List/search all jobs |
| GET | `/api/jobs/:id` | No | Get single job |
| POST | `/api/jobs` | Yes | Post new job |
| DELETE | `/api/jobs/:id` | Yes | Delete job |

### Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/applications` | Yes | Submit job application |
| GET | `/api/applications` | Yes | Get applications (role-aware) |
| PATCH | `/api/applications/:id/status` | Yes | Update application status |

---

## 🔒 Authentication Flow

```
User Registers → JWT Issued → Stored in localStorage
     ↓
User Logs In  → JWT Issued → Token sent with every API request
     ↓
Protected Routes → Token validated server-side via middleware
     ↓
Token Expiry (7d) → User redirected to login
```

---

## 🧪 Testing

### Manual Test Accounts (auto-seeded)

| Role | Email | Password |
|------|-------|----------|
| Candidate | `alex.seeker@jobportal.com` | `password123` |
| Employer | `recruiter@techpulse.com` | `password123` |

### Test Cases

#### Auth Flow
- [x] Register new candidate account
- [x] Register new employer account  
- [x] Login with valid credentials
- [x] Login with invalid credentials → error message
- [x] Logout → redirected to home
- [x] Direct dashboard URL → requires login
- [x] Token persists on page refresh

#### Job Flow
- [x] Browse all jobs (unauthenticated)
- [x] Search by keyword, location, category, type
- [x] View job details modal
- [x] Apply to job (requires login)
- [x] Duplicate application → error shown
- [x] Save/unsave job

#### Employer Flow
- [x] Post new job → appears in listings
- [x] Edit existing job
- [x] Delete job → removed from list
- [x] View applications for job
- [x] Update applicant status

---

## 🗂️ Project Structure

```
job-portal/
├── server.js              # Express backend + MongoDB models + APIs
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Root component + state management
│   ├── App.css            # App-level styles
│   ├── index.css          # Global styles + Bootstrap imports
│   ├── context/
│   │   └── AuthContext.jsx   # JWT auth context (login/register/logout)
│   ├── components/
│   │   ├── Navbar.jsx        # Responsive navbar with auth state
│   │   ├── AuthModal.jsx     # Login/Register modal with JWT
│   │   ├── JobCard.jsx       # Job listing card
│   │   ├── JobDetailModal.jsx # Full job details
│   │   ├── ApplyModal.jsx    # Application submission
│   │   ├── PostJobModal.jsx  # Employer job posting form
│   │   ├── ApplicantModal.jsx # Applicant review modal
│   │   ├── NotificationToast.jsx # Toast notifications
│   │   └── Footer.jsx        # Site footer
│   ├── views/
│   │   ├── HomeView.jsx      # Landing page
│   │   ├── CandidateDashboard.jsx  # Candidate dashboard
│   │   └── EmployerDashboard.jsx   # Employer dashboard
│   └── data/
│       ├── initialJobs.js    # Fallback job data
│       └── mockApplications.js # Fallback applications
└── public/
```

---

## 🚀 Deployment

### Local Deployment
Both servers run locally:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Production Build
```bash
npm run build        # Builds frontend to /dist
npm run preview      # Preview the production build
npm run start        # Start the backend server
```

### Cloud Deployment Options

#### Render (Recommended — Free)
1. Push code to GitHub
2. Create new **Web Service** on Render
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm run start`
5. Add environment variables (`JWT_SECRET`, `MONGODB_URI`)
6. Connect **MongoDB Atlas** as the database

#### Railway
1. Connect GitHub repo
2. Auto-detects Node.js
3. Set environment variables

---

## 🔧 Git Version Control

```bash
# Initialize repo (if not done)
git init
git remote add origin <your-repo-url>

# Standard workflow
git add .
git commit -m "feat: implement full auth flow with JWT"
git push origin main
```

---

## 📝 License

MIT © 2026 JobConnect
