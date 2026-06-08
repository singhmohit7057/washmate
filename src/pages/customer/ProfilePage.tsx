import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Save, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { COLORS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    const { error: dbErr } = await supabase
      .from('users')
      .update({ full_name: form.fullName, phone: form.phone, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setLoading(false);
    if (dbErr) {
      setError('Failed to save. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Customer';
  const roleVariant = user?.role === 'super_admin' ? 'danger' as const : user?.role === 'admin' ? 'warning' as const : 'primary' as const;

  return (
    <Layout>
      <SEO title="Profile | WashMate" description="Manage your WashMate account profile." noIndex />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '32px' }}>My Profile</h1>

          {/* Avatar section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px', padding: '24px', background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={32} color={COLORS.primary} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: COLORS.dark }}>{user?.fullName || 'Your Name'}</div>
              <div style={{ fontSize: '14px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Mail size={13} /> {user?.email}
              </div>
              <div style={{ marginTop: '8px' }}>
                <Badge variant={roleVariant}>{roleLabel}</Badge>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', borderRadius: '16px', padding: '32px', border: `1px solid ${COLORS.border}` }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Edit Profile</h2>
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              leftIcon={<User size={16} />}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              leftIcon={<Phone size={16} />}
            />
            <Input
              label="Email Address"
              type="email"
              value={user?.email ?? ''}
              leftIcon={<Mail size={16} />}
              disabled
              hint="Email cannot be changed"
            />
            {error && <p style={{ color: COLORS.danger, fontSize: '13px', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Button type="submit" loading={loading} icon={<Save size={16} />}>Save Changes</Button>
              {saved && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.success, fontWeight: 600, fontSize: '14px' }}>
                  <CheckCircle size={16} /> Saved!
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
