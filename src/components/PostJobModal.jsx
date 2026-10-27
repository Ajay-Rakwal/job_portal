import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Save } from 'lucide-react';

export const PostJobModal = ({ isOpen, onClose, onSaveJob, initialJob = null }) => {
  const { currentUser } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Technology');
  const [type, setType] = useState('Full-Time');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('2-4 Years');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');

  useEffect(() => {
    if (initialJob) {
      setTitle(initialJob.title || '');
      setCompany(initialJob.company || '');
      setCategory(initialJob.category || 'Technology');
      setType(initialJob.type || 'Full-Time');
      setLocation(initialJob.location || '');
      setSalary(initialJob.salary || '');
      setExperience(initialJob.experience || '2-4 Years');
      setDescription(initialJob.description || '');
      setRequirementsText(initialJob.requirements ? initialJob.requirements.join('\n') : '');
      setResponsibilitiesText(initialJob.responsibilities ? initialJob.responsibilities.join('\n') : '');
    } else {
      setTitle('');
      setCompany(currentUser?.companyName || 'Innovate Corp');
      setCategory('Technology');
      setType('Full-Time');
      setLocation('San Francisco, CA (Hybrid)');
      setSalary('$110,000 - $135,000 / yr');
      setExperience('2-4 Years');
      setDescription('');
      setRequirementsText('');
      setResponsibilitiesText('');
    }
  }, [initialJob, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const requirements = requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const responsibilities = responsibilitiesText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const jobData = {
      id: initialJob ? initialJob.id : 'job-' + Date.now(),
      title,
      company: company || currentUser?.companyName || 'Tech Company',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
      category,
      type,
      location,
      salary,
      experience,
      postedDate: new Date().toISOString().split('T')[0],
      featured: false,
      description,
      requirements,
      responsibilities,
      postedBy: currentUser.id
    };

    onSaveJob(jobData);
    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 modal-content-custom overflow-hidden">
          <div className="modal-header border-bottom p-4 bg-white">
            <h5 className="modal-title fw-bold text-dark">
              {initialJob ? 'Edit Job Posting' : 'Post a New Job Opportunity'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <div className="row g-3">
                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-secondary">Job Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Job Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Required Experience</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 3-5 Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Salary Range *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. $110,000 - $135,000 / yr"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Role Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Provide a clear, engaging overview of the job role..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Requirements (One bullet point per line)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Proficient in React & TypeScript&#10;3+ years of web application development&#10;Experience with REST APIs"
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Responsibilities (One bullet point per line)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Architect modular React components&#10;Collaborate with UI/UX designers&#10;Optimize load speeds and accessibility"
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top p-3 bg-light d-flex justify-content-between">
              <button type="button" className="btn btn-outline-custom" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom d-flex align-items-center gap-2">
                <Save size={16} /> {initialJob ? 'Save Changes' : 'Publish Job Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
