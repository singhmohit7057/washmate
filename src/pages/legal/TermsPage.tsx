import React from 'react';
import { FileText } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { BRAND } from '../../lib/constants';
import { LegalPageShell } from './PrivacyPolicyPage';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      `By accessing or using ${BRAND.name}'s website and services, you agree to be bound by these Terms and Conditions.`,
      'If you do not agree with any part of these terms, you may not use our services.',
      'We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of revised terms.',
    ],
  },
  {
    title: '2. Services Description',
    content: [
      `${BRAND.name} provides professional laundry and dry cleaning services including Wash & Fold, Dry Cleaning, Steam Ironing, Shoe Cleaning, Curtain Cleaning, and Blanket Cleaning.`,
      'Services are available in select areas of West Bengal. Coverage areas are subject to change.',
      'We reserve the right to refuse service at our discretion.',
    ],
  },
  {
    title: '3. Account Registration',
    content: [
      'You must create an account to schedule pickups and track orders.',
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'You must provide accurate, current, and complete information during registration.',
      'You must be at least 18 years old to create an account.',
      'You are responsible for all activity that occurs under your account.',
    ],
  },
  {
    title: '4. Booking and Scheduling',
    content: [
      'Pickups are scheduled based on availability in your area.',
      'You must be available (or have someone available) at the pickup address during the scheduled time window.',
      'Missed pickups without prior notice may incur a rescheduling fee.',
      'We reserve the right to reschedule pickups due to operational constraints, weather, or force majeure events.',
    ],
  },
  {
    title: '5. Pricing and Payment',
    content: [
      'All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes.',
      'Prices are subject to change without prior notice. The price applicable is the one at the time of booking.',
      'Payment is accepted via the methods listed on the checkout page.',
      'Coupon codes are valid only for eligible orders and cannot be combined unless specified.',
    ],
  },
  {
    title: '6. Care of Garments',
    content: [
      'We follow care label instructions for all garments. Items without care labels are processed at our standard settings.',
      'Please inform us of any special handling requirements at the time of pickup.',
      'We are not responsible for damage to items that were not disclosed as delicate or valuable.',
      'We strongly recommend not sending irreplaceable, heirloom, or extremely high-value items.',
    ],
  },
  {
    title: '7. Liability and Damage Claims',
    content: [
      'In the unlikely event of damage or loss, our liability is limited to 10 times the service charge for the affected item.',
      'Damage claims must be reported within 24 hours of delivery with photographic evidence.',
      'We are not liable for pre-existing damage, color fading, shrinkage due to care label non-compliance, or items left in pockets.',
      'We carry insurance for items in our care. Claims are subject to review and verification.',
    ],
  },
  {
    title: '8. Turnaround Time',
    content: [
      'Standard turnaround times are estimates and not guaranteed.',
      'Express service is available at an additional charge, subject to availability.',
      'Delays due to high order volumes, holidays, or unforeseen circumstances do not constitute grounds for cancellation.',
    ],
  },
  {
    title: '9. Intellectual Property',
    content: [
      `All content on ${BRAND.name}'s website — including logos, text, graphics, and code — is the property of ${BRAND.name}.`,
      'You may not reproduce, copy, or distribute any content without prior written permission.',
    ],
  },
  {
    title: '10. Prohibited Use',
    content: [
      'You may not use our service for any unlawful purpose.',
      'You may not attempt to gain unauthorized access to our systems.',
      'You may not submit false, misleading, or fraudulent orders.',
      'Abuse of promotional offers or coupon codes may result in account suspension.',
    ],
  },
  {
    title: '11. Termination',
    content: [
      'We reserve the right to terminate or suspend your account for violation of these terms.',
      'You may delete your account at any time by contacting us.',
      'Upon termination, your right to use the service ceases immediately.',
    ],
  },
  {
    title: '12. Governing Law',
    content: [
      'These Terms are governed by the laws of India.',
      'Any disputes arising from these terms shall be subject to the jurisdiction of courts in West Bengal, India.',
    ],
  },
  {
    title: '13. Contact Us',
    content: [
      `For questions about these Terms, please contact: ${BRAND.email}`,
      `Phone: ${BRAND.phone}`,
      `Address: ${BRAND.address}`,
    ],
  },
];

export default function TermsPage() {
  return (
    <Layout>
      <SEO title="Terms & Conditions | WashMate" description="WashMate's Terms and Conditions — please read before using our laundry services." />
      <LegalPageShell
        icon={<FileText size={28} color="#3B82F6" />}
        iconBg="#EFF6FF"
        iconColor="#3B82F6"
        badge="Legal"
        title="Terms & Conditions"
        subtitle="Last updated: June 2026"
        intro={`Please read these Terms and Conditions carefully before using ${BRAND.name}'s website or services. These terms constitute a legally binding agreement between you and ${BRAND.name}.`}
        sections={sections}
      />
    </Layout>
  );
}
