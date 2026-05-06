"use client";
import { API_URLS } from '@/lib/api-config';


import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Users, Search, Edit2, Trash2,
    CheckCircle, XCircle, Eye, FileText,
    BookOpen, Calendar, MessageSquare
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorStudentsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`)
            .then((result) => {
                if (result.ok && Array.isArray(result.data)) {
                    setUsers(result.data.filter((u: any) => u.role === 'STUDENT'));
                } else {
                    setUsers([]);
                }
                setLoading(false);
            })
            .catch(() => {
                setUsers([]);
                setLoading(false);
            });
    };

    const filteredUsers = users.filter(u => 
        (u.fullName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewDetails = (user: any) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>My Students</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage and track your student progress.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ 
                        flex: 1, 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '16px', 
                        padding: '0 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <Search size={20} color="var(--text-dim)" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%', 
                                background: 'none', 
                                border: 'none', 
                                padding: '1.25rem 0', 
                                color: 'var(--text-bright)',
                                outline: 'none',
                                fontSize: '1rem'
                            }} 
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontWeight: 700, fontSize: '0.9rem' }}>
                    Showing {filteredUsers.length} students
                </div>

                <div className="glass-panel" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '20px' }}>Student Details</th>
                                <th style={{ padding: '20px' }}>Batch</th>
                                <th style={{ padding: '20px' }}>Status</th>
                                <th style={{ padding: '20px' }}>Attendance</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-dim)' }}>
                                        FETCHING STUDENTS...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', fontWeight: 800 }}>
                                        No students found.
                                    </td>
                                </tr>
                            ) : filteredUsers.map((u, i) => (
                                <motion.tr
                                    key={u.id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}
                                >
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', overflow: 'hidden' }}>
                                                {u.profileImage ? (
                                                    <img src={u.profileImage} alt={u.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    (u.fullName?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, color: 'var(--text-bright)' }}>{u.fullName || u.name || 'Anonymous User'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.batch || 'Not Assigned'}</span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: u.active ? '#10b981' : '#ed4e4e' }}>
                                            {u.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.active ? 'ACTIVE' : 'INACTIVE'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: (u.attendanceRate || 92) > 90 ? '#10b981' : '#f59e0b' }}>
                                            {u.attendanceRate || 92}%
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleViewDetails(u)}
                                            style={{ 
                                                background: 'rgba(255,255,255,0.03)', 
                                                border: '1px solid rgba(255,255,255,0.05)', 
                                                color: 'var(--text-bright)', 
                                                padding: '10px', 
                                                borderRadius: '10px', 
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {isDetailModalOpen && selectedUser && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel" style={{ width: '95%', maxWidth: '700px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '2rem', position: 'relative' }}>
                                <button onClick={() => setIsDetailModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><XCircle size={24} /></button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#fff', padding: '4px' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '16px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {selectedUser.profileImage ? <img src={selectedUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={40} color="#ccc" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#000', letterSpacing: '-1px' }}>{selectedUser.fullName}</h2>
                                        <p style={{ color: 'rgba(0,0,0,0.6)', fontWeight: 700 }}>{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                                    <BookOpen size={20} color="var(--primary)" />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>BATCH</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '4px' }}>{selectedUser.batch || 'Not Assigned'}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px' }}>
                                    <Calendar size={20} color="var(--primary)" />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>ATTENDANCE</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: '4px' }}>{selectedUser.attendanceRate || 92}%</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', gridColumn: '1/-1' }}>
                                    <FileText size={20} color="var(--primary)" />
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>NOTES</div>
                                    <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{selectedUser.notes || 'No notes available.'}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}