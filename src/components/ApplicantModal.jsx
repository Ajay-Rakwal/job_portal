import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const ApplicantModal = ({ application, onClose, onUpdateStatus }) => {
  if (!application) return null;

  const [currentStatus, setCurrentStatus] = useState(application.status || 'Applied');

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(application.id, newStatus);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 modal-content-custom overflow-hidden">
          <div className="modal-header border-bottom p-4 bg-white d-flex align-items-center justify-content-between">
            <div>
              <h5 className="modal-title fw-bold text-dark">Applicant Profile</h5>
              <div className="small text-muted">Applied for: <span className="fw-semibold text-primary">{application.jobTitle}</span></div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-white">
            {/* Header Applicant Summary */}
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-4 border">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 50, height: 50 }}>
                  {application.applicantName.charAt(0)}
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">{application.applicantName}</h6>
                  <div className="d-flex align-items-center gap-3 text-muted small mt-1">
                    <span><Mail size={13} className="me-1" />{application.applicantEmail}</span>
                    <span><Phone size={13} className="me-1" />{application.applicantPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className={`badge px-3 py-2 fs-6 rounded-pill badge-status-${currentStatus.replace(/\s+/g, '')}`}>
                  {currentStatus}
                </span>
              </div>
            </div>

            {/* ATS Status Action Buttons */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary mb-2">Update Application Status (ATS)</label>
              <div className="d-flex flex-wrap gap-2">
                {['Under Review', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn btn-sm fw-semibold rounded-pill px-3 ${currentStatus === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Preview Box */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Submitted Resume</h6>
              <div className="p-3 border rounded-3 bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <FileText size={22} className="text-primary" />
                  <div>
                    <div className="fw-semibold small text-dark">{application.resumeName || 'Resume_Document.pdf'}</div>
                    <div className="small text-muted">Submitted on {application.appliedDate}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary fw-semibold"
                  onClick={() => alert(`Simulated downloading ${application.resumeName || 'Resume.pdf'}`)}
                >
                  Download Resume
                </button>
              </div>
            </div>

            {/* Cover Note */}
            <div className="mb-2">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Cover Letter / Intro Note</h6>
              <div className="p-3 bg-light rounded-3 border text-secondary small lh-base">
                {application.coverNote ? application.coverNote : 'No cover letter note was provided by candidate.'}
              </div>
            </div>
          </div>

          <div className="modal-footer border-top p-3 bg-light d-flex justify-content-end">
            <button type="button" className="btn btn-outline-custom" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
