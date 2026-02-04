"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    User, Mail, Shield, Bell, Key, LogOut, Camera, Edit2, MapPin,
    Briefcase, Calendar
} from 'lucide-react';
import styles from '../Admin.module.css';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    // Mock Admin Data
    const ADMIN_DATA = {
        name: 'Alex Johnson',
        role: 'Senior Administrator',
        email: 'alex.admin@bytecode.com',
        location: 'New York, USA',
        joined: 'March 2024',
        bio: 'Responsible for overseeing daily operations, student management, and financial reporting across all departments.'
    };

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header / Hero Section */}
                <div style={{ position: 'relative', marginBottom: '4rem' }}>
                    {/* Cover Image */}
                    <div style={{
                        height: '200px',
                        width: '100%',
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
                    </div>

                    {/* Profile Card Overlay */}
                    <div className={styles.glassPanel} style={{
                        position: 'absolute',
                        top: '120px',
                        left: '2rem',
                        right: '2rem',
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '2rem'
                    }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', marginTop: '-3rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '4px solid #0f172a',
                                background: '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '3rem',
                                fontWeight: 600,
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                            }}>
                                {ADMIN_DATA.name.charAt(0)}
                            </div>
                            <button style={{
                                position: 'absolute', bottom: '5px', right: '5px',
                                background: '#8b5cf6', border: '2px solid #0f172a',
                                borderRadius: '50%', padding: '0.4rem', color: 'white', cursor: 'pointer'
                            }}>
                                <Camera size={14} />
                            </button>
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Rajdhani', color: 'white', margin: 0 }}>{ADMIN_DATA.name}</h2>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={14} /> {ADMIN_DATA.role}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {ADMIN_DATA.location}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Joined {ADMIN_DATA.joined}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={isEditing ? styles.btnPrimary : styles.btnSecondary}
                                >
                                    {isEditing ? <CheckCircle size={16} /> : <Edit2 size={16} />}
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>

                    {/* Left: Navigation */}
                    <div className={styles.glassPanel} style={{ padding: '1rem' }}>
                        {[
                            { id: 'overview', icon: User, label: 'Overview' },
                            { id: 'security', icon: Shield, label: 'Login & Security' },
                            { id: 'notifications', icon: Bell, label: 'Notifications' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    display: 'flex', width: '100%', alignItems: 'center', gap: '1rem',
                                    padding: '1rem', borderRadius: '0.75rem', marginBottom: '0.5rem',
                                    background: activeTab === tab.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#94a3b8',
                                    border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                    fontWeight: activeTab === tab.id ? 600 : 400
                                }}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Right: Content */}
                    <div className={styles.glassPanel} style={{ padding: '2rem' }}>
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Profile Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {[
                                        { label: 'Full Name', value: ADMIN_DATA.name },
                                        { label: 'Email Address', value: ADMIN_DATA.email },
                                        { label: 'Role', value: ADMIN_DATA.role },
                                        { label: 'Phone', value: '+1 (555) 123-4567' },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>{field.label}</label>
                                            <div style={{
                                                padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem',
                                                color: 'white', border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        defaultValue={field.value}
                                                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                                    />
                                                ) : field.value}
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Bio</label>
                                        <div style={{
                                            padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem',
                                            color: 'white', border: '1px solid rgba(255,255,255,0.05)', lineHeight: '1.6'
                                        }}>
                                            {isEditing ? (
                                                <textarea
                                                    defaultValue={ADMIN_DATA.bio}
                                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                                                />
                                            ) : ADMIN_DATA.bio}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'security' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '1.5rem' }}>Security Settings</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.8rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '0.5rem', color: '#8b5cf6' }}><Key size={20} /></div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 600 }}>Change Password</div>
                                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Last changed 3 months ago</div>
                                            </div>
                                        </div>
                                        <button className={styles.btnSecondary}>Update</button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', color: '#10b981' }}><Shield size={20} /></div>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 600 }}>Two-Factor Authentication</div>
                                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Currently disabled</div>
                                            </div>
                                        </div>
                                        <button className={styles.btnPrimary}>Enable 2FA</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

            </motion.div>
        </DashboardLayout>
    );
}
