import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import StitchMap from '../components/StitchMap.jsx';
import EMICalendar from '../components/EMICalendar.jsx';
import CreditGauge from '../components/CreditGauge.jsx';

const Icon = ({ name, filled = false, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);

const Dashboard = () => {
  const { simpleMode, setSimpleMode } = useAuthStore();

  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* ═══ METRIC CARDS ═══ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Outstanding */}
        <div className="metric-card sage">
          <span className="label">Total Outstanding</span>
          <h3 className="text-h2 font-semibold text-on-surface">₹28,50,000</h3>
          <div className="flex items-center gap-2 mt-auto pt-3">
            <Icon name="trending_down" className="text-primary text-sm" />
            <span className="text-sm text-primary font-medium">
              {simpleMode ? 'Going down nicely' : '-₹12,500 this month'}
            </span>
          </div>
        </div>

        {/* Next EMI */}
        <div className="metric-card slate">
          <span className="label">Next EMI</span>
          <h3 className="text-h2 font-semibold text-on-surface">₹12,500</h3>
          <div className="flex items-center gap-2 mt-auto pt-3">
            <Icon name="schedule" className="text-secondary text-sm" />
            <span className="text-sm text-secondary">Due in 12 days</span>
          </div>
        </div>

        {/* Interest Saved */}
        <div className="metric-card sage bg-primary/5">
          <span className="label text-primary">Interest Saved</span>
          <h3 className="text-h2 font-semibold text-primary">₹45,230</h3>
          <div className="flex items-center gap-2 mt-auto pt-3">
            <Icon name="verified" className="text-primary text-sm" />
            <span className="text-sm text-primary font-medium">
              {simpleMode ? 'Great progress!' : 'vs. minimum payments'}
            </span>
          </div>
        </div>

        {/* Debt-Free Goal */}
        <div className="metric-card oat">
          <span className="label">Debt-Free Goal</span>
          <h3 className="text-h2 font-semibold text-on-surface">Oct 2029</h3>
          <div className="w-full bg-surface-variant h-2 rounded-full mt-auto overflow-hidden">
            <div className="bg-primary h-full rounded-full w-1/3 transition-all duration-1000" />
          </div>
        </div>
      </section>

      {/* ═══ STITCH MAP ═══ */}
      <section className="glass-card rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-h3 font-semibold text-on-surface">
            {simpleMode ? 'Your Money Flow' : 'Your Debt Flow — StitchMap'}
          </h3>
          <Link to="/dashboard/simulator" className="text-sm text-primary font-medium hover:underline">
            View Details →
          </Link>
        </div>
        <StitchMap />
      </section>

      {/* ═══ CREDIT GAUGE + EMI CALENDAR ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Health */}
        <div className="glass-card rounded-xl p-8">
          <h3 className="text-h3 font-semibold text-on-surface mb-4">
            {simpleMode ? 'Credit Score' : 'Credit Health'}
          </h3>
          <CreditGauge />
        </div>

        {/* EMI Calendar */}
        <div className="glass-card rounded-xl p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-h3 font-semibold text-on-surface">Upcoming Payments</h3>
            <span className="text-body-md text-secondary">October 2025</span>
          </div>
          <EMICalendar />
        </div>
      </section>

      {/* ═══ AI INSIGHT BANNER ═══ */}
      <section className="glass-card rounded-xl p-6 bg-primary/5 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon name="tips_and_updates" />
        </div>
        <div className="flex-1">
          <p className="text-body-md text-on-surface">
            <strong className="font-semibold text-primary">
              {simpleMode ? 'Quick Tip:' : 'LendWise Insight:'}
            </strong>{' '}
            {simpleMode
              ? "You're doing great! Adding ₹1,000 extra this month would finish your loan 2 months earlier and save ₹8,400."
              : "Your principal burn rate is optimal. Injecting ₹1,000 this cycle reduces amortization by 2.4 periods, saving ₹8,400 in compounded interest."}
          </p>
        </div>
        <Link to="/dashboard/ai" className="shrink-0 btn-primary !text-sm !px-5 !py-2.5">
          Ask AI
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
