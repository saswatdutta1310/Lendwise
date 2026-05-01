import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore.js';

/* ===== SVG Wave Divider ===== */
const WaveDivider = ({ flip = false, color = '#f3f4f0' }) => (
  <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
      <path d="M0 48H1440V0C1440 0 1140 48 720 48C300 48 0 0 0 0V48Z" fill={color} />
    </svg>
  </div>
);

/* ===== Material Icon Helper ===== */
const Icon = ({ name, filled = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);

const FloatingShapes = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div style={{ y: y1, rotate, scale }} className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px]" />
      <motion.div style={{ y: y2, rotate: -rotate, scale }} className="absolute top-[30%] right-[-10%] w-[50rem] h-[50rem] bg-tertiary/10 rounded-full blur-[140px]" />
      <motion.div style={{ y: y1, scale: 1.3 }} className="absolute bottom-[10%] left-[10%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[100px]" />
      <motion.div style={{ y: y2 }} className="absolute top-[70%] left-[30%] w-96 h-96 bg-primary/5 rounded-full blur-[110px]" />
    </div>
  );
};

/* ===== Parallax Hero Section ===== */
const ParallaxHero = ({ token }) => {
  const [showVideo, setShowVideo] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax layers (different speeds)
  const yBg = useTransform(scrollY, [0, 1000], [0, 500]); // Deeper Background
  const yMid = useTransform(scrollY, [0, 1000], [0, 300]); // Medium
  const yMidFast = useTransform(scrollY, [0, 1000], [0, -150]); // Aggressive reverse
  const scaleHero = useTransform(scrollY, [0, 500], [1, 0.8]); // Perspective scale
  const yText = useTransform(scrollY, [0, 800], [0, -300]); // Text moves up faster
  const opacityText = useTransform(scrollY, [0, 600], [1, 0]); // Fades out later
  const rotateHero = useTransform(scrollY, [0, 1000], [0, 5]); // Subtle tilt

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-background">
      
      {/* Video Modal Overlay */}
      {showVideo && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setShowVideo(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <Icon name="close" />
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="LendWise Product Tour"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-view" 
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}

      {/* 1. Deepest Layer: Giant ambient gradient orbs */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse-soft" />
        <div className="absolute bottom-[10%] right-[5%] w-[700px] h-[700px] bg-tertiary-fixed/40 rounded-full blur-[150px] mix-blend-multiply animate-pulse-soft animate-delay-200" />
      </motion.div>

      {/* 2. Middle Layer: Floating Glass Shapes */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 z-10 pointer-events-none flex justify-center items-center">
         {/* Top Left Glass */}
         <div className="absolute top-1/4 left-[15%] w-32 h-32 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-glass rotate-12 animate-float" />
         {/* Bottom Right Glass */}
         <div className="absolute bottom-1/4 right-[20%] w-48 h-48 rounded-[3rem] bg-white/20 backdrop-blur-md border border-white/30 shadow-glass -rotate-6 animate-float animate-delay-500" />
         {/* Center Right Leaf */}
         <div className="absolute top-1/3 right-[15%] w-16 h-16 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/20 shadow-glass flex items-center justify-center -rotate-12 animate-float animate-delay-200">
            <Icon name="energy_savings_leaf" className="text-primary text-2xl" />
         </div>
      </motion.div>

      {/* 3. Fast Middle Layer: Smaller accents crossing over */}
      <motion.div style={{ y: yMidFast }} className="absolute inset-0 z-10 pointer-events-none">
         <div className="absolute top-1/2 left-[25%] w-20 h-20 rounded-full bg-gradient-to-tr from-oat to-transparent backdrop-blur-xl border border-white/50 shadow-glass animate-float animate-delay-300" />
         <div className="absolute bottom-1/3 left-[10%] w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-glass rotate-45 animate-float animate-delay-100" />
      </motion.div>

      {/* 4. Foreground Content: Text & CTA */}
      <motion.div 
        style={{ y: yText, opacity: opacityText, scale: scaleHero, rotateX: rotateHero }} 
        className="relative z-20 max-w-[900px] mx-auto text-center space-y-8 perspective-1000"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/50 shadow-sm px-4 py-1.5 rounded-full mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-primary uppercase">Your Financial Sanctuary</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-h1 md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
        >
          Debt doesn't have to be overwhelming.<br />
          <span className="text-gradient-sage italic font-normal">Let's untangle it together.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-body-lg text-on-surface-variant max-w-[600px] mx-auto"
        >
          Your intelligent financial co-pilot. We transform complex statements into clear, serene pathways toward financial freedom.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {token ? (
            <Link to="/dashboard" className="btn-primary flex items-center gap-2 text-lg w-full sm:w-auto justify-center px-8 py-4">
              Go to Dashboard
              <Icon name="arrow_forward" />
            </Link>
          ) : (
            <Link to="/auth/register" className="btn-primary flex items-center gap-2 text-lg w-full sm:w-auto justify-center px-8 py-4">
              Find Your Path
              <Icon name="arrow_forward" />
            </Link>
          )}
          <button 
            onClick={() => setShowVideo(true)}
            className="btn-ghost flex items-center gap-2 text-lg w-full sm:w-auto justify-center backdrop-blur-md bg-white/50 px-8 py-4"
          >
            <Icon name="play_circle" />
            Watch How It Works
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 pt-8"
        >
          {[
            { icon: 'lock', label: 'Bank-grade security', filled: true },
            { icon: 'energy_savings_leaf', label: 'Zero jargon', filled: true },
            { icon: 'star', label: '4.9/5 rating', filled: true, iconColor: 'text-amber-500' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low/80 backdrop-blur-sm border border-white/20 shadow-sm px-4 py-2 rounded-full">
              <Icon name={badge.icon} filled={badge.filled} className={`text-sm ${badge.iconColor || 'text-primary'}`} />
              <span className="text-label-caps font-bold uppercase tracking-widest">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const ParallaxSection = ({ children, className = "" }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const token = useAuthStore((state) => state.token);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.9)"]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden scroll-smooth">
      <FloatingShapes />

      {/* ═══════════ NAVBAR ═══════════ */}
      <motion.nav 
        style={{ backgroundColor: navBg }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl rounded-full border border-white/40 shadow-ambient z-50 transition-all duration-300"
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-3 w-full">
          <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <Icon name="eco" filled className="text-primary text-2xl" />
            <span className="font-bold text-xl text-primary tracking-tight">LendWise</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'How it Works', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                 className="text-on-surface-variant hover:bg-white hover:shadow-sm hover:text-primary px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-semibold">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-1.5 text-sm !px-5 !py-2.5 shadow-sage">
                Dashboard
                <Icon name="arrow_forward" className="text-sm" />
              </Link>
            ) : (
              <>
                <Link to="/auth/login" className="hidden sm:block text-primary px-5 py-2.5 rounded-full border-2 border-transparent hover:border-primary/20 transition-colors text-sm font-semibold">
                  Log In
                </Link>
                <Link to="/auth/register" className="btn-primary flex items-center gap-1.5 text-sm !px-5 !py-2.5 shadow-sage">
                  Get Started
                  <Icon name="arrow_forward" className="text-sm" />
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <ParallaxHero token={token} />

      <WaveDivider color="#f3f4f0" />

      {/* ═══════════ HORIZONTAL SCROLL TICKER ═══════════ */}
      <section className="py-10 bg-surface-container-low overflow-hidden border-y border-outline-variant/30">
        <div className="flex whitespace-nowrap">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center pr-12"
          >
            {[
              "AI-POWERED INSIGHTS", "BANK-GRADE SECURITY", "DEBT-FREE FUTURE", 
              "ZERO JARGON", "SMART VISUALIZATION", "GLOBAL TAX RELIEF",
              "AI-POWERED INSIGHTS", "BANK-GRADE SECURITY", "DEBT-FREE FUTURE", 
              "ZERO JARGON", "SMART VISUALIZATION", "GLOBAL TAX RELIEF"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary/20 tracking-tighter uppercase italic">{text}</span>
                <Icon name="star" filled className="text-primary/10 text-xs" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="bg-surface-container-low py-12 px-6 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {[
            { value: '₹120Cr+', label: 'Debt Managed', icon: 'account_balance' },
            { value: '50,000+', label: 'Families Helped', icon: 'family_restroom' },
            { value: '8', label: 'Languages', icon: 'translate' },
            { value: '4.9★', label: 'User Rating', icon: 'star' },
          ].map((stat, idx) => {
            const { scrollYProgress } = useScroll();
            const yOffset = useTransform(scrollYProgress, [0.1, 0.3], [50, 0]);
            return (
              <motion.div key={stat.label} style={{ y: yOffset }} className="flex flex-col items-center gap-2">
                <Icon name={stat.icon} filled className="text-primary text-2xl" />
                <p className="text-h2 md:text-h1 font-bold text-on-surface">{stat.value}</p>
                <p className="text-label-caps font-bold uppercase tracking-widest text-secondary">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <WaveDivider flip color="#f3f4f0" />

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" className="py-20 px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="text-center mb-16">
            <p className="text-label-caps font-bold uppercase tracking-widest text-primary mb-3">Powerful & Peaceful</p>
            <h2 className="text-h1 font-bold text-on-surface">Tools that feel like a deep breath</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'account_tree', title: 'Visual Loan Mapping',
                desc: 'See your entire debt landscape as an interactive, flowing diagram. No more spreadsheet anxiety.',
                gradient: 'from-primary/10 to-primary/5',
                speed: -40
              },
              {
                icon: 'smart_toy', title: 'AI Copilot',
                desc: 'A conversational guide that speaks plain English (or your language). Ask anything, get clarity.',
                gradient: 'from-tertiary/10 to-tertiary/5',
                tall: true,
                speed: 40
              },
              {
                icon: 'public', title: 'Regional Tax Relief',
                desc: 'Jurisdiction-aware tax calculators for USA, India, EU. Automatic deduction discovery.',
                gradient: 'from-error-container/30 to-error-container/10',
                speed: -20
              },
            ].map((feature, idx) => {
              const { scrollYProgress } = useScroll();
              const yOffset = useTransform(scrollYProgress, [0.3, 0.6], [0, feature.speed || 0]);
              
              return (
                <motion.div 
                  key={feature.title}
                  style={{ y: yOffset }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className={`glass-card rounded-2xl p-8 flex flex-col gap-4 transition-transform hover:-translate-y-2 ${feature.tall ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center border border-white/40 shadow-sm`}>
                    <Icon name={feature.icon} filled className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-h3 font-semibold text-on-surface">{feature.title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-20 px-6 bg-surface-container-low/50 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-b from-transparent to-oat/50 pointer-events-none" 
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-label-caps font-bold uppercase tracking-widest text-primary mb-3">Simple Process</p>
            <h2 className="text-h1 font-bold text-on-surface mb-16">Three peaceful steps</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] border-t-2 border-dashed border-primary/30" />

            {[
              { step: '01', icon: 'upload_file', title: 'Upload Statement', desc: 'Drop any loan document. We handle the rest.' },
              { step: '02', icon: 'account_tree', title: 'We Visualize It', desc: 'Your debt becomes a flowing, living map.' },
              { step: '03', icon: 'route', title: 'Follow Your Path', desc: 'AI-powered strategies adapted to you.' },
            ].map((item, idx) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex flex-col items-center gap-4 relative z-10 group"
              >
                <div className="w-20 h-20 rounded-full bg-white glass-card flex items-center justify-center shadow-glass transition-transform group-hover:scale-110">
                  <Icon name={item.icon} filled className="text-primary text-3xl" />
                </div>
                <span className="text-label-caps font-bold text-primary mt-2">Step {item.step}</span>
                <h3 className="text-h3 font-semibold text-on-surface">{item.title}</h3>
                <p className="text-body-md text-on-surface-variant max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section id="testimonials" className="py-20 px-6 overflow-hidden">
        <ParallaxSection className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-label-caps font-bold uppercase tracking-widest text-primary mb-3">Loved by Families</p>
            <h2 className="text-h1 font-bold text-on-surface">Stories of financial peace</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', loc: 'Mumbai, India', quote: 'LendWise made me feel like I had a financial advisor who actually cared. The visual maps changed everything.', stars: 5 },
              { name: 'James Wilson', loc: 'Austin, USA', quote: 'The SAVE plan calculator saved me $340/month. I didn\'t even know I was eligible until LendWise found it.', stars: 5 },
              { name: 'Ananya Patel', loc: 'Bengaluru, India', quote: 'Simple Mode is brilliant. My parents finally understand their loan without the jargon. Thank you.', stars: 5 },
            ].map((t, idx) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-8 flex flex-col gap-4 hover:-translate-y-1 transition-transform"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Icon key={i} name="star" filled className="text-amber-500 text-lg" />
                  ))}
                </div>
                <p className="text-body-md text-on-surface-variant italic leading-relaxed">"{t.quote}"</p>
                <div className="mt-auto pt-4 border-t border-outline-variant/30">
                  <p className="font-semibold text-on-surface">{t.name}</p>
                  <p className="text-sm text-secondary">{t.loc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ParallaxSection>
      </section>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section className="py-20 px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-tertiary p-12 md:p-16 text-center text-white relative overflow-hidden shadow-ambient"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-h1 font-bold mb-4">Your debt-free day is closer than you think.</h2>
            <p className="text-body-lg opacity-90 mb-8 max-w-lg mx-auto">
              Join 50,000+ families who chose peace over panic. Start your journey today.
            </p>
            {token ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <Icon name="auto_awesome" filled className="text-lg" />
                Return to Dashboard
              </Link>
            ) : (
              <Link to="/auth/register" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <Icon name="auto_awesome" filled className="text-lg" />
                Start for Free — No Credit Card
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="rounded-t-[48px] bg-oat/30 px-6 md:px-10 py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <Icon name="eco" filled className="text-primary text-2xl" />
              <span className="text-xl font-extrabold text-on-surface tracking-tight">LendWise</span>
            </Link>
            <p className="text-sm text-secondary max-w-xs">
              © 2024 LendWise. Designed for financial serenity.<br />
              <span className="text-xs mt-2 block">
                Made with <Icon name="energy_savings_leaf" className="text-primary text-sm align-middle" /> for financial peace.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
            {[
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
              { title: 'Support', links: ['Contact Us', 'FAQ', 'Help Center'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-2">
                <h4 className="text-label-caps font-bold uppercase tracking-widest text-on-surface mb-2">{col.title}</h4>
                {col.links.map((link) => (
                  <a key={link} href="#" className="text-sm text-secondary hover:text-primary transition-colors">{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

