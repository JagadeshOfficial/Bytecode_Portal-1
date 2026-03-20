"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Video, Plus, Search, Edit2, Trash2, 
    Folder, Activity, Upload, Play,
    Share2, Lock, MoreHorizontal
} from 'lucide-react';

export default function RecordingsManagement() {
    const [recordings, setRecordings] = useState<any[]>([]);

    useEffect(() => {
        setRecordings([
            { id: 1, title: 'Spring Microservices Introduction', batch: 'J1_APRIL', size: '1.2 GB', duration: '1h 45m', folder: 'Java Full Stack' },
            { id: 2, title: 'React Virtual DOM Deep Dive', batch: 'R2_MAY', size: '2.4 GB', duration: '2h 10m', folder: 'Frontend Mastery' },
            { id: 3, title: 'AWS EC2 & S3 Deployment', batch: 'D1_JUNE', size: '1.8 GB', duration: '1h 55m', folder: 'Cloud/DevOps' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Global Recordings Asset Hub</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect the VOD infrastructure and access control levels.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-quantum" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <Folder size={18} style={{ marginRight: '8px' }} /> NEW FOLDER
                        </button>
                        <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                            <Upload size={18} style={{ marginRight: '8px' }} /> UPLOAD MANUAL
                        </button>
                    </div>
                </div>

                {/* --- FOLDER VIEW --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <FolderCard name="Java Full Stack" items={42} />
                    <FolderCard name="Frontend Mastery" items={28} />
                    <FolderCard name="Cloud/DevOps" items={15} />
                    <FolderCard name="AI/ML Specialized" items={12} />
                </div>

                {/* --- RECENT RECORDINGS --- */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Production Artifacts</h3>
                        <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 700 }}>
                            <Search size={16} color="var(--text-dim)" style={{ marginRight: '10px' }} /> Search Recordings...
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                            <thead>
                                <tr style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Asset Title</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Runtime</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Storage Node</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Access Rank</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recordings.map((r, i) => (
                                    <motion.tr 
                                        key={r.id} 
                                        initial={{ opacity: 0, x: -5 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        transition={{ delay: i * 0.1 }}
                                        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}
                                    >
                                        <td style={{ padding: '15px 20px', borderRadius: '12px 0 0 12px', fontWeight: 800 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', borderRadius: '10px' }}>
                                                    <Play size={18} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 900 }}>{r.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Batch: {r.batch}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-dim)', fontWeight: 800, fontSize: '0.85rem' }}>{r.duration}</td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-dim)', fontWeight: 800, fontSize: '0.85rem' }}>{r.size}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 900 }}>PUBLIC_READ</span>
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <ActionButton icon={<Share2 size={16} />} />
                                                <ActionButton icon={<Lock size={16} />} />
                                                <ActionButton icon={<Trash2 size={16} />} color="#ef4444" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function FolderCard({ name, items }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'all 0.3s' }}>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}>
                <Folder size={24} />
            </div>
            <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>{items} Artifacts</div>
            </div>
        </div>
    );
}

function ActionButton({ icon, color, onClick }: any) {
    return (
        <button onClick={onClick} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: color || 'var(--text-bright)', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>{icon}</button>
    );
}
