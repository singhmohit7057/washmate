import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Clock, Truck, Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress: string;
  createdAt: string;
  userId: string;
}

const UPDATE_STATUSES = ORDER_STATUSES.map(s => ({ value: s.key, label: s.label }));

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    let query = supabase.from('orders').select('id, order_number, status, total, pickup_date, pickup_time, delivery_address, created_at, user_id').order('created_at', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data } = await query;
    setOrders((data ?? []).map(d => ({
      id: d.id,
      orderNumber: d.order_number,
      status: d.status,
      total: d.total,
      pickupDate: d.pickup_date,
      pickupTime: d.pickup_time,
      deliveryAddress: d.delivery_address,
      createdAt: d.created_at,
      userId: d.user_id,
    })));
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (user) {
      await supabase.from('admin_activity_logs').insert({
        admin_id: user.id,
        action: 'update_order_status',
        resource_type: 'order',
        resource_id: orderId,
        details: { new_status: newStatus },
      });
    }
    await loadOrders();
    setUpdatingId(null);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const deliveriesToday = orders.filter(o => o.pickupDate === today && o.status !== 'cancelled');

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || o.deliveryAddress.toLowerCase().includes(q);
  });

  return (
    <Layout>
      <SEO title="Admin Dashboard | WashMate" description="WashMate admin panel." noIndex />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, marginBottom: '4px' }}>Admin Dashboard</h1>
          <p style={{ color: COLORS.muted }}>Manage orders and deliveries</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {[
            { icon: Package, label: "Today's Orders", value: todayOrders.length, color: COLORS.primary },
            { icon: TrendingUp, label: "Today's Revenue", value: `₹${todayRevenue}`, color: COLORS.success },
            { icon: Clock, label: 'Pending Orders', value: pendingOrders.length, color: '#F59E0B' },
            { icon: Truck, label: "Deliveries Today", value: deliveriesToday.length, color: '#8B5CF6' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <stat.icon size={20} color={stat.color} style={{ marginBottom: '12px' }} />
              <div style={{ fontSize: '26px', fontWeight: 900, color: COLORS.dark }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '4px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>

        {/* Orders table */}
        {loading ? <LoadingSpinner /> : (
          <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 120px 100px 160px 120px', padding: '12px 20px', background: COLORS.background }}>
              {['Order #', 'Address', 'Pickup', 'Total', 'Status', 'Update'].map(h => (
                <span key={h} style={{ fontSize: '12px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {filtered.map(order => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 120px 100px 160px 120px', padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '8px' }} className="admin-order-row">
                <span style={{ fontWeight: 700, color: COLORS.dark, fontSize: '13px' }}>#{order.orderNumber}</span>
                <span style={{ fontSize: '12px', color: COLORS.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.deliveryAddress}</span>
                <span style={{ fontSize: '12px', color: COLORS.darkMuted }}>{order.pickupDate}</span>
                <span style={{ fontWeight: 700, color: COLORS.dark, fontSize: '13px' }}>₹{order.total}</span>
                <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} size="sm">
                  {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                </Badge>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer', maxWidth: '120px' }}
                >
                  {UPDATE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            ))}
            {!filtered.length && (
              <div style={{ textAlign: 'center', padding: '40px', color: COLORS.muted }}>No orders found.</div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .admin-order-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
