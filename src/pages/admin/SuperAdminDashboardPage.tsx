import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, Tag, Plus, Trash2, Edit, ToggleLeft, ToggleRight, Save, MapPin, Search, Truck } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import Badge from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { CouponRow } from '../../types/database';

type Tab = 'dashboard' | 'orders' | 'services' | 'pricing' | 'coupons' | 'users' | 'areas' | 'admins';

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'orders',    label: 'Orders' },
    { key: 'services',  label: 'Services' },
    { key: 'pricing',   label: 'Pricing' },
    { key: 'coupons',   label: 'Coupons' },
    { key: 'users',     label: 'Users' },
    { key: 'areas',     label: 'Service Areas' },
    { key: 'admins',    label: 'Admins' },
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
        {activeTab === 'orders'    && <OrderManager />}
        {activeTab === 'coupons'   && <CouponManager />}
        {activeTab === 'users'     && <UserManager />}
        {activeTab === 'pricing'   && <PricingManager />}
        {activeTab === 'services'  && <ServiceManager />}
        {activeTab === 'areas'     && <ServiceAreaManager />}
        {activeTab === 'admins'    && <AdminManager />}
      </div>
    </Layout>
  );
}

type DashStats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  todayRevenue: number;
  activeCustomers: number;
  newUsersThisMonth: number;
  totalCoupons: number;
  totalServices: number;
  activeServices: number;
  avgOrderValue: number;
  recentOrders: { id: string; status: string; total: number; created_at: string }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:    '#F59E0B',
  confirmed:  '#3B82F6',
  picked_up:  '#8B5CF6',
  processing: '#06B6D4',
  ready:      '#10B981',
  delivered:  COLORS.success,
  cancelled:  COLORS.danger,
};

function SuperAdminStats() {
  const [stats, setStats] = useState<DashStats>({
    totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0,
    cancelledOrders: 0, todayOrders: 0, todayRevenue: 0, activeCustomers: 0,
    newUsersThisMonth: 0, totalCoupons: 0, totalServices: 0, activeServices: 0,
    avgOrderValue: 0, recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    Promise.all([
      supabase.from('orders').select('id, status, total, created_at').order('created_at', { ascending: false }),
      supabase.from('users').select('id, created_at, is_active'),
      supabase.from('coupons').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('services').select('id, is_active'),
    ]).then(([ordersRes, usersRes, couponsRes, servicesRes]) => {
      const orders = (ordersRes.data ?? []) as { id: string; status: string; total: number; created_at: string }[];
      const users  = (usersRes.data ?? []) as { id: string; created_at: string; is_active: boolean }[];
      const services = (servicesRes.data ?? []) as { id: string; is_active: boolean }[];

      const notCancelled = orders.filter(o => o.status !== 'cancelled');
      const todayOrders  = orders.filter(o => new Date(o.created_at) >= today);
      const totalRev     = notCancelled.reduce((s, o) => s + (o.total || 0), 0);
      const todayRev     = todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

      setStats({
        totalRevenue:     totalRev,
        totalOrders:      orders.length,
        pendingOrders:    orders.filter(o => o.status === 'pending').length,
        completedOrders:  orders.filter(o => o.status === 'delivered').length,
        cancelledOrders:  orders.filter(o => o.status === 'cancelled').length,
        todayOrders:      todayOrders.length,
        todayRevenue:     todayRev,
        activeCustomers:  users.filter(u => u.is_active).length,
        newUsersThisMonth: users.filter(u => new Date(u.created_at) >= monthStart).length,
        totalCoupons:     couponsRes.count ?? 0,
        totalServices:    services.length,
        activeServices:   services.filter(s => s.is_active).length,
        avgOrderValue:    notCancelled.length ? Math.round(totalRev / notCancelled.length) : 0,
        recentOrders:     orders.slice(0, 6),
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const topCards = [
    { icon: TrendingUp,  label: 'Total Revenue',      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,  sub: `Avg ₹${stats.avgOrderValue}/order`,        color: COLORS.success,  bg: '#F0FDF4' },
    { icon: Package,     label: 'Total Orders',        value: stats.totalOrders,                                 sub: `${stats.completedOrders} delivered`,       color: COLORS.primary,  bg: '#EFF6FF' },
    { icon: Users,       label: 'Active Customers',    value: stats.activeCustomers,                             sub: `+${stats.newUsersThisMonth} this month`,   color: '#8B5CF6',       bg: '#F5F3FF' },
    { icon: Tag,         label: 'Active Coupons',      value: stats.totalCoupons,                                sub: `${stats.totalServices} services total`,    color: '#F59E0B',       bg: '#FFFBEB' },
  ];

  const midCards = [
    { label: "Today's Orders",   value: stats.todayOrders,                                        color: COLORS.primary,  icon: '📦' },
    { label: "Today's Revenue",  value: `₹${stats.todayRevenue.toLocaleString('en-IN')}`,         color: COLORS.success,  icon: '💰' },
    { label: 'Pending Orders',   value: stats.pendingOrders,                                       color: '#F59E0B',       icon: '⏳' },
    { label: 'Cancelled Orders', value: stats.cancelledOrders,                                     color: COLORS.danger,   icon: '❌' },
    { label: 'Active Services',  value: `${stats.activeServices}/${stats.totalServices}`,          color: '#06B6D4',       icon: '🧺' },
    { label: 'New Users / Month', value: stats.newUsersThisMonth,                                  color: '#8B5CF6',       icon: '👤' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Top KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
        {topCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div style={{ fontSize: '30px', fontWeight: 900, color: COLORS.dark, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.muted, marginTop: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '12px', color: s.color, marginTop: '4px', fontWeight: 600 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Mid — 6 secondary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {midCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.05 }}
            style={{ background: '#FAFAFA', borderRadius: '14px', padding: '18px 20px', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{c.icon}</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: c.color, letterSpacing: '-0.5px' }}>{c.value}</div>
              <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>{c.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, marginBottom: '18px', margin: '0 0 18px' }}>Order Status Breakdown</h3>
        {stats.totalOrders === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(STATUS_COLORS).map(([status, color]) => {
              const count = stats.recentOrders.length > 0
                ? 0 // recentOrders is only 6; we need full count from totals
                : 0;
              const fullCount = status === 'pending' ? stats.pendingOrders
                : status === 'delivered' ? stats.completedOrders
                : status === 'cancelled' ? stats.cancelledOrders
                : null;
              if (fullCount === null) return null;
              const pct = stats.totalOrders ? Math.round((fullCount / stats.totalOrders) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.dark, textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                    <span style={{ fontSize: '13px', color: COLORS.muted }}>{fullCount} <span style={{ color, fontWeight: 700 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: '6px', background: COLORS.border, borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: color, borderRadius: '99px' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: '0 0 18px' }}>Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: '14px' }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {stats.recentOrders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < stats.recentOrders.length - 1 ? `1px solid ${COLORS.border}` : 'none', gap: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${STATUS_COLORS[o.status] ?? COLORS.muted}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={16} color={STATUS_COLORS[o.status] ?? COLORS.muted} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '13px', fontFamily: 'monospace' }}>#{o.id.slice(0, 8).toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '1px' }}>{new Date(o.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: COLORS.dark }}>₹{(o.total ?? 0).toLocaleString('en-IN')}</span>
                  <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: `${STATUS_COLORS[o.status] ?? COLORS.muted}18`, color: STATUS_COLORS[o.status] ?? COLORS.muted, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {o.status.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Order Manager ────────────────────────────────────────────────────────────

type AdminOrder = {
  id: string; order_number: string; status: string; total: number;
  subtotal: number; discount: number; coupon_code: string | null;
  delivery_type: 'regular' | 'express';
  pickup_date: string; pickup_time: string; delivery_address: string;
  created_at: string; user_id: string; notes: string | null;
};

function OrderManager() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    let q = supabase
      .from('orders')
      .select('id, order_number, status, total, subtotal, discount, coupon_code, delivery_type, pickup_date, pickup_time, delivery_address, created_at, user_id, notes')
      .order('created_at', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    const { data } = await q;
    setOrders(((data ?? []) as Array<{
      id: string; order_number: string; status: string; total: number;
      subtotal: number; discount: number; coupon_code: string | null;
      pickup_date: string; pickup_time: string; delivery_address: string;
      created_at: string; user_id: string; notes: string | null;
    }>).map(d => ({
      id: d.id, order_number: d.order_number, status: d.status, total: d.total,
      subtotal: d.subtotal ?? 0, discount: d.discount ?? 0, coupon_code: d.coupon_code ?? null,
      delivery_type: (d.delivery_type === 'express' ? 'express' : 'regular') as 'regular' | 'express',
      pickup_date: d.pickup_date, pickup_time: d.pickup_time,
      delivery_address: d.delivery_address, created_at: d.created_at,
      user_id: d.user_id, notes: d.notes ?? null,
    })));
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (user) {
      await supabase.from('admin_activity_logs').insert({
        admin_id: user.id, action: 'update_order_status',
        resource_type: 'order', resource_id: orderId,
        details: { new_status: newStatus },
      });
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return !q || o.order_number.toLowerCase().includes(q)
      || o.delivery_address.toLowerCase().includes(q)
      || o.user_id.toLowerCase().includes(q);
  });

  const statusCount = (s: string) => orders.filter(o => o.status === s).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Order Management</h2>
          <p style={{ color: COLORS.muted, fontSize: '13px', marginTop: '4px' }}>Update order status — changes reflect on customer tracking page immediately.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: COLORS.primaryLight, padding: '8px 14px', borderRadius: '10px' }}>
          <Truck size={15} color={COLORS.primary} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.primary }}>{orders.filter(o => !['delivered','cancelled'].includes(o.status)).length} active orders</span>
        </div>
      </div>

      {/* Status quick-filter chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[{ key: 'all', label: 'All', count: orders.length }, ...ORDER_STATUSES.map(s => ({ key: s.key, label: s.label, count: statusCount(s.key) }))].map(s => (
          <button key={s.key} onClick={() => setStatusFilter(s.key)}
            style={{ padding: '5px 12px', borderRadius: '999px', border: `1.5px solid ${statusFilter === s.key ? (STATUS_COLORS[s.key] ?? COLORS.primary) : COLORS.border}`, background: statusFilter === s.key ? `${STATUS_COLORS[s.key] ?? COLORS.primary}15` : '#fff', color: statusFilter === s.key ? (STATUS_COLORS[s.key] ?? COLORS.primary) : COLORS.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {s.label} <span style={{ opacity: 0.7 }}>({s.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order #, delivery address…"
          style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted, background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>No orders found.</div>
          ) : filtered.map(order => {
            const isExpanded = expandedId === order.id;
            const color = STATUS_COLORS[order.status] ?? COLORS.muted;
            return (
              <div key={order.id} style={{ background: '#fff', borderRadius: '16px', border: `1.5px solid ${isExpanded ? color : COLORS.border}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                {/* Row header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 80px 160px', padding: '14px 20px', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  className="order-row"
                >
                  {/* Order # */}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{order.order_number}</div>
                    <div style={{ fontSize: '11px', color: COLORS.muted, marginTop: '2px' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                  {/* Address */}
                  <div style={{ fontSize: '12px', color: COLORS.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.delivery_address}</div>
                  {/* Pickup date */}
                  <div style={{ fontSize: '12px', color: COLORS.darkMuted }}>
                    <div>{order.pickup_date}</div>
                    <div style={{ color: COLORS.muted }}>{order.pickup_time}</div>
                  </div>
                  {/* Total + express tag */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: order.total === 0 ? COLORS.muted : COLORS.dark }}>
                      {order.total === 0 ? <span style={{ fontSize: '12px', color: COLORS.muted }}>Pending</span> : `₹${order.total}`}
                    </span>
                    {order.delivery_type === 'express' && (
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '5px', padding: '1px 5px', width: 'fit-content' }}>⚡ Express</span>
                    )}
                  </div>
                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: `${color}18`, color, whiteSpace: 'nowrap' }}>
                      {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                    </span>
                    <span style={{ color: COLORS.muted, fontSize: '12px', marginLeft: 'auto' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <OrderExpandedPanel
                    order={order}
                    updatingId={updatingId}
                    updateStatus={updateStatus}
                    onBillChange={(id, subtotal, discount, total) =>
                      setOrders(prev => prev.map(o => o.id === id ? { ...o, subtotal, discount, total } : o))
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      <style>{`
        .order-row:hover { background: ${COLORS.background}; }
        @media (max-width: 700px) {
          .order-row { grid-template-columns: 1fr 1fr !important; }
          .order-row > *:nth-child(2) { display: none; }
          .order-row > *:nth-child(3) { display: none; }
        }
      `}</style>
    </div>
  );
}

// ─── Order Expanded Panel (Bill Builder) ─────────────────────────────────────

type OrderItem = { id: string; item_name: string; quantity: number; unit_price: number; total_price: number; service_id: string };
type CouponInfo = { type: string; value: number; code: string };

// Category buckets — determines which add-form to show
type ItemCategory = 'apparel' | 'shoes' | 'curtains' | 'blankets';

const ITEM_CATEGORY_TABS: { key: ItemCategory; label: string; emoji: string; color: string }[] = [
  { key: 'apparel',  label: 'Apparel',  emoji: '👕', color: COLORS.primary },
  { key: 'shoes',    label: 'Shoes',    emoji: '👟', color: '#EF4444'      },
  { key: 'curtains', label: 'Curtains', emoji: '🪟', color: '#06B6D4'      },
  { key: 'blankets', label: 'Blankets', emoji: '🛏️', color: '#10B981'      },
];

// Apparel service options with DB slug → label + color
const APPAREL_SERVICES = [
  { slug: 'wash-fold',    label: 'Wash & Fold', abbr: 'W&F', color: COLORS.primary },
  { slug: 'dry-cleaning', label: 'Dry Cleaning', abbr: 'DC',  color: '#8B5CF6'     },
  { slug: 'steam-ironing',label: 'Steam Iron',   abbr: 'SI',  color: '#F59E0B'     },
] as const;

// Preset item lists for quick entry
const APPAREL_PRESETS = ['Shirt','T-Shirt','Jeans','Trousers','Kurta','Saree','Suit','Blazer','Lehenga','Bed Sheet'];
const SHOE_PRESETS    = ['Sneakers / Sports','Leather / Formal Shoes','Boots','Sandals / Flats'];
const CURTAIN_PRESETS = ['Sheer / Net Curtain','Heavy Drape / Blackout','Eyelet / Ring Top'];
const BLANKET_PRESETS = ['Single Blanket','Double Blanket','Quilt / Comforter','Duvet (King)'];

function calcDiscount(subtotal: number, coupon: CouponInfo | null): number {
  if (!coupon) return 0;
  if (coupon.type === 'percentage') return Math.round(subtotal * coupon.value / 100 * 100) / 100;
  if (coupon.type === 'fixed') return Math.min(coupon.value, subtotal);
  return 0;
}

// Service slug → display label (for bill display)
const SLUG_LABEL: Record<string, string> = {
  'wash-fold': 'W&F', 'dry-cleaning': 'DC', 'steam-ironing': 'SI',
  'shoe-cleaning': 'Shoes', 'curtain-cleaning': 'Curtains', 'blanket-cleaning': 'Blankets',
};
const SLUG_COLOR: Record<string, string> = {
  'wash-fold': COLORS.primary, 'dry-cleaning': '#8B5CF6', 'steam-ironing': '#F59E0B',
  'shoe-cleaning': '#EF4444', 'curtain-cleaning': '#06B6D4', 'blanket-cleaning': '#10B981',
};

// Lightweight pricing row — only what bill builder needs
type PricingRow = { item_name: string; wash_fold_price: number | null; dry_clean_price: number | null; steam_iron_price: number | null };

function OrderExpandedPanel({
  order, updatingId, updateStatus, onBillChange,
}: {
  order: AdminOrder;
  updatingId: string | null;
  updateStatus: (id: string, status: string) => Promise<void>;
  onBillChange: (id: string, subtotal: number, discount: number, total: number) => void;
}) {
  const [items, setItems]             = useState<OrderItem[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [coupon, setCoupon]           = useState<CouponInfo | null>(null);
  const [saving, setSaving]           = useState(false);
  const [addError, setAddError]       = useState('');
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [pricingDB, setPricingDB]     = useState<PricingRow[]>([]);
  const [slugToId, setSlugToId]       = useState<Record<string, string>>({});

  // Add-form state
  const [addCat, setAddCat]           = useState<ItemCategory>('apparel');
  const [itemName, setItemName]       = useState('');
  const [serviceSlug, setServiceSlug] = useState<string>('wash-fold');
  const [qty, setQty]                 = useState('1');
  const [price, setPrice]             = useState('');

  // Auto-lookup price from pricingDB given item name + service slug
  const lookupPrice = useCallback((name: string, slug: string): string => {
    if (!name) return '';
    const row = pricingDB.find(p => p.item_name.toLowerCase() === name.toLowerCase());
    if (!row) return '';
    if (slug === 'wash-fold')     return row.wash_fold_price?.toString()  ?? '';
    if (slug === 'dry-cleaning')  return row.dry_clean_price?.toString()  ?? '';
    if (slug === 'steam-ironing') return row.steam_iron_price?.toString() ?? '';
    // Specialty (shoe/curtain/blanket) stored in wash_fold_price
    return row.wash_fold_price?.toString() ?? '';
  }, [pricingDB]);

  // Fetch items + coupon + pricing DB on mount
  useEffect(() => {
    supabase.from('order_items').select('*').eq('order_id', order.id).order('created_at')
      .then(({ data }) => { setItems((data ?? []) as OrderItem[]); setItemsLoaded(true); });
    if (order.coupon_code) {
      supabase.from('coupons').select('code, type, value').eq('code', order.coupon_code).single()
        .then(({ data }) => { if (data) setCoupon({ code: data.code, type: data.type, value: data.value }); });
    }
    supabase.from('pricing').select('item_name, wash_fold_price, dry_clean_price, steam_iron_price').eq('is_active', true)
      .then(({ data }) => { if (data) setPricingDB(data as PricingRow[]); });
    supabase.from('services').select('id, slug')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          (data as { id: string; slug: string }[]).forEach(s => { map[s.slug] = s.id; });
          setSlugToId(map);
        }
      });
  }, [order.id, order.coupon_code]);

  const isExpress = order.delivery_type === 'express';
  const EXPRESS_MULTIPLIER = 1.5;

  const persistBill = async (newItems: OrderItem[]) => {
    const itemsTotal = Math.round(newItems.reduce((s, i) => s + i.total_price, 0) * 100) / 100;
    const subtotal   = isExpress ? Math.round(itemsTotal * EXPRESS_MULTIPLIER * 100) / 100 : itemsTotal;
    const discount   = calcDiscount(subtotal, coupon);
    const total      = Math.round(Math.max(0, subtotal - discount) * 100) / 100;
    await supabase.from('orders').update({ subtotal, discount, total, updated_at: new Date().toISOString() }).eq('id', order.id);
    onBillChange(order.id, subtotal, discount, total);
  };

  // Derive service_id slug for specialty categories
  const specialtySlug = (cat: ItemCategory) =>
    cat === 'shoes' ? 'shoe-cleaning' : cat === 'curtains' ? 'curtain-cleaning' : 'blanket-cleaning';

  const canAdd = itemName.trim() && price && parseFloat(price) > 0;

  const addItem = async () => {
    const q = parseInt(qty) || 1;
    const p = parseFloat(price);
    if (!itemName.trim() || isNaN(p) || p <= 0) return;
    setSaving(true);
    setAddError('');
    const tp = Math.round(q * p * 100) / 100;
    const slug = addCat === 'apparel' ? serviceSlug : specialtySlug(addCat);
    const serviceUuid = slugToId[slug];
    if (!serviceUuid) {
      setAddError(`Service "${slug}" not found. Make sure services are configured.`);
      setSaving(false);
      return;
    }
    const { error } = await supabase.from('order_items').insert({
      order_id: order.id, service_id: serviceUuid,
      item_name: itemName.trim(), quantity: q, unit_price: p, total_price: tp,
    });
    if (error) {
      setAddError(error.message);
      setSaving(false);
      return;
    }
    // Refetch the full list so we always have fresh IDs regardless of RLS
    const { data: fresh } = await supabase.from('order_items').select('*').eq('order_id', order.id).order('created_at');
    const newItems = (fresh ?? []) as OrderItem[];
    setItems(newItems);
    await persistBill(newItems);
    setItemName(''); setQty('1'); setPrice('');
    setSaving(false);
  };

  const removeItem = async (itemId: string) => {
    setDeletingId(itemId);
    await supabase.from('order_items').delete().eq('id', itemId);
    const newItems = items.filter(i => i.id !== itemId);
    setItems(newItems);
    await persistBill(newItems);
    setDeletingId(null);
  };

  const itemsBase   = items.reduce((s, i) => s + i.total_price, 0);
  const subtotal    = isExpress ? Math.round(itemsBase * EXPRESS_MULTIPLIER * 100) / 100 : itemsBase;
  const discountAmt = calcDiscount(subtotal, coupon);
  const finalTotal  = Math.max(0, subtotal - discountAmt);
  const hasCoupon   = !!order.coupon_code;
  const isFreeService = coupon && (coupon.type === 'free_pickup' || coupon.type === 'free_delivery');

  // Preset list for current add category
  const presets = addCat === 'apparel' ? APPAREL_PRESETS : addCat === 'shoes' ? SHOE_PRESETS : addCat === 'curtains' ? CURTAIN_PRESETS : BLANKET_PRESETS;
  const catColor = ITEM_CATEGORY_TABS.find(t => t.key === addCat)!.color;

  return (
    <div style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.background }}>
      {/* Meta info row */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: COLORS.darkMuted, alignItems: 'center' }}>
        <span><span style={{ color: COLORS.muted }}>Order: </span><strong style={{ fontFamily: 'monospace' }}>#{order.order_number}</strong></span>
        <span><span style={{ color: COLORS.muted }}>Pickup: </span><strong>{order.pickup_date} · {order.pickup_time}</strong></span>
        <span><span style={{ color: COLORS.muted }}>Address: </span><strong>{order.delivery_address}</strong></span>
        {isExpress ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: 800, color: '#F97316' }}>
            ⚡ Express Order — 1.5× pricing applied
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: COLORS.background, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, color: COLORS.muted }}>
            🕐 Regular
          </span>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>📋</span>
          <p style={{ margin: 0, fontSize: '13px', color: '#78350F' }}><strong>Note:</strong> {order.notes}</p>
        </div>
      )}

      {/* Coupon banner */}
      {hasCoupon && (
        <div style={{ margin: '10px 20px 0', padding: '9px 14px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px' }}>🏷️</span>
          <span style={{ fontSize: '13px', color: '#166534', fontWeight: 700 }}>Coupon: {order.coupon_code}</span>
          {coupon && (
            <span style={{ fontSize: '12px', color: '#15803D', marginLeft: '4px' }}>
              {coupon.type === 'percentage' && `(${coupon.value}% off)`}
              {coupon.type === 'fixed' && `(₹${coupon.value} off)`}
              {coupon.type === 'free_pickup' && '(Free pickup)'}
              {coupon.type === 'free_delivery' && '(Free delivery)'}
            </span>
          )}
          {coupon && discountAmt > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 900, color: '#166534' }}>−₹{discountAmt.toLocaleString('en-IN')}</span>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 20px' }} className="order-panel-grid">

        {/* ── Bill Builder ── */}
        <div style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: COLORS.dark }}>📦 Items Received</p>
            {subtotal > 0 && (
              <span style={{ fontWeight: 900, fontSize: '15px', color: discountAmt > 0 ? COLORS.muted : COLORS.primary, textDecoration: discountAmt > 0 ? 'line-through' : 'none' }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Item list */}
          {!itemsLoaded ? (
            <div style={{ padding: '20px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>Loading…</div>
          ) : items.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>No items added yet.</div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 50px 64px 28px', padding: '7px 12px', background: COLORS.background, fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em', gap: '6px' }}>
                <span>Item</span><span style={{ textAlign: 'center' }}>Type</span><span style={{ textAlign: 'center' }}>Qty</span><span style={{ textAlign: 'right' }}>Total</span><span></span>
              </div>
              {items.map(item => {
                const idToSlug: Record<string, string> = Object.fromEntries(Object.entries(slugToId).map(([s, id]) => [id, s]));
                const slug = idToSlug[item.service_id] ?? item.service_id ?? '';
                const tagColor = SLUG_COLOR[slug] ?? COLORS.muted;
                const tagLabel = SLUG_LABEL[slug] ?? slug;
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 48px 50px 64px 28px', padding: '9px 12px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', fontSize: '13px', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: COLORS.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.item_name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: tagColor, background: `${tagColor}15`, borderRadius: '5px', padding: '2px 5px', textAlign: 'center', whiteSpace: 'nowrap' }}>{tagLabel}</span>
                    <span style={{ color: COLORS.muted, textAlign: 'center' }}>×{item.quantity}</span>
                    <span style={{ fontWeight: 800, color: COLORS.dark, textAlign: 'right' }}>₹{item.total_price}</span>
                    <button onClick={() => removeItem(item.id)} disabled={deletingId === item.id}
                      style={{ width: 22, height: 22, borderRadius: '5px', border: 'none', background: '#FEE2E2', color: COLORS.danger, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', opacity: deletingId === item.id ? 0.4 : 1, padding: 0 }}>
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Totals footer */}
              {(isExpress || discountAmt > 0) ? (
                <>
                  {isExpress && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: `1px solid ${COLORS.border}`, fontSize: '12px', color: COLORS.muted }}>
                        <span>Items total</span><span>₹{itemsBase.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px 8px', fontSize: '12px', color: '#F97316', fontWeight: 700 }}>
                        <span>⚡ Express (×1.5)</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  {!isExpress && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: `1px solid ${COLORS.border}`, fontSize: '12px', color: COLORS.muted }}>
                      <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {discountAmt > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px 8px', fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>
                      <span>Coupon ({order.coupon_code})</span><span>−₹{discountAmt.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderTop: `2px solid ${COLORS.border}`, background: COLORS.primaryLight }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.primary }}>Total Payable</span>
                    <span style={{ fontWeight: 900, fontSize: '14px', color: COLORS.primary }}>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderTop: `2px solid ${COLORS.border}`, background: COLORS.primaryLight }}>
                  <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.primary }}>Grand Total</span>
                  <span style={{ fontWeight: 900, fontSize: '14px', color: COLORS.primary }}>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {isFreeService && (
                <div style={{ padding: '7px 12px', background: '#F0FDF4', borderTop: `1px solid #BBF7D0`, fontSize: '12px', color: '#166534' }}>
                  ✓ {coupon!.type === 'free_pickup' ? 'Pickup' : 'Delivery'} charge waived
                </div>
              )}
            </div>
          )}

          {/* ── Add Item Form — hidden once delivered or cancelled ── */}
          {!['delivered', 'cancelled'].includes(order.status) && <div style={{ padding: '14px 14px', borderTop: `1px solid ${COLORS.border}`, background: '#FAFFFE' }}>
            <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>+ Add Item</p>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
              {ITEM_CATEGORY_TABS.map(t => (
                <button key={t.key} onClick={() => { setAddCat(t.key); setItemName(''); setPrice(''); setQty('1'); if (t.key === 'apparel') setServiceSlug('wash-fold'); }}
                  style={{ flex: 1, padding: '6px 4px', borderRadius: '7px', border: `1.5px solid ${addCat === t.key ? t.color : COLORS.border}`, background: addCat === t.key ? `${t.color}15` : '#fff', color: addCat === t.key ? t.color : COLORS.muted, fontWeight: 700, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t.emoji}
                </button>
              ))}
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 700, color: catColor }}>{ITEM_CATEGORY_TABS.find(t => t.key === addCat)!.label}</p>

            {/* Item name with presets */}
            <div style={{ marginBottom: '8px' }}>
              <input value={itemName} onChange={e => {
                const v = e.target.value;
                setItemName(v);
                const slug = addCat === 'apparel' ? serviceSlug : specialtySlug(addCat);
                const auto = lookupPrice(v, slug);
                if (auto) setPrice(auto);
              }} placeholder="Item name"
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {presets.map(p => (
                  <button key={p} onClick={() => {
                    setItemName(p);
                    const slug = addCat === 'apparel' ? serviceSlug : specialtySlug(addCat);
                    const auto = lookupPrice(p, slug);
                    if (auto) setPrice(auto);
                  }}
                    style={{ padding: '3px 8px', borderRadius: '6px', border: `1px solid ${COLORS.border}`, background: itemName === p ? `${catColor}15` : '#fff', color: itemName === p ? catColor : COLORS.muted, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: itemName === p ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Apparel: service type selector */}
            {addCat === 'apparel' && (
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {APPAREL_SERVICES.map(s => (
                  <button key={s.slug} onClick={() => {
                    setServiceSlug(s.slug);
                    // Re-lookup price if item already selected
                    const auto = lookupPrice(itemName, s.slug);
                    if (auto) setPrice(auto);
                  }}
                    style={{ flex: 1, padding: '6px 4px', borderRadius: '7px', border: `1.5px solid ${serviceSlug === s.slug ? s.color : COLORS.border}`, background: serviceSlug === s.slug ? `${s.color}18` : '#fff', color: serviceSlug === s.slug ? s.color : COLORS.muted, fontWeight: 800, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {s.abbr}
                  </button>
                ))}
              </div>
            )}

            {/* Qty + price row */}
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '8px', marginBottom: '8px' }}>
              <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty"
                style={{ padding: '8px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', textAlign: 'center' }} />
              <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="₹ per item"
                onKeyDown={e => e.key === 'Enter' && canAdd && addItem()}
                style={{ padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', textAlign: 'right' }} />
            </div>

            {addError && (
              <p style={{ color: COLORS.danger, fontSize: '12px', margin: '0 0 8px', fontWeight: 600 }}>{addError}</p>
            )}
            <button onClick={addItem} disabled={saving || !canAdd}
              style={{ width: '100%', padding: '9px', borderRadius: '8px', background: catColor, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: saving || !canAdd ? 0.45 : 1 }}>
              {saving ? 'Adding…' : `+ Add to Bill`}
            </button>
          </div>}
        </div>

        {/* ── Status Update ── */}
        <div style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${COLORS.border}`, padding: '16px' }}>
          <p style={{ margin: '0 0 14px', fontWeight: 800, fontSize: '14px', color: COLORS.dark }}>🔄 Update Status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ORDER_STATUSES.map(s => {
              const sc = STATUS_COLORS[s.key] ?? COLORS.muted;
              const isActive = order.status === s.key;
              return (
                <button key={s.key} onClick={() => updateStatus(order.id, s.key)} disabled={updatingId === order.id}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: `2px solid ${isActive ? sc : COLORS.border}`, background: isActive ? `${sc}18` : '#fff', color: isActive ? sc : COLORS.darkMuted, fontSize: '13px', fontWeight: isActive ? 800 : 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', opacity: updatingId === order.id ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? sc : COLORS.border, flexShrink: 0, display: 'inline-block' }} />
                  {s.label}
                  {isActive && <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700 }}>● Current</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`.order-panel-grid { @media (max-width: 700px) { grid-template-columns: 1fr !important; } }`}</style>
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

// Category → pricing section mapping
const SPECIALTY_CATEGORIES: Record<string, { label: string; emoji: string; color: string; priceLabel: string; unit: string }> = {
  'Footwear': { label: 'Shoes',    emoji: '👟', color: '#EF4444', priceLabel: 'Price / pair', unit: 'per pair'   },
  'Curtains': { label: 'Curtains', emoji: '🪟', color: '#06B6D4', priceLabel: 'Price / panel', unit: 'per panel' },
  'Bedding':  { label: 'Blankets', emoji: '🛏️', color: '#10B981', priceLabel: 'Price / piece', unit: 'per piece' },
};
const SPECIALTY_CATS = Object.keys(SPECIALTY_CATEGORIES);

type PricingTab = 'apparel' | 'shoes' | 'curtains' | 'blankets';
const PRICING_TABS: { key: PricingTab; label: string; emoji: string; dbCat?: string }[] = [
  { key: 'apparel',  label: 'Apparel',  emoji: '👕' },
  { key: 'shoes',    label: 'Shoes',    emoji: '👟', dbCat: 'Footwear' },
  { key: 'curtains', label: 'Curtains', emoji: '🪟', dbCat: 'Curtains' },
  { key: 'blankets', label: 'Blankets', emoji: '🛏️', dbCat: 'Bedding'  },
];

const EMPTY_APPAREL   = { item_name: '', category: '', wash_fold_price: '', dry_clean_price: '', steam_iron_price: '' };
const EMPTY_SPECIALTY = { item_name: '', price: '' };

const APPAREL_CATEGORY_OPTS = ['Tops', 'Bottoms', 'Ethnic Wear', 'Formal', 'Home Linen', 'Other'];

// Seed defaults — inserted into DB when admin clicks "Seed Defaults"
const SEED_DEFAULTS: Record<string, { item_name: string; category: string; wash_fold_price: number | null; dry_clean_price: number | null; steam_iron_price: number | null }[]> = {
  apparel: [
    { item_name: 'Shirt',          category: 'Tops',        wash_fold_price: 49,   dry_clean_price: 149,  steam_iron_price: 29  },
    { item_name: 'T-Shirt',        category: 'Tops',        wash_fold_price: 35,   dry_clean_price: 99,   steam_iron_price: 20  },
    { item_name: 'Jeans',          category: 'Bottoms',     wash_fold_price: 79,   dry_clean_price: 199,  steam_iron_price: 39  },
    { item_name: 'Trousers',       category: 'Bottoms',     wash_fold_price: 69,   dry_clean_price: 179,  steam_iron_price: 35  },
    { item_name: 'Saree (Cotton)', category: 'Ethnic Wear', wash_fold_price: 99,   dry_clean_price: 249,  steam_iron_price: 59  },
    { item_name: 'Saree (Silk)',   category: 'Ethnic Wear', wash_fold_price: null, dry_clean_price: 399,  steam_iron_price: 79  },
    { item_name: 'Kurta',          category: 'Ethnic Wear', wash_fold_price: 79,   dry_clean_price: 199,  steam_iron_price: 49  },
    { item_name: 'Lehenga',        category: 'Ethnic Wear', wash_fold_price: null, dry_clean_price: 599,  steam_iron_price: 149 },
    { item_name: 'Suit (2 Piece)', category: 'Formal',      wash_fold_price: null, dry_clean_price: 499,  steam_iron_price: 99  },
    { item_name: 'Blazer',         category: 'Formal',      wash_fold_price: null, dry_clean_price: 299,  steam_iron_price: 79  },
    { item_name: 'Bed Sheet',      category: 'Home Linen',  wash_fold_price: 99,   dry_clean_price: null, steam_iron_price: 39  },
  ],
  shoes: [
    { item_name: 'Sneakers / Sports',      category: 'Footwear', wash_fold_price: 199, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Leather / Formal Shoes', category: 'Footwear', wash_fold_price: 299, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Boots',                  category: 'Footwear', wash_fold_price: 349, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Sandals / Flats',        category: 'Footwear', wash_fold_price: 149, dry_clean_price: null, steam_iron_price: null },
  ],
  curtains: [
    { item_name: 'Sheer / Net Curtain',    category: 'Curtains', wash_fold_price: 99,  dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Heavy Drape / Blackout', category: 'Curtains', wash_fold_price: 149, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Eyelet / Ring Top',      category: 'Curtains', wash_fold_price: 129, dry_clean_price: null, steam_iron_price: null },
  ],
  blankets: [
    { item_name: 'Single Blanket',    category: 'Bedding', wash_fold_price: 149, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Double Blanket',    category: 'Bedding', wash_fold_price: 199, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Quilt / Comforter', category: 'Bedding', wash_fold_price: 249, dry_clean_price: null, steam_iron_price: null },
    { item_name: 'Duvet (King)',      category: 'Bedding', wash_fold_price: 349, dry_clean_price: null, steam_iron_price: null },
  ],
};

function PricingManager() {
  const [allItems, setAllItems]         = useState<PricingItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState<PricingTab>('apparel');
  const [editId, setEditId]             = useState<string | null>(null);
  const [editValues, setEditValues]     = useState({ wash_fold_price: '', dry_clean_price: '', steam_iron_price: '', price: '' });
  const [seeding, setSeeding]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [showAdd, setShowAdd]           = useState(false);
  const [addApparel, setAddApparel]     = useState(EMPTY_APPAREL);
  const [addSpecialty, setAddSpecialty] = useState(EMPTY_SPECIALTY);
  const [addError, setAddError]         = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('pricing')
      .select('id, item_name, category, wash_fold_price, dry_clean_price, steam_iron_price')
      .eq('is_active', true)
      .order('category').order('item_name');
    setAllItems((data ?? []) as PricingItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const seedDefaults = async () => {
    const defaults = SEED_DEFAULTS[activeTab];
    if (!defaults?.length) return;
    // Only insert items not already present (match by item_name + category)
    const existing = allItems.map(i => `${i.item_name}|${i.category}`);
    const toInsert = defaults.filter(d => !existing.includes(`${d.item_name}|${d.category}`));
    if (!toInsert.length) { alert('All default items already exist for this category.'); return; }
    setSeeding(true);
    await supabase.from('pricing').insert(toInsert.map(d => ({ ...d, is_active: true })));
    await load();
    setSeeding(false);
  };

  // Split items by tab
  const tabItems = (tab: PricingTab): PricingItem[] => {
    const dbCat = PRICING_TABS.find(t => t.key === tab)?.dbCat;
    if (tab === 'apparel') return allItems.filter(i => !SPECIALTY_CATS.includes(i.category));
    return allItems.filter(i => i.category === dbCat);
  };

  const isSpecialty = activeTab !== 'apparel';
  const currentDbCat = PRICING_TABS.find(t => t.key === activeTab)?.dbCat ?? '';
  const specialtyMeta = isSpecialty ? SPECIALTY_CATEGORIES[currentDbCat] : null;

  const startEdit = (item: PricingItem) => {
    setEditId(item.id);
    if (isSpecialty) {
      setEditValues({ wash_fold_price: '', dry_clean_price: '', steam_iron_price: '', price: item.wash_fold_price?.toString() ?? '' });
    } else {
      setEditValues({ wash_fold_price: item.wash_fold_price?.toString() ?? '', dry_clean_price: item.dry_clean_price?.toString() ?? '', steam_iron_price: item.steam_iron_price?.toString() ?? '', price: '' });
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    const update = isSpecialty
      ? { wash_fold_price: editValues.price ? Number(editValues.price) : null, dry_clean_price: null, steam_iron_price: null, updated_at: new Date().toISOString() }
      : { wash_fold_price: editValues.wash_fold_price ? Number(editValues.wash_fold_price) : null, dry_clean_price: editValues.dry_clean_price ? Number(editValues.dry_clean_price) : null, steam_iron_price: editValues.steam_iron_price ? Number(editValues.steam_iron_price) : null, updated_at: new Date().toISOString() };
    await supabase.from('pricing').update(update).eq('id', editId);
    setAllItems(p => p.map(i => i.id === editId ? { ...i, ...update } : i));
    setEditId(null);
    setSaving(false);
  };

  const addItem = async () => {
    if (isSpecialty) {
      if (!addSpecialty.item_name.trim()) { setAddError('Item name is required.'); return; }
      setSaving(true); setAddError('');
      const { error } = await supabase.from('pricing').insert({
        item_name: addSpecialty.item_name.trim(), category: currentDbCat,
        wash_fold_price: addSpecialty.price ? Number(addSpecialty.price) : null,
        dry_clean_price: null, steam_iron_price: null, is_active: true,
      });
      if (error) { setAddError(error.message); setSaving(false); return; }
      setAddSpecialty(EMPTY_SPECIALTY);
    } else {
      if (!addApparel.item_name.trim() || !addApparel.category.trim()) { setAddError('Item name and category are required.'); return; }
      setSaving(true); setAddError('');
      const { error } = await supabase.from('pricing').insert({
        item_name: addApparel.item_name.trim(), category: addApparel.category.trim(),
        wash_fold_price: addApparel.wash_fold_price ? Number(addApparel.wash_fold_price) : null,
        dry_clean_price: addApparel.dry_clean_price ? Number(addApparel.dry_clean_price) : null,
        steam_iron_price: addApparel.steam_iron_price ? Number(addApparel.steam_iron_price) : null,
        is_active: true,
      });
      if (error) { setAddError(error.message); setSaving(false); return; }
      setAddApparel(EMPTY_APPAREL);
    }
    setShowAdd(false);
    await load();
    setSaving(false);
  };

  const deleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await supabase.from('pricing').delete().eq('id', id);
    setAllItems(p => p.filter(i => i.id !== id));
  };

  const items = tabItems(activeTab);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Pricing Management</h2>
          <p style={{ color: COLORS.muted, fontSize: '14px', marginTop: '4px' }}>Changes reflect immediately across the website and bill builder.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={seedDefaults} disabled={seeding}
            title={`Insert standard ${activeTab} items into the DB`}
            style={{ padding: '8px 14px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, background: '#fff', color: COLORS.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', opacity: seeding ? 0.6 : 1 }}>
            {seeding ? '⏳' : '🌱'} {seeding ? 'Seeding…' : 'Seed Defaults'}
          </button>
          <Button icon={<Plus size={16} />} onClick={() => { setShowAdd(v => !v); setAddError(''); }} size="sm">Add Item</Button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', padding: '5px', background: COLORS.background, borderRadius: '12px', marginBottom: '20px', width: 'fit-content' }}>
        {PRICING_TABS.map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setShowAdd(false); setEditId(null); setAddError(''); }}
            style={{ padding: '8px 16px', borderRadius: '9px', border: 'none', background: activeTab === t.key ? '#fff' : 'transparent', color: activeTab === t.key ? COLORS.dark : COLORS.muted, fontWeight: activeTab === t.key ? 800 : 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: activeTab === t.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', whiteSpace: 'nowrap' }}>
            {t.emoji} {t.label} <span style={{ opacity: 0.6, fontSize: '11px' }}>({tabItems(t.key).length})</span>
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#F8FAFF', border: `1.5px solid ${COLORS.primary}30`, borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: COLORS.dark, marginBottom: '14px' }}>
            {isSpecialty ? `New ${specialtyMeta?.label} Item` : 'New Apparel Item'}
          </h3>
          {isSpecialty ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '12px', marginBottom: '12px' }}>
              <Input label="Item Name *" placeholder={`e.g. ${activeTab === 'shoes' ? 'Sneakers' : activeTab === 'curtains' ? 'Sheer Curtain' : 'Single Blanket'}`}
                value={addSpecialty.item_name} onChange={e => setAddSpecialty(p => ({ ...p, item_name: e.target.value }))} />
              <Input label={specialtyMeta?.priceLabel ?? 'Price ₹'} type="number" placeholder="—"
                value={addSpecialty.price} onChange={e => setAddSpecialty(p => ({ ...p, price: e.target.value }))} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <Input label="Item Name *" placeholder="Shirt" value={addApparel.item_name} onChange={e => setAddApparel(p => ({ ...p, item_name: e.target.value }))} />
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: COLORS.dark, display: 'block', marginBottom: '6px' }}>Category *</label>
                <select value={addApparel.category} onChange={e => setAddApparel(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit' }}>
                  <option value="">Select…</option>
                  {APPAREL_CATEGORY_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Wash & Fold ₹" type="number" placeholder="—" value={addApparel.wash_fold_price} onChange={e => setAddApparel(p => ({ ...p, wash_fold_price: e.target.value }))} />
              <Input label="Dry Clean ₹" type="number" placeholder="—" value={addApparel.dry_clean_price} onChange={e => setAddApparel(p => ({ ...p, dry_clean_price: e.target.value }))} />
              <Input label="Steam Iron ₹" type="number" placeholder="—" value={addApparel.steam_iron_price} onChange={e => setAddApparel(p => ({ ...p, steam_iron_price: e.target.value }))} />
            </div>
          )}
          {addError && <p style={{ color: COLORS.danger, fontSize: '13px', marginBottom: '10px' }}>{addError}</p>}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={addItem} loading={saving} icon={<Save size={16} />} size="sm">Save Item</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)} size="sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          {/* Table header */}
          {isSpecialty ? (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px', padding: '11px 20px', background: COLORS.background, gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase' }}>Item</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: specialtyMeta?.color, textTransform: 'uppercase' }}>{specialtyMeta?.unit.toUpperCase()}</span>
              <span></span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px 90px 90px 90px', padding: '11px 20px', background: COLORS.background, gap: '8px' }}>
              {[
                { label: 'Item', color: COLORS.muted },
                { label: 'Category', color: COLORS.muted },
                { label: 'W&F ₹', color: COLORS.primary },
                { label: 'DC ₹', color: '#8B5CF6' },
                { label: 'SI ₹', color: '#F59E0B' },
                { label: '', color: '' },
              ].map(h => (
                <span key={h.label} style={{ fontSize: '11px', fontWeight: 700, color: h.color || COLORS.muted, textTransform: 'uppercase' }}>{h.label}</span>
              ))}
            </div>
          )}

          {items.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: COLORS.muted, fontSize: '14px' }}>
              No items yet. Click <strong>+ Add Item</strong> to add one.
            </div>
          )}

          {items.map((item, idx) => (
            <div key={item.id}
              style={{ display: 'grid', gridTemplateColumns: isSpecialty ? '2fr 1fr 90px' : '2fr 1fr 90px 90px 90px 90px', padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '8px', background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
              <span style={{ fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>{item.item_name}</span>

              {isSpecialty ? (
                editId === item.id ? (
                  <input value={editValues.price} onChange={e => setEditValues(p => ({ ...p, price: e.target.value }))}
                    style={{ padding: '6px 8px', borderRadius: '6px', border: `1.5px solid ${specialtyMeta?.color}`, width: '80px', fontFamily: 'inherit', fontSize: '14px' }} placeholder="₹" autoFocus />
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '15px', color: specialtyMeta?.color }}>
                    {item.wash_fold_price ? `₹${item.wash_fold_price}` : <span style={{ color: '#CBD5E1' }}>—</span>}
                  </span>
                )
              ) : (
                <>
                  <span style={{ fontSize: '12px', color: COLORS.muted }}>{item.category}</span>
                  {editId === item.id ? (
                    <>
                      {[
                        { key: 'wash_fold_price' as const, color: COLORS.primary },
                        { key: 'dry_clean_price' as const, color: '#8B5CF6' },
                        { key: 'steam_iron_price' as const, color: '#F59E0B' },
                      ].map(f => (
                        <input key={f.key} value={editValues[f.key]} onChange={e => setEditValues(p => ({ ...p, [f.key]: e.target.value }))}
                          style={{ padding: '6px 8px', borderRadius: '6px', border: `1.5px solid ${f.color}`, width: '70px', fontFamily: 'inherit', fontSize: '13px' }} placeholder="—" />
                      ))}
                    </>
                  ) : (
                    <>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: COLORS.primary }}>{item.wash_fold_price != null ? `₹${item.wash_fold_price}` : <span style={{ color: '#CBD5E1' }}>—</span>}</span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#8B5CF6' }}>{item.dry_clean_price != null ? `₹${item.dry_clean_price}` : <span style={{ color: '#CBD5E1' }}>—</span>}</span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#F59E0B' }}>{item.steam_iron_price != null ? `₹${item.steam_iron_price}` : <span style={{ color: '#CBD5E1' }}>—</span>}</span>
                    </>
                  )}
                </>
              )}

              {/* Actions */}
              {editId === item.id ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={saveEdit} disabled={saving}
                    style={{ background: COLORS.success, color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', fontWeight: 700 }}>
                    {saving ? '…' : 'Save'}
                  </button>
                  <button onClick={() => setEditId(null)}
                    style={{ background: COLORS.background, color: COLORS.muted, border: `1px solid ${COLORS.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button onClick={() => startEdit(item)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600 }}>
                    <Edit size={13} /> Edit
                  </button>
                  <button onClick={() => deleteItem(item.id, item.item_name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.danger, display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
  city: string;
  state: string;
  coverage: string | null;
  pickup_slots: string | null;
  delivery_info: string | null;
  pincodes: string | null;
  landmarks: string | null;
  is_active: boolean;
  sort_order: number;
};

function ServiceAreaManager() {
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const FORM_EMPTY = { slug: '', name: '', city: '', state: 'West Bengal', coverage: '', pickup_slots: '', delivery_info: '', pincodes: '', landmarks: '', sort_order: '0' };
  const [form, setForm] = useState(FORM_EMPTY);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('service_areas')
      .select('id, slug, name, city, state, coverage, pickup_slots, delivery_info, pincodes, landmarks, is_active, sort_order')
      .order('sort_order');
    setAreas((data ?? []) as AreaRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

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
      city: a.city,
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
      city: form.city.trim() || form.name.trim(),
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

  const fld = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

          {/* Row 1: Name, City, Slug, State, Sort Order */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <Input label="Display Name *" placeholder="Kolkata" value={form.name} onChange={fld('name')} hint="Shown as heading" />
            <Input label="City *" placeholder="Kolkata" value={form.city} onChange={fld('city')} hint="City identifier" />
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
