import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Wind, Zap, Footprints, Blinds, BedDouble, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const services = [
  { icon: Shirt, name: 'Wash & Fold', desc: 'Machine wash, dry, and neatly fold. Perfect for everyday clothing.', price: '₹49', slug: 'wash-fold', color: COLORS.primary },
  { icon: Wind, name: 'Dry Cleaning', desc: 'Chemical-free solvent cleaning for delicate and premium fabrics.', price: '₹149', slug: 'dry-cleaning', color: '#8B5CF6' },
  { icon: Zap, name: 'Steam Ironing', desc: 'Professional steam ironing for crisp, wrinkle-free garments.', price: '₹29', slug: 'steam-ironing', color: '#F59E0B' },
  { icon: Footprints, name: 'Shoe Cleaning', desc: 'Expert cleaning and restoration for all types of footwear.', price: '₹199', slug: 'shoe-cleaning', color: '#EF4444' },
  { icon: Blinds, name: 'Curtain Cleaning', desc: 'Deep clean and freshening for all curtain fabrics and sizes.', price: '₹99', slug: 'curtain-cleaning', color: '#06B6D4' },
  { icon: BedDouble, name: 'Blanket Cleaning', desc: 'Thorough wash for blankets, quilts, and heavy bedding.', price: '₹149', slug: 'blanket-cleaning', color: '#10B981' },
];

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: COLORS.background }} id="services" className="services-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Our Services
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Everything Your Wardrobe Needs
          </h2>
          <p style={{ fontSize: '17px', color: COLORS.muted, maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Professional garment care for every item in your home.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '32px', height: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ width: 60, height: 60, borderRadius: '16px', background: `${service.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <service.icon size={26} color={service.color} />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: COLORS.dark, marginBottom: '10px' }}>{service.name}</h3>
                <p style={{ fontSize: '14px', color: COLORS.muted, lineHeight: 1.6, flex: 1, margin: '0 0 20px' }}>{service.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: COLORS.muted }}>Starting at </span>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: COLORS.dark }}>{service.price}</span>
                    <span style={{ fontSize: '12px', color: COLORS.muted }}>/item</span>
                  </div>
                  <Link
                    to={`/services#${service.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: service.color, fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
                  >
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <Link
            to="/services"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', boxShadow: `0 6px 20px ${COLORS.primary}40` }}
          >
            View All Services <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .services-section { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
}
