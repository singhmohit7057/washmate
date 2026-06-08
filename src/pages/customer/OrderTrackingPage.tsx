import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Package, Settings, Droplets, CheckCircle, Truck, Home } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const STATUS_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  pickup_scheduled: Calendar,
  picked_up: Package,
  processing: Settings,
  washing: Droplets,
  quality_check: CheckCircle,
  out_for_delivery: Truck,
  delivered: Home,
};

interface TrackingOrder {
  id: string;
  orderNumber: string;
  status: string;
  deliveryType: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress: string;
  total: number;
  createdAt: string;
}

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [selected, setSelected] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'delivered')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data ?? []).map(d => ({
          id: d.id,
          orderNumber: d.order_number,
          status: d.status,
          deliveryType: d.delivery_type,
          pickupDate: d.pickup_date,
          pickupTime: d.pickup_time,
          deliveryAddress: d.delivery_address,
          total: d.total,
          createdAt: d.created_at,
        }));
        setOrders(mapped);
        const target = orderId ? mapped.find(o => o.id === orderId) : mapped[0];
        setSelected(target ?? mapped[0] ?? null);
        setLoading(false);
      });
  }, [user, orderId]);

  const statusIndex = selected ? ORDER_STATUSES.findIndex(s => s.key === selected.status) : -1;

  return (
    <Layout>
      <SEO title="Order Tracking | WashMate" description="Track your WashMate laundry orders in real time." noIndex />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: COLORS.dark, marginBottom: '8px' }}>Order Tracking</h1>
        <p style={{ fontSize: '16px', color: COLORS.muted, marginBottom: '32px' }}>Real-time status updates for your garments.</p>

        {loading ? (
          <LoadingSpinner fullPage />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: COLORS.muted }}>
            <Package size={48} color={COLORS.border} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '17px' }}>No active orders to track.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }} className="tracking-grid">
            {/* Order list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelected(order)}
                  style={{ padding: '16px', borderRadius: '14px', border: `2px solid ${selected?.id === order.id ? COLORS.primary : COLORS.border}`, background: selected?.id === order.id ? COLORS.primaryLight : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                >
                  <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '14px' }}>#{order.orderNumber}</div>
                  <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '4px' }}>
                    {new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ marginTop: '8px', background: COLORS.primaryLight, color: COLORS.primary, fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', display: 'inline-block' }}>
                    {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                  </div>
                </button>
              ))}
            </div>

            {/* Tracking detail */}
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ background: '#fff', borderRadius: '20px', padding: '32px', border: `1px solid ${COLORS.border}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, color: COLORS.dark, margin: 0 }}>Order #{selected.orderNumber}</h2>
                    <p style={{ fontSize: '14px', color: COLORS.muted, marginTop: '4px' }}>Pickup: {selected.pickupDate} at {selected.pickupTime}</p>
                  </div>
                  {selected.total > 0 && <div style={{ fontWeight: 900, fontSize: '22px', color: COLORS.dark }}>₹{selected.total}</div>}
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                  {ORDER_STATUSES.map((step, i) => {
                    const isCompleted = i <= statusIndex;
                    const isCurrent = i === statusIndex;
                    const Icon = STATUS_ICONS[step.key] ?? Package;

                    return (
                      <div key={step.key} style={{ display: 'flex', gap: '16px', marginBottom: i < ORDER_STATUSES.length - 1 ? 0 : undefined, position: 'relative' }}>
                        {/* Connector */}
                        {i < ORDER_STATUSES.length - 1 && (
                          <div style={{ position: 'absolute', left: 19, top: 40, width: 2, height: 40, background: isCompleted && i < statusIndex ? COLORS.primary : COLORS.border, zIndex: 0 }} />
                        )}

                        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                          <motion.div
                            animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{
                              width: 40, height: 40, borderRadius: '50%',
                              background: isCompleted ? COLORS.primary : COLORS.background,
                              border: `2px solid ${isCompleted ? COLORS.primary : COLORS.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: isCurrent ? `0 0 0 4px ${COLORS.primary}20` : 'none',
                            }}
                          >
                            <Icon size={16} color={isCompleted ? '#fff' : COLORS.muted} />
                          </motion.div>
                        </div>

                        <div style={{ paddingBottom: '28px', paddingTop: '8px' }}>
                          <div style={{ fontWeight: isCurrent ? 800 : 600, fontSize: '15px', color: isCompleted ? COLORS.dark : COLORS.muted }}>{step.label}</div>
                          {isCurrent && <div style={{ fontSize: '12px', color: COLORS.primary, marginTop: '2px', fontWeight: 600 }}>In Progress</div>}
                          {isCompleted && !isCurrent && <div style={{ fontSize: '12px', color: COLORS.success, marginTop: '2px' }}>Completed</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '8px', padding: '16px 20px', background: COLORS.background, borderRadius: '12px' }}>
                  <div style={{ fontSize: '13px', color: COLORS.muted, fontWeight: 600, marginBottom: '4px' }}>Delivery Address</div>
                  <div style={{ fontSize: '14px', color: COLORS.dark }}>{selected.deliveryAddress}</div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .tracking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
