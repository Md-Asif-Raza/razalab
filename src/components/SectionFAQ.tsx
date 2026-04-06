'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFaqs } from '@/lib/actions';

const FALLBACK_FAQS = [
  { id: '1', question: 'What exactly does Raza Labs build for my brand?', answer: 'We deploy a full content distribution system — a vetted network of clippers, quality review pipelines, and automated infrastructure. You provide long-form content, we turn it into hundreds of viral clips distributed across all major platforms.' },
  { id: '2', question: 'Who gets the best results from this?', answer: 'Brands and creators producing regular long-form content (podcasts, courses, talks) who want to scale organic reach without high ad spend. Our top-performing clients already have content — they just need distribution at scale.' },
  { id: '3', question: 'How does a campaign actually run?', answer: 'We onboard your brand, clippers join your campaign and post to their own accounts — giving you organic reach through real accounts. Every submission is quality-reviewed. You only pay for performance.' },
  { id: '4', question: 'What does it cost compared to paid ads?', answer: 'Our effective CPM is often 10-20x lower than paid ads. You build organic authority while reaching millions for a fraction of the budget of traditional media buying.' },
  { id: '5', question: 'What do I need to get started?', answer: 'Your long-form content (Google Drive or similar), brand guidelines, and a strategy call. We handle recruitment, quality review, and distribution. Most brands launch in under 5 days.' },
  { id: '6', question: 'How fast will I see results?', answer: 'Most clients see viral clips within 7 days. Average campaigns reach 1M+ views in the first month. We provide real-time dashboards so you can track performance daily.' },
];

export default function SectionFAQ() {
  const [faqs, setFaqs] = useState<{ id: string; question: string; answer: string }[]>(FALLBACK_FAQS);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    getFaqs().then(data => { if (data && data.length > 0) setFaqs(data); }).catch(() => {});
  }, []);

  return (
    <section id="faq" style={{ padding: '80px 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
          <h2 className="section-title reveal-up">FAQ</h2>
        </div>

        <div className="reveal-up">
          {faqs.map((faq) => (
            <div key={faq.id} className="accordion-item" style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', 
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                style={{ 
                  width: '100%', 
                  padding: '24px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'none', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{faq.question}</span>
                <motion.span animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </motion.span>
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ padding: '0 24px 24px 24px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
