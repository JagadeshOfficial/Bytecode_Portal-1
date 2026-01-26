"use client";

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Award, Building2, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './AnimatedHero.module.css';

function MagneticWrapper({ children, sensitivity = 1 }: { children: React.ReactNode, sensitivity?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 200 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * sensitivity);
        y.set((clientY - centerY) * sensitivity);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
}

export default function AnimatedHero() {
    return (
        <div className={styles.heroSection}>
            {/* Dynamic Background */}
            <div className={styles.glowContainer}>
                <div className={`${styles.glow} ${styles.glowPurple}`} />
                <div className={`${styles.glow} ${styles.glowCyan}`} />
            </div>

            <div className={styles.container}>

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.textContent}
                >
                    <div className={styles.badge}>
                        <span className={styles.badgeDot}></span>
                        <span className={styles.badgeText}>Admissions Open: Feb 2026</span>
                    </div>

                    <h1 className={styles.mainTitle}>
                        Launch Your <br />
                        <span className={styles.gradientText}>
                            Tech Career
                        </span>
                    </h1>

                    <p className={styles.subtitle}>
                        The only platform that bridges the gap between academic learning and industry demands. Master Full Stack, AI, and Cloud with live mentorship.
                    </p>

                    <div className={styles.ctaGroup}>
                        <MagneticWrapper sensitivity={0.5}>
                            <Link href="/courses">
                                <motion.button
                                    className={styles.primaryCta}
                                    whileHover="hover"
                                    initial="initial"
                                >
                                    <span className={styles.ctaText}>Start Learning</span>
                                    <motion.div
                                        className={styles.ctaArrow}
                                        variants={{
                                            initial: { x: 0 },
                                            hover: { x: 5 }
                                        }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.div>
                                    <motion.div
                                        className={styles.shine}
                                        variants={{
                                            initial: { x: '-100%' },
                                            hover: { x: '100%' }
                                        }}
                                        transition={{ duration: 0.6 }}
                                    />
                                </motion.button>
                            </Link>
                        </MagneticWrapper>

                        <MagneticWrapper sensitivity={0.5}>
                            <Link href="/student">
                                <motion.button
                                    className={styles.secondaryCta}
                                    style={{ perspective: 1000 }}
                                    whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                                >
                                    <span className={styles.portalText}>Student Portal</span>
                                    <div className={styles.portalGlow} />
                                </motion.button>
                            </Link>
                        </MagneticWrapper>
                    </div>

                </motion.div>

                {/* Right Visual - The "Success Ecosystem" */}
                <div className={styles.visualContainer}>
                    {/* Main Dashboard Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateY: 15, rotateX: 5 }}
                        animate={{ opacity: 1, rotateY: -5, rotateX: 5 }}
                        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        className={styles.dashboardCard}
                    >
                        {/* Mock Header */}
                        <div className={styles.cardHeader}>
                            <div className={`${styles.dot}`} style={{ background: '#ef4444' }} />
                            <div className={`${styles.dot}`} style={{ background: '#eab308' }} />
                            <div className={`${styles.dot}`} style={{ background: '#22c55e' }} />
                        </div>
                        {/* Mock Content */}
                        <div className={styles.cardBody}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Current Course</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Full Stack Java Dev</div>
                                </div>
                                <div style={{ padding: '0.5rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', color: '#22d3ee' }}>
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#cbd5e1' }}>Progress</span>
                                    <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>75%</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}
                                    />
                                </div>
                            </div>
                            {/* Grid Items */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assignments</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>12/15</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Attendance</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ade80' }}>92%</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Offer Letter Card */}
                    <motion.div
                        animate={{ y: [-15, 15, -15] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className={styles.floatCard}
                        style={{ top: '10%', right: '-5%' }}
                    >
                        <div className={styles.iconBox} style={{ background: '#ffedd5', color: '#c2410c' }}>
                            <Building2 size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Placement Offer</div>
                            <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Amazon</div>
                            <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600' }}>Package: 24 LPA</div>
                        </div>
                    </motion.div>

                    {/* Floating Certificate Card */}
                    <motion.div
                        animate={{ y: [15, -15, 15] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className={styles.floatCardDark}
                        style={{ bottom: '15%', left: '-10%' }}
                    >
                        <div className={styles.iconBox} style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                            <Award size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#e9d5ff', textTransform: 'uppercase' }}>Certified</div>
                            <div style={{ fontWeight: 'bold', color: 'white' }}>Java Master</div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
