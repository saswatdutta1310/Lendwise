import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import Layout from './components/Layout.jsx';

// Lazy loaded pages
const Landing = React.lazy(() => import('./pages/Landing.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const Register = React.lazy(() => import('./pages/Register.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const AI = React.lazy(() => import('./pages/AI.jsx'));
const Upload = React.lazy(() => import('./pages/Upload.jsx'));
const Simulator = React.lazy(() => import('./pages/Simulator.jsx'));
const Verify = React.lazy(() => import('./pages/Verify.jsx'));
const Tax = React.lazy(() => import('./pages/Tax.jsx'));
const Vault = React.lazy(() => import('./pages/Vault.jsx'));
const Settings = React.lazy(() => import('./pages/Settings.jsx'));
const Consent = React.lazy(() => import('./pages/Consent.jsx'));

// Fallback loader
const Loader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background font-sans">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-secondary">Loading your sanctuary...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/consent" element={<PrivateRoute><Consent /></PrivateRoute>} />
          
          <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="ai" element={<AI />} />
            <Route path="upload" element={<Upload />} />
            <Route path="vault" element={<Vault />} />
            <Route path="simulator" element={<Simulator />} />
            <Route path="verify" element={<Verify />} />
            <Route path="tax" element={<Tax />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
