import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, Save, CheckCircle, Package, Clock, Star,
  Calendar, ArrowRight, MapPin, Plus, Trash2, Home, Briefcase, X, Edit2,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { COLORS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { UserAddress } from '../../types';

type OrderSummary = {
  id: string; status: string; total: number; subtotal: number; discount: number;
  coupon_code: string | null; created_at: string; order_number: string;
  itemCount?: number;
};

const STATUS_COLOR: Record<string, string> = {
  pending:           '#F59E0B',
  confirmed:         '#3B82F6',
  picked_up:         '#8B5CF6',
  processing:        '#06B6D4',
  washing:           '#06B6D4',
  quality_check:     '#10B981',
  ready:             '#10B981',
  out_for_delivery:  '#F97316',
  delivered:         COLORS.success,
  cancelled:         COLORS.danger,
};

const LABEL_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home: Home,
  Work: Briefcase,
  Other: MapPin,
};

const ADDR_FORM_EMPTY = { label: 'Home', address: '', city: '', pincode: '', is_default: false };

export default function ProfilePage() {
  const { user } = useAuth();

  // Profile edit
  const [form, setForm]     = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState('');

  // Orders
  const [orders, setOrders]     = useState<OrderSummary[]>([]);
  const [allOrders, setAllOrders] = useState<OrderSummary[]>([]); // full list for stats
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Addresses
  const [addresses, setAddresses]         = useState<UserAddress[]>([]);
  const [addrLoading, setAddrLoading]     = useState(true);
  const [showAddrForm, setShowAddrForm]   = useState(false);
  const [editingAddr, setEditingAddr]     = useState<UserAddress | null>(null);
  const [addrForm, setAddrForm]           = useState(ADDR_FORM_EMPTY);
  const [addrSaving, setAddrSaving]       = useState(false);
  const [addrErr, setAddrErr]             = useState('');
  const [deletingId, setDeletingId]       = useState<string | null>(null);

  // ── Fetch data ──────────────────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('orders')
      .select('id, status, total, subtotal, discount, coupon_code, created_at, order_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    const rows = (data ?? []) as OrderSummary[];

    // Fetch item counts for the most recent 5 orders in one query
    const recentIds = rows.slice(0, 5).map(r => r.id);
    let countMap: Record<string, number> = {};
    if (recentIds.length > 0) {
      const { data: itemRows } = await supabase
        .from('order_items')
        .select('order_id, quantity')
        .in('order_id', recentIds);
      (itemRows ?? []).forEach((r: { order_id: string; quantity: number }) => {
        countMap[r.order_id] = (countMap[r.order_id] ?? 0) + r.quantity;
      });
    }

    setAllOrders(rows);
    setOrders(rows.slice(0, 5).map(r => ({ ...r, itemCount: countMap[r.id] ?? 0 })));
    setOrdersLoading(false);
  }, [user]);

  const loadAddresses = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    setAddresses((data ?? []) as UserAddress[]);
    setAddrLoading(false);
  }, [user]);

  useEffect(() => { loadOrders(); loadAddresses(); }, [loadOrders, loadAddresses]);

  // ── Profile save ─────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaveErr('');
    const { error } = await supabase
      .from('users')
      .update({ full_name: form.fullName, phone: form.phone, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setSaving(false);
    if (error) setSaveErr('Failed to save. Please try again.');
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  // ── Address CRUD ─────────────────────────────────────────────────────────
  const openNewAddr = () => {
    setEditingAddr(null);
    setAddrForm(ADDR_FORM_EMPTY);
    setAddrErr('');
    setShowAddrForm(true);
  };

  const openEditAddr = (a: UserAddress) => {
    setEditingAddr(a);
    setAddrForm({ label: a.label, address: a.address, city: a.city, pincode: a.pincode, is_default: a.is_default });
    setAddrErr('');
    setShowAddrForm(true);
  };

  const saveAddress = async () => {
    if (!addrForm.address.trim()) { setAddrErr('Address is required.'); return; }
    if (!addrForm.city.trim())    { setAddrErr('City is required.'); return; }
    if (!user) return;
    setAddrSaving(true); setAddrErr('');

    // If setting as default, un-default others first
    if (addrForm.is_default) {
      await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    }

    if (editingAddr) {
      const { error } = await supabase
        .from('user_addresses')
        .update({ label: addrForm.label, address: addrForm.address, city: addrForm.city, pincode: addrForm.pincode, is_default: addrForm.is_default, updated_at: new Date().toISOString() })
        .eq('id', editingAddr.id);
      if (error) { setAddrErr('Failed to update.'); setAddrSaving(false); return; }
    } else {
      const { error } = await supabase
        .from('user_addresses')
        .insert({ user_id: user.id, label: addrForm.label, address: addrForm.address, city: addrForm.city, pincode: addrForm.pincode, is_default: addrForm.is_default });
      if (error) { setAddrErr('Failed to save.'); setAddrSaving(false); return; }
    }

    setAddrSaving(false);
    setShowAddrForm(false);
    setEditingAddr(null);
    loadAddresses();
  };

  const deleteAddress = async (id: string) => {
    setDeletingId(id);
    await supabase.from('user_addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('user_addresses').update({ is_default: true }).eq('id', id);
    setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
  };

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalOrders    = allOrders.length;
  const completedCount = allOrders.filter(o => o.status === 'delivered').length;
  const totalSpent     = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const memberYear     = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  const roleLabel   = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Customer';
  const roleVariant = user?.role === 'super_admin' ? 'danger' as const : user?.role === 'admin' ? 'warning' as const : 'primary' as const;

  function getInitials(name: string) {
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  }

  return (
    <Layout>
      <SEO title="My Profile | WashMate" description="Manage your WashMate account." noIndex />

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a2e 100%)`, paddingTop: '88px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }} className="profile-hero-inner">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            style={{ width: 90, height: 90, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 900, color: '#fff', flexShrink: 0, border: '4px solid rgba(255,255,255,0.2)' }}>
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : getInitials(user?.fullName || user?.email || '')}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {user?.fullName || 'My Account'}
            </h1>
            <div style={{ fontSize: '14px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Mail size={13} /> {user?.email}
            </div>
            <Badge variant={roleVariant}>{roleLabel}</Badge>
          </motion.div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="stat-strip">
          {[
            { icon: Package,  label: 'Total Orders',  value: totalOrders,                              color: COLORS.primary },
            { icon: Star,     label: 'Completed',      value: completedCount,                           color: COLORS.success },
            { icon: Clock,    label: 'Total Spent',    value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6' },
            { icon: Calendar, label: 'Member Since',   value: memberYear,                               color: '#F59E0B' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 16px', borderRight: i < 3 ? `1px solid ${COLORS.border}` : 'none' }}
              className="stat-strip-item"
            >
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: COLORS.dark }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 600 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }} className="profile-grid">

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Edit Profile */}
          <motion.form onSubmit={handleSave} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <CardHeader icon={<User size={18} color={COLORS.primary} />} iconBg={COLORS.primaryLight} title="Edit Profile" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              <Input label="Full Name" placeholder="Your full name" value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} leftIcon={<User size={16} />} />
              <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} leftIcon={<Phone size={16} />} />
              <Input label="Email Address" type="email" value={user?.email ?? ''} leftIcon={<Mail size={16} />}
                disabled hint="Email cannot be changed" />
            </div>
            {saveErr && <p style={{ color: COLORS.danger, fontSize: '13px', margin: '0 0 12px' }}>{saveErr}</p>}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Button type="submit" loading={saving} icon={<Save size={16} />}>Save Changes</Button>
              <AnimatePresence>
                {saved && (
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.success, fontWeight: 600, fontSize: '14px' }}>
                    <CheckCircle size={16} /> Saved!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Saved Addresses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <CardHeader icon={<MapPin size={18} color="#10B981" />} iconBg="#F0FDF4" title="Saved Addresses" noMargin />
              <button onClick={openNewAddr}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '10px', border: `1.5px solid ${COLORS.primary}`, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                <Plus size={14} /> Add New
              </button>
            </div>

            {addrLoading ? (
              <div style={{ color: COLORS.muted, fontSize: '14px', textAlign: 'center', padding: '20px' }}>Loading…</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {addresses.length === 0 && !showAddrForm && (
                  <div style={{ textAlign: 'center', padding: '28px 16px', background: COLORS.background, borderRadius: '14px', border: `1px dashed ${COLORS.border}` }}>
                    <MapPin size={32} color={COLORS.border} style={{ marginBottom: '10px' }} />
                    <p style={{ color: COLORS.muted, fontSize: '14px', margin: '0 0 14px' }}>No saved addresses yet.</p>
                    <button onClick={openNewAddr}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <Plus size={14} /> Add First Address
                    </button>
                  </div>
                )}

                {addresses.map(a => {
                  const LabelIcon = LABEL_ICONS[a.label] ?? MapPin;
                  return (
                    <div key={a.id} style={{ padding: '14px 16px', borderRadius: '14px', border: `1.5px solid ${a.is_default ? COLORS.primary : COLORS.border}`, background: a.is_default ? COLORS.primaryLight : '#FAFAFA', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '8px', background: a.is_default ? `${COLORS.primary}20` : '#fff', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                          <LabelIcon size={15} color={a.is_default ? COLORS.primary : COLORS.muted} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark }}>{a.label}</span>
                            {a.is_default && <span style={{ fontSize: '10px', fontWeight: 700, background: COLORS.primary, color: '#fff', padding: '2px 7px', borderRadius: '999px' }}>Default</span>}
                          </div>
                          <div style={{ fontSize: '13px', color: COLORS.darkMuted, lineHeight: 1.5 }}>{a.address}</div>
                          <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>{a.city}{a.pincode ? ` — ${a.pincode}` : ''}</div>
                        </div>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          {!a.is_default && (
                            <button onClick={() => setDefault(a.id)} title="Set as default"
                              style={{ padding: '5px 8px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: '#fff', fontSize: '11px', fontWeight: 600, color: COLORS.muted, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                              Set Default
                            </button>
                          )}
                          <button onClick={() => openEditAddr(a)} title="Edit"
                            style={{ width: 30, height: 30, borderRadius: '8px', border: `1px solid ${COLORS.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Edit2 size={13} color={COLORS.muted} />
                          </button>
                          <button onClick={() => deleteAddress(a.id)} disabled={deletingId === a.id} title="Delete"
                            style={{ width: 30, height: 30, borderRadius: '8px', border: `1px solid #FCA5A5`, background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: deletingId === a.id ? 0.5 : 1 }}>
                            <Trash2 size={13} color={COLORS.danger} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Address form */}
            <AnimatePresence>
              {showAddrForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ marginTop: '16px', padding: '20px', background: COLORS.background, borderRadius: '14px', border: `1.5px solid ${COLORS.primary}30` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <p style={{ fontWeight: 800, fontSize: '14px', color: COLORS.dark, margin: 0 }}>{editingAddr ? 'Edit Address' : 'Add New Address'}</p>
                      <button onClick={() => { setShowAddrForm(false); setEditingAddr(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted }}><X size={16} /></button>
                    </div>

                    {/* Label selector */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '8px' }}>Label</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(['Home', 'Work', 'Other'] as const).map(lbl => {
                          const LI = LABEL_ICONS[lbl] ?? MapPin;
                          return (
                            <button key={lbl} type="button" onClick={() => setAddrForm(p => ({ ...p, label: lbl }))}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '10px', border: `1.5px solid ${addrForm.label === lbl ? COLORS.primary : COLORS.border}`, background: addrForm.label === lbl ? COLORS.primaryLight : '#fff', color: addrForm.label === lbl ? COLORS.primary : COLORS.muted, fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              <LI size={13} /> {lbl}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '6px' }}>Street Address *</label>
                        <textarea
                          value={addrForm.address}
                          onChange={e => { setAddrForm(p => ({ ...p, address: e.target.value })); setAddrErr(''); }}
                          placeholder="House no, street, landmark"
                          rows={2}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '6px' }}>City *</label>
                          <input value={addrForm.city} onChange={e => { setAddrForm(p => ({ ...p, city: e.target.value })); setAddrErr(''); }} placeholder="Kolkata"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '6px' }}>Pincode</label>
                          <input value={addrForm.pincode} onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value }))} placeholder="700001"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: COLORS.darkMuted, cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(p => ({ ...p, is_default: e.target.checked }))}
                          style={{ width: 16, height: 16, accentColor: COLORS.primary }} />
                        Set as default address
                      </label>
                    </div>

                    {addrErr && <p style={{ color: COLORS.danger, fontSize: '12px', margin: '10px 0 0' }}>{addrErr}</p>}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button onClick={saveAddress} disabled={addrSaving}
                        style={{ padding: '9px 22px', borderRadius: '10px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: addrSaving ? 0.6 : 1 }}>
                        {addrSaving ? 'Saving…' : editingAddr ? 'Update' : 'Save Address'}
                      </button>
                      <button onClick={() => { setShowAddrForm(false); setEditingAddr(null); }}
                        style={{ padding: '9px 16px', borderRadius: '10px', background: '#fff', color: COLORS.muted, fontWeight: 600, fontSize: '13px', border: `1.5px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* RIGHT COLUMN — Recent orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <CardHeader icon={<Package size={18} color="#F59E0B" />} iconBg="#FFF7ED" title="Recent Orders" noMargin />
            <Link to="/order-history" style={{ fontSize: '13px', color: COLORS.primary, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {ordersLoading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: COLORS.muted }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Package size={40} color={COLORS.border} style={{ marginBottom: '12px' }} />
              <p style={{ color: COLORS.muted, fontSize: '14px', margin: '0 0 16px' }}>No orders yet.</p>
              <Link to="/schedule-pickup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
                Schedule First Pickup <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {orders.map((o, i) => {
                const hasItems   = (o.itemCount ?? 0) > 0;
                const hasDiscount = (o.discount ?? 0) > 0;
                const isPending   = o.total === 0 && !hasItems;
                return (
                  <motion.div key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < orders.length - 1 ? `1px solid ${COLORS.border}` : 'none', gap: '10px' }}>
                    {/* Left: icon + order # + date + item count */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${STATUS_COLOR[o.status] ?? COLORS.muted}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <Package size={15} color={STATUS_COLOR[o.status] ?? COLORS.muted} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{o.order_number}</div>
                        <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '1px' }}>
                          {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        {hasItems && (
                          <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '3px' }}>
                            {o.itemCount} item{o.itemCount !== 1 ? 's' : ''}
                            {o.coupon_code && (
                              <span style={{ marginLeft: '6px', color: '#16A34A', fontWeight: 700 }}>🏷️ {o.coupon_code}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Right: amount + status */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                      {isPending ? (
                        <span style={{ fontSize: '12px', color: COLORS.muted, fontStyle: 'italic' }}>Bill pending</span>
                      ) : (
                        <div style={{ textAlign: 'right' }}>
                          {hasDiscount && (
                            <div style={{ fontSize: '11px', color: COLORS.muted, textDecoration: 'line-through', lineHeight: 1 }}>₹{(o.subtotal ?? 0).toLocaleString('en-IN')}</div>
                          )}
                          <div style={{ fontWeight: 800, fontSize: '14px', color: COLORS.dark }}>₹{(o.total ?? 0).toLocaleString('en-IN')}</div>
                          {hasDiscount && (
                            <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>−₹{o.discount.toLocaleString('en-IN')} off</div>
                          )}
                        </div>
                      )}
                      <span style={{ padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: `${STATUS_COLOR[o.status] ?? COLORS.muted}18`, color: STATUS_COLOR[o.status] ?? COLORS.muted, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <Link to="/order-history" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', padding: '11px', background: COLORS.background, borderRadius: '12px', color: COLORS.primary, textDecoration: 'none', fontWeight: 700, fontSize: '14px', border: `1px solid ${COLORS.border}` }}>
                View Full History <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 760px) {
          .profile-grid  { grid-template-columns: 1fr !important; }
          .profile-hero-inner { flex-direction: column; text-align: center; }
          .stat-strip    { grid-template-columns: 1fr 1fr !important; }
          .stat-strip-item { border-right: none !important; border-bottom: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 420px) {
          .stat-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}

function CardHeader({ icon, iconBg, title, noMargin }: { icon: React.ReactNode; iconBg: string; title: string; noMargin?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: noMargin ? 0 : '20px' }}>
      <div style={{ width: 36, height: 36, borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>{title}</h2>
    </div>
  );
}
