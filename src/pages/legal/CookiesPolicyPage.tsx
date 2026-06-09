import React from 'react';
import { Cookie } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { BRAND } from '../../lib/constants';
import { LegalPageShell } from './PrivacyPolicyPage';

const sections = [
  {
    title: '1. What Are Cookies',
    content: [
      'Cookies are small text files placed on your device when you visit a website.',
      'They help websites remember your preferences, keep you logged in, and understand how you use the site.',
      'Cookies are widely used and do not contain personally identifiable information on their own.',
    ],
  },
  {
    title: '2. Types of Cookies We Use',
    content: [
      'Strictly Necessary Cookies: Required for the website to function. These include session cookies that keep you logged in. They cannot be disabled.',
      'Performance Cookies: Help us understand how visitors interact with our website by collecting anonymous analytics data (e.g., pages visited, time spent).',
      'Functional Cookies: Remember your preferences such as language, location, and account settings to provide a more personalized experience.',
      'Marketing Cookies: Used to deliver relevant advertisements. We currently do not run paid advertising campaigns, so these are minimal.',
    ],
  },
  {
    title: '3. Specific Cookies We Set',
    content: [
      'supabase-auth-token — Authentication session token. Essential for keeping you logged in. Expires when you sign out.',
      'sb-refresh-token — Used to refresh your authentication session automatically.',
      'user-preferences — Stores your site preferences (e.g., notification settings). Session-only.',
      'analytics-session — Anonymous session identifier for usage analytics. Expires after 30 minutes of inactivity.',
    ],
  },
  {
    title: '4. Third-Party Cookies',
    content: [
      'We may use third-party services that set their own cookies, including analytics and customer support tools.',
      'These third parties have their own privacy and cookie policies, which we encourage you to review.',
      'We do not control third-party cookies and are not responsible for their content.',
    ],
  },
  {
    title: '5. How to Manage Cookies',
    content: [
      'Browser Settings: You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies.',
      'Chrome: Settings → Privacy and Security → Cookies and other site data',
      'Firefox: Settings → Privacy & Security → Cookies and Site Data',
      'Safari: Preferences → Privacy → Manage Website Data',
      'Note: Disabling strictly necessary cookies will affect your ability to log in and use the website.',
    ],
  },
  {
    title: '6. Cookie Consent',
    content: [
      'By continuing to use our website, you consent to our use of cookies as described in this policy.',
      'You can withdraw consent at any time by clearing your cookies and adjusting your browser settings.',
    ],
  },
  {
    title: '7. Updates to This Policy',
    content: [
      'We may update this Cookies Policy as we introduce new features or change our technology partners.',
      'We will notify you of significant changes by posting a notice on our website.',
    ],
  },
  {
    title: '8. Contact Us',
    content: [
      `For questions about our use of cookies, contact us at: ${BRAND.email}`,
      `Phone: ${BRAND.phone}`,
    ],
  },
];

export default function CookiesPolicyPage() {
  return (
    <Layout>
      <SEO title="Cookies Policy | WashMate" description="WashMate's Cookies Policy — how we use cookies and similar technologies." />
      <LegalPageShell
        icon={<Cookie size={28} color="#F59E0B" />}
        iconBg="#FFFBEB"
        iconColor="#F59E0B"
        badge="Legal"
        title="Cookies Policy"
        subtitle="Last updated: June 2026"
        intro={`This Cookies Policy explains how ${BRAND.name} uses cookies and similar tracking technologies on our website. We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.`}
        sections={sections}
      />
    </Layout>
  );
}
