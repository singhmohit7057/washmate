import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, ArrowRight, Navigation, Zap } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';

type AreaRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  coverage: string | null;
  pickup_slots: string | null;
  delivery_info: string | null;
  pincodes: string | null;
  landmarks: string | null;
  is_active: boolean;
  sort_order: number;
};

const split = (val: string | null) => (val ?? '').split(',').map(s => s.trim()).filter(Boolean);

const AREA_COLORS = [
  { bg: '#EEF2FF', ic: COLORS.primary,  accent: COLORS.primary  },
  { bg: '#F0FDF4', ic: '#10B981',        accent: '#10B981'        },
  { bg: '#FFF7ED', ic: '#F97316',        accent: '#F97316'        },
  { bg: '#F5F3FF', ic: '#8B5CF6',        accent: '#8B5CF6'        },
  { bg: '#FFFBEB', ic: '#D97706',        accent: '#D97706'        },
  { bg: '#FFF1F2', ic: '#F43F5E',        accent: '#F43F5E'        },
];

export default function ServiceAreasPage() {
  const [areas, setAreas]     = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams<{ slug?: string }>();

  useEffect(() => {
    supabase
      .from('service_areas')
      .select('id, slug, name, city, state, coverage, pickup_slots, delivery_info, pincodes, landmarks, is_active, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setAreas((data ?? []) as AreaRow[]);
        setLoading(false);
      });
  }, []);

  // Scroll to area card once data loaded and slug present
  useEffect(() => {
    if (!loading && slug) {
      const t = setTimeout(() => {
        const el = document.getElementById(slug);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 200);
      return () => clearTimeout(t);
    }
  }, [loading, slug]);

  return (
    <Layout>
      <SEO
        title="Service Areas | WashMate"
        description="WashMate provides laundry & dry cleaning pickup and delivery in Kolkata, Barrackpore, Kankinara, Naihati, Titagarh, and Kalyani."
        keywords="laundry service areas Kolkata, dry cleaning Barrackpore, laundry Kalyani, pickup delivery areas West Bengal"
      />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '72px 24px 110px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -50, left: 40, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#C7D2FE', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
            <Navigation size={12} /> Coverage Map
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            We Serve{' '}
            <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Area</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            Free pickup and delivery across Kolkata and the<br />surrounding districts of West Bengal.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '900px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          {[
            { emoji: '📍', label: 'Areas Covered',  value: loading ? '—' : `${areas.length}+` },
            { emoji: '🚀', label: 'Express Available', value: 'Yes' },
            { emoji: '🆓', label: 'Pickup & Delivery', value: 'Free' },
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

      {/* ── Area cards ── */}
      <section style={{ padding: '56px 24px 80px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
          ) : areas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '16px', background: COLORS.background, border: `1px dashed ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <MapPin size={28} color={COLORS.border} />
              </div>
              <p style={{ fontSize: '16px', color: COLORS.muted }}>No service areas listed yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {areas.map((area, i) => {
                const pincodes  = split(area.pincodes);
                const landmarks = split(area.landmarks);
                const clr       = AREA_COLORS[i % AREA_COLORS.length];

                return (
                  <motion.div key={area.id} id={area.slug}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>

                    {/* Card header */}
                    <div style={{ padding: '20px 28px', background: `linear-gradient(135deg,${clr.bg},#fff)`, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ width: 46, height: 46, borderRadius: '13px', background: clr.bg, border: `1.5px solid ${clr.ic}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={20} color={clr.ic} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: COLORS.dark, margin: '0 0 2px' }}>{area.name}</h2>
                        <span style={{ fontSize: '12px', color: COLORS.muted, fontWeight: 600 }}>{area.city ? `${area.city}, ` : ''}{area.state}</span>
                      </div>
                      <span style={{ background: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>● Active</span>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="area-body">

                      {/* Left */}
                      <div>
                        {area.coverage && (
                          <p style={{ fontSize: '14px', color: COLORS.darkMuted, lineHeight: 1.8, margin: '0 0 18px' }}>{area.coverage}</p>
                        )}

                        {pincodes.length > 0 && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Pincodes</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                              {pincodes.map(p => (
                                <span key={p} style={{ background: clr.bg, color: clr.ic, padding: '3px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 700, border: `1px solid ${clr.ic}20` }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {landmarks.length > 0 && (
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Landmarks</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                              {landmarks.map(l => (
                                <span key={l} style={{ background: COLORS.background, color: COLORS.darkMuted, padding: '3px 10px', borderRadius: '7px', fontSize: '12px', border: `1px solid ${COLORS.border}` }}>
                                  {l}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {area.pickup_slots && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 16px', background: COLORS.background, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
                            <div style={{ width: 34, height: 34, borderRadius: '9px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Clock size={15} color={COLORS.primary} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '12px', color: COLORS.dark, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pickup Slots</div>
                              <div style={{ fontSize: '13px', color: COLORS.darkMuted, lineHeight: 1.5 }}>{area.pickup_slots}</div>
                            </div>
                          </div>
                        )}

                        {area.delivery_info && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 16px', background: COLORS.background, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
                            <div style={{ width: 34, height: 34, borderRadius: '9px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <CheckCircle size={15} color="#10B981" />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '12px', color: COLORS.dark, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delivery Timeline</div>
                              <div style={{ fontSize: '13px', color: COLORS.darkMuted, lineHeight: 1.5 }}>{area.delivery_info}</div>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                          <Link to={`/schedule-pickup?area=${area.slug}`}
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: `linear-gradient(135deg,${clr.ic},${clr.ic}CC)`, color: '#fff', textDecoration: 'none', padding: '11px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', boxShadow: `0 4px 12px ${clr.ic}30` }}>
                            Schedule Pickup <ArrowRight size={13} />
                          </Link>
                          <Link to={`/schedule-pickup?area=${area.slug}&type=express`}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: '#FFF7ED', color: '#F97316', border: '1.5px solid #FED7AA', textDecoration: 'none', padding: '11px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>
                            <Zap size={13} /> Express
                          </Link>
                        </div>
                      </div>
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
          .area-body { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
