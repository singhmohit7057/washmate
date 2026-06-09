import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { COLORS, FAQS } from '../../lib/constants';

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} style={{ padding: '96px 24px', background: '#fff' }} id="faq" className="faq-section">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{ display: 'inline-block', background: COLORS.primaryLight, color: COLORS.primary, padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: COLORS.dark, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '17px', color: COLORS.muted, lineHeight: 1.6 }}>
            Got questions? We've got answers.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              style={{ border: `1.5px solid ${openIndex === i ? COLORS.primary : COLORS.border}`, borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: openIndex === i ? `0 4px 16px ${COLORS.primary}15` : 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
                aria-expanded={openIndex === i}
              >
                <span style={{ fontSize: '16px', fontWeight: 700, color: COLORS.dark, flex: 1 }}>{faq.question}</span>
                <span style={{ width: 32, height: 32, borderRadius: '8px', background: openIndex === i ? COLORS.primary : COLORS.background, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                  {openIndex === i ? <Minus size={16} color="#fff" /> : <Plus size={16} color={COLORS.muted} />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 24px 20px', fontSize: '15px', color: COLORS.darkMuted, lineHeight: 1.7 }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .faq-section { padding: 60px 16px !important; }
        }
      `}</style>
    </section>
  );
}
