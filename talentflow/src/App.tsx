import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HrDashboard from './pages/HrDashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Candidates from './pages/Candidates';
import CandidateProfile from './pages/CandidateProfile';
import AssessmentBuilder from './pages/AssessmentBuilder';
import Assessments from './pages/Assessments';
import AssessmentTake from './pages/AssessmentTake';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
        <Route path="/hr/jobs" element={<Jobs />} />
        <Route path="/hr/jobs/:jobId" element={<JobDetails />} />
        <Route path="/hr/candidates" element={<Candidates />} />
        <Route path="/hr/candidates/:id" element={<CandidateProfile />} />
        <Route path="/hr/assessments" element={<Assessments />} />
        <Route path="/hr/assessments/:jobId" element={<AssessmentBuilder />} />
        <Route path="/hr/assessments/take/:jobId" element={<AssessmentTake />} />
      </Routes>
    </Router>
  );
};

export default App;
