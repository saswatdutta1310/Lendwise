import React, { useState } from 'react';
import { Radar, ArrowDownRight, ArrowRight, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const RefinanceRadar = () => {
  const simpleMode = useAuthStore((state) => state.simpleMode);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-r from-blue-500/10 to-transparent">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
            <Radar className={`w-6 h-6 ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {simpleMode ? "Better Loan Finder" : "Refinance Radar"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          {simpleMode ? "We scan for loans with lower interest rates." : "Continuously monitoring market rates against your active loans."}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center p-4 bg-muted/30 border border-border rounded-xl">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Current Rate</p>
            <p className="text-2xl font-bold text-foreground">10.5%</p>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Market Average</p>
            <p className="text-2xl font-bold text-green-500">8.9%</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Top Matches</h3>
          
          <div className="p-4 border border-green-500/30 bg-green-500/5 rounded-xl flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-foreground">SBI Bank</span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-600 text-[10px] font-bold uppercase rounded-full">Pre-approved</span>
              </div>
              <p className="text-sm text-muted-foreground">Save ~₹45,000 in interest</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-green-500">8.5%</p>
              <button className="text-xs font-medium text-primary hover:underline mt-1">Apply Now</button>
            </div>
          </div>
          
          <div className="p-4 border border-border rounded-xl flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground mb-1">Axis Bank</p>
              <p className="text-sm text-muted-foreground">Save ~₹32,000 in interest</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-foreground">8.8%</p>
              <button className="text-xs font-medium text-primary hover:underline mt-1">View Details</button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" /> {isScanning ? "Scanning Market..." : "Scan Market Again"}
        </button>
      </div>
    </div>
  );
};

export default RefinanceRadar;
