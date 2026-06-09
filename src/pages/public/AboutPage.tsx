import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, CheckCircle, Sparkles, Users, Star, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import { COLORS, BRAND } from '../../lib/constants';

const qualityStandards = [
  'Each garment inspected and individually tagged at pickup',
  'Sorted by color, fabric type, and care instructions',
  'Professional-grade equipment and premium detergents used',
  '3-point quality check before every delivery',
  'Temperature-controlled washing for sensitive fabrics',
  'Eco-friendly cleaning solutions where possible',
  'Secure, individual packaging for each order',
];

const values = [
  { icon: Star,      color: '#F59E0B', bg: '#FFFBEB', title: 'Quality First',   text: 'Every garment treated with the same care we\'d give our own clothes.' },
  { icon: Users,     color: '#6366F1', bg: '#EEF2FF', title: 'Customer Centric', text: 'Your schedule, your preferences — we adapt to you, not the other way.' },
  { icon: TrendingUp,color: '#10B981', bg: '#F0FDF4', title: 'Always Improving', text: 'We collect feedback after every order and act on it relentlessly.' },
  { icon: Sparkles,  color: '#8B5CF6', bg: '#F5F3FF', title: 'Transparency',     text: 'Real-time tracking and honest pricing — no surprises, ever.' },
];

export default function AboutPage() {
  return (
    <Layout>
      <SEO
        title="About Us | WashMate"
        description="WashMate is Kolkata's premium laundry and dry cleaning service. Learn about our story, mission, and commitment to quality garment care."
      />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '72px 24px 110px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -50, left: 40, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#C7D2FE', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={12} /> Our Story
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            We Believe Your Clothes<br />
            <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Deserve Better.</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            {BRAND.name} was founded to solve a simple problem:<br />professional laundry quality, at your convenience.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '1000px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} className="stat-row">
          {[
            { emoji: '📅', label: 'Founded',          value: '2025'    },
            { emoji: '😊', label: 'Happy Customers',  value: '1,000+'  },
            { emoji: '📦', label: 'Orders Completed', value: '10,000+' },
            { emoji: '⭐', label: 'Customer Rating',  value: '4.9 / 5' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.07 }}
              style={{ padding: '20px 14px', borderRight: i < 3 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }} className="stat-cell">
              <div style={{ fontSize: '22px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 900, color: COLORS.primary, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Our Story ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="about-grid">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Our Story
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '20px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Born From a Simple Frustration
            </h2>
            <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9, marginBottom: '16px' }}>
              {BRAND.name} started in 2025 as an offline laundry service in Kolkata — built by founders frustrated by inconsistent local services and the hassle of drop-off schedules. In 2026, we took our operations online, bringing real-time tracking, flexible scheduling, and seamless booking to our customers.
            </p>
            <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9, marginBottom: '16px' }}>
              We combined professional cleaning standards with modern technology: real-time order tracking, flexible scheduling, and a no-nonsense quality guarantee.
            </p>
            <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9 }}>
              Today, we serve thousands of customers across Kolkata and nearby districts — driven by a simple belief that great laundry service should be effortless.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', borderRadius: '24px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', top: -60, right: -40, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', bottom: -30, left: 20, pointerEvents: 'none' }} />
            <div style={{ fontSize: '32px', marginBottom: '20px' }}>🫧</div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Why We're Different</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
              {[
                'Free pickup & delivery at your doorstep',
                'Real-time order tracking at every step',
                'Dedicated customer support 7 days a week',
                'Express same-day service available',
              ].map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(99,102,241,0.4)', border: '1px solid rgba(99,102,241,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={12} color="#A5B4FC" />
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ padding: '72px 24px', background: COLORS.background }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>What Drives Us</h2>
            <p style={{ fontSize: '16px', color: COLORS.muted, margin: 0 }}>The principles behind every order we handle.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="mv-grid">
            {[
              { icon: Target, color: COLORS.primary, bg: '#EEF2FF', title: 'Our Mission',
                text: 'To make professional garment care accessible and effortless for every household. We bring the quality of a premium dry cleaner to your doorstep — on your schedule.' },
              { icon: Eye, color: '#8B5CF6', bg: '#F5F3FF', title: 'Our Vision',
                text: "To become India's most trusted laundry service, known for reliability, transparency, and genuinely caring for every customer's garments as if they were our own." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: '20px', padding: '36px', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <item.icon size={24} color={item.color} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: COLORS.dark, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, margin: 0 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>Our Values</h2>
            <p style={{ fontSize: '16px', color: COLORS.muted, margin: 0 }}>The principles we live by every single day.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }} className="values-grid">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ background: COLORS.background, borderRadius: '20px', padding: '28px 22px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <v.icon size={22} color={v.color} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, marginBottom: '8px' }}>{v.title}</h3>
                <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Standards ── */}
      <section style={{ padding: '72px 24px', background: COLORS.background }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="about-grid">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-block', background: '#FDE68A', color: '#D97706', padding: '5px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quality Process
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '14px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Our Quality Standards
            </h2>
            <p style={{ fontSize: '15px', color: COLORS.muted, marginBottom: '32px', lineHeight: 1.7 }}>
              Every order follows our documented quality process — no exceptions, no shortcuts.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {qualityStandards.map((standard, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 18px', background: '#fff', borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
                  <CheckCircle size={17} color={COLORS.success} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: '14px', color: COLORS.dark, lineHeight: 1.5 }}>{standard}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', borderRadius: '24px', padding: '40px', border: '1.5px solid #A7F3D0' }}>
              <Award size={40} color="#10B981" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: COLORS.dark, marginBottom: '12px' }}>Quality Guaranteed</h3>
              <p style={{ fontSize: '14px', color: COLORS.darkMuted, lineHeight: 1.8, marginBottom: '28px' }}>
                Not happy with your order? We'll re-wash it for free — no questions asked. We stand behind every single delivery.
              </p>
              {[
                { label: 'Customer Satisfaction', value: '98%' },
                { label: 'On-time Delivery',      value: '99%' },
                { label: 'Re-wash Requests',      value: '< 1%' },
              ].map((r, i) => (
                <div key={r.label} style={{ marginBottom: i < 2 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: COLORS.muted, fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 800 }}>{r.value}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: '999px', background: '#D1FAE5', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: r.value }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#10B981,#34D399)', width: r.value }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection />

      <style>{`
        @media (max-width: 860px) {
          .about-grid, .mv-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .stat-cell:nth-child(n+3) { border-top: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 480px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
