"use client";

import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin,
    Shield, Bell, Lock, Key,
    Server, Database, Activity,
    Clock, Globe, Cpu, Zap,
    CheckCircle, AlertCircle, RefreshCw, ChevronLeft, Edit, Save, Camera, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AdminProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: 'Super Admin',
        email: 'admin@bytecode.com',
        role: 'Super Admin',
        location: 'Hyderabad, India',
        phone: '+91 98765 43210',
        joined: 'Just now'
    });

    const [tempProfile, setTempProfile] = useState(profile);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const handleSave = () => {
        setProfile(tempProfile);
        setIsEditing(false);
        // Add toast notification here in a real app
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <DashboardLayout role="super_admin">
            <div style={{ color: 'white', fontFamily: 'Inter, sans-serif', paddingBottom: '2rem' }}>

                {/* Header / Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                        borderRadius: '16px',
                        padding: '3rem',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2.5rem',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Background Decoration */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

                    {/* Edit Button */}
                    <button
                        onClick={() => { setTempProfile(profile); setIsEditing(true); }}
                        style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', zIndex: 10,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.9rem', fontWeight: 500
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <Edit size={16} /> Edit Profile
                    </button>

                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3.5rem', fontWeight: 700, color: 'white',
                        boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
                        zIndex: 1, position: 'relative'
                    }}>
                        {profile.name.charAt(0)}
                        <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                            <Camera size={16} color="#cbd5e1" />
                        </div>
                    </div>

                    <div style={{ zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{profile.name}</h1>
                            <span style={{ padding: '0.25rem 1rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Shield size={14} /> VERIFIED
                            </span>
                            <span style={{ padding: '0.25rem 1rem', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', color: '#e879f9', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Zap size={14} /> PRO
                            </span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '1.1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {profile.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {profile.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {profile.phone}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '2rem'
                    }}
                >
                    {/* Left Col: Account Info & Security */}
                    <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Security Card */}
                        <motion.div variants={item} style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Lock size={20} color="#60a5fa" /> Security & Access
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Two-Factor Auth</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Enabled via Authenticator App</div>
                                    </div>
                                    <div style={{ width: '36px', height: '20px', background: '#34d399', borderRadius: '10px', position: 'relative' }}>
                                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password Expiry</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Expires in 42 days</div>
                                    </div>
                                    <button style={{ background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#94a3b8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Change</button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Session Timeout</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Auto-lock after 15 mins</div>
                                    </div>
                                    <AlertCircle size={16} color="#fbbf24" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Notification Settings */}
                        <motion.div variants={item} style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Bell size={20} color="#a78bfa" /> Notifications
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Email Alerts', 'System Updates', 'New Student Registrations', 'Server Downtime'].map((label, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                        <span>{label}</span>
                                        <div style={{ width: '32px', height: '18px', background: idx < 3 ? '#6366f1' : 'rgba(71, 85, 105, 0.5)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                            <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: idx < 3 ? '16px' : '2px', transition: 'left 0.2s' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Col: System Status & Activity (Span 8) */}
                    <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* System Health Dashboard */}
                        <motion.div variants={item} style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Activity size={24} color="#34d399" /> System Health Status
                                </h2>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#34d399', borderRadius: '50%', boxShadow: '0 0 8px #34d399' }} />
                                    All Systems Operational
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {/* Metric 1 */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Server size={18} color="#60a5fa" />
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Server Uptime</span>
                                    </div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>99.98%</div>
                                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>+0.02% this week</div>
                                </div>
                                {/* Metric 2 */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Database size={18} color="#f472b6" />
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Database Load</span>
                                    </div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>24ms</div>
                                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Optimal Latency</div>
                                </div>
                                {/* Metric 3 */}
                                <div style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.3)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <Cpu size={18} color="#fbbf24" />
                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>CPU Usage</span>
                                    </div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>42%</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Peak at 65%</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Admin Activity Log */}
                        <motion.div variants={item} style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <RefreshCw size={20} color="#e879f9" /> Recent Audit Logs
                            </h2>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '0.5rem' }}>ACTION</th>
                                        <th style={{ padding: '0.5rem' }}>TARGET</th>
                                        <th style={{ padding: '0.5rem' }}>IP ADDRESS</th>
                                        <th style={{ padding: '0.5rem' }}>TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { action: 'Updated Course Layout', target: 'Full Stack Java', ip: '192.168.1.42', time: '10 mins ago' },
                                        { action: 'Approved Student', target: 'Rahul Sharma', ip: '192.168.1.42', time: '1 hr ago' },
                                        { action: 'System Backup', target: 'Automated', ip: 'System', time: '3 hrs ago' },
                                        { action: 'Role Modification', target: 'Staff Account', ip: '192.168.1.42', time: 'Yesterday' },
                                    ].map((log, i) => (
                                        <tr key={i} style={{ background: 'rgba(30, 41, 59, 0.3)', fontSize: '0.9rem' }}>
                                            <td style={{ padding: '1rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', fontWeight: 500 }}>{log.action}</td>
                                            <td style={{ padding: '1rem', color: '#cbd5e1' }}>{log.target}</td>
                                            <td style={{ padding: '1rem', color: '#94a3b8', fontFamily: 'monospace' }}>{log.ip}</td>
                                            <td style={{ padding: '1rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', color: '#94a3b8' }}>{log.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>

                    </div>
                </motion.div>

                {/* Edit Profile Modal */}
                <AnimatePresence>
                    {isEditing && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditing(false)}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                style={{
                                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    width: '100%', maxWidth: '500px', background: 'rgba(15, 23, 42, 0.95)',
                                    border: '1px solid rgba(124, 58, 237, 0.3)', borderRadius: '16px',
                                    padding: '2rem', zIndex: 101, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Edit Profile</h2>
                                    <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>Full Name</label>
                                        <input
                                            type="text"
                                            value={tempProfile.name}
                                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>Phone Number</label>
                                        <input
                                            type="text"
                                            value={tempProfile.phone}
                                            onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>Location</label>
                                        <input
                                            type="text"
                                            value={tempProfile.location}
                                            onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '8px', color: 'white', outline: 'none' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                        >
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
