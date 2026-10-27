import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Briefcase, Lock, Mail, Building } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onShowNotification }) => {
  const { login, register, loginAsDemoCandidate, loginAsDemoEmployer } = useContext(AuthContext);
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('candidate'); // 'candidate' or 'employer'

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when modal opens with a different initialMode (e.g. clicking "Register" vs "Log In")
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSubmitting) return;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        onShowNotification(`Welcome back! Logged in successfully.`);
        onClose();
      } else {
        if (!name) {
          setError('Please enter your full name.');
          return;
        }
        if (role === 'employer' && !companyName) {
          setError('Please enter your company name.');
          return;
        }
        await register({
          name,
          email,
          password,
          role,
          companyName
        });
        onShowNotification(`Account created successfully! Welcome, ${name}!`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoCandidate = async () => {
    setIsSubmitting(true);
    try {
      await loginAsDemoCandidate();
      onShowNotification('Signed in as Demo Candidate (Alex Johnson)');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoEmployer = async () => {
    setIsSubmitting(true);
    try {
      await loginAsDemoEmployer();
      onShowNotification('Signed in as Demo Employer (TechPulse Solutions)');
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block tab-modal-backdrop" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '460px' }}>
        <div className="modal-content border-0 modal-content-custom overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header border-0 pb-0 pt-4 px-4 bg-white">
            <h5 className="modal-title fw-bold fs-4">
              {mode === 'login' ? 'Sign In to JobSphere' : 'Create an Account'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-white">
            {/* Quick Demo Login Bar */}
            <div className="p-3 bg-light rounded-3 mb-3 border">
              <div className="small fw-semibold text-muted mb-2 d-flex align-items-center justify-content-between">
                <span>⚡ Quick Demo Sign In:</span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
                  onClick={handleDemoCandidate}
                >
                  <User size={14} /> Candidate
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success w-100 fw-semibold d-flex align-items-center justify-content-center gap-1"
                  onClick={handleDemoEmployer}
                >
                  <Briefcase size={14} /> Employer
                </button>
              </div>
            </div>

            <div className="text-center my-3 position-relative">
              <hr />
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted">
                or with email
              </span>
            </div>

            {/* Role Selection Segmented Control */}
            <div className="d-flex p-1 bg-light rounded-3 mb-3 border">
              <button
                type="button"
                className={`btn btn-sm flex-fill fw-semibold py-2 rounded-2 ${role === 'candidate' ? 'bg-white shadow-sm text-primary' : 'text-secondary'}`}
                onClick={() => setRole('candidate')}
              >
                <User size={14} className="me-1" /> Job Seeker
              </button>
              <button
                type="button"
                className={`btn btn-sm flex-fill fw-semibold py-2 rounded-2 ${role === 'employer' ? 'bg-white shadow-sm text-success' : 'text-secondary'}`}
                onClick={() => setRole('employer')}
              >
                <Briefcase size={14} className="me-1" /> Employer / Recruiter
              </button>
            </div>

            {error && <div className="alert alert-danger py-2 small rounded-3 mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><User size={16} /></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g. Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && role === 'employer' && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Company Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><Building size={16} /></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g. TechPulse Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><Mail size={16} /></span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={16} /></span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 fs-6 shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  mode === 'login'
                    ? `Sign In as ${role === 'candidate' ? 'Job Seeker' : 'Employer'}`
                    : `Register as ${role === 'candidate' ? 'Job Seeker' : 'Employer'}`
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <span className="small text-muted">
                  Don't have an account?{' '}
                  <button className="btn btn-link p-0 small fw-bold text-decoration-none" onClick={() => setMode('register')}>
                    Create one
                  </button>
                </span>
              ) : (
                <span className="small text-muted">
                  Already registered?{' '}
                  <button className="btn btn-link p-0 small fw-bold text-decoration-none" onClick={() => setMode('login')}>
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
