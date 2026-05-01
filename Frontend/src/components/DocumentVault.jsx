import React, { useState } from 'react';
import { Shield, FileText, Download, Trash2, Eye, Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const DocumentVault = () => {
  const simpleMode = useAuthStore((state) => state.simpleMode);
  
  const [documents, setDocuments] = useState([
    { id: 1, name: 'HDFC_Statement_Oct.pdf', date: 'Oct 15, 2029', size: '2.4 MB', type: 'statement' },
    { id: 2, name: 'Loan_Sanction_Letter.pdf', date: 'Jan 10, 2028', size: '1.1 MB', type: 'sanction' },
    { id: 3, name: 'Tax_Certificate_2028.pdf', date: 'Apr 05, 2029', size: '0.8 MB', type: 'tax' }
  ]);

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {simpleMode ? "Safe Documents" : "Document Vault"}
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3" /> End-to-end encrypted
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">
          Upload New
        </button>
      </div>

      <div className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground">
              <th className="font-medium p-4 pl-6">Document Name</th>
              <th className="font-medium p-4 hidden sm:table-cell">Date Added</th>
              <th className="font-medium p-4 hidden md:table-cell">Size</th>
              <th className="font-medium p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary opacity-70" />
                    <span className="font-medium text-foreground">{doc.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{doc.date}</td>
                <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{doc.size}</td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" aria-label="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" aria-label="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentVault;
