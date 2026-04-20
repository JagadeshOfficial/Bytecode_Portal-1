"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    FileText, Plus, Search, Clock, CheckCircle,
    AlertCircle, Users, Calendar, Filter
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorAssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        const result = await fetchJsonSafe<any[]>('http://localhost:8080/api/academic/assignments');
        if (result.ok && Array.isArray(result.data)) {
            setAssignments(result.data);
        }
        setLoading(false);
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = (a.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        if (filterStatus === 'ALL') return matchesSearch;
        return matchesSearch && a.status === filterStatus;
    });

    const pendingCount = assignments.filter(a => a.status === 'PENDING').length;
    const submittedCount = assignments.filter(a => a.status === 'SUBMITTED').length;
    const gradedCount = assignments.filter(a => a.status === 'GRADED').length;

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Assignments</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Create and manage student assignments.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} /> CREATE ASSIGNMENT
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #f59e0b' }}>
                        <Clock size={24} color="#f59e0b" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>PENDING</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{pendingCount}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #3b82f6' }}>
                        <Users size={24} color="#3b82f6" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>SUBMITTED</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{submittedCount}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #10b981' }}>
                        <CheckCircle size={24} color="#10b981" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>GRADED</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{gradedCount}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={20} color="var(--text-dim)" />
                        <input type="text" placeholder="Search assignments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', background: 'none', border: 'none', padding: '1rem 0', color: '#fff', outline: 'none', fontSize: '1rem' }} />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="GRADED">Graded</option>
                    </select>
                </div>

                <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading assignments...</div>
                    ) : filteredAssignments.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>No assignments found.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                                    <th style={{ padding: '20px' }}>Title</th>
                                    <th style={{ padding: '20px' }}>Batch</th>
                                    <th style={{ padding: '20px' }}>Due Date</th>
                                    <th style={{ padding: '20px' }}>Status</th>
                                    <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map((a, i) => (
                                    <motion.tr key={a.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '20px', fontWeight: 800 }}>{a.title}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)' }}>{a.batch?.name || 'All Batches'}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)' }}>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No due date'}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900,
                                                background: a.status === 'GRADED' ? 'rgba(16, 185, 129, 0.1)' : a.status === 'SUBMITTED' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: a.status === 'GRADED' ? '#10b981' : a.status === 'SUBMITTED' ? '#3b82f6' : '#f59e0b'
                                            }}>
                                                {a.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}>
                                                View
                                            </button>
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