import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS } from '../../lib/constants';

const testimonials = [
  { id: 1, name: 'Priya Sharma', location: 'Kolkata, WB', rating: 5, review: "WashMate has completely changed how I manage laundry. The pickup is always on time and my sarees come back perfectly pressed. Absolutely love the service!", avatar: 'PS' },
  { id: 2, name: 'Rahul Bose', location: 'Barrackpore, WB', rating: 5, review: "I've tried many laundry services but WashMate is a cut above. The dry cleaning is exceptional — my suits look brand new every time. Highly recommended!", avatar: 'RB' },
  { id: 3, name: 'Ananya Das', location: 'Kalyani, WB', rating: 5, review: "Quick, reliable, and affordable. I scheduled my first pickup and the experience was seamless. The tracking feature is great — I always know where my order is.", avatar: 'AD' },
  { id: 4, name: 'Subir Ghosh', location: 'Naihati, WB', rating: 5, review: "The blanket cleaning service is worth every rupee. Three large blankets came back perfectly clean and fluffy. The WhatsApp support is also very responsive.", avatar: 'SG' },
  { id: 5, name: 'Meena Chatterjee', location: 'Titagarh, WB', rating: 5, review: "I ordered shoe cleaning and was amazed by the results. My old sneakers look almost new! The free delivery is a huge bonus. Will definitely keep using WashMate.", avatar: 'MC' },
  { id: 6, name: 'Amit Roy', location: 'Kankinara, WB', rating: 5, review: "Running a small office, I use WashMate for all formal wear. The express delivery option is a lifesaver before important meetings. Professional quality every time.", avatar: 'AR' },
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

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(p => (p + 1) % totalPages);
  }, [totalPages]);

  // Reset page when perPage changes (on resize)
  useEffect(() => { setCurrent(0); }, [perPage]);

  const prev = () => {
    setDirection(-1);
    setCurrent(p => (p - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const visible = testimonials.slice(current * perPage, current * perPage + perPage);

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: `linear-gradient(135deg, ${COLORS.dark} 0%, #1a1a2e 100%)` }} className="testimonials-section">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{ display: 'inline-block', background: `${COLORS.primary}30`, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Love
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            What Our Customers Say
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#FFD60A" color="#FFD60A" />)}
            <span style={{ color: '#9CA3AF', fontSize: '15px', marginLeft: '8px' }}>4.9/5 from 500+ reviews</span>
          </div>
        </motion.div>

        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}
            >
              {visible.map(t => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
            <button onClick={prev} style={{ width: 44, height: 44, borderRadius: '50%', background: '#1F2937', border: '1px solid #374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  style={{ width: i === current ? 24 : 8, height: 8, borderRadius: '999px', background: i === current ? COLORS.primary : '#374151', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                />
              ))}
            </div>
            <button onClick={next} style={{ width: 44, height: 44, borderRadius: '50%', background: '#1F2937', border: '1px solid #374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ChevronRight size={18} />
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

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  const colors = ['#007AFF', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];
  const bg = colors[testimonial.id % colors.length];

  return (
    <div style={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={16} fill="#FFD60A" color="#FFD60A" />
        ))}
      </div>
      <p style={{ color: '#D1D5DB', fontSize: '15px', lineHeight: 1.7, margin: 0, flex: 1 }}>"{testimonial.review}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${bg}30`, border: `2px solid ${bg}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: bg, flexShrink: 0 }}>
          {testimonial.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>{testimonial.name}</div>
          <div style={{ fontSize: '13px', color: '#6B7280' }}>{testimonial.location}</div>
        </div>
      </div>
    </div>
  );
}
