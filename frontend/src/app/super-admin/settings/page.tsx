"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Settings, Shield, Globe, Zap, 
    CreditCard, Layout, Cpu, Database, 
    Lock, Key, Bell, MapPin
} from 'lucide-react';

export default function SettingsManagement() {
    const [selectedTab, setSelectedTab] = useState('GENERAL');

    const TABS = [
        { id: 'GENERAL', label: 'Global Protocols', icon: <Globe size={18} /> },
        { id: 'SECURITY', label: 'Zero Trust Access', icon: <Shield size={18} /> },
        { id: 'API', label: 'Cloud Interoperability', icon: <Zap size={18} /> },
        { id: 'FINANCE', label: 'Transactional Gates', icon: <CreditCard size={18} /> },
    ];

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>System Architecture Settings</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect platform-wide operational parameters and security protocols.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
                    {/* --- SIDE TABS --- */}
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '32px', height: 'fit-content' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {TABS.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTab(t.id)}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px', 
                                        padding: '12px 18px', 
                                        borderRadius: '16px', 
                                        background: selectedTab === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
                                        color: selectedTab === t.id ? '#fff' : 'var(--text-dim)', 
                                        border: '1px solid rgba(255,255,255,0.05)', 
                                        fontWeight: 800, 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- TAB CONTENT --- */}
                    <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                        {selectedTab === 'GENERAL' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Global Operating Protocols</h1>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <SettingRow title="System Brand Identifier" desc="Manifest on all client-facing UI modules." input="Bytecode Trainings" />
                                    <SettingRow title="Operational Region" desc="Primary data center cluster for transaction logging." input="Asia-Pacific (Mumbai)" />
                                    <SettingRow title="System Epoch" desc="Reference date for architectural calculations." input="2026-01-01" />
                                </div>
                            </motion.div>
                        )}

                        {selectedTab === 'SECURITY' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Zero Trust Security Config</h1>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <ToggleSetting title="Geo-Fencing Cluster" desc="Restrict administrative access to verified coordinate grids only." active={true} icon={<MapPin size={20} />} />
                                    <ToggleSetting title="Biometric Node Check" desc="Enforce physical verification on role-based credential updates." active={false} icon={<Cpu size={20} />} />
                                    <ToggleSetting title="Automated IP Rotation" desc="Rotate administrative IP nodes every 24 operational hours." active={true} icon={<Database size={20} />} />
                                </div>
                            </motion.div>
                        )}

                        {selectedTab === 'API' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Cloud Interoperability & API Hub</h1>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <ApiKeyRow title="Eureka Discovery Node" value="bc_8273_eur_node" />
                                    <ApiKeyRow title="SMS Gateway Payload" value="sms_gw_bytecode_v2" />
                                    <ApiKeyRow title="Cloud Video Node (AWS)" value="aws_s3_bytecode_prod" />
                                </div>
                            </motion.div>
                        )}

                        {selectedTab === 'FINANCE' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>Transactional Payment Gateways</h1>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <PaymentGateCard name="Razorpay Master" status="ONLINE" uptime="99.9%" color="#3b82f6" />
                                    <PaymentGateCard name="Stripe Enterprise" status="STAGING" uptime="98.4%" color="#8b5cf6" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function SettingRow({ title, desc, input }: any) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', alignItems: 'center', gap: '2rem' }}>
            <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>{desc}</div>
            </div>
            <input defaultValue={input} style={inputStyle} />
        </div>
    );
}

function ToggleSetting({ title, desc, active, icon }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.015)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'var(--primary)' }}>{icon}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{desc}</div>
                </div>
            </div>
            <div style={{ width: '50px', height: '26px', background: active ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '100px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', top: '3px', left: active ? '27px' : '3px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.2)', transition: 'all 0.3s' }} />
            </div>
        </div>
    );
}

function ApiKeyRow({ title, value }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.015)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{title}</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '4px', fontFamily: 'monospace' }}>••••••••••••••••••••{value.slice(-4)}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '10px 18px', background: 'var(--primary)', border: 'none', color: '#fff', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>ROTATE KEY</button>
                <button style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: '#fff' }}><Key size={16} /></button>
            </div>
        </div>
    );
}

function PaymentGateCard({ name, status, uptime, color }: any) {
    return (
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', borderRadius: '24px', position: 'relative' }}>
             <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: color }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{name}</div>
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: status === 'ONLINE' ? '#10b981' : '#f59e0b' }}>{status}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>Avg Uptime</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color }}>{uptime}</span>
             </div>
             <button style={{ width: '100%', marginTop: '2rem', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>CONFIGURE NODE</button>
        </div>
    );
}

const inputStyle = {
    padding: '12px 18px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontWeight: 800
};
