import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Clock, Package, Zap } from 'lucide-react';
import { COLORS, WHATSAPP_URL, BRAND } from '../../lib/constants';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L0 24l6.335-1.509A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.017-1.376l-.36-.214-3.724.887.936-3.618-.235-.372A9.782 9.782 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  );
}

const trustItems = [
  { icon: Package, label: 'Free Pickup'        },
  { icon: ArrowRight, label: 'Free Delivery'   },
  { icon: Zap,     label: 'Express Available'  },
  { icon: Shield,  label: 'Quality Guaranteed' },
];

export default function HeroSection() {
  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#F0F7FF 0%,#FAFBFF 50%,#F5F0FF 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* bg orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '8%', right: '-4%', width: 560, height: 560, borderRadius: '50%', background: `radial-gradient(circle,${COLORS.primaryLight} 0%,transparent 70%)`, opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: '-5%', left: '-8%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle,#EDE9FE 0%,transparent 70%)', opacity: 0.55 }} />
        <div style={{ position: 'absolute', top: '55%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,#DBEAFE 0%,transparent 70%)', opacity: 0.5 }} />
      </div>

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '40px 24px 36px', width: '100%', position: 'relative', zIndex: 1 }} className="hero-inner">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="hero-grid">

          {/* ── Text side ── */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#EEF2FF,#F5F0FF)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366F1', padding: '5px 13px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <Star size={10} fill="#6366F1" color="#6366F1" />
              #1 Laundry Service in Kolkata
            </motion.div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(28px,3.8vw,46px)', fontWeight: 900, lineHeight: 1.1, color: COLORS.dark, marginBottom: '12px', letterSpacing: '-1.5px' }}>
              Professional{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Laundry</span>
              {' '}&{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dry Cleaning</span>
              <br />At Your Doorstep
            </h1>

            <p style={{ fontSize: '14px', color: COLORS.darkMuted, lineHeight: 1.6, marginBottom: '20px', maxWidth: '420px' }}>
              Schedule pickup in 2 minutes, track in real-time, and enjoy premium garment care — delivered back fresh and clean.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }} className="hero-buttons">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/schedule-pickup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', textDecoration: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', boxShadow: '0 6px 20px rgba(99,102,241,0.35)', whiteSpace: 'nowrap' }}>
                  Schedule Pickup <ArrowRight size={15} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#128C7E', textDecoration: 'none', padding: '11px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: '1.5px solid #E5E7EB', boxShadow: '0 3px 10px rgba(0,0,0,0.07)', whiteSpace: 'nowrap' }}>
                  <WhatsAppIcon /> WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }} className="hero-stats">
              {[
                { value: '5,000+', label: 'Happy Customers' },
                { value: '50K+',   label: 'Orders Completed' },
                { value: '4.9★',   label: 'Average Rating' },
              ].map((stat, i) => (
                <div key={stat.label} style={{ paddingRight: i < 2 ? '20px' : 0, marginRight: i < 2 ? '20px' : 0, borderRight: i < 2 ? `1px solid ${COLORS.border}` : 'none' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: COLORS.dark, letterSpacing: '-0.5px', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '3px', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Illustration side ── */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-illustration">
            <HeroIllustration />
          </motion.div>
        </div>

        {/* ── Trust bar ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '999px', padding: '7px 14px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <Icon size={13} color="#6366F1" />
              <span style={{ fontWeight: 600, fontSize: '12px', color: COLORS.dark, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes drum-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .drum-ring {
          animation: drum-spin 3s linear infinite;
          transform-origin: 200px 240px;
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          .hero-illustration { display: none !important; }
          .hero-buttons { justify-content: center !important; }
          .hero-stats { justify-content: center !important; }
          .hero-inner { padding: 64px 20px !important; }
        }
        @media (max-width: 480px) {
          .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
          .hero-buttons a, .hero-buttons > div { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .hero-stats { gap: 16px !important; }
          .hero-inner { padding: 52px 16px !important; }
        }
      `}</style>
    </section>
  );
}

function HeroIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'relative', width: 340, height: 340 }}
    >
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Machine body */}
        <rect x="40" y="60" width="320" height="300" rx="24" fill="#fff" filter="url(#shadow)" />
        <rect x="40" y="60" width="320" height="300" rx="24" stroke="#E5E7EB" strokeWidth="2" />
        {/* Top panel */}
        <rect x="40" y="60" width="320" height="80" rx="24" fill={COLORS.primary} />
        <rect x="40" y="100" width="320" height="40" fill={COLORS.primary} />
        {/* Control dots */}
        <circle cx="120" cy="95" r="10" fill="rgba(255,255,255,0.3)" />
        <circle cx="150" cy="95" r="10" fill="rgba(255,255,255,0.3)" />
        <circle cx="180" cy="95" r="10" fill="rgba(255,255,255,0.5)" />
        <rect x="220" y="84" width="80" height="22" rx="11" fill="rgba(255,255,255,0.2)" />
        {/* Drum circle outer */}
        <circle cx="200" cy="240" r="100" fill="#F0F7FF" stroke={COLORS.border} strokeWidth="3" />
        {/* Spinning dashed ring */}
        <circle className="drum-ring" cx="200" cy="240" r="80" fill="#E8F3FF" stroke={COLORS.primary} strokeWidth="2" strokeDasharray="8 4" />
        {/* Drum inner */}
        <circle cx="200" cy="240" r="60" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
        {/* Spinning drum lines */}
        <g className="drum-ring">
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <line
              key={angle}
              x1={200 + 25 * Math.cos((angle * Math.PI) / 180)}
              y1={240 + 25 * Math.sin((angle * Math.PI) / 180)}
              x2={200 + 55 * Math.cos((angle * Math.PI) / 180)}
              y2={240 + 55 * Math.sin((angle * Math.PI) / 180)}
              stroke={COLORS.primary}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          ))}
        </g>
        {/* Center dot */}
        <circle cx="200" cy="240" r="8" fill={COLORS.primary} />
        {/* Bubbles */}
        <circle cx="160" cy="215" r="5" fill={COLORS.primary} opacity="0.3" />
        <circle cx="240" cy="210" r="4" fill={COLORS.primary} opacity="0.4" />
        <circle cx="215" cy="270" r="6" fill={COLORS.primary} opacity="0.25" />
        <circle cx="185" cy="265" r="3" fill={COLORS.primary} opacity="0.35" />
        {/* Bottom panel */}
        <rect x="60" y="320" width="80" height="20" rx="10" fill="#E5E7EB" />
        <rect x="160" y="320" width="80" height="20" rx="10" fill="#E5E7EB" />
        <rect x="260" y="320" width="80" height="20" rx="10" fill="#E5E7EB" />
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>

      {/* Floating badge — Delivered */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '-8%', background: '#fff', borderRadius: '16px', padding: '12px 16px', boxShadow: '0 10px 28px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 148 }}
      >
        <div style={{ width: 34, height: 34, background: '#D1FAE5', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>✓</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark }}>Delivered!</div>
          <div style={{ fontSize: '11px', color: COLORS.muted }}>Order #4821</div>
        </div>
      </motion.div>

      {/* Floating badge — Free Pickup */}
      <motion.div
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ position: 'absolute', bottom: '18%', left: '-12%', background: '#fff', borderRadius: '16px', padding: '12px 16px', boxShadow: '0 10px 28px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '10px', minWidth: 154 }}
      >
        <div style={{ width: 34, height: 34, background: COLORS.primaryLight, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>🚐</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark }}>Free Pickup</div>
          <div style={{ fontSize: '11px', color: COLORS.muted }}>At your doorstep</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
