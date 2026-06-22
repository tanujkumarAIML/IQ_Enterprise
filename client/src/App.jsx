import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home             from "./pages/Home";
import Auth             from "./pages/Auth";
import Dashboard        from "./pages/Dashboard";
import Profile          from "./pages/Profile";
import InterviewSetup   from "./pages/InterviewSetup";
import InterviewPage    from "./pages/InterviewPage";
import InterviewReport  from "./pages/InterviewReport";
import InterviewHistory from "./pages/InterviewHistory";
import Resume           from "./pages/Resume";
import Chatbot          from "./pages/Chatbot";
import Settings         from "./pages/Settings";
import AdminPanel       from "./pages/AdminPanel";
import NotFound         from "./pages/NotFound";

import { Loader } from "./components/common/index.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!["admin","superadmin"].includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => (
  <Routes>
    <Route path="/"             element={<Home />} />
    <Route path="/auth"         element={<PublicRoute><Auth /></PublicRoute>} />
    <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/profile"      element={<PrivateRoute><Profile /></PrivateRoute>} />
    <Route path="/interview"    element={<PrivateRoute><InterviewSetup /></PrivateRoute>} />
    <Route path="/interview/:id" element={<PrivateRoute><InterviewPage /></PrivateRoute>} />
    <Route path="/report/:id"   element={<PrivateRoute><InterviewReport /></PrivateRoute>} />
    <Route path="/history"      element={<PrivateRoute><InterviewHistory /></PrivateRoute>} />
    <Route path="/resume"       element={<PrivateRoute><Resume /></PrivateRoute>} />
    <Route path="/chatbot"      element={<PrivateRoute><Chatbot /></PrivateRoute>} />
    <Route path="/settings"     element={<PrivateRoute><Settings /></PrivateRoute>} />
    <Route path="/admin/*"      element={<AdminRoute><AdminPanel /></AdminRoute>} />
    <Route path="*"             element={<NotFound />} />
  </Routes>
);

export default App;
