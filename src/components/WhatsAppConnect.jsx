import React, { useState } from 'react';
import { MessageCircle, Check, X, Smartphone } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const WhatsAppConnect = () => {
  const [step, setStep] = useState('input'); // input, otp, connected
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const simpleMode = useAuthStore((state) => state.simpleMode);

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) setStep('connected');
  };

  const handleDisconnect = () => {
    setStep('input');
    setPhone('');
    setOtp('');
  };

  return (
    <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg">
          <MessageCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">WhatsApp Connect</h2>
          <p className="text-sm text-muted-foreground">
            {simpleMode ? "Get reminders on WhatsApp" : "Receive instant alerts and AI notifications."}
          </p>
        </div>
      </div>

      {step === 'input' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
            <div className="flex items-center border border-input rounded-lg bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden">
              <span className="pl-3 pr-2 text-muted-foreground border-r border-input bg-muted/50">+91</span>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                placeholder="9876543210"
                className="w-full p-2.5 bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleSendOtp}
            disabled={phone.length < 10}
            className="w-full py-2.5 bg-[#25D366] text-white font-medium rounded-lg disabled:opacity-50 hover:bg-[#20b858] transition-colors flex justify-center items-center gap-2"
          >
            <Smartphone className="w-4 h-4" /> Send OTP
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Enter OTP</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={4}
              placeholder="••••"
              className="w-full p-2.5 text-center text-xl tracking-[1em] border border-input rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Code sent via WhatsApp to +91 {phone}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setStep('input')}
              className="w-1/3 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleVerifyOtp}
              disabled={otp.length < 4}
              className="w-2/3 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
            >
              <Check className="w-4 h-4" /> Verify & Connect
            </button>
          </div>
        </div>
      )}

      {step === 'connected' && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 bg-[#25D366]/20 rounded-full flex items-center justify-center mb-4 text-[#25D366]">
            <Check className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold text-foreground">Connected successfully!</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6 text-center">
            You'll now receive alerts on +91 {phone.substring(0, 5)}...
          </p>
          <button 
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            <X className="w-4 h-4" /> Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsAppConnect;
