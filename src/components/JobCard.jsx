import React from 'react';
import { Bookmark, MapPin, DollarSign, Clock, Building2, ChevronRight, Briefcase } from 'lucide-react';

export const JobCard = ({
  job,
  isSaved,
  onToggleSave,
  onViewDetails,
  onApply,
  hasApplied,
  isEmployer,
  onEditJob,
  onDeleteJob
}) => {
  return (
    <div className="portal-card p-4 mb-3 position-relative">
      {/* Featured Badge */}
      {job.featured && (
        <span
          className="position-absolute top-0 end-0 badge bg-primary-subtle text-primary border border-primary-subtle rounded-bottom-start-3 rounded-top-end-3 px-3 py-1 fw-semibold"
          style={{ fontSize: '0.72rem' }}
        >
          ★ Featured
        </span>
      )}

      <div className="d-flex align-items-start gap-3">
        {/* Company Avatar / Logo */}
        <img
          src={job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
          alt={job.company}
          className="company-avatar flex-shrink-0"
        />

        <div className="flex-grow-1 min-w-0">
          <div className="d-flex justify-content-between align-items-start pr-4">
            <div>
              <h5 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: '1.1rem' }}>
                {job.title}
              </h5>
              <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                <span className="fw-semibold text-dark"><Building2 size={14} className="me-1" />{job.company}</span>
                <span>•</span>
                <span><MapPin size={14} className="me-1" />{job.location}</span>
              </div>
            </div>

            {/* Bookmark button for candidate */}
            {!isEmployer && onToggleSave && (
              <button
                className={`btn btn-sm rounded-circle p-2 border-0 ${isSaved ? 'text-primary bg-primary-subtle' : 'text-muted bg-light'}`}
                onClick={() => onToggleSave(job.id)}
                title={isSaved ? 'Remove Bookmark' : 'Save Job'}
              >
                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          {/* Job Badges / Metadata */}
          <div className="d-flex flex-wrap align-items-center gap-2 my-2">
            <span className="badge-tag">{job.type}</span>
            <span className="badge-tag">{job.category}</span>
            <span className="badge-tag text-success bg-success-subtle border border-success-subtle">
              <DollarSign size={13} className="me-1" />{job.salary}
            </span>
            <span className="badge-tag bg-light border">
              <Briefcase size={13} className="me-1" />{job.experience || '2+ Yrs'}
            </span>
          </div>

          {/* Short Excerpt */}
          <p className="text-secondary small mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.description}
          </p>

          {/* Card Footer Actions */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top">
            <span className="text-muted small d-flex align-items-center gap-1">
              <Clock size={13} /> Posted {job.postedDate}
            </span>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-custom btn-sm"
                onClick={() => onViewDetails(job)}
              >
                Details
              </button>

              {isEmployer ? (
                <div className="dropdown">
                  <button className="btn btn-light btn-sm border dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Manage
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li><button className="dropdown-item small" onClick={() => onEditJob && onEditJob(job)}>Edit Posting</button></li>
                    <li><button className="dropdown-item small text-danger" onClick={() => onDeleteJob && onDeleteJob(job.id)}>Delete</button></li>
                  </ul>
                </div>
              ) : (
                <button
                  className={`btn btn-sm ${hasApplied ? 'btn-success disabled' : 'btn-primary-custom'}`}
                  onClick={() => !hasApplied && onApply(job)}
                  disabled={hasApplied}
                >
                  {hasApplied ? '✓ Applied' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
