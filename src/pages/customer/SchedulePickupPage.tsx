import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Tag, MapPin, Plus, Home, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input, Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { COLORS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { SchedulePickupForm, UserAddress } from '../../types';

const SERVICE_OPTIONS = [
  { value: '', label: 'Select service type' },
  { value: 'wash_fold', label: 'Wash & Fold' },
  { value: 'dry_cleaning', label: 'Dry Cleaning' },
  { value: 'steam_ironing', label: 'Steam Ironing' },
  { value: 'shoe_cleaning', label: 'Shoe Cleaning' },
  { value: 'curtain_cleaning', label: 'Curtain Cleaning' },
  { value: 'blanket_cleaning', label: 'Blanket Cleaning' },
  { value: 'multiple', label: 'Multiple Services' },
];

const TIME_SLOTS = [
  { value: '08:00-12:00', label: '8:00 AM – 12:00 PM' },
  { value: '12:00-16:00', label: '12:00 PM – 4:00 PM' },
  { value: '16:00-20:00', label: '4:00 PM – 8:00 PM' },
];

const LABEL_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home: Home,
  Work: Briefcase,
  Other: MapPin,
};

type AddrMode = 'saved' | 'new';

export default function SchedulePickupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<SchedulePickupForm>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    serviceType: '',
    pickupDate: '',
    pickupTime: '',
    deliveryType: searchParams.get('type') === 'express' ? 'express' : 'regular',
    couponCode: '',
    notes: '',
  });

  // Sync name + phone once auth resolves (user is null on first render)
  useEffect(() => {
    if (!user) return;
    setForm(p => ({
      ...p,
      fullName: p.fullName || user.fullName || '',
      phone:    p.phone    || user.phone    || '',
    }));
  }, [user]);
  const [errors, setErrors]         = useState<Partial<Record<keyof SchedulePickupForm, string>>>({});
  const [loading, setLoading]       = useState(false);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [success, setSuccess]       = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Saved addresses
  const [addresses, setAddresses]         = useState<UserAddress[]>([]);
  const [addrMode, setAddrMode]           = useState<AddrMode>('saved');
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [addrsLoaded, setAddrsLoaded]     = useState(false);
  const [saveNewAddr, setSaveNewAddr]     = useState(false);
  const [newAddrLabel, setNewAddrLabel]   = useState<'Home' | 'Work' | 'Other'>('Home');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .then(({ data }) => {
        const rows = (data ?? []) as UserAddress[];
        setAddresses(rows);
        setAddrsLoaded(true);
        if (rows.length > 0) {
          const def = rows.find(a => a.is_default) ?? rows[0];
          setSelectedAddrId(def.id);
          setAddrMode('saved');
          // Pre-fill form fields from default
          setForm(p => ({ ...p, address: def.address, city: def.city, pincode: def.pincode }));
        } else {
          setAddrMode('new');
        }
      });
  }, [user]);

  const selectAddr = (a: UserAddress) => {
    setSelectedAddrId(a.id);
    setForm(p => ({ ...p, address: a.address, city: a.city, pincode: a.pincode }));
    setErrors(p => ({ ...p, address: undefined, city: undefined }));
  };

  const switchToNew = () => {
    setAddrMode('new');
    setSelectedAddrId(null);
    setForm(p => ({ ...p, address: '', city: '', pincode: '' }));
  };

  const switchToSaved = () => {
    setAddrMode('saved');
    const def = addresses.find(a => a.is_default) ?? addresses[0];
    if (def) {
      setSelectedAddrId(def.id);
      setForm(p => ({ ...p, address: def.address, city: def.city, pincode: def.pincode }));
    }
  };

  const update = (field: keyof SchedulePickupForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setErrors(p => ({ ...p, [field]: undefined }));
    };

  const validate = () => {
    const errs: Partial<Record<keyof SchedulePickupForm, string>> = {};
    if (!form.fullName)    errs.fullName    = 'Name is required';
    if (!form.phone)       errs.phone       = 'Phone is required';
    if (!form.address)     errs.address     = 'Address is required';
    if (!form.city)        errs.city        = 'City is required';
    if (!form.serviceType) errs.serviceType = 'Please select a service';
    if (!form.pickupDate)  errs.pickupDate  = 'Please select a date';
    if (!form.pickupTime)  errs.pickupTime  = 'Please select a time slot';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const applyCoupon = async () => {
    if (!form.couponCode) return;
    const { data } = await supabase.from('coupons').select('*').eq('code', form.couponCode.toUpperCase()).eq('is_active', true).single();
    setCouponStatus(data ? 'valid' : 'invalid');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) { navigate('/login'); return; }

    setLoading(true);
    const num = `WM${Date.now().toString().slice(-8)}`;
    try {
      const { error } = await supabase.from('orders').insert({
        order_number: num,
        user_id: user.id,
        status: 'pickup_scheduled',
        delivery_type: form.deliveryType,
        pickup_date: form.pickupDate,
        pickup_time: form.pickupTime,
        delivery_address: `${form.address}, ${form.city}${form.pincode ? ', ' + form.pincode : ''}`,
        notes: form.notes || null,
        subtotal: 0,
        discount: 0,
        total: 0,
        coupon_code: form.couponCode || null,
      });
      if (error) throw error;
      // Optionally persist the manually-entered address to the user's saved addresses
      if (saveNewAddr && addrMode !== 'saved' && form.address.trim()) {
        const isFirst = addresses.length === 0;
        await supabase.from('user_addresses').insert({
          user_id: user.id,
          label: newAddrLabel,
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          is_default: isFirst,
        });
      }
      setOrderNumber(num);
      setSuccess(true);
    } catch {
      setErrors({ notes: 'Failed to schedule pickup. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  if (success) {
    return (
      <Layout>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ width: 80, height: 80, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color={COLORS.success} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: COLORS.dark, marginBottom: '12px' }}>Pickup Scheduled!</h1>
            <p style={{ fontSize: '16px', color: COLORS.muted, lineHeight: 1.7, marginBottom: '8px' }}>
              Order <strong style={{ color: COLORS.dark }}>#{orderNumber}</strong> confirmed.
            </p>
            <p style={{ fontSize: '15px', color: COLORS.muted, marginBottom: '16px' }}>
              Our agent will arrive on <strong>{form.pickupDate}</strong> during <strong>{TIME_SLOTS.find(t => t.value === form.pickupTime)?.label ?? form.pickupTime}</strong>.
            </p>
            {form.deliveryType === 'express' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '10px', padding: '8px 16px', marginBottom: '24px', fontSize: '13px', fontWeight: 700, color: '#F97316' }}>
                ⚡ Express order — 1.5× pricing will be applied to your bill
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              <Button variant="ghost" onClick={() => { setSuccess(false); setForm(p => ({ ...p, pickupDate: '', pickupTime: '', notes: '' })); }}>
                Schedule Another
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Schedule Pickup | WashMate" description="Schedule a free laundry pickup with WashMate." noIndex />
      <section style={{ padding: '60px 24px 80px', background: COLORS.background }} className="schedule-section">
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: COLORS.dark, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Schedule Free Pickup
            </h1>
            <p style={{ fontSize: '16px', color: COLORS.muted }}>Fill in the details below and we'll be at your door.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '24px' }}
            className="schedule-form-card"
          >
            {/* ── Step 1: Personal ── */}
            <SectionHeader title="Your Details" step={1} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <Input label="Full Name *" placeholder="Priya Sharma" value={form.fullName} onChange={update('fullName')} error={errors.fullName} />
              <Input label="Phone Number *" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} error={errors.phone} />
            </div>

            {/* ── Step 2: Pickup Address ── */}
            <SectionHeader title="Pickup Address" step={2} />

            {/* Saved address picker (only when loaded and has entries) */}
            {addrsLoaded && addresses.length > 0 && (
              <div>
                {/* Toggle tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <button type="button" onClick={switchToSaved}
                    style={{ padding: '8px 18px', borderRadius: '10px', border: `1.5px solid ${addrMode === 'saved' ? COLORS.primary : COLORS.border}`, background: addrMode === 'saved' ? COLORS.primaryLight : '#fff', color: addrMode === 'saved' ? COLORS.primary : COLORS.muted, fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    📌 Saved Addresses
                  </button>
                  <button type="button" onClick={switchToNew}
                    style={{ padding: '8px 18px', borderRadius: '10px', border: `1.5px solid ${addrMode === 'new' ? COLORS.primary : COLORS.border}`, background: addrMode === 'new' ? COLORS.primaryLight : '#fff', color: addrMode === 'new' ? COLORS.primary : COLORS.muted, fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={13} /> Enter New</span>
                  </button>
                </div>

                {/* Saved list */}
                <AnimatePresence mode="wait">
                  {addrMode === 'saved' && (
                    <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {addresses.map(a => {
                        const LI = LABEL_ICONS[a.label] ?? MapPin;
                        const isSelected = selectedAddrId === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => selectAddr(a)}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${isSelected ? COLORS.primary : COLORS.border}`, background: isSelected ? COLORS.primaryLight : '#FAFAFA', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
                          >
                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: isSelected ? `${COLORS.primary}20` : '#fff', border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              <LI size={15} color={isSelected ? COLORS.primary : COLORS.muted} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{ fontWeight: 800, fontSize: '13px', color: COLORS.dark }}>{a.label}</span>
                                {a.is_default && <span style={{ fontSize: '10px', fontWeight: 700, background: COLORS.primary, color: '#fff', padding: '1px 6px', borderRadius: '999px' }}>Default</span>}
                                {isSelected && <span style={{ fontSize: '10px', fontWeight: 700, background: COLORS.success, color: '#fff', padding: '1px 6px', borderRadius: '999px', marginLeft: 'auto' }}>✓ Selected</span>}
                              </div>
                              <div style={{ fontSize: '13px', color: COLORS.darkMuted }}>{a.address}</div>
                              <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '2px' }}>{a.city}{a.pincode ? ` — ${a.pincode}` : ''}</div>
                            </div>
                          </button>
                        );
                      })}
                      <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: COLORS.primary, fontWeight: 600, textDecoration: 'none', marginTop: '4px' }}>
                        <Plus size={12} /> Manage addresses in Profile
                      </Link>
                      {errors.address && <p style={{ color: COLORS.danger, fontSize: '12px', margin: '4px 0 0' }}>{errors.address}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Manual address entry — shown when no saved addresses OR addrMode=new */}
            <AnimatePresence mode="wait">
              {(addrMode === 'new' || !addrsLoaded || addresses.length === 0) && (
                <motion.div key="new-addr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Textarea label="Street Address *" placeholder="House no, street, landmark" value={form.address} onChange={update('address')} error={errors.address} style={{ minHeight: 80 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                    <Input label="City *" placeholder="Kolkata" value={form.city} onChange={update('city')} error={errors.city} />
                    <Input label="Pincode" placeholder="700001" value={form.pincode} onChange={update('pincode')} />
                  </div>
                  {/* Save address checkbox */}
                  {addrsLoaded && (
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                        <input type="checkbox" checked={saveNewAddr} onChange={e => setSaveNewAddr(e.target.checked)}
                          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: COLORS.primary }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: COLORS.dark }}>Save this address to my profile</span>
                      </label>
                      {saveNewAddr && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {(['Home', 'Work', 'Other'] as const).map(lbl => (
                            <button key={lbl} type="button" onClick={() => setNewAddrLabel(lbl)}
                              style={{ flex: 1, padding: '7px', borderRadius: '8px', border: `1.5px solid ${newAddrLabel === lbl ? COLORS.primary : COLORS.border}`, background: newAddrLabel === lbl ? COLORS.primaryLight : '#fff', color: newAddrLabel === lbl ? COLORS.primary : COLORS.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              {lbl === 'Home' ? '🏠' : lbl === 'Work' ? '💼' : '📍'} {lbl}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 3: Service ── */}
            <SectionHeader title="Service Details" step={3} />
            <Select label="Service Type *" value={form.serviceType} onChange={update('serviceType')} error={errors.serviceType} options={SERVICE_OPTIONS} />
            <div style={{ display: 'flex', gap: '12px' }} className="delivery-type-row">
              {/* Regular */}
              <button type="button" onClick={() => setForm(p => ({ ...p, deliveryType: 'regular' }))}
                style={{ flex: 1, padding: '14px 16px', borderRadius: '14px', border: `2px solid ${form.deliveryType === 'regular' ? COLORS.primary : COLORS.border}`, background: form.deliveryType === 'regular' ? COLORS.primaryLight : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>🕐</span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: form.deliveryType === 'regular' ? COLORS.primary : COLORS.dark }}>Regular</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '999px' }}>Free</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted, lineHeight: 1.5 }}>Standard pricing · 2–3 day turnaround</p>
              </button>
              {/* Express */}
              <button type="button" onClick={() => setForm(p => ({ ...p, deliveryType: 'express' }))}
                style={{ flex: 1, padding: '14px 16px', borderRadius: '14px', border: `2px solid ${form.deliveryType === 'express' ? '#F97316' : COLORS.border}`, background: form.deliveryType === 'express' ? '#FFF7ED' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>⚡</span>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: form.deliveryType === 'express' ? '#F97316' : COLORS.dark }}>Express</span>
                  <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, background: '#FFF7ED', color: '#F97316', padding: '2px 8px', borderRadius: '999px', border: '1px solid #FED7AA' }}>1.5×</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.muted, lineHeight: 1.5 }}>Priority processing · Same/next day</p>
              </button>
            </div>

            {/* ── Step 4: Schedule ── */}
            <SectionHeader title="Pickup Schedule" step={4} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <Input
                label="Pickup Date *" type="date"
                value={form.pickupDate} onChange={update('pickupDate')}
                error={errors.pickupDate}
                style={{ colorScheme: 'light' }}
                min={minDate.toISOString().split('T')[0]}
              />
              <Select
                label="Time Slot *"
                value={form.pickupTime} onChange={update('pickupTime')}
                error={errors.pickupTime}
                options={[{ value: '', label: 'Select time slot' }, ...TIME_SLOTS]}
              />
            </div>

            {/* Coupon */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: COLORS.dark }}>
                <Tag size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Coupon Code
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  value={form.couponCode}
                  onChange={e => { setForm(p => ({ ...p, couponCode: e.target.value.toUpperCase() })); setCouponStatus('idle'); }}
                  placeholder="WELCOME10"
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${couponStatus === 'valid' ? COLORS.success : couponStatus === 'invalid' ? COLORS.danger : COLORS.border}`, fontSize: '15px', fontFamily: 'inherit' }}
                />
                <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
              </div>
              {couponStatus === 'valid'   && <p style={{ color: COLORS.success, fontSize: '13px', marginTop: '4px' }}>✓ Coupon applied!</p>}
              {couponStatus === 'invalid' && <p style={{ color: COLORS.danger,  fontSize: '13px', marginTop: '4px' }}>✗ Invalid or expired coupon.</p>}
            </div>

            <Textarea label="Special Instructions" placeholder="Any special care instructions, fragile items, stain info..." value={form.notes} onChange={update('notes')} style={{ minHeight: 80 }} />

            {errors.notes && <p style={{ color: COLORS.danger, fontSize: '13px', margin: 0 }}>{errors.notes}</p>}

            <Button type="submit" size="lg" loading={loading} fullWidth>Confirm Pickup</Button>
          </motion.form>
        </div>
      </section>
      <style>{`
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .schedule-form-card { padding: 24px 16px !important; }
          .delivery-type-row { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .schedule-section { padding: 40px 12px 60px !important; }
        }
      `}</style>
    </Layout>
  );
}

function SectionHeader({ title, step }: { title: string; step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px' }}>
      <span style={{ width: 28, height: 28, borderRadius: '50%', background: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>
        {step}
      </span>
      <span style={{ fontWeight: 800, fontSize: '16px', color: COLORS.dark }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
    </div>
  );
}
