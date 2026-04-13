import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Shield, Users, MapPin, Smartphone, Globe, 
    AlertTriangle, CheckCircle, Clock, Filter, Download, 
    Settings, Zap, Search, ChevronRight, Fingerprint, 
    Lock, Unlock, Cpu, Signal, Bell, MoreHorizontal,
    QrCode, Maximize2, RefreshCw, BarChart3, List, BookOpen, UserCircle,
    X, ShieldAlert, Wifi, ZapOff
} from 'lucide-react';

// --- INDUSTRIAL TOKENS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '32px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.08)'
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

    // INTELLIGENCE SIMULATOR: High-fidelity mock data with fraud logic
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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f8fafc 0%, #ffffff 100%)', padding: '40px', color: '#1e1b4b', overflowX: 'hidden' }}>
            
            {/* GLOBAL COMMAND HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <motion.div whileHover={{ rotate: 15 }} style={{ width: 64, height: 64, borderRadius: '22px', background: 'linear-gradient(135deg, #6d28d9, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 30px rgba(109,40,217,0.2)' }}>
                        <Activity color="#fff" size={32} />
                    </motion.div>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', ...gradientText('#1e1b4b', '#6d28d9'), letterSpacing: '-2px' }}>Pinpoint<span style={{ color: '#6d28d9' }}>Hub</span></h1>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Wifi size={14} color="#10adc9" /> INDUSTRIAL TRACKING ENGINE ACTIVE • ARCH v3.1
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
                    {['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'STUDENT'].map((r) => (
                        <button 
                            key={r}
                            onClick={() => setRole(r as any)}
                            style={{ padding: '12px 20px', borderRadius: '16px', border: 'none', background: role === r ? '#fff' : 'transparent', color: role === r ? '#6d28d9' : '#64748b', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', boxShadow: role === r ? '0 10px 25px rgba(0,0,0,0.1)' : 'none', transition: '0.3s' }}
                        >
                            {r.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 380px', gap: '30px' }}>
                
                {/* SIDEBAR NAVIGATION */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { id: 'LIVE_FEED', label: 'Monitor Hub', icon: Activity, count: 142 },
                        { id: 'ANALYTICS', label: 'Presence Analytics', icon: BarChart3 },
                        { id: 'FRAUD', label: 'Fraud Detection', icon: Shield, count: 4, urgent: true },
                        { id: 'ROSTER', label: 'Batch Directory', icon: List },
                        { id: 'GEOMAP', label: 'Geo-Fence Map', icon: MapPin },
                        { id: 'AUDIT', label: 'System Logs', icon: Clock }
                    ].map((item) => (
                        <motion.button 
                            key={item.id}
                            whileHover={{ x: 8, background: 'rgba(109, 40, 217, 0.05)' }}
                            onClick={() => setActiveTab(item.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '22px', border: 'none', background: activeTab === item.id ? '#6d28d9' : 'transparent', color: activeTab === item.id ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: '0.3s', textAlign: 'left' }}
                        >
                            <item.icon size={20} />
                            {item.label}
                            {item.count && (
                                <div style={{ marginLeft: 'auto', background: item.urgent ? '#ef4444' : (activeTab === item.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0'), color: activeTab === item.id || item.urgent ? '#fff' : '#64748b', padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem' }}>
                                    {item.count}
                                </div>
                            )}
                        </motion.button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '30px', ...glassStyle, background: 'linear-gradient(135deg, #1e1b4b, #6d28d9)', border: 'none', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px', opacity: 0.6 }}>NETWORK LATENCY</p>
                            <div style={{ padding: '4px 8px', borderRadius: '50px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>EXCELLENT</div>
                        </div>
                        <p style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '20px' }}>{latency}<span style={{ fontSize: '1rem', opacity: 0.5 }}>ms</span></p>
                        <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                            {hubLoad.map((h, i) => (
                                <motion.div key={i} animate={{ height: `${h}%` }} style={{ flex: 1, background: '#10b981', borderRadius: '2px' }} />
                                ))}
                        </div>
                    </div>
                </div>

                {/* CENTRAL INTELLIGENCE PANEL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* INTELLIGENCE STRIP */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            { label: 'Avg Attendance', value: '96.4%', icon: Users, color: '#6d28d9' },
                            { label: 'Fraud Alerts', value: '04', icon: ShieldAlert, color: '#ef4444' },
                            { label: 'Hub Sync', value: 'Active', icon: RefreshCw, color: '#10b981' }
                        ].map((s, i) => (
                            <div key={i} style={{ ...glassStyle, padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: 50, height: 50, borderRadius: '16px', background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={22} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{s.label}</p>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 900 }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* GLOBAL ATTENDANCE ROSTER */}
                    <div style={{ ...glassStyle, padding: '40px', flex: 1, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 950, letterSpacing: '-1px' }}>Global Presence Ledger</h2>
                                <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.85rem' }}>Full hardware audit and IP synchronization.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ background: '#f1f5f9', padding: '12px 24px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '12px', width: '320px', border: '1px solid rgba(0,0,0,0.02)' }}>
                                    <Search size={18} color="#94a3b8" />
                                    <input placeholder="Deep audit by IP, Name, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', fontWeight: 600, width: '100%', fontSize: '0.9rem' }} />
                                </div>
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsQrModalOpen(true)} style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '18px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(109,40,217,0.2)' }}>
                                    <QrCode size={20} /> GENERATE QR
                                </motion.button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {filteredData.map((row) => (
                                <motion.div 
                                    key={row.id} 
                                    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}
                                    onClick={() => setSelectedUser(row)}
                                    style={{ padding: '24px', background: '#fff', borderRadius: '28px', border: '1px solid rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 120px 1fr 1fr 60px', alignItems: 'center', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ width: 50, height: 50, borderRadius: '18px', background: row.status === 'SUSPICIOUS' ? '#fee2e2' : '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserCircle size={24} color={row.status === 'SUSPICIOUS' ? '#ef4444' : '#6d28d9'} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 950, fontSize: '1.05rem', color: '#1e1b4b' }}>{row.name}</p>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>ID: BTN-AXO-{row.id} • {row.lastSeen}</p>
                                        </div>
                                    </div>

                                    <p style={{ fontWeight: 900, color: '#64748b', fontSize: '0.85rem' }}>{row.batch}</p>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <Smartphone size={14} color="#6d28d9" />
                                            <p style={{ fontSize: '0.85rem', fontWeight: 900 }}>{row.device}</p>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>IP: {row.ip}</p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ background: row.status === 'SUSPICIOUS' ? '#ef4444' : (row.status === 'PRESENT' ? '#10b981' : '#f59e0b'), color: '#fff', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, textAlign: 'center', width: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                            {row.status}
                                        </div>
                                        {row.flags && <p style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 900 }}>! {row.flags[0]}</p>}
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <ChevronRight size={20} color="#cbd5e1" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FRAUD & POLICY SIDEBAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* FRAUD INTELLIGENCE UNIT */}
                    <div style={{ ...glassStyle, padding: '30px', background: '#1e1b4b', color: '#fff', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 1000, display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
                                <ShieldAlert size={22} /> FRAUD DISCOVERY
                            </h3>
                            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 15px #ef4444' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[
                                { user: 'Priya Verma', msg: 'Multiple device collision detected from same IP.', severity: 'CRITICAL' },
                                { user: 'Sneha Rao', msg: 'Geo-fence anomaly: Bengaluru (1,240km outside).', severity: 'HIGH' },
                                { user: 'Unknown Device', msg: 'Attempted login from Blacklisted IP node.', severity: 'ALERT' }
                            ].map((alert, i) => (
                                <motion.div key={i} whileHover={{ x: 5 }} style={{ padding: '20px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 950, color: '#ef4444' }}>{alert.severity}</p>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.5 }}>{i+2}m ago</p>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '2px' }}>{alert.user}</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{alert.msg}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* GEO-FENCE NEXUS */}
                    <div style={{ ...glassStyle, padding: '30px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MapPin size={22} color="#6d28d9" /> Geo-Fence Policy
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 950, fontSize: '1rem', color: '#1e1b4b' }}>Hyderabad Nexus</p>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Active Threshold: 150m</p>
                                </div>
                                <div 
                                    onClick={() => setIsGeoFenceOn(!isGeoFenceOn)}
                                    style={{ width: 48, height: 26, borderRadius: '50px', background: isGeoFenceOn ? '#10b981' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                >
                                    <motion.div animate={{ x: isGeoFenceOn ? 24 : 2 }} style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} />
                                </div>
                            </div>

                            <div style={{ height: '180px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', borderRadius: '28px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 90, height: 90, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px dashed #10b981' }} />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', background: '#6d28d9', border: '3px solid #fff' }} />
                                <div style={{ position: 'absolute', top: '25%', left: '30%', width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                                <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: '#fff', padding: '8px 16px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 1000, color: '#6d28d9', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                    CENTRAL-SIG-AXO
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '18px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 950, fontSize: '0.9rem', color: '#1e1b4b', cursor: 'pointer', transition: '0.3s' }}>
                                MASTER GEO-CALIBRATION
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DEEP AUDIT MODAL */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(30,27,75,0.85)', backdropFilter: 'blur(25px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
                            style={{ ...glassStyle, padding: '50px', maxWidth: '800px', width: '100%', position: 'relative' }}
                        >
                            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: '30px', right: '30px', background: '#f1f5f9', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={24} color="#64748b" />
                            </button>

                            <div style={{ display: 'flex', gap: '40px', marginBottom: '50px' }}>
                                <div style={{ width: 120, height: 120, borderRadius: '40px', background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserCircle size={64} color="#6d28d9" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h2 style={{ fontSize: '2.4rem', fontWeight: 1000, letterSpacing: '-1.5px', marginBottom: '8px' }}>{selectedUser.name}</h2>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#6d28d9' }}>{selectedUser.batch}</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>{selectedUser.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '50px' }}>
                                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <Smartphone size={18} color="#6d28d9" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 1000, color: '#64748b', letterSpacing: '1px' }}>HARDWARE</span>
                                    </div>
                                    <p style={{ fontWeight: 950, fontSize: '1.1rem' }}>{selectedUser.device}</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.6 }}>{selectedUser.os} • {selectedUser.browser}</p>
                                </div>
                                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <Globe size={18} color="#6d28d9" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 1000, color: '#64748b', letterSpacing: '1px' }}>NETWORK IP</span>
                                    </div>
                                    <p style={{ fontWeight: 950, fontSize: '1.1rem' }}>{selectedUser.ip}</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>WHITELISTED NODE</p>
                                </div>
                                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <Clock size={18} color="#6d28d9" />
                                        <span style={{ fontSize: '0.8rem', fontWeight: 1000, color: '#64748b', letterSpacing: '1px' }}>ACTIVITY</span>
                                    </div>
                                    <p style={{ fontWeight: 950, fontSize: '1.1rem' }}>{selectedUser.loginTime}</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6d28d9' }}>AUTHENTICATED SESSION</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button style={{ flex: 1, padding: '20px', borderRadius: '20px', background: '#fff', border: '1px solid #e2e8f0', fontWeight: 950, color: '#ef4444', cursor: 'pointer' }}>RESTRICT DEVICE</button>
                                <button style={{ flex: 2, padding: '20px', borderRadius: '20px', background: '#1e1b4b', color: '#fff', border: 'none', fontWeight: 950, cursor: 'pointer' }}>GENERATE AUDIT REPORT</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* QR MODAL (Same as previous but with better z-index) */}
            <AnimatePresence>
                {isQrModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(30,27,75,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        {/* ... QR Content ... Same as before but I'll add the Close fix */}
                         <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ ...glassStyle, padding: '50px', maxWidth: '500px', width: '100%', textAlign: 'center', position: 'relative' }}>
                            <button onClick={() => setIsQrModalOpen(false)} style={{ position: 'absolute', top: '30px', right: '30px', background: '#f8fafc', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={24} color="#64748b" />
                            </button>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 1000, marginBottom: '10px' }}>Secure Hub Key</h2>
                            <p style={{ color: '#64748b', fontWeight: 800, marginBottom: '40px' }}>Rotating industrial token for {role} verification.</p>
                            <div style={{ width: 260, height: 260, background: '#fff', borderRadius: '44px', padding: '30px', margin: '0 auto 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#6d28d9', animation: 'scan 2.5s infinite linear' }} />
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BYTECODE-SESSION-${Date.now()}`} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                                <div>
                                    <p style={{ fontSize: '2rem', fontWeight: 1000, color: '#6d28d9' }}>{qrTimer}s</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#94a3b8' }}>ROTATING</p>
                                </div>
                                <div style={{ width: '1px', background: '#e2e8f0' }} />
                                <div>
                                    <p style={{ fontSize: '2rem', fontWeight: 1000, color: '#10b981' }}>LIVE</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 950, color: '#94a3b8' }}>SYNCING</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SYSTEM STATUS TICKER */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1e1b4b', padding: '10px 40px', display: 'flex', gap: '40px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', gap: '40px', animation: 'ticker 30s infinite linear' }}>
                    {[
                        "SYSTEM OPTIMIZED • GEO-FENCE ACTIVE • HYDERABAD HUB SYNCED",
                        "SECURITY TIER 3 STATUS: EXCELLENT • NO CRITICAL BREACHES",
                        "FRAUD DETECTION ENGINE 4.0: MONITORING VPN NODES",
                        "BIOMETRIC HEARTBEAT: 100% OPERATIONAL"
                    ].map((t, idx) => (
                        <p key={idx} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '2px' }}>{t}</p>
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
;
