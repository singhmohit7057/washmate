import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input, Textarea, Select } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { COLORS, BRAND, WHATSAPP_URL } from '../../lib/constants';
import { supabase } from '../../lib/supabase';
import type { ContactForm } from '../../types';

const MAPS_URL = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL;

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setError('');
    try {
      const { error: dbErr } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || 'General Inquiry',
        message: form.message,
        is_read: false,
      });
      if (dbErr) throw dbErr;
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Something went wrong. Please try WhatsApp or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact Us | WashMate"
        description="Get in touch with WashMate. Call, email, or chat on WhatsApp for laundry pickup and dry cleaning queries in Kolkata."
      />

      <section style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, #F5F0FF 100%)`, padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-1px' }}>
              Get In <span style={{ color: COLORS.primary }}>Touch</span>
            </h1>
            <p style={{ fontSize: '18px', color: COLORS.muted, lineHeight: 1.7 }}>
              Questions, feedback, or just want to say hello? We respond within 2 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px' }} className="contact-grid">
          {/* Info */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.dark, marginBottom: '24px' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {[
                { Icon: Phone, label: 'Phone', value: BRAND.phone, href: `tel:${BRAND.phone}` },
                { Icon: Mail, label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
                { Icon: MapPin, label: 'Location', value: BRAND.address, href: '#' },
              ].map(({ Icon, label, value, href }) => (
                <a key={label} href={href} style={{ display: 'flex', gap: '14px', textDecoration: 'none', padding: '16px 20px', background: COLORS.background, borderRadius: '14px', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ width: 44, height: 44, background: COLORS.primaryLight, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={COLORS.primary} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontSize: '15px', color: COLORS.dark, fontWeight: 600, marginTop: '2px' }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#25D366', color: '#fff', padding: '16px 24px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', marginBottom: '32px' }}
            >
              <MessageCircle size={20} />
              Chat on WhatsApp — Fastest Response
            </a>

            {/* Map */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${COLORS.border}`, height: 220 }}>
              <iframe
                src={MAPS_URL}
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="WashMate Location"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ background: '#D1FAE5', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '2px solid #6EE7B7' }}
              >
                <CheckCircle size={48} color={COLORS.success} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.dark, marginBottom: '12px' }}>Message Sent!</h3>
                <p style={{ color: COLORS.darkMuted, fontSize: '15px', lineHeight: 1.6 }}>
                  Thank you for reaching out. We'll get back to you within 2 hours.
                </p>
                <button onClick={() => setSuccess(false)} style={{ marginTop: '20px', background: COLORS.success, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Send a Message</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                  <Input
                    label="Your Name *"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-grid">
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  />
                  <Select
                    label="Subject"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    options={[
                      { value: '', label: 'Select subject' },
                      { value: 'General Inquiry', label: 'General Inquiry' },
                      { value: 'Schedule Pickup', label: 'Schedule Pickup' },
                      { value: 'Order Issue', label: 'Order Issue' },
                      { value: 'Pricing Query', label: 'Pricing Query' },
                      { value: 'Feedback', label: 'Feedback' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
                </div>
                <Textarea
                  label="Message *"
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  style={{ minHeight: 140 }}
                />
                {error && <p style={{ color: COLORS.danger, fontSize: '14px', margin: 0 }}>{error}</p>}
                <Button type="submit" size="lg" loading={loading} icon={<Send size={18} />} iconPosition="right">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
