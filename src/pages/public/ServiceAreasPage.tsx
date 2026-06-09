import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
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
  state: string;
  coverage: string | null;
  pickup_slots: string | null;
  delivery_info: string | null;
  pincodes: string | null;
  landmarks: string | null;
  is_active: boolean;
  sort_order: number;
};

// Split comma-separated string to trimmed array
const split = (val: string | null) => (val ?? '').split(',').map(s => s.trim()).filter(Boolean);

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('service_areas')
      .select('id, slug, name, state, coverage, pickup_slots, delivery_info, pincodes, landmarks, is_active, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setAreas((data ?? []) as AreaRow[]);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <SEO
        title="Service Areas | WashMate"
        description="WashMate provides laundry & dry cleaning pickup and delivery in Kolkata, Barrackpore, Kankinara, Naihati, Titagarh, and Kalyani."
        keywords="laundry service areas Kolkata, dry cleaning Barrackpore, laundry Kalyani, pickup delivery areas West Bengal"
      />

      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-1px' }}>
              We Serve <span style={{ color: COLORS.primary }}>Your Area</span>
            </h1>
            <p style={{ fontSize: '18px', color: COLORS.muted, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Free pickup and delivery across Kolkata and the surrounding districts of West Bengal.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {loading ? (
            <LoadingSpinner />
          ) : areas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px', color: COLORS.muted }}>
              <MapPin size={48} color={COLORS.border} style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px' }}>No service areas listed yet. Check back soon!</p>
            </div>
          ) : areas.map((area, i) => {
            const pincodes = split(area.pincodes);
            const landmarks = split(area.landmarks);
            return (
              <motion.div
                key={area.id}
                id={area.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ background: '#FAFAFA', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
                className="area-card"
              >
                {/* Left: info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: 48, height: 48, background: COLORS.primaryLight, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={22} color={COLORS.primary} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '22px', fontWeight: 900, color: COLORS.dark, margin: 0 }}>{area.name}</h2>
                      <span style={{ fontSize: '13px', color: COLORS.muted }}>{area.state}</span>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#D1FAE5', color: '#059669', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>Active</span>
                  </div>

                  {area.coverage && (
                    <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.7, marginBottom: '16px' }}>{area.coverage}</p>
                  )}

                  {pincodes.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                      {pincodes.map(p => (
                        <span key={p} style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                          PIN: {p}
                        </span>
                      ))}
                    </div>
                  )}

                  {landmarks.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {landmarks.map(l => (
                        <span key={l} style={{ background: COLORS.background, color: COLORS.darkMuted, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: `1px solid ${COLORS.border}` }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: pickup, delivery, CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {area.pickup_slots && (
                    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Clock size={18} color={COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>Pickup Availability</div>
                          <div style={{ fontSize: '14px', color: COLORS.darkMuted }}>{area.pickup_slots}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {area.delivery_info && (
                    <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <CheckCircle size={18} color={COLORS.success} style={{ marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>Delivery Timeline</div>
                          <div style={{ fontSize: '14px', color: COLORS.darkMuted }}>{area.delivery_info}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/schedule-pickup?area=${area.slug}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px' }}
                  >
                    Schedule in {area.name} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTASection />
      <style>{`
        @media (max-width: 768px) {
          .area-card { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .areas-hero { padding: 48px 16px 40px !important; }
          .areas-body { padding: 40px 16px !important; }
        }
      `}</style>
    </Layout>
  );
}
