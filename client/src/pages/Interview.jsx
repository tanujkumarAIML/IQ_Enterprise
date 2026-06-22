import React from "react";
import { Navigate } from "react-router-dom";

// This page has been superseded by InterviewSetup + InterviewPage.
// Redirect to setup for backward compatibility.
const Interview = () => <Navigate to="/interview" replace />;
export default Interview;
