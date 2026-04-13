import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Shield, Users, MapPin, Smartphone, Globe, 
    AlertTriangle, CheckCircle, Clock, Filter, Download, 
    Settings, Zap, Search, ChevronRight, Fingerprint, 
    Lock, Unlock, Cpu, Signal, Bell, MoreHorizontal,
    QrCode, Maximize2, RefreshCw, BarChart3, List, BookOpen, UserCircle
} from 'lucide-react';

// --- INDUSTRIAL TOKENS ---
const glassStyle = {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '32px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.06)'
};

const gradientText = (color1 = '#6d28d9', color2 = '#4f46e5') => ({
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900
});

// --- CORE LOGIC & HUB ---
export default function PinpointDashboard() {
    const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'TRAINER' | 'STUDENT'>('SUPER_ADMIN');
    const [activeTab, setActiveTab] = useState('LIVE_FEED');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrTimer, setQrTimer] = useState(60);
    const [isGeoFenceOn, setIsGeoFenceOn] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // QR Heartbeat Timer
    useEffect(() => {
        let timer: any;
        if (isQrModalOpen && qrTimer > 0) {
            timer = setInterval(() => setQrTimer(prev => prev - 1), 1000);
        } else if (qrTimer === 0) {
            setQrTimer(60); // Reset for next rotation
        }
        return () => clearInterval(timer);
    }, [isQrModalOpen, qrTimer]);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #f0f4f8 0%, #ffffff 100%)', padding: '40px', color: '#1e1b4b' }}>
            
            {/* ROLE SWITCHER / NAV NEXUS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '22px', background: 'linear-gradient(135deg, #6d28d9, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(109,40,217,0.2)' }}>
                        <Activity color="#fff" size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.6rem', ...gradientText('#1e1b4b', '#6d28d9'), letterSpacing: '-2px' }}>Pinpoint<span style={{ color: '#6d28d9' }}>Core</span></h1>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>V2.4 • INDUSTRIAL ATTENDANCE HUB</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
                    {['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'STUDENT'].map((r) => (
                        <button 
                            key={r}
                            onClick={() => setRole(r as any)}
                            style={{ padding: '10px 18px', borderRadius: '14px', border: 'none', background: role === r ? '#fff' : 'transparent', color: role === r ? '#6d28d9' : '#64748b', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', boxShadow: role === r ? '0 10px 20px rgba(0,0,0,0.1)' : 'none', transition: '0.3s' }}
                        >
                            {r.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 380px', gap: '30px' }}>
                
                {/* SIDE NAVIGATION PANEL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                        { id: 'LIVE_FEED', label: 'Monitor Hub', icon: Activity },
                        { id: 'ANALYTICS', label: 'Presence Analytics', icon: BarChart3 },
                        { id: 'FRAUD', label: 'Fraud Detection', icon: Shield },
                        { id: 'ROSTER', label: 'Batch Directory', icon: List },
                        { id: 'GEOMAP', label: 'Geo-Fence Map', icon: MapPin },
                        { id: 'AUDIT', label: 'System Logs', icon: Clock }
                    ].map((item) => (
                        <motion.button 
                            key={item.id}
                            whileHover={{ x: 10 }}
                            onClick={() => setActiveTab(item.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '18px 24px', borderRadius: '20px', border: 'none', background: activeTab === item.id ? '#6d28d9' : 'transparent', color: activeTab === item.id ? '#fff' : '#64748b', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: '0.3s', textAlign: 'left' }}
                        >
                            <item.icon size={20} />
                            {item.label}
                            {item.id === 'FRAUD' && role === 'SUPER_ADMIN' && <div style={{ marginLeft: 'auto', background: '#ef4444', height: 8, width: 8, borderRadius: '50%' }} />}
                        </motion.button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: '30px', ...glassStyle, background: 'linear-gradient(to bottom, #1e1b4b, #6d28d9)', border: 'none' }}>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '1px' }}>HUB HEALTH</p>
                        <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'flex-end' }}>
                            {[30, 60, 45, 90, 70, 85].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: '#10b981', borderRadius: '2px' }} />
                            ))}
                        </div>
                        <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900, marginTop: '20px' }}>99.9% Uptime</p>
                    </div>
                </div>

                {/* CENTRAL MONITORING COMMAND */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* STATS STRIP */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {[
                            { label: 'Active Today', value: '1,242', icon: Users, color: '#6d28d9' },
                            { label: 'Sync Status', value: 'Real-time', icon: Signal, color: '#10b981' },
                            { label: 'Security Level', value: 'Tier 3', icon: Lock, color: '#6366f1' }
                        ].map((s, i) => (
                            <div key={i} style={{ ...glassStyle, padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '14px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={22} color={s.color} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{s.label}</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 900 }}>{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* MAIN ROSTER HUB */}
                    <div style={{ ...glassStyle, padding: '40px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Global Attendance Grid</h2>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ background: '#f8fafc', padding: '10px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', width: '300px' }}>
                                    <Search size={18} color="#94a3b8" />
                                    <input placeholder="Search batch, user, IP..." style={{ background: 'none', border: 'none', outline: 'none', fontWeight: 600, width: '100%' }} />
                                </div>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsQrModalOpen(true)} style={{ background: '#6d28d9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '16px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <QrCode size={20} /> GENERATE QR
                                </motion.button>
                            </div>
                        </div>

                        {/* TABLE VIEW */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { name: 'Karthik Aryan', batch: 'DS-2024', login: '09:02', device: 'iPhone 15', ip: '103.4.155.12', status: 'PRESENT' },
                                { name: 'Meera Deshmukh', batch: 'PY-2024', login: '09:45', device: 'Windows 11', ip: '192.168.1.4', status: 'LATE' },
                                { name: 'Suresh Raina', batch: 'DS-2024', login: '09:00', device: 'Android 14', ip: '103.4.155.12', status: 'PRESENT' }
                            ].map((row, idx) => (
                                <motion.div key={idx} whileHover={{ scale: 1.01 }} style={{ padding: '20px', background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 60px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <UserCircle size={22} color="#6d28d9" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 900, fontSize: '1rem' }}>{row.name}</p>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>ID: BT-902{idx}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontWeight: 800, color: '#64748b' }}>{row.batch}</p>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Smartphone size={14} color="#94a3b8" />
                                            <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{row.device}</p>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>IP: {row.ip}</p>
                                    </div>
                                    <div style={{ background: row.status === 'PRESENT' ? '#dcfce7' : '#fef9c3', color: row.status === 'PRESENT' ? '#166534' : '#854d0e', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 900, textAlign: 'center', width: 'fit-content' }}>
                                        {row.status}
                                    </div>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MoreHorizontal color="#cbd5e1" /></button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FRAUD & SYSTEM CONTROLS SIDEBAR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* FRAUD ALARMS */}
                    <div style={{ ...glassStyle, padding: '30px', background: 'linear-gradient(to bottom, #fee2e2, #ffffff)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b' }}>
                                <Shield size={20} /> Fraud Monitor
                            </h3>
                            <div style={{ background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900 }}>4 ACTIVE</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[
                                { user: 'Priya V.', msg: 'Multiple device login detected.', time: '2m ago' },
                                { user: 'Vikram S.', msg: 'VPN node from USA detected.', time: '5m ago' },
                                { user: 'Rahul K.', msg: 'Geo-fence violation (1.2km outside).', time: '12m ago' }
                            ].map((a, i) => (
                                <motion.div initial={{ x: 20 }} animate={{ x: 0 }} key={i} style={{ padding: '16px', background: '#fff', borderRadius: '20px', boxShadow: '0 5px 15px rgba(239, 68, 68, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 900 }}>{a.user}</p>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>{a.time}</p>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{a.msg}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* GEO-FENCE NEXUS */}
                    <div style={{ ...glassStyle, padding: '30px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={20} color="#6d28d9" /> Geo-Fence Policy
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>Hyderabad Hub</p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Active Radius: 200m</p>
                                </div>
                                <div 
                                    onClick={() => setIsGeoFenceOn(!isGeoFenceOn)}
                                    style={{ width: 44, height: 24, borderRadius: '50px', background: isGeoFenceOn ? '#10b981' : '#e2e8f0', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                                >
                                    <motion.div animate={{ x: isGeoFenceOn ? 22 : 2 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2 }} />
                                </div>
                            </div>

                            <div style={{ height: '150px', background: '#f1f5f9', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: '#6d28d9' }} />
                                <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#fff', padding: '6px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900, color: '#6d28d9', border: '1px solid rgba(0,0,0,0.05)' }}>
                                    HYD-SIG-9
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                style={{ width: '100%', padding: '15px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '0.85rem', color: '#1e1b4b', cursor: 'pointer' }}
                            >
                                CONFIGURE BOUNDARIES
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR GENERATOR MODAL */}
            <AnimatePresence>
                {isQrModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(30,27,75,0.7)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            style={{ ...glassStyle, padding: '50px', maxWidth: '500px', width: '100%', textAlign: 'center', position: 'relative' }}
                        >
                            <button 
                                onClick={() => setIsQrModalOpen(false)}
                                style={{ position: 'absolute', top: '30px', right: '30px', background: '#f8fafc', border: 'none', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <XCircle size={24} color="#64748b" />
                            </button>

                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>Security Session QR</h2>
                            <p style={{ color: '#64748b', fontWeight: 700, marginBottom: '40px' }}>Dynamic token for {role} verification.</p>

                            <div style={{ width: 260, height: 260, background: '#fff', borderRadius: '40px', padding: '30px', margin: '0 auto 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#6d28d9', animation: 'scan 2.5s infinite linear' }} />
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BYTECODE-SESSION-${Date.now()}`} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                                <div>
                                    <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#6d28d9' }}>{qrTimer}s</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>ROTATING TOKEN</p>
                                </div>
                                <div style={{ width: '1px', background: '#e2e8f0' }} />
                                <div>
                                    <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>LIVE</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>READY TO SCAN</p>
                                </div>
                            </div>

                            <button style={{ width: '100%', padding: '20px', borderRadius: '20px', background: '#1e1b4b', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <Download size={20} /> SAVE HUB KEY
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>
                {`
                    @keyframes scan {
                        0% { top: 10%; }
                        50% { top: 90%; }
                        100% { top: 10%; }
                    }
                `}
            </style>
        </div>
    );
}

const XCircle = ({ size, color }: { size: number, color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);
