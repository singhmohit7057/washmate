import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Truck, Sparkles, CheckCircle2, Package, ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import { COLORS } from '../../lib/constants';

const steps = [
  {
    step: 1, icon: Calendar, color: COLORS.primary, bg: '#EEF2FF',
    title: 'Schedule Pickup',
    description: 'Book your pickup online in under 2 minutes. Choose your preferred date, time slot, and address.',
    details: ['Choose pickup date & time slot', 'Select services needed', 'Add special care instructions', 'Apply coupon code if available'],
  },
  {
    step: 2, icon: Truck, color: '#8B5CF6', bg: '#F5F3FF',
    title: 'We Collect',
    description: 'Our trained pickup agent arrives at your doorstep at the scheduled time. Each garment is individually inspected and tagged.',
    details: ['Agent arrives on time', 'Garments inspected & tagged', 'Secure packaging', 'Digital receipt provided'],
  },
  {
    step: 3, icon: Sparkles, color: '#F59E0B', bg: '#FFFBEB',
    title: 'Expert Cleaning',
    description: 'Your garments are cleaned using the right method by our trained professionals using premium, fabric-safe products.',
    details: ['Sorted by fabric type & color', 'Appropriate cleaning method applied', 'Premium detergents used', 'Special stain treatment if needed'],
  },
  {
    step: 4, icon: Shield, color: '#10B981', bg: '#F0FDF4',
    title: 'Quality Check',
    description: 'Every garment passes a 3-point quality inspection before packaging — cleanliness, pressing, and damage check.',
    details: ['Cleanliness inspection', 'Pressing & finishing check', 'Damage assessment', 'Professional packaging'],
  },
  {
    step: 5, icon: Package, color: '#EF4444', bg: '#FFF5F5',
    title: 'Delivered Fresh',
    description: "Your freshly cleaned garments are delivered back to your door at your preferred time with a notification.",
    details: ['Delivery notification sent', 'On-time delivery guaranteed', 'Contactless delivery option', 'Satisfaction guarantee'],
  },
];

const perks = [
  { icon: Zap,         color: '#F97316', bg: '#FFF7ED', title: 'Express Available',  text: 'Same-day or next-day service for urgent needs.' },
  { icon: Clock,       color: COLORS.primary, bg: '#EEF2FF', title: 'Flexible Slots', text: 'Morning, afternoon, or evening — you choose.' },
  { icon: Shield,      color: '#10B981', bg: '#F0FDF4', title: 'Quality Guarantee', text: "Not satisfied? We'll re-clean for free." },
  { icon: CheckCircle2,color: '#8B5CF6', bg: '#F5F3FF', title: 'Real-time Tracking', text: 'Track your order at every step of the process.' },
];

export default function HowItWorksPage() {
  return (
    <Layout>
      <SEO
        title="How It Works | WashMate"
        description="Learn how WashMate's laundry pickup and delivery service works. Schedule, we collect, clean, quality check, and deliver."
      />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '72px 24px 110px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -50, left: 40, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#C7D2FE', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
            <Sparkles size={12} /> Simple 5-step process
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            How{' '}
            <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WashMate</span>
            {' '}Works
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            Five simple steps from your door to fresh,<br />clean clothes — and back again.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '900px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          {[
            { emoji: '⏱️', label: 'Book in',        value: '< 2 min'  },
            { emoji: '🚀', label: 'Express Turnaround', value: '24 hrs'  },
            { emoji: '⭐', label: 'Customer Rating', value: '4.9 / 5'  },
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

      {/* ── Steps ── */}
      <section style={{ padding: '64px 24px 72px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 10px', letterSpacing: '-0.5px' }}>The Process</h2>
            <p style={{ fontSize: '15px', color: COLORS.muted, margin: 0 }}>Everything handled end-to-end so you don't have to lift a finger.</p>
          </motion.div>

          {/* Step cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, i) => (
              <motion.div key={step.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '260px 1fr', alignItems: 'stretch' }}
                className="step-card">

                {/* Left accent */}
                <div style={{ background: `linear-gradient(135deg,${step.bg},#fff)`, borderRight: `1px solid ${COLORS.border}`, padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '13px', background: step.bg, border: `1.5px solid ${step.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <step.icon size={20} color={step.color} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${step.color}15`, padding: '3px 10px', borderRadius: '999px' }}>Step {step.step}</span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: COLORS.dark, margin: 0, lineHeight: 1.2 }}>{step.title}</h2>
                  <p style={{ fontSize: '13px', color: COLORS.muted, lineHeight: 1.7, margin: 0 }}>{step.description}</p>
                </div>

                {/* Right details */}
                <div style={{ padding: '32px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignContent: 'center' }} className="step-details">
                  {step.details.map(d => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 14px', background: COLORS.background, borderRadius: '10px', border: `1px solid ${COLORS.border}` }}>
                      <CheckCircle2 size={14} color={step.color} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: COLORS.dark, fontWeight: 600, lineHeight: 1.4 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '48px', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '15px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
              Schedule My First Pickup <ArrowRight size={16} />
            </Link>
            <Link to="/schedule-pickup?type=express"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFF7ED', color: '#F97316', border: '1.5px solid #FED7AA', textDecoration: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 800, fontSize: '15px' }}>
              <Zap size={15} /> Book Express
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ padding: '64px 24px 80px', background: COLORS.background }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 10px', letterSpacing: '-0.5px' }}>Why Choose WashMate</h2>
            <p style={{ fontSize: '15px', color: COLORS.muted, margin: 0 }}>Everything designed to make laundry effortless for you.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px' }} className="perks-grid">
            {perks.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: '#fff', borderRadius: '20px', padding: '26px 22px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: '14px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <p.icon size={22} color={p.color} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: COLORS.dark, margin: '0 0 7px' }}>{p.title}</h3>
                <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />

      <style>{`
        @media (max-width: 860px) {
          .step-card { grid-template-columns: 1fr !important; }
          .perks-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .step-details { grid-template-columns: 1fr !important; }
          .perks-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
