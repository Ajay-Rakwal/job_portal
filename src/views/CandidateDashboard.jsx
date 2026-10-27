import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { Search, MapPin, Filter, Bookmark, FileText, User, Briefcase, Plus, X, Check, Save } from 'lucide-react';

export const CandidateDashboard = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onViewDetails,
  onApply,
  userApplications,
  initialSearchState = { keyword: '', location: '', category: 'All' },
  onShowNotification,
  activeTab = 'search',
  setActiveTab,
  onSearchBackend
}) => {
  const { currentUser, updateUserProfile } = useContext(AuthContext);

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState(initialSearchState.keyword || '');
  const [searchLocation, setSearchLocation] = useState(initialSearchState.location || '');
  const [selectedCategory, setSelectedCategory] = useState(initialSearchState.category || 'All');
  const [selectedType, setSelectedType] = useState('All');

  // Trigger backend filter API query
  React.useEffect(() => {
    if (onSearchBackend) {
      const timer = setTimeout(() => {
        onSearchBackend({
          keyword: searchKeyword,
          location: searchLocation,
          category: selectedCategory,
          type: selectedType
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [searchKeyword, searchLocation, selectedCategory, selectedType, onSearchBackend]);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileHeadline, setProfileHeadline] = useState(currentUser?.headline || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState(currentUser?.skills || ['React', 'JavaScript', 'CSS3']);
  const [newSkill, setNewSkill] = useState('');

  // Filtering Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesKeyword = !searchKeyword ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.company.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesLocation = !searchLocation ||
      job.location.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesKeyword && matchesLocation && matchesCategory && matchesType;
  });

  const savedJobsList = jobs.filter((j) => savedJobIds.includes(j.id));

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      headline: profileHeadline,
      phone: profilePhone,
      bio: profileBio,
      skills: skills
    });
    onShowNotification('Profile updated successfully!');
  };

  return (
    <div className="container py-4">
      {/* Dashboard Sub-Header Navigation */}
      <div className="bg-white border rounded-3 p-2 mb-4 shadow-sm">
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`tab-nav-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search size={16} className="me-1 inline" /> Find Jobs ({jobs.length})
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={16} className="me-1 inline" /> My Applications ({userApplications.length})
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={16} className="me-1 inline" /> Saved Jobs ({savedJobsList.length})
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} className="me-1 inline" /> My Profile
          </button>
        </div>
      </div>

      {/* TAB 1: SEARCH JOBS */}
      {activeTab === 'search' && (
        <div>
          {/* Multi-Filter Search Bar */}
          <div className="portal-card p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Keywords / Job Title</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><Search size={16} /></span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search frontend, designer..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold text-secondary">Location</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><MapPin size={16} /></span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="City or Remote..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold text-secondary">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-semibold text-secondary">Job Type</label>
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Summary & Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small fw-semibold">
              Showing <span className="text-dark fw-bold">{filteredJobs.length}</span> job openings
            </span>
            {(searchKeyword || searchLocation || selectedCategory !== 'All' || selectedType !== 'All') && (
              <button
                className="btn btn-link btn-sm text-danger text-decoration-none fw-semibold p-0"
                onClick={() => {
                  setSearchKeyword('');
                  setSearchLocation('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Job List */}
          {filteredJobs.length > 0 ? (
            <div className="row g-3">
              {filteredJobs.map((job) => (
                <div className="col-12 col-lg-6" key={job.id}>
                  <JobCard
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                    onToggleSave={onToggleSave}
                    onViewDetails={onViewDetails}
                    onApply={onApply}
                    hasApplied={userApplications.some(app => app.jobId === job.id)}
                    isEmployer={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 border">
              <Search size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-dark">No matching job openings found</h5>
              <p className="text-muted small mb-0">Try expanding your keyword search or resetting active filters.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY APPLICATIONS */}
      {activeTab === 'applications' && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="fw-bold text-dark mb-0">My Submitted Applications</h4>
            <span className="badge bg-primary px-3 py-2 rounded-pill">Total: {userApplications.length}</span>
          </div>

          {userApplications.length > 0 ? (
            <div className="portal-card overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light border-bottom">
                    <tr>
                      <th className="ps-4">Job Position</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status Tracker</th>
                      <th>Resume Attached</th>
                      <th className="text-end pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userApplications.map((app) => (
                      <tr key={app.id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{app.jobTitle}</div>
                          <div className="small text-muted">{app.company}</div>
                        </td>
                        <td>{app.company}</td>
                        <td className="small text-muted">{app.appliedDate}</td>
                        <td>
                          <span className={`badge px-3 py-1.5 rounded-pill badge-status-${(app.status || 'Applied').replace(/\s+/g, '')}`}>
                            {app.status || 'Applied'}
                          </span>
                        </td>
                        <td className="small text-muted">
                          <FileText size={14} className="me-1 text-primary" />
                          {app.resumeName || 'Resume.pdf'}
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-outline-custom"
                            onClick={() => {
                              const matchingJob = jobs.find(j => j.id === app.jobId);
                              if (matchingJob) onViewDetails(matchingJob);
                            }}
                          >
                            View Job
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 border">
              <FileText size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-dark">No applications submitted yet</h5>
              <p className="text-muted small mb-3">Browse available openings and submit your first job application!</p>
              <button className="btn btn-primary-custom" onClick={() => setActiveTab('search')}>
                Browse Open Jobs
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED JOBS */}
      {activeTab === 'saved' && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="fw-bold text-dark mb-0">Bookmarked Job Listings</h4>
            <span className="badge bg-secondary px-3 py-2 rounded-pill">{savedJobsList.length} Saved</span>
          </div>

          {savedJobsList.length > 0 ? (
            <div className="row g-3">
              {savedJobsList.map((job) => (
                <div className="col-12 col-lg-6" key={job.id}>
                  <JobCard
                    job={job}
                    isSaved={true}
                    onToggleSave={onToggleSave}
                    onViewDetails={onViewDetails}
                    onApply={onApply}
                    hasApplied={userApplications.some(app => app.jobId === job.id)}
                    isEmployer={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 border">
              <Bookmark size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-dark">No saved jobs</h5>
              <p className="text-muted small mb-3">Click the bookmark icon on any job card to save it for later review.</p>
              <button className="btn btn-primary-custom" onClick={() => setActiveTab('search')}>
                Explore Jobs
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="portal-card p-4 text-center">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="rounded-circle mb-3 border shadow-sm"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
              <h5 className="fw-bold text-dark mb-1">{currentUser?.name}</h5>
              <p className="text-muted small mb-2">{currentUser?.headline || 'Candidate'}</p>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill small mb-3">
                ✓ Ready for Hire
              </span>

              <div className="border-top pt-3 text-start">
                <div className="small text-muted mb-1">Email: <span className="text-dark fw-semibold">{currentUser?.email}</span></div>
                <div className="small text-muted mb-1">Phone: <span className="text-dark fw-semibold">{currentUser?.phone || '+1 (555) 234-5678'}</span></div>
                <div className="small text-muted">Location: <span className="text-dark fw-semibold">{currentUser?.location || 'San Francisco, CA'}</span></div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="portal-card p-4">
              <h5 className="fw-bold text-dark border-bottom pb-3 mb-4">Edit Candidate Profile</h5>

              <form onSubmit={handleSaveProfile}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Professional Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Senior Frontend Developer"
                      value={profileHeadline}
                      onChange={(e) => setProfileHeadline(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">About Me / Bio</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">Skills & Expertise</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {skills.map((skill) => (
                        <span key={skill} className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill d-flex align-items-center gap-1">
                          {skill}
                          <X size={12} className="cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                        </span>
                      ))}
                    </div>
                    <div className="input-group max-w-sm" style={{ maxWidth: '320px' }}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add skill (e.g. TypeScript)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                      />
                      <button className="btn btn-outline-primary btn-sm" type="button" onClick={handleAddSkill}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-top pt-3 text-end">
                  <button type="submit" className="btn btn-primary-custom d-inline-flex align-items-center gap-2">
                    <Save size={16} /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
