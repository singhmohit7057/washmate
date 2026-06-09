import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, Save, CheckCircle, Package,
  Calendar, ArrowRight, MapPin, Plus, Trash2, Home, Briefcase, X, Edit2, ShoppingBag,
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
  Home: Home, Work: Briefcase, Other: MapPin,
};

const ADDR_FORM_EMPTY = { label: 'Home', address: '', city: '', pincode: '', is_default: false };

function getInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm]     = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [saveErr, setSaveErr] = useState('');

  const [orders, setOrders]     = useState<OrderSummary[]>([]);
  const [allOrders, setAllOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [addresses, setAddresses]     = useState<UserAddress[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [showAddrForm, setShowAddrForm]   = useState(false);
  const [editingAddr, setEditingAddr]     = useState<UserAddress | null>(null);
  const [addrForm, setAddrForm]           = useState(ADDR_FORM_EMPTY);
  const [addrSaving, setAddrSaving]       = useState(false);
  const [addrErr, setAddrErr]             = useState('');
  const [deletingId, setDeletingId]       = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('orders')
      .select('id, status, total, subtotal, discount, coupon_code, created_at, order_number')
      .eq('user_id', user.id).order('created_at', { ascending: false });
    const rows = (data ?? []) as OrderSummary[];
    const recentIds = rows.slice(0, 5).map(r => r.id);
    let countMap: Record<string, number> = {};
    if (recentIds.length > 0) {
      const { data: itemRows } = await supabase.from('order_items').select('order_id, quantity').in('order_id', recentIds);
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
    const { data } = await supabase.from('user_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    setAddresses((data ?? []) as UserAddress[]);
    setAddrLoading(false);
  }, [user]);

  useEffect(() => { loadOrders(); loadAddresses(); }, [loadOrders, loadAddresses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setSaveErr('');
    const { error } = await supabase.from('users')
      .update({ full_name: form.fullName, phone: form.phone, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setSaving(false);
    if (error) setSaveErr('Failed to save. Please try again.');
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const openNewAddr = () => { setEditingAddr(null); setAddrForm(ADDR_FORM_EMPTY); setAddrErr(''); setShowAddrForm(true); };
  const openEditAddr = (a: UserAddress) => {
    setEditingAddr(a);
    setAddrForm({ label: a.label, address: a.address, city: a.city, pincode: a.pincode, is_default: a.is_default });
    setAddrErr(''); setShowAddrForm(true);
  };

  const saveAddress = async () => {
    if (!addrForm.address.trim()) { setAddrErr('Address is required.'); return; }
    if (!addrForm.city.trim()) { setAddrErr('City is required.'); return; }
    if (!user) return;
    setAddrSaving(true); setAddrErr('');
    if (addrForm.is_default) await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
    if (editingAddr) {
      const { error } = await supabase.from('user_addresses')
        .update({ label: addrForm.label, address: addrForm.address, city: addrForm.city, pincode: addrForm.pincode, is_default: addrForm.is_default, updated_at: new Date().toISOString() })
        .eq('id', editingAddr.id);
      if (error) { setAddrErr('Failed to update.'); setAddrSaving(false); return; }
    } else {
      const { error } = await supabase.from('user_addresses')
        .insert({ user_id: user.id, label: addrForm.label, address: addrForm.address, city: addrForm.city, pincode: addrForm.pincode, is_default: addrForm.is_default });
      if (error) { setAddrErr('Failed to save.'); setAddrSaving(false); return; }
    }
    setAddrSaving(false); setShowAddrForm(false); setEditingAddr(null); loadAddresses();
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

  const totalOrders    = allOrders.length;
  const completedCount = allOrders.filter(o => o.status === 'delivered').length;
  const totalSpent     = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const memberYear     = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
  const roleLabel      = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Customer';
  const roleVariant    = user?.role === 'super_admin' ? 'danger' as const : user?.role === 'admin' ? 'warning' as const : 'primary' as const;

  return (
    <Layout>
      <SEO title="My Profile | WashMate" description="Manage your WashMate account." noIndex />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '48px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -40, left: 40, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
              style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: '0 0 0 4px rgba(255,255,255,0.15), 0 8px 32px rgba(99,102,241,0.4)' }}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : getInitials(user?.fullName || user?.email || '')}
            </motion.div>

            {/* Name / email / badge */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                {user?.fullName || 'My Account'}
              </h1>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Mail size={13} /> {user?.email}
              </div>
              <Badge variant={roleVariant}>{roleLabel}</Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats row (overlaps hero) ── */}
      <div style={{ maxWidth: '1100px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} className="stat-row">
          {[
            { emoji: '📦', label: 'Total Orders',  value: totalOrders,                              color: COLORS.primary  },
            { emoji: '✅', label: 'Completed',      value: completedCount,                           color: COLORS.success  },
            { emoji: '💰', label: 'Total Spent',    value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6'       },
            { emoji: '📅', label: 'Member Since',   value: memberYear,                               color: '#F59E0B'       },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              style={{ padding: '22px 20px', borderRight: i < 3 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}
              className="stat-row-cell">
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.emoji}</div>
              <div style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 600, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }} className="profile-body">

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Edit Profile card */}
            <motion.form onSubmit={handleSave} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '10px', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color={COLORS.primary} />
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Edit Profile</h2>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Input label="Full Name" placeholder="Your full name" value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} leftIcon={<User size={15} />} />
                <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} leftIcon={<Phone size={15} />} />
                <Input label="Email Address" type="email" value={user?.email ?? ''} leftIcon={<Mail size={15} />} disabled hint="Email cannot be changed" />
                {saveErr && <p style={{ color: COLORS.danger, fontSize: '12px', margin: 0 }}>{saveErr}</p>}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '4px' }}>
                  <Button type="submit" loading={saving} icon={<Save size={15} />}>Save Changes</Button>
                  <AnimatePresence>
                    {saved && (
                      <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', color: COLORS.success, fontWeight: 700, fontSize: '13px' }}>
                        <CheckCircle size={15} /> Saved!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.form>

            {/* Saved Addresses card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={16} color="#10B981" />
                  </div>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Saved Addresses</h2>
                </div>
                <button onClick={openNewAddr}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: `1.5px solid #10B981`, background: '#F0FDF4', color: '#10B981', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Plus size={13} /> Add
                </button>
              </div>

              <div style={{ padding: '16px' }}>
                {addrLoading ? (
                  <p style={{ color: COLORS.muted, fontSize: '13px', textAlign: 'center', padding: '16px' }}>Loading…</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {addresses.length === 0 && !showAddrForm && (
                      <div style={{ textAlign: 'center', padding: '24px 12px', background: COLORS.background, borderRadius: '12px', border: `1px dashed ${COLORS.border}` }}>
                        <MapPin size={28} color={COLORS.border} style={{ marginBottom: '8px' }} />
                        <p style={{ color: COLORS.muted, fontSize: '13px', margin: '0 0 12px' }}>No saved addresses yet.</p>
                        <button onClick={openNewAddr}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '8px', background: '#10B981', color: '#fff', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Plus size={13} /> Add Address
                        </button>
                      </div>
                    )}

                    {addresses.map(a => {
                      const LabelIcon = LABEL_ICONS[a.label] ?? MapPin;
                      return (
                        <div key={a.id} style={{ padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${a.is_default ? '#10B981' : COLORS.border}`, background: a.is_default ? '#F0FDF4' : '#FAFAFA' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ width: 30, height: 30, borderRadius: '8px', background: a.is_default ? '#D1FAE5' : '#fff', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <LabelIcon size={14} color={a.is_default ? '#10B981' : COLORS.muted} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{ fontWeight: 800, fontSize: '12px', color: COLORS.dark }}>{a.label}</span>
                                {a.is_default && <span style={{ fontSize: '9px', fontWeight: 700, background: '#10B981', color: '#fff', padding: '2px 6px', borderRadius: '999px' }}>Default</span>}
                              </div>
                              <div style={{ fontSize: '12px', color: COLORS.darkMuted, lineHeight: 1.5 }}>{a.address}</div>
                              <div style={{ fontSize: '11px', color: COLORS.muted }}>{a.city}{a.pincode ? ` — ${a.pincode}` : ''}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                              {!a.is_default && (
                                <button onClick={() => setDefault(a.id)}
                                  style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, background: '#fff', fontSize: '10px', fontWeight: 600, color: COLORS.muted, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                                  Set Default
                                </button>
                              )}
                              <button onClick={() => openEditAddr(a)}
                                style={{ width: 28, height: 28, borderRadius: '7px', border: `1px solid ${COLORS.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Edit2 size={12} color={COLORS.muted} />
                              </button>
                              <button onClick={() => deleteAddress(a.id)} disabled={deletingId === a.id}
                                style={{ width: 28, height: 28, borderRadius: '7px', border: '1px solid #FCA5A5', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: deletingId === a.id ? 0.5 : 1 }}>
                                <Trash2 size={12} color={COLORS.danger} />
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
                      <div style={{ marginTop: '14px', padding: '16px', background: COLORS.background, borderRadius: '14px', border: `1.5px solid ${COLORS.primary}25` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <p style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, margin: 0 }}>{editingAddr ? 'Edit Address' : 'New Address'}</p>
                          <button onClick={() => { setShowAddrForm(false); setEditingAddr(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 0 }}><X size={15} /></button>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                          {(['Home', 'Work', 'Other'] as const).map(lbl => {
                            const LI = LABEL_ICONS[lbl] ?? MapPin;
                            return (
                              <button key={lbl} type="button" onClick={() => setAddrForm(p => ({ ...p, label: lbl }))}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '6px', borderRadius: '8px', border: `1.5px solid ${addrForm.label === lbl ? COLORS.primary : COLORS.border}`, background: addrForm.label === lbl ? COLORS.primaryLight : '#fff', color: addrForm.label === lbl ? COLORS.primary : COLORS.muted, fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                <LI size={12} /> {lbl}
                              </button>
                            );
                          })}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '5px' }}>Street Address *</label>
                            <textarea value={addrForm.address} onChange={e => { setAddrForm(p => ({ ...p, address: e.target.value })); setAddrErr(''); }}
                              placeholder="House no, street, landmark" rows={2}
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '5px' }}>City *</label>
                              <input value={addrForm.city} onChange={e => { setAddrForm(p => ({ ...p, city: e.target.value })); setAddrErr(''); }} placeholder="Kolkata"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '5px' }}>Pincode</label>
                              <input value={addrForm.pincode} onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value }))} placeholder="700001"
                                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            </div>
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: COLORS.darkMuted, cursor: 'pointer', userSelect: 'none' }}>
                            <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(p => ({ ...p, is_default: e.target.checked }))}
                              style={{ width: 15, height: 15, accentColor: COLORS.primary }} />
                            Set as default address
                          </label>
                        </div>
                        {addrErr && <p style={{ color: COLORS.danger, fontSize: '12px', margin: '8px 0 0' }}>{addrErr}</p>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                          <button onClick={saveAddress} disabled={addrSaving}
                            style={{ padding: '8px 18px', borderRadius: '8px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: addrSaving ? 0.6 : 1 }}>
                            {addrSaving ? 'Saving…' : editingAddr ? 'Update' : 'Save'}
                          </button>
                          <button onClick={() => { setShowAddrForm(false); setEditingAddr(null); }}
                            style={{ padding: '8px 14px', borderRadius: '8px', background: '#fff', color: COLORS.muted, fontWeight: 600, fontSize: '12px', border: `1.5px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: Orders ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '10px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={16} color='#D97706' />
                </div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Recent Orders</h2>
              </div>
              <Link to="/order-history" style={{ fontSize: '13px', color: COLORS.primary, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {/* Body */}
            {ordersLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: COLORS.muted, fontSize: '14px' }}>Loading…</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                <Package size={44} color={COLORS.border} style={{ marginBottom: '14px' }} />
                <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 6px' }}>No orders yet</p>
                <p style={{ color: COLORS.muted, fontSize: '13px', margin: '0 0 18px' }}>Schedule your first pickup to get started.</p>
                <Link to="/schedule-pickup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
                  Schedule Pickup <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div>
                {orders.map((o, i) => {
                  const sc          = STATUS_COLOR[o.status] ?? COLORS.muted;
                  const hasDiscount = (o.discount ?? 0) > 0;
                  const isPending   = o.total === 0 && !(o.itemCount ?? 0);
                  return (
                    <motion.div key={o.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: i < orders.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                      {/* Status dot */}
                      <div style={{ width: 44, height: 44, borderRadius: '14px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Package size={18} color={sc} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: COLORS.dark, fontFamily: 'monospace' }}>#{o.order_number}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: `${sc}15`, color: sc, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Calendar size={11} /> {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {(o.itemCount ?? 0) > 0 && (
                            <span>{o.itemCount} item{o.itemCount !== 1 ? 's' : ''}</span>
                          )}
                          {o.coupon_code && (
                            <span style={{ color: '#16A34A', fontWeight: 700 }}>🏷️ {o.coupon_code}</span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {isPending ? (
                          <span style={{ fontSize: '12px', color: COLORS.muted, fontStyle: 'italic' }}>Bill pending</span>
                        ) : (
                          <>
                            {hasDiscount && (
                              <div style={{ fontSize: '11px', color: COLORS.muted, textDecoration: 'line-through' }}>₹{(o.subtotal ?? 0).toLocaleString('en-IN')}</div>
                            )}
                            <div style={{ fontWeight: 900, fontSize: '16px', color: COLORS.dark }}>₹{(o.total ?? 0).toLocaleString('en-IN')}</div>
                            {hasDiscount && (
                              <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>−₹{o.discount.toLocaleString('en-IN')} off</div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`, background: COLORS.background }}>
                  <Link to="/order-history" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: COLORS.primary, textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                    View Full History <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .profile-body  { grid-template-columns: 1fr !important; }
          .stat-row      { grid-template-columns: 1fr 1fr !important; }
          .stat-row-cell { border-right: none !important; border-bottom: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 480px) {
          .stat-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
