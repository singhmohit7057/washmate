import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import { COLORS } from '../../lib/constants';

const areas = [
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    pincodes: ['700001–700099', '700101–700150'],
    coverage: 'Full city coverage including North, South, East, and Central Kolkata. Serving residential and commercial addresses.',
    pickup: 'Daily pickup slots: 8 AM–12 PM, 12 PM–4 PM, 4 PM–8 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs | Express: Same-day / Next-day',
    landmarks: ['Park Street', 'Salt Lake', 'New Town', 'Gariahat', 'Shyambazar', 'Tollygunge'],
  },
  {
    slug: 'barrackpore',
    name: 'Barrackpore',
    state: 'West Bengal',
    pincodes: ['700120', '700121', '700122'],
    coverage: 'Complete coverage of Barrackpore municipality and surrounding localities.',
    pickup: 'Pickup slots: 9 AM–1 PM, 2 PM–6 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs | Express: Next-day',
    landmarks: ['Barrackpore Cantonment', 'Titagarh Junction', 'Ichapur'],
  },
  {
    slug: 'kankinara',
    name: 'Kankinara',
    state: 'West Bengal',
    pincodes: ['743126'],
    coverage: 'Covering Kankinara and adjacent areas including Jagaddal.',
    pickup: 'Pickup slots: 9 AM–1 PM, 2 PM–6 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs',
    landmarks: ['Kankinara Station', 'Jagaddal', 'Nabanagar'],
  },
  {
    slug: 'naihati',
    name: 'Naihati',
    state: 'West Bengal',
    pincodes: ['743165'],
    coverage: 'Serving Naihati municipality and nearby localities.',
    pickup: 'Pickup slots: 9 AM–1 PM, 2 PM–6 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs',
    landmarks: ['Naihati Station', 'Halisahar', 'Kanchrapara'],
  },
  {
    slug: 'titagarh',
    name: 'Titagarh',
    state: 'West Bengal',
    pincodes: ['700119'],
    coverage: 'Complete Titagarh municipality coverage.',
    pickup: 'Pickup slots: 9 AM–1 PM, 2 PM–6 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs',
    landmarks: ['Titagarh Station', 'Khardaha', 'Panihati'],
  },
  {
    slug: 'kalyani',
    name: 'Kalyani',
    state: 'West Bengal',
    pincodes: ['741235', '741236'],
    coverage: 'Covering Kalyani township and all surrounding blocks.',
    pickup: 'Pickup slots: 9 AM–1 PM, 2 PM–6 PM',
    delivery: 'Regular: 48 hrs | Dry Clean: 72 hrs',
    landmarks: ['Kalyani University', 'Kalyani Ghoshpara', 'Shaktinagar'],
  },
];

export default function ServiceAreasPage() {
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
          {areas.map((area, i) => (
            <motion.div
              key={area.slug}
              id={area.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{ background: '#FAFAFA', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
              className="area-card"
            >
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

                <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.7, marginBottom: '16px' }}>{area.coverage}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {area.pincodes.map(p => (
                    <span key={p} style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      PIN: {p}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {area.landmarks.map(l => (
                    <span key={l} style={{ background: COLORS.background, color: COLORS.darkMuted, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', border: `1px solid ${COLORS.border}` }}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Clock size={18} color={COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>Pickup Availability</div>
                      <div style={{ fontSize: '14px', color: COLORS.darkMuted }}>{area.pickup}</div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle size={18} color={COLORS.success} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>Delivery Timeline</div>
                      <div style={{ fontSize: '14px', color: COLORS.darkMuted }}>{area.delivery}</div>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/schedule-pickup?area=${area.slug}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px' }}
                >
                  Schedule in {area.name} <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
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
