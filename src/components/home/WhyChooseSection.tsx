import React from 'react';
import { motion } from 'framer-motion';
import { Award, Droplets, Shield, Clock, Tag, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const features = [
  { icon: Award, title: 'Professional Cleaning', desc: 'Trained experts handle every garment with care and precision.', color: '#007AFF' },
  { icon: Droplets, title: 'Premium Detergents', desc: 'Imported, eco-friendly detergents safe for all fabric types.', color: '#8B5CF6' },
  { icon: Shield, title: 'Fabric Safe Process', desc: 'Gentle cleaning techniques that protect fabric quality and color.', color: '#F59E0B' },
  { icon: Clock, title: 'On-Time Delivery', desc: '99.2% on-time delivery record. We respect your schedule.', color: '#10B981' },
  { icon: Tag, title: 'Affordable Pricing', desc: 'Transparent, competitive pricing with no hidden charges.', color: '#EF4444' },
  { icon: CheckCircle, title: 'Quality Inspection', desc: '3-point quality check before every delivery. Guaranteed freshness.', color: '#06B6D4' },
];

export default function WhyChooseSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Why WashMate?
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Built Around Your Clothes
          </h2>
          <p style={{ fontSize: '17px', color: COLORS.muted, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            We've reinvented laundry around quality, reliability, and convenience.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ background: '#FAFAFA', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: COLORS.dark, marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
