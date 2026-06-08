import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Truck, Sparkles, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import CTASection from '../../components/home/CTASection';
import { COLORS } from '../../lib/constants';

const steps = [
  {
    step: 1, icon: Calendar, title: 'Schedule Pickup', color: COLORS.primary,
    description: 'Book your pickup online in under 2 minutes. Choose your preferred date, time slot, and address. Select the services you need and any special instructions for your garments.',
    details: ['Choose pickup date & time', 'Select services needed', 'Add special care instructions', 'Apply coupon code if available'],
  },
  {
    step: 2, icon: Truck, title: 'We Collect', color: '#8B5CF6',
    description: 'Our trained pickup agent arrives at your doorstep at the scheduled time. Each garment is inspected, tagged individually, and securely packaged to prevent mixing.',
    details: ['Agent arrives on time', 'Garments inspected & tagged', 'Secure packaging', 'Digital receipt provided'],
  },
  {
    step: 3, icon: Sparkles, title: 'Expert Cleaning', color: '#F59E0B',
    description: 'Your garments are cleaned using the appropriate method — wash & fold, dry cleaning, or steam ironing — by our trained professionals using premium, fabric-safe products.',
    details: ['Sorted by fabric type & color', 'Appropriate cleaning method applied', 'Premium detergents used', 'Special stain treatment if needed'],
  },
  {
    step: 4, icon: CheckCircle2, title: 'Quality Check', color: '#10B981',
    description: 'Every garment passes a 3-point quality inspection before packaging. We check for cleanliness, proper pressing, and ensure no damage before packing.',
    details: ['Cleanliness inspection', 'Pressing & finishing check', 'Damage assessment', 'Professional packaging'],
  },
  {
    step: 5, icon: Package, title: 'Delivered Fresh', color: '#EF4444',
    description: 'Your freshly cleaned garments are delivered back to your door at your preferred time. We\'ll notify you when your order is out for delivery.',
    details: ['Delivery notification sent', 'On-time delivery guaranteed', 'Contactless delivery option', 'Satisfaction guarantee'],
  },
];

export default function HowItWorksPage() {
  return (
    <Layout>
      <SEO
        title="How It Works | WashMate"
        description="Learn how WashMate's laundry pickup and delivery service works. Schedule, we collect, clean, quality check, and deliver."
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-1px' }}>
              How <span style={{ color: COLORS.primary }}>WashMate</span> Works
            </h1>
            <p style={{ fontSize: '18px', color: COLORS.muted, lineHeight: 1.7 }}>
              Five simple steps from your door to fresh, clean clothes — and back again.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${COLORS.primary}, #8B5CF6, #F59E0B, #10B981, #EF4444)`, borderRadius: '999px' }} className="timeline-line" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}
                >
                  {/* Icon */}
                  <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                    <div style={{ width: 58, height: 58, borderRadius: '50%', background: `${step.color}15`, border: `3px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 4px white` }}>
                      <step.icon size={24} color={step.color} />
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step.step}</span>
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, color: COLORS.dark, marginBottom: '12px' }}>{step.title}</h2>
                    <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, marginBottom: '20px' }}>{step.description}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {step.details.map(d => (
                        <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: COLORS.darkMuted }}>
                          <CheckCircle2 size={14} color={step.color} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '48px' }}
          >
            <Link
              to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '17px', boxShadow: `0 8px 24px ${COLORS.primary}40` }}
            >
              Schedule My First Pickup <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .timeline-line { left: 22px !important; }
        }
      `}</style>

      <CTASection />
    </Layout>
  );
}
