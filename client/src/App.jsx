import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import InterviewRoom from "./pages/InterviewRoom";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";

// New Modular Pages
import Home from "./pages/Home";
import MockInterview from "./pages/MockInterview";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Settings from "./pages/Settings";
import UploadResume from "./pages/UploadResume";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Landing /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /></>} />

        {/* Dashboard Routes (Unified under Layout) */}
        <Route path="/dashboard" element={<Layout><Home /></Layout>} />
        <Route path="/mock-interview" element={<Layout><MockInterview /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/resume-analyzer" element={<Layout><ResumeAnalyzer /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/uploadresume" element={<Layout><UploadResume /></Layout>} />

        {/* Special Pages (Focus mode) */}
        <Route path="/interviewroom" element={<InterviewRoom />} />
        <Route path="/results" element={<Layout><Results /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;