import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, IndianRupee, Landmark, CalendarCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

// Helper component for SVG nodes
const MapNode = ({ x, y, icon: Icon, label, value, colorClass, onClick, ariaLabel }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g 
        onClick={onClick}
        className="cursor-pointer group outline-none"
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick();
          }
        }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      >
        <circle r="32" className={`fill-white stroke-2 ${colorClass} transition-colors hover:fill-surface-dim`} />
        <foreignObject x="-20" y="-20" width="40" height="40">
          <div className="w-full h-full flex items-center justify-center text-on-surface">
            <Icon className="w-5 h-5" />
          </div>
        </foreignObject>
        <text y="50" textAnchor="middle" className="text-sm font-medium fill-on-surface">{label}</text>
        <text y="70" textAnchor="middle" className="text-lg font-bold fill-on-surface">{value}</text>
      </motion.g>
    </g>
  );
};

const StitchMap = ({ 
  lender = "HDFC Bank", 
  principal = 450000, 
  interest = 120000, 
  emi = 12500,
  currency = "₹"
}) => {
  const shouldReduceMotion = useReducedMotion();
  const simpleMode = useAuthStore((state) => state.simpleMode);
  
  // Format numbers to currency
  const formatMoney = (amount) => `${currency}${amount.toLocaleString()}`;
  
  // Path animation definition
  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.2 }
      }
    }
  };

  // Skip animation if user prefers reduced motion
  const pathAnimation = shouldReduceMotion ? { hidden: { opacity: 1, pathLength: 1 }, visible: { opacity: 1, pathLength: 1 } } : drawLine;

  const handleNodeClick = (nodeType) => {
    // In a real app, this would open a side panel or trigger a toast
    console.log(`Clicked on ${nodeType} node`);
  };

  return (
    <div className="w-full h-[350px] bg-surface-lowest rounded-xl border border-surface-variant shadow-sm flex items-center justify-center overflow-hidden relative">
      <div className="absolute top-4 left-6 text-xl font-bold text-on-surface">
        Loan Thread: {lender}
      </div>
      
      {/* SVG Canvas */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 400" 
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Loan flow diagram for ${lender}: ${formatMoney(principal)} principal, ${formatMoney(interest)} interest, ${formatMoney(emi)} monthly payment`}
      >
        <defs>
          <linearGradient id="principalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#37654b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#37654b" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="interestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <g className="threads">
          {/* Main thread to Principal */}
          <motion.path 
            d="M 150 200 C 250 200, 300 100, 400 100" 
            fill="transparent" 
            stroke="url(#principalGrad)" 
            strokeWidth="8"
            strokeLinecap="round"
            variants={pathAnimation}
            initial="hidden"
            animate="visible"
          />
          
          {/* Main thread to Interest */}
          <motion.path 
            d="M 150 200 C 250 200, 300 300, 400 300" 
            fill="transparent" 
            stroke="url(#interestGrad)" 
            strokeWidth="8"
            strokeLinecap="round"
            variants={pathAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          />

          {/* Merge to EMI */}
          <motion.path 
            d="M 400 100 C 500 100, 550 200, 650 200" 
            fill="transparent" 
            stroke="url(#principalGrad)" 
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 5"
            variants={pathAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          />
          <motion.path 
            d="M 400 300 C 500 300, 550 200, 650 200" 
            fill="transparent" 
            stroke="url(#interestGrad)" 
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 5"
            variants={pathAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          />
        </g>

        {/* Nodes */}
        <MapNode 
          x={150} y={200} 
          icon={Building2} 
          label="Lender" 
          value={lender}
          colorClass="stroke-outline"
          ariaLabel={`Lender node: ${lender}`}
          onClick={() => handleNodeClick('lender')}
        />
        
        <MapNode 
          x={400} y={100} 
          icon={Landmark} 
          label={simpleMode ? "Your loan amount" : "Principal"} 
          value={formatMoney(principal)}
          colorClass="stroke-primary"
          ariaLabel={`Principal: ${formatMoney(principal)} — Click to see optimisation tips.`}
          onClick={() => handleNodeClick('principal')}
        />
        
        <MapNode 
          x={400} y={300} 
          icon={IndianRupee} 
          label={simpleMode ? "Borrowing cost" : "Total Interest"} 
          value={formatMoney(interest)}
          colorClass="stroke-amber-500"
          ariaLabel={`Interest: ${formatMoney(interest)} — Click to see ways to reduce borrowing cost.`}
          onClick={() => handleNodeClick('interest')}
        />
        
        <MapNode 
          x={650} y={200} 
          icon={CalendarCheck} 
          label={simpleMode ? "Monthly payment" : "Monthly EMI"} 
          value={formatMoney(emi)}
          colorClass="stroke-green-500"
          ariaLabel={`Monthly EMI: ${formatMoney(emi)} — Your required monthly payment.`}
          onClick={() => handleNodeClick('emi')}
        />
      </svg>
    </div>
  );
};

export default StitchMap;
