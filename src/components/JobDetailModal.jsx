import React from 'react';
import { MapPin, DollarSign, Briefcase, Calendar, CheckCircle, Building2, X } from 'lucide-react';

export const JobDetailModal = ({ job, onClose, onApply, hasApplied, isEmployer }) => {
  if (!job) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 modal-content-custom overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom p-4 bg-white d-flex align-items-start justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img
                src={job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                alt={job.company}
                className="company-avatar"
              />
              <div>
                <h4 className="fw-bold text-dark mb-1">{job.title}</h4>
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <span className="fw-semibold text-dark"><Building2 size={14} className="me-1" />{job.company}</span>
                  <span>•</span>
                  <span><MapPin size={14} className="me-1" />{job.location}</span>
                </div>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-white overflow-y-auto" style={{ maxHeight: '70vh' }}>
            {/* Quick Metrics Bar */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="text-muted small mb-1">Job Type</div>
                  <div className="fw-bold text-dark">{job.type}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="text-muted small mb-1">Salary</div>
                  <div className="fw-bold text-success">{job.salary}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="text-muted small mb-1">Experience</div>
                  <div className="fw-bold text-dark">{job.experience || '2+ Yrs'}</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3 text-center border">
                  <div className="text-muted small mb-1">Category</div>
                  <div className="fw-bold text-primary">{job.category}</div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">About the Role</h6>
              <p className="text-secondary lh-lg" style={{ fontSize: '0.95rem' }}>{job.description}</p>
            </div>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Key Responsibilities</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2 text-secondary small">
                      <CheckCircle size={16} className="text-primary mt-1 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications / Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Requirements & Skills</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2 text-secondary small">
                      <CheckCircle size={16} className="text-success mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top p-3 bg-light d-flex justify-content-between">
            <span className="text-muted small">
              <Calendar size={14} className="me-1" /> Posted on {job.postedDate}
            </span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-custom" onClick={onClose}>
                Close
              </button>
              {!isEmployer && (
                <button
                  type="button"
                  className={`btn ${hasApplied ? 'btn-success disabled' : 'btn-primary-custom'}`}
                  onClick={() => {
                    onClose();
                    if (!hasApplied) onApply(job);
                  }}
                  disabled={hasApplied}
                >
                  {hasApplied ? '✓ Application Submitted' : 'Apply For This Position'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
