import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Star, Shield, Clock, Package } from 'lucide-react';
import { COLORS, WHATSAPP_URL, BRAND } from '../../lib/constants';

const trustItems = [
  { icon: Package, label: 'Free Pickup' },
  { icon: ArrowRight, label: 'Free Delivery' },
  { icon: Clock, label: 'Express Delivery' },
  { icon: Shield, label: 'Premium Fabric Care' },
];

export default function HeroSection() {
  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F7FF 0%, #FAFBFF 50%, #F5F0FF 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background shapes */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.primaryLight} 0%, transparent 70%)`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #EDE9FE 0%, transparent 70%)', opacity: 0.5 }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="hero-grid">

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primaryLight, color: COLORS.primary, padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.03em', textTransform: 'uppercase' }}
            >
              <Star size={12} fill={COLORS.primary} />
              #1 Laundry Service in Kolkata
            </motion.div>

            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 900, lineHeight: 1.1, color: COLORS.dark, marginBottom: '24px', letterSpacing: '-1.5px' }}>
              Professional Laundry{' '}
              <span style={{ color: COLORS.primary }}>& Dry Cleaning</span>{' '}
              At Your Doorstep
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: COLORS.darkMuted, lineHeight: 1.7, marginBottom: '40px', maxWidth: '520px' }}>
              Schedule pickup, track orders, and enjoy premium garment care without leaving your home. {BRAND.tagline}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/schedule-pickup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '17px', boxShadow: `0 8px 24px ${COLORS.primary}40` }}
                >
                  Schedule Pickup
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25D36615', color: '#128C7E', textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '17px', border: '2px solid #25D36625' }}
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
              </motion.div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                { value: '5000+', label: 'Happy Customers' },
                { value: '50K+', label: 'Orders Completed' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark, letterSpacing: '-0.5px' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Illustration side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            className="hero-illustration"
          >
            <HeroIllustration />
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '64px' }}
        >
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '999px', padding: '10px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <Icon size={16} color={COLORS.primary} />
              <span style={{ fontWeight: 600, fontSize: '14px', color: COLORS.dark, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          .hero-illustration { display: none !important; }
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
      style={{ position: 'relative', width: 420, height: 420 }}
    >
      {/* Main washing machine */}
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
        <circle cx="200" cy="240" r="80" fill="#E8F3FF" stroke={COLORS.primary} strokeWidth="2" strokeDasharray="8 4" />
        {/* Drum inner */}
        <circle cx="200" cy="240" r="60" fill="#fff" stroke={COLORS.border} strokeWidth="2" />
        {/* Spin lines */}
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

      {/* Floating badges */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '10%', right: '-8%', background: '#fff', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 140 }}
      >
        <div style={{ width: 32, height: 32, background: '#D1FAE5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>✓</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: COLORS.dark }}>Delivered!</div>
          <div style={{ fontSize: '11px', color: COLORS.muted }}>Order #4821</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ position: 'absolute', bottom: '18%', left: '-12%', background: '#fff', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 150 }}
      >
        <div style={{ width: 32, height: 32, background: COLORS.primaryLight, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>🚐</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '13px', color: COLORS.dark }}>Free Pickup</div>
          <div style={{ fontSize: '11px', color: COLORS.muted }}>At your doorstep</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
