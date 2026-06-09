import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Wind, Zap, Footprints, Blinds, BedDouble, Sparkles, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

const SLUG_META: Record<string, { icon: React.ComponentType<{ size?: number; color?: string }>; color: string; bg: string; desc: string }> = {
  'wash-fold':        { icon: Shirt,      color: COLORS.primary, bg: '#EEF2FF', desc: 'Machine wash, dry, and neatly fold. Perfect for everyday clothing.' },
  'dry-cleaning':     { icon: Wind,       color: '#8B5CF6',      bg: '#F5F3FF', desc: 'Chemical-free solvent cleaning for delicate and premium fabrics.' },
  'steam-ironing':    { icon: Zap,        color: '#F59E0B',      bg: '#FFFBEB', desc: 'Professional steam ironing for crisp, wrinkle-free garments.' },
  'shoe-cleaning':    { icon: Footprints, color: '#EF4444',      bg: '#FFF5F5', desc: 'Expert cleaning and restoration for all types of footwear.' },
  'curtain-cleaning': { icon: Blinds,     color: '#06B6D4',      bg: '#ECFEFF', desc: 'Deep clean and freshening for all curtain fabrics and sizes.' },
  'blanket-cleaning': { icon: BedDouble,  color: '#10B981',      bg: '#F0FDF4', desc: 'Thorough wash for blankets, quilts, and heavy bedding.' },
};
const PALETTE    = ['#6366F1','#EC4899','#14B8A6','#F97316','#84CC16','#A855F7'];
const PALETTE_BG = ['#EEF2FF','#FDF2F8','#F0FDFA','#FFF7ED','#F7FEE7','#FAF5FF'];

type ServiceRow = { id: string; name: string; slug: string; description: string | null; starting_price: number; sort_order: number };

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [services, setServices] = useState<ServiceRow[]>([]);

  useEffect(() => {
    supabase
      .from('services')
      .select('id, name, slug, description, starting_price, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setServices((data ?? []) as ServiceRow[]));
  }, []);

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#fff' }} id="services" className="services-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '5px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Our Services
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>Everything Your Wardrobe Needs</h2>
          <p style={{ fontSize: '16px', color: COLORS.muted, maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Professional garment care for every item in your home.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }} className="svc-grid">
          {services.map((service, i) => {
            const meta  = SLUG_META[service.slug];
            const Icon  = meta?.icon ?? Sparkles;
            const color = meta?.color ?? PALETTE[i % PALETTE.length];
            const bg    = meta?.bg    ?? PALETTE_BG[i % PALETTE_BG.length];
            const desc  = service.description ?? meta?.desc ?? 'Professional laundry care service.';

            return (
              <motion.div key={service.id}
                initial={{ opacity: 0, y: 32 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.07, duration: 0.5 }}>
                <motion.div whileHover={{ y: -5, boxShadow: `0 20px 40px ${color}18` }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '20px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  {/* Gradient header */}
                  <div style={{ padding: '24px 24px 20px', background: `linear-gradient(135deg,${bg},#fff)`, borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: 52, height: 52, borderRadius: '14px', background: bg, border: `1.5px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <Icon size={22} color={color} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>{service.name}</h3>
                  </div>
                  {/* Body */}
                  <div style={{ padding: '18px 24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7, flex: 1, margin: '0 0 16px' }}>{desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: COLORS.muted }}>Starting at </span>
                        <span style={{ fontSize: '20px', fontWeight: 900, color, letterSpacing: '-0.5px' }}>₹{service.starting_price}</span>
                        <span style={{ fontSize: '11px', color: COLORS.muted }}>/item</span>
                      </div>
                      <Link to={`/services#${service.slug}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: bg, color, padding: '7px 14px', borderRadius: '9px', fontWeight: 700, fontSize: '12px', textDecoration: 'none', border: `1px solid ${color}20` }}>
                        Details <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/services"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', textDecoration: 'none', padding: '13px 30px', borderRadius: '13px', fontWeight: 700, fontSize: '15px', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}>
            View All Services <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .svc-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .services-section { padding: 60px 16px !important; }
          .svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
