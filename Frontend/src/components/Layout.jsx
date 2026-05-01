import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

/* Material Icon helper */
const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/dashboard/ai', label: 'AI Copilot', icon: 'smart_toy' },
  { path: '/dashboard/upload', label: 'Upload', icon: 'upload_file' },
  { path: '/dashboard/vault', label: 'Vault', icon: 'account_balance_wallet' },
  { path: '/dashboard/simulator', label: 'Simulator', icon: 'model_training' },
  { path: '/dashboard/verify', label: 'Verify', icon: 'verified' },
  { path: '/dashboard/tax', label: 'Tax & Plans', icon: 'receipt_long' },
  { path: '/dashboard/settings', label: 'Settings', icon: 'settings' },
];

const Layout = () => {
  const location = useLocation();
  const { simpleMode, setSimpleMode } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans antialiased">

      {/* ═══ SIDEBAR ═══ */}
      <nav className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 border-r border-outline-variant/30 bg-surface/70 backdrop-blur-xl
        shadow-[50px_0_50px_-20px_rgba(92,139,110,0.05)]
        flex flex-col h-screen py-8 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-8 mb-10">
          <Link to="/" className="flex items-center gap-1.5">
            <Icon name="eco" filled className="text-primary text-2xl" />
            <h1 className="text-h2 font-bold text-primary tracking-tight">LendWise</h1>
          </Link>
          <p className="text-body-md text-secondary mt-0.5">Financial Sanctuary</p>
        </div>

        {/* Nav Items */}
        <ul className="flex-1 flex flex-col gap-1.5 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon name={item.icon} filled={isActive(item.path)} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Card */}
        <div className="px-8 mt-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm overflow-hidden">
            JS
          </div>
          <div>
            <p className="text-body-md font-semibold text-on-surface">John Smith</p>
            <p className="text-label-caps font-bold uppercase tracking-widest text-secondary">Premium</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary ml-auto ring-2 ring-primary/20" />
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Bar */}
        <header className="w-full h-20 bg-surface/50 backdrop-blur-md flex justify-between items-center px-4 md:px-10 z-10 sticky top-0 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-secondary hover:text-primary transition-colors">
              <Icon name="menu" />
            </button>
            <h2 className="text-h3 font-semibold text-on-surface flex items-center gap-2">
              {getGreeting()}, John <span className="text-2xl">☀️</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Simple Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <span className="text-label-caps font-bold uppercase tracking-widest text-secondary">Simple</span>
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${simpleMode ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${simpleMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {/* Notification Bell */}
            <button className="text-secondary hover:text-primary transition-colors relative">
              <Icon name="notifications" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* Consent Link */}
            <Link to="/consent" className="hidden lg:block text-label-caps font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-background relative">
          <div className="max-w-[1200px] mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
