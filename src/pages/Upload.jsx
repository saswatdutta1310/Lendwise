import React from 'react';
import UploadZone from '../components/UploadZone.jsx';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Upload = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Upload Loan Statement</h2>
        <p className="text-body-md text-secondary">Drop your documents and we'll extract every detail automatically.</p>
      </div>

      <div className="glass-card rounded-xl p-8 relative">
        {/* Low Bandwidth Badge */}
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-label-caps font-bold uppercase tracking-widest">
            <Icon name="signal_cellular_alt" className="text-xs" />
            Low Bandwidth Mode
          </span>
        </div>

        <UploadZone />

        {/* Info Pills */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-outline-variant/30">
          {[
            { icon: '🔒', label: 'Encrypted' },
            { icon: '⚡', label: 'Auto-extract' },
            { icon: '🗑️', label: 'Deleted after processing' },
          ].map((pill) => (
            <span key={pill.label} className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full text-sm text-secondary">
              {pill.icon} {pill.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload;
