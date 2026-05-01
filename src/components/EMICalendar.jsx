import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';

const EMICalendar = () => {
  const simpleMode = useAuthStore((state) => state.simpleMode);
  
  // Dummy data representing days in a month
  const daysInMonth = 30;
  const today = 15;
  
  const [payments, setPayments] = useState([
    { day: 5, status: 'paid', amount: 12500 }, // paid
    { day: 15, status: 'due', amount: 12500 }, // due today
    { day: 25, status: 'scheduled', amount: 12500 } // upcoming
  ]);

  const handleMarkPaid = (dayIndex) => {
    setPayments(prev => prev.map(p => p.day === dayIndex ? { ...p, status: 'paid' } : p));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Paid" />;
      case 'due': return <Clock className="w-5 h-5 text-amber-500" aria-label="Due soon" />;
      case 'overdue': return <XCircle className="w-5 h-5 text-destructive" aria-label="Overdue" />;
      case 'scheduled': return <CalendarPlus className="w-5 h-5 text-blue-500" aria-label="Scheduled" />;
      default: return null;
    }
  };

  const getBgColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500/10 border-green-500/30';
      case 'due': return 'bg-amber-500/10 border-amber-500/30 ring-2 ring-amber-500';
      case 'overdue': return 'bg-destructive/10 border-destructive/30 ring-2 ring-destructive';
      case 'scheduled': return 'bg-blue-500/10 border-blue-500/30';
      default: return 'bg-card border-border';
    }
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {simpleMode ? "Payment Calendar" : "EMI Calendar"}
          </h2>
          <p className="text-sm text-muted-foreground">Track your repayment schedule</p>
        </div>
        <div className="flex gap-2 items-center bg-muted/50 p-1 rounded-lg">
          <button className="p-1 hover:bg-background rounded text-foreground"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-semibold px-2 text-sm">October 2029</span>
          <button className="p-1 hover:bg-background rounded text-foreground"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-bold uppercase text-muted-foreground tracking-wider py-2">
            {day}
          </div>
        ))}
        
        {/* Empty slots for starting day offset */}
        <div className="aspect-square"></div>
        <div className="aspect-square"></div>
        
        {/* Calendar Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const payment = payments.find(p => p.day === day);
          const isToday = day === today;
          
          return (
            <div 
              key={day} 
              className={`aspect-square rounded-lg border flex flex-col items-center justify-between p-1 transition-all ${getBgColor(payment?.status)} ${isToday ? 'font-bold' : ''}`}
            >
              <div className="w-full flex justify-between px-1">
                <span className={`text-sm ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                {payment && getStatusIcon(payment.status)}
              </div>
              {payment && (
                <div className="w-full text-center">
                  <p className="text-[10px] font-bold hidden sm:block">₹{(payment.amount / 1000).toFixed(1)}k</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-border pt-4 gap-4">
        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Paid</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> Due</span>
          <span className="flex items-center gap-1"><CalendarPlus className="w-4 h-4 text-blue-500" /> Scheduled</span>
        </div>
        
        {payments.find(p => p.status === 'due') && (
          <button 
            onClick={() => handleMarkPaid(today)}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm shadow-sm"
          >
            Mark Due as Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default EMICalendar;
