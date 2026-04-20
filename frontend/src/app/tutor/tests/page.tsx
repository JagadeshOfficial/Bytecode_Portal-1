"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    CheckCircle, Plus, Search, Clock, AlertCircle,
    Users, FileText, BarChart2, Eye, Play
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorTestsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        const result = await fetchJsonSafe<any[]>('http://localhost:8080/api/academic/exams');
        if (result.ok && Array.isArray(result.data)) {
            setExams(result.data);
        }
        setLoading(false);
    };

    const filteredExams = exams.filter(e => 
        (e.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = exams.filter(e => e.status === 'ACTIVE').length;
    const completedCount = exams.filter(e => e.status === 'COMPLETED').length;
    const draftCount = exams.filter(e => e.status === 'DRAFT').length;

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Tests & Exams</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Create and manage student assessments.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> CREATE TEST
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #10b981' }}>
                        <CheckCircle size={24} color="#10b981" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>ACTIVE</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{activeCount}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #3b82f6' }}>
                        <BarChart2 size={24} color="#3b82f6" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>COMPLETED</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{completedCount}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #f59e0b' }}>
                        <FileText size={24} color="#f59e0b" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>DRAFT</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{draftCount}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={20} color="var(--text-dim)" />
                        <input type="text" placeholder="Search tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 0', color: '#fff', outline: 'none', fontSize: '1rem' }} />
                    </div>
                </div>

                <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading tests...</div>
                    ) : filteredExams.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>No tests found. Create your first test!</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                                    <th style={{ padding: '20px' }}>Test Title</th>
                                    <th style={{ padding: '20px' }}>Batch</th>
                                    <th style={{ padding: '20px' }}>Duration</th>
                                    <th style={{ padding: '20px' }}>Questions</th>
                                    <th style={{ padding: '20px' }}>Status</th>
                                    <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExams.map((e, i) => (
                                    <motion.tr key={e.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '20px', fontWeight: 800 }}>{e.title}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)' }}>{e.batch?.name || 'All Batches'}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)' }}>{e.duration || 60} min</td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)' }}>{e.questions?.length || 0}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900,
                                                background: e.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : e.status === 'COMPLETED' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: e.status === 'ACTIVE' ? '#10b981' : e.status === 'COMPLETED' ? '#3b82f6' : '#f59e0b'
                                            }}>
                                                {e.status || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#fff' }} title="View">
                                                    <Eye size={16} />
                                                </button>
                                                <button style={{ background: 'var(--primary)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#000' }} title="Launch">
                                                    <Play size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}