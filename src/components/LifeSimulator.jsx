import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Target, Zap, Clock, Coins } from 'lucide-react';

const LifeSimulator = () => {
  const [extraPayment, setExtraPayment] = useState(0);
  const simpleMode = useAuthStore((state) => state.simpleMode);
  
  // Mock data
  const baseEMI = 12500;
  const baseTermMonths = 60; // 5 years
  const baseTotalInterest = 120000;
  
  // Calculate simulated impact
  const totalPayment = baseEMI + extraPayment;
  // Very simplified amortization simulation logic for UI demonstration
  const reductionFactor = extraPayment / baseEMI;
  const newTermMonths = Math.max(12, Math.floor(baseTermMonths / (1 + reductionFactor * 0.8)));
  const monthsSaved = baseTermMonths - newTermMonths;
  const newTotalInterest = Math.floor(baseTotalInterest * (newTermMonths / baseTermMonths));
  const interestSaved = baseTotalInterest - newTotalInterest;
  
  const formatMoney = (val) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {simpleMode ? "See how extra money helps" : "Life Simulator"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Adjust the slider to see how prepayments impact your loan.
          </p>
        </div>
      </div>

      <div className="mb-8 p-6 bg-muted/30 border border-border rounded-xl">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {simpleMode ? "Extra money per month" : "Additional Monthly Payment"}
            </p>
            <p className="text-3xl font-bold text-primary">{formatMoney(extraPayment)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">New Total EMI</p>
            <p className="text-xl font-semibold text-foreground">{formatMoney(totalPayment)}</p>
          </div>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max="20000" 
          step="500" 
          value={extraPayment} 
          onChange={(e) => setExtraPayment(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹0</span>
          <span>₹20,000</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Saved Card */}
        <div className="p-5 border border-border rounded-xl flex items-start gap-4">
          <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full mt-1">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {simpleMode ? "Time saved" : "Time Reduced"}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {monthsSaved > 0 ? `${Math.floor(monthsSaved / 12)}y ${monthsSaved % 12}m` : '0 months'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Pay off in {Math.floor(newTermMonths / 12)}y {newTermMonths % 12}m
            </p>
          </div>
        </div>

        {/* Money Saved Card */}
        <div className="p-5 border border-border rounded-xl flex items-start gap-4">
          <div className="p-2 bg-green-500/10 text-green-500 rounded-full mt-1">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {simpleMode ? "Cost saved" : "Interest Saved"}
            </p>
            <p className="text-2xl font-bold text-green-500 mt-1">
              {formatMoney(interestSaved)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              New total: {formatMoney(newTotalInterest)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeSimulator;
