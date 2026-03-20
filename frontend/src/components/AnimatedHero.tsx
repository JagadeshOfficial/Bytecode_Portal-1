"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Code, Database, Server, Layers, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './AnimatedHero.module.css';

const COURSES = [
    { name: "Full Stack Java", color: "#6366f1", icon: <Code size={24} /> },
    { name: "Python Full Stack", color: "#8b5cf6", icon: <Layers size={24} /> },
    { name: "Data Science", color: "#06b6d4", icon: <Cpu size={24} /> },
    { name: "Cloud & DevOps", color: "#10b981", icon: <Server size={24} /> },
    { name: "Data Analytics", color: "#f59e0b", icon: <Database size={24} /> },
];

export default function AnimatedHero() {
    const [idx, setIdx] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Magnetic Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), { stiffness: 100, damping: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setIdx((p) => (p + 1) % COURSES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const course = COURSES[idx];

    return (
        <section className={styles.heroSection} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* Visual Layers */}
            <div className={styles.particles} />
            <div className={styles.scanLine} />
            <div className={styles.lightBeam} />
            <div className={styles.glowCircle} />

            <div className={styles.container}>

                <motion.div
                    initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.textContent}
                >

                    <h1 className={styles.srOnly}>Best Software Training Institute in Hyderabad - Bytecode Trainings</h1>
                    <h2 className={styles.mainTitle}>
                        Your IT Dream Job <br />
                        <span className={styles.gradientText}>is Closer Than You Think</span>
                    </h2>

                    <p className={styles.subtitle}>
                        No coding background? No problem. We train fresh graduates from scratch, guiding you step-by-step to secure a high-paying software career.
                    </p>

                    <div className={styles.compactList}>
                        {COURSES.map((c, i) => (
                            <motion.div
                                key={c.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className={styles.listItem}
                            >
                                {c.name.toUpperCase()}
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ marginTop: '48px' }}>
                        <Link href="/courses" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: '#6366f1',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            textDecoration: 'none',
                            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                        }}>
                            START YOUR IT CAREER <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>

                <div className={styles.visualFrame}>
                    <motion.div
                        ref={cardRef}
                        key={course.name}
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className={styles.floatingCard}
                    >
                        <div className={styles.cardLeft} style={{ transform: 'translateZ(50px)' }}>
                            <motion.div
                                className={styles.cardIcon}
                                animate={{
                                    boxShadow: [`0 0 20px ${course.color}20`, `0 0 40px ${course.color}60`, `0 0 20px ${course.color}20`]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {course.icon}
                            </motion.div>
                            <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '950', letterSpacing: '2px' }}>LIVE</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', transform: 'translateZ(30px)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '900', letterSpacing: '2px' }}>BEGINNER FRIENDLY</div>

                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={course.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: '2.5rem', color: 'var(--text-bright)', fontWeight: '900', lineHeight: 0.9, letterSpacing: '-1px' }}
                                >
                                    {course.name.toUpperCase()}
                                </motion.h2>
                            </AnimatePresence>

                            <div style={{ marginTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '10px', fontWeight: '800' }}>
                                    <span>Industry Demand</span>
                                    <span style={{ color: course.color }}>{85 + idx * 3}%</span>
                                </div>
                                <div className={styles.cardProgress}>
                                    <motion.div
                                        className={styles.cardFill}
                                        animate={{ width: `${85 + idx * 3}%`, backgroundColor: course.color }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                <div className={styles.pulseDot} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase' }}>100% Placement Support</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
