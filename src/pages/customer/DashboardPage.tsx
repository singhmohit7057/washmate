import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Clock, CheckCircle, Plus, ArrowRight, Truck, X, AlertTriangle,
  Calendar, MapPin, Zap, ShoppingBag, Navigation, History, LayoutDashboard,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';

const STATUS_COLOR: Record<string, string> = {
  pending:           '#F59E0B',
  confirmed:         '#3B82F6',
  pickup_scheduled:  COLORS.primary,
  picked_up:         '#8B5CF6',
  processing:        '#06B6D4',
  washing:           '#3B82F6',
  quality_check:     '#F59E0B',
  ready:             '#10B981',
  out_for_delivery:  '#F97316',
  delivered:         COLORS.success,
  cancelled:         COLORS.danger,
};

const TIME_SLOTS: Record<string, string> = {
  '08:00-12:00': '8 AM – 12 PM',
  '12:00-16:00': '12 PM – 4 PM',
  '16:00-20:00': '4 PM – 8 PM',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('id, order_number, status, delivery_type, pickup_date, pickup_time, delivery_address, total, subtotal, discount, coupon_code, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        type Row = {
          id: string; order_number: string; status: string; delivery_type: string;
          pickup_date: string; pickup_time: string; delivery_address: string;
          total: number; subtotal: number; discount: number; coupon_code: string | null; created_at: string;
        };
        setOrders(((data ?? []) as Row[]).map(d => ({
          id: d.id,
          orderNumber: d.order_number,
          status: d.status,
          deliveryType: d.delivery_type as 'regular' | 'express',
          pickupDate: d.pickup_date,
          pickupTime: d.pickup_time,
          deliveryAddress: d.delivery_address,
          total: d.total,
          subtotal: d.subtotal ?? 0,
          discount: d.discount ?? 0,
          couponCode: d.coupon_code ?? null,
          createdAt: d.created_at,
        })));
        setLoading(false);
      });
  }, [user]);

  const totalOrders    = orders.length;
  const activeOrders   = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const totalSpent     = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const recentOrders   = orders.slice(0, 5);

  // Next upcoming pickup (earliest future pickup_date among active)
  const today = new Date().toISOString().split('T')[0];
  const nextPickup = orders
    .filter(o => !['delivered', 'cancelled'].includes(o.status) && o.pickupDate >= today)
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))[0] ?? null;

  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
  const greeting   = getGreeting();

  return (
    <Layout>
      <SEO title="Dashboard | WashMate" description="Your WashMate dashboard — manage orders and pickups." noIndex />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '44px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -40, left: 40, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: '0 0 0 4px rgba(255,255,255,0.15), 0 8px 24px rgba(99,102,241,0.4)' }}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : getInitials(user?.fullName || user?.email || '')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                  {greeting}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
                </h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99,102,241,0.35)', border: '1px solid rgba(99,102,241,0.5)', color: '#C7D2FE', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                  <LayoutDashboard size={10} /> Member since {memberYear}
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>Here's what's happening with your laundry today.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '1100px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} className="stat-row">
          {[
            { emoji: '📦', label: 'Total Orders',  value: totalOrders,                              color: COLORS.primary },
            { emoji: '🔄', label: 'Active',         value: activeOrders.length,                      color: '#F97316'      },
            { emoji: '✅', label: 'Completed',       value: deliveredCount,                           color: COLORS.success },
            { emoji: '❌', label: 'Cancelled',       value: cancelledCount,                           color: COLORS.danger  },
            { emoji: '💰', label: 'Total Spent',    value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6'      },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 + i * 0.06 }}
              style={{ padding: '20px 14px', borderRight: i < 4 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}
              className="stat-cell">
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: 'clamp(16px,2.2vw,22px)', fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 64px' }}>

        {/* ── Quick actions ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }} className="qa-row">
          <Link to="/schedule-pickup"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', textDecoration: 'none', padding: '16px 20px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>Schedule Pickup</div>
              <div style={{ fontSize: '11px', opacity: 0.75, fontWeight: 500, marginTop: '1px' }}>Book a new laundry slot</div>
            </div>
          </Link>
          <Link to="/order-tracking"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', color: COLORS.dark, textDecoration: 'none', padding: '16px 20px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', border: `1.5px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${COLORS.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Navigation size={16} color={COLORS.primary} />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>Track Orders</div>
              <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 500, marginTop: '1px' }}>Live order status</div>
            </div>
          </Link>
          <Link to="/order-history"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', color: COLORS.dark, textDecoration: 'none', padding: '16px 20px', borderRadius: '16px', fontWeight: 700, fontSize: '14px', border: `1.5px solid ${COLORS.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <History size={16} color="#F97316" />
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>Order History</div>
              <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 500, marginTop: '1px' }}>All past orders</div>
            </div>
          </Link>
        </motion.div>

        {/* ── Two-column body ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }} className="body-grid">

          {/* ── Left: Active + Recent orders ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Next Pickup spotlight */}
            {nextPickup && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                style={{ background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius: '20px', border: `1.5px solid ${COLORS.primary}25`, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={22} color={COLORS.primary} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Next Scheduled Pickup</div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: COLORS.dark }}>
                    {new Date(nextPickup.pickupDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.muted, display: 'flex', gap: '10px', marginTop: '3px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} /> {TIME_SLOTS[nextPickup.pickupTime] ?? nextPickup.pickupTime}</span>
                    {nextPickup.deliveryAddress && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {nextPickup.deliveryAddress}</span>}
                    {nextPickup.deliveryType === 'express' && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F97316', fontWeight: 700 }}><Zap size={11} /> Express</span>
                    )}
                  </div>
                </div>
                <Link to={`/order-tracking?order=${nextPickup.id}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                  Track <ArrowRight size={13} />
                </Link>
              </motion.div>
            )}

            {/* Active Orders */}
            {!loading && activeOrders.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '9px', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={15} color={COLORS.primary} />
                  </div>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Active Orders</h2>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700, background: COLORS.primary, color: '#fff', padding: '2px 8px', borderRadius: '999px' }}>{activeOrders.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {activeOrders.map((order, i) => {
                    const sc = STATUS_COLOR[order.status] ?? COLORS.muted;
                    return (
                      <div key={order.id} style={{ padding: '14px 20px', borderBottom: i < activeOrders.length - 1 ? `1px solid ${COLORS.border}` : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '10px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Package size={16} color={sc} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{order.orderNumber}</span>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: `${sc}15`, color: sc, whiteSpace: 'nowrap' }}>
                              {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                            </span>
                            {order.deliveryType === 'express' && (
                              <span style={{ fontSize: '9px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '1px 6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Zap size={8} /> Express
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: COLORS.muted }}>
                            Pickup: {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                            {order.pickupTime ? ` · ${TIME_SLOTS[order.pickupTime] ?? order.pickupTime}` : ''}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          {order.total > 0
                            ? <div style={{ fontWeight: 800, fontSize: '14px', color: COLORS.dark }}>₹{order.total.toLocaleString('en-IN')}</div>
                            : <div style={{ fontSize: '11px', color: COLORS.muted, fontStyle: 'italic' }}>Bill pending</div>}
                          <Link to={`/order-tracking?order=${order.id}`}
                            style={{ fontSize: '11px', color: COLORS.primary, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '3px' }}>
                            Track <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Recent Orders */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '9px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={15} color="#D97706" />
                  </div>
                  <h2 style={{ fontSize: '14px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Recent Orders</h2>
                </div>
                <Link to="/order-history" style={{ fontSize: '12px', color: COLORS.primary, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View all <ArrowRight size={12} />
                </Link>
              </div>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, margin: '0 auto 10px', animation: 'spin 0.8s linear infinite' }} />
                  Loading…
                </div>
              ) : recentOrders.length === 0 ? (
                <div style={{ padding: '56px 24px', textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '16px', background: COLORS.background, border: `1px dashed ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Package size={26} color={COLORS.border} />
                  </div>
                  <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 6px' }}>No orders yet</p>
                  <p style={{ color: COLORS.muted, fontSize: '13px', margin: '0 0 18px' }}>Schedule your first pickup to get started!</p>
                  <Link to="/schedule-pickup"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}>
                    <Plus size={14} /> Schedule Pickup
                  </Link>
                </div>
              ) : (
                <div>
                  {recentOrders.map((order, i) => (
                    <OrderRow key={order.id} order={order} isLast={i === recentOrders.length - 1}
                      onCancelled={id => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o))} />
                  ))}
                  <div style={{ padding: '12px 20px', background: COLORS.background, borderTop: `1px solid ${COLORS.border}` }}>
                    <Link to="/order-history" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: COLORS.primary, textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                      View Full History <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Profile summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                  {getInitials(user?.fullName || user?.email || '')}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName || 'My Account'}</div>
                  <div style={{ fontSize: '11px', color: COLORS.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Member Since', value: memberYear.toString(), color: COLORS.primary },
                  { label: 'Total Spent',  value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6' },
                  { label: 'Orders Done', value: deliveredCount.toString(), color: COLORS.success },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: COLORS.muted, fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <Link to="/profile"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '4px', padding: '8px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, color: COLORS.muted, textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
                  View Profile <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>

            {/* Order breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '9px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={15} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Order Breakdown</h3>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Active',    value: activeOrders.length, color: '#F97316', bg: '#FFF7ED' },
                  { label: 'Delivered', value: deliveredCount,       color: COLORS.success, bg: '#F0FDF4' },
                  { label: 'Cancelled', value: cancelledCount,       color: COLORS.danger,  bg: '#FFF5F5' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: 6, borderRadius: '999px', background: COLORS.background, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '999px', background: r.color, width: totalOrders ? `${(r.value / totalOrders) * 100}%` : '0%', transition: 'width 0.8s ease' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: r.color, background: r.bg, padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap', minWidth: '60px', textAlign: 'center' }}>
                      {r.label}: {r.value}
                    </span>
                  </div>
                ))}
                {totalOrders === 0 && (
                  <p style={{ fontSize: '12px', color: COLORS.muted, textAlign: 'center', margin: '4px 0 0' }}>No orders yet</p>
                )}
              </div>
            </motion.div>

            {/* Tips card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              style={{ background: 'linear-gradient(135deg,#0F0C29,#302B63)', borderRadius: '20px', padding: '18px', color: '#fff' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💡</div>
              <p style={{ fontWeight: 800, fontSize: '13px', margin: '0 0 5px', color: '#fff' }}>Express Pickup</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 14px', lineHeight: 1.5 }}>
                Need clothes fast? Book an Express pickup for priority washing and same-day delivery.
              </p>
              <Link to="/schedule-pickup?type=express"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                Book Now <ArrowRight size={12} />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .body-grid { grid-template-columns: 1fr !important; }
          .body-grid > div:last-child { order: -1; }
          .qa-row    { grid-template-columns: 1fr 1fr !important; }
          .stat-row  { grid-template-columns: 1fr 1fr 1fr !important; }
          .stat-cell:nth-child(n+4) { border-top: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 480px) {
          .qa-row   { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .stat-cell:nth-child(n+3) { border-top: 1px solid ${COLORS.border}; }
        }
      `}</style>
    </Layout>
  );
}

function OrderRow({ order, isLast, onCancelled }: { order: Order; isLast: boolean; onCancelled: (id: string) => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling]   = useState(false);
  const sc           = STATUS_COLOR[order.status] ?? COLORS.muted;
  const label        = ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status;
  const isCancellable = order.status === 'pickup_scheduled';

  const doCancel = async () => {
    setCancelling(true);
    await supabase.from('orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', order.id);
    onCancelled(order.id);
    setCancelling(false);
    setShowConfirm(false);
  };

  return (
    <div style={{ borderBottom: isLast ? 'none' : `1px solid ${COLORS.border}`, opacity: order.status === 'cancelled' ? 0.6 : 1 }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }} className="order-row-hover">
        {/* Icon */}
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package size={15} color={sc} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{order.orderNumber}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: `${sc}15`, color: sc, whiteSpace: 'nowrap' }}>{label}</span>
            {order.deliveryType === 'express' && (
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '1px 5px' }}>⚡</span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.muted }}>
            {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            {(order as any).couponCode && <span style={{ marginLeft: '6px', color: '#16A34A', fontWeight: 700 }}>🏷️ {(order as any).couponCode}</span>}
          </div>
        </div>
        {/* Amount + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {order.total > 0
            ? <span style={{ fontWeight: 900, fontSize: '14px', color: COLORS.dark }}>₹{order.total.toLocaleString('en-IN')}</span>
            : <span style={{ fontSize: '11px', color: COLORS.muted, fontStyle: 'italic' }}>Pending</span>}
          {isCancellable && !showConfirm && (
            <button onClick={() => setShowConfirm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', color: COLORS.danger, background: '#FFF5F5', border: `1px solid ${COLORS.danger}30`, borderRadius: '7px', padding: '4px 9px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <X size={10} /> Cancel
            </button>
          )}
          {!isCancellable && order.status !== 'cancelled' && (
            <Link to={`/order-tracking?order=${order.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', color: COLORS.primary, fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
              Track <ArrowRight size={10} />
            </Link>
          )}
        </div>
      </div>

      {/* Cancel confirm inline */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: '12px 20px', background: '#FFF5F5', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <AlertTriangle size={14} color={COLORS.danger} />
              <span style={{ fontSize: '12px', color: COLORS.darkMuted, flex: 1 }}>Cancel pickup for <strong>#{order.orderNumber}</strong>?</span>
              <button onClick={doCancel} disabled={cancelling}
                style={{ padding: '6px 14px', borderRadius: '7px', background: COLORS.danger, color: '#fff', fontWeight: 700, fontSize: '11px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: cancelling ? 0.6 : 1 }}>
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
              <button onClick={() => setShowConfirm(false)}
                style={{ padding: '6px 12px', borderRadius: '7px', background: '#fff', color: COLORS.muted, fontWeight: 600, fontSize: '11px', border: `1px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                Keep
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
