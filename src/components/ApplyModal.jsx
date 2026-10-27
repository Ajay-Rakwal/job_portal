import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, FileText, Send } from 'lucide-react';

export const ApplyModal = ({ job, onClose, onSubmitApplication }) => {
  const { currentUser } = useContext(AuthContext);
  const [coverNote, setCoverNote] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [resumeName, setResumeName] = useState(currentUser?.resumeName || `${currentUser?.name?.replace(/\s+/g, '_') || 'Applicant'}_Resume_2026.pdf`);
  const [isUploading, setIsUploading] = useState(false);

  if (!job) return null;

  const handleSimulatedUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setResumeName(file.name);
        setIsUploading(false);
      }, 600);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantPhone: phone,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      resumeName,
      coverNote
    });
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px' }}>
        <div className="modal-content border-0 modal-content-custom overflow-hidden">
          <div className="modal-header border-bottom p-4 bg-white">
            <div>
              <h5 className="modal-title fw-bold text-dark">Apply for {job.title}</h5>
              <div className="small text-muted">{job.company} • {job.location}</div>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white">
              {/* Applicant Info Summary */}
              <div className="p-3 bg-light rounded-3 mb-3 border">
                <div className="row g-2">
                  <div className="col-6">
                    <label className="small text-muted d-block">Applicant Name</label>
                    <span className="fw-semibold small text-dark">{currentUser.name}</span>
                  </div>
                  <div className="col-6">
                    <label className="small text-muted d-block">Email</label>
                    <span className="fw-semibold small text-dark">{currentUser.email}</span>
                  </div>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Resume File Upload Box */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Attach Resume (PDF/DOCX)</label>
                <div className="border border-dashed rounded-3 p-3 text-center bg-light">
                  {isUploading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                  ) : (
                    <div>
                      <FileText size={28} className="text-primary mb-1" />
                      <div className="fw-semibold small text-dark">{resumeName}</div>
                      <div className="small text-muted mb-2">Simulated resume attached</div>
                      <label className="btn btn-sm btn-outline-primary fw-semibold cursor-pointer">
                        <UploadCloud size={14} className="me-1" /> Change Resume
                        <input type="file" className="d-none" accept=".pdf,.doc,.docx" onChange={handleSimulatedUpload} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Note */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Cover Note / Why you're a fit (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share a brief introduction or key highlights of your relevant experience..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer border-top p-3 bg-light d-flex justify-content-between">
              <button type="button" className="btn btn-outline-custom" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom d-flex align-items-center gap-2">
                <Send size={16} /> Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
