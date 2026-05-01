import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const ConsentCard = ({ 
  id, 
  title, 
  description, 
  required, 
  value, 
  onChange, 
  details 
}) => {
  const [expanded, setExpanded] = useState(false);
  const simpleMode = useAuthStore((state) => state.simpleMode);

  return (
    <div className="bg-card border border-border rounded-xl mb-4 overflow-hidden shadow-sm transition-all hover:border-primary/50">
      <div className="p-5 flex items-start gap-4 cursor-pointer" onClick={() => !required && onChange(!value)}>
        <div className="pt-1">
          {required ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : value ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-foreground text-lg" id={`consent-title-${id}`}>{title}</h3>
            {required && <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">Required</span>}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            {description}
          </p>
          <button 
            type="button"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:underline focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            aria-expanded={expanded}
            aria-controls={`consent-details-${id}`}
          >
            <Info className="w-4 h-4" />
            {expanded ? 'Hide details' : 'Learn more'}
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {!required && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                aria-labelledby={`consent-title-${id}`}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            id={`consent-details-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-muted/30 px-5 pb-5 pt-0 border-t border-border"
          >
            <div className="pt-4 grid gap-3 text-sm text-muted-foreground">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-semibold text-foreground">What we use:</span>
                <span>{details.what}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-semibold text-foreground">Why we need it:</span>
                <span>{details.why}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-semibold text-foreground">Retention:</span>
                <span>{details.retention}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-semibold text-foreground">Who sees it:</span>
                <span>{details.who}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConsentManager = ({ onComplete }) => {
  const [consents, setConsents] = useState({
    ocr: true, // Always required
    ai: false,
    blockchain: false,
    partner: false,
    marketing: false
  });

  const simpleMode = useAuthStore((state) => state.simpleMode);

  const handleToggle = (key, value) => {
    setConsents(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChoices = () => {
    // API Call goes here: POST /api/v1/consent/grant
    console.log("Saving consents:", consents);
    if (onComplete) onComplete();
  };

  const purposes = [
    {
      id: 'ocr',
      title: 'Document Processing (OCR)',
      description: simpleMode ? 'We need to read your loan documents to show you your loan details.' : 'Required to extract data from your uploaded PDF loan statements and structure them into your dashboard.',
      required: true,
      details: {
        what: 'Loan statements, PDFs, images',
        why: 'To automatically parse principal, interest rate, and EMIs.',
        retention: 'Processed in memory, stored securely for 30 days.',
        who: 'Internal processing engines only.'
      }
    },
    {
      id: 'ai',
      title: 'AI Copilot Analysis',
      description: simpleMode ? 'Allow our smart assistant to give you personalized advice on paying off debt faster.' : 'Allow the AI agent to analyze your financial health and provide tailored repayment strategies.',
      required: false,
      details: {
        what: 'Aggregated loan metrics and repayment history',
        why: 'To generate personalized savings strategies via Large Language Models.',
        retention: 'Retained for active sessions, anonymized for training (if opted-in).',
        who: 'Securely processed by our enterprise AI provider.'
      }
    },
    {
      id: 'blockchain',
      title: 'Blockchain Verification',
      description: simpleMode ? 'Create a tamper-proof digital seal of your repayment history.' : 'Generate an immutable cryptographic hash of your repayment logs for verifiable trust.',
      required: false,
      details: {
        what: 'Repayment timestamps and amounts (anonymized hash)',
        why: 'To prove to banks that you have consistently paid on time.',
        retention: 'Permanent (on blockchain), but cannot be reverse-engineered.',
        who: 'Public ledger (zero personal data exposed).'
      }
    },
    {
      id: 'partner',
      title: 'Partner Sharing for Refinancing',
      description: simpleMode ? 'Let banks see your good habits so they can offer you lower interest rates.' : 'Share your verified repayment profile with lending partners to fetch live refinancing offers.',
      required: false,
      details: {
        what: 'Credit score, verified repayment streak, outstanding principal',
        why: 'To negotiate better interest rates on your behalf.',
        retention: 'Shared momentarily via secure API, partners retain per their own policies.',
        who: 'Verified lending institutions on our network.'
      }
    },
    {
      id: 'marketing',
      title: 'Marketing & Notifications',
      description: simpleMode ? 'Get helpful reminders and tips to save money on your loans.' : 'Receive promotional offers, feature updates, and educational financial content.',
      required: false,
      details: {
        what: 'Email address, phone number',
        why: 'To keep you informed about new ways to save.',
        retention: 'Until you unsubscribe.',
        who: 'Internal marketing teams and certified delivery partners.'
      }
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Your Data, Your Rules</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Before we help you conquer your debt, we need to agree on how we handle your information. We believe in absolute transparency.
        </p>
      </div>

      <div className="space-y-2 mb-10">
        {purposes.map(purpose => (
          <ConsentCard 
            key={purpose.id}
            {...purpose}
            value={consents[purpose.id]}
            onChange={(val) => handleToggle(purpose.id, val)}
          />
        ))}
      </div>

      <div className="sticky bottom-4 bg-background/80 backdrop-blur-lg p-4 rounded-xl border border-border shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          You can change these preferences at any time in Settings {">"} Privacy.
        </p>
        <button 
          onClick={handleSaveChoices}
          className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save My Choices
        </button>
      </div>
    </div>
  );
};

export default ConsentManager;
