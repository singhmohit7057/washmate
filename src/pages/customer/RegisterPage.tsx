import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shirt, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { COLORS, BRAND } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (error) {
      setError(error.message || 'Registration failed.');
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Layout hideFooter>
        <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 400 }}>
            <CheckCircle size={64} color={COLORS.success} style={{ marginBottom: '20px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, marginBottom: '12px' }}>Account Created!</h1>
            <p style={{ fontSize: '16px', color: COLORS.muted, lineHeight: 1.7, marginBottom: '28px' }}>
              Please check your email to verify your account, then log in to start scheduling pickups.
            </p>
            <Button onClick={() => navigate('/login')} size="lg">Go to Login</Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <SEO title="Register | WashMate" description="Create a free WashMate account and schedule your first laundry pickup today." noIndex />
      <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)` }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark, marginBottom: '8px' }}>Create your account</h1>
            <p style={{ fontSize: '15px', color: COLORS.muted }}>Free pickup on your first order!</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Full Name" placeholder="Priya Sharma" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} leftIcon={<User size={16} />} required />
            <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} leftIcon={<Mail size={16} />} required autoComplete="email" />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              leftIcon={<Lock size={16} />}
              rightIcon={<button type="button" onClick={() => setShowPass(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: COLORS.muted, display: 'flex' }}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              required
            />
            <Input label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} leftIcon={<Lock size={16} />} required />
            {error && <p style={{ color: COLORS.danger, fontSize: '13px', margin: 0, padding: '10px 14px', background: '#FEE2E2', borderRadius: '8px' }}>{error}</p>}
            <Button type="submit" size="lg" loading={loading} fullWidth>Create Account</Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: COLORS.muted }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: COLORS.primary, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
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
