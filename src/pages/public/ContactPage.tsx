import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Headphones } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/ui/SEO';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { COLORS, BRAND, WHATSAPP_URL } from '../../lib/constants';
import { supabase } from '../../lib/supabase';
import type { ContactForm } from '../../types';

const MAPS_URL = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL;

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

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

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#0F0C29 0%,#302B63 55%,#24243E 100%)', padding: '72px 24px 110px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', top: -80, right: -60, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -50, left: 40, pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)', color: '#C7D2FE', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
            <Headphones size={13} /> We respond within 2 hours
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Get In <span style={{ background: 'linear-gradient(90deg,#818CF8,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>
            Questions, feedback, or just want to say hello?<br />We're here to help every step of the way.
          </p>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ maxWidth: '900px', margin: '-44px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          {[
            { emoji: '⚡', label: 'Response Time', value: '< 2 Hours' },
            { emoji: '📞', label: 'Support Hours', value: '8 AM – 9 PM' },
            { emoji: '😊', label: 'Happy Customers', value: '1,000+' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.07 }}
              style={{ padding: '20px 14px', borderRight: i < 2 ? `1px solid ${COLORS.border}` : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '5px' }}>{s.emoji}</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: COLORS.primary, letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 600, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <section style={{ padding: '48px 24px 80px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start' }} className="contact-grid">

          {/* ── Left: Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignSelf: 'stretch' }}>

            {[
              { Icon: Phone,  label: 'PHONE',    value: BRAND.phone,   href: `tel:${BRAND.phone}`,          bg: '#EEF2FF', ic: COLORS.primary },
              { Icon: Mail,   label: 'EMAIL',    value: BRAND.email,   href: `mailto:${BRAND.email}`,       bg: '#FFF7ED', ic: '#F97316'     },
              { Icon: MapPin, label: 'LOCATION', value: BRAND.address, href: '#',                           bg: '#F0FDF4', ic: '#10B981'     },
              { Icon: Clock,  label: 'HOURS',    value: 'Mon–Sun, 8 AM – 9 PM', href: '#',                 bg: '#F5F3FF', ic: '#8B5CF6'     },
            ].map(({ Icon, label, value, href, bg, ic }) => (
              <motion.a key={label} href={href} whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 300 }}
                style={{ display: 'flex', gap: '14px', textDecoration: 'none', padding: '14px 18px', background: COLORS.background, borderRadius: '16px', border: `1px solid ${COLORS.border}`, alignItems: 'center' }}>
                <div style={{ width: 42, height: 42, background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={ic} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: COLORS.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                  <div style={{ fontSize: '14px', color: COLORS.dark, fontWeight: 700, marginTop: '1px' }}>{value}</div>
                </div>
              </motion.a>
            ))}

            {/* WhatsApp */}
            <motion.a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff', padding: '15px 20px', borderRadius: '16px', textDecoration: 'none', fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.42-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 0 1-4.95-1.355l-.355-.211-3.667.988.996-3.595-.232-.372A9.694 9.694 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>Chat on WhatsApp</div>
                <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>Fastest response guaranteed</div>
              </div>
            </motion.a>

            {/* Map — grows to fill remaining left-column height */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${COLORS.border}`, position: 'relative', height: '130px', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: '#fff', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, color: COLORS.dark, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} color={COLORS.primary} /> Open in Maps
              </div>
              <iframe
                src={MAPS_URL}
                width="100%"
                height="130"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="WashMate Location"
              />
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{ background: '#fff', borderRadius: '24px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
            {/* Card header */}
            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${COLORS.border}`, background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: '11px', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} color={COLORS.primary} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: COLORS.dark, margin: 0 }}>Send a Message</h2>
                <p style={{ fontSize: '12px', color: COLORS.muted, margin: 0 }}>We'll reply to your email within 2 hours</p>
              </div>
            </div>

            <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', border: '1.5px solid #A7F3D0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={32} color="#10B981" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: COLORS.dark, margin: '0 0 10px' }}>Message Sent! 🎉</h3>
                  <p style={{ color: COLORS.muted, fontSize: '14px', lineHeight: 1.7, margin: '0 0 24px' }}>
                    Thank you for reaching out.<br />We'll get back to you within 2 hours.
                  </p>
                  <button onClick={() => setSuccess(false)}
                    style={{ background: '#10B981', color: '#fff', border: 'none', padding: '11px 26px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '13px', fontFamily: 'inherit' }}>
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-grid">
                    <Input label="Your Name *" placeholder="Priya Sharma" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    <Input label="Email Address *" type="email" placeholder="priya@example.com" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-grid">
                    <Input label="Phone (optional)" type="tel" placeholder="+91 98765 43210" value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    <Select label="Subject" value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      options={[
                        { value: '', label: 'Select subject' },
                        { value: 'General Inquiry',  label: 'General Inquiry'  },
                        { value: 'Schedule Pickup',  label: 'Schedule Pickup'  },
                        { value: 'Order Issue',      label: 'Order Issue'      },
                        { value: 'Pricing Query',    label: 'Pricing Query'    },
                        { value: 'Feedback',         label: 'Feedback'         },
                        { value: 'Other',            label: 'Other'            },
                      ]}
                    />
                  </div>
                  <Textarea label="Message *" placeholder="Tell us how we can help you..." value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ flex: 1, minHeight: 130, resize: 'none' }} />

                  {error && (
                    <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: COLORS.danger, fontWeight: 600 }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: loading ? COLORS.muted : 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)', transition: 'all 0.2s' }}>
                    {loading
                      ? <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} /> Sending…</>
                      : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
