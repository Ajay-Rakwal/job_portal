import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { PostJobModal } from './components/PostJobModal';
import { ApplicantModal } from './components/ApplicantModal';
import { NotificationToast } from './components/NotificationToast';

import { HomeView } from './views/HomeView';
import { CandidateDashboard } from './views/CandidateDashboard';
import { EmployerDashboard } from './views/EmployerDashboard';

import { initialJobs } from './data/initialJobs';
import { mockApplications } from './data/mockApplications';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const MainApp = () => {
  const { currentUser, token, isEmployer, isCandidate, isAuthenticated } = useContext(AuthContext);

  // State: Jobs, Saved Jobs, Applications
  const [jobs, setJobs] = useState(initialJobs);
  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = localStorage.getItem('job_portal_saved');
    return saved ? JSON.parse(saved) : ['job-101', 'job-105'];
  });

  const [applications, setApplications] = useState(mockApplications);

  // Navigation State
  const [activeView, setActiveView] = useState('home');
  const [activeCandidateTab, setActiveCandidateTab] = useState('search');
  const [initialSearchState, setInitialSearchState] = useState({ keyword: '', location: '', category: 'All' });

  // Modal Control States
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'login' });
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [postJobConfig, setPostJobConfig] = useState({ isOpen: false, initialJob: null });
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
  };

  // Fetch jobs from Express backend with optional search filter
  const fetchJobsFromBackend = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.location) params.append('location', filters.location);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.type && filters.type !== 'All') params.append('type', filters.type);

      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
      if (res.ok) {
        const fetchedJobs = await res.json();
        setJobs(fetchedJobs);
      }
    } catch (err) {
      console.warn('Backend unavailable, using initial data:', err.message);
    }
  }, []);

  // Fetch applications from backend
  const fetchApplicationsFromBackend = useCallback(async () => {
    const authToken = token || localStorage.getItem('job_portal_token');
    if (!authToken) return;

    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const fetchedApps = await res.json();
        setApplications(fetchedApps);
      }
    } catch (err) {
      console.warn('Could not fetch applications from API:', err.message);
    }
  }, [token]);

  // Initial loads & re-fetches
  useEffect(() => {
    fetchJobsFromBackend();
  }, [fetchJobsFromBackend]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplicationsFromBackend();
    }
  }, [isAuthenticated, token, fetchApplicationsFromBackend]);

  useEffect(() => {
    localStorage.setItem('job_portal_saved', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Job Actions
  const handleToggleSaveJob = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      showNotification('Job removed from saved bookmarks.');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showNotification('Job bookmarked to your saved list!');
    }
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      setAuthModalConfig({ isOpen: true, mode: 'login' });
      showNotification('Please sign in or register to submit job applications.');
      return;
    }
    setSelectedJobForApply(job);
  };

  const handleSubmitApplication = async (appPayload) => {
    const authToken = token || localStorage.getItem('job_portal_token');
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(appPayload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplications(prev => [data.application, ...prev]);
      showNotification(`Application submitted successfully for ${data.application.jobTitle}!`);
    } catch (err) {
      // Fallback local update if API fails
      const fallbackApp = {
        id: 'app-' + Date.now(),
        jobId: appPayload.jobId,
        jobTitle: appPayload.jobTitle,
        company: appPayload.company || 'Company',
        applicantId: currentUser?.id,
        applicantName: currentUser?.name,
        applicantEmail: currentUser?.email,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        resumeName: appPayload.resumeName || 'Resume.pdf'
      };
      setApplications(prev => [fallbackApp, ...prev]);
      showNotification(`Application submitted successfully for ${appPayload.jobTitle}!`);
    }
  };

  const handleSaveJobPosting = async (jobData) => {
    const authToken = token || localStorage.getItem('job_portal_token');
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(jobData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create job');

      setJobs(prev => [data.job, ...prev.filter(j => j.id !== data.job.id)]);
      showNotification('Job opportunity published successfully to backend database!');
    } catch (err) {
      const existingIndex = jobs.findIndex(j => j.id === jobData.id);
      if (existingIndex >= 0) {
        const updated = [...jobs];
        updated[existingIndex] = jobData;
        setJobs(updated);
      } else {
        setJobs([jobData, ...jobs]);
      }
      showNotification('Job posting updated successfully!');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      const authToken = token || localStorage.getItem('job_portal_token');
      try {
        await fetch(`${API_BASE}/jobs/${jobId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (err) {
        console.error('Delete job API error:', err);
      }
      setJobs(jobs.filter(j => j.id !== jobId));
      showNotification('Job posting deleted.');
    }
  };

  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    const authToken = token || localStorage.getItem('job_portal_token');
    try {
      await fetch(`${API_BASE}/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Update app status API error:', err);
    }
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    showNotification(`Applicant status updated to '${newStatus}'`);
  };

  const handleNavigateToSearchWithFilter = (keyword, location, category) => {
    setInitialSearchState({ keyword, location, category });
    setActiveView('dashboard');
    setActiveCandidateTab('search');
  };

  const handleNavClick = (viewName) => {
    if (viewName === 'applications') {
      setActiveView('dashboard');
      setActiveCandidateTab('applications');
    } else if (viewName === 'saved') {
      setActiveView('dashboard');
      setActiveCandidateTab('saved');
    } else if (viewName === 'profile') {
      setActiveView('dashboard');
      setActiveCandidateTab('profile');
    } else {
      setActiveView(viewName);
    }
  };

  // Applications filtered for current user
  const userApplications = applications.filter(a => a.applicantId === currentUser?.id || a.applicantEmail === currentUser?.email);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar
        activeView={activeView}
        setActiveView={handleNavClick}
        onOpenAuthModal={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenPostJobModal={() => setPostJobConfig({ isOpen: true, initialJob: null })}
      />

      {/* Main View Router */}
      <main className="flex-grow-1">
        {activeView === 'home' && (
          <HomeView
            jobs={jobs}
            savedJobIds={savedJobIds}
            onToggleSave={handleToggleSaveJob}
            onViewDetails={(job) => setSelectedJobForDetail(job)}
            onApply={handleApplyClick}
            userApplications={userApplications}
            isEmployer={isEmployer}
            onNavigateToJobs={handleNavigateToSearchWithFilter}
            onOpenAuthModal={(mode) => setAuthModalConfig({ isOpen: true, mode })}
          />
        )}

        {activeView === 'dashboard' && (
          isEmployer ? (
            <EmployerDashboard
              jobs={jobs}
              applications={applications}
              onOpenPostJobModal={() => setPostJobConfig({ isOpen: true, initialJob: null })}
              onEditJob={(job) => setPostJobConfig({ isOpen: true, initialJob: job })}
              onDeleteJob={handleDeleteJob}
              onInspectApplicant={(app) => setSelectedApplicant(app)}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
              currentUser={currentUser}
            />
          ) : (
            <CandidateDashboard
              jobs={jobs}
              savedJobIds={savedJobIds}
              onToggleSave={handleToggleSaveJob}
              onViewDetails={(job) => setSelectedJobForDetail(job)}
              onApply={handleApplyClick}
              userApplications={userApplications}
              initialSearchState={initialSearchState}
              onShowNotification={showNotification}
              activeTab={activeCandidateTab}
              setActiveTab={setActiveCandidateTab}
              onSearchBackend={fetchJobsFromBackend}
            />
          )
        )}
      </main>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig({ isOpen: false, mode: 'login' })}
        onShowNotification={showNotification}
      />

      <JobDetailModal
        job={selectedJobForDetail}
        onClose={() => setSelectedJobForDetail(null)}
        onApply={handleApplyClick}
        hasApplied={userApplications.some(app => app.jobId === selectedJobForDetail?.id)}
        isEmployer={isEmployer}
      />

      <ApplyModal
        job={selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onSubmitApplication={handleSubmitApplication}
      />

      <PostJobModal
        isOpen={postJobConfig.isOpen}
        initialJob={postJobConfig.initialJob}
        onClose={() => setPostJobConfig({ isOpen: false, initialJob: null })}
        onSaveJob={handleSaveJobPosting}
      />

      <ApplicantModal
        application={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onUpdateStatus={handleUpdateApplicantStatus}
      />

      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
