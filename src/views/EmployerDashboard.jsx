import React, { useState } from 'react';
import { JobCard } from '../components/JobCard';
import { Briefcase, Users, CheckCircle, PlusCircle, FileText, Eye, Edit3, Trash2, ShieldCheck, UserCheck } from 'lucide-react';

export const EmployerDashboard = ({
  jobs,
  applications,
  onOpenPostJobModal,
  onEditJob,
  onDeleteJob,
  onInspectApplicant,
  onUpdateApplicantStatus,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState('posted-jobs'); // 'posted-jobs' or 'applicants'

  // Filter jobs posted by current employer or fallback to all for demo
  const employerJobs = jobs.filter(j => j.postedBy === currentUser?.id || true);
  
  // Calculate metrics
  const totalApplications = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length;
  const hiredCount = applications.filter(a => a.status === 'Accepted').length;

  return (
    <div className="container py-4">
      {/* Employer Header & Stat Counter Cards */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Employer Dashboard</h3>
          <p className="text-secondary small mb-0">
            Welcome back, <span className="fw-bold text-dark">{currentUser?.name}</span> ({currentUser?.companyName || 'TechPulse Solutions'})
          </p>
        </div>
        <button
          className="btn btn-primary-custom d-flex align-items-center gap-2 shadow-sm"
          onClick={() => onOpenPostJobModal()}
        >
          <PlusCircle size={18} /> Post New Opportunity
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="portal-card p-3 d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-primary-subtle text-primary">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="fs-4 fw-extrabold text-dark">{employerJobs.length}</div>
              <div className="text-secondary small">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="portal-card p-3 d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-info-subtle text-info">
              <Users size={22} />
            </div>
            <div>
              <div className="fs-4 fw-extrabold text-dark">{totalApplications}</div>
              <div className="text-secondary small">Total Candidates</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="portal-card p-3 d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-purple-subtle text-purple" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
              <UserCheck size={22} />
            </div>
            <div>
              <div className="fs-4 fw-extrabold text-dark">{shortlistedCount}</div>
              <div className="text-secondary small">Shortlisted</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="portal-card p-3 d-flex align-items-center gap-3">
            <div className="stat-icon-wrapper bg-success-subtle text-success">
              <CheckCircle size={22} />
            </div>
            <div>
              <div className="fs-4 fw-extrabold text-dark">{hiredCount}</div>
              <div className="text-secondary small">Hired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-3 p-2 mb-4 shadow-sm">
        <div className="d-flex gap-2">
          <button
            className={`tab-nav-btn ${activeTab === 'posted-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('posted-jobs')}
          >
            <Briefcase size={16} className="me-1 inline" /> Manage Posted Jobs ({employerJobs.length})
          </button>

          <button
            className={`tab-nav-btn ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            <Users size={16} className="me-1 inline" /> Candidate Applications ATS ({applications.length})
          </button>
        </div>
      </div>

      {/* TAB 1: POSTED JOBS */}
      {activeTab === 'posted-jobs' && (
        <div className="row g-3">
          {employerJobs.map((job) => (
            <div className="col-12 col-lg-6" key={job.id}>
              <JobCard
                job={job}
                isSaved={false}
                isEmployer={true}
                onEditJob={onEditJob}
                onDeleteJob={onDeleteJob}
                onViewDetails={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: APPLICANTS ATS */}
      {activeTab === 'applicants' && (
        <div className="portal-card overflow-hidden">
          {applications.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4">Candidate Name</th>
                    <th>Job Position</th>
                    <th>Applied Date</th>
                    <th>ATS Status</th>
                    <th>Resume File</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{app.applicantName}</div>
                        <div className="small text-muted">{app.applicantEmail}</div>
                      </td>
                      <td className="fw-semibold text-primary">{app.jobTitle}</td>
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
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                          onClick={() => onInspectApplicant(app)}
                        >
                          <Eye size={14} /> Review Candidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 bg-white">
              <Users size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-dark">No applications received yet</h5>
              <p className="text-muted small mb-0">Candidate submissions for your posted listings will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
