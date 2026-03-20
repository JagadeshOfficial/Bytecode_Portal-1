"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Layers, Plus, Search, Edit2, Trash2, 
    Users, Clock, User, BookOpen, ChevronRight,
    Play
} from 'lucide-react';

export default function BatchManagement() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [trainers, setTrainers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        courseId: '',
        trainerId: '',
        startTime: '',
        endTime: '',
        startDate: '',
        status: 'ACTIVE'
    });

    const fetchAll = () => {
        setLoading(true);
        Promise.all([
            fetch('http://localhost:8081/api/batches').then(res => res.json()),
            fetch('http://localhost:8083/api/courses').then(res => res.json()),
            fetch('http://localhost:8082/api/users').then(res => res.json().then(users => users.filter((u: any) => u.role === 'TRAINER')))
        ]).then(([batchesData, coursesData, trainersData]) => {
            setBatches(batchesData);
            setCourses(coursesData);
            setTrainers(trainersData);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = selectedBatch 
            ? `http://localhost:8081/api/batches/${selectedBatch.id}` 
            : 'http://localhost:8081/api/batches';
        const method = selectedBatch ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchAll();
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
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Batch Architecture</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Map courses to active cohorts and assign production trainers.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> INITIALIZE NEW BATCH
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
                    {loading ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', fontWeight: 800 }}>SYNCING BATCH NODES...</p>
                    ) : batches.map((b, i) => (
                        <motion.div 
                            key={b.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel" 
                            style={{ padding: '2.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ height: '50px', width: '50px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                    <Layers size={24} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ActionButton icon={<Edit2 size={16} />} />
                                    <ActionButton icon={<Trash2 size={16} />} color="#ef4444" />
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.25rem' }}>{b.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                    <BookOpen size={14} /> Mapping: {courses.find(c => c.id === b.courseId)?.title || 'Unmapped Course'}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Assigned Tutor</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, marginTop: '4px' }}>{trainers.find(t => t.id === b.trainerId)?.fullName || 'Pending'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cadence</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, marginTop: '4px' }}>{b.startTime} - {b.endTime}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Users size={18} color="var(--primary)" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>45 Enrolled</span>
                                </div>
                                <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800 }}>LIVE_READY</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
                         <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '3rem', borderRadius: '40px' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Configure Batch Node</h2>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>BATCH COHORT NAME</label>
                                    <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Masterclass_Spring_24" style={inputStyle} />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>COURSE CLUSTER</label>
                                        <select value={formData.courseId} onChange={(e) => setFormData({...formData, courseId: e.target.value})} style={inputStyle}>
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>ASSIGNED TUTOR</label>
                                        <select value={formData.trainerId} onChange={(e) => setFormData({...formData, trainerId: e.target.value})} style={inputStyle}>
                                            <option value="">Select Trainer</option>
                                            {trainers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>ABORT</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '14px', borderRadius: '16px', fontWeight: 800 }}>DEPLOY BATCH</button>
                                </div>
                            </form>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function ActionButton({ icon, color, onClick }: any) {
    return (
        <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: color || 'var(--text-bright)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>{icon}</button>
    );
}

const inputStyle = {
    padding: '14px 18px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit'
};
