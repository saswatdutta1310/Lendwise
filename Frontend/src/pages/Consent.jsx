import React from 'react';
import ConsentManager from '../components/ConsentManager.jsx';
import { useNavigate } from 'react-router-dom';

const Consent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans p-6 md:p-10 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-h1 font-bold text-on-surface mb-2">Privacy & Consent</h1>
          <p className="text-body-lg text-secondary">Your data, your rules. DPDP & GDPR compliant.</p>
        </div>
        <div className="glass-card rounded-xl p-8">
          <ConsentManager onComplete={() => navigate('/dashboard', { replace: true })} />
        </div>
      </div>
    </div>
  );
};

export default Consent;
