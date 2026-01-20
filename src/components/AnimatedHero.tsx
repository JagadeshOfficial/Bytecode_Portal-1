"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import styles from './AnimatedHero.module.css';

export default function AnimatedHero() {
    return (
        <div className={styles.hero}>
            {/* Background Gradients */}
            <div className={styles.backgroundGlow}>
                <div className={`${styles.glowBlob} ${styles.blob1}`} />
                <div className={`${styles.glowBlob} ${styles.blob2}`} />
            </div>

            <div className={`container ${styles.grid}`}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className={styles.badge}>
                        <Sparkles size={16} color="gold" />
                        <span>New Batches Starting Soon</span>
                    </div>

                    <h1 className={styles.title}>
                        Master the <span className={styles.highlight}>Future</span> of Tech
                    </h1>

                    <p className={styles.description}>
                        Byte Code Trainings offers an immersive learning ecosystem. From full-stack mastery to cloud architecture, we build the developers of tomorrow.
                    </p>

                    <div className={styles.buttonGroup}>
                        <Link href="/courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.primaryBtn}
                            >
                                Explore Courses <ArrowRight size={20} />
                            </motion.button>
                        </Link>

                        <Link href="/student">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.secondaryBtn}
                            >
                                Student Portal
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.visuals}
                >
                    {/* Abstract 3D Representation */}
                    <div className={styles.glassStack} style={{ transform: 'rotate(6deg)' }} />
                    <div className={styles.glassStack} style={{ transform: 'rotate(-3deg) scale(0.95)', background: 'rgba(0,0,0,0.2)' }} />

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={styles.cardFloat}
                        style={{ top: '20%', right: '10%' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#34d399', fontWeight: 'bold' }}>98%</div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Placement Rate</div>
                                <div style={{ fontWeight: 'bold', color: 'white' }}>Top Tier</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className={styles.cardFloat}
                        style={{ bottom: '20%', left: '10%' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#60a5fa', fontWeight: 'bold' }}>50+</div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hiring Partners</div>
                                <div style={{ fontWeight: 'bold', color: 'white' }}>Global MNCs</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
