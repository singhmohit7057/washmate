import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Phone, Mail, MapPin, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { COLORS, BRAND, WHATSAPP_URL } from '../../lib/constants';

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

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L0 24l6.335-1.509A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.017-1.376l-.36-.214-3.724.887.936-3.618-.235-.372A9.782 9.782 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

const footerLinks = {
  Services: [
    { label: 'Wash & Fold',        href: '/services#wash-fold' },
    { label: 'Dry Cleaning',       href: '/services#dry-cleaning' },
    { label: 'Steam Ironing',      href: '/services#steam-ironing' },
    { label: 'Shoe Cleaning',      href: '/services#shoe-cleaning' },
    { label: 'Curtain Cleaning',   href: '/services#curtain-cleaning' },
    { label: 'Blanket Cleaning',   href: '/services#blanket-cleaning' },
  ],
  Company: [
    { label: 'About Us',       href: '/about' },
    { label: 'How It Works',   href: '/how-it-works' },
    { label: 'Pricing',        href: '/pricing' },
    { label: 'Service Areas',  href: '/service-areas' },
    { label: 'Contact Us',     href: '/contact' },
  ],
  Account: [
    { label: 'Login',            href: '/login' },
    { label: 'Register',         href: '/register' },
    { label: 'Dashboard',        href: '/dashboard' },
    { label: 'Schedule Pickup',  href: '/schedule-pickup' },
    { label: 'Track Order',      href: '/order-tracking' },
    { label: 'Order History',    href: '/order-history' },
  ],
};

const trustItems = [
  { icon: Star,   label: '4.9★ Rating',       sub: '5,000+ reviews' },
  { icon: Shield, label: 'Quality Guaranteed', sub: 'Re-clean for free' },
  { icon: Clock,  label: 'Express Available',  sub: 'Same / next-day' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0D1117', color: '#9CA3AF' }}>

      {/* ── Trust strip ── */}
      <div style={{ borderBottom: '1px solid #1F2937' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }} className="ft-trust">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '11px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color="#818CF8" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#E5E7EB' }}>{label}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '1px' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 40px' }} className="ft-main">
        <div style={{ display: 'grid', gridTemplateColumns: '280px repeat(3, 1fr)', gap: '48px', marginBottom: '48px' }} className="ft-grid">

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '18px' }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shirt size={20} color="#fff" />
              </div>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.3px' }}>{BRAND.name}</span>
            </Link>
            <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#9CA3AF', marginBottom: '22px' }}>
              {BRAND.tagline} Professional laundry & dry cleaning with free doorstep pickup and delivery across Kolkata.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {[
                { href: BRAND.instagram, Icon: InstagramIcon, label: 'Instagram' },
                { href: BRAND.facebook,  Icon: FacebookIcon,  label: 'Facebook' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: '9px', background: '#1F2937', border: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color="#9CA3AF" />
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', padding: '10px 18px', borderRadius: '11px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              <WhatsAppIcon size={15} /> Chat on WhatsApp
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ color: '#E5E7EB', fontSize: '12px', fontWeight: 800, marginBottom: '18px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{section}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href}
                      style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E5E7EB')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '40px', padding: '24px', background: '#161B22', borderRadius: '16px', border: '1px solid #1F2937' }} className="ft-contact">
          {[
            { Icon: Phone,  label: 'Call Us',       value: BRAND.phone,   href: `tel:${BRAND.phone}` },
            { Icon: Mail,   label: 'Email Us',       value: BRAND.email,   href: `mailto:${BRAND.email}` },
            { Icon: MapPin, label: 'Based In',       value: BRAND.address, href: '/service-areas' },
          ].map(({ Icon, label, value, href }) => (
            <a key={label} href={href}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '9px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color="#818CF8" />
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: '13px', color: '#D1D5DB', marginTop: '2px', fontWeight: 500 }}>{value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1F2937', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }} className="ft-bottom">
          <p style={{ fontSize: '13px', margin: 0, color: '#6B7280' }}>
            © {new Date().getFullYear()} <span style={{ color: '#6B7280', fontWeight: 600 }}>{BRAND.name}</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy',     href: '/privacy-policy' },
              { label: 'Cookies Policy',     href: '/cookies-policy' },
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Refund Policy',      href: '/refund-policy' },
            ].map(item => (
              <Link key={item.href} to={item.href}
                style={{ color: '#6B7280', textDecoration: 'none', fontSize: '12px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9CA3AF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .ft-trust { flex-direction: row !important; flex-wrap: wrap !important; justify-content: center !important; gap: 14px !important; padding: 16px !important; }
          .ft-trust > div { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 6px !important; flex: 1 1 100px !important; }
          .ft-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; padding: 0 !important; }
          .ft-grid > div:first-child { grid-column: 1 / -1 !important; text-align: center !important; align-items: center !important; display: flex !important; flex-direction: column !important; }
          .ft-grid > div:first-child > div { justify-content: center !important; }
          .ft-grid h3 { font-size: 10px !important; }
          .ft-grid li a, .ft-grid li { font-size: 12px !important; }
          .ft-contact { grid-template-columns: 1fr !important; gap: 10px !important; padding: 16px !important; }
          .ft-contact > a { justify-content: center !important; }
          .ft-bottom { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 10px !important; }
          .ft-bottom > div { justify-content: center !important; flex-wrap: wrap !important; gap: 12px !important; }
          .ft-main { padding: 28px 16px 24px !important; }
        }
      `}</style>
    </footer>
  );
}
