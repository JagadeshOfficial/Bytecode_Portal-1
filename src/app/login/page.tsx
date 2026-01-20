"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css'; // Reuse landing page styles for consistency

export default function Login() {
    return (
        <div className={styles.main}>
            <Navbar />

            <div style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--surface)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-lg)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '90%'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please select your portal to continue.</p>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <Link href="/student" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }} className="hover-effect">
                                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Student Login</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Access courses and placements</div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/employee" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                                <span style={{ fontSize: '1.5rem' }}>👨‍🏫</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Faculty & Staff Login</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage classes and schedules</div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin" style={{ textDecoration: 'none' }}>
                            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', cursor: 'pointer' }}>
                                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>Administrator Login</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Institute management</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
