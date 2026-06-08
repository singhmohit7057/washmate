import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Plus, ArrowRight, Truck } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('id, order_number, status, delivery_type, pickup_date, pickup_time, total, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setOrders((data ?? []).map(d => ({
          id: d.id,
          orderNumber: d.order_number,
          status: d.status,
          deliveryType: d.delivery_type as 'regular' | 'express',
          pickupDate: d.pickup_date,
          pickupTime: d.pickup_time,
          total: d.total,
          createdAt: d.created_at,
        })));
        setLoading(false);
      });
  }, [user]);

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const greeting = getGreeting();

  return (
    <Layout>
      <SEO title="Dashboard | WashMate" description="Your WashMate dashboard — manage orders and pickups." noIndex />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '8px' }}>
            {greeting}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p style={{ fontSize: '16px', color: COLORS.muted }}>Here's what's happening with your laundry.</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { icon: Package, label: 'Total Orders', value: orders.length, color: COLORS.primary },
            { icon: Clock, label: 'Active Orders', value: activeOrders.length, color: '#F59E0B' },
            { icon: CheckCircle, label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, color: COLORS.success },
            { icon: Truck, label: 'Pickups Scheduled', value: orders.filter(o => o.status === 'pickup_scheduled').length, color: '#8B5CF6' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: `1px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, letterSpacing: '-0.5px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '4px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}
        >
          <Link to="/schedule-pickup" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '18px 24px', borderRadius: '14px', fontWeight: 700 }}>
            <Plus size={20} /> Schedule Pickup
          </Link>
          <Link to="/order-tracking" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', color: COLORS.dark, textDecoration: 'none', padding: '18px 24px', borderRadius: '14px', fontWeight: 700, border: `1.5px solid ${COLORS.border}` }}>
            <Truck size={20} color={COLORS.primary} /> Track Orders
          </Link>
          <Link to="/order-history" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', color: COLORS.dark, textDecoration: 'none', padding: '18px 24px', borderRadius: '14px', fontWeight: 700, border: `1.5px solid ${COLORS.border}` }}>
            <Package size={20} color={COLORS.primary} /> Order History
          </Link>
        </motion.div>

        {/* Recent orders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.dark }}>Recent Orders</h2>
            <Link to="/order-history" style={{ color: COLORS.primary, fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FAFAFA', borderRadius: '16px', border: `1px solid ${COLORS.border}` }}>
              <Package size={48} color={COLORS.border} style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: COLORS.dark, marginBottom: '8px' }}>No orders yet</h3>
              <p style={{ color: COLORS.muted, marginBottom: '20px' }}>Schedule your first pickup to get started!</p>
              <Link to="/schedule-pickup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700 }}>
                <Plus size={16} /> Schedule Pickup
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map(order => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function OrderRow({ order }: { order: Order }) {
  const statusInfo = ORDER_STATUSES.find(s => s.key === order.status);
  const badgeVariant = order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : order.status === 'out_for_delivery' ? 'primary' : 'warning';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
    >
      <div>
        <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '15px' }}>#{order.orderNumber}</div>
        <div style={{ fontSize: '13px', color: COLORS.muted, marginTop: '4px' }}>
          Pickup: {new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {order.pickupTime}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Badge variant={badgeVariant} dot>{statusInfo?.label ?? order.status}</Badge>
        <div style={{ fontWeight: 800, fontSize: '16px', color: COLORS.dark }}>₹{order.total}</div>
        <Link to={`/order-tracking?order=${order.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: COLORS.primary, fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
          Track <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
