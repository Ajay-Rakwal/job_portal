import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="navbar-brand-logo">
                <Briefcase size={20} color="#ffffff" />
              </div>
              <span className="fs-5 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
                Job<span className="text-primary">Sphere</span>
              </span>
            </div>
            <p className="text-secondary small mb-3 lh-base">
              JobSphere connects ambitious job seekers with world-class employers. Search curated remote & on-site positions, track your job applications, and manage hiring seamlessly.
            </p>
            <div className="small text-muted">
              © {new Date().getFullYear()} JobSphere Portal. All rights reserved.
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">For Candidates</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><a href="#" className="text-decoration-none text-secondary">Browse Jobs</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Career Advice</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Saved Listings</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Salary Calculator</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">For Employers</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><a href="#" className="text-decoration-none text-secondary">Post a Job</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Candidate Search</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Recruiting Solutions</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Pricing Plans</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Subscribe to Job Alerts</h6>
            <p className="text-secondary small mb-3">Get weekly handpicked job postings matching your target skills.</p>
            <div className="input-group mb-2">
              <input type="email" className="form-control form-control-sm" placeholder="Enter your email..." />
              <button className="btn btn-primary-custom btn-sm" type="button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
