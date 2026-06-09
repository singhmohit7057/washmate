import React from 'react';
import { motion } from 'framer-motion';
import { Award, Droplets, Shield, Clock, Tag, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const features = [
  { icon: Award,       color: COLORS.primary, bg: '#EEF2FF', title: 'Professional Cleaning',  desc: 'Trained experts handle every garment with care and precision.' },
  { icon: Droplets,    color: '#8B5CF6',      bg: '#F5F3FF', title: 'Premium Detergents',     desc: 'Imported, eco-friendly detergents safe for all fabric types.' },
  { icon: Shield,      color: '#F59E0B',      bg: '#FFFBEB', title: 'Fabric Safe Process',    desc: 'Gentle techniques that protect fabric quality and colour.' },
  { icon: Clock,       color: '#10B981',      bg: '#F0FDF4', title: 'On-Time Delivery',       desc: '99.2% on-time delivery record. We respect your schedule.' },
  { icon: Tag,         color: '#EF4444',      bg: '#FFF5F5', title: 'Affordable Pricing',     desc: 'Transparent, competitive pricing with no hidden charges.' },
  { icon: CheckCircle, color: '#06B6D4',      bg: '#ECFEFF', title: 'Quality Inspection',     desc: '3-point quality check before every delivery. Guaranteed.' },
];

export default function WhyChooseSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#FAFAFA' }} className="why-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '5px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Why WashMate?
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>Built Around Your Clothes</h2>
          <p style={{ fontSize: '16px', color: COLORS.muted, maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            We've reinvented laundry around quality, reliability, and convenience.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }} className="why-grid">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 28 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.5 }}>
              <motion.div whileHover={{ y: -5, boxShadow: `0 16px 36px ${f.color}14` }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '28px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', height: '100%' }}>
                <div style={{ width: 48, height: 48, borderRadius: '13px', background: f.bg, border: `1.5px solid ${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={21} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: '0 0 7px' }}>{f.title}</h3>
                  <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .why-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .why-section { padding: 60px 16px !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
