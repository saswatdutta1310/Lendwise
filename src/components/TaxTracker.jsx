import React, { useState } from 'react';
import { Map, HelpCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const TaxTracker = () => {
  const jurisdiction = useAuthStore((state) => state.jurisdiction); // e.g., 'global', 'usa', 'uk', 'india'
  const setJurisdiction = useAuthStore((state) => state.setJurisdiction);
  const [income, setIncome] = useState(60000);

  const formatMoney = (val, cur = "$") => `${cur}${val.toLocaleString()}`;

  // IDR Plan mockup
  const renderUSA = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">Compare Income-Driven Repayment (IDR) plans based on your income.</p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-primary bg-primary/5 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Recommended</div>
          <h3 className="font-bold text-foreground text-lg">SAVE Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">Saving on a Valuable Education</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Payment</p>
              <p className="text-xl font-bold text-primary">{formatMoney(Math.floor(income * 0.05 / 12))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Forgiveness</p>
              <p className="text-xl font-bold text-foreground">10-20 yrs</p>
            </div>
          </div>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply for SAVE</button>
        </div>

        <div className="border border-border bg-card rounded-xl p-5">
          <h3 className="font-bold text-foreground text-lg">PAYE Plan</h3>
          <p className="text-sm text-muted-foreground mb-4">Pay As You Earn</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Payment</p>
              <p className="text-xl font-bold text-foreground">{formatMoney(Math.floor(income * 0.1 / 12))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Forgiveness</p>
              <p className="text-xl font-bold text-foreground">20 yrs</p>
            </div>
          </div>
          <button className="w-full py-2 bg-muted text-foreground rounded-lg text-sm font-medium">View Details</button>
        </div>
      </div>
    </div>
  );

  // UK Plan mockup
  const renderUK = () => {
    const threshold = 27295; // Plan 2 example
    const repayment = income > threshold ? Math.floor((income - threshold) * 0.09 / 12) : 0;
    
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">Plan 2</span>
          <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-medium rounded-full border border-border">Change Plan</span>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">Your Expected Repayment</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-foreground">£{repayment}</span>
            <span className="text-muted-foreground mb-1">/ month</span>
          </div>
          
          {repayment === 0 ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 text-sm flex items-start gap-2">
              <HelpCircle className="w-5 h-5 shrink-0" />
              <p>Your income is below the £{threshold.toLocaleString()} threshold. You currently owe £0 per month.</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">9% of your income over £27,295 is deducted automatically via PAYE.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Map className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Regional Tax & Plans</h2>
        </div>
        
        <select 
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          className="bg-background border border-border text-foreground text-sm rounded-lg p-2 focus:ring-primary focus:border-primary"
        >
          <option value="usa">USA (IDR / PSLF)</option>
          <option value="uk">UK (Student Finance)</option>
          <option value="india">India (80E)</option>
          <option value="global">Global (Standard)</option>
        </select>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Your Annual Income</label>
          <input 
            type="range" 
            min="20000" max="150000" step="1000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="mt-2 text-primary font-bold text-lg">
            {jurisdiction === 'uk' ? '£' : '$'}{income.toLocaleString()}
          </div>
        </div>

        {jurisdiction === 'usa' ? renderUSA() : 
         jurisdiction === 'uk' ? renderUK() : 
         <div className="text-center py-8 text-muted-foreground">
           Select USA or UK to see jurisdiction-specific calculators (India 80E coming soon).
         </div>}
      </div>
    </div>
  );
};

export default TaxTracker;
