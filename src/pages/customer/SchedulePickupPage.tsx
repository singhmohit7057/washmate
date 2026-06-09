import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Tag } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input, Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { COLORS } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { SchedulePickupForm } from '../../types';

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

export default function SchedulePickupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<SchedulePickupForm>({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    address: '',
    city: '',
    pincode: '',
    serviceType: '',
    pickupDate: '',
    pickupTime: '',
    deliveryType: 'regular',
    couponCode: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SchedulePickupForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const update = (field: keyof SchedulePickupForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof SchedulePickupForm, string>> = {};
    if (!form.fullName) errs.fullName = 'Name is required';
    if (!form.phone) errs.phone = 'Phone is required';
    if (!form.address) errs.address = 'Address is required';
    if (!form.city) errs.city = 'City is required';
    if (!form.serviceType) errs.serviceType = 'Please select a service';
    if (!form.pickupDate) errs.pickupDate = 'Please select a date';
    if (!form.pickupTime) errs.pickupTime = 'Please select a time slot';
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
        delivery_address: `${form.address}, ${form.city}, ${form.pincode}`,
        notes: form.notes || null,
        subtotal: 0,
        discount: 0,
        total: 0,
        coupon_code: form.couponCode || null,
      });
      if (error) throw error;
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
            <p style={{ fontSize: '15px', color: COLORS.muted, marginBottom: '32px' }}>
              Our agent will arrive on <strong>{form.pickupDate}</strong> during <strong>{form.pickupTime}</strong>.
            </p>
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
            {/* Section: Personal */}
            <SectionHeader title="Your Details" step={1} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <Input label="Full Name *" placeholder="Priya Sharma" value={form.fullName} onChange={update('fullName')} error={errors.fullName} />
              <Input label="Phone Number *" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update('phone')} error={errors.phone} />
            </div>

            {/* Section: Address */}
            <SectionHeader title="Pickup Address" step={2} />
            <Textarea label="Street Address *" placeholder="House no, street, landmark" value={form.address} onChange={update('address')} error={errors.address} style={{ minHeight: 80 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <Input label="City *" placeholder="Kolkata" value={form.city} onChange={update('city')} error={errors.city} />
              <Input label="Pincode" placeholder="700001" value={form.pincode} onChange={update('pincode')} />
            </div>

            {/* Section: Service */}
            <SectionHeader title="Service Details" step={3} />
            <Select label="Service Type *" value={form.serviceType} onChange={update('serviceType')} error={errors.serviceType} options={SERVICE_OPTIONS} />
            <div style={{ display: 'flex', gap: '12px' }} className="delivery-type-row">
              {(['regular', 'express'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, deliveryType: type }))}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `2px solid ${form.deliveryType === type ? COLORS.primary : COLORS.border}`, background: form.deliveryType === type ? COLORS.primaryLight : '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: form.deliveryType === type ? COLORS.primary : COLORS.muted, textTransform: 'capitalize', fontFamily: 'inherit' }}
                >
                  {type === 'express' ? '⚡ Express (1.5×)' : '🕐 Regular (Free)'}
                </button>
              ))}
            </div>

            {/* Section: Schedule */}
            <SectionHeader title="Pickup Schedule" step={4} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
              <Input
                label="Pickup Date *"
                type="date"
                value={form.pickupDate}
                onChange={update('pickupDate')}
                error={errors.pickupDate}
                style={{ colorScheme: 'light' }}
                min={minDate.toISOString().split('T')[0]}
              />
              <Select
                label="Time Slot *"
                value={form.pickupTime}
                onChange={update('pickupTime')}
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
              {couponStatus === 'valid' && <p style={{ color: COLORS.success, fontSize: '13px', marginTop: '4px' }}>✓ Coupon applied!</p>}
              {couponStatus === 'invalid' && <p style={{ color: COLORS.danger, fontSize: '13px', marginTop: '4px' }}>✗ Invalid or expired coupon.</p>}
            </div>

            <Textarea label="Special Instructions" placeholder="Any special care instructions, fragile items, stain info..." value={form.notes} onChange={update('notes')} style={{ minHeight: 80 }} />

            {errors.notes && <p style={{ color: COLORS.danger, fontSize: '13px', margin: 0 }}>{errors.notes}</p>}

            <Button type="submit" size="lg" loading={loading} fullWidth>
              Confirm Pickup
            </Button>
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
