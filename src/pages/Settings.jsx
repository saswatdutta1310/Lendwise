import React from 'react';
import WhatsAppConnect from '../components/WhatsAppConnect.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Settings = () => {
  const { simpleMode, setSimpleMode, language, setLanguage } = useAuthStore();
  const toggleSimpleMode = () => setSimpleMode(!simpleMode);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h2 className="text-h2 font-semibold text-on-surface mb-1">Settings</h2>
        <p className="text-body-md text-secondary">Manage your account preferences, accessibility, and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Accessibility Card */}
          <div className="glass-card rounded-xl p-8">
            <h3 className="text-h3 font-semibold text-on-surface mb-6 flex items-center gap-2">
              <Icon name="accessibility_new" filled className="text-primary" /> Accessibility
            </h3>
            
            <div className="flex items-center justify-between py-4 border-b border-outline-variant/30">
              <div>
                <p className="text-body-md font-semibold text-on-surface">Simple Mode</p>
                <p className="text-sm text-secondary">Remove financial jargon across the app</p>
              </div>
              <button
                onClick={toggleSimpleMode}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${simpleMode ? 'bg-primary' : 'bg-surface-variant'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${simpleMode ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-body-md font-semibold text-on-surface">Reduced Motion</p>
                <p className="text-sm text-secondary">Minimize animations</p>
              </div>
              <button className="w-12 h-6 rounded-full relative transition-colors duration-300 bg-surface-variant">
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Localization Card */}
          <div className="glass-card rounded-xl p-8">
            <h3 className="text-h3 font-semibold text-on-surface mb-6 flex items-center gap-2">
              <Icon name="translate" filled className="text-primary" /> Localization
            </h3>
            <div className="space-y-3">
              <label className="text-label-caps font-bold uppercase tracking-widest text-secondary block">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl px-5 py-3 text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="hi">हिन्दी (IN)</option>
                <option value="zh">中文 (CN)</option>
                <option value="te">తెలుగు (IN)</option>
                <option value="mr">मराठी (IN)</option>
                <option value="bn">বাংলা (IN)</option>
                <option value="sw">Kiswahili (KE)</option>
              </select>
              <p className="text-sm text-secondary">Changes apply instantly to all text and AI interactions.</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <WhatsAppConnect />

          {/* Notifications Card */}
          <div className="glass-card rounded-xl p-8">
            <h3 className="text-h3 font-semibold text-on-surface mb-6 flex items-center gap-2">
              <Icon name="notifications" filled className="text-primary" /> Notifications
            </h3>
            <div className="space-y-5">
              {[
                { label: 'EMI Reminders', desc: 'Get notified 3 days before due date', checked: true },
                { label: 'Interest Rate Alerts', desc: 'Notify when market rates drop', checked: true },
                { label: 'AI Insights', desc: 'Weekly tips from your AI Copilot', checked: true },
                { label: 'Marketing', desc: 'Promotional offers (managed in Consent)', checked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-start gap-4 cursor-pointer group">
                  <div className="mt-0.5">
                    <input 
                      type="checkbox" 
                      defaultChecked={item.checked}
                      className="w-5 h-5 rounded-lg border-2 border-outline-variant text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">{item.label}</p>
                    <p className="text-sm text-secondary">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
