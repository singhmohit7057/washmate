import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Zap, CheckCircle, MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS, WHATSAPP_URL } from '../../lib/constants';
import { Link } from 'react-router-dom';

export default function DeliverySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', overflow: 'hidden', position: 'relative' }} className="delivery-section">
      {/* bg orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', top: -100, right: -80, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'rgba(139,92,246,0.07)', bottom: -60, left: 20, pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.2)', color: '#C7D2FE', padding: '5px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid rgba(99,102,241,0.3)' }}>
            Delivery Service
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Free Pickup &{' '}
            <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Doorstep Delivery</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            We collect from your door, clean with care, and deliver back fresh — on your schedule.
          </p>
        </motion.div>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '48px', alignItems: 'start' }} className="delivery-grid">

          {/* Regular */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.5 }}
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ width: 42, height: 42, background: 'rgba(52,199,89,0.15)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={19} color="#34C759" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Regular Delivery</div>
                <div style={{ fontSize: '11px', color: '#34C759', fontWeight: 600 }}>FREE — No extra charges</div>
              </div>
            </div>
            {[['Laundry', '48 Hours'], ['Dry Clean', '72 Hours'], ['Shoe Cleaning', '3–5 Days']].map(([svc, time], idx, arr) => (
              <div key={svc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={13} color="#34C759" />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{svc}</span>
                </div>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{time}</span>
              </div>
            ))}
          </motion.div>

          {/* Express */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25, duration: 0.5 }}
            style={{ background: 'rgba(99,102,241,0.1)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <div style={{ width: 42, height: 42, background: 'rgba(99,102,241,0.2)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={19} color="#818CF8" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Express Delivery</div>
                <div style={{ fontSize: '11px', color: '#818CF8', fontWeight: 600 }}>1.5× charges apply</div>
              </div>
            </div>
            {[['Same-day delivery', 'Selected services'], ['Next-day delivery', 'All standard services'], ['Priority handling', 'Guaranteed slots']].map(([label, sub], idx, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={13} color="#818CF8" />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>{label}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '48px' }} className="delivery-stats">
          {[
            { emoji: '🚀', value: '24 hrs', label: 'Express Turnaround' },
            { emoji: '📦', value: '10K+',   label: 'Orders Delivered' },
            { emoji: '⭐', value: '99%',    label: 'On-time Rate' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.emoji}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ delay: 0.45 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/schedule-pickup"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: '13px', fontWeight: 700, fontSize: '15px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
            Schedule Free Pickup <ArrowRight size={16} />
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', background: '#25D366', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: '13px', fontWeight: 700, fontSize: '15px' }}>
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .delivery-grid { grid-template-columns: 1fr !important; }
          .delivery-stats { grid-template-columns: 1fr !important; gap: 10px !important; }
          .delivery-section { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
}
