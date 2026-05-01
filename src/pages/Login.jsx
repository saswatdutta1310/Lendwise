import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ user: { email, name: 'John Smith' }, token: 'dummy-token' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-tertiary-fixed/30 rounded-full blur-[120px] mix-blend-multiply" />

      <div className="glass-card rounded-2xl p-10 w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 justify-center mb-8">
          <Icon name="eco" filled className="text-primary text-3xl" />
          <span className="font-bold text-2xl text-primary tracking-tight">LendWise</span>
        </Link>

        <h2 className="text-h2 font-semibold text-on-surface text-center mb-2">Welcome back</h2>
        <p className="text-body-md text-secondary text-center mb-8">Sign in to your financial sanctuary</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
