import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Shirt, Eye, EyeOff } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { COLORS, BRAND } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Invalid email or password.');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <Layout hideFooter>
      <SEO title="Login | WashMate" description="Sign in to your WashMate account to manage orders, schedule pickups and track deliveries." noIndex />
      <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)` }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ background: '#fff', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}
          className="auth-card"
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '20px' }}>
              <div style={{ width: 40, height: 40, background: COLORS.primary, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shirt size={22} color="#fff" />
              </div>
              <span style={{ fontWeight: 900, fontSize: '22px', color: COLORS.dark }}>{BRAND.name}</span>
            </Link>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark, marginBottom: '8px' }}>Welcome back</h1>
            <p style={{ fontSize: '15px', color: COLORS.muted }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: COLORS.muted, display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
              autoComplete="current-password"
            />
            {error && <p style={{ color: COLORS.danger, fontSize: '13px', margin: 0, padding: '10px 14px', background: '#FEE2E2', borderRadius: '8px' }}>{error}</p>}
            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: COLORS.primary, textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <Button type="submit" size="lg" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: COLORS.muted }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: COLORS.primary, fontWeight: 700, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px !important; border-radius: 18px !important; }
        }
      `}</style>
    </Layout>
  );
}
