import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { COLORS, BRAND } from '../../lib/constants';

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal Information: When you create an account or schedule a pickup, we collect your name, email address, phone number, and delivery address.',
      'Order Information: Details about the laundry items, service type, pickup/delivery preferences, and payment records.',
      'Usage Data: IP address, browser type, pages visited, time spent on the site, and device information — collected automatically to improve our service.',
      'Communication Data: Any messages, feedback, or queries you send us via contact forms, email, or WhatsApp.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To process and manage your laundry orders and schedule pickups and deliveries.',
      'To send order confirmations, status updates, and delivery notifications.',
      'To respond to your queries and provide customer support.',
      'To improve our website, services, and user experience.',
      'To send promotional offers and service updates (you may opt out at any time).',
      'To comply with legal obligations and prevent fraud.',
    ],
  },
  {
    title: '3. How We Share Your Information',
    content: [
      'We do NOT sell, trade, or rent your personal information to third parties.',
      'Service Providers: We may share information with trusted partners (e.g., delivery personnel, payment processors) strictly to fulfill your orders.',
      'Legal Requirements: We may disclose information if required by law, court order, or government authority.',
      'Business Transfers: In case of merger or acquisition, your data may be transferred — you will be notified in advance.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We implement industry-standard security measures including SSL encryption, secure servers, and access controls.',
      'Your password is stored in hashed form and is never accessible to our team.',
      'Despite our efforts, no method of internet transmission is 100% secure. We cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Cookies',
    content: [
      'We use cookies to maintain your session, remember preferences, and analyze usage patterns.',
      'You can control cookies through your browser settings. Disabling cookies may affect certain features of the website.',
      'For full details, please see our Cookies Policy.',
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      'Access: You may request a copy of the personal data we hold about you.',
      'Correction: You may update or correct your information through your profile page.',
      'Deletion: You may request deletion of your account and personal data by contacting us.',
      'Opt-Out: You may unsubscribe from marketing emails at any time using the unsubscribe link.',
    ],
  },
  {
    title: '7. Data Retention',
    content: [
      'We retain your personal data for as long as your account is active or as needed to provide services.',
      'Order records may be retained for up to 5 years for accounting and legal compliance.',
      'Upon account deletion, personal data is removed within 30 days, except where legally required.',
    ],
  },
  {
    title: '8. Third-Party Links',
    content: [
      'Our website may contain links to third-party websites. We are not responsible for their privacy practices.',
      'We recommend reviewing the privacy policy of any third-party site you visit.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'Our services are not directed to individuals under the age of 18.',
      'We do not knowingly collect personal information from children.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.',
      'Continued use of our services after changes constitutes your acceptance of the revised policy.',
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      `If you have any questions about this Privacy Policy, please contact us at: ${BRAND.email}`,
      `Phone: ${BRAND.phone}`,
      `Address: ${BRAND.address}`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <SEO title="Privacy Policy | WashMate" description="WashMate's Privacy Policy — how we collect, use, and protect your personal information." />
      <LegalPageShell
        icon={<Shield size={28} color="#8B5CF6" />}
        iconBg="#F5F3FF"
        iconColor="#8B5CF6"
        badge="Legal"
        title="Privacy Policy"
        subtitle={`Last updated: June 2026`}
        intro={`At ${BRAND.name}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.`}
        sections={sections}
      />
    </Layout>
  );
}

// ─── Shared shell ──────────────────────────────────────────────────────────────
export function LegalPageShell({ icon, iconBg, iconColor, badge, title, subtitle, intro, sections }: {
  icon: React.ReactNode; iconBg: string; iconColor: string;
  badge: string; title: string; subtitle: string; intro: string;
  sections: { title: string; content: string[] }[];
}) {
  return (
    <>
      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a2e 100%)`, padding: '88px 24px 56px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '18px', background: iconBg, marginBottom: '20px' }}>
            {icon}
          </div>
          <div style={{ display: 'inline-block', background: `${iconColor}20`, color: iconColor, padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', marginLeft: '8px' }}>
            {badge}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-1px' }}>{title}</h1>
          <p style={{ color: '#9CA3AF', fontSize: '15px' }}>{subtitle}</p>
        </motion.div>
      </section>

      {/* Content */}
      <section style={{ padding: '64px 24px 80px', background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Intro */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: COLORS.background, borderRadius: '16px', padding: '24px 28px', marginBottom: '40px', border: `1px solid ${COLORS.border}`, borderLeft: `4px solid ${iconColor}` }}>
            <p style={{ fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.8, margin: 0 }}>{intro}</p>
          </motion.div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {sections.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, marginBottom: '14px', paddingBottom: '10px', borderBottom: `2px solid ${COLORS.border}` }}>
                  {section.title}
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.content.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.75 }}>
                      <span style={{ marginTop: '7px', width: 6, height: 6, borderRadius: '50%', background: iconColor, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
