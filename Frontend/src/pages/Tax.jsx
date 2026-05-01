import React from 'react';
import TaxTracker from '../components/TaxTracker.jsx';

const Tax = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Tax & Plans</h2>
        <p className="text-body-md text-secondary">Jurisdiction-aware tax relief and repayment plan comparisons.</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <TaxTracker />
      </div>
    </div>
  );
};

export default Tax;
