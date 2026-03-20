"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle, Smartphone, Globe, Landmark, ArrowRight, Lock } from 'lucide-react';
import styles from './payment.module.css';

export default function Payment() {
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.paymentGrid}>
                    {/* LEFT: PAYMENT METHODS */}
                    <div className={styles.methodsColumn}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Secure Checkout</h1>
                            <p className={styles.subtitle}>Complete your enrollment and unlock your tech future.</p>
                        </div>

                        <div className={styles.methodsList}>
                            <PaymentMethod
                                id="card"
                                icon={<CreditCard />}
                                title="Credit / Debit Card"
                                active={selectedMethod === 'card'}
                                onSelect={() => setSelectedMethod('card')}
                            />
                            <PaymentMethod
                                id="upi"
                                icon={<Smartphone />}
                                title="UPI (PhonePe / Google Pay / Paytm)"
                                active={selectedMethod === 'upi'}
                                onSelect={() => setSelectedMethod('upi')}
                            />
                            <PaymentMethod
                                id="netbanking"
                                icon={<Landmark />}
                                title="Net Banking"
                                active={selectedMethod === 'netbanking'}
                                onSelect={() => setSelectedMethod('netbanking')}
                            />
                        </div>

                        <motion.div
                            key={selectedMethod}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.methodDetails}
                        >
                            {selectedMethod === 'card' && (
                                <div className={styles.cardForm}>
                                    <div className={styles.inputGroup}>
                                        <label>Card Number</label>
                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.inputGroup}>
                                            <label>Expiry Date</label>
                                            <input type="text" placeholder="MM / YY" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>CVV</label>
                                            <input type="password" placeholder="***" />
                                        </div>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Card Holder Name</label>
                                        <input type="text" placeholder="John Doe" />
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'upi' && (
                                <div className={styles.upiForm}>
                                    <p className={styles.upiInfo}>Scan QR Code or enter VPA</p>
                                    <div className={styles.qrPlaceholder}>
                                        <Globe size={100} strokeWidth={1} />
                                        <span>DYNAMIC QR CODE GENERATING...</span>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Enter UPI ID (e.g. name@okaxis)</label>
                                        <input type="text" placeholder="user@upi" />
                                    </div>
                                </div>
                            )}

                            <button className={styles.payBtn} onClick={() => alert('Processing Payment...')}>
                                Pay Now <ArrowRight size={18} />
                            </button>
                        </motion.div>

                        <div className={styles.securityBadges}>
                            <div className={styles.badge}><Lock size={14} /> SSL Secured</div>
                            <div className={styles.badge}><ShieldCheck size={14} /> PCI-DSS Compliant</div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div className={styles.summaryColumn}>
                        <div className={styles.summaryCard}>
                            <h3>Order Summary</h3>
                            <div className={styles.courseBrief}>
                                <div className={styles.courseThumb} />
                                <div>
                                    <h4 id="courseName">Java Full Stack Masterclass</h4>
                                    <span>Batch starts: Feb 2026</span>
                                </div>
                            </div>

                            <div className={styles.costLines}>
                                <div className={styles.line}>
                                    <span>Course Fee</span>
                                    <span>₹29,661</span>
                                </div>
                                <div className={styles.line}>
                                    <span>GST (18%)</span>
                                    <span>₹5,339</span>
                                </div>
                                <div className={styles.totalLine}>
                                    <span>Total Payable</span>
                                    <span>₹35,000</span>
                                </div>
                            </div>

                            <div className={styles.trustFooter}>
                                <CheckCircle size={16} color="#4ade80" />
                                <p>You will get instant access to the LMS after payment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

function PaymentMethod({ icon, title, active, onSelect }: any) {
    return (
        <div
            className={`${styles.methodCard} ${active ? styles.activeMethod : ''}`}
            onClick={onSelect}
        >
            <div className={styles.methodIcon}>{icon}</div>
            <span className={styles.methodTitle}>{title}</span>
            <div className={styles.radio}>
                {active && <div className={styles.radioInner} />}
            </div>
        </div>
    );
}
