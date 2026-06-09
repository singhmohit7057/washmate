import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Phone, Mail, MapPin } from 'lucide-react';

function InstagramIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
import { COLORS, BRAND, WHATSAPP_URL } from '../../lib/constants';

const footerLinks = {
  Services: [
    { label: 'Wash & Fold', href: '/services#wash-fold' },
    { label: 'Dry Cleaning', href: '/services#dry-cleaning' },
    { label: 'Steam Ironing', href: '/services#steam-ironing' },
    { label: 'Shoe Cleaning', href: '/services#shoe-cleaning' },
    { label: 'Curtain Cleaning', href: '/services#curtain-cleaning' },
    { label: 'Blanket Cleaning', href: '/services#blanket-cleaning' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Schedule Pickup', href: '/schedule-pickup' },
    { label: 'Track Order', href: '/order-tracking' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: COLORS.dark, color: '#9CA3AF', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 32px' }} className="footer-inner">
        {/* Top section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shirt size={20} color="#fff" />
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>{BRAND.name}</span>
            </Link>
            <p style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '20px', color: '#9CA3AF' }}>
              {BRAND.tagline}<br />
              Professional laundry & dry cleaning with free pickup and delivery.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { href: BRAND.instagram, Icon: InstagramIcon },
                { href: BRAND.facebook, Icon: FacebookIcon },
                { href: BRAND.twitter, Icon: TwitterIcon },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: '8px', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                >
                  <Icon size={16} color="#9CA3AF" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{section}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { Icon: Phone, text: BRAND.phone, href: `tel:${BRAND.phone}` },
                { Icon: Mail, text: BRAND.email, href: `mailto:${BRAND.email}` },
                { Icon: MapPin, text: BRAND.address, href: '#' },
              ].map(({ Icon, text, href }) => (
                <a key={text} href={href} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>
                  <Icon size={16} style={{ marginTop: 2, flexShrink: 0, color: COLORS.primary }} />
                  {text}
                </a>
              ))}
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', background: '#25D366', color: '#fff', padding: '10px 18px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #1F2937', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }} className="footer-bottom">
          <p style={{ fontSize: '14px', margin: 0 }}>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
              <a key={item} href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .footer-inner { padding: 40px 16px 24px !important; }
          .footer-bottom { flex-direction: column; align-items: flex-start !important; gap: 8px !important; }
          .footer-bottom > div { gap: 12px !important; }
        }
      `}</style>
    </footer>
  );
}
