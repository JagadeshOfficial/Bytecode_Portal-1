"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
    {
        q: "I have no coding background — can I still join?",
        a: "Absolutely! Our programs are designed from the ground up for complete beginners. We start from zero and take you step-by-step. Many of our successful placed students had no prior coding experience when they joined.",
    },
    {
        q: "What if I don't get a job after the course?",
        a: "We offer a 100% Job Guarantee on select programs (Python Full Stack, AI Full Stack, and Python Data Analytics). If you complete the program, clear all assessments, and don't get placed — we refund your fees. No questions asked.",
    },
    {
        q: "Is EMI or installment payment available?",
        a: "Yes! We offer flexible EMI options starting from as low as ₹3,000/month. We also provide scholarships for meritorious students. Speak to our counsellor to find the best plan for you.",
    },
    {
        q: "How long are the courses? Are they online or offline?",
        a: "Course duration ranges from 3 to 6 months depending on the program. We offer both live online classes and offline sessions at our Hyderabad center — you can choose what works best for you.",
    },
    {
        q: "What is the average salary after placement?",
        a: "Our placed students earn an average starting salary of ₹4–8 LPA. Many of our top performers have been placed at ₹10–15 LPA. Actual salary depends on the course, your performance, and the company.",
    },
    {
        q: "How is this different from YouTube tutorials or other institutes?",
        a: "Unlike YouTube, we provide structured mentorship, real industry projects, mock interviews, resume building, and a dedicated placement team that actively connects you with hiring companies. We don't just teach — we get you placed.",
    },
];

export default function FAQSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <section style={{
            padding: '5rem 0',
            background: 'var(--bg-subtle)',
            borderTop: 'var(--border-faint)',
        }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(124,58,237,0.08)', color: 'var(--primary)',
                        padding: '6px 16px', borderRadius: '100px',
                        fontSize: '0.78rem', fontWeight: 800, letterSpacing: '1px',
                        textTransform: 'uppercase', marginBottom: '1rem',
                        border: '1px solid rgba(124,58,237,0.15)',
                    }}>
                        <HelpCircle size={13} /> Common Questions
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                        fontWeight: 800, color: 'var(--text-bright)',
                        fontFamily: "'Rajdhani', sans-serif", margin: 0,
                        lineHeight: 1.2,
                    }}>
                        Got Questions? We Have Answers.
                    </h2>
                    <p style={{
                        color: 'var(--text-dim)', marginTop: '0.75rem',
                        fontSize: '1rem', maxWidth: '500px', margin: '0.75rem auto 0',
                    }}>
                        Everything you need to know before taking the leap into your IT career.
                    </p>
                </div>

                {/* Accordion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {FAQS.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={false}
                            style={{
                                background: 'var(--bg-panel)',
                                border: openIdx === idx ? '1px solid rgba(124,58,237,0.3)' : 'var(--border-faint)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: openIdx === idx ? '0 4px 20px rgba(124,58,237,0.08)' : 'none',
                                transition: 'box-shadow 0.3s, border-color 0.3s',
                            }}
                        >
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                style={{
                                    width: '100%', padding: '1.25rem 1.5rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: 'none', border: 'none',
                                    color: 'var(--text-bright)', cursor: 'pointer',
                                    textAlign: 'left', gap: '1rem',
                                }}
                            >
                                <span style={{
                                    fontWeight: 700, fontSize: '1rem',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    lineHeight: 1.4,
                                }}>
                                    {faq.q}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIdx === idx ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    style={{ flexShrink: 0, color: 'var(--primary)' }}
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {openIdx === idx && (
                                    <motion.div
                                        key="answer"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <div style={{
                                            padding: '0 1.5rem 1.25rem',
                                            color: 'var(--text-dim)',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.7,
                                            borderTop: 'var(--border-faint)',
                                            paddingTop: '1rem',
                                        }}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA below FAQ */}
                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>
                        Still have questions? Talk to a career expert — it's free!
                    </p>
                    <a
                        href="tel:+918309879187"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'var(--primary)', color: 'white',
                            padding: '0.75rem 2rem', borderRadius: '12px',
                            fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
                            boxShadow: '0 8px 24px rgba(124,58,237,0.25)',
                        }}
                    >
                        📞 Call +91 83098 79187
                    </a>
                </div>
            </div>
        </section>
    );
}
