"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    Settings, Database, Lock, Bell, UserCog, Globe,
    Save, RefreshCw, Shield, Mail, Smartphone, AlertTriangle, CheckCircle
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';

const TABS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'System Data', icon: Database },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    // -- Helper Components --
    const ToggleSwitch = ({ label, desc, checked = false }: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
                <div style={{ fontWeight: 600, color: 'white', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{desc}</div>
            </div>
            <div style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: checked ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
            }}>
                <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
                    transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </div>
        </div>
    );

    const SectionHeader = ({ title, sub }: any) => (
        <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{sub}</p>
        </div>
    );

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* --- HEADER --- */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem',
                    padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)',
                    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                        <Settings size={28} />
                    </div>
                    <div>
                        <div className={styles.textLabel} style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>SYSTEM CONTROL</div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Platform Configuration</h1>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>

                    {/* --- SIDEBAR TABS --- */}
                    <div className={styles.glassPanel} style={{ padding: '1rem', height: 'fit-content' }}>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px',
                                    borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                                    color: activeTab === tab.id ? '#a78bfa' : '#94a3b8', fontWeight: activeTab === tab.id ? 600 : 500,
                                    cursor: 'pointer', transition: 'all 0.2s', marginBottom: '4px', textAlign: 'left'
                                }}
                            >
                                <tab.icon size={18} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        className={styles.glassPanel}
                        style={{ padding: '2rem', minHeight: '600px' }}
                    >
                        {activeTab === 'general' && (
                            <>
                                <SectionHeader title="General Settings" sub="Manage core platform details and availability." />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Platform Name</label>
                                        <input type="text" className={styles.formInput} defaultValue="ByteCode Trainings" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Support Email</label>
                                        <input type="email" className={styles.formInput} defaultValue="support@bytecode.com" />
                                    </div>
                                    <ToggleSwitch label="Maintenance Mode" desc="Temporarily disable access for students" checked={false} />
                                    <ToggleSwitch label="Public Registration" desc="Allow new users to sign up" checked={true} />
                                </div>
                            </>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <SectionHeader title="Security Controls" sub="Configure authentication policies and access rules." />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                                    <div className={styles.alertBox}>
                                        <Shield size={20} />
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#ef4444' }}>High Security Mode Required</div>
                                            <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>Certain actions require 2FA enablement.</div>
                                        </div>
                                    </div>
                                    <ToggleSwitch label="Two-Factor Authentication (2FA)" desc="Enforce 2FA for all admin accounts" checked={true} />
                                    <ToggleSwitch label="Force Password Reset" desc="Require password change every 90 days" checked={false} />
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Session Timeout (Minutes)</label>
                                        <input type="number" className={styles.formInput} defaultValue="30" />
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'notifications' && (
                            <>
                                <SectionHeader title="Notification Preferences" sub="Manage automated alerts and system emails." />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                                    <div style={{ display: 'flex', gap: '2rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Mail size={20} color="#a78bfa" /> Email
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Smartphone size={20} color="#f472b6" /> SMS / Push
                                        </div>
                                    </div>
                                    <ToggleSwitch label="New User Registrations" desc="Notify when a student signs up" checked={true} />
                                    <ToggleSwitch label="System Errors" desc="Critical system failure alerts" checked={true} />
                                    <ToggleSwitch label="Payment Success" desc="Financial transaction alerts" checked={false} />
                                </div>
                            </>
                        )}

                        {activeTab === 'database' && (
                            <>
                                <SectionHeader title="Database & Storage" sub="Manage backups and system logs." />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>STORAGE USED</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>45.2 GB</div>
                                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '1rem', borderRadius: '2px' }}>
                                            <div style={{ width: '60%', height: '100%', background: '#7c3aed' }}></div>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>LAST BACKUP</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CheckCircle size={18} /> Successful
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.5rem' }}>Today at 04:00 AM</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className={styles.btnPrimary}><RefreshCw size={16} /> Trigger Backup Now</button>
                                    <button className={styles.btnSecondary} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}><AlertTriangle size={16} /> Purge Old Logs</button>
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className={styles.btnPrimary} style={{ padding: '10px 24px', fontSize: '1rem' }}>
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </DashboardLayout>
    );
}
