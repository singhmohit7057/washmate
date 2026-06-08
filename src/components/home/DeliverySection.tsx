import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Clock, Zap, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS, WHATSAPP_URL } from '../../lib/constants';
import { Link } from 'react-router-dom';

export default function DeliverySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: COLORS.dark, overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block', background: `${COLORS.primary}30`, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Delivery Service
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.5px', lineHeight: 1.15, textTransform: 'uppercase' }}>
            Best Laundry & Dry Clean Service,<br />
            <span style={{ color: COLORS.primary }}>Now With Free Home Delivery</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            WashMate provides free home pickup and delivery at a time of your convenience. We also provide express delivery service.
          </p>
        </motion.div>

        {/* Two column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', marginBottom: '64px' }} className="delivery-grid">
          {/* Left: delivery info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Regular delivery */}
            <div style={{ background: '#1F2937', borderRadius: '20px', padding: '28px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: 40, height: 40, background: `${COLORS.success}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color={COLORS.success} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0 }}>Regular Delivery</h3>
                  <span style={{ fontSize: '12px', color: COLORS.success, fontWeight: 600 }}>FREE — No extra charges</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['Laundry', '48 Hours'],
                  ['Dry Clean', '72 Hours'],
                  ['Shoe Cleaning', '3 to 5 Days'],
                ].map(([service, time]) => (
                  <div key={service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={14} color={COLORS.success} />
                      <span style={{ color: '#D1D5DB', fontSize: '15px' }}>{service}</span>
                    </div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Express delivery */}
            <div style={{ background: '#1F2937', borderRadius: '20px', padding: '28px', border: `1px solid ${COLORS.primary}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: 40, height: 40, background: `${COLORS.primary}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color={COLORS.primary} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0 }}>Express Delivery</h3>
                  <span style={{ fontSize: '12px', color: COLORS.primary, fontWeight: 600 }}>1.5× charges apply</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['Same-day delivery', 'Selected services'],
                  ['Next-day delivery', 'All standard services'],
                  ['Priority handling', 'Guaranteed slots'],
                ].map(([label, sub]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={14} color={COLORS.primary} />
                      <span style={{ color: '#D1D5DB', fontSize: '15px' }}>{label}</span>
                    </div>
                    <span style={{ color: '#6B7280', fontSize: '13px' }}>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: van illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            className="delivery-van"
          >
            <DeliveryVanIllustration />
          </motion.div>
        </div>

        {/* Bottom description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}
        >
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            From secure packaging to professional garment handling, every order is carefully processed so your clothes reach your doorstep fresh, clean and wrinkle-free.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '16px' }}
          >
            <MessageCircle size={18} /> Chat On WhatsApp
          </a>
          <Link
            to="/schedule-pickup"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '16px' }}
          >
            Schedule Free Pickup <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .delivery-grid { grid-template-columns: 1fr !important; }
          .delivery-van { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function DeliveryVanIllustration() {
  return (
    <motion.div
      animate={{ x: [0, 8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" width="380" height="280">
        {/* Road */}
        <rect x="0" y="230" width="400" height="50" rx="0" fill="#1F2937" />
        <rect x="0" y="245" width="400" height="4" fill="#374151" />
        {/* Road lines */}
        {[0, 80, 160, 240, 320].map(x => (
          <rect key={x} x={x + 20} y="246" width="40" height="2" rx="1" fill="#4B5563" />
        ))}

        {/* Van body */}
        <rect x="30" y="130" width="280" height="110" rx="16" fill={COLORS.primary} />
        <rect x="30" y="130" width="280" height="110" rx="16" fill="url(#vanGrad)" />

        {/* Cab */}
        <path d="M240 130 L310 130 Q340 130 340 160 L340 200 L240 200 Z" fill={COLORS.primaryDark} />

        {/* Windshield */}
        <path d="M248 140 L308 140 Q328 140 328 158 L328 185 L248 185 Z" fill="#93C5FD" opacity="0.6" />

        {/* Windows on body */}
        <rect x="50" y="145" width="60" height="50" rx="8" fill="#93C5FD" opacity="0.4" />
        <rect x="130" y="145" width="60" height="50" rx="8" fill="#93C5FD" opacity="0.4" />

        {/* WashMate branding */}
        <rect x="40" y="195" width="190" height="30" rx="0" fill="rgba(255,255,255,0.1)" />
        <text x="135" y="215" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">WashMate</text>

        {/* Wheels */}
        <circle cx="100" cy="238" r="28" fill="#111827" />
        <circle cx="100" cy="238" r="18" fill="#374151" />
        <circle cx="100" cy="238" r="8" fill={COLORS.primary} />
        <circle cx="280" cy="238" r="28" fill="#111827" />
        <circle cx="280" cy="238" r="18" fill="#374151" />
        <circle cx="280" cy="238" r="8" fill={COLORS.primary} />

        {/* Door handle */}
        <rect x="195" y="170" width="20" height="4" rx="2" fill="rgba(255,255,255,0.5)" />

        {/* Logo on van */}
        <circle cx="70" cy="175" r="16" fill="rgba(255,255,255,0.15)" />
        <text x="70" y="180" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="sans-serif">👕</text>

        {/* Motion lines */}
        <line x1="0" y1="160" x2="25" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="0" y1="175" x2="20" y2="175" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="0" y1="190" x2="15" y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4 4" />

        <defs>
          <linearGradient id="vanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
