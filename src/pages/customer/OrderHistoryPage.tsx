import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowRight, Search, Calendar, Zap, X, ShoppingBag } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { COLORS, ORDER_STATUSES } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';

const STATUS_COLOR: Record<string, string> = {
  pending:           '#F59E0B',
  confirmed:         '#3B82F6',
  picked_up:         '#8B5CF6',
  processing:        '#06B6D4',
  washing:           '#06B6D4',
  quality_check:     '#10B981',
  ready:             '#10B981',
  out_for_delivery:  '#F97316',
  delivered:         COLORS.success,
  cancelled:         COLORS.danger,
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('id, order_number, status, delivery_type, pickup_date, pickup_time, total, subtotal, discount, coupon_code, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        type Row = {
          id: string; order_number: string; status: string; delivery_type: string;
          pickup_date: string; pickup_time: string; total: number; subtotal: number;
          discount: number; coupon_code: string | null; created_at: string;
        };
        setOrders(((data ?? []) as Row[]).map(d => ({
          id: d.id,
          orderNumber: d.order_number,
          status: d.status,
          deliveryType: d.delivery_type as 'regular' | 'express',
          pickupDate: d.pickup_date,
          pickupTime: d.pickup_time,
          total: d.total,
          subtotal: d.subtotal,
          discount: d.discount,
          couponCode: d.coupon_code,
          createdAt: d.created_at,
        })));
        setLoading(false);
      });
  }, [user]);

  const totalCount     = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const activeCount    = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const totalSpent     = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        o.pickupDate?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const filterGroups = [
    { key: 'all',       label: 'All',        color: COLORS.primary },
    { key: 'active',    label: 'Active',      color: '#F97316', isGroup: true },
    { key: 'delivered', label: 'Delivered',   color: COLORS.success },
    { key: 'cancelled', label: 'Cancelled',   color: COLORS.danger },
  ];

  const getFilteredForGroup = (key: string) => {
    if (key === 'all') return orders;
    if (key === 'active') return orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    return orders.filter(o => o.status === key);
  };

  return (
    <Layout>
      <SEO title="Order History | WashMate" description="Your complete WashMate laundry order history." noIndex />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '48px 24px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -40, left: 40, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                <ShoppingBag size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Order History</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>{totalCount} order{totalCount !== 1 ? 's' : ''} total</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: '#fff', textDecoration: 'none', padding: '11px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: '1.5px solid rgba(255,255,255,0.2)', transition: 'background 0.2s' }}>
              <Package size={15} /> New Pickup
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip (overlaps hero) ── */}
      <div style={{ maxWidth: '1100px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }} className="stat-row">
          {[
            { emoji: '📦', label: 'Total Orders', value: totalCount,                                color: COLORS.primary },
            { emoji: '✅', label: 'Delivered',     value: deliveredCount,                           color: COLORS.success },
            { emoji: '🔄', label: 'Active',        value: activeCount,                              color: '#F97316'      },
            { emoji: '❌', label: 'Cancelled',     value: cancelledCount,                           color: COLORS.danger  },
            { emoji: '💰', label: 'Total Spent',   value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#8B5CF6'      },
          ].map((s, i, arr) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06 }}
              style={{ padding: '20px 16px', borderRight: i < arr.length - 1 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}
              className="stat-cell">
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: 'clamp(16px,2vw,22px)', fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px 64px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: '#fff', borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

          {/* Card header */}
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 34, height: 34, borderRadius: '10px', background: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} color="#D97706" />
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>All Orders</h2>
          </div>

          {/* Filters + search bar */}
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status filter chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
              {filterGroups.map(f => {
                const count = getFilteredForGroup(f.key).length;
                const isActive = statusFilter === f.key || (f.key === 'active' && !['all','delivered','cancelled'].includes(statusFilter) && statusFilter !== 'all');
                const active = statusFilter === f.key;
                return (
                  <button key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '999px', border: `1.5px solid ${active ? f.color : COLORS.border}`, background: active ? `${f.color}12` : '#fff', color: active ? f.color : COLORS.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {f.label}
                    <span style={{ fontSize: '10px', background: active ? `${f.color}22` : COLORS.background, padding: '1px 5px', borderRadius: '999px' }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
                style={{ width: '100%', padding: '7px 30px 7px 30px', borderRadius: '8px', border: `1.5px solid ${COLORS.border}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.muted, padding: 0, display: 'flex' }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: COLORS.muted, fontSize: '14px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '72px 24px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '20px', background: COLORS.background, border: `1px dashed ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Package size={32} color={COLORS.border} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, margin: '0 0 8px' }}>No orders yet</h3>
              <p style={{ color: COLORS.muted, fontSize: '14px', margin: '0 0 24px' }}>Your laundry order history will appear here.</p>
              <Link to="/schedule-pickup"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px' }}>
                Schedule First Pickup <ArrowRight size={14} />
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Search size={28} color={COLORS.border} style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: 700, color: COLORS.dark, margin: '0 0 6px' }}>No orders match your filter</p>
              <button onClick={() => { setSearch(''); setStatusFilter('all'); }}
                style={{ fontSize: '13px', color: COLORS.primary, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="oh-table">
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 90px 130px 80px', padding: '10px 24px', background: COLORS.background, borderBottom: `1px solid ${COLORS.border}`, gap: '12px' }}>
                  {['Order #', 'Pickup Date', 'Service', 'Total', 'Status', ''].map(h => (
                    <span key={h} style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                  ))}
                </div>

                <AnimatePresence initial={false}>
                  {filtered.map((order, i) => {
                    const sc  = STATUS_COLOR[order.status] ?? COLORS.muted;
                    const label = ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status;
                    return (
                      <motion.div key={order.id}
                        initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 90px 130px 80px', padding: '14px 24px', borderBottom: `1px solid ${COLORS.border}`, alignItems: 'center', gap: '12px' }}
                        className="oh-row">
                        {/* Order # */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={14} color={sc} />
                          </div>
                          <span style={{ fontWeight: 800, color: COLORS.dark, fontSize: '13px', fontFamily: 'monospace' }}>#{order.orderNumber}</span>
                        </div>

                        {/* Pickup date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: COLORS.darkMuted }}>
                          <Calendar size={12} color={COLORS.muted} />
                          {order.pickupDate
                            ? new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </div>

                        {/* Service type */}
                        <div>
                          {order.deliveryType === 'express' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '6px', padding: '2px 8px' }}>
                              <Zap size={10} /> Express
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: COLORS.muted, fontWeight: 600 }}>Regular</span>
                          )}
                        </div>

                        {/* Total */}
                        <div>
                          {order.total === 0 ? (
                            <span style={{ fontSize: '12px', color: COLORS.muted, fontStyle: 'italic' }}>Pending</span>
                          ) : (
                            <span style={{ fontWeight: 900, fontSize: '15px', color: COLORS.dark }}>₹{(order.total ?? 0).toLocaleString('en-IN')}</span>
                          )}
                        </div>

                        {/* Status */}
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: `${sc}15`, color: sc, whiteSpace: 'nowrap', width: 'fit-content' }}>
                          {label}
                        </span>

                        {/* Track link */}
                        <Link to={`/order-tracking?order=${order.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: COLORS.primary, fontWeight: 700, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          Track <ArrowRight size={11} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Mobile cards */}
              <div className="oh-cards" style={{ display: 'none', flexDirection: 'column' }}>
                <AnimatePresence initial={false}>
                  {filtered.map((order, i) => {
                    const sc    = STATUS_COLOR[order.status] ?? COLORS.muted;
                    const label = ORDER_STATUSES.find(s => s.key === order.status)?.label ?? order.status;
                    return (
                      <motion.div key={order.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${sc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package size={16} color={sc} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: COLORS.dark, fontSize: '14px', fontFamily: 'monospace' }}>#{order.orderNumber}</div>
                              <div style={{ fontSize: '11px', color: COLORS.muted }}>
                                {order.pickupDate
                                  ? new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                  : '—'}
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: `${sc}15`, color: sc, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {label}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {order.total === 0 ? (
                              <span style={{ fontSize: '12px', color: COLORS.muted, fontStyle: 'italic' }}>Bill pending</span>
                            ) : (
                              <span style={{ fontWeight: 900, fontSize: '16px', color: COLORS.dark }}>₹{(order.total ?? 0).toLocaleString('en-IN')}</span>
                            )}
                            {order.deliveryType === 'express' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontWeight: 800, color: '#F97316', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '5px', padding: '1px 6px' }}>
                                <Zap size={9} /> Express
                              </span>
                            )}
                          </div>
                          <Link to={`/order-tracking?order=${order.id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: COLORS.primary, fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                            Track Order <ArrowRight size={13} />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Footer count */}
              <div style={{ padding: '12px 24px', background: COLORS.background, borderTop: `1px solid ${COLORS.border}`, fontSize: '12px', color: COLORS.muted, fontWeight: 600 }}>
                Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .oh-row:hover { background: ${COLORS.background}; }
        @media (max-width: 680px) {
          .oh-table { display: none !important; }
          .oh-cards { display: flex !important; }
          .stat-row  { grid-template-columns: 1fr 1fr 1fr !important; }
          .stat-cell:nth-child(n+4) { border-top: 1px solid ${COLORS.border}; }
        }
        @media (max-width: 400px) {
          .stat-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
