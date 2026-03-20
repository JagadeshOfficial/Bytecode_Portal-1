"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Database, Server, Share2, Cookie, RefreshCw, Mail, Phone, MapPin, ExternalLink, Activity } from 'lucide-react';
import styles from './privacy.module.css';
import Link from 'next/link';

export default function PrivacyPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <main className={styles.main}>
            <Navbar />

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className="container">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.div variants={fadeIn} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #8b5cf6', boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)' }}>
                                <ShieldCheck size={40} color="#d946ef" />
                            </div>
                        </motion.div>
                        <motion.h1 className={styles.heroTitle} variants={fadeIn}>
                            Privacy Policy &<br />Data Protection
                        </motion.h1>
                        <motion.p className={styles.heroSubtitle} variants={fadeIn}>
                            At Bytecode Trainings, we don't just teach code; we protect it. Your privacy is fundamental to our mission. This policy outlines how we safeguard your digital footprint.
                        </motion.p>
                        <motion.div className={styles.lastUpdated} variants={fadeIn}>
                            <RefreshCw size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Last Updated: February 2026
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <div className={styles.contentWrapper}>
                <motion.div
                    className={styles.policyGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                >
                    {/* 1. DATA COLLECTION */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Database size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Data Collection</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>We collect information you provide directly to us when you creates an account, update your profile, or communicate with us. This may include:</p>
                            <ul>
                                <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                                <li><strong>Contact Data:</strong> Billing address, email address, and telephone numbers.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting and location.</li>
                                <li><strong>Profile Data:</strong> Your interests, preferences, potential feedback and survey responses.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 2. DATA USAGE */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Activity size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>How We Use Data</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>We use the information we collect to provide, maintain, and improve our services, including:</p>
                            <ul>
                                <li>Processing your enrollment and managing your account.</li>
                                <li>Sending you technical notices, updates, security alerts, and support messages.</li>
                                <li>Responding to your comments, questions, and requests.</li>
                                <li>Communicating with you about products, services, offers, and events.</li>
                                <li>Monitoring and analyzing trends, usage, and activities in connection with our services.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 3. SECURITY */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Lock size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Security Protocols</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>We implement advanced security measures to ensure your data is protected against unauthorized access, alteration, disclosure, or destruction.</p>
                            <ul>
                                <li><strong>Encryption:</strong> All sensitive data is encrypted using SSL/TLS protocols.</li>
                                <li><strong>Access Control:</strong> Strict role-based access control (RBAC) for internal staff.</li>
                                <li><strong>Regular Audits:</strong> We conduct periodic security audits and vulnerability assessments.</li>
                                <li><strong>Secure Infrastructure:</strong> Our servers are hosted in world-class data centers (AWS/Google Cloud) with 24/7 monitoring.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 4. COOKIES */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Cookie size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Cookies & Tracking</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</p>
                            <ul>
                                <li><strong>Essential Cookies:</strong> Vital for the website to function properly.</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website.</li>
                                <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant ads.</li>
                            </ul>
                            <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                        </div>
                    </motion.div>

                    {/* 5. USER RIGHTS */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><FileText size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Your Rights</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>Under applicable data protection laws, you have the following rights:</p>
                            <ul>
                                <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                                <li><strong>The right to rectification:</strong> You can request correction of any information you believe is inaccurate.</li>
                                <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data.</li>
                                <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* CONTACT BOX */}
                    <motion.div className={styles.contactBox} variants={fadeIn}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>Have Questions?</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Our Data Protection Officer is available to address any concerns you may have regarding your privacy.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <Mail size={20} color="#22d3ee" /> info@Bytecodetrainings.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <Phone size={20} color="#22d3ee" /> +91 8309879187
                            </div>
                        </div>

                        <Link href="/contact" className={styles.contactBtn}>
                            Contact Support <ExternalLink size={18} />
                        </Link>
                    </motion.div>

                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
