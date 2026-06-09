import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS, SERVICE_AREAS } from '../../lib/constants';

export default function ServiceAreasSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: COLORS.background }} className="service-areas-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            We Serve
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Service Areas
          </h2>
          <p style={{ fontSize: '17px', color: COLORS.muted, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Covering Kolkata and surrounding regions with reliable pickup and delivery.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {SERVICE_AREAS.map((area, i) => (
            <motion.div
              key={area.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link to={`/service-areas/${area.slug}`} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 12px 28px ${COLORS.primary}20`, borderColor: COLORS.primary }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ background: '#fff', border: `1.5px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px 20px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                >
                  <div style={{ width: 44, height: 44, background: COLORS.primaryLight, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} color={COLORS.primary} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: COLORS.dark }}>{area.name}</div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '4px' }}>{area.pincode[0]}...</div>
                  </div>
                  <div style={{ fontSize: '11px', background: '#D1FAE5', color: '#059669', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    Available
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '40px' }}
        >
          <Link
            to="/service-areas"
            style={{ color: COLORS.primary, fontWeight: 600, fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            View All Service Areas →
          </Link>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .service-areas-section { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
}
