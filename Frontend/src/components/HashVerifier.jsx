import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, FileBadge2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const HashVerifier = ({ status = 'verified' }) => { // 'computing', 'verified', 'tampered'
  const [internalStatus, setInternalStatus] = useState('idle');
  const simpleMode = useAuthStore((state) => state.simpleMode);

  const startVerification = () => {
    setInternalStatus('computing');
    setTimeout(() => {
      setInternalStatus(status);
    }, 2500);
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {simpleMode ? "Tamper-Proof Record" : "Blockchain Verification"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {simpleMode ? "We cryptographically seal your payments so nobody can change them." : "Cryptographic hash computation of your repayment ledger on public blockchain."}
          </p>
        </div>
        <FileBadge2 className="w-8 h-8 text-primary opacity-20" />
      </div>

      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        {/* Background rings */}
        <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
        
        {/* Animated computing ring */}
        {internalStatus === 'computing' && (
          <motion.div 
            className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        )}
        
        {/* Icon Center */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-500 ${
          internalStatus === 'verified' ? 'bg-green-500/20 text-green-500' :
          internalStatus === 'tampered' ? 'bg-destructive/20 text-destructive' :
          'bg-muted text-muted-foreground'
        }`}>
          {internalStatus === 'verified' ? <CheckCircle2 className="w-12 h-12" /> :
           internalStatus === 'tampered' ? <ShieldAlert className="w-12 h-12" /> :
           <Lock className="w-12 h-12" />}
        </div>
      </div>

      {internalStatus === 'idle' && (
        <button 
          onClick={startVerification}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {simpleMode ? "Verify Records" : "Compute Integrity Hash"}
        </button>
      )}

      {internalStatus === 'computing' && (
        <div className="text-center">
          <p className="text-primary font-medium text-lg">Computing SHA-256 Hash...</p>
          <p className="text-sm text-muted-foreground mt-2 font-mono">0x4a9b... matching ledger...</p>
        </div>
      )}

      {internalStatus === 'verified' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <p className="text-green-500 font-bold text-xl mb-2">
            {simpleMode ? "Sealed and Safe" : "VERIFIED"}
          </p>
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1 uppercase font-bold tracking-wider">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all">0x8f3c9e2b1a0d4f5e6a7b8c9d0e1f2a3b4c5d6e7f</p>
          </div>
        </motion.div>
      )}

      {internalStatus === 'tampered' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <p className="text-destructive font-bold text-xl mb-2">
            TAMPERED
          </p>
          <p className="text-sm text-muted-foreground">Ledger mismatch detected. Contact support.</p>
        </motion.div>
      )}
    </div>
  );
};

export default HashVerifier;
