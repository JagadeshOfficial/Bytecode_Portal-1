"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Video, Plus, Search, Edit2, Trash2, 
    Calendar, Users, Clock, Play, 
    Signal, CheckCircle, Radio, XCircle
} from 'lucide-react';

export default function LiveClassManagement() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [newSession, setNewSession] = useState({
        title: '',
        description: '',
        batchId: '',
        mentorId: '',
        startTime: '',
        platform: 'ZOOM',
        meetingLink: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const batchRes = await fetch('http://localhost:8080/api/academic/batches');
                if (batchRes.ok) setBatches(await batchRes.json());
                
                const sessionRes = await fetch('http://localhost:8080/api/academic/sessions');
                if (sessionRes.ok) setSessions(await sessionRes.json());

                const userRes = await fetch('http://localhost:8080/api/users');
                if (userRes.ok) setAllUsers(await userRes.json());
            } catch (err) {
                console.error("Error fetching live classes data:", err);
            }
        };
        fetchData();
    }, []);

    const handleSchedule = async (e: any) => {
        e.preventDefault();
        const selectedBatch = batches.find(b => b.id === newSession.batchId);
        const selectedMentor = allUsers.find(u => u.id === newSession.mentorId);

        const payload = {
            ...newSession,
            batchName: selectedBatch?.batchName,
            mentorName: selectedMentor?.fullName,
            courseId: selectedBatch?.courseId,
            courseName: selectedBatch?.courseName,
            status: 'UPCOMING',
            createdAt: new Date()
        };

        try {
            const res = await fetch('http://localhost:8080/api/academic/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const saved = await res.json();
                setSessions([...sessions, saved]);
                setIsModalOpen(false);
                setNewSession({ title: '', description: '', batchId: '', mentorId: '', startTime: '', platform: 'ZOOM', meetingLink: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const session = sessions.find(s => s.id === id);
        if (!session) return;

        try {
            const res = await fetch(`http://localhost:8080/api/academic/sessions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...session, status })
            });
            if (res.ok) {
                const updated = await res.json();
                setSessions(sessions.map(s => s.id === id ? updated : s));
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    <button onClick={() => setIsModalOpen(true)} className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> SCHEDULE SESSION
                    </button>
                </div>

                {/* --- SCHEDULE MODAL --- */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ width: '95%', maxWidth: '600px', padding: 0.5, borderRadius: '40px', overflow: 'hidden' }}>
                                <div style={{ background: 'var(--primary)', padding: '2rem', color: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>SCHEDULE NEW SESSION</h2>
                                    <XCircle size={24} style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(false)} />
                                </div>
                                <form onSubmit={handleSchedule} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>SESSION TITLE</label>
                                            <input required value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>BATCH</label>
                                            <select required value={newSession.batchId} onChange={e => setNewSession({...newSession, batchId: e.target.value})} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
                                                <option value="">Select Batch</option>
                                                {batches.map(b => <option key={b.id} value={b.id}>{b.batchName}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>TRAINER/TUTOR</label>
                                            <select required value={newSession.mentorId} onChange={e => setNewSession({...newSession, mentorId: e.target.value})} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
                                                <option value="">Select Mentor</option>
                                                {allUsers.filter(u => u.role === 'TRAINER' || u.role === 'SUPER_ADMIN').map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>START TIME</label>
                                            <input required type="datetime-local" value={newSession.startTime} onChange={e => setNewSession({...newSession, startTime: e.target.value})} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>MEETING PLATFORM</label>
                                            <select required value={newSession.platform} onChange={e => setNewSession({...newSession, platform: e.target.value})} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
                                                <option value="BYTECODE">Bytecode Internal (Recommended)</option>
                                                <option value="ZOOM">Zoom Cloud</option>
                                                <option value="GOOGLE_MEET">Google Meet</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>MEETING LINK / ROOM ID</label>
                                            <input required value={newSession.meetingLink} onChange={e => setNewSession({...newSession, meetingLink: e.target.value})} placeholder={newSession.platform === 'BYTECODE' ? "Room Name (e.g. JavaStudy)" : "https://zoom.us/j/..."} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                                        <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '14px', borderRadius: '16px', fontWeight: 900 }}>SCHEDULE TRANSMISSION</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- LIVE NOW SECTION --- */}
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Signal size={20} color="#ef4444" /> Active Streams
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                        {sessions.filter(s => s.status === 'LIVE').map(s => (
                            <LiveSessionCard key={s.id} {...s} onJoin={() => s.platform === 'BYTECODE' ? router.push(`/super-admin/live/room/${s.meetingLink}`) : window.open(s.meetingLink, '_blank')} onEnd={() => handleUpdateStatus(s.id, 'COMPLETED')} />
                        ))}
                    </div>
                </div>

                {/* --- SCHEDULED SESSIONS --- */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem' }}>Upcoming Transmissions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {sessions.filter(s => s.status === 'UPCOMING').map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Batch: {s.batchName} • {s.mentorName} • {s.platform === 'BYTECODE' ? 'Internal Meet' : s.platform}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>{new Date(s.startTime).toLocaleDateString()}</div>
                                    </div>
                                    <button onClick={() => handleUpdateStatus(s.id, 'LIVE')} style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>START LIVE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function LiveSessionCard({ title, batchName, mentorName, onJoin, onEnd }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '6px solid #ef4444', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#ef4444', letterSpacing: '2px', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '111px' }}>● LIVE BROADCAST</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}><Users size={14} style={{ marginRight: '5px' }} /> Tracking Active</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Batch: {batchName} • Managed by {mentorName}</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                <button onClick={onJoin} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>JOIN STREAM</button>
                <button onClick={onEnd} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>END SESSION</button>
            </div>
        </div>
    );
}
