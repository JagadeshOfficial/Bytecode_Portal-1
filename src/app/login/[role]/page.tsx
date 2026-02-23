"use client";

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Wand2,
    Sparkles,
    MoveLeft,
    ShieldCheck
} from 'lucide-react';
import { Role, ROLE_CONFIG } from '@/lib/dashboard-config';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from '../Login.module.css';

interface Toast {
    type: 'success' | 'error';
    message: string;
    title: string;
}

const Toast = ({ status, onClose }: { status: Toast; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20, x: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20, x: 50 }}
        className={`${styles.toast} ${status.type === 'error' ? styles.toastError : styles.toastSuccess}`}
    >
        <div className={styles.toastIcon}>
            {status.type === 'error' ? <AlertTriangle color="#f43f5e" size={24} /> : <CheckCircle2 color="#10b981" size={24} />}
        </div>
        <div className={styles.toastContent}>
            <h4>{status.title}</h4>
            <p>{status.message}</p>
        </div>
        <button onClick={onClose} className={styles.toastClose}>×</button>
    </motion.div>
);

export default function RoleLoginPage({ params }: { params: Promise<{ role: string }> }) {
    const { role } = use(params);
    const router = useRouter();
    const { login } = useAuth();

    // Auth state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<Toast | null>(null);

    const config = ROLE_CONFIG[role as Role] || {
        label: 'Staff Access',
        dashUrl: '/dashboard'
    };
    const description = (config as any).description || 'Secure login for ByteCode Personnel.';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            // Check if the user role matches the route
            const backendRole = data.role.toUpperCase();
            const targetRole = role.toUpperCase();

            // Simple check: allow if role matches or if admin
            if (backendRole !== targetRole && backendRole !== 'ADMIN' && backendRole !== 'SUPER_ADMIN') {
                throw new Error(`Unauthorized. This portal is for ${role} only.`);
            }

            login(data);

            setStatus({
                type: 'success',
                title: 'Access Granted',
                message: `Welcome, signed in as ${data.role}.`
            });

            setTimeout(() => {
                const roleConfig = ROLE_CONFIG[data.role.toLowerCase() as Role];
                router.push(roleConfig?.dashUrl || '/dashboard');
            }, 1000);

        } catch (error: any) {
            setStatus({
                type: 'error',
                title: 'Access Denied',
                message: error.message || 'Invalid credentials. Please verify your access.'
            });
        } finally {
            setLoading(false);
        }
    };

    const quickFill = () => {
        setEmail(`${role}@bytecode.com`);
        setPassword('password123');
    };

    return (
        <main className={styles.pageContainer}>
            {/* Ambient Background Experience */}
            <div className={styles.auroraBackground}>
                <div className={`${styles.auroraBlob} ${styles.blob1}`} />
                <div className={`${styles.auroraBlob} ${styles.blob2}`} />
                <div className={`${styles.auroraBlob} ${styles.blob3}`} />
            </div>
            <div className={styles.gridOverlay} />
            <div className={styles.noiseOverlay} />

            <div style={{ position: 'relative', zIndex: 100 }}>
                <Navbar />
            </div>

            {/* Back to Website Button */}
            <div className={styles.backButtonContainer}>
                <Link href="/" className={styles.backButton}>
                    <MoveLeft size={18} />
                    Back to Website
                </Link>
            </div>

            <div className={styles.contentGrid}>
                {/* Visual Narrative Section */}
                <div className={styles.brandSection}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className={styles.heroContent}
                    >
                        <h1 className={styles.heroTitle}>{role.toUpperCase()}<br />PORTAL.</h1>
                        <p className={styles.heroSubtitle}>
                            {description} Please authenticate to access specialized administrative and operational tools.
                        </p>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <ShieldCheck size={40} color="#8b5cf6" />
                                <p style={{ marginTop: '1rem' }}>Secure Infrastructure</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Secure Authentication Section */}
                <div className={styles.formSection}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.loginCard}
                    >
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Staff Sign In</h2>
                            <p className={styles.formDesc}>Authentication required for access</p>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Operational Email</label>
                                <div className={styles.inputContainer}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        type="email"
                                        className={styles.inputField}
                                        placeholder="staff@bytecode.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Access Key</label>
                                <div className={styles.inputContainer}>
                                    <Lock className={styles.inputIcon} size={20} />
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

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? 'Authorizing...' : (
                                    <>
                                        Authorized Login <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.quickLogin}>
                            <p className={styles.quickTitle}>System Access</p>
                            <button
                                className={styles.magicButton}
                                onClick={quickFill}
                            >
                                <div className={styles.btnIcon}>
                                    <Wand2 size={16} />
                                </div>
                                <span>Auto-Fill {role} Credentials</span>
                                <Sparkles size={14} style={{ opacity: 0.6 }} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />

            {/* Notifications Layer */}
            <div className={styles.toastWrapper}>
                <AnimatePresence>
                    {status && <Toast status={status} onClose={() => setStatus(null)} />}
                </AnimatePresence>
            </div>
        </main>
    );
}
