import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ArrowRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';

export default function OrderHistoryPage() {
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
      .then(({ data }) => {
        type Row = { id: string; order_number: string; status: string; delivery_type: string; pickup_date: string; pickup_time: string; total: number; created_at: string };
        setOrders(((data ?? []) as Row[]).map(d => ({
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

  const getVariant = (status: string) => {
    if (status === 'delivered') return 'success' as const;
    if (status === 'cancelled') return 'danger' as const;
    if (status === 'out_for_delivery') return 'primary' as const;
    return 'warning' as const;
  };

  return (
    <Layout>
      <SEO title="Order History | WashMate" description="Your complete WashMate laundry order history." noIndex />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '4px' }}>Order History</h1>
            <p style={{ fontSize: '15px', color: COLORS.muted }}>{orders.length} orders total</p>
          </div>
          <Link to="/schedule-pickup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px' }}>
            New Pickup
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#FAFAFA', borderRadius: '20px', border: `1px solid ${COLORS.border}` }}>
            <Package size={48} color={COLORS.border} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: COLORS.dark, marginBottom: '8px' }}>No orders yet</h3>
            <p style={{ color: COLORS.muted, marginBottom: '24px' }}>Your order history will appear here.</p>
            <Link to="/schedule-pickup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 700 }}>
              Schedule First Pickup
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="order-table" style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px 110px 80px', padding: '12px 20px', background: COLORS.background, gap: '8px' }}>
                {['Order #', 'Pickup Date', 'Service', 'Total', 'Status', ''].map(h => (
                  <span key={h} style={{ fontSize: '12px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px 110px 80px', padding: '16px 20px', gap: '8px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 700, color: COLORS.dark, fontSize: '14px' }}>#{order.orderNumber}</span>
                  <span style={{ fontSize: '14px', color: COLORS.darkMuted }}>{new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span style={{ fontSize: '13px', color: COLORS.muted, textTransform: 'capitalize' }}>{order.deliveryType}</span>
                  <span style={{ fontWeight: 700, color: COLORS.dark }}>₹{order.total}</span>
                  <Badge variant={getVariant(order.status)} size="sm">
                    {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                  </Badge>
                  <Link to={`/order-tracking?order=${order.id}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: COLORS.primary, fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                    Track <ArrowRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="order-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${COLORS.border}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: COLORS.dark, fontSize: '15px' }}>#{order.orderNumber}</span>
                    <Badge variant={getVariant(order.status)} size="sm">
                      {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                    </Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', marginBottom: '2px' }}>Pickup</div>
                      <div style={{ fontSize: '13px', color: COLORS.darkMuted }}>{new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', marginBottom: '2px' }}>Service</div>
                      <div style={{ fontSize: '13px', color: COLORS.muted, textTransform: 'capitalize' }}>{order.deliveryType}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', marginBottom: '2px' }}>Total</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark }}>₹{order.total}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Link to={`/order-tracking?order=${order.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: COLORS.primary, fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                        Track Order <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`
        @media (max-width: 680px) {
          .order-table { display: none !important; }
          .order-cards { display: flex !important; }
        }
      `}</style>
    </Layout>
  );
}
