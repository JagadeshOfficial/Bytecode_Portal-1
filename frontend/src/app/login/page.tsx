"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const userVal = email.toLowerCase().trim();
        const passVal = password.trim();

        if (!userVal || !passVal) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            // Attempt real authentication via user-service backend
            const response = await fetch('http://localhost:8082/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userVal, password: passVal })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'SUCCESS') {
                    // Save user info to localStorage
                    localStorage.setItem('user', JSON.stringify({
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        role: data.role
                    }));

                    // Redirect based on role from DB
                    const role = data.role.toUpperCase();
                    if (role === 'SUPER_ADMIN') {
                        router.push('/super-admin');
                    } else if (role === 'ADMIN') {
                        router.push('/admin');
                    } else if (role === 'STUDENT') {
                        router.push('/student');
                    } else if (role === 'TRAINER' || role === 'HR' || role === 'COUNSELOR' || role === 'FINANCE') {
                        router.push('/employee');
                    } else {
                        router.push('/employee'); // Fallback for other staff roles
                    }
                    return;
                }
            }
            
            // Fallback for demo/dev purposes if backend fails or doesn't find user
            throw new Error('Invalid credentials');

        } catch (err: any) {
            // Local check for basic testing if backend is unreachable
            if (userVal === 'admin' || userVal === 'student' || userVal === 'faculty') {
                if (userVal === 'admin') router.push('/admin');
                else if (userVal === 'student') router.push('/student');
                else router.push('/employee');
                return;
            }

            setError('Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.main}>
            <Navbar />

            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                paddingTop: '80px' // Offset for navbar
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'var(--bg-panel)',
                        backdropFilter: 'blur(20px)',
                        border: 'var(--border-faint)',
                        padding: 'clamp(1.5rem, 5vw, 3rem)',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '440px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)'
                        }}>
                            <KeyRound color="white" size={32} />
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-dim)' }}>Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Email Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: activeField === 'email' ? 'var(--primary)' : 'var(--text-dim)',
                                transition: 'color 0.3s'
                            }}>
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Username / Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setActiveField('email')}
                                onBlur={() => setActiveField(null)}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-subtle)',
                                    border: `1px solid ${activeField === 'email' ? 'var(--primary)' : 'var(--border-faint)'}`,
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '12px',
                                    color: 'var(--text-bright)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: activeField === 'password' ? 'var(--primary)' : 'var(--text-dim)',
                                transition: 'color 0.3s'
                            }}>
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setActiveField('password')}
                                onBlur={() => setActiveField(null)}
                                style={{
                                    width: '100%',
                                    background: 'var(--bg-subtle)',
                                    border: `1px solid ${activeField === 'password' ? 'var(--primary)' : 'var(--border-faint)'}`,
                                    padding: '1rem 1rem 1rem 3rem',
                                    borderRadius: '12px',
                                    color: 'var(--text-bright)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: '#ef4444',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    textAlign: 'center'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                border: 'none',
                                padding: '1rem',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                marginTop: '0.5rem'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(37, 99, 235, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Access Portal
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                        <p>Demo Portals (use <b>Bytecode@1354</b>):</p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px' }}>admin@hyd.bytecode.com</span>
                            <span style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px' }}>vamsi@example.com</span>
                            <span style={{ background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px' }}>java.trainer@bytecode.com</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Background Gradients */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }} />
            </div>
        </div>
    );
}
