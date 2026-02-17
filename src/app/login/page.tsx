"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertTriangle, Code2 } from 'lucide-react';
import { Role, ROLE_CONFIG } from '@/lib/dashboard-config';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './Login.module.css';

// Demo Credentials Mapping
const DEMO_CREDENTIALS: Record<Role, { u: string, p: string, label: string }> = {
    super_admin: { u: 'director@bytecode.com', p: 'Bytecode@1354', label: 'Director' },
    admin: { u: 'admin@hyd.bytecode.com', p: 'Bytecode@1354', label: 'Admin' },
    trainer: { u: 'java.trainer@bytecode.com', p: 'Bytecode@1354', label: 'Faculty' },
    hr: { u: 'placement.head@bytecode.com', p: 'Bytecode@1354', label: 'HR' },
    counselor: { u: 'counselor@bytecode.com', p: 'Bytecode@1354', label: 'Counselor' },
    finance: { u: 'accounts@bytecode.com', p: 'Bytecode@1354', label: 'Finance' },
    student: { u: 'student@learning.com', p: 'Bytecode@1354', label: 'Student' }
};

// Toast Component
const Toast = ({ status, onClose }: { status: { type: 'error' | 'success', msg: string }, onClose: () => void }) => {
    return (
        <motion.div
            className={`${styles.toast} ${status.type === 'success' ? styles.toastSuccess : styles.toastError}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
        >
            {status.type === 'success' ? <CheckCircle2 size={24} color="#10b981" /> : <AlertTriangle size={24} color="#ef4444" />}
            <div className={styles.toastContent}>
                <h4>{status.type === 'success' ? 'Success' : 'Authentication Failed'}</h4>
                <p>{status.msg}</p>
            </div>
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

    const { login: authLogin } = useAuth();

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            if (data.status === 'SUCCESS') {
                authLogin(data);
                setStatus({ type: 'success', msg: 'Welcome back! Redirecting you now...' });

                const backendRoleToFrontend: Record<string, Role> = {
                    'SUPER_ADMIN': 'super_admin',
                    'ADMIN': 'admin',
                    'TRAINER': 'trainer',
                    'HR': 'hr',
                    'COUNSELOR': 'counselor',
                    'FINANCE': 'finance',
                    'STUDENT': 'student'
                };
                const mappedRole = backendRoleToFrontend[data.role] || (data.role.toLowerCase() as Role);

                setTimeout(() => {
                    const dashboardUrl = ROLE_CONFIG[mappedRole]?.dashUrl || '/dashboard';
                    router.push(dashboardUrl);
                }, 1000);
            } else {
                setStatus({ type: 'error', msg: 'Incorrect email or password.' });
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            // Don't show generic 500 error if we can help it, but here we must
            setStatus({ type: 'error', msg: 'Unable to connect to server. Please try again.' });
            setLoading(false);
        }
    };

    const quickFill = (role: Role) => {
        const creds = DEMO_CREDENTIALS[role];
        setEmail(creds.u);
        setPassword(creds.p);
    };

    return (
        <main className={styles.pageContainer}>
            {/* Ambient Background */}
            <div className={styles.auroraBackground}>
                <div className={`${styles.auroraBlob} ${styles.blob1}`} />
                <div className={`${styles.auroraBlob} ${styles.blob2}`} />
                <div className={`${styles.auroraBlob} ${styles.blob3}`} />
            </div>

            <div className={styles.noiseOverlay} />

            <div style={{ position: 'relative', zIndex: 50 }}>
                <Navbar />
            </div>

            <div className={styles.contentGrid}>
                {/* Left Side: Brand Experience */}
                <motion.div
                    className={styles.brandSection}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.heroContent} style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                        <motion.h1
                            className={styles.heroTitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Elevate your <br />
                            Career Potential
                        </motion.h1>
                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Access the ecosystem designed for world-class IT training,
                            mentorship, and career acceleration.
                        </motion.p>

                        <motion.div
                            className={styles.statsRow}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className={styles.statItem}>
                                <h4>5k+</h4>
                                <p>Students</p>
                            </div>
                            <div className={styles.statItem}>
                                <h4>98%</h4>
                                <p>Placement</p>
                            </div>
                            <div className={styles.statItem}>
                                <h4>50+</h4>
                                <p>Partners</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className={styles.brandFooter}>
                        © 2026 ByteCode Trainings. All rights reserved.
                    </div>
                </motion.div>

                {/* Right Side: Login Form */}
                <div className={styles.formSection}>
                    <motion.div
                        className={styles.loginCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Welcome Back</h2>
                            <p className={styles.formDesc}>Please sign in to access your dashboard.</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputContainer}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input
                                        type="email"
                                        className={styles.inputField}
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Password</label>
                                <div className={styles.inputContainer}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={styles.inputField}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Signing in...' : (
                                    <>
                                        Sign In <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.quickLogin}>
                            <p className={styles.quickTitle}>Quick Access (Dev)</p>
                            <div className={styles.pillGrid}>
                                {(Object.keys(DEMO_CREDENTIALS) as Role[]).map((role) => (
                                    <div key={role} className={styles.pill} onClick={() => quickFill(role)}>
                                        {DEMO_CREDENTIALS[role].label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />

            {/* Float Toast Container */}
            <div className={styles.toastWrapper}>
                <AnimatePresence>
                    {status && <Toast status={status} onClose={() => setStatus(null)} />}
                </AnimatePresence>
            </div>
        </main>
    );
}
