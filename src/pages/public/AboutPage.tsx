import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, CheckCircle } from 'lucide-react';
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

export default function AboutPage() {
  return (
    <Layout>
      <SEO
        title="About Us | WashMate"
        description="WashMate is Kolkata's premium laundry and dry cleaning service. Learn about our story, mission, and commitment to quality garment care."
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a2e 100%)`, padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: '#fff', marginBottom: '20px', letterSpacing: '-1px' }}>
              We Believe Your Clothes<br />
              <span style={{ color: COLORS.primary }}>Deserve Better.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7 }}>
              {BRAND.name} was founded to solve a simple problem: professional laundry quality at your convenience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="about-grid">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase' }}>
                Our Story
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '20px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                Born From a Simple Frustration
              </h2>
              <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9, marginBottom: '16px' }}>
                {BRAND.name} started in 2022 when our founders — frustrated by inconsistent local laundry services and the hassle of drop-off schedules — decided to build something better.
              </p>
              <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9, marginBottom: '16px' }}>
                We combined professional cleaning standards with modern technology: real-time order tracking, flexible scheduling, and a no-nonsense quality guarantee.
              </p>
              <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.9 }}>
                Today, we serve thousands of customers across Kolkata and nearby districts, and we're growing every week — driven by a simple belief that great laundry service should be effortless.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ background: COLORS.background, borderRadius: '24px', padding: '40px', border: `1px solid ${COLORS.border}` }}>
                {[
                  { value: '2022', label: 'Founded' },
                  { value: '5,000+', label: 'Happy Customers' },
                  { value: '50,000+', label: 'Orders Completed' },
                  { value: '4.9/5', label: 'Customer Rating' },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '16px 0', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: COLORS.muted }}>{stat.label}</span>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: COLORS.primary }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 24px', background: COLORS.background }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="mv-grid">
          {[
            {
              icon: Target, color: COLORS.primary, title: 'Our Mission',
              text: 'To make professional garment care accessible and effortless for every household. We bring the quality of a premium dry cleaner to your doorstep — on your schedule.',
            },
            {
              icon: Eye, color: '#8B5CF6', title: 'Our Vision',
              text: 'To become India\'s most trusted laundry service, known for reliability, transparency, and genuinely caring for every customer\'s garments as if they were our own.',
            },
          ].map(item => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
            >
              <div style={{ width: 60, height: 60, borderRadius: '16px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <item.icon size={28} color={item.color} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: COLORS.dark, marginBottom: '16px' }}>{item.title}</h2>
              <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, margin: 0 }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quality Standards */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Award size={40} color={COLORS.primary} style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 900, color: COLORS.dark, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Our Quality Standards
            </h2>
            <p style={{ fontSize: '16px', color: COLORS.muted, lineHeight: 1.6 }}>
              Every order follows our documented quality process — no exceptions.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {qualityStandards.map((standard, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '20px 24px', background: COLORS.background, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}
              >
                <CheckCircle size={20} color={COLORS.success} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: '15px', color: COLORS.dark, lineHeight: 1.5 }}>{standard}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <style>{`
        @media (max-width: 768px) {
          .about-grid, .mv-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
