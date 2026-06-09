import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Wind, Zap, Footprints, Blinds, BedDouble, Sparkles, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

// slug → icon, color, rich content (fallback for new services)
const SLUG_META: Record<string, {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  process: string[];
  features: string[];
}> = {
  'wash-fold':        { icon: Shirt,      color: COLORS.primary, process: ['Garments sorted by color and fabric', 'Machine washed at optimal temperature', 'Tumble dried with care', 'Neatly folded and packaged'], features: ['Color separation', 'Fabric care labels followed', 'Fresh fragrance option', 'Neat packaging'] },
  'dry-cleaning':     { icon: Wind,       color: '#8B5CF6',      process: ['Detailed inspection and tagging', 'Pre-treatment of stains', 'Solvent-based cleaning', 'Steam finishing and pressing'], features: ['Stain pre-treatment', 'Fabric inspection', 'Professional pressing', 'Individual packaging'] },
  'steam-ironing':    { icon: Zap,        color: '#F59E0B',      process: ['Garments checked for damage', 'Steam pressed at correct temperature', 'Inspected for quality', 'Wrapped on hangers or folded flat'], features: ['Temperature-controlled', 'Collar & cuff precision', 'Hanger or fold delivery', 'Same-day available'] },
  'shoe-cleaning':    { icon: Footprints, color: '#EF4444',      process: ['Type assessment and product selection', 'Deep scrubbing and cleaning', 'Conditioning and polishing', 'Deodorizing and drying'], features: ['All shoe types', 'Leather conditioning', 'Sole cleaning', 'Deodorizing treatment'] },
  'curtain-cleaning': { icon: Blinds,     color: '#06B6D4',      process: ['Measured and tagged at pickup', 'Dust-extracted before washing', 'Gentle wash cycle', 'Pressed and rolled for delivery'], features: ['All curtain types', 'Dust extraction first', 'Anti-bacterial wash', 'Pressed finish'] },
  'blanket-cleaning': { icon: BedDouble,  color: '#10B981',      process: ['Weight and fabric assessment', 'Pre-soak for deep clean', 'Industrial machine wash', 'Fluff dry and air freshen'], features: ['Single to king size', 'Industrial machines', 'Dust mite treatment', 'Fresh packaging'] },
};
const PALETTE = ['#6366F1','#EC4899','#14B8A6','#F97316','#84CC16','#A855F7'];
const DEFAULT_PROCESS = ['Item received and inspected', 'Professional cleaning applied', 'Quality check performed', 'Packaged and ready for delivery'];
const DEFAULT_FEATURES = ['Professional care', 'Quality assured', 'Safe handling', 'On-time delivery'];

type ServiceRow = { id: string; name: string; slug: string; description: string | null; turnaround_time: string | null; starting_price: number; sort_order: number; process: string | null };

function tryParseProcess(raw: string | null): { process: string[] | null; features: string[] | null } {
  if (!raw) return { process: null, features: null };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        process: Array.isArray(parsed.process) && parsed.process.length ? parsed.process : null,
        features: Array.isArray(parsed.features) && parsed.features.length ? parsed.features : null,
      };
    }
  } catch { /* ignore */ }
  return { process: null, features: null };
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('id, name, slug, description, turnaround_time, starting_price, sort_order, process')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setServices((data ?? []) as ServiceRow[]);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <SEO
        title="Our Services | WashMate"
        description="Explore WashMate's complete range of laundry and dry cleaning services — Wash & Fold, Dry Cleaning, Steam Ironing, Shoe Cleaning and more."
        keywords="laundry services Kolkata, dry cleaning, wash and fold, shoe cleaning, curtain cleaning"
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }} className="services-hero">
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
      <section style={{ padding: '80px 24px', background: '#fff' }} className="services-body">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {loading ? (
            <LoadingSpinner />
          ) : services.map((s, i) => {
            const meta = SLUG_META[s.slug];
            const Icon = meta?.icon ?? Sparkles;
            const color = meta?.color ?? PALETTE[i % PALETTE.length];
            const stored = tryParseProcess(s.process);
            const process = stored.process ?? meta?.process ?? DEFAULT_PROCESS;
            const features = stored.features ?? meta?.features ?? DEFAULT_FEATURES;
            const description = s.description ?? 'Professional laundry and cleaning service with quality guaranteed.';
            const turnaround = s.turnaround_time ?? 'Contact us';

            return (
              <motion.div
                key={s.id}
                id={s.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', padding: '48px', background: '#FAFAFA', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}
                className="service-row"
              >
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '18px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={28} color={color} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark, margin: 0 }}>{s.name}</h2>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                        <span style={{ fontSize: '13px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {turnaround}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color }}>From ₹{s.starting_price}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, marginBottom: '24px' }}>{description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {features.map(f => (
                      <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${color}10`, color, padding: '5px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600 }}>
                        <CheckCircle size={12} /> {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/schedule-pickup"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: color, color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '15px' }}
                  >
                    Book This Service <ArrowRight size={16} />
                  </Link>
                </div>

                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div style={{ background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`, borderRadius: '20px', padding: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, marginBottom: '20px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>Our Process</h3>
                    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {process.map((step, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ width: 28, height: 28, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontSize: '15px', color: COLORS.darkMuted, paddingTop: '4px' }}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
        }
      `}</style>
    </Layout>
  );
}
