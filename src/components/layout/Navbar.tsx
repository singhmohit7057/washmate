import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shirt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, BRAND } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : 'none',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: COLORS.dark,
    fontWeight: 800,
    fontSize: '22px',
    letterSpacing: '-0.5px',
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: active ? COLORS.primary : COLORS.darkMuted,
    fontWeight: active ? 600 : 500,
    fontSize: '15px',
    transition: 'color 0.2s',
    padding: '6px 0',
    position: 'relative',
  });

  return (
    <nav style={navStyle} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={logoStyle} aria-label={`${BRAND.name} - Home`}>
          <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shirt size={20} color="#fff" />
          </div>
          {BRAND.name}
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.href} to={link.href} style={linkStyle(location.pathname === link.href)}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          {user ? (
            <>
              <Link
                to={user.role === 'super_admin' ? '/super-admin' : user.role === 'admin' ? '/admin' : '/dashboard'}
                style={{ textDecoration: 'none', color: COLORS.primary, fontWeight: 600, fontSize: '15px' }}
              >
                {user.role === 'customer' ? 'Dashboard' : 'Admin Panel'}
              </Link>
              <button
                onClick={handleSignOut}
                style={{ background: 'transparent', border: `1.5px solid ${COLORS.border}`, borderRadius: '10px', padding: '8px 18px', cursor: 'pointer', fontWeight: 500, color: COLORS.darkMuted, fontSize: '14px' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: COLORS.darkMuted, fontWeight: 500, fontSize: '15px' }}>
                Login
              </Link>
              <Link
                to="/schedule-pickup"
                style={{ background: COLORS.primary, color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: 600, fontSize: '15px', transition: 'background 0.2s' }}
              >
                Schedule Pickup
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: COLORS.dark, display: 'none' }}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ background: '#fff', borderTop: `1px solid ${COLORS.border}`, padding: '16px 24px 24px' }}
            className="mobile-menu"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{ display: 'block', padding: '14px 0', color: location.pathname === link.href ? COLORS.primary : COLORS.dark, textDecoration: 'none', fontWeight: 500, fontSize: '16px', borderBottom: `1px solid ${COLORS.border}` }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user ? (
                <>
                  <Link to="/dashboard" style={{ textAlign: 'center', padding: '14px', background: COLORS.primaryLight, color: COLORS.primary, borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} style={{ padding: '14px', background: COLORS.border, border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: COLORS.darkMuted }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ textAlign: 'center', padding: '14px', border: `1.5px solid ${COLORS.border}`, borderRadius: '12px', textDecoration: 'none', fontWeight: 600, color: COLORS.dark }}>
                    Login
                  </Link>
                  <Link to="/schedule-pickup" style={{ textAlign: 'center', padding: '14px', background: COLORS.primary, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
                    Schedule Pickup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
