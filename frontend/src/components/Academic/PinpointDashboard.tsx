import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Shield, Users, MapPin, Smartphone, Globe, 
    AlertTriangle, CheckCircle, Clock, Filter, Download, 
    Settings, Zap, Search, ChevronRight, Fingerprint, 
    Lock, Unlock, Cpu, Signal, Bell, MoreHorizontal,
    QrCode, Maximize2, RefreshCw, BarChart3, List, BookOpen, UserCircle,
    X, ShieldAlert, Wifi, ZapOff, Check
} from 'lucide-react';

// --- INDUSTRIAL TOKENS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '32px',
    boxShadow: '0 35px 90px rgba(0,0,0,0.1)'
};

const gradientText = (color1 = '#6d28d9', color2 = '#4f46e5') => ({
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900
});

// --- CORE SYSTEM HUB ---
export default function PinpointDashboard() {
    const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'TRAINER' | 'STUDENT'>('SUPER_ADMIN');
    const [activeTab, setActiveTab] = useState('LIVE_FEED');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrTimer, setQrTimer] = useState(60);
    const [isGeoFenceOn, setIsGeoFenceOn] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [latency, setLatency] = useState(24);
    const [hubLoad, setHubLoad] = useState([40, 70, 45, 90, 70, 85, 50, 60]);

    // INTELLIGENCE SIMULATOR
    const attendanceData = [
        { id: '101', name: 'Arjun Reddy', batch: 'PY-2024', loginTime: '09:02 AM', lastSeen: 'Active Now', device: 'iPhone 15 Pro', os: 'iOS 17.2', browser: 'Safari 17.0', ip: '103.45.16.22', location: 'Hyderabad, TS (Hub)', status: 'PRESENT', risk: 'LOW' },
        { id: '102', name: 'Sneha Rao', batch: 'PY-2024', loginTime: '09:45 AM', lastSeen: '3m ago', device: 'MacBook Pro', os: 'macOS 14.1', browser: 'Chrome 120', ip: '182.72.11.90', location: 'Bengaluru, KA (Remote)', status: 'SUSPICIOUS', risk: 'HIGH', flags: ['VPN Detected', 'Geo-Fence Violation'] },
        { id: '103', name: 'Vikram Singh', batch: 'DS-2024', loginTime: '09:15 AM', lastSeen: 'Active Now', device: 'Dell XPS 15', os: 'Windows 11', browser: 'Edge 119', ip: '106.33.22.41', location: 'Hyderabad, TS (Hub)', status: 'LATE', risk: 'LOW' },
        { id: '104', name: 'Priya Verma', batch: 'PY-2024', loginTime: '09:00 AM', lastSeen: '12m ago', device: 'Pixel 8 Pro', os: 'Android 14', browser: 'Chrome Mobile', ip: '103.45.16.22', location: 'Hyderabad, TS (Hub)', status: 'PRESENT', risk: 'MEDIUM', flags: ['Shared IP Workspace'] }
    ];

    // Nexus Heartbeat Simulator
    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 10) + 18);
            setHubLoad(prev => [...prev.slice(1), Math.floor(Math.random() * 50) + 40]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // QR Heartbeat
    useEffect(() => {
        let timer: any;
        if (isQrModalOpen && qrTimer > 0) {
            timer = setInterval(() => setQrTimer(prev => prev - 1), 1000);
        } else if (qrTimer === 0) {
            setQrTimer(60); 
        }
        return () => clearInterval(timer);
    }, [isQrModalOpen, qrTimer]);

    const filteredData = attendanceData.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.ip.includes(searchTerm) || 
        d.batch.includes(searchTerm)
    );

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4f8 0%, #ffffff 100%)', padding: '40px', color: '#1e1b4b', overflowX: 'hidden' }}>
            
            {/* HIGH-CONTRAST ROLE NEXUS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', flexWrap: 'wrap', gap: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '22px', background: 'linear-gradient(135deg, #6d28d9, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(109,40,217,0.3)' }}>
                        <Activity color="#fff" size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', ...gradientText('#1e1b4b', '#6d28d9'), letterSpacing: '-2.5px' }}>Pinpoint<span style={{ color: '#6d28d9' }}>Hub</span></h1>
                        <p style={{ fontSize: '0.9rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '2px' }}>V4.2 • INTELLIGENCE OPERATING SYSTEM</p>
                    </div>
                </div>

                {/* ADAPTIVE PERSONA SWITCHER - VISIBILITY SECURED */}
                <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '32px', border: '2px solid #cbd5e1', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'STUDENT'].map((r) => {
                        const isActive = role === r;
                        const isStudentRole = r === 'STUDENT';
                        const themeColor = isStudentRole ? '#10b981' : '#4f46e5'; 
                        
                        return (
                            <motion.button 
                                key={r}
                                onClick={() => setRole(r as any)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ 
                                    padding: '14px 24px', 
                                    borderRadius: '20px', 
                                    border: isActive ? `3px solid ${themeColor}` : '2px solid #cbd5e1', 
                                    background: isActive ? themeColor : '#ffffff', 
                                    color: '#000000', // ENFORCED ABSOLUTE BLACK AS REQUESTED
                                    fontWeight: 1000, 
                                    fontSize: '0.85rem', 
                                    cursor: 'pointer', 
                                    boxShadow: isActive ? `0 15px 35px ${themeColor}33` : '0 4px 10px rgba(0,0,0,0.05)', 
                                    transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    textTransform: 'uppercase',
                                    flexShrink: 0
                                }}
                            >
                                {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />}
                                {r.replace('_', ' ')}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ADAPTIVE MAIN GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: role === 'STUDENT' ? '280px 1fr' : '280px 1fr 380px', gap: '30px', transition: '0.5s' }}>
                
                {/* SIDEBAR NAVIGATION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { id: 'LIVE_FEED', label: 'Monitor Hub', icon: Activity, roles: ['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'STUDENT'] },
                        { id: 'ANALYTICS', label: 'My Stats', icon: BarChart3, roles: ['STUDENT'] },
                        { id: 'ANALYTICS_GLOBAL', label: 'Presence Analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN', 'TRAINER'] },
                        { id: 'FRAUD', label: 'Fraud Discovery', icon: Shield, roles: ['SUPER_ADMIN', 'ADMIN'], count: 4, urgent: true },
                        { id: 'ROSTER', label: 'Batch Directory', icon: List, roles: ['SUPER_ADMIN', 'ADMIN', 'TRAINER'] },
                        { id: 'GEOMAP', label: 'Geo-Fence Map', icon: MapPin, roles: ['SUPER_ADMIN', 'ADMIN'] },
                        { id: 'AUDIT', label: 'Audit Ledger', icon: Clock, roles: ['SUPER_ADMIN', 'ADMIN'] }
                    ].filter(i => i.roles.includes(role)).map((item) => (
                        <motion.button 
                            key={item.id}
                            whileHover={{ x: 10, background: 'rgba(79, 70, 229, 0.05)' }}
                            onClick={() => setActiveTab(item.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '24px', border: 'none', background: activeTab === item.id ? '#4f46e5' : 'transparent', color: activeTab === item.id ? '#fff' : '#64748b', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', transition: '0.3s' }}
                        >
                            <item.icon size={20} />
                            {item.label}
                            {item.count && (
                                <div style={{ marginLeft: 'auto', background: item.urgent ? '#ef4444' : (activeTab === item.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0'), color: '#fff', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 1000 }}>
                                    {item.count}
                                </div>
                            )}
                        </motion.button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '30px', ...glassStyle, background: 'linear-gradient(135deg, #1e1b4b, #4f46e5)', border: 'none', color: '#fff' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 1000, letterSpacing: '2px', opacity: 0.6, marginBottom: '15px' }}>HUB LOAD SYNC</p>
                        <p style={{ fontSize: '2.4rem', fontWeight: 1000, marginBottom: '20px' }}>{latency}<span style={{ fontSize: '1rem', opacity: 0.5 }}>ms</span></p>
                        <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                            {hubLoad.map((h, i) => (
                                <motion.div key={i} animate={{ height: `${h}%` }} style={{ flex: 1, background: '#10b981', borderRadius: '2px' }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTRAL MONITORING PANEL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            { label: role === 'STUDENT' ? 'My Presence' : 'Avg Attendance', value: role === 'STUDENT' ? '98.2%' : '96.4%', icon: Users, color: '#4f46e5' },
                            { label: role === 'STUDENT' ? 'Hub Status' : 'Fraud Alerts', value: role === 'STUDENT' ? 'Connected' : '04', icon: role === 'STUDENT' ? Signal : ShieldAlert, color: role === 'STUDENT' ? '#10b981' : '#ef4444' },
                            { label: 'Security Level', value: 'Tier 4', icon: Lock, color: '#6366f1' }
                        ].map((s, i) => (
                            <div key={i} style={{ ...glassStyle, padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ width: 54, height: 54, borderRadius: '18px', background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={24} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 1000, color: '#94a3b8', textTransform: 'uppercase' }}>{s.label}</p>
                                    <p style={{ fontSize: '1.6rem', fontWeight: 1000 }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ ...glassStyle, padding: '45px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 1000 }}>{role === 'STUDENT' ? 'Personal Logs' : 'Security Ledger'}</h2>
                            {role !== 'STUDENT' && (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsQrModalOpen(true)} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '20px', fontWeight: 1000, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <QrCode size={22} /> SYNC HUB
                                </motion.button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {(role === 'STUDENT' ? [attendanceData[0]] : attendanceData).map((row) => (
                                <motion.div 
                                    key={row.id} 
                                    whileHover={{ y: -5, scale: 1.01 }}
                                    onClick={() => setSelectedUser(row)}
                                    style={{ padding: '28px', background: '#fff', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.5fr 1fr 60px', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                                        <div style={{ width: 54, height: 54, borderRadius: '20px', background: row.status === 'SUSPICIOUS' ? '#fee2e2' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserCircle size={28} color={row.status === 'SUSPICIOUS' ? '#ef4444' : '#4f46e5'} />
                                        </div>
                                        <p style={{ fontWeight: 1000, fontSize: '1.1rem' }}>{row.name}</p>
                                    </div>
                                    <p style={{ fontWeight: 1000, color: '#64748b' }}>{row.batch}</p>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 1000 }}>{row.device}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{row.ip}</p>
                                    </div>
                                    <div style={{ background: row.status === 'SUSPICIOUS' ? '#ef4444' : '#10b981', color: '#fff', padding: '8px 15px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 1000, textAlign: 'center' }}>
                                        {row.status}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <ChevronRight size={22} color="#cbd5e1" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (Admin only) */}
                {['SUPER_ADMIN', 'ADMIN'].includes(role) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div style={{ ...glassStyle, padding: '35px', background: '#1e1b4b', color: '#fff', border: 'none' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 1000, display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', color: '#ef4444' }}>
                                <ShieldAlert size={22} /> FRAUD DISCOVERY
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontWeight: 1000, marginBottom: '5px' }}>Sneha Rao</p>
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Geo-fence violation: Bangalore Hub Node</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...glassStyle, padding: '35px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 1000, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <MapPin size={22} color="#4f46e5" /> Policy Enforcement
                            </h3>
                            <div onClick={() => setIsGeoFenceOn(!isGeoFenceOn)} style={{ width: '100%', height: '54px', borderRadius: '18px', background: isGeoFenceOn ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', padding: '0 20px', cursor: 'pointer' }}>
                                <p style={{ flex: 1, fontWeight: 1000, color: isGeoFenceOn ? '#166534' : '#64748b' }}>Geo-Fence: {isGeoFenceOn ? 'Active' : 'Locked'}</p>
                                {isGeoFenceOn ? <CheckCircle size={18} color="#166534" /> : <ShieldAlert size={18} color="#64748b" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(30,27,75,0.9)', backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} style={{ ...glassStyle, padding: '60px', maxWidth: '800px', width: '100%', position: 'relative' }}>
                            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: '40px', right: '40px', background: '#f1f5f9', border: 'none', width: 50, height: 50, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={26} /></button>
                            <h2 style={{ fontSize: '2.4rem', fontWeight: 1000, marginBottom: '10px' }}>{selectedUser.name}</h2>
                            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4f46e5', marginBottom: '40px' }}>{selectedUser.batch} • {selectedUser.location}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <Smartphone size={20} color="#4f46e5" style={{ marginBottom: '15px' }} />
                                    <p style={{ fontWeight: 1000 }}>{selectedUser.device}</p>
                                </div>
                                <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <Globe size={20} color="#4f46e5" style={{ marginBottom: '15px' }} />
                                    <p style={{ fontWeight: 1000 }}>{selectedUser.ip}</p>
                                </div>
                                <div style={{ padding: '25px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <Clock size={20} color="#4f46e5" style={{ marginBottom: '15px' }} />
                                    <p style={{ fontWeight: 1000 }}>{selectedUser.loginTime}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isQrModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(30,27,75,0.9)', backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ ...glassStyle, padding: '50px', maxWidth: '450px', width: '100%', textAlign: 'center', position: 'relative' }}>
                            <button onClick={() => setIsQrModalOpen(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: '#f8fafc', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
                            <h3 style={{ fontSize: '2rem', fontWeight: 1000, marginBottom: '10px' }}>Secure Hub Key</h3>
                            <p style={{ color: '#64748b', marginBottom: '40px' }}>Rotating industrial token for {role} verification.</p>
                            <div style={{ width: 220, height: 220, background: '#fff', borderRadius: '32px', padding: '20px', margin: '0 auto 40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#4f46e5', animation: 'scan 2.5s infinite linear' }} />
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PINPOINT-${Date.now()}`} alt="QR" style={{ width: '100%', height: '100%' }} />
                            </div>
                            <p style={{ fontSize: '2rem', fontWeight: 1000, color: '#4f46e5' }}>{qrTimer}s</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SYSTEM STATUS TICKER */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e1b4b', padding: '12px 40px', display: 'flex', gap: '50px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '50px', animation: 'ticker 40s infinite linear' }}>
                    {[
                        "HYDERABAD NEXUS NODE 9 OPERATIONAL • TIER 4 ENCRYPTION ACTIVE",
                        "FRAUD DETECTION HEARTBEAT: OPTIMAL • NO ANOMALIES DETECTED",
                        "SYSTEM MONITOR ROLE: " + role + " • HUB LOAD: 42%",
                        "BIOMETRIC SYNC STATUS: SECURE • PINPOINT TRACKING v4.2"
                    ].map((t, idx) => (
                        <p key={idx} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 1000, letterSpacing: '3px' }}>{t}</p>
                    ))}
                </div>
            </div>

            <style>
                {`
                    @keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }
                    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                `}
            </style>
        </div>
    );
}
