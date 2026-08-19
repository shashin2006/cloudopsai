/**
 * CloudOpsAI - Main Application Routing & Context Shell
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { LoadingSpinner } from "./components/common/LoadingSpinner.jsx";

// Pages
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Services } from "./pages/Services.jsx";
import { Logs } from "./pages/Logs.jsx";
import { Incidents } from "./pages/Incidents.jsx";
import { IncidentDetails } from "./pages/IncidentDetails.jsx";
import { AIInsights } from "./pages/AIInsights.jsx";
import { Reports } from "./pages/Reports.jsx";
import { Settings } from "./pages/Settings.jsx";

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Authenticating SRE session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Operations Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="services" element={<Services />} />
              <Route path="logs" element={<Logs />} />
              <Route path="incidents" element={<Incidents />} />
              <Route path="incidents/:id" element={<IncidentDetails />} />
              <Route path="ai-insights" element={<AIInsights />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
