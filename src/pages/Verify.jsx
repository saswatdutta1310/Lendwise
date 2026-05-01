import React from 'react';
import HashVerifier from '../components/HashVerifier.jsx';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Verify = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Payment Integrity</h2>
        <p className="text-body-md text-secondary">Blockchain-backed verification for every payment.</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <HashVerifier />
      </div>

      {/* Recent Verifications */}
      <div className="glass-card rounded-xl p-8">
        <h3 className="text-h3 font-semibold text-on-surface mb-6">Recent Verifications</h3>
        <div className="flex flex-col gap-3">
          {[
            { date: 'Oct 5, 2025', amount: '₹15,000', loan: 'Home Loan', status: 'Verified' },
            { date: 'Sep 5, 2025', amount: '₹15,000', loan: 'Home Loan', status: 'Verified' },
            { date: 'Sep 1, 2025', amount: '₹12,500', loan: 'Auto Loan', status: 'Verified' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-outline-variant/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="verified" filled />
                </div>
                <div>
                  <p className="text-body-md font-semibold text-on-surface">{item.loan}</p>
                  <p className="text-label-caps font-bold uppercase tracking-widest text-secondary">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-body-md font-semibold text-on-surface">{item.amount}</p>
                <span className="text-label-caps font-bold uppercase tracking-widest text-primary">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Verify;
