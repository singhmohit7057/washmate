import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Shirt, Footprints, Blinds, BedDouble } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';
import type { PricingItem } from '../../types';

type SpecialtyItem = { name: string; price: number; unit?: string };

const SPECIALTY_DB_CATS = ['Footwear', 'Curtains', 'Bedding'];

const APPAREL_CATEGORIES = ['All', 'Tops', 'Bottoms', 'Ethnic Wear', 'Formal', 'Home Linen'];

const SERVICE_COLS = [
  { key: 'washFoldPrice',  label: 'Wash & Fold', abbr: 'W&F', color: COLORS.primary },
  { key: 'dryCleanPrice',  label: 'Dry Cleaning', abbr: 'DC',  color: '#8B5CF6'     },
  { key: 'steamIronPrice', label: 'Steam Iron',   abbr: 'SI',  color: '#F59E0B'     },
] as const;

export default function PricingPage() {
  const [apparel, setApparel]     = useState<PricingItem[]>([]);
  const [shoes, setShoes]         = useState<SpecialtyItem[]>([]);
  const [curtains, setCurtains]   = useState<SpecialtyItem[]>([]);
  const [blankets, setBlankets]   = useState<SpecialtyItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [activeTab, setActiveTab] = useState<'apparel' | 'shoes' | 'curtains' | 'blankets'>('apparel');

  useEffect(() => {
    supabase.from('pricing').select('*').eq('is_active', true)
      .order('category').order('item_name')
      .then(({ data }) => {
        const rows = data ?? [];
        const apparelRows = rows.filter(d => !SPECIALTY_DB_CATS.includes(d.category));
        const shoeRows    = rows.filter(d => d.category === 'Footwear');
        const curtainRows = rows.filter(d => d.category === 'Curtains');
        const blanketRows = rows.filter(d => d.category === 'Bedding');

        setApparel(apparelRows.map(d => ({
          id: d.id, itemName: d.item_name, category: d.category,
          washFoldPrice: d.wash_fold_price, dryCleanPrice: d.dry_clean_price, steamIronPrice: d.steam_iron_price,
        })));
        setShoes(shoeRows.map(d => ({ name: d.item_name, price: d.wash_fold_price ?? 0 })));
        setCurtains(curtainRows.map(d => ({ name: d.item_name, price: d.wash_fold_price ?? 0, unit: 'per panel' })));
        setBlankets(blanketRows.map(d => ({ name: d.item_name, price: d.wash_fold_price ?? 0 })));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() =>
    apparel.filter(item => {
      const q = search.toLowerCase();
      return item.itemName.toLowerCase().includes(q) && (category === 'All' || item.category === category);
    }), [apparel, search, category]);

  const grouped = useMemo(() => {
    const map: Record<string, PricingItem[]> = {};
    filtered.forEach(item => { if (!map[item.category]) map[item.category] = []; map[item.category].push(item); });
    return map;
  }, [filtered]);

  const TABS = [
    { key: 'apparel',  label: '👕 Apparel',  icon: Shirt      },
    { key: 'shoes',    label: '👟 Shoes',    icon: Footprints  },
    { key: 'curtains', label: '🪟 Curtains', icon: Blinds      },
    { key: 'blankets', label: '🛏️ Blankets', icon: BedDouble   },
  ] as const;

  return (
    <Layout>
      <SEO
        title="Pricing | WashMate"
        description="Transparent per-item pricing for laundry, dry cleaning, shoe cleaning, curtain and blanket cleaning. No hidden charges."
        keywords="laundry pricing Kolkata, dry cleaning rates, shoe cleaning price, curtain cleaning"
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 56px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-1px' }}>
              Simple, <span style={{ color: COLORS.primary }}>Transparent</span> Pricing
            </h1>
            <p style={{ fontSize: '17px', color: COLORS.muted, maxWidth: '520px', margin: '0 auto 28px' }}>
              Every item, every service — priced upfront. No surprises at delivery.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {SERVICE_COLS.map(s => (
                <span key={s.abbr} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', border: `1px solid ${s.color}30`, borderRadius: '999px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, color: s.color }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                  {s.label}
                </span>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', border: `1px solid #EF444430`, borderRadius: '999px', padding: '6px 14px', fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                Specialty Cleaning
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 24px 80px', background: '#fff' }} className="pricing-section">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '6px', padding: '6px', background: COLORS.background, borderRadius: '14px', marginBottom: '36px', overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === t.key ? '#fff' : 'transparent', color: activeTab === t.key ? COLORS.dark : COLORS.muted, fontWeight: activeTab === t.key ? 800 : 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: activeTab === t.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── APPAREL TAB ── */}
          {activeTab === 'apparel' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ marginBottom: '24px', padding: '16px 20px', background: COLORS.primaryLight, borderRadius: '14px', border: `1px solid ${COLORS.primary}20` }}>
                <p style={{ margin: 0, fontSize: '14px', color: COLORS.primary, fontWeight: 600 }}>
                  👕 Each apparel item can be processed via <strong>Wash & Fold</strong>, <strong>Dry Cleaning</strong>, or <strong>Steam Iron</strong> — you choose per item when our agent collects. Prices are per piece.
                </p>
              </div>

              {/* Search + filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.muted }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
                    style={{ width: '100%', padding: '10px 10px 10px 34px', borderRadius: '10px', border: `1.5px solid ${COLORS.border}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {APPAREL_CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                      style={{ padding: '9px 14px', borderRadius: '10px', border: `1.5px solid ${category === c ? COLORS.primary : COLORS.border}`, background: category === c ? COLORS.primaryLight : '#fff', color: category === c ? COLORS.primary : COLORS.muted, fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column legend */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {SERVICE_COLS.map(s => (
                  <div key={s.abbr} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <strong style={{ color: s.color }}>{s.abbr}</strong>
                    <span style={{ color: COLORS.muted }}>= {s.label}</span>
                  </div>
                ))}
                <span style={{ color: COLORS.muted, fontSize: '13px', marginLeft: 'auto' }}>— = not available</span>
              </div>

              {loading ? <LoadingSpinner /> : apparel.length === 0 ? (
                <EmptyState message="No apparel pricing added yet." />
              ) : (
                <>
                  {Object.entries(grouped).map(([cat, catItems]) => (
                    <div key={cat} style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, marginBottom: '10px', padding: '6px 0', borderBottom: `2px solid ${COLORS.border}` }}>
                        {cat}
                      </h2>
                      <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '14px', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: COLORS.background, padding: '10px 20px', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item</span>
                          {SERVICE_COLS.map(s => (
                            <span key={s.abbr} style={{ fontSize: '11px', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{s.abbr}</span>
                          ))}
                        </div>
                        {catItems.map((item, idx) => (
                          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '13px 20px', gap: '8px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>{item.itemName}</span>
                            {SERVICE_COLS.map(s => (
                              <PriceCell key={s.key} value={item[s.key] as number | null} color={s.color} />
                            ))}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!Object.keys(grouped).length && (
                    <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted }}>No items found for "{search}"</div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── SHOES TAB ── */}
          {activeTab === 'shoes' && (
            <SpecialtySection
              icon="👟" color="#EF4444"
              description="Deep-clean, condition and deodorize any footwear. Price is per pair."
              items={shoes}
              loading={loading}
              note="Includes brush scrub, sole clean, conditioning, and deodorizing. Leather shoes include polish."
            />
          )}

          {/* ── CURTAINS TAB ── */}
          {activeTab === 'curtains' && (
            <SpecialtySection
              icon="🪟" color="#06B6D4"
              description="Dust extraction, anti-bacterial wash and pressed finish. Price is per panel."
              items={curtains}
              loading={loading}
              note="Curtains are measured and tagged at pickup. Heavy drapes and lined curtains may take an extra day."
            />
          )}

          {/* ── BLANKETS TAB ── */}
          {activeTab === 'blankets' && (
            <SpecialtySection
              icon="🛏️" color="#10B981"
              description="Industrial-grade wash with dust-mite treatment. Price is per piece."
              items={blankets}
              loading={loading}
              note="King-size duvets and comforters are processed in industrial machines. Includes air-freshening and fresh packaging."
            />
          )}

          {/* Footer note */}
          <div style={{ marginTop: '36px', padding: '16px 20px', background: COLORS.background, borderRadius: '12px', fontSize: '13px', color: COLORS.muted, lineHeight: 1.7 }}>
            * Prices are per item / per pair / per panel as indicated. GST included. Express delivery adds 1.5× to above rates.
            Final bill is generated by our pickup agent after collecting and counting your items.
          </div>

          {/* CTA */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link to="/schedule-pickup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: COLORS.primary, color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '16px' }}>
              Schedule a Pickup <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          .pricing-section { padding: 32px 16px 60px !important; }
        }
      `}</style>
    </Layout>
  );
}

// ─── Specialty section ────────────────────────────────────────────────────────

function SpecialtySection({ icon, color, description, items, loading, note }: {
  icon: string; color: string; description: string;
  items: SpecialtyItem[]; loading: boolean; note: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '24px', padding: '16px 20px', background: `${color}10`, borderRadius: '14px', border: `1px solid ${color}30` }}>
        <p style={{ margin: 0, fontSize: '14px', color, fontWeight: 600 }}>
          {icon} {description}
        </p>
      </div>

      {loading ? <LoadingSpinner /> : items.length === 0 ? (
        <EmptyState message="Pricing for this category hasn't been added yet." />
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', background: COLORS.background, padding: '10px 24px', gap: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 80, textAlign: 'right' }}>Price</span>
          </div>
          {items.map((item, idx) => (
            <motion.div key={item.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '15px 24px', gap: '24px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center', background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: '15px', color: COLORS.dark }}>{item.name}</span>
                {item.unit && <span style={{ fontSize: '12px', color: COLORS.muted, marginLeft: '6px' }}>({item.unit})</span>}
              </div>
              <span style={{ fontWeight: 800, fontSize: '16px', color, minWidth: 80, textAlign: 'right' }}>₹{item.price}</span>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && items.length > 0 && (
        <p style={{ marginTop: '14px', fontSize: '13px', color: COLORS.muted, padding: '0 4px', lineHeight: 1.6 }}>ℹ️ {note}</p>
      )}
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', background: COLORS.background, borderRadius: '16px', border: `1.5px dashed ${COLORS.border}` }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔧</div>
      <p style={{ margin: 0, fontWeight: 700, color: COLORS.dark, fontSize: '15px' }}>{message}</p>
      <p style={{ margin: '6px 0 0', color: COLORS.muted, fontSize: '13px' }}>Check back soon — our team is setting this up.</p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PriceCell({ value, color }: { value: number | null; color: string }) {
  if (value === null) return <span style={{ textAlign: 'center', fontSize: '14px', color: '#CBD5E1', display: 'block' }}>—</span>;
  return <span style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px', color, display: 'block' }}>₹{value}</span>;
}
