import React from 'react';
import { RefreshCcw } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { BRAND } from '../../lib/constants';
import { LegalPageShell } from './PrivacyPolicyPage';

const sections = [
  {
    title: '1. Our Commitment',
    content: [
      `At ${BRAND.name}, your satisfaction is our top priority. If you are not completely satisfied with our service, we want to make it right.`,
      'This Refund Policy outlines when and how refunds are issued, and what steps to take if you have a concern.',
    ],
  },
  {
    title: '2. Eligibility for Refunds',
    content: [
      'Refunds are available in the following situations:',
      'Service Quality Issue: If your items are not cleaned to the standard described, we will re-clean them at no charge or issue a full/partial refund.',
      'Item Damage or Loss: If an item is damaged or lost while in our care, you are eligible for compensation (see Damage Policy).',
      'Order Cancellation: If you cancel before pickup, you are eligible for a full refund. See cancellation terms below.',
      'Incorrect Charges: If you were charged incorrectly, the excess amount will be refunded promptly.',
    ],
  },
  {
    title: '3. Non-Refundable Situations',
    content: [
      'Refunds will NOT be issued in the following cases:',
      'Change of mind after the order has been picked up and processed.',
      'Damage caused by pre-existing conditions not disclosed at pickup.',
      'Items that were damaged due to incorrect care label instructions or undisclosed delicate materials.',
      'Dissatisfaction based on personal preference (e.g., preferred fold style) rather than service failure.',
      'Delays caused by force majeure events (floods, strikes, lockdowns, etc.).',
    ],
  },
  {
    title: '4. Cancellation Policy',
    content: [
      'Before Pickup: You may cancel an order at any time before the scheduled pickup time for a full refund.',
      'After Pickup: Once items are picked up, cancellation is not possible as processing begins immediately.',
      'Rescheduling: You may reschedule a pickup up to 2 hours before the scheduled time at no charge.',
      'No-Show: If our pickup agent arrives and no one is available, a rescheduling fee of ₹50 may apply.',
    ],
  },
  {
    title: '5. Damage Claims & Compensation',
    content: [
      'All damage claims must be raised within 24 hours of delivery.',
      'Submit a claim by emailing us at ' + BRAND.email + ' with your order ID and photographs of the damaged item.',
      'Our team will review the claim within 2 business days.',
      'Compensation is capped at 10× the service charge for the affected item.',
      'For high-value items (over ₹5,000), we recommend declaring the value at the time of pickup for appropriate handling.',
    ],
  },
  {
    title: '6. Re-Cleaning Policy',
    content: [
      'If you are unhappy with the quality of cleaning, contact us within 24 hours of delivery.',
      'We will collect the items and re-clean them at no additional charge.',
      'Re-cleaning is offered once per order. If still unsatisfactory, a refund will be issued.',
    ],
  },
  {
    title: '7. Refund Process',
    content: [
      'Approved refunds are processed within 5–7 business days.',
      'Refunds are credited to the original payment method used at checkout.',
      'UPI/bank transfer refunds may take an additional 2–3 days depending on your bank.',
      'You will receive an email confirmation once the refund is processed.',
    ],
  },
  {
    title: '8. Coupon & Promotional Credits',
    content: [
      'Discount coupons and promotional credits are non-refundable and non-transferable.',
      'If a refund is issued on an order that used a coupon, only the amount actually paid (after discount) will be refunded.',
    ],
  },
  {
    title: '9. How to Request a Refund',
    content: [
      'Step 1: Email us at ' + BRAND.email + ' with subject line: "Refund Request – [Your Order ID]"',
      'Step 2: Include your name, order ID, issue description, and photos (if applicable).',
      'Step 3: Our support team will respond within 1 business day.',
      'Step 4: If approved, refund will be processed within 5–7 business days.',
    ],
  },
  {
    title: '10. Contact Us',
    content: [
      `For refund queries, contact our support team:`,
      `Email: ${BRAND.email}`,
      `Phone: ${BRAND.phone}`,
      `Business Hours: Monday–Saturday, 9 AM – 7 PM`,
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <Layout>
      <SEO title="Refund Policy | WashMate" description="WashMate's Refund Policy — how we handle refunds, cancellations, and damage claims." />
      <LegalPageShell
        icon={<RefreshCcw size={28} color="#10B981" />}
        iconBg="#F0FDF4"
        iconColor="#10B981"
        badge="Legal"
        title="Refund Policy"
        subtitle="Last updated: June 2026"
        intro={`${BRAND.name} strives to deliver the highest quality laundry service. This Refund Policy describes your rights and our obligations regarding refunds, cancellations, and damage claims.`}
        sections={sections}
      />
    </Layout>
  );
}
