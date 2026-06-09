import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shirt, Wind, Zap, Footprints, Blinds, BedDouble, Sparkles, CheckCircle, Clock, ArrowRight, Star } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

const SLUG_META: Record<string, {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  bg: string;
  process: string[];
  features: string[];
  highlight: string;
}> = {
  'wash-fold':        { icon: Shirt,      color: COLORS.primary, bg: '#EEF2FF', highlight: 'Most Popular', process: ['Garments sorted by color and fabric', 'Machine washed at optimal temperature', 'Tumble dried with care', 'Neatly folded and packaged'], features: ['Color separation', 'Fabric care labels followed', 'Fresh fragrance option', 'Neat packaging'] },
  'dry-cleaning':     { icon: Wind,       color: '#8B5CF6',      bg: '#F5F3FF', highlight: 'Premium',      process: ['Detailed inspection and tagging', 'Pre-treatment of stains', 'Solvent-based cleaning', 'Steam finishing and pressing'], features: ['Stain pre-treatment', 'Fabric inspection', 'Professional pressing', 'Individual packaging'] },
  'steam-ironing':    { icon: Zap,        color: '#F59E0B',      bg: '#FFFBEB', highlight: 'Express Ready', process: ['Garments checked for damage', 'Steam pressed at correct temperature', 'Inspected for quality', 'Wrapped on hangers or folded flat'], features: ['Temperature-controlled', 'Collar & cuff precision', 'Hanger or fold delivery', 'Same-day available'] },
  'shoe-cleaning':    { icon: Footprints, color: '#EF4444',      bg: '#FFF5F5', highlight: 'Specialist',   process: ['Type assessment and product selection', 'Deep scrubbing and cleaning', 'Conditioning and polishing', 'Deodorizing and drying'], features: ['All shoe types', 'Leather conditioning', 'Sole cleaning', 'Deodorizing treatment'] },
  'curtain-cleaning': { icon: Blinds,     color: '#06B6D4',      bg: '#ECFEFF', highlight: 'Doorstep',     process: ['Measured and tagged at pickup', 'Dust-extracted before washing', 'Gentle wash cycle', 'Pressed and rolled for delivery'], features: ['All curtain types', 'Dust extraction first', 'Anti-bacterial wash', 'Pressed finish'] },
  'blanket-cleaning': { icon: BedDouble,  color: '#10B981',      bg: '#F0FDF4', highlight: 'Heavy Duty',   process: ['Weight and fabric assessment', 'Pre-soak for deep clean', 'Industrial machine wash', 'Fluff dry and air freshen'], features: ['Single to king size', 'Industrial machines', 'Dust mite treatment', 'Fresh packaging'] },
};

const PALETTE = ['#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#A855F7'];
const PALETTE_BG = ['#EEF2FF', '#FDF2F8', '#F0FDFA', '#FFF7ED', '#F7FEE7', '#FAF5FF'];
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

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '72px 24px 110px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -50, left: 40, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#C7D2FE', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={12} /> Professional Garment Care
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Premium Care for{' '}
            <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Garment</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            From everyday laundry to delicate dry cleaning —<br />handled with expertise and delivered to your door.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '900px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          {[
            { emoji: '🧺', label: 'Services Available', value: loading ? '—' : `${services.length}` },
            { emoji: '💰', label: 'Starting From',       value: '₹29'   },
            { emoji: '⭐', label: 'Customer Rating',     value: '4.9/5' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.07 }}
              style={{ padding: '20px 14px', borderRight: i < 2 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: COLORS.primary, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section style={{ padding: '64px 24px 80px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 10px', letterSpacing: '-0.5px' }}>What We Offer</h2>
            <p style={{ fontSize: '15px', color: COLORS.muted, margin: 0 }}>Every service designed around your garment's specific needs.</p>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><LoadingSpinner /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {services.map((s, i) => {
                const meta = SLUG_META[s.slug];
                const Icon = meta?.icon ?? Sparkles;
                const color = meta?.color ?? PALETTE[i % PALETTE.length];
                const bg    = meta?.bg    ?? PALETTE_BG[i % PALETTE_BG.length];
                const stored = tryParseProcess(s.process);
                const process  = stored.process  ?? meta?.process  ?? DEFAULT_PROCESS;
                const features = stored.features ?? meta?.features ?? DEFAULT_FEATURES;
                const description = s.description ?? 'Professional laundry and cleaning service with quality guaranteed.';
                const turnaround  = s.turnaround_time ?? 'Contact us';
                const highlight   = meta?.highlight ?? null;

                return (
                  <motion.div key={s.id} id={s.slug}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

                    {/* Card header */}
                    <div style={{ padding: '22px 28px', background: `linear-gradient(135deg,${bg},#fff)`, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ width: 50, height: 50, borderRadius: '14px', background: bg, border: `1.5px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={22} color={color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h2 style={{ fontSize: '18px', fontWeight: 900, color: COLORS.dark, margin: 0 }}>{s.name}</h2>
                          {highlight && (
                            <span style={{ background: `${color}15`, color, padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
                              {highlight}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '14px', marginTop: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> {turnaround}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 800, color }}>From ₹{s.starting_price}</span>
                        </div>
                      </div>
                      <Link to="/schedule-pickup"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: `linear-gradient(135deg,${color},${color}CC)`, color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', flexShrink: 0, boxShadow: `0 4px 12px ${color}30`, whiteSpace: 'nowrap' }}>
                        Book Now <ArrowRight size={13} />
                      </Link>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="svc-body">

                      {/* Left: description + features */}
                      <div>
                        <p style={{ fontSize: '14px', color: COLORS.darkMuted, lineHeight: 1.8, margin: '0 0 20px' }}>{description}</p>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>What's Included</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {features.map(f => (
                            <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: bg, color, padding: '5px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: `1px solid ${color}20` }}>
                              <CheckCircle size={11} /> {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: process steps */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Our Process</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {process.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${color},${color}AA)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>
                                {idx + 1}
                              </div>
                              <span style={{ fontSize: '13px', color: COLORS.darkMuted, lineHeight: 1.6, paddingTop: '3px' }}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rating footer */}
                    <div style={{ padding: '12px 28px', background: COLORS.background, borderTop: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {[1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= 4 ? '#F59E0B' : 'none'} color="#F59E0B" />)}
                      <span style={{ fontSize: '12px', color: COLORS.muted, marginLeft: '4px', fontWeight: 600 }}>4.9 · Loved by 5,000+ customers</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CTASection />

      <style>{`
        @media (max-width: 680px) {
          .svc-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
