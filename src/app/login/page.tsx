"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Key, UserCircle, ChevronRight, AlertCircle, Scan, Globe, CheckCircle, Eye, EyeOff, Code, Users, Briefcase } from 'lucide-react';
import { Role, ROLE_CONFIG } from '@/lib/dashboard-config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './Login.module.css';

// Demo Credentials Mapping
const DEMO_CREDENTIALS: Record<Role, { u: string, p: string, label: string }> = {
    super_admin: { u: 'director@bytecode.com', p: 'masterKey_2024', label: 'Director' },
    admin: { u: 'admin@hyd.bytecode.com', p: 'admin@123', label: 'Admin' },
    trainer: { u: 'java.trainer@bytecode.com', p: 'codeIsLife!', label: 'Faculty' },
    hr: { u: 'placement.head@bytecode.com', p: 'hiringNow', label: 'HR' },
    counselor: { u: 'counselor@bytecode.com', p: 'growth2024', label: 'Counselor' },
    finance: { u: 'accounts@bytecode.com', p: 'moneyMatters', label: 'Finance' },
    student: { u: 'student@learning.com', p: 'learnFast', label: 'Student' }
};

// Toast Component
const Toast = ({ status, onClose }: { status: { type: 'error' | 'success', msg: string }, onClose: () => void }) => {
    return (
        <motion.div
            className={styles.toast}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
        >
            {status.type === 'success' ? <CheckCircle color="#10b981" /> : <AlertCircle color="#ef4444" />}
            <div>
                <div style={{ fontWeight: 700 }}>{status.type === 'success' ? 'Success' : 'Error'}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{status.msg}</div>
            </div>
            <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
        </motion.div>
    );
};

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const matchedRoleEntry = Object.entries(DEMO_CREDENTIALS).find(
            ([_, creds]) => creds.u === email && creds.p === password
        );

        if (matchedRoleEntry) {
            const role = matchedRoleEntry[0] as Role;
            setStatus({ type: 'success', msg: 'Redirecting to Dashboard...' });
            setTimeout(() => {
                router.push(ROLE_CONFIG[role].dashUrl);
            }, 1000);
        } else {
            setStatus({ type: 'error', msg: 'Invalid Credentials.' });
            setLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const quickFill = (role: Role) => {
        const creds = DEMO_CREDENTIALS[role];
        setEmail(creds.u);
        setPassword(creds.p);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 50 } }
    };

    return (
        <main className={styles.mainWrapper}>
            <div className={styles.cyberGrid} />
            <div className={styles.ambientLight} />
            <Navbar />

            <div className={styles.splitLayout}>
                {/* Left Side: Text/Brand Content */}
                <div className={styles.textSection}>

                    <motion.div
                        className={styles.contentWrapper}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className={styles.bigText} variants={itemVariants}>
                            <span className={styles.outlineText}>WORLD CLASS</span>
                            <span className={styles.gradientText}>IT TRAINING</span>
                            <span className={styles.outlineText}>ECOSYSTEM</span>
                        </motion.div>

                        <motion.div className={styles.featureList} variants={itemVariants}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}><Users size={28} /></div>
                                <div className={styles.featureContent}>
                                    <div className={styles.featureTitle}>Live Expert Mentorship</div>
                                    <div className={styles.featureDesc}>Learn directly from industry veterans.</div>
                                </div>
                            </div>

                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}><Code size={28} /></div>
                                <div className={styles.featureContent}>
                                    <div className={styles.featureTitle}>Real-world Projects</div>
                                    <div className={styles.featureDesc}>Build production-grade applications.</div>
                                </div>
                            </div>

                            <div className={styles.featureItem}>
                                <div className={styles.featureIconBox}><Briefcase size={28} /></div>
                                <div className={styles.featureContent}>
                                    <div className={styles.featureTitle}>100% Placement Support</div>
                                    <div className={styles.featureDesc}>Dedicated career guidance & mock interviews.</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side: Login Form */}
                <div className={styles.formSection}>
                    <motion.div
                        className={styles.loginCard}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={styles.header}>
                            <h1 className={styles.logoTitle}>
                                BYTE<span className={styles.highlight}>CODE</span> <span className={styles.accent}>PORTAL</span>
                            </h1>
                            <p className={styles.subtitle}>Enter your credentials to access the secure gateway.</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className={styles.formGroup}>
                                <div className={styles.inputWrapper}>
                                    <UserCircle className={styles.inputIcon} size={20} />
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <div className={styles.inputWrapper}>
                                    <Key className={styles.inputIcon} size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={styles.input}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.loginBtn} disabled={loading}>
                                {loading ? 'AUTHENTICATING...' : <>ACCESS DASHBOARD <ChevronRight size={18} /></>}
                            </button>
                        </form>

                        <div className={styles.quickAccess}>
                            {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((role) => (
                                <button key={role} className={styles.quickChip} onClick={() => quickFill(role)}>
                                    {DEMO_CREDENTIALS[role].label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className={styles.toastContainer}>
                <AnimatePresence>
                    {status && <Toast status={status} onClose={() => setStatus(null)} />}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}
