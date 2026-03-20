"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "What is your educational background?",
        options: [
            { label: "Non-IT (Mech, Civil, Commerce, etc.)", value: "non-it" },
            { label: "IT / CS / MCA Graduate", value: "it" },
            { label: "Currently in College (Any Branch)", value: "student" },
            { label: "Working Professional", value: "working" },
        ]
    },
    {
        id: 2,
        question: "What kind of work excites you more?",
        options: [
            { label: "Building apps & websites (Logic & Code)", value: "dev" },
            { label: "Working with data, numbers & insights", value: "data" },
            { label: "Protecting systems from hackers", value: "security" },
            { label: "AI, automation & future tech (no coding!)", value: "ai" },
        ]
    },
    {
        id: 3,
        question: "What is your biggest goal right now?",
        options: [
            { label: "Get my first IT job as fast as possible", value: "first-job" },
            { label: "Switch to a higher paying IT role", value: "switch" },
            { label: "Build my own startup / freelance", value: "startup" },
            { label: "Explore and figure out the right path", value: "explore" },
        ]
    }
];

// Maps answer combos to course recommendations
function getRecommendation(answers: string[]): { title: string; desc: string; link: string; emoji: string } {
    const interestAnswer = answers[1];
    if (interestAnswer === 'ai') return {
        title: 'AI Full Stack (Zero Coding)',
        desc: 'Perfect for you! Build AI-powered apps without writing code. The highest demand skill for the next decade.',
        link: '/brochure/ai-full-stack',
        emoji: '🤖'
    };
    if (interestAnswer === 'security') return {
        title: 'Cyber Security & Ethical Hacking',
        desc: 'Protect companies from hackers. One of the fastest-growing and highest-paying IT careers.',
        link: '/brochure/cyber-security',
        emoji: '🛡️'
    };
    if (interestAnswer === 'data') return {
        title: 'Python with Data Analytics',
        desc: 'The easiest entry into IT through data. Master Python, SQL, and BI tools to become a Data Analyst.',
        link: '/brochure/python-data-analytics',
        emoji: '📊'
    };
    // dev
    const bgAnswer = answers[0];
    if (bgAnswer === 'non-it' || bgAnswer === 'student') return {
        title: 'Python Full Stack',
        desc: 'The most beginner-friendly way to build websites. Start from scratch, land your first IT job.',
        link: '/brochure/python-full-stack',
        emoji: '🐍'
    };
    return {
        title: 'Java Full Stack Mastery',
        desc: 'The most in-demand skill in IT. Top salaries and maximum job opportunities await you.',
        link: '/brochure/java-full-stack',
        emoji: '☕'
    };
}

export default function CareerQuiz() {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<ReturnType<typeof getRecommendation> | null>(null);

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers, value];
        if (currentQ < QUESTIONS.length - 1) {
            setAnswers(newAnswers);
            setCurrentQ(currentQ + 1);
        } else {
            setAnswers(newAnswers);
            setResult(getRecommendation(newAnswers));
        }
    };

    const reset = () => {
        setCurrentQ(0);
        setAnswers([]);
        setResult(null);
    };

    const progress = result ? 100 : Math.round((currentQ / QUESTIONS.length) * 100);

    return (
        <section style={{ padding: '5rem 0', background: 'rgba(124, 58, 237, 0.04)', borderTop: '1px solid rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '2.5rem' }}
                >
                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '1px' }}>
                        🎯 FIND YOUR PATH IN 60 SECONDS
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
                        Which Career is Right for Me?
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
                        Confused between too many options? Answer 3 quick questions and we'll tell you exactly what to study.
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <div style={{ background: 'rgba(124,58,237,0.1)', borderRadius: '100px', height: '6px', marginBottom: '2rem' }}>
                    <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #10b981)', borderRadius: '100px' }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key={currentQ}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            style={{ background: 'var(--bg-panel)', borderRadius: '20px', padding: '2rem', border: '1px solid rgba(124,58,237,0.15)' }}
                        >
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 600 }}>
                                Question {currentQ + 1} of {QUESTIONS.length}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.4 }}>
                                {QUESTIONS[currentQ].question}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {QUESTIONS[currentQ].options.map((opt) => (
                                    <motion.button
                                        key={opt.value}
                                        whileHover={{ scale: 1.01, borderColor: '#7c3aed' }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => handleAnswer(opt.value)}
                                        style={{
                                            textAlign: 'left',
                                            background: 'transparent',
                                            border: '1px solid rgba(124,58,237,0.25)',
                                            borderRadius: '12px',
                                            padding: '1rem 1.25rem',
                                            color: 'inherit',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: 500,
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {opt.label}
                                        <ArrowRight size={16} style={{ opacity: 0.4, flexShrink: 0 }} />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            style={{ background: 'var(--bg-panel)', borderRadius: '20px', padding: '2.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{result.emoji}</div>
                            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                                ✅ YOUR BEST FIT COURSE
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                                {result.title}
                            </h3>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.6 }}>
                                {result.desc}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link
                                    href={result.link}
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        color: '#fff',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    View Full Syllabus <ArrowRight size={16} />
                                </Link>
                                <button
                                    onClick={reset}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(124,58,237,0.3)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1.5rem',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <RotateCcw size={14} /> Retake Quiz
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
