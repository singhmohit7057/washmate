import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Tag, Plus, Trash2, Edit, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import Badge from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { CouponRow } from '../../types/database';

type Tab = 'dashboard' | 'services' | 'pricing' | 'coupons' | 'users' | 'admins';

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'services', label: 'Services' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'coupons', label: 'Coupons' },
    { key: 'users', label: 'Users' },
    { key: 'admins', label: 'Admins' },
  ];

  return (
    <Layout>
      <SEO title="Super Admin | WashMate" description="WashMate super admin panel." noIndex />
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, marginBottom: '4px' }}>Super Admin Panel</h1>
          <p style={{ color: COLORS.muted }}>Full platform control</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', background: COLORS.background, padding: '4px', borderRadius: '12px', marginBottom: '32px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }} className="super-tab-bar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: 'inherit', background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? COLORS.primary : COLORS.muted, boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <SuperAdminStats />}
        {activeTab === 'coupons' && <CouponManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'services' && <ServiceManager />}
        {activeTab === 'admins' && <AdminManager />}
      </div>
    </Layout>
  );
}

function SuperAdminStats() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeCustomers: 0, totalCoupons: 0 });
  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total').neq('status', 'cancelled'),
      supabase.from('users').select('id', { count: 'exact' }),
      supabase.from('coupons').select('id', { count: 'exact' }).eq('is_active', true),
    ]).then(([ordersRes, usersRes, couponsRes]) => {
      const total = (ordersRes.data ?? []).reduce((s: number, o: { total: number }) => s + (o.total || 0), 0);
      setStats({
        totalRevenue: total,
        totalOrders: ordersRes.data?.length ?? 0,
        activeCustomers: usersRes.count ?? 0,
        totalCoupons: couponsRes.count ?? 0,
      });
    });
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {[
          { icon: TrendingUp, label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: COLORS.success },
          { icon: Package, label: 'Total Orders', value: stats.totalOrders, color: COLORS.primary },
          { icon: Users, label: 'Active Customers', value: stats.activeCustomers, color: '#8B5CF6' },
          { icon: Tag, label: 'Active Coupons', value: stats.totalCoupons, color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: `1px solid ${COLORS.border}` }}
          >
            <s.icon size={22} color={s.color} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '4px' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CouponManager() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as CouponRow['type'], value: '', min_order_value: '0', max_uses: '', expires_at: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.code || !form.value) return;
    setSaving(true);
    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order_value: Number(form.min_order_value),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      used_count: 0,
      applicable_services: null,
      expires_at: form.expires_at || null,
      is_active: true,
    });
    if (!error) {
      if (user) await supabase.from('admin_activity_logs').insert({ admin_id: user.id, action: 'create_coupon', resource_type: 'coupon', resource_id: null, details: { code: form.code } });
      setShowForm(false);
      setForm({ code: '', type: 'percentage', value: '', min_order_value: '0', max_uses: '', expires_at: '' });
      load();
    }
    setSaving(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ is_active: !active }).eq('id', id);
    load();
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    await supabase.from('coupons').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Coupon Management</h2>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(v => !v)} size="sm">New Coupon</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#F8FAFF', border: `1.5px solid ${COLORS.primary}30`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: COLORS.dark, marginBottom: '20px' }}>Create Coupon</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <Input label="Code *" placeholder="WELCOME10" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '6px' }}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as CouponRow['type'] }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '15px', fontFamily: 'inherit' }}>
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed ₹</option>
                <option value="free_pickup">Free Pickup</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </div>
            <Input label="Value *" type="number" placeholder="10" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
            <Input label="Min Order (₹)" type="number" placeholder="0" value={form.min_order_value} onChange={e => setForm(p => ({ ...p, min_order_value: e.target.value }))} />
            <Input label="Max Uses" type="number" placeholder="Unlimited" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} />
            <Input label="Expires" type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={save} loading={saving} icon={<Save size={16} />} size="sm">Save Coupon</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {coupons.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: COLORS.muted }}>No coupons yet.</div>
          ) : coupons.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontWeight: 900, fontSize: '16px', color: COLORS.dark, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{c.code}</span>
                <Badge variant={c.type === 'percentage' ? 'primary' : c.type === 'fixed' ? 'success' : 'warning'} size="sm">
                  {c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `₹${c.value}` : c.type}
                </Badge>
                {c.expires_at && <span style={{ fontSize: '12px', color: COLORS.muted }}>Exp: {new Date(c.expires_at).toLocaleDateString()}</span>}
                <span style={{ fontSize: '12px', color: COLORS.muted }}>Used: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Badge variant={c.is_active ? 'success' : 'neutral'} dot>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                <button onClick={() => toggle(c.id, c.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, display: 'flex' }} title={c.is_active ? 'Disable' : 'Enable'}>
                  {c.is_active ? <ToggleRight size={20} color={COLORS.success} /> : <ToggleLeft size={20} />}
                </button>
                <button onClick={() => deleteCoupon(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex' }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UserManager() {
  const [users, setUsers] = useState<{ id: string; email: string; full_name: string; is_active: boolean; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('users').select('id, email, full_name, is_active, created_at').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers(data ?? []);
      setLoading(false);
    });
  }, []);

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('users').update({ is_active: !active }).eq('id', id);
    setUsers(p => p.map(u => u.id === id ? { ...u, is_active: !active } : u));
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, marginBottom: '24px' }}>User Management</h2>
      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.dark }}>{u.full_name || 'No Name'}</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Badge variant={u.is_active ? 'success' : 'danger'} dot>{u.is_active ? 'Active' : 'Suspended'}</Badge>
                <button onClick={() => toggleActive(u.id, u.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {u.is_active ? <ToggleRight size={20} color={COLORS.success} /> : <ToggleLeft size={20} color={COLORS.muted} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingManager() {
  const [items, setItems] = useState<{ id: string; item_name: string; category: string; wash_fold_price: number | null; dry_clean_price: number | null; steam_iron_price: number | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ wash_fold_price: string; dry_clean_price: string; steam_iron_price: string }>({ wash_fold_price: '', dry_clean_price: '', steam_iron_price: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('pricing').select('id, item_name, category, wash_fold_price, dry_clean_price, steam_iron_price').eq('is_active', true).order('category').then(({ data }) => {
      setItems(data ?? []);
      setLoading(false);
    });
  }, []);

  const startEdit = (item: typeof items[0]) => {
    setEditId(item.id);
    setEditValues({
      wash_fold_price: item.wash_fold_price?.toString() ?? '',
      dry_clean_price: item.dry_clean_price?.toString() ?? '',
      steam_iron_price: item.steam_iron_price?.toString() ?? '',
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    await supabase.from('pricing').update({
      wash_fold_price: editValues.wash_fold_price ? Number(editValues.wash_fold_price) : null,
      dry_clean_price: editValues.dry_clean_price ? Number(editValues.dry_clean_price) : null,
      steam_iron_price: editValues.steam_iron_price ? Number(editValues.steam_iron_price) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', editId);
    setItems(p => p.map(i => i.id === editId ? {
      ...i,
      wash_fold_price: editValues.wash_fold_price ? Number(editValues.wash_fold_price) : null,
      dry_clean_price: editValues.dry_clean_price ? Number(editValues.dry_clean_price) : null,
      steam_iron_price: editValues.steam_iron_price ? Number(editValues.steam_iron_price) : null,
    } : i));
    setEditId(null);
    setSaving(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, marginBottom: '8px' }}>Pricing Management</h2>
      <p style={{ color: COLORS.muted, fontSize: '14px', marginBottom: '24px' }}>Changes reflect immediately across the website.</p>
      {loading ? <LoadingSpinner /> : (
        <>
          {/* Desktop table */}
          <div className="pricing-table" style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', padding: '12px 20px', background: COLORS.background, gap: '8px' }}>
              {['Item', 'Category', 'W&F ₹', 'DC ₹', 'SI ₹', ''].map(h => <span key={h} style={{ fontSize: '12px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase' }}>{h}</span>)}
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px', padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>{item.item_name}</span>
                <span style={{ fontSize: '12px', color: COLORS.muted }}>{item.category}</span>
                {editId === item.id ? (
                  <>
                    <input value={editValues.wash_fold_price} onChange={e => setEditValues(p => ({ ...p, wash_fold_price: e.target.value }))} style={{ padding: '6px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, width: '70px', fontFamily: 'inherit' }} placeholder="—" />
                    <input value={editValues.dry_clean_price} onChange={e => setEditValues(p => ({ ...p, dry_clean_price: e.target.value }))} style={{ padding: '6px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, width: '70px', fontFamily: 'inherit' }} placeholder="—" />
                    <input value={editValues.steam_iron_price} onChange={e => setEditValues(p => ({ ...p, steam_iron_price: e.target.value }))} style={{ padding: '6px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, width: '70px', fontFamily: 'inherit' }} placeholder="—" />
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ background: COLORS.success, color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ background: COLORS.border, color: COLORS.dark, border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: COLORS.primary }}>{item.wash_fold_price ? `₹${item.wash_fold_price}` : '—'}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#8B5CF6' }}>{item.dry_clean_price ? `₹${item.dry_clean_price}` : '—'}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B' }}>{item.steam_iron_price ? `₹${item.steam_iron_price}` : '—'}</span>
                    <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
                      <Edit size={14} /> Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="pricing-cards" style={{ display: 'none', flexDirection: 'column', gap: '10px' }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${COLORS.border}`, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: COLORS.dark }}>{item.item_name}</span>
                  <span style={{ fontSize: '11px', color: COLORS.muted, background: COLORS.background, padding: '2px 8px', borderRadius: '6px' }}>{item.category}</span>
                </div>
                {editId === item.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                      {[
                        { label: 'W&F', key: 'wash_fold_price' as const, color: COLORS.primary },
                        { label: 'DC', key: 'dry_clean_price' as const, color: '#8B5CF6' },
                        { label: 'SI', key: 'steam_iron_price' as const, color: '#F59E0B' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: '10px', fontWeight: 700, color: f.color, display: 'block', marginBottom: '2px' }}>{f.label}</label>
                          <input value={editValues[f.key]} onChange={e => setEditValues(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, fontFamily: 'inherit', fontSize: '13px', boxSizing: 'border-box' }} placeholder="—" />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={saveEdit} disabled={saving} style={{ flex: 1, background: COLORS.success, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 600 }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ flex: 1, background: COLORS.border, color: COLORS.dark, border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                      <span style={{ color: COLORS.primary, fontWeight: 600 }}>{item.wash_fold_price ? `₹${item.wash_fold_price}` : '—'}</span>
                      <span style={{ color: '#8B5CF6', fontWeight: 600 }}>{item.dry_clean_price ? `₹${item.dry_clean_price}` : '—'}</span>
                      <span style={{ color: '#F59E0B', fontWeight: 600 }}>{item.steam_iron_price ? `₹${item.steam_iron_price}` : '—'}</span>
                    </div>
                    <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
                      <Edit size={14} /> Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 700px) {
              .pricing-table { display: none !important; }
              .pricing-cards { display: flex !important; }
              .super-tab-bar { border-radius: 10px !important; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

function ServiceManager() {
  const [services, setServices] = useState<{ id: string; name: string; starting_price: number; turnaround_time: string; is_active: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('services').select('id, name, starting_price, turnaround_time, is_active').order('sort_order').then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, []);

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('services').update({ is_active: !active }).eq('id', id);
    setServices(p => p.map(s => s.id === id ? { ...s, is_active: !active } : s));
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, marginBottom: '24px' }}>Service Management</h2>
      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {services.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.dark }}>{s.name}</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>From ₹{s.starting_price} · {s.turnaround_time}</div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Badge variant={s.is_active ? 'success' : 'neutral'}>{s.is_active ? 'Active' : 'Disabled'}</Badge>
                <button onClick={() => toggle(s.id, s.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {s.is_active ? <ToggleRight size={20} color={COLORS.success} /> : <ToggleLeft size={20} color={COLORS.muted} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminManager() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<{ id: string; email: string; full_name: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    supabase
      .from('user_roles')
      .select('user_id, role, users(email, full_name)')
      .in('role', ['admin', 'super_admin'])
      .then(({ data }) => {
        setAdmins((data ?? []).map((d: { user_id: string; role: string; users: { email: string; full_name: string } | null }) => ({
          id: d.user_id,
          email: d.users?.email ?? '',
          full_name: d.users?.full_name ?? '',
          role: d.role,
        })));
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Admin Management</h2>
        <Button icon={<Plus size={16} />} onClick={() => setShowForm(v => !v)} size="sm">Add Admin</Button>
      </div>
      {showForm && (
        <div style={{ background: COLORS.background, borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="Admin email address" style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit' }} />
          <Button size="sm">Invite Admin</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
        </div>
      )}
      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {admins.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.dark }}>{a.full_name || 'No Name'}</div>
                <div style={{ fontSize: '13px', color: COLORS.muted }}>{a.email}</div>
              </div>
              <Badge variant={a.role === 'super_admin' ? 'danger' : 'warning'}>
                {a.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
