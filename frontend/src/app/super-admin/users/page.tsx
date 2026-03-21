"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    Users, Plus, Search, Edit2, Trash2, 
    CheckCircle, XCircle, Filter, ChevronDown, 
    MoreHorizontal, Shield, UserCheck, Mail,
    Eye, BookOpen, Clock, DollarSign, Calendar,
    FileText, User as UserIcon, Book, MessageSquare,
    HelpCircle, Inbox
} from 'lucide-react';

const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'HR', 'COUNSELOR', 'FINANCE', 'STUDENT'];

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('ALL');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [trainerBatches, setTrainerBatches] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({ 
        fullName: '', email: '', password: 'Bytecode@1354', role: 'STUDENT', active: true,
        salary: 0, deductions: 0, leavesTotal: 0, leavesAccepted: 0, leavesRejected: 0,
        leaveHistory: [], requirementRequests: []
    });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

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

    const fetchTrainerBatches = async (trainerId: string) => {
        try {
            const res = await fetch(`http://localhost:8089/api/academic/batches/trainer/${trainerId}`);
            if (res.ok) {
                const data = await res.json();
                setTrainerBatches(data);
            }
        } catch (err) {
            console.error("Error fetching trainer batches:", err);
        }
    };

    const handleOpenEditModal = (user: any = null) => {
        if (user) {
            setSelectedUser(user);
            setFormData({ 
                fullName: user.fullName || '', 
                email: user.email || '', 
                password: user.password || 'Bytecode@1354', 
                role: user.role || 'STUDENT', 
                active: user.active !== undefined ? user.active : true,
                salary: user.salary || 0,
                deductions: user.deductions || 0,
                leavesTotal: user.leavesTotal || 0,
                leavesAccepted: user.leavesAccepted || 0,
                leavesRejected: user.leavesRejected || 0,
                leaveHistory: user.leaveHistory || [],
                requirementRequests: user.requirementRequests || []
            });
        } else {
            setSelectedUser(null);
            setFormData({ 
                fullName: '', email: '', password: 'Bytecode@1354', role: 'STUDENT', active: true,
                salary: 0, deductions: 0, leavesTotal: 0, leavesAccepted: 0, leavesRejected: 0,
                leaveHistory: [], requirementRequests: []
            });
        }
        setIsEditModalOpen(true);
    };

    const handleViewDetails = (user: any) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
        if (user.role === 'TRAINER') {
            fetchTrainerBatches(user.id);
        }
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
                    attendanceRate: selectedUser?.attendanceRate || 92.5
                })
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchUsers();
                showNotification(selectedUser ? 'User updated successfully!' : 'New user added successfully!');
            } else {
                showNotification('Error saving user.', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Server connection failed.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`http://localhost:8082/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchUsers();
                showNotification('User deleted successfully.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (
            (u.fullName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeTab === 'ALL') return matchesSearch;
        if (activeTab === 'STUDENT') return matchesSearch && u.role === 'STUDENT';
        if (activeTab === 'TRAINER') return matchesSearch && u.role === 'TRAINER';
        if (activeTab === 'STAFF') {
            return matchesSearch && ['HR', 'COUNSELOR', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(u.role);
        }
        return matchesSearch;
    });

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* --- PAGE HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>User Management</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage system accounts and user permissions.</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenEditModal()}
                        className="btn-quantum" 
                        style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> ADD NEW USER
                    </motion.button>
                </div>

                {/* --- ROLE FILTER TABS --- */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '10px' }}>
                    {['ALL', 'STUDENT', 'TRAINER', 'STAFF'].map(role => (
                        <button 
                            key={role}
                            onClick={() => setActiveTab(role)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                background: activeTab === role ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                border: activeTab === role ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                color: activeTab === role ? '#000' : 'var(--text-dim)',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {role === 'TRAINER' ? 'TUTORS' : role === 'STAFF' ? 'STAFF / HR / ADMIN' : role}
                        </button>
                    ))}
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

                {/* --- USERS TABLE --- */}
                <div className="glass-panel" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <th style={{ padding: '20px' }}>User Details</th>
                                    <th style={{ padding: '20px' }}>Role</th>
                                    <th style={{ padding: '20px' }}>Status</th>
                                    <th style={{ padding: '20px' }}>Joined Date</th>
                                    <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', fontWeight: 'bold' }}>FETCHING USERS...</td></tr>
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
                                                           u.fullName?.charAt(0) || u.email?.charAt(0).toUpperCase()
                                                      )}
                                                 </div>
                                                 <div>
                                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                         <span style={{ fontWeight: 800, color: 'var(--text-bright)' }}>{u.fullName || u.name || 'Anonymous User'}</span>
                                                         <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}> ({u.email})</span>
                                                     </div>
                                                 </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                 <div style={{ 
                                                     width: '8px', 
                                                     height: '8px', 
                                                     borderRadius: '50%', 
                                                     background: u.role === 'SUPER_ADMIN' ? '#ef4444' : u.role === 'TRAINER' ? '#8b5cf6' : '#3b82f6' 
                                                 }} />
                                                 <span style={{ 
                                                     color: u.role === 'SUPER_ADMIN' ? '#ef4444' : u.role === 'TRAINER' ? '#8b5cf6' : '#3b82f6',
                                                     fontSize: '0.75rem',
                                                     fontWeight: 800,
                                                     letterSpacing: '0.5px'
                                                 }}>{u.role?.replace('_', ' ')}</span>
                                             </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: u.active ? '#10b981' : '#ed4e4e' }}>
                                                {u.active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.active ? 'ACTIVE' : 'INACTIVE'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'New User'}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <ActionButton icon={<Eye size={16} />} color="var(--primary)" onClick={() => handleViewDetails(u)} />
                                                <ActionButton icon={<Edit2 size={16} />} onClick={() => handleOpenEditModal(u)} />
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

            {/* --- DETAILED VIEW MODAL --- */}
            <AnimatePresence>
                {isDetailModalOpen && selectedUser && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }}>
                         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel" style={{ width: '95%', maxWidth: '900px', padding: 0, borderRadius: '40px', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '3rem', position: 'relative' }}>
                                <button onClick={() => setIsDetailModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><XCircle size={24} /></button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '30px', background: '#fff', padding: '5px' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '25px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {selectedUser.profileImage ? <img src={selectedUser.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={64} color="#ccc" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000', letterSpacing: '-1px' }}>{selectedUser.fullName}</h2>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <span style={{ background: '#000', color: 'var(--primary)', padding: '5px 15px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900 }}>{selectedUser.role}</span>
                                            <span style={{ background: 'rgba(0,0,0,0.1)', color: '#000', padding: '5px 15px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900 }}>{selectedUser.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
                                {/* --- STATS GRID --- */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>Employment Details</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <InfoCard icon={<DollarSign size={18} />} label="Monthly Salary" value={`₹${selectedUser.salary || '0.00'}`} />
                                        <InfoCard icon={<FileText size={18} />} label="Deductions" value={`₹${selectedUser.deductions || '0.00'}`} />
                                        <InfoCard icon={<UserCheck size={18} />} label="Attendance" value={`${selectedUser.attendanceRate || '92.5'}%`} />
                                        <InfoCard icon={<Calendar size={18} />} label="Total Leaves" value={selectedUser.leavesTotal || 0} />
                                    </div>
                                    
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-around' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>ACCEPTED</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{selectedUser.leavesAccepted || 0}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>REJECTED</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444' }}>{selectedUser.leavesRejected || 0}</div>
                                        </div>
                                    </div>

                                    {/* --- COMMUNICATION SECTION --- */}
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid var(--primary)', paddingLeft: '1rem', marginTop: '1rem' }}>Requirements & Questions</h3>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', minHeight: '100px' }}>
                                         {selectedUser.requirementRequests?.length > 0 ? (
                                              selectedUser.requirementRequests.map((req: string, i: number) => (
                                                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.85rem' }}>
                                                      <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                                                      <p>{req}</p>
                                                  </div>
                                              ))
                                         ) : (
                                              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No pending requests or questions.</p>
                                         )}
                                    </div>
                                </div>

                                {/* --- ROLE SPECIFIC SECTION --- */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {selectedUser.role === 'TRAINER' ? (
                                        <>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>Assigned Batches</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                                                {trainerBatches.length > 0 ? trainerBatches.map((b, idx) => (
                                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                <Clock size={12} /> {b.startTime} - {b.endTime}
                                                            </div>
                                                        </div>
                                                        <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>
                                                            <BookOpen size={12} style={{ marginRight: '5px' }} /> ACADEMIC
                                                        </div>
                                                    </div>
                                                )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>No batches assigned yet.</p>}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>Leave History</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                                                {selectedUser.leaveHistory?.length > 0 ? selectedUser.leaveHistory.map((leave: string, idx: number) => (
                                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                            <Inbox size={18} color="var(--primary)" />
                                                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{leave}</div>
                                                        </div>
                                                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-dim)' }}>PROCESSED</span>
                                                    </div>
                                                )) : (
                                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.01)', borderRadius: '20px' }}>
                                                        <MessageSquare size={32} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
                                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No historical leave records found.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- EDIT MODAL --- */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{ width: '95%', maxWidth: '700px', padding: '2.5rem', borderRadius: '32px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>{selectedUser ? 'Edit User Details' : 'Create New User'}</h2>
                            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>FULL NAME</label>
                                    <input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. John Doe" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>EMAIL ADDRESS</label>
                                    <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@bytecode.com" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>USER ROLE</label>
                                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={inputStyle}>
                                        {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <h3 style={{ gridColumn: '1/-1', fontSize: '0.85rem', fontWeight: 900, marginTop: '1rem', color: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '5px' }}>HR & FINANCE SETTINGS</h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>MONTHLY SALARY (₹)</label>
                                    <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: parseFloat(e.target.value)})} style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>DEDUCTIONS (₹)</label>
                                    <input type="number" value={formData.deductions} onChange={(e) => setFormData({...formData, deductions: parseFloat(e.target.value)})} style={inputStyle} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>TOTAL LEAVES</label>
                                    <input type="number" value={formData.leavesTotal} onChange={(e) => setFormData({...formData, leavesTotal: parseInt(e.target.value)})} style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>ACCEPTED LEAVES</label>
                                    <input type="number" value={formData.leavesAccepted} onChange={(e) => setFormData({...formData, leavesAccepted: parseInt(e.target.value)})} style={inputStyle} />
                                </div>

                                <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Account Active</span>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', gridColumn: '1/-1' }}>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                                    <button type="submit" className="btn-quantum" style={{ flex: 2, padding: '12px', borderRadius: '12px', fontWeight: 800 }}>{selectedUser ? 'UPDATE PROFILE' : 'SAVE USER'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- NOTIFICATION TOAST --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        style={{ 
                            position: 'fixed', 
                            bottom: '2rem', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            zIndex: 10001,
                            background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            fontSize: '0.85rem'
                        }}
                    >
                        {notification.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function InfoCard({ icon, label, value }: any) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{value}</div>
        </div>
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
    width: '100%',
    fontFamily: 'inherit'
};
