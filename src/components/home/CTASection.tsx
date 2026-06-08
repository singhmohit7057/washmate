import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: COLORS.background }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #0056CC 100%)`, borderRadius: '28px', padding: '64px 48px', boxShadow: `0 24px 60px ${COLORS.primary}30`, position: 'relative', overflow: 'hidden' }}>
            {/* Background decoration */}
            <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Get Started Today
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', marginBottom: '20px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
                Ready To Experience<br />Hassle-Free Laundry?
              </h2>
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 40px' }}>
                Join 5,000+ happy customers who trust WashMate with their garments. First pickup is completely free.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/schedule-pickup"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#fff', color: COLORS.primary, textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '17px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                  >
                    Schedule Pickup <ArrowRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/contact"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 700, fontSize: '17px', border: '2px solid rgba(255,255,255,0.3)' }}
                  >
                    <Phone size={18} /> Contact Us
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
