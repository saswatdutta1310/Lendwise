import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ user: { email, name: name || 'New User' }, token: 'dummy-token' });
    navigate('/consent', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[15%] right-[15%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply" />
      <div className="absolute bottom-[15%] left-[15%] w-[450px] h-[450px] bg-error-container/20 rounded-full blur-[100px] mix-blend-multiply" />

      <div className="glass-card rounded-2xl p-10 w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-1.5 justify-center mb-8">
          <Icon name="eco" filled className="text-primary text-3xl" />
          <span className="font-bold text-2xl text-primary tracking-tight">LendWise</span>
        </Link>

        <h2 className="text-h2 font-semibold text-on-surface text-center mb-2">Create your sanctuary</h2>
        <p className="text-body-md text-secondary text-center mb-8">Start your journey toward financial peace</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="John Smith" />
          </div>
          <div>
            <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full mt-2">
            Get Started Free
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
