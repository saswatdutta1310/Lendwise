import React from 'react';
import AICopilot from '../components/AICopilot.jsx';

const AI = () => {
  return (
    <div className="flex flex-col gap-8 pb-10 h-full">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">AI Copilot</h2>
        <p className="text-body-md text-secondary">Your personal financial guide. Ask anything.</p>
      </div>

      <div className="glass-card rounded-xl p-6 flex-1 min-h-[500px]">
        <AICopilot />
      </div>
    </div>
  );
};

export default AI;
