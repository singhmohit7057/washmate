import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Package, Settings, Droplets, CheckCircle, Truck, Home, X, AlertTriangle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
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
  pickup_scheduled: COLORS.primary,
  picked_up:        '#8B5CF6',
  processing:       '#06B6D4',
  washing:          '#3B82F6',
  quality_check:    '#F59E0B',
  out_for_delivery: '#F97316',
  delivered:        COLORS.success,
  cancelled:        COLORS.danger,
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

  const canManage = (s: string) => s === 'pickup_scheduled';
  const activeColor = selected ? (STATUS_COLOR[selected.status] ?? COLORS.primary) : COLORS.primary;
  const statusIdx   = selected ? ORDER_STATUSES.findIndex(s => s.key === selected.status) : -1;

  return (
    <Layout>
      <SEO title="Order Tracking | WashMate" description="Track your WashMate laundry orders in real time." noIndex />

      {/* ── Header bar ── */}
      <div style={{ background: 'linear-gradient(135deg,#1E1B4B 0%,#312E81 60%,#4338CA 100%)', padding: '28px 24px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>WashMate</p>
          <h1 style={{ fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Order Tracking</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>Live updates on your garments</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
        {loading ? (
          <LoadingSpinner fullPage />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>📦</div>
            <p style={{ fontWeight: 800, fontSize: '18px', color: COLORS.dark, margin: '0 0 6px' }}>No orders yet</p>
            <p style={{ color: COLORS.muted, fontSize: '14px' }}>Your orders will appear here once you schedule a pickup.</p>
          </div>
        ) : (
          /* ── 3-column grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 320px', gap: '0', marginTop: '-1px', minHeight: 'calc(100vh - 200px)', alignItems: 'start' }} className="tracking-3col">

            {/* ════ COL 1: Order list ════ */}
            <div style={{ borderRight: `1px solid ${COLORS.border}`, paddingRight: '0', paddingTop: '20px', paddingBottom: '32px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 16px 12px' }}>Your Orders</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {orders.map(order => {
                  const sc  = STATUS_COLOR[order.status] ?? COLORS.primary;
                  const sel = selected?.id === order.id;
                  return (
                    <button key={order.id} onClick={() => selectOrder(order)}
                      style={{ padding: '14px 16px', border: 'none', borderLeft: `3px solid ${sel ? sc : 'transparent'}`, background: sel ? `${sc}0D` : 'transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.12s', opacity: order.status === 'cancelled' ? 0.5 : 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, fontFamily: 'monospace' }}>#{order.orderNumber}</div>
                      <div style={{ fontSize: '11px', color: COLORS.muted, margin: '2px 0 6px' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: `${sc}18`, color: sc, border: `1px solid ${sc}25` }}>
                          {ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status}
                        </span>
                        {order.deliveryType === 'express' && (
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '2px 6px' }}>⚡</span>
                        )}
                      </div>
                      {order.total > 0 && (
                        <div style={{ fontSize: '12px', fontWeight: 800, color: COLORS.dark, marginTop: '5px' }}>₹{order.total.toLocaleString('en-IN')}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ════ COL 2: Tracking ════ */}
            {selected ? (
              <AnimatePresence mode="wait">
                <motion.div key={selected.id + '-track'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ borderRight: `1px solid ${COLORS.border}`, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '0' }}>

                  {/* Order header */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Order</p>
                        <h2 style={{ fontSize: '20px', fontWeight: 900, color: COLORS.dark, margin: '0', fontFamily: 'monospace' }}>#{selected.orderNumber}</h2>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}30` }}>
                          {ORDER_STATUSES.find(s => s.key === selected.status)?.label ?? selected.status}
                        </span>
                        {selected.deliveryType === 'express' && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '999px', padding: '4px 10px' }}>⚡ Express ×1.5</span>
                        )}
                      </div>
                    </div>

                    {/* Info row */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '16px', padding: '14px 16px', background: COLORS.background, borderRadius: '12px' }}>
                      <InfoChip icon="📅" label="Pickup" value={new Date(selected.pickupDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} />
                      <InfoChip icon="🕐" label="Slot" value={TIME_SLOTS.find(t => t.value === selected.pickupTime)?.label ?? selected.pickupTime} />
                      <InfoChip icon="📍" label="Address" value={selected.deliveryAddress} />
                      {selected.couponCode && <InfoChip icon="🏷️" label="Coupon" value={selected.couponCode} valueColor="#16A34A" />}
                    </div>
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
                        <div style={{ background: COLORS.primaryLight, border: `1.5px solid ${COLORS.primary}30`, borderRadius: '14px', padding: '18px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.primary }}>📅 Change Pickup Slot</span>
                            <button onClick={() => setRescheduleOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 0 }}><X size={15} /></button>
                          </div>
                          {rescheduleOk ? (
                            <div style={{ color: COLORS.success, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle size={16} /> Rescheduled!
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
                        <div style={{ background: '#FFF5F5', border: `1.5px solid ${COLORS.danger}30`, borderRadius: '14px', padding: '18px 20px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
                            <AlertTriangle size={18} color={COLORS.danger} style={{ flexShrink: 0, marginTop: '1px' }} />
                            <div>
                              <p style={{ fontWeight: 800, fontSize: '13px', color: COLORS.danger, margin: '0 0 3px' }}>Cancel this pickup?</p>
                              <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>Order #{selected.orderNumber} will be cancelled. This cannot be undone.</p>
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
                    <p style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Progress</p>

                    {selected.status === 'cancelled' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', background: '#FEF2F2', borderRadius: '12px', border: `1px solid #FECACA` }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <X size={16} color={COLORS.danger} />
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
                                <div style={{ position: 'absolute', left: 17, top: 36, width: 2, height: 34, background: lineCol, zIndex: 0, transition: 'background 0.3s' }} />
                              )}
                              <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                                <motion.div
                                  animate={current ? { boxShadow: [`0 0 0 0px ${activeColor}40`,`0 0 0 7px ${activeColor}12`,`0 0 0 0px ${activeColor}40`] } : {}}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  style={{ width: 36, height: 36, borderRadius: '50%', background: done ? activeColor : '#fff', border: `2px solid ${done ? activeColor : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                  <Icon size={15} color={done ? '#fff' : COLORS.muted} />
                                </motion.div>
                              </div>
                              <div style={{ paddingBottom: i < ORDER_STATUSES.length - 1 ? '26px' : '0', paddingTop: '8px' }}>
                                <div style={{ fontWeight: current ? 800 : done ? 600 : 500, fontSize: '13px', color: done ? COLORS.dark : COLORS.muted }}>
                                  {step.label}
                                </div>
                                {current && (
                                  <div style={{ fontSize: '10px', fontWeight: 700, color: activeColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: activeColor, display: 'inline-block', animation: 'blink 1.4s infinite' }} />
                                    In Progress
                                  </div>
                                )}
                                {done && !current && <div style={{ fontSize: '10px', color: COLORS.success, marginTop: '2px' }}>✓ Done</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: COLORS.muted, fontSize: '14px', borderRight: `1px solid ${COLORS.border}` }}>
                Select an order to see tracking
              </div>
            )}

            {/* ════ COL 3: Bill ════ */}
            {selected ? (
              <AnimatePresence mode="wait">
                <motion.div key={selected.id + '-bill'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '0' }}>

                  {/* Bill header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🧾</span>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bill Summary</span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {selected.deliveryType === 'express' && (
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '6px', padding: '2px 7px' }}>⚡ ×1.5</span>
                      )}
                      {billItems.length > 0 && (
                        <span style={{ fontSize: '10px', color: COLORS.muted, background: COLORS.background, padding: '2px 8px', borderRadius: '999px', fontWeight: 600, border: `1px solid ${COLORS.border}` }}>
                          {billItems.length} item{billItems.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bill body */}
                  <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                    {billLoading ? (
                      <div style={{ padding: '32px', textAlign: 'center', color: COLORS.muted, fontSize: '13px' }}>Loading…</div>
                    ) : billItems.length === 0 ? (
                      <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                          {selected.status === 'pickup_scheduled' ? '📦' : '📋'}
                        </div>
                        <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 4px', fontSize: '13px' }}>
                          {selected.status === 'pickup_scheduled' ? 'Awaiting pickup' : 'No items yet'}
                        </p>
                        <p style={{ color: COLORS.muted, fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
                          {selected.status === 'pickup_scheduled'
                            ? 'Your itemised bill will appear here after our agent picks up your order.'
                            : 'Items have not been recorded yet.'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Column header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 60px', padding: '8px 14px', background: COLORS.background, fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.04em', gap: '4px' }}>
                          <span>Item</span>
                          <span style={{ textAlign: 'center' }}>Type</span>
                          <span style={{ textAlign: 'center' }}>Qty</span>
                          <span style={{ textAlign: 'right' }}>Price</span>
                        </div>

                        {/* Rows */}
                        {billItems.map((item, i) => {
                          const slug = idToSlug[item.service_id] ?? item.service_id;
                          const tag = BILL_TAG[slug] ?? null;
                          return (
                            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 36px 36px 60px', padding: '10px 14px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', fontSize: '12px', gap: '4px', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                              <span style={{ fontWeight: 600, color: COLORS.dark, wordBreak: 'break-word', lineHeight: 1.3 }}>{item.item_name}</span>
                              <span style={{ textAlign: 'center' }}>
                                {tag
                                  ? <span style={{ fontSize: '9px', fontWeight: 800, color: tag.color, background: `${tag.color}15`, borderRadius: '4px', padding: '2px 4px', border: `1px solid ${tag.color}25` }}>{tag.label}</span>
                                  : <span style={{ color: COLORS.muted }}>—</span>}
                              </span>
                              <span style={{ color: COLORS.muted, textAlign: 'center' }}>×{item.quantity}</span>
                              <span style={{ fontWeight: 700, color: COLORS.dark, textAlign: 'right' }}>₹{item.total_price.toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}

                        {/* Totals */}
                        {(() => {
                          const isExpress  = selected.deliveryType === 'express';
                          const hasDiscount = selected.discount > 0;
                          const itemsBase  = billItems.reduce((s, i) => s + i.total_price, 0);
                          return (
                            <div style={{ borderTop: `2px solid ${COLORS.border}` }}>
                              {isExpress && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', fontSize: '12px' }}>
                                    <span style={{ color: COLORS.muted }}>Items base</span>
                                    <span style={{ color: COLORS.muted }}>₹{itemsBase.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 14px 8px', fontSize: '12px' }}>
                                    <span style={{ color: '#F97316', fontWeight: 700 }}>⚡ Express (×1.5)</span>
                                    <span style={{ color: '#F97316', fontWeight: 700 }}>₹{selected.subtotal.toLocaleString('en-IN')}</span>
                                  </div>
                                </>
                              )}
                              {!isExpress && hasDiscount && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', fontSize: '12px' }}>
                                  <span style={{ color: COLORS.muted }}>Subtotal</span>
                                  <span style={{ color: COLORS.muted }}>₹{selected.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {hasDiscount && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 14px 8px', fontSize: '12px' }}>
                                  <span style={{ color: '#16A34A' }}>🏷️ {selected.couponCode ?? 'Discount'}</span>
                                  <span style={{ color: '#16A34A', fontWeight: 700 }}>−₹{selected.discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: `linear-gradient(135deg, ${activeColor}12, ${activeColor}08)`, borderTop: `1px solid ${activeColor}20` }}>
                                <span style={{ fontWeight: 800, fontSize: '13px', color: activeColor }}>Total Payable</span>
                                <span style={{ fontWeight: 900, fontSize: '18px', color: activeColor }}>₹{selected.total.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>

                  {/* Delivery address card */}
                  <div style={{ marginTop: '14px', padding: '14px 16px', background: COLORS.background, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>Delivery Address</p>
                    <p style={{ fontSize: '12px', color: COLORS.dark, margin: 0, lineHeight: 1.5 }}>{selected.deliveryAddress}</p>
                  </div>

                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: COLORS.muted, fontSize: '14px' }}>
                Bill will appear here
              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 900px) {
          .tracking-3col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .tracking-3col { grid-template-columns: 220px 1fr 280px !important; }
        }
      `}</style>
    </Layout>
  );
}

function InfoChip({ icon, label, value, valueColor }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', minWidth: 0 }}>
      <span style={{ fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: valueColor ?? COLORS.dark, marginTop: '1px', wordBreak: 'break-word' }}>{value}</div>
      </div>
    </div>
  );
}
