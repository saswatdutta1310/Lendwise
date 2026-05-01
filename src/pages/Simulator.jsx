import React from 'react';
import LifeSimulator from '../components/LifeSimulator.jsx';
import RefinanceRadar from '../components/RefinanceRadar.jsx';

const Simulator = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Repayment Simulator</h2>
        <p className="text-body-md text-secondary">See how extra payments can transform your debt journey.</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <LifeSimulator />
      </div>

      <div className="glass-card rounded-xl p-8">
        <h3 className="text-h3 font-semibold text-on-surface mb-4">Refinance Radar</h3>
        <p className="text-body-md text-secondary mb-6">Scan the market. Find better rates. Save thousands.</p>
        <RefinanceRadar />
      </div>
    </div>
  );
};

export default Simulator;
