"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Video, Plus, Search, Edit2, Trash2, 
    Calendar, Users, Clock, Play, 
    Signal, CheckCircle, Radio
} from 'lucide-react';

export default function LiveClassManagement() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8081/api/batches').then(res => res.json()).then(data => setBatches(data));
        // Mocking sessions for now as academic-service sessions endpoint might need setup
        setSessions([
            { id: 1, title: 'Spring Boot Advanced', batch: 'J1_APRIL', trainer: 'Vamsi Krishna', status: 'LIVE', start: '10:00 AM' },
            { id: 2, title: 'React Performance', batch: 'R2_MAY', trainer: 'Sai Kiran', status: 'SCHEDULED', start: '12:30 PM' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem' }}>
                            <Radio size={14} className="pulse" /> BROADCAST CONTROL
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Global Class Scheduler</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Monitor live streams, track attendance, and manage tuner access.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> SCHEDULE SESSION
                    </button>
                </div>

                {/* --- LIVE NOW SECTION --- */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Signal size={20} color="#ef4444" /> Active Streams
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                        {sessions.filter(s => s.status === 'LIVE').map(s => (
                            <LiveSessionCard key={s.id} {...s} />
                        ))}
                    </div>
                </div>

                {/* --- SCHEDULED SESSIONS --- */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem' }}>Upcoming Transmissions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {sessions.filter(s => s.status === 'SCHEDULED').map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Batch: {s.batch} • {s.trainer}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{s.start}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>T-MINUS 2H</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function LiveSessionCard({ title, batch, trainer }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '6px solid #ef4444', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ef4444', letterSpacing: '2px', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '111px' }}>● LIVE BROADCAST</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}><Users size={14} style={{ marginRight: '5px' }} /> 142 Viewing</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Batch: {batch} • Managed by {trainer}</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                <button style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>JOIN STREAM</button>
                <button style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>OVERSEE</button>
            </div>
        </div>
    );
}
