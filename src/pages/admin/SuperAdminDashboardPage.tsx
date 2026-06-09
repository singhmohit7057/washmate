import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Tag, Plus, Trash2, Edit, ToggleLeft, ToggleRight, Save, MapPin } from 'lucide-react';
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

type Tab = 'dashboard' | 'services' | 'pricing' | 'coupons' | 'users' | 'areas' | 'admins';

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'services', label: 'Services' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'coupons', label: 'Coupons' },
    { key: 'users', label: 'Users' },
    { key: 'areas', label: 'Service Areas' },
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
        {activeTab === 'areas' && <ServiceAreaManager />}
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

type UserWithStats = { id: string; email: string; full_name: string; phone: string | null; is_active: boolean; created_at: string; orderCount: number; totalSpent: number; lastOrder: string | null };

function UserManager() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const load = useCallback(async () => {
    const [usersRes, ordersRes] = await Promise.all([
      supabase.from('users').select('id, email, full_name, phone, is_active, created_at').order('created_at', { ascending: false }),
      supabase.from('orders').select('user_id, total, created_at').neq('status', 'cancelled'),
    ]);
    const userList = (usersRes.data ?? []) as { id: string; email: string; full_name: string; phone: string | null; is_active: boolean; created_at: string }[];
    const orderList = (ordersRes.data ?? []) as { user_id: string; total: number; created_at: string }[];

    const withStats: UserWithStats[] = userList.map(u => {
      const uOrders = orderList.filter(o => o.user_id === u.id);
      const sorted = [...uOrders].sort((a, b) => b.created_at.localeCompare(a.created_at));
      return {
        ...u,
        orderCount: uOrders.length,
        totalSpent: uOrders.reduce((s, o) => s + (o.total || 0), 0),
        lastOrder: sorted[0]?.created_at ?? null,
      };
    });
    setUsers(withStats);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('users').update({ is_active: !active }).eq('id', id);
    setUsers(p => p.map(u => u.id === id ? { ...u, is_active: !active } : u));
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.full_name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone ?? '').includes(q);
    const matchFilter = filter === 'all' || (filter === 'active' && u.is_active) || (filter === 'suspended' && !u.is_active);
    return matchSearch && matchFilter;
  });

  const totalRevenue = users.reduce((s, u) => s + u.totalSpent, 0);
  const activeCount = users.filter(u => u.is_active).length;
  const withOrders = users.filter(u => u.orderCount > 0).length;

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Users', value: users.length, color: COLORS.primary },
          { label: 'Active', value: activeCount, color: COLORS.success },
          { label: 'With Orders', value: withOrders, color: '#8B5CF6' },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit' }}
        />
        {(['all', 'active', 'suspended'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '10px 16px', borderRadius: '10px', border: `1.5px solid ${filter === f ? COLORS.primary : COLORS.border}`, background: filter === f ? COLORS.primaryLight : '#fff', color: filter === f ? COLORS.primary : COLORS.muted, fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 100px 120px 100px', padding: '10px 20px', background: COLORS.background, gap: '8px' }}>
            {['User', 'Contact', 'Orders', 'Spent', 'Joined', 'Status'].map(h => (
              <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted }}>No users found.</div>
          ) : filtered.map(u => (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 100px 120px 100px', padding: '14px 20px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '8px' }}>
              {/* Name */}
              <div>
                <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '14px' }}>{u.full_name || '—'}</div>
                <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>{u.email}</div>
              </div>
              {/* Contact */}
              <div style={{ fontSize: '13px', color: COLORS.muted }}>{u.phone || '—'}</div>
              {/* Orders */}
              <div style={{ fontWeight: 700, color: u.orderCount > 0 ? COLORS.primary : COLORS.muted, fontSize: '14px' }}>{u.orderCount}</div>
              {/* Spent */}
              <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '14px' }}>₹{u.totalSpent.toLocaleString()}</div>
              {/* Joined */}
              <div style={{ fontSize: '12px', color: COLORS.muted }}>{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              {/* Status + toggle */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Badge variant={u.is_active ? 'success' : 'danger'} dot size="sm">{u.is_active ? 'Active' : 'Suspended'}</Badge>
                <button onClick={() => toggleActive(u.id, u.is_active)} title={u.is_active ? 'Suspend user' : 'Activate user'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: COLORS.muted }}>
                  {u.is_active ? <ToggleRight size={18} color={COLORS.success} /> : <ToggleLeft size={18} color={COLORS.muted} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type PricingItem = { id: string; item_name: string; category: string; wash_fold_price: number | null; dry_clean_price: number | null; steam_iron_price: number | null };
const EMPTY_PRICING = { item_name: '', category: '', wash_fold_price: '', dry_clean_price: '', steam_iron_price: '' };

function PricingManager() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ wash_fold_price: string; dry_clean_price: string; steam_iron_price: string }>({ wash_fold_price: '', dry_clean_price: '', steam_iron_price: '' });
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_PRICING);
  const [addError, setAddError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('pricing').select('id, item_name, category, wash_fold_price, dry_clean_price, steam_iron_price').eq('is_active', true).order('category');
    setItems((data ?? []) as PricingItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (item: PricingItem) => {
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

  const addItem = async () => {
    if (!addForm.item_name.trim() || !addForm.category.trim()) { setAddError('Item name and category are required.'); return; }
    setSaving(true);
    setAddError('');
    const { error } = await supabase.from('pricing').insert({
      item_name: addForm.item_name.trim(),
      category: addForm.category.trim(),
      wash_fold_price: addForm.wash_fold_price ? Number(addForm.wash_fold_price) : null,
      dry_clean_price: addForm.dry_clean_price ? Number(addForm.dry_clean_price) : null,
      steam_iron_price: addForm.steam_iron_price ? Number(addForm.steam_iron_price) : null,
      is_active: true,
    });
    if (error) { setAddError(error.message); setSaving(false); return; }
    setShowAdd(false);
    setAddForm(EMPTY_PRICING);
    await load();
    setSaving(false);
  };

  const deleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await supabase.from('pricing').delete().eq('id', id);
    setItems(p => p.filter(i => i.id !== id));
  };

  const af = (field: keyof typeof EMPTY_PRICING) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Pricing Management</h2>
          <p style={{ color: COLORS.muted, fontSize: '14px', marginTop: '4px' }}>Changes reflect immediately across the website.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => { setShowAdd(v => !v); setAddError(''); }} size="sm">Add Item</Button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#F8FAFF', border: `1.5px solid ${COLORS.primary}30`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: COLORS.dark, marginBottom: '16px' }}>New Pricing Item</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <Input label="Item Name *" placeholder="Shirt" value={addForm.item_name} onChange={af('item_name')} />
            <Input label="Category *" placeholder="Top Wear" value={addForm.category} onChange={af('category')} />
            <Input label="Wash & Fold ₹" type="number" placeholder="—" value={addForm.wash_fold_price} onChange={af('wash_fold_price')} />
            <Input label="Dry Clean ₹" type="number" placeholder="—" value={addForm.dry_clean_price} onChange={af('dry_clean_price')} />
            <Input label="Steam Iron ₹" type="number" placeholder="—" value={addForm.steam_iron_price} onChange={af('steam_iron_price')} />
          </div>
          {addError && <p style={{ color: COLORS.danger, fontSize: '13px', marginBottom: '10px' }}>{addError}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={addItem} loading={saving} icon={<Save size={16} />} size="sm">Save Item</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Desktop table */}
          <div className="pricing-table" style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '12px 20px', background: COLORS.background, gap: '8px' }}>
              {['Item', 'Category', 'W&F ₹', 'DC ₹', 'SI ₹', ''].map(h => <span key={h} style={{ fontSize: '12px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase' }}>{h}</span>)}
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '8px' }}>
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
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={() => deleteItem(item.id, item.item_name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
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
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => deleteItem(item.id, item.item_name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
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

type ServiceRow = { id: string; name: string; slug: string; description: string; turnaround_time: string; starting_price: number; is_active: boolean; sort_order: number; process: string | null };
const EMPTY_SVC = { name: '', slug: '', description: '', turnaround_time: '', starting_price: '', sort_order: '0' };

// Helper: dynamic list editor (process steps / features)
function ListEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const update = (i: number, val: string) => { const n = [...items]; n[i] = val; onChange(n); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>{label}</label>
        <button type="button" onClick={add} style={{ background: COLORS.primaryLight, color: COLORS.primary, border: 'none', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <input
              value={item}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit' }}
            />
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>No items yet. Click "+ Add" to add one.</p>}
      </div>
    </div>
  );
}

function ServiceManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_SVC);
  const [processSteps, setProcessSteps] = useState<string[]>(['']);
  const [features, setFeatures] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('services').select('id, name, slug, description, turnaround_time, starting_price, is_active, sort_order, process').order('sort_order');
    setServices((data ?? []) as ServiceRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const parseStored = (raw: string | null): { process: string[]; features: string[] } => {
    if (!raw) return { process: [''], features: [''] };
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return {
          process: Array.isArray(parsed.process) && parsed.process.length ? parsed.process : [''],
          features: Array.isArray(parsed.features) && parsed.features.length ? parsed.features : [''],
        };
      }
    } catch { /* ignore */ }
    return { process: [''], features: [''] };
  };

  const openAdd = () => {
    setEditId(null); setForm(EMPTY_SVC); setProcessSteps(['']); setFeatures(['']); setError(''); setShowForm(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditId(s.id);
    setForm({ name: s.name, slug: s.slug, description: s.description ?? '', turnaround_time: s.turnaround_time ?? '', starting_price: String(s.starting_price), sort_order: String(s.sort_order) });
    const { process: p, features: feat } = parseStored(s.process);
    setProcessSteps(p);
    setFeatures(feat);
    setError('');
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setError('Name and slug are required.'); return; }
    setSaving(true);
    setError('');
    const processJson = JSON.stringify({
      process: processSteps.filter(s => s.trim()),
      features: features.filter(s => s.trim()),
    });
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: form.description.trim() || null,
      turnaround_time: form.turnaround_time.trim() || null,
      starting_price: Number(form.starting_price) || 0,
      sort_order: Number(form.sort_order) || 0,
      process: processJson,
    };
    const { error: err } = editId
      ? await supabase.from('services').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
      : await supabase.from('services').insert({ ...payload, is_active: true });
    if (err) { setError(err.message); setSaving(false); return; }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_SVC);
    setProcessSteps(['']);
    setFeatures(['']);
    await load();
    setSaving(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('services').update({ is_active: !active }).eq('id', id);
    setServices(p => p.map(s => s.id === id ? { ...s, is_active: !active } : s));
  };

  const deleteService = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from('services').delete().eq('id', id);
    setServices(p => p.filter(s => s.id !== id));
  };

  const fi = (field: keyof typeof EMPTY_SVC) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Service Management</h2>
        <Button icon={<Plus size={16} />} onClick={openAdd} size="sm">Add Service</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#F8FAFF', border: `1.5px solid ${COLORS.primary}30`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: COLORS.dark, marginBottom: '20px' }}>{editId ? 'Edit Service' : 'Add New Service'}</h3>

          {/* Basic fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <Input label="Name *" placeholder="Cap Cleaning" value={form.name} onChange={fi('name')} />
            <Input label="Slug *" placeholder="cap-cleaning" value={form.slug} onChange={fi('slug')} hint="URL-friendly, auto-lowercased" />
            <Input label="Starting Price (₹)" type="number" placeholder="49" value={form.starting_price} onChange={fi('starting_price')} />
            <Input label="Turnaround Time" placeholder="24–48 Hours" value={form.turnaround_time} onChange={fi('turnaround_time')} />
            <Input label="Sort Order" type="number" placeholder="0" value={form.sort_order} onChange={fi('sort_order')} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={fi('description')} placeholder="Brief description of the service..." rows={2}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          {/* Process steps + Features side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px' }} className="svc-lists">
            <ListEditor label="Process Steps" items={processSteps} onChange={setProcessSteps} placeholder="e.g. Cap inspected and tagged" />
            <ListEditor label="Features / Highlights" items={features} onChange={setFeatures} placeholder="e.g. All cap types" />
          </div>

          {error && <p style={{ color: COLORS.danger, fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={save} loading={saving} icon={<Save size={16} />} size="sm">{editId ? 'Update Service' : 'Save Service'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted }}>
              <Package size={40} color={COLORS.border} style={{ marginBottom: '12px' }} />
              <p>No services yet. Click "Add Service" to create one.</p>
            </div>
          ) : services.map(s => {
            const { process: p, features: feat } = parseStored(s.process ?? null);
            const hasContent = p.some(x => x.trim()) || feat.some(x => x.trim());
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: COLORS.dark }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: COLORS.muted }}>
                    From ₹{s.starting_price} · {s.turnaround_time} · slug: {s.slug}
                    {hasContent && <span style={{ marginLeft: '8px', color: COLORS.success, fontSize: '11px', fontWeight: 700 }}>✓ Steps & Features set</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge variant={s.is_active ? 'success' : 'neutral'}>{s.is_active ? 'Active' : 'Disabled'}</Badge>
                  <button onClick={() => toggle(s.id, s.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }} title={s.is_active ? 'Disable' : 'Enable'}>
                    {s.is_active ? <ToggleRight size={20} color={COLORS.success} /> : <ToggleLeft size={20} color={COLORS.muted} />}
                  </button>
                  <button onClick={() => openEdit(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex' }} title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteService(s.id, s.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`.svc-lists { @media (max-width: 600px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ─── Service Area Manager ─────────────────────────────────────────────────────

type AreaRow = {
  id: string;
  slug: string;
  name: string;
  state: string;
  coverage: string | null;
  pickup_slots: string | null;
  delivery_info: string | null;
  pincodes: string | null;    // comma-separated e.g. "700001-700099,700101"
  landmarks: string | null;   // comma-separated
  is_active: boolean;
  sort_order: number;
};

const EMPTY_AREA: Omit<AreaRow, 'id' | 'is_active'> = {
  slug: '', name: '', state: 'West Bengal',
  coverage: '', pickup_slots: '', delivery_info: '',
  pincodes: '', landmarks: '', sort_order: 0,
};

function ServiceAreaManager() {
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_AREA, sort_order: '0' } as Omit<AreaRow, 'id' | 'is_active' | 'sort_order'> & { sort_order: string });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('service_areas')
      .select('id, slug, name, state, coverage, pickup_slots, delivery_info, pincodes, landmarks, is_active, sort_order')
      .order('sort_order');
    setAreas((data ?? []) as AreaRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const FORM_EMPTY = { slug: '', name: '', state: 'West Bengal', coverage: '', pickup_slots: '', delivery_info: '', pincodes: '', landmarks: '', sort_order: '0' };

  const openAdd = () => {
    setEditId(null);
    setForm(FORM_EMPTY);
    setError('');
    setShowForm(true);
  };

  const openEdit = (a: AreaRow) => {
    setEditId(a.id);
    setForm({
      slug: a.slug,
      name: a.name,
      state: a.state,
      coverage: a.coverage ?? '',
      pickup_slots: a.pickup_slots ?? '',
      delivery_info: a.delivery_info ?? '',
      pincodes: a.pincodes ?? '',
      landmarks: a.landmarks ?? '',
      sort_order: String(a.sort_order),
    });
    setError('');
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setError('Name and slug are required.'); return; }
    setSaving(true);
    setError('');
    const payload = {
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      name: form.name.trim(),
      state: form.state.trim() || 'West Bengal',
      coverage: form.coverage?.trim() || null,
      pickup_slots: form.pickup_slots?.trim() || null,
      delivery_info: form.delivery_info?.trim() || null,
      pincodes: form.pincodes?.trim() || null,
      landmarks: form.landmarks?.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error: err } = editId
      ? await supabase.from('service_areas').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editId)
      : await supabase.from('service_areas').insert({ ...payload, is_active: true });
    if (err) { setError(err.message); setSaving(false); return; }
    setShowForm(false);
    setEditId(null);
    setForm(FORM_EMPTY);
    await load();
    setSaving(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('service_areas').update({ is_active: !active }).eq('id', id);
    setAreas(prev => prev.map(a => a.id === id ? { ...a, is_active: !active } : a));
  };

  const deleteArea = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from('service_areas').delete().eq('id', id);
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  const fld = (field: keyof typeof FORM_EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Service Areas</h2>
          <p style={{ color: COLORS.muted, fontSize: '13px', marginTop: '4px' }}>Areas shown on the /service-areas page.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd} size="sm">Add Area</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#F8FAFF', border: `1.5px solid ${COLORS.primary}30`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: COLORS.dark, marginBottom: '20px' }}>{editId ? 'Edit Area' : 'Add New Area'}</h3>

          {/* Row 1: Name, Slug, State, Sort Order */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <Input label="City / Area Name *" placeholder="Kolkata" value={form.name} onChange={fld('name')} />
            <Input label="Slug *" placeholder="kolkata" value={form.slug} onChange={fld('slug')} hint="URL-friendly key" />
            <Input label="State" placeholder="West Bengal" value={form.state ?? ''} onChange={fld('state')} />
            <Input label="Sort Order" type="number" placeholder="0" value={form.sort_order} onChange={fld('sort_order')} />
          </div>

          {/* Coverage description */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '6px' }}>Coverage Description</label>
            <textarea value={form.coverage ?? ''} onChange={fld('coverage')} rows={2}
              placeholder="Full city coverage including North, South, East, and Central Kolkata. Serving residential and commercial addresses."
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          {/* Pickup + Delivery side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="area-form-grid">
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '6px' }}>Pickup Availability</label>
              <textarea value={form.pickup_slots ?? ''} onChange={fld('pickup_slots')} rows={2}
                placeholder="Daily pickup slots: 8 AM–12 PM, 12 PM–4 PM, 4 PM–8 PM"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '6px' }}>Delivery Timeline</label>
              <textarea value={form.delivery_info ?? ''} onChange={fld('delivery_info')} rows={2}
                placeholder="Regular: 48 hrs | Dry Clean: 72 hrs | Express: Same-day / Next-day"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Pincodes + Landmarks side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="area-form-grid">
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>PIN Codes</label>
              <p style={{ fontSize: '12px', color: COLORS.muted, margin: '0 0 6px' }}>Comma-separated, e.g. <code>700001-700099, 700101-700150</code></p>
              <input value={form.pincodes ?? ''} onChange={fld('pincodes')} placeholder="700001-700099, 700101-700150"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: COLORS.dark, marginBottom: '4px' }}>Key Landmarks</label>
              <p style={{ fontSize: '12px', color: COLORS.muted, margin: '0 0 6px' }}>Comma-separated, e.g. <code>Park Street, Salt Lake, New Town</code></p>
              <input value={form.landmarks ?? ''} onChange={fld('landmarks')} placeholder="Park Street, Salt Lake, New Town"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
          </div>

          {error && <p style={{ color: COLORS.danger, fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={save} loading={saving} icon={<Save size={16} />} size="sm">{editId ? 'Update Area' : 'Save Area'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {areas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted }}>
              <MapPin size={40} color={COLORS.border} style={{ marginBottom: '12px' }} />
              <p>No areas yet. Click "Add Area" to create one.</p>
            </div>
          ) : areas.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`, flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <div style={{ width: 34, height: 34, background: COLORS.primaryLight, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} color={COLORS.primary} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: COLORS.dark, fontSize: '15px' }}>{a.name}</div>
                    <div style={{ fontSize: '12px', color: COLORS.muted }}>{a.state} · slug: {a.slug}</div>
                  </div>
                </div>
                {a.coverage && <p style={{ fontSize: '13px', color: COLORS.darkMuted, margin: '6px 0 6px 44px', lineHeight: 1.5 }}>{a.coverage}</p>}
                <div style={{ marginLeft: '44px', display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {a.pincodes?.split(',').map(p => p.trim()).filter(Boolean).map(p => (
                    <span key={p} style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 600 }}>PIN: {p}</span>
                  ))}
                  {a.landmarks?.split(',').map(l => l.trim()).filter(Boolean).map(l => (
                    <span key={l} style={{ background: COLORS.background, color: COLORS.darkMuted, padding: '2px 8px', borderRadius: '5px', fontSize: '11px', border: `1px solid ${COLORS.border}` }}>{l}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <Badge variant={a.is_active ? 'success' : 'neutral'}>{a.is_active ? 'Active' : 'Inactive'}</Badge>
                <button onClick={() => toggle(a.id, a.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }} title={a.is_active ? 'Disable' : 'Enable'}>
                  {a.is_active ? <ToggleRight size={20} color={COLORS.success} /> : <ToggleLeft size={20} color={COLORS.muted} />}
                </button>
                <button onClick={() => openEdit(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex' }} title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteArea(a.id, a.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex' }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          .area-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
