import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, PlusCircle, ShieldCheck, Bookmark, FileText } from 'lucide-react';

export const Navbar = ({ activeView, setActiveView, onOpenAuthModal, onOpenPostJobModal, notificationCount }) => {
  const { currentUser, logout, isAuthenticated, isCandidate, isEmployer, loginAsDemoCandidate, loginAsDemoEmployer } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-sm">
      <div className="container">
        {/* Brand Logo & Name */}
        <a 
          className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark" 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveView('home'); }}
        >
          <div className="navbar-brand-logo">
            <Briefcase size={22} color="#ffffff" />
          </div>
          <span className="fs-4 tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            Job<span className="text-primary">Sphere</span>
          </span>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none fw-semibold ${activeView === 'home' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveView('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none fw-semibold ${activeView === 'dashboard' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveView('dashboard')}
              >
                {isEmployer ? 'Employer Portal' : 'Find Jobs'}
              </button>
            </li>

            {isAuthenticated && isCandidate && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none fw-semibold ${activeView === 'applications' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                    onClick={() => setActiveView('applications')}
                  >
                    My Applications
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none fw-semibold ${activeView === 'saved' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                    onClick={() => setActiveView('saved')}
                  >
                    Saved Jobs
                  </button>
                </li>
              </>
            )}
          </ul>

          {/* Right Action Bar */}
          <div className="d-flex align-items-center gap-3">
            {/* Quick Demo Role Switcher Toggle */}
            <div className="dropdown d-none d-md-block">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 rounded-pill px-3"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <ShieldCheck size={14} className="text-primary" />
                <span className="small">Demo Switch</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li><h6 className="dropdown-header">Switch Demo User Role</h6></li>
                <li>
                  <button className="dropdown-item small d-flex align-items-center gap-2" onClick={loginAsDemoCandidate}>
                    <User size={14} className="text-primary" /> Candidate (Alex Johnson)
                  </button>
                </li>
                <li>
                  <button className="dropdown-item small d-flex align-items-center gap-2" onClick={loginAsDemoEmployer}>
                    <Briefcase size={14} className="text-success" /> Employer (TechPulse)
                  </button>
                </li>
              </ul>
            </div>

            {/* Role Action Button */}
            {isEmployer && (
              <button
                className="btn btn-primary-custom d-flex align-items-center gap-2 shadow-sm"
                onClick={onOpenPostJobModal}
              >
                <PlusCircle size={18} />
                <span>Post a Job</span>
              </button>
            )}

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-light d-flex align-items-center gap-2 border rounded-pill py-1 px-2 shadow-sm"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="user-avatar-sm"
                  />
                  <div className="text-start d-none d-sm-block pe-1">
                    <div className="fw-semibold lh-1 text-dark small">{currentUser.name}</div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill style-badge mt-1" style={{ fontSize: '0.68rem' }}>
                      {isEmployer ? 'Employer' : 'Candidate'}
                    </span>
                  </div>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2 rounded-3">
                  <li className="px-3 py-2 border-bottom">
                    <div className="fw-bold text-dark">{currentUser.name}</div>
                    <div className="small text-muted">{currentUser.email}</div>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 d-flex align-items-center gap-2 rounded-2 mt-1" onClick={() => setActiveView('profile')}>
                      <User size={16} className="text-secondary" /> My Profile
                    </button>
                  </li>
                  {isCandidate && (
                    <li>
                      <button className="dropdown-item py-2 d-flex align-items-center gap-2 rounded-2" onClick={() => setActiveView('applications')}>
                        <FileText size={16} className="text-secondary" /> Applications
                      </button>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2 rounded-2" onClick={logout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-custom" onClick={() => onOpenAuthModal('login')}>
                  Log In
                </button>
                <button className="btn btn-primary-custom" onClick={() => onOpenAuthModal('register')}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
