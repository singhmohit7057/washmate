import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, Sparkles, Package } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const steps = [
  { icon: Calendar, title: 'Schedule Pickup',  desc: 'Book in under 2 minutes. Pick your date, time slot, and address.',     color: COLORS.primary, bg: '#EEF2FF', number: '01' },
  { icon: Truck,    title: 'We Collect',        desc: 'Our agent arrives on time, inspects and tags every garment.',            color: '#8B5CF6',      bg: '#F5F3FF', number: '02' },
  { icon: Sparkles, title: 'Expert Cleaning',   desc: 'Professional care using premium, fabric-safe detergents.',              color: '#F59E0B',      bg: '#FFFBEB', number: '03' },
  { icon: Package,  title: 'Delivered Fresh',   desc: 'Clean, neatly packed garments delivered back to your door.',            color: '#10B981',      bg: '#F0FDF4', number: '04' },
];

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#FAFAFA' }} className="hiw-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '5px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Simple Process
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>How It Works</h2>
          <p style={{ fontSize: '16px', color: COLORS.muted, maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Four simple steps from your door to fresh, clean clothes — and back again.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', position: 'relative' }} className="hiw-grid">
          {/* connector */}
          <div style={{ position: 'absolute', top: '44px', left: '12.5%', right: '12.5%', height: '2px', background: `linear-gradient(90deg,${COLORS.primary},#8B5CF6,#F59E0B,#10B981)`, zIndex: 0, borderRadius: '999px', opacity: 0.35 }} className="hiw-line" />

          {steps.map((step, i) => (
            <motion.div key={step.title}
              initial={{ opacity: 0, y: 32 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ position: 'relative', zIndex: 1 }}>
              <motion.div whileHover={{ y: -6, boxShadow: `0 20px 40px ${step.color}18` }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                {/* Colored top bar */}
                <div style={{ height: '4px', background: `linear-gradient(90deg,${step.color},${step.color}88)` }} />
                <div style={{ padding: '28px 22px', textAlign: 'center' }}>
                  {/* Step number + icon */}
                  <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '18px' }}>
                    <div style={{ width: 68, height: 68, borderRadius: '18px', background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <step.icon size={28} color={step.color} />
                    </div>
                    <div style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, background: step.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#fff', border: '2px solid #fff' }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, margin: '0 0 8px' }}>{step.title}</h3>
                  <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hiw-grid { grid-template-columns: 1fr 1fr !important; }
          .hiw-line { display: none !important; }
        }
        @media (max-width: 600px) {
          .hiw-section { padding: 60px 16px !important; }
          .hiw-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
        }
      `}</style>
    </section>
  );
}
