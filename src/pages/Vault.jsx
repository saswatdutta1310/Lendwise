import React from 'react';
import DocumentVault from '../components/DocumentVault.jsx';

const Vault = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Document Vault</h2>
        <p className="text-body-md text-secondary">All your financial documents, organized and secure.</p>
      </div>

      <div className="glass-card rounded-xl p-8">
        <DocumentVault />
      </div>
    </div>
  );
};

export default Vault;
