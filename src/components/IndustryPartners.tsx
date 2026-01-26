"use client";

import { motion } from 'framer-motion';
import { Globe, Database, Layers, Code, Users, Award, Repeat, CheckCircle } from 'lucide-react';
import styles from './IndustryPartners.module.css';

const partners = [
    { name: 'Google', icon: <Globe size={24} />, color: '#4285F4' },
    { name: 'Microsoft', icon: <Database size={24} />, color: '#00A4EF' },
    { name: 'Amazon', icon: <Layers size={24} />, color: '#FF9900' },
    { name: 'Netflix', icon: <Code size={24} />, color: '#E50914' },
    { name: 'Meta', icon: <Users size={24} />, color: '#0668E1' },
    { name: 'Tesla', icon: <Award size={24} />, color: '#E82127' },
    { name: 'Apple', icon: <Repeat size={24} />, color: '#555555' },
    { name: 'Adobe', icon: <CheckCircle size={24} />, color: '#FF0000' },
];

export default function IndustryPartners() {
    return (
        <section className={styles.partnersSection}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.sectionHeader}
                >
                    <h2 className={styles.title}>Our Hiring Networks</h2>
                    <p className={styles.subtitle}>Our alumni are driving innovation at the world's leading technology companies.</p>
                </motion.div>

                <div className={styles.marqueeContainer}>
                    <motion.div
                        className={styles.marqueeTrack}
                        animate={{ x: [0, "-50%"] }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
                            <div key={`${partner.name}-${idx}`} className={styles.partnerCard}>
                                <div className={styles.iconWrapper} style={{ color: partner.color }}>
                                    {partner.icon}
                                </div>
                                <span className={styles.partnerName}>{partner.name}</span>
                                <div className={styles.glow} style={{ backgroundColor: partner.color }} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
