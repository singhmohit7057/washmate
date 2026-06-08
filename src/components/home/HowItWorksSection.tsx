import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, Sparkles, Package } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const steps = [
  { icon: Calendar, title: 'Schedule Pickup', description: 'Choose your preferred date and time. We come to your door.', color: COLORS.primary, number: '01' },
  { icon: Truck, title: 'We Collect', description: 'Our trained staff arrives on time and collects your garments safely.', color: '#8B5CF6', number: '02' },
  { icon: Sparkles, title: 'Expert Cleaning', description: 'Professional cleaning using premium, fabric-safe detergents and techniques.', color: '#F59E0B', number: '03' },
  { icon: Package, title: 'Delivered Fresh', description: 'Clean, fresh, neatly packed garments delivered back to your door.', color: COLORS.success, number: '04' },
];

export default function HowItWorksSection() {
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
            Simple Process
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            How It Works
          </h2>
          <p style={{ fontSize: '17px', color: COLORS.muted, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Four simple steps to fresh, clean clothes without leaving your home.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', top: '52px', left: '12.5%', right: '12.5%', height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, #8B5CF6, #F59E0B, ${COLORS.success})`, zIndex: 0, borderRadius: '999px' }} className="connector-line" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              >
                <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '20px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '20px', background: `${step.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <step.icon size={30} color={step.color} />
                  </div>
                  <div style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, background: step.color, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', border: '2px solid #fff' }}>
                    {i + 1}
                  </div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: COLORS.muted, lineHeight: 1.6, margin: 0 }}>{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .connector-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}
