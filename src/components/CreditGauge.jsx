import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const CreditGauge = () => {
  const simpleMode = useAuthStore((state) => state.simpleMode);
  const [score, setScore] = useState(0);
  const targetScore = 780; // Out of 900
  
  useEffect(() => {
    // Animate score on load
    const timer = setTimeout(() => {
      setScore(targetScore);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const percentage = (score / 900) * 100;
  
  // Calculate stroke color based on score
  const getStrokeColor = () => {
    if (score < 600) return '#ef4444'; // destructive
    if (score < 750) return '#f59e0b'; // amber
    return '#22c55e'; // green
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-bold text-foreground">
          {simpleMode ? "Financial Health" : "Credit Gauge"}
        </h2>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="relative w-48 h-24 overflow-hidden mb-2">
        {/* SVG Half Donut */}
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round" 
            className="text-muted opacity-30" 
          />
          {/* Foreground Animated Arc */}
          <motion.path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke={getStrokeColor()} 
            strokeWidth="12" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score Display */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <motion.span 
            className="text-4xl font-black text-foreground block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      
      <p className="text-sm font-medium" style={{ color: getStrokeColor() }}>
        {score >= 750 ? 'Excellent' : score >= 600 ? 'Good' : 'Needs Improvement'}
      </p>
      
      <div className="mt-6 w-full p-3 bg-muted/50 rounded-lg text-xs text-center text-muted-foreground">
        {simpleMode 
          ? "Paying on time keeps this score high!" 
          : "Your consistent EMI payments have boosted your score by 15 points this quarter."}
      </div>
    </div>
  );
};

export default CreditGauge;
