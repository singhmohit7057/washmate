import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

const NAVBAR_OFFSET = 96;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function ScrollHandler() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(() => scrollToId(id), 350);
      return () => clearTimeout(t);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

// Public pages
const HomePage = lazy(() => import('./pages/public/HomePage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage'));
const ServiceAreasPage = lazy(() => import('./pages/public/ServiceAreasPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));

// Auth pages
const LoginPage = lazy(() => import('./pages/customer/LoginPage'));
const RegisterPage = lazy(() => import('./pages/customer/RegisterPage'));

// Customer pages
const DashboardPage = lazy(() => import('./pages/customer/DashboardPage'));
const SchedulePickupPage = lazy(() => import('./pages/customer/SchedulePickupPage'));
const OrderTrackingPage = lazy(() => import('./pages/customer/OrderTrackingPage'));
const OrderHistoryPage = lazy(() => import('./pages/customer/OrderHistoryPage'));
const ProfilePage = lazy(() => import('./pages/customer/ProfilePage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const SuperAdminDashboardPage = lazy(() => import('./pages/admin/SuperAdminDashboardPage'));

// Legal pages
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const CookiesPolicyPage = lazy(() => import('./pages/legal/CookiesPolicyPage'));
const TermsPage         = lazy(() => import('./pages/legal/TermsPage'));
const RefundPolicyPage  = lazy(() => import('./pages/legal/RefundPolicyPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <ScrollHandler />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/service-areas" element={<ServiceAreasPage />} />
            <Route path="/service-areas/:slug" element={<ServiceAreasPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer (protected) */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/schedule-pickup" element={
              <ProtectedRoute><SchedulePickupPage /></ProtectedRoute>
            } />
            <Route path="/order-tracking" element={
              <ProtectedRoute><OrderTrackingPage /></ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* Admin (protected, admin+) */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>
            } />

            {/* Super Admin (protected, super_admin only) */}
            <Route path="/super-admin" element={
              <ProtectedRoute requiredRole="super_admin"><SuperAdminDashboardPage /></ProtectedRoute>
            } />

            {/* Legal */}
            <Route path="/privacy-policy"  element={<PrivacyPolicyPage />} />
            <Route path="/cookies-policy"  element={<CookiesPolicyPage />} />
            <Route path="/terms"           element={<TermsPage />} />
            <Route path="/refund-policy"   element={<RefundPolicyPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
