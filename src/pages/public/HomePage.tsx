import React from 'react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import HeroSection from '../../components/home/HeroSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import ServicesSection from '../../components/home/ServicesSection';
import DeliverySection from '../../components/home/DeliverySection';
import WhyChooseSection from '../../components/home/WhyChooseSection';
import ServiceAreasSection from '../../components/home/ServiceAreasSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import FAQSection from '../../components/home/FAQSection';
import CTASection from '../../components/home/CTASection';
import { BRAND } from '../../lib/constants';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRAND.name,
  description: 'Professional laundry & dry cleaning service with free home pickup and delivery in Kolkata.',
  url: 'https://washmate.in',
  telephone: BRAND.phone,
  email: BRAND.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Kolkata', addressRegion: 'West Bengal', addressCountry: 'IN' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '500' },
  openingHours: 'Mo-Su 08:00-20:00',
  priceRange: '₹₹',
};

export default function HomePage() {
  return (
    <Layout>
      <SEO
        title={`${BRAND.name} — ${BRAND.tagline}`}
        description="WashMate offers professional laundry & dry cleaning with free pickup and delivery in Kolkata, Barrackpore, Naihati, Kalyani. Schedule now!"
        keywords="laundry service Kolkata, dry cleaning home pickup, wash and fold Kolkata, laundry delivery Barrackpore"
        structuredData={structuredData}
      />
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      <DeliverySection />
      <WhyChooseSection />
      <ServiceAreasSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
}
