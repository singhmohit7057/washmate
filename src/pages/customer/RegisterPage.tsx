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
  const { signUp, signInWithGoogle } = useAuth();
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

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
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

          <button
            onClick={handleGoogle}
            style={{ width: '100%', padding: '12px', border: `1.5px solid ${COLORS.border}`, borderRadius: '12px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 600, fontSize: '15px', color: COLORS.dark, marginBottom: '24px', fontFamily: 'inherit' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            <span style={{ fontSize: '13px', color: COLORS.muted }}>or</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
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
    </Layout>
  );
}
