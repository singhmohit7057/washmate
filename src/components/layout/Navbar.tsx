import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shirt, User, LayoutDashboard, History, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, BRAND } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'Services',      href: '/services' },
  { label: 'Pricing',       href: '/pricing' },
  { label: 'How It Works',  href: '/how-it-works' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'About',         href: '/about' },
  { label: 'Contact',       href: '/contact' },
];

function getInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropOpen(false); }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const dashboardHref = user?.role === 'super_admin' ? '/super-admin' : user?.role === 'admin' ? '/admin' : '/dashboard';
  const dashboardLabel = user?.role === 'customer' ? 'Dashboard' : 'Admin Panel';
  const initials = getInitials(user?.fullName || user?.email || '');

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.08)' : 'none',
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: active ? COLORS.primary : COLORS.darkMuted,
    fontWeight: active ? 600 : 500,
    fontSize: '15px',
    transition: 'color 0.2s',
  });

  return (
    <nav style={navStyle} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: COLORS.dark, fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
          <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shirt size={20} color="#fff" />
          </div>
          {BRAND.name}
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <Link key={link.href} to={link.href} style={linkStyle(location.pathname === link.href)}>{link.label}</Link>
          ))}
        </div>

        {/* Desktop right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          {user ? (
            <div ref={dropRef} style={{ position: 'relative' }}>
              {/* Avatar button */}
              <button
                onClick={() => setDropOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: `1.5px solid ${COLORS.border}`, borderRadius: '999px', padding: '5px 12px 5px 5px', cursor: 'pointer', transition: 'border-color 0.2s', fontFamily: 'inherit' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px' }}>
                  {initials}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.dark, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={14} color={COLORS.muted} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 999 }}
                  >
                    {/* User info header */}
                    <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName || 'My Account'}</div>
                      <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: '6px' }}>
                      {[
                        { icon: LayoutDashboard, label: 'Dashboard',     href: '/dashboard',  color: COLORS.primary },
                        { icon: User,            label: 'My Profile',   href: '/profile',    color: '#8B5CF6' },
                        { icon: History,         label: 'Order History', href: '/order-history', color: '#F59E0B' },
                        ...(user.role !== 'customer' ? [{ icon: ShieldCheck, label: 'Admin Panel', href: dashboardHref, color: COLORS.danger }] : []),
                      ].map(item => (
                        <Link
                          key={item.href + item.label}
                          to={item.href}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', textDecoration: 'none', color: COLORS.dark, fontSize: '14px', fontWeight: 500, transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = COLORS.background)}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <item.icon size={15} color={item.color} />
                          </div>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Sign out */}
                    <div style={{ padding: '6px', borderTop: `1px solid ${COLORS.border}` }}>
                      <button
                        onClick={handleSignOut}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FFF1F2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: '8px', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LogOut size={15} color={COLORS.danger} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: COLORS.darkMuted, fontWeight: 500, fontSize: '15px' }}>Login</Link>
              <Link to="/schedule-pickup" style={{ background: COLORS.primary, color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '10px 22px', fontWeight: 600, fontSize: '15px' }}>
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
          >
            {/* Mobile user info */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0 16px', borderBottom: `1px solid ${COLORS.border}`, marginBottom: '8px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: COLORS.dark }}>{user.fullName || 'My Account'}</div>
                  <div style={{ fontSize: '12px', color: COLORS.muted }}>{user.email}</div>
                </div>
              </div>
            )}

            {NAV_LINKS.map(link => (
              <Link key={link.href} to={link.href}
                style={{ display: 'block', padding: '14px 0', color: location.pathname === link.href ? COLORS.primary : COLORS.dark, textDecoration: 'none', fontWeight: 500, fontSize: '16px', borderBottom: `1px solid ${COLORS.border}` }}>
                {link.label}
              </Link>
            ))}

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <>
                  <Link to={dashboardHref} style={{ textAlign: 'center', padding: '13px', background: COLORS.primaryLight, color: COLORS.primary, borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
                    {dashboardLabel}
                  </Link>
                  <Link to="/profile" style={{ textAlign: 'center', padding: '13px', background: COLORS.background, color: COLORS.dark, borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: `1px solid ${COLORS.border}` }}>
                    My Profile
                  </Link>
                  <Link to="/order-history" style={{ textAlign: 'center', padding: '13px', background: COLORS.background, color: COLORS.dark, borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: `1px solid ${COLORS.border}` }}>
                    Order History
                  </Link>
                  <button onClick={handleSignOut} style={{ padding: '13px', background: '#FFF1F2', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, color: COLORS.danger, fontSize: '15px', fontFamily: 'inherit' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ textAlign: 'center', padding: '13px', border: `1.5px solid ${COLORS.border}`, borderRadius: '12px', textDecoration: 'none', fontWeight: 600, color: COLORS.dark, fontSize: '15px' }}>Login</Link>
                  <Link to="/schedule-pickup" style={{ textAlign: 'center', padding: '13px', background: COLORS.primary, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
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
