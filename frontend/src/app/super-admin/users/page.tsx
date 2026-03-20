"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Users, Plus, Search, Edit2, Trash2, 
    CheckCircle, XCircle, Filter, ChevronDown, 
    MoreHorizontal, Shield, UserCheck, Mail
} from 'lucide-react';

const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'HR', 'COUNSELOR', 'FINANCE', 'STUDENT'];

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: 'Bytecode@1354', role: 'STUDENT', active: true });

    const fetchUsers = () => {
        setLoading(true);
        fetch('http://localhost:8082/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({ 
                fullName: user.fullName || '', 
                email: user.email || '', 
                password: user.password || 'Bytecode@1354', 
                role: user.role || 'STUDENT', 
                active: user.active !== undefined ? user.active : true 
            });
        } else {
            setSelectedUser(null);
            setFormData({ fullName: '', email: '', password: 'Bytecode@1354', role: 'STUDENT', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = selectedUser 
            ? `http://localhost:8082/api/users/${selectedUser.id}` 
            : 'http://localhost:8082/api/users';
        const method = selectedUser ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    attendanceRate: selectedUser?.attendanceRate || 0.0 // Ensure primitive double isn't null
                })
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchUsers();
            } else {
                const err = await res.json();
                alert('Error processing user: ' + (err.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
        try {
            const res = await fetch(`http://localhost:8082/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u => 
        (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.role?.toString().includes(searchTerm.toUpperCase()))
    );

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* --- PAGE HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>User & Role Master</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Administer global credentials and infrastructure access.</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenModal()}
                        className="btn-quantum" 
                        style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> CREATE SYSTEM USER
                    </motion.button>
                </div>

                {/* --- FILTER & SEARCH BAR --- */}
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
                            placeholder="Find by name, email or access level..." 
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
                    <button style={{ padding: '0 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Filter size={18} /> FILTER
                    </button>
                </div>

                {/* --- USERS TABLE --- */}
                <div className="glass-panel" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <th style={{ padding: '20px' }}>User Details</th>
                                    <th style={{ padding: '20px' }}>Access Rank</th>
                                    <th style={{ padding: '20px' }}>Security Status</th>
                                    <th style={{ padding: '20px' }}>Verified Date</th>
                                    <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', fontWeight: 'bold' }}>ACCESSING RECORDS...</td></tr>
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
                                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>
                                                    {u.fullName?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#fff' }}>{u.fullName || 'Anonymous User'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Mail size={12} /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                background: u.role === 'SUPER_ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: u.role === 'SUPER_ADMIN' ? '#ef4444' : '#60a5fa',
                                                padding: '6px 14px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                letterSpacing: '0.5px'
                                            }}>{u.role?.replace('_', ' ')}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: u.active ? '#10b981' : '#ed4e4e' }}>
                                                {u.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.active ? 'ACTIVE' : 'LOCKED'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'SECURE_INIT'}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <ActionButton icon={<Edit2 size={16} />} onClick={() => handleOpenModal(u)} />
                                                <ActionButton icon={<Trash2 size={16} />} color="#ef4444" onClick={() => handleDelete(u.id)} />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* --- USER MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px' }}
                        >
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>{selectedUser ? 'Reconfigure Entity' : 'Initialize New Entity'}</h2>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>FULL LEGAL NAME</label>
                                    <input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. Director General" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>SECURED ACCESS EMAIL</label>
                                    <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="director@bytecode.com" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>CREDENTIAL LEVEL</label>
                                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>
                                            {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>SECURED PASS</label>
                                        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Entity Active & Verified</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer' }}>ABORT</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px', fontWeight: 800 }}>{selectedUser ? 'UPDATE PROTOCOLS' : 'FINALIZE ENTITY'}</button>
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
        <button 
            onClick={onClick}
            style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                color: color || 'var(--text-bright)', 
                padding: '10px', 
                borderRadius: '10px', 
                cursor: 'pointer' 
            }}
        >
            {icon}
        </button>
    );
}

const inputStyle = {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    width: '100%'
};
