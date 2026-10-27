import React, { useState } from 'react';
import { JobCard } from '../components/JobCard';
import { Search, MapPin, Briefcase, TrendingUp, Users, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomeView = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onViewDetails,
  onApply,
  userApplications,
  isEmployer,
  onNavigateToJobs,
  onOpenAuthModal
}) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Design', 'Marketing', 'Finance', 'Healthcare'];

  const filteredJobs = jobs.filter((j) => {
    const matchesKeyword = !keyword || j.title.toLowerCase().includes(keyword.toLowerCase()) || j.company.toLowerCase().includes(keyword.toLowerCase());
    const matchesLocation = !location || j.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || j.category === selectedCategory;
    return matchesKeyword && matchesLocation && matchesCategory;
  });

  const featuredJobs = jobs.filter(j => j.featured).slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigateToJobs(keyword, location, selectedCategory);
  };

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="container text-center py-4">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            🚀 10,000+ Active Job Opportunities
          </span>
          <h1 className="display-5 fw-extrabold text-dark mb-3 tracking-tight" style={{ fontWeight: 800 }}>
            Find Your Next <span className="text-primary">Dream Career</span> Today
          </h1>
          <p className="lead text-secondary max-w-2xl mx-auto mb-4 fs-6" style={{ maxWidth: '650px' }}>
            Discover top opportunities at tech pioneers, design studios, and Fortune 500 leaders. Apply in one click and track your applications in real-time.
          </p>

          {/* Search Box */}
          <div className="hero-search-box max-w-3xl mx-auto mb-4" style={{ maxWidth: '820px' }}>
            <form onSubmit={handleSearchSubmit}>
              <div className="row g-2 align-items-center">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0 text-muted"><Search size={18} /></span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-0"
                      placeholder="Job title, keywords, or company..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-4 border-start-md">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-0 text-muted"><MapPin size={18} /></span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-0"
                      placeholder="Location or 'Remote'..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary-custom w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
                    Search Jobs <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Category Chips */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-3">
            <span className="small text-muted me-2 fw-semibold">Popular Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats counter section */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="fs-3 fw-extrabold text-primary mb-1">12,500+</div>
                <div className="text-secondary small fw-medium">Live Job Postings</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="fs-3 fw-extrabold text-success mb-1">4,800+</div>
                <div className="text-secondary small fw-medium">Verified Companies</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="fs-3 fw-extrabold text-info mb-1">98k+</div>
                <div className="text-secondary small fw-medium">Job Seekers Hired</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="fs-3 fw-extrabold text-warning mb-1">99.4%</div>
                <div className="text-secondary small fw-medium">Candidate Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold text-dark mb-1">Featured Job Opportunities</h3>
              <p className="text-secondary small mb-0">Handpicked high-impact roles from industry leaders</p>
            </div>
            <button
              className="btn btn-outline-custom d-flex align-items-center gap-2"
              onClick={() => onNavigateToJobs('', '', 'All')}
            >
              View All Jobs ({jobs.length}) <ArrowRight size={16} />
            </button>
          </div>

          <div className="row g-3">
            {featuredJobs.map((job) => (
              <div className="col-12 col-lg-6" key={job.id}>
                <JobCard
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewDetails}
                  onApply={onApply}
                  hasApplied={userApplications.some(app => app.jobId === job.id)}
                  isEmployer={isEmployer}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Banner */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
                Why JobSphere?
              </span>
              <h2 className="fw-extrabold text-dark mb-3">Empowering Candidates & Recruiters Alike</h2>
              <p className="text-secondary mb-4">
                Whether you're looking for your next career milestone or seeking to hire top-tier talent, JobSphere offers streamline tools to get you hired faster.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <CheckCircle2 size={22} className="text-primary mt-1" />
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Instant Direct Applications</h6>
                    <p className="text-secondary small mb-0">Apply with your saved candidate profile and simulated resume with just one click.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <CheckCircle2 size={22} className="text-primary mt-1" />
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Real-Time Application Status Tracker</h6>
                    <p className="text-secondary small mb-0">Know exactly when employers review your resume, schedule interviews, or extend offers.</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <CheckCircle2 size={22} className="text-primary mt-1" />
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Built-in Employer ATS</h6>
                    <p className="text-secondary small mb-0">Recruiters can publish listings, review candidate files, and shortlist top applicants effortless.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 bg-light rounded-4 border shadow-sm text-center">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                  alt="Team Collaboration"
                  className="img-fluid rounded-3 mb-3 border shadow-sm"
                  style={{ maxHeight: '320px', objectFit: 'cover', width: '100%' }}
                />
                <h5 className="fw-bold text-dark mb-1">Ready to start your journey?</h5>
                <p className="text-secondary small mb-3">Join thousands of professionals advancing their careers today.</p>
                <button className="btn btn-primary-custom px-4" onClick={() => onOpenAuthModal('register')}>
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
