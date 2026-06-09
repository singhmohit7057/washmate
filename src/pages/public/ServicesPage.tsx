import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Wind, Zap, Footprints, Blinds, BedDouble, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import { COLORS } from '../../lib/constants';

const services = [
  {
    id: 'wash-fold',
    icon: Shirt, name: 'Wash & Fold', color: COLORS.primary,
    description: 'Our wash & fold service is perfect for everyday clothing. We use high-quality detergents and professional machines to ensure deep cleaning and fresh results every time.',
    process: ['Garments sorted by color and fabric', 'Machine washed at optimal temperature', 'Tumble dried with care', 'Neatly folded and packaged'],
    turnaround: '48 Hours',
    startingPrice: '₹49/item',
    features: ['Color separation', 'Fabric care labels followed', 'Fresh fragrance option', 'Neat packaging'],
  },
  {
    id: 'dry-cleaning',
    icon: Wind, name: 'Dry Cleaning', color: '#8B5CF6',
    description: 'Premium dry cleaning for delicate and valuable garments. Our expert technicians use industry-grade solvents that lift stains and dirt without water, preserving fabric integrity.',
    process: ['Detailed inspection and tagging', 'Pre-treatment of stains', 'Solvent-based cleaning', 'Steam finishing and pressing'],
    turnaround: '72 Hours',
    startingPrice: '₹149/item',
    features: ['Stain pre-treatment', 'Fabric inspection', 'Professional pressing', 'Individual packaging'],
  },
  {
    id: 'steam-ironing',
    icon: Zap, name: 'Steam Ironing', color: '#F59E0B',
    description: 'Professional steam ironing eliminates wrinkles and creases, leaving your clothes looking crisp and polished. Ideal for office wear, formal shirts, and special occasion outfits.',
    process: ['Garments checked for damage', 'Steam pressed at correct temperature', 'Inspected for quality', 'Wrapped on hangers or folded flat'],
    turnaround: '24 Hours',
    startingPrice: '₹29/item',
    features: ['Temperature-controlled', 'Collar & cuff precision', 'Hanger or fold delivery', 'Same-day available'],
  },
  {
    id: 'shoe-cleaning',
    icon: Footprints, name: 'Shoe Cleaning', color: '#EF4444',
    description: 'Expert shoe cleaning and restoration for all types of footwear — sneakers, leather shoes, heels, and more. We use specialized products to restore your shoes to near-original condition.',
    process: ['Type assessment and product selection', 'Deep scrubbing and cleaning', 'Conditioning and polishing', 'Deodorizing and drying'],
    turnaround: '3–5 Days',
    startingPrice: '₹199/pair',
    features: ['All shoe types', 'Leather conditioning', 'Sole cleaning', 'Deodorizing treatment'],
  },
  {
    id: 'curtain-cleaning',
    icon: Blinds, name: 'Curtain Cleaning', color: '#06B6D4',
    description: 'We pick up, deep clean, and return all types of curtains — from sheer and net to blackout and velvet. Curtains collect more dust than any other home textile.',
    process: ['Measured and tagged at pickup', 'Dust-extracted before washing', 'Gentle wash cycle', 'Pressed and rolled for delivery'],
    turnaround: '3–4 Days',
    startingPrice: '₹99/panel',
    features: ['All curtain types', 'Dust extraction first', 'Anti-bacterial wash', 'Pressed finish'],
  },
  {
    id: 'blanket-cleaning',
    icon: BedDouble, name: 'Blanket Cleaning', color: '#10B981',
    description: 'Heavy blankets, quilts, duvets, and comforters receive thorough professional cleaning using industrial machines capable of handling large items with delicate care.',
    process: ['Weight and fabric assessment', 'Pre-soak for deep clean', 'Industrial machine wash', 'Fluff dry and air freshen'],
    turnaround: '3–4 Days',
    startingPrice: '₹149/piece',
    features: ['Single to king size', 'Industrial machines', 'Dust mite treatment', 'Fresh packaging'],
  },
];

export default function ServicesPage() {
  return (
    <Layout>
      <SEO
        title="Our Services | WashMate"
        description="Explore WashMate's complete range of laundry and dry cleaning services — Wash & Fold, Dry Cleaning, Steam Ironing, Shoe Cleaning and more."
        keywords="laundry services Kolkata, dry cleaning, wash and fold, shoe cleaning, curtain cleaning"
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              All Services
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: COLORS.dark, marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.1 }}>
              Premium Care for<br /><span style={{ color: COLORS.primary }}>Every Garment</span>
            </h1>
            <p style={{ fontSize: '18px', color: COLORS.muted, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              From everyday laundry to delicate dry cleaning, we handle it all with professional expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '48px', alignItems: 'center', padding: '48px', background: '#FAFAFA', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}
              className="service-row"
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '18px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={28} color={s.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark, margin: 0 }}>{s.name}</h2>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                      <span style={{ fontSize: '13px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {s.turnaround}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>From {s.startingPrice}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, marginBottom: '24px' }}>{s.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                  {s.features.map(f => (
                    <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${s.color}10`, color: s.color, padding: '5px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>
                      <CheckCircle size={12} /> {f}
                    </span>
                  ))}
                </div>
                <Link
                  to="/schedule-pickup"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: s.color, color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '15px' }}
                >
                  Book This Service <ArrowRight size={16} />
                </Link>
              </div>

              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <div style={{ background: `linear-gradient(135deg, ${s.color}10 0%, ${s.color}05 100%)`, borderRadius: '20px', padding: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, marginBottom: '20px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>Our Process</h3>
                  <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {s.process.map((step, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '15px', color: COLORS.darkMuted, paddingTop: '4px' }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTASection />
      <style>{`
        @media (max-width: 768px) {
          .service-row { grid-template-columns: 1fr !important; gap: 24px !important; }
          .service-row > * { order: unset !important; }
        }
        @media (max-width: 600px) {
          .services-hero { padding: 48px 16px 40px !important; }
          .services-body { padding: 48px 16px !important; }
          .service-card-inner { padding: 24px 16px !important; }
        }
      `}</style>
    </Layout>
  );
}
