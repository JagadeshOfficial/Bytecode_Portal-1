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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)', padding: '1.5rem', color: '#1e1b4b', overflowX: 'hidden' }}>
            
            {/* STREAMLINED SYSTEM CONTROL & PERSONA SWITCHER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', background: '#fff', padding: '15px 30px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '12px', background: 'linear-gradient(135deg, #6d28d9, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity color="#fff" size={18} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 1000, letterSpacing: '-0.3px' }}>Intelligence <span style={{ color: '#6d28d9' }}>Hub</span></h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} /> SYSTEM LIVE • REAL-TIME AUDIT
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '8px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                    {['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'STUDENT'].map((r) => {
                        const isActive = role === r;
                        const themeColor = r === 'STUDENT' ? '#10b981' : '#4f46e5'; 
                        return (
                            <motion.button 
                                key={r}
                                onClick={() => setRole(r as any)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ 
                                    padding: '8px 16px', 
                                    borderRadius: '12px', 
                                    border: 'none',
                                    background: isActive ? themeColor : 'transparent', 
                                    color: isActive ? '#000000' : '#475569', 
                                    fontWeight: 1000, 
                                    fontSize: '0.75rem', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    textTransform: 'uppercase',
                                    transition: '0.2s'
                                }}
                            >
                                {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000' }} />}
                                {r.split('_')[0]}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ADAPTIVE MAIN GRID - REFINED RATIOS */}
            <div style={{ display: 'grid', gridTemplateColumns: role === 'STUDENT' ? '240px 1fr' : '240px 1fr 340px', gap: '2rem', transition: '0.5s all ease-in-out' }}>
                
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
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '15px', border: 'none', background: activeTab === item.id ? '#4f46e5' : 'transparent', color: activeTab === item.id ? '#fff' : '#64748b', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', transition: '0.3s' }}
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
                        <p style={{ fontSize: '0.6rem', fontWeight: 1000, letterSpacing: '2px', opacity: 0.6, marginBottom: '10px' }}>HUB LOAD SYNC</p>
                        <p style={{ fontSize: '1.8rem', fontWeight: 1000, marginBottom: '15px' }}>{latency}<span style={{ fontSize: '0.8rem', opacity: 0.5 }}>ms</span></p>
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
                            <div key={i} style={{ ...glassStyle, padding: '15px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '24px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '14px', background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={20} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 1000, color: '#94a3b8', textTransform: 'uppercase' }}>{s.label}</p>
                                    <p style={{ fontSize: '1.3rem', fontWeight: 1000 }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ ...glassStyle, padding: '1.5rem', flex: 1, borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 1000 }}>{role === 'STUDENT' ? 'Personal Logs' : 'Security Ledger'}</h2>
                            {role !== 'STUDENT' && (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsQrModalOpen(true)} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '15px', fontWeight: 1000, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                    <QrCode size={18} /> SYNC HUB
                                </motion.button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {(role === 'STUDENT' ? [attendanceData[0]] : attendanceData).map((row) => (
                                <motion.div 
                                    key={row.id} 
                                    whileHover={{ y: -5, scale: 1.01 }}
                                    onClick={() => setSelectedUser(row)}
                                    style={{ padding: '15px', background: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.5fr 1fr 40px', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: 38, height: 38, borderRadius: '12px', background: row.status === 'SUSPICIOUS' ? '#fee2e2' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserCircle size={24} color={row.status === 'SUSPICIOUS' ? '#ef4444' : '#4f46e5'} />
                                        </div>
                                        <p style={{ fontWeight: 1000, fontSize: '0.95rem' }}>{row.name}</p>
                                    </div>
                                    <p style={{ fontWeight: 1000, color: '#64748b', fontSize: '0.85rem' }}>{row.batch}</p>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 1000 }}>{row.device}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{row.ip}</p>
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
                        <div style={{ ...glassStyle, padding: '25px', background: '#1e1b4b', color: '#fff', border: 'none' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 1000, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#ef4444' }}>
                                <ShieldAlert size={20} /> FRAUD DISCOVERY
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ padding: '15px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontWeight: 1000, marginBottom: '4px', fontSize: '0.9rem' }}>Sneha Rao</p>
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>Geo-fence violation: Bangalore Hub Node</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ ...glassStyle, padding: '25px' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 1000, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} color="#4f46e5" /> Policy Status
                            </h3>
                            <div onClick={() => setIsGeoFenceOn(!isGeoFenceOn)} style={{ width: '100%', height: '48px', borderRadius: '15px', background: isGeoFenceOn ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', padding: '0 15px', cursor: 'pointer' }}>
                                <p style={{ flex: 1, fontWeight: 1000, color: isGeoFenceOn ? '#166534' : '#64748b', fontSize: '0.85rem' }}>Geo-Fence: {isGeoFenceOn ? 'On' : 'Off'}</p>
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
