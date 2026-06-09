import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const testimonials = [
  { id: 1, name: 'Priya Sharma',      location: 'Kolkata, WB',     rating: 5, review: "WashMate has completely changed how I manage laundry. The pickup is always on time and my sarees come back perfectly pressed. Absolutely love the service!", avatar: 'PS', color: COLORS.primary },
  { id: 2, name: 'Rahul Bose',        location: 'Barrackpore, WB', rating: 5, review: "I've tried many laundry services but WashMate is a cut above. The dry cleaning is exceptional — my suits look brand new every time. Highly recommended!", avatar: 'RB', color: '#8B5CF6' },
  { id: 3, name: 'Ananya Das',        location: 'Kalyani, WB',     rating: 5, review: "Quick, reliable, and affordable. The tracking feature is great — I always know where my order is. Seamless experience from start to finish.", avatar: 'AD', color: '#F59E0B' },
  { id: 4, name: 'Subir Ghosh',       location: 'Naihati, WB',     rating: 5, review: "The blanket cleaning service is worth every rupee. Three large blankets came back perfectly clean and fluffy. WhatsApp support is also very responsive.", avatar: 'SG', color: '#10B981' },
  { id: 5, name: 'Meena Chatterjee',  location: 'Titagarh, WB',    rating: 5, review: "I ordered shoe cleaning and was amazed by the results. My old sneakers look almost new! The free delivery is a huge bonus. Will definitely keep using.", avatar: 'MC', color: '#EF4444' },
  { id: 6, name: 'Amit Roy',          location: 'Kankinara, WB',   rating: 5, review: "Running a small office, I use WashMate for all formal wear. The express option is a lifesaver before important meetings. Professional quality every time.", avatar: 'AR', color: '#06B6D4' },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const perPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  useEffect(() => { setCurrent(0); }, [perPage]);

  const next = useCallback(() => { setDirection(1); setCurrent(p => (p + 1) % totalPages); }, [totalPages]);
  const prev = () => { setDirection(-1); setCurrent(p => (p - 1 + totalPages) % totalPages); };

  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  const visible = testimonials.slice(current * perPage, current * perPage + perPage);

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#fff' }} className="testimonials-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-block', background: '#FFFBEB', color: '#D97706', padding: '5px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Customer Love
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: COLORS.dark, margin: '0 0 12px', letterSpacing: '-0.5px' }}>What Our Customers Say</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={17} fill="#F59E0B" color="#F59E0B" />)}
            <span style={{ color: COLORS.muted, fontSize: '14px', marginLeft: '6px', fontWeight: 600 }}>4.9/5 from 500+ reviews</span>
          </div>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction}
              initial={{ opacity: 0, x: direction * 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: `repeat(${perPage},1fr)`, gap: '20px' }}>
              {visible.map(t => (
                <div key={t.id} style={{ background: '#FAFAFA', border: `1px solid ${COLORS.border}`, borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                  {/* Quote watermark */}
                  <Quote size={48} color={t.color} style={{ position: 'absolute', top: 16, right: 16, opacity: 0.06 }} />
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  <p style={{ color: COLORS.darkMuted, fontSize: '14px', lineHeight: 1.75, margin: 0, flex: 1 }}>"{t.review}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px', paddingTop: '4px', borderTop: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${t.color}18`, border: `2px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', color: t.color, flexShrink: 0 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: COLORS.dark, fontSize: '14px' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.muted }}>{t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '32px' }}>
            <button onClick={prev} style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: `1px solid ${COLORS.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.dark, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <ChevronLeft size={17} />
            </button>
            <div style={{ display: 'flex', gap: '7px' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  style={{ width: i === current ? 22 : 7, height: 7, borderRadius: '999px', background: i === current ? COLORS.primary : COLORS.border, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
            <button onClick={next} style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: `1px solid ${COLORS.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.dark, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .testimonials-section { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
}
