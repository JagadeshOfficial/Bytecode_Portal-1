"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, FileText, Gavel, AlertTriangle, Copyright, Lock, XCircle, Info, Mail, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import styles from './terms.module.css';
import Link from 'next/link';

export default function TermsPage() {
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
                            <div style={{ width: '80px', height: '80px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #22d3ee', boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}>
                                <Scale size={40} color="#22d3ee" />
                            </div>
                        </motion.div>
                        <motion.h1 className={styles.heroTitle} variants={fadeIn}>
                            Terms of Service &<br />Conditions
                        </motion.h1>
                        <motion.p className={styles.heroSubtitle} variants={fadeIn}>
                            Please read these terms carefully before using our service. They outline the rules and regulations for the use of Bytecode Trainings' Website and Services.
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
                    {/* 1. ACCEPTANCE OF TERMS */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><FileText size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Acceptance of Terms</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Bytecode Trainings if you do not agree to take all of the terms and conditions stated on this page.</p>
                            <ul>
                                <li><strong>User Agreement:</strong> You agree to use the site only for lawful purposes.</li>
                                <li><strong>Modifications:</strong> We reserve the right to change these terms at any time.</li>
                                <li><strong>Eligibility:</strong> You must be at least 18 years old to use our services.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 2. INTELLECTUAL PROPERTY */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Copyright size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Intellectual Property</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>Unless otherwise stated, Bytecode Trainings and/or its licensors own the intellectual property rights for all material on Bytecode Trainings.</p>
                            <ul>
                                <li><strong>Limited License:</strong> We grant you a limited license to access and make personal use of this site.</li>
                                <li><strong>Restrictions:</strong> You may not republish, sell, rent, or sub-license material from the website.</li>
                                <li><strong>Ownership:</strong> All trademarks, logos, and service marks displayed are our property.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 3. USER ACCOUNTS */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Lock size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>User Accounts</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>To access certain features of the service, you may be required to create an account.</p>
                            <ul>
                                <li><strong>Confidentiality:</strong> You are responsible for maintaining the confidentiality of your account and password.</li>
                                <li><strong>Responsibility:</strong> You agree to accept responsibility for all activities that occur under your account.</li>
                                <li><strong>Termination:</strong> We reserve the right to terminate accounts, edit or remove content, and cancel orders at our sole discretion.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 4. LIMITATION OF LIABILITY */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><AlertTriangle size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Limitation of Liability</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>In no event shall Bytecode Trainings, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.</p>
                            <ul>
                                <li><strong>Disclaimer:</strong> The materials on Bytecode Trainings' website are provided on an 'as is' basis.</li>
                                <li><strong>Warranties:</strong> We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* 5. GOVERNING LAW */}
                    <motion.div className={styles.policyCard} variants={fadeIn}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}><Gavel size={28} /></div>
                            <div>
                                <h2 className={styles.cardTitle}>Governing Law</h2>
                            </div>
                        </div>
                        <div className={styles.cardText}>
                            <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                        </div>
                    </motion.div>

                    {/* CONTACT BOX */}
                    <motion.div className={styles.contactBox} variants={fadeIn} style={{ borderColor: '#22d3ee' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>Need Legal Assistance?</h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>If you have any questions about these Terms, feel free to contact our legal team.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <Mail size={20} color="#22d3ee" /> legal@Bytecodetrainings.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                <Phone size={20} color="#22d3ee" /> +91 8309879187
                            </div>
                        </div>

                        <Link href="/contact" className={styles.contactBtn} style={{ background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)' }}>
                            Contact Legal Team <ExternalLink size={18} />
                        </Link>
                    </motion.div>

                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
