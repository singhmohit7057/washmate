import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Filter } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input } from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS } from '../../lib/constants';
import { supabase } from '../../lib/supabase';
import type { PricingItem } from '../../types';

const FALLBACK_PRICING: PricingItem[] = [
  { id: '1', itemName: 'Shirt', category: 'Tops', washFoldPrice: 49, dryCleanPrice: 149, steamIronPrice: 29 },
  { id: '2', itemName: 'T-Shirt', category: 'Tops', washFoldPrice: 35, dryCleanPrice: 99, steamIronPrice: 20 },
  { id: '3', itemName: 'Jeans', category: 'Bottoms', washFoldPrice: 79, dryCleanPrice: 199, steamIronPrice: 39 },
  { id: '4', itemName: 'Trousers', category: 'Bottoms', washFoldPrice: 69, dryCleanPrice: 179, steamIronPrice: 35 },
  { id: '5', itemName: 'Saree (Cotton)', category: 'Ethnic Wear', washFoldPrice: 99, dryCleanPrice: 249, steamIronPrice: 59 },
  { id: '6', itemName: 'Saree (Silk)', category: 'Ethnic Wear', washFoldPrice: null, dryCleanPrice: 399, steamIronPrice: 79 },
  { id: '7', itemName: 'Suit (2 Piece)', category: 'Formal', washFoldPrice: null, dryCleanPrice: 499, steamIronPrice: 99 },
  { id: '8', itemName: 'Blazer', category: 'Formal', washFoldPrice: null, dryCleanPrice: 299, steamIronPrice: 79 },
  { id: '9', itemName: 'Lehenga', category: 'Ethnic Wear', washFoldPrice: null, dryCleanPrice: 599, steamIronPrice: 149 },
  { id: '10', itemName: 'Kurta', category: 'Ethnic Wear', washFoldPrice: 79, dryCleanPrice: 199, steamIronPrice: 49 },
  { id: '11', itemName: 'Curtain (per panel)', category: 'Home Textiles', washFoldPrice: 99, dryCleanPrice: 249, steamIronPrice: 49 },
  { id: '12', itemName: 'Single Blanket', category: 'Home Textiles', washFoldPrice: 149, dryCleanPrice: 299, steamIronPrice: null },
  { id: '13', itemName: 'Double Blanket', category: 'Home Textiles', washFoldPrice: 199, dryCleanPrice: 399, steamIronPrice: null },
  { id: '14', itemName: 'Bed Sheet', category: 'Home Textiles', washFoldPrice: 99, dryCleanPrice: null, steamIronPrice: 39 },
  { id: '15', itemName: 'Sneakers', category: 'Footwear', washFoldPrice: null, dryCleanPrice: null, steamIronPrice: null },
  { id: '16', itemName: 'Leather Shoes', category: 'Footwear', washFoldPrice: null, dryCleanPrice: null, steamIronPrice: null },
];

// Shoe cleaning prices are fixed (not same category columns)
const SHOE_PRICES: Record<string, number> = {
  'Sneakers': 199,
  'Leather Shoes': 299,
};

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Ethnic Wear', 'Formal', 'Home Textiles', 'Footwear'];

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function fetchPricing() {
      try {
        const { data, error } = await supabase
          .from('pricing')
          .select('*')
          .eq('is_active', true)
          .order('category')
          .order('item_name');

        if (error || !data?.length) {
          setItems(FALLBACK_PRICING);
        } else {
          setItems(data.map(d => ({
            id: d.id,
            itemName: d.item_name,
            category: d.category,
            washFoldPrice: d.wash_fold_price,
            dryCleanPrice: d.dry_clean_price,
            steamIronPrice: d.steam_iron_price,
          })));
        }
      } catch {
        setItems(FALLBACK_PRICING);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  const filtered = useMemo(() =>
    items.filter(item => {
      const matchSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || item.category === category;
      return matchSearch && matchCat;
    }),
    [items, search, category]
  );

  const grouped = useMemo(() => {
    const map: Record<string, PricingItem[]> = {};
    filtered.forEach(item => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [filtered]);

  const handleDownloadPDF = () => {
    const content = items.map(i =>
      `${i.itemName} | W&F: ${i.washFoldPrice ? '₹' + i.washFoldPrice : 'N/A'} | DC: ${i.dryCleanPrice ? '₹' + i.dryCleanPrice : 'N/A'} | SI: ${i.steamIronPrice ? '₹' + i.steamIronPrice : 'N/A'}`
    ).join('\n');
    const blob = new Blob([`WashMate Pricing List\n${'='.repeat(50)}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'washmate-pricing.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <SEO
        title="Pricing | WashMate"
        description="View WashMate's transparent pricing for laundry, dry cleaning, and steam ironing services. No hidden charges."
        keywords="laundry pricing Kolkata, dry cleaning rates, wash and fold price"
      />

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-1px' }}>
              Simple, <span style={{ color: COLORS.primary }}>Transparent</span> Pricing
            </h1>
            <p style={{ fontSize: '18px', color: COLORS.muted, maxWidth: '480px', margin: '0 auto' }}>
              No surprises. No hidden fees. Just honest pricing for professional garment care.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '48px 24px 80px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search size={16} />}
                label="Search"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>
                <Filter size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${COLORS.border}`, fontSize: '15px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button
              onClick={handleDownloadPDF}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: COLORS.dark, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '15px', fontFamily: 'inherit' }}
            >
              <Download size={16} /> Download
            </button>
          </div>

          {loading ? (
            <LoadingSpinner fullPage />
          ) : (
            <>
              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px 20px', background: COLORS.background, borderRadius: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Wash & Fold', abbr: 'W&F', color: COLORS.primary },
                  { label: 'Dry Cleaning', abbr: 'DC', color: '#8B5CF6' },
                  { label: 'Steam Ironing', abbr: 'SI', color: '#F59E0B' },
                ].map(l => (
                  <div key={l.abbr} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                    <strong style={{ color: l.color }}>{l.abbr}</strong>
                    <span style={{ color: COLORS.muted }}>— {l.label}</span>
                  </div>
                ))}
                <span style={{ color: COLORS.muted, fontSize: '13px', marginLeft: 'auto' }}>N/A = Not available</span>
              </div>

              {Object.entries(grouped).map(([cat, catItems]) => (
                <div key={cat} style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: COLORS.dark, marginBottom: '12px', padding: '8px 0', borderBottom: `2px solid ${COLORS.border}` }}>
                    {cat}
                  </h2>
                  <div style={{ background: '#fff', border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: COLORS.background, padding: '12px 20px', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>W&F</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>DC</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>SI</span>
                    </div>
                    {catItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '14px 20px', gap: '8px', borderTop: `1px solid ${COLORS.border}`, alignItems: 'center' }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '15px', color: COLORS.dark }}>{item.itemName}</span>
                        <PriceCell value={item.category === 'Footwear' ? SHOE_PRICES[item.itemName] ?? null : item.washFoldPrice} color={COLORS.primary} />
                        <PriceCell value={item.category === 'Footwear' ? SHOE_PRICES[item.itemName] ?? null : item.dryCleanPrice} color="#8B5CF6" />
                        <PriceCell value={item.category === 'Footwear' ? null : item.steamIronPrice} color="#F59E0B" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {!Object.keys(grouped).length && (
                <div style={{ textAlign: 'center', padding: '48px', color: COLORS.muted }}>
                  No items found for "{search}"
                </div>
              )}

              <p style={{ textAlign: 'center', fontSize: '14px', color: COLORS.muted, marginTop: '32px' }}>
                * Prices are per item. GST may apply. Shoe cleaning prices are per pair.
                <br />Express delivery adds 1.5× to the above rates.
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

function PriceCell({ value, color }: { value: number | null; color: string }) {
  if (value === null) {
    return <span style={{ textAlign: 'center', fontSize: '14px', color: '#CBD5E1' }}>—</span>;
  }
  return (
    <span style={{ textAlign: 'center', fontWeight: 700, fontSize: '15px', color }}>₹{value}</span>
  );
}
