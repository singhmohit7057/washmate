import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Package, Settings, Droplets, CheckCircle, Truck, Home,
  X, AlertTriangle, Clock, MapPin, Navigation, Receipt, ListOrdered,
  Zap,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const STATUS_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  pickup_scheduled: Calendar,
  picked_up:        Package,
  processing:       Settings,
  washing:          Droplets,
  quality_check:    CheckCircle,
  out_for_delivery: Truck,
  delivered:        Home,
};

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

const TIME_SLOTS = [
  { value: '08:00-12:00', label: '8:00 AM – 12:00 PM' },
  { value: '12:00-16:00', label: '12:00 PM – 4:00 PM' },
  { value: '16:00-20:00', label: '4:00 PM – 8:00 PM' },
];

const BILL_TAG: Record<string, { label: string; color: string }> = {
  'wash-fold':        { label: 'W&F',      color: '#6366F1' },
  'dry-cleaning':     { label: 'DC',       color: '#8B5CF6' },
  'steam-ironing':    { label: 'SI',       color: '#F59E0B' },
  'shoe-cleaning':    { label: 'Shoes',    color: '#EF4444' },
  'curtain-cleaning': { label: 'Curtains', color: '#06B6D4' },
  'blanket-cleaning': { label: 'Blankets', color: '#10B981' },
};

interface TrackingOrder {
  id: string; orderNumber: string; status: string; deliveryType: string;
  pickupDate: string; pickupTime: string; deliveryAddress: string;
  subtotal: number; discount: number; couponCode: string | null;
  total: number; createdAt: string;
}

type BillItem = { id: string; item_name: string; service_id: string; quantity: number; unit_price: number; total_price: number };

function minDate() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  const [orders, setOrders]     = useState<TrackingOrder[]>([]);
  const [selected, setSelected] = useState<TrackingOrder | null>(null);
  const [loading, setLoading]   = useState(true);

  const [billItems, setBillItems]     = useState<BillItem[]>([]);
  const [billLoading, setBillLoading] = useState(false);
  const [idToSlug, setIdToSlug]       = useState<Record<string, string>>({});

  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [cancelling, setCancelling]           = useState(false);
  const [rescheduleOpen, setRescheduleOpen]   = useState(false);
  const [rescheduleDate, setRescheduleDate]   = useState('');
  const [rescheduleTime, setRescheduleTime]   = useState(TIME_SLOTS[0].value);
  const [rescheduling, setRescheduling]       = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const [rescheduleOk, setRescheduleOk]       = useState(false);

  useEffect(() => {
    supabase.from('services').select('id,slug').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        (data as { id: string; slug: string }[]).forEach(s => { map[s.id] = s.slug; });
        setIdToSlug(map);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders')
      .select('id,order_number,status,delivery_type,pickup_date,pickup_time,delivery_address,subtotal,discount,coupon_code,total,created_at')
      .eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = ((data ?? []) as Array<{
          id: string; order_number: string; status: string; delivery_type: string;
          pickup_date: string; pickup_time: string; delivery_address: string;
          subtotal: number; discount: number; coupon_code: string | null;
          total: number; created_at: string;
        }>).map(d => ({
          id: d.id, orderNumber: d.order_number, status: d.status, deliveryType: d.delivery_type,
          pickupDate: d.pickup_date, pickupTime: d.pickup_time, deliveryAddress: d.delivery_address,
          subtotal: d.subtotal ?? 0, discount: d.discount ?? 0, couponCode: d.coupon_code ?? null,
          total: d.total, createdAt: d.created_at,
        }));
        setOrders(mapped);
        const target = orderId ? mapped.find(o => o.id === orderId) : mapped[0];
        setSelected(target ?? mapped[0] ?? null);
        setLoading(false);
      });
  }, [user, orderId]);

  useEffect(() => {
    if (!selected) return;
    setBillItems([]); setBillLoading(true);
    supabase.from('order_items').select('*').eq('order_id', selected.id).order('created_at')
      .then(({ data }) => { setBillItems((data ?? []) as BillItem[]); setBillLoading(false); });
  }, [selected?.id]);

  const selectOrder = (o: TrackingOrder) => {
    setSelected(o);
    setCancelConfirmId(null);
    setRescheduleOpen(false);
    setRescheduleOk(false);
  };

  const openReschedule = () => {
    if (!selected) return;
    setRescheduleDate(selected.pickupDate >= minDate() ? selected.pickupDate : '');
    setRescheduleTime(selected.pickupTime || TIME_SLOTS[0].value);
    setRescheduleError(''); setRescheduleOk(false);
    setRescheduleOpen(true);
    setCancelConfirmId(null);
  };

  const doReschedule = async () => {
    if (!rescheduleDate || !selected) { setRescheduleError('Please choose a date.'); return; }
    setRescheduling(true); setRescheduleError('');
    const { error } = await supabase.from('orders')
      .update({ pickup_date: rescheduleDate, pickup_time: rescheduleTime, updated_at: new Date().toISOString() })
      .eq('id', selected.id);
    if (error) { setRescheduleError('Failed to save. Try again.'); }
    else {
      const upd = orders.map(o => o.id === selected.id ? { ...o, pickupDate: rescheduleDate, pickupTime: rescheduleTime } : o);
      setOrders(upd);
      setSelected(p => p ? { ...p, pickupDate: rescheduleDate, pickupTime: rescheduleTime } : p);
      setRescheduleOk(true);
      setTimeout(() => { setRescheduleOpen(false); setRescheduleOk(false); }, 1600);
    }
    setRescheduling(false);
  };

  const doCancel = async (id: string) => {
    setCancelling(true);
    const { error } = await supabase.from('orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) {
      const upd = orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o);
      setOrders(upd);
      setSelected(p => p?.id === id ? { ...p, status: 'cancelled' } : p);
    }
    setCancelConfirmId(null); setCancelling(false);
  };

  const canManage  = (s: string) => s === 'pickup_scheduled';
  const activeColor = selected ? (STATUS_COLOR[selected.status] ?? COLORS.primary) : COLORS.primary;
  const statusIdx   = selected ? ORDER_STATUSES.findIndex(s => s.key === selected.status) : -1;

  const totalOrders     = orders.length;
  const activeOrders    = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
  const deliveredCount  = orders.filter(o => o.status === 'delivered').length;
  const cancelledCount  = orders.filter(o => o.status === 'cancelled').length;
  const totalSpent      = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <Layout>
      <SEO title="Order Tracking | WashMate" description="Track your WashMate laundry orders in real time." noIndex />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '48px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -40, left: 40, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', flexShrink: 0 }}>
                <Navigation size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Order Tracking</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>Live updates on your garments</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: '#fff', textDecoration: 'none', padding: '11px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: '1.5px solid rgba(255,255,255,0.2)' }}>
              <Package size={15} /> New Pickup
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '1200px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} className="stat-row">
          {[
            { emoji: '📦', label: 'Total Orders', value: totalOrders,                              color: COLORS.primary },
            { emoji: '🔄', label: 'Active',        value: activeOrders,                             color: '#F97316'      },
            { emoji: '✅', label: 'Delivered',      value: deliveredCount,                           color: COLORS.success },
            { emoji: '❌', label: 'Cancelled',      value: cancelledCount,                           color: COLORS.danger  },
            { emoji: '💰', label: 'Total Spent',   value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6'      },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06 }}
              style={{ padding: '20px 16px', borderRight: i < 4 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}
              className="stat-cell">
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 64px' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: COLORS.muted }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            Loading your orders…
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '72px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '20px', background: COLORS.background, border: `1px dashed ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={32} color={COLORS.border} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, margin: '0 0 8px' }}>No orders yet</h3>
            <p style={{ color: COLORS.muted, fontSize: '14px', margin: '0 0 24px' }}>Your orders will appear here once you schedule a pickup.</p>
            <Link to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
              Schedule First Pickup
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '20px', alignItems: 'start' }} className="tracking-3col">

            {/* ════ COL 1: Order list ════ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              {/* Card header */}
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '9px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ListOrdered size={15} color="#D97706" />
                </div>
                <div>
                  <h2 style={{ fontSize: '13px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Your Orders</h2>
                  <p style={{ fontSize: '10px', color: COLORS.muted, margin: 0, fontWeight: 600 }}>{orders.length} total</p>
                </div>
              </div>

              {/* Order rows */}
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {orders.map(order => {
                  const sc  = STATUS_COLOR[order.status] ?? COLORS.primary;
                  const sel = selected?.id === order.id;
                  return (
                    <button key={order.id} onClick={() => selectOrder(order)}
                      style={{ width: '100%', padding: '13px 16px', border: 'none', borderLeft: `3px solid ${sel ? sc : 'transparent'}`, background: sel ? `${sc}0D` : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s', borderBottom: `1px solid ${COLORS.border}`, opacity: order.status === 'cancelled' ? 0.55 : 1 }}
                      className="order-list-btn">
                      {/* Order # + date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{order.orderNumber}</span>
                        {order.total > 0 && (
                          <span style={{ fontWeight: 800, fontSize: '12px', color: sel ? sc : COLORS.dark }}>₹{order.total.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.muted, marginBottom: '7px' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {/* Status + express */}
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: `${sc}15`, color: sc, whiteSpace: 'nowrap' }}>
                          {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                        </span>
                        {order.deliveryType === 'express' && (
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '1px 6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Zap size={8} />⚡
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* ════ COL 2: Tracking ════ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

              {selected ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selected.id + '-track'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                    {/* Card header — tinted by active status color */}
                    <div style={{ padding: '14px 20px', borderBottom: `1px solid ${COLORS.border}`, background: `linear-gradient(135deg,${activeColor}10,${activeColor}06)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '9px', background: `${activeColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Navigation size={15} color={activeColor} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '13px', fontWeight: 800, color: COLORS.dark, margin: 0, fontFamily: 'monospace' }}>#{selected.orderNumber}</h2>
                          <p style={{ fontSize: '10px', color: COLORS.muted, margin: 0, fontWeight: 600 }}>
                            {new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '999px', background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}25` }}>
                          {ORDER_STATUSES.find(s => s.key === selected.status)?.label ?? selected.status}
                        </span>
                        {selected.deliveryType === 'express' && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Zap size={10} /> Express ×1.5
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '20px 24px' }}>
                      {/* Info chips */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        <InfoCard icon={<Calendar size={14} color={COLORS.primary} />} label="Pickup Date"
                          value={selected.pickupDate ? new Date(selected.pickupDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'} bg={COLORS.primaryLight} />
                        <InfoCard icon={<Clock size={14} color="#8B5CF6" />} label="Time Slot"
                          value={TIME_SLOTS.find(t => t.value === selected.pickupTime)?.label ?? selected.pickupTime ?? '—'} bg="#F5F3FF" />
                        <InfoCard icon={<MapPin size={14} color="#10B981" />} label="Address"
                          value={selected.deliveryAddress} bg="#F0FDF4" span2 />
                        {selected.couponCode && (
                          <InfoCard icon={<span style={{ fontSize: '13px' }}>🏷️</span>} label="Coupon Applied"
                            value={selected.couponCode} valueColor="#16A34A" bg="#F0FDF4" />
                        )}
                      </div>

                      {/* Action buttons */}
                      {canManage(selected.status) && !rescheduleOpen && !cancelConfirmId && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                          <button onClick={openReschedule}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${COLORS.primary}`, background: COLORS.primaryLight, color: COLORS.primary, fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <Clock size={13} /> Change Pickup Slot
                          </button>
                          <button onClick={() => { setCancelConfirmId(selected.id); setRescheduleOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: `1.5px solid ${COLORS.danger}`, background: '#FFF5F5', color: COLORS.danger, fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <X size={13} /> Cancel Pickup
                          </button>
                        </div>
                      )}

                      {/* Reschedule form */}
                      <AnimatePresence>
                        {rescheduleOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                            <div style={{ background: COLORS.primaryLight, border: `1.5px solid ${COLORS.primary}30`, borderRadius: '14px', padding: '16px 18px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.primary, display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> Change Pickup Slot</span>
                                <button onClick={() => setRescheduleOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 0 }}><X size={15} /></button>
                              </div>
                              {rescheduleOk ? (
                                <div style={{ color: COLORS.success, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <CheckCircle size={16} /> Rescheduled successfully!
                                </div>
                              ) : (
                                <>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                    <div>
                                      <label style={{ fontSize: '11px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '5px' }}>New Date</label>
                                      <input type="date" min={minDate()} value={rescheduleDate} onChange={e => { setRescheduleDate(e.target.value); setRescheduleError(''); }}
                                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${rescheduleError ? COLORS.danger : COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' }} />
                                    </div>
                                    <div>
                                      <label style={{ fontSize: '11px', fontWeight: 700, color: COLORS.darkMuted, display: 'block', marginBottom: '5px' }}>Time Slot</label>
                                      <select value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)}
                                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' }}>
                                        {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                      </select>
                                    </div>
                                  </div>
                                  {rescheduleError && <p style={{ color: COLORS.danger, fontSize: '12px', margin: '0 0 10px' }}>{rescheduleError}</p>}
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={doReschedule} disabled={rescheduling}
                                      style={{ padding: '8px 18px', borderRadius: '8px', background: COLORS.primary, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: rescheduling ? 0.6 : 1 }}>
                                      {rescheduling ? 'Saving…' : 'Confirm'}
                                    </button>
                                    <button onClick={() => setRescheduleOpen(false)}
                                      style={{ padding: '8px 14px', borderRadius: '8px', background: '#fff', color: COLORS.muted, fontWeight: 600, fontSize: '13px', border: `1.5px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Cancel confirm */}
                      <AnimatePresence>
                        {cancelConfirmId === selected.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                            <div style={{ background: '#FFF5F5', border: `1.5px solid ${COLORS.danger}30`, borderRadius: '14px', padding: '16px 18px' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <AlertTriangle size={15} color={COLORS.danger} />
                                </div>
                                <div>
                                  <p style={{ fontWeight: 800, fontSize: '13px', color: COLORS.danger, margin: '0 0 3px' }}>Cancel this pickup?</p>
                                  <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>Order #{selected.orderNumber} will be permanently cancelled.</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => doCancel(selected.id)} disabled={cancelling}
                                  style={{ padding: '8px 18px', borderRadius: '8px', background: COLORS.danger, color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: cancelling ? 0.6 : 1 }}>
                                  {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                                </button>
                                <button onClick={() => setCancelConfirmId(null)}
                                  style={{ padding: '8px 14px', borderRadius: '8px', background: '#fff', color: COLORS.muted, fontWeight: 600, fontSize: '13px', border: `1.5px solid ${COLORS.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                                  Keep Order
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ── Progress timeline ── */}
                      <div>
                        <p style={{ fontWeight: 800, fontSize: '11px', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 18px' }}>Order Progress</p>

                        {selected.status === 'cancelled' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', background: '#FEF2F2', borderRadius: '14px', border: `1px solid #FECACA` }}>
                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <X size={18} color={COLORS.danger} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '14px', color: COLORS.danger }}>Order Cancelled</div>
                              <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>You can schedule a new pickup anytime.</div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ position: 'relative' }}>
                            {ORDER_STATUSES.map((step, i) => {
                              const done    = i <= statusIdx;
                              const current = i === statusIdx;
                              const Icon    = STATUS_ICONS[step.key] ?? Package;
                              const lineCol = i < statusIdx ? activeColor : COLORS.border;

                              return (
                                <div key={step.key} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
                                  {i < ORDER_STATUSES.length - 1 && (
                                    <div style={{ position: 'absolute', left: 19, top: 40, width: 2, height: 32, background: lineCol, zIndex: 0, borderRadius: '2px', transition: 'background 0.3s' }} />
                                  )}
                                  <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                                    <motion.div
                                      animate={current ? { boxShadow: [`0 0 0 0px ${activeColor}40`, `0 0 0 8px ${activeColor}12`, `0 0 0 0px ${activeColor}40`] } : {}}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      style={{ width: 40, height: 40, borderRadius: '12px', background: done ? activeColor : '#fff', border: `2px solid ${done ? activeColor : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                      <Icon size={16} color={done ? '#fff' : COLORS.muted} />
                                    </motion.div>
                                  </div>
                                  <div style={{ paddingBottom: i < ORDER_STATUSES.length - 1 ? '24px' : '0', paddingTop: '10px' }}>
                                    <div style={{ fontWeight: current ? 800 : done ? 600 : 500, fontSize: '13px', color: done ? COLORS.dark : COLORS.muted }}>
                                      {step.label}
                                    </div>
                                    {current && (
                                      <div style={{ fontSize: '11px', fontWeight: 700, color: activeColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeColor, display: 'inline-block', animation: 'blink 1.4s infinite' }} />
                                        In Progress
                                      </div>
                                    )}
                                    {done && !current && (
                                      <div style={{ fontSize: '11px', color: COLORS.success, marginTop: '2px', fontWeight: 600 }}>✓ Done</div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', color: COLORS.muted, textAlign: 'center' }}>
                  <Navigation size={32} color={COLORS.border} style={{ marginBottom: '12px' }} />
                  <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 4px' }}>No order selected</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>Select an order from the left to see tracking details.</p>
                </div>
              )}
            </motion.div>

            {/* ════ COL 3: Bill ════ */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
              style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

              {selected ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selected.id + '-bill'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                    {/* Card header */}
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '9px', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Receipt size={15} color="#10B981" />
                        </div>
                        <h2 style={{ fontSize: '13px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Bill Summary</h2>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {selected.deliveryType === 'express' && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '6px', padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Zap size={9} /> ×1.5
                          </span>
                        )}
                        {billItems.length > 0 && (
                          <span style={{ fontSize: '10px', color: COLORS.muted, background: COLORS.background, padding: '2px 8px', borderRadius: '999px', fontWeight: 600, border: `1px solid ${COLORS.border}` }}>
                            {billItems.length} item{billItems.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bill body */}
                    {billLoading ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>Loading…</div>
                    ) : billItems.length === 0 ? (
                      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                          {selected.status === 'pickup_scheduled' ? '📦' : '📋'}
                        </div>
                        <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 6px', fontSize: '13px' }}>
                          {selected.status === 'pickup_scheduled' ? 'Awaiting pickup' : 'No items yet'}
                        </p>
                        <p style={{ color: COLORS.muted, fontSize: '12px', margin: 0, lineHeight: 1.6 }}>
                          {selected.status === 'pickup_scheduled'
                            ? 'Your itemised bill will appear here after our agent picks up your order.'
                            : 'Items have not been recorded yet.'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Column header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 36px 64px', padding: '8px 16px', background: COLORS.background, fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em', gap: '4px', borderBottom: `1px solid ${COLORS.border}` }}>
                          <span>Item</span>
                          <span style={{ textAlign: 'center' }}>Type</span>
                          <span style={{ textAlign: 'center' }}>Qty</span>
                          <span style={{ textAlign: 'right' }}>Price</span>
                        </div>

                        {billItems.map((item, i) => {
                          const slug = idToSlug[item.service_id] ?? item.service_id;
                          const tag  = BILL_TAG[slug] ?? null;
                          return (
                            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 40px 36px 64px', padding: '10px 16px', borderBottom: `1px solid ${COLORS.border}`, alignItems: 'center', fontSize: '12px', gap: '4px', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                              <span style={{ fontWeight: 600, color: COLORS.dark, wordBreak: 'break-word', lineHeight: 1.3 }}>{item.item_name}</span>
                              <span style={{ textAlign: 'center' }}>
                                {tag
                                  ? <span style={{ fontSize: '9px', fontWeight: 800, color: tag.color, background: `${tag.color}15`, borderRadius: '4px', padding: '2px 5px', border: `1px solid ${tag.color}25`, whiteSpace: 'nowrap' }}>{tag.label}</span>
                                  : <span style={{ color: COLORS.muted }}>—</span>}
                              </span>
                              <span style={{ color: COLORS.muted, textAlign: 'center' }}>×{item.quantity}</span>
                              <span style={{ fontWeight: 700, color: COLORS.dark, textAlign: 'right' }}>₹{item.total_price.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}

                        {/* Totals */}
                        {(() => {
                          const isExpress   = selected.deliveryType === 'express';
                          const hasDiscount = selected.discount > 0;
                          const itemsBase   = billItems.reduce((s, i) => s + i.total_price, 0);
                          return (
                            <div style={{ borderTop: `2px solid ${COLORS.border}` }}>
                              {isExpress && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: '12px' }}>
                                    <span style={{ color: COLORS.muted }}>Items base</span>
                                    <span style={{ color: COLORS.muted }}>₹{itemsBase.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 16px 8px', fontSize: '12px' }}>
                                    <span style={{ color: '#F97316', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={11} /> Express (×1.5)</span>
                                    <span style={{ color: '#F97316', fontWeight: 700 }}>₹{selected.subtotal.toLocaleString('en-IN')}</span>
                                  </div>
                                </>
                              )}
                              {!isExpress && hasDiscount && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: '12px' }}>
                                  <span style={{ color: COLORS.muted }}>Subtotal</span>
                                  <span style={{ color: COLORS.muted }}>₹{selected.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {hasDiscount && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 16px 8px', fontSize: '12px' }}>
                                  <span style={{ color: '#16A34A', fontWeight: 700 }}>🏷️ {selected.couponCode ?? 'Discount'}</span>
                                  <span style={{ color: '#16A34A', fontWeight: 700 }}>−₹{selected.discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: `linear-gradient(135deg,${activeColor}12,${activeColor}06)`, borderTop: `1px solid ${activeColor}20` }}>
                                <span style={{ fontWeight: 800, fontSize: '13px', color: activeColor }}>Total Payable</span>
                                <span style={{ fontWeight: 900, fontSize: '20px', color: activeColor }}>₹{selected.total.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', color: COLORS.muted, textAlign: 'center' }}>
                  <Receipt size={32} color={COLORS.border} style={{ marginBottom: '12px' }} />
                  <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 4px' }}>No bill yet</p>
                  <p style={{ fontSize: '13px', margin: 0 }}>Select an order to see its bill.</p>
                </div>
              )}
            </motion.div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .order-list-btn:hover { background: ${COLORS.background} !important; }
        @media (max-width: 960px) {
          .tracking-3col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 961px) and (max-width: 1200px) {
          .tracking-3col { grid-template-columns: 240px 1fr 290px !important; }
        }
        @media (max-width: 760px) {
          .stat-row  { grid-template-columns: 1fr 1fr 1fr !important; }
          .stat-cell:nth-child(n+4) { border-top: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 480px) {
          .stat-row  { grid-template-columns: 1fr 1fr !important; }
          .stat-cell:nth-child(n+3) { border-top: 1px solid ${COLORS.border}; }
        }
      `}</style>
    </Layout>
  );
}

function InfoCard({
  icon, label, value, valueColor, bg, span2,
}: {
  icon: React.ReactNode; label: string; value: string; valueColor?: string; bg?: string; span2?: boolean;
}) {
  return (
    <div style={{ padding: '10px 12px', borderRadius: '12px', background: bg ?? COLORS.background, border: `1px solid ${COLORS.border}`, gridColumn: span2 ? '1 / -1' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
        {icon}
        <span style={{ fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: valueColor ?? COLORS.dark, lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}
