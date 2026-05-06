"use client";
import { API_URLS } from '@/lib/api-config';


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
import { fetchJsonSafe } from '@/lib/fetchJson';

const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'TRAINER', 'HR', 'COUNSELOR', 'FINANCE', 'STUDENT'];

type DashboardRole = 'super_admin' | 'admin' | 'tutor';

export function UserManagementPage({ role = 'super_admin' }: { role?: DashboardRole } = {}) {
    const [activeTab, setActiveTab] = useState('ALL');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    
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

    const normalizeRole = (value: string) => String(value || '').trim().toUpperCase();

    const fetchUsers = () => {
        setLoading(true);
        fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/users`)
            .then((result) => {
                if (result.ok && Array.isArray(result.data)) {
                    setUsers(result.data);
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

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        try {
            setCurrentUser(JSON.parse(storedUser));
        } catch (err) {
            console.error('Failed to read current user from storage:', err);
        }
    }, []);

    const currentUserRole = String(currentUser?.role || role).toUpperCase();
    const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';
    const isAdmin = currentUserRole === 'ADMIN';
    const isFullAdmin = isSuperAdmin || isAdmin;
    
    const isProtectedForAdmin = (user: any) => isAdmin && normalizeRole(user?.role) === 'SUPER_ADMIN';

    const fetchTrainerBatches = async (trainerId: string) => {
        try {
            const result = await fetchJsonSafe<any[]>(`${API_URLS.LMS_BACKEND}/api/academic/batches/trainer/${trainerId}`);
            if (result.ok && Array.isArray(result.data)) {
                setTrainerBatches(result.data);
            }
        } catch (err) {
            setTrainerBatches([]);
        }
    };

    const handleOpenEditModal = (user: any = null) => {
        if (user && isProtectedForAdmin(user)) {
            showNotification('Admin cannot edit Super Admin accounts.', 'error');
            return;
        }

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
            ? `${API_URLS.LMS_BACKEND}/api/users/${selectedUser.id}` 
            : `${API_URLS.LMS_BACKEND}/api/users`;
        const method = selectedUser ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    attendanceRate: selectedUser?.attendanceRate || 92.5,
                    actingUserId: currentUser?.id || currentUser?._id || '',
                    actingUserRole: currentUserRole,
                })
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                fetchUsers();
                showNotification(selectedUser ? 'User updated successfully!' : 'New user added successfully!');
            } else {
                const payload = await res.json().catch(() => null);
                showNotification(payload?.error || 'Error saving user.', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Server connection failed.', 'error');
        }
    };

    const handleDelete = async (user: any) => {
        if (isProtectedForAdmin(user)) {
            showNotification('Admin cannot delete Super Admin accounts.', 'error');
            return;
        }

        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/users/${user.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actingUserId: currentUser?.id || currentUser?._id || '',
                    actingUserRole: currentUserRole,
                }),
            });
            if (res.ok) {
                fetchUsers();
                showNotification('User deleted successfully.');
            } else {
                const payload = await res.json().catch(() => null);
                showNotification(payload?.error || 'Unable to delete user.', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('Server connection failed.', 'error');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = (
            (u.fullName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        const normalizedRole = normalizeRole(u.role);

        if (activeTab === 'ALL') return matchesSearch;
        if (activeTab === 'STUDENT') return matchesSearch && normalizedRole === 'STUDENT';
        if (activeTab === 'TRAINER') return matchesSearch && normalizedRole === 'TRAINER';
        if (activeTab === 'STAFF') {
            return matchesSearch && ['HR', 'COUNSELOR', 'FINANCE', 'ADMIN', 'SUPER_ADMIN', 'PLACEMENT', 'SOCIAL_MEDIA', 'TUTOR'].includes(normalizedRole);
        }
        if (activeTab === 'REQUESTS') {
            return matchesSearch && u.requirementRequests?.length > 0;
        }
        return matchesSearch;
    });

    const handleLeaveApproval = async (user: any, requestIndex: number) => {
        if (!confirm('Approve this leave request?')) return;
        const requestText = user.requirementRequests[requestIndex];
        const updatedRequests = user.requirementRequests.filter((_: any, i: number) => i !== requestIndex);
        const updatedHistory = [...(user.leaveHistory || []), `APPROVED: ${requestText}`];
        
        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requirementRequests: updatedRequests,
                    leaveHistory: updatedHistory,
                    leavesAccepted: (user.leavesAccepted || 0) + 1,
                    actingUserId: currentUser?.id || currentUser?._id || '',
                    actingUserRole: currentUserRole,
                })
            });
            if (res.ok) {
                showNotification('Leave request approved.');
                fetchUsers();
                if (selectedUser?.id === user.id) {
                    setSelectedUser({ ...user, requirementRequests: updatedRequests, leaveHistory: updatedHistory, leavesAccepted: (user.leavesAccepted || 0) + 1 });
                }
            }
        } catch (err) {
            showNotification('Failed to approve request.', 'error');
        }
    };

    const handleLeaveRejection = async (user: any, requestIndex: number) => {
        if (!confirm('Reject this leave request?')) return;
        const requestText = user.requirementRequests[requestIndex];
        const updatedRequests = user.requirementRequests.filter((_: any, i: number) => i !== requestIndex);
        const updatedHistory = [...(user.leaveHistory || []), `REJECTED: ${requestText}`];

        try {
            const res = await fetch(`${API_URLS.LMS_BACKEND}/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requirementRequests: updatedRequests,
                    leaveHistory: updatedHistory,
                    leavesRejected: (user.leavesRejected || 0) + 1,
                    actingUserId: currentUser?.id || currentUser?._id || '',
                    actingUserRole: currentUserRole,
                })
            });
            if (res.ok) {
                showNotification('Leave request rejected.');
                fetchUsers();
                if (selectedUser?.id === user.id) {
                    setSelectedUser({ ...user, requirementRequests: updatedRequests, leaveHistory: updatedHistory, leavesRejected: (user.leavesRejected || 0) + 1 });
                }
            }
        } catch (err) {
            showNotification('Failed to reject request.', 'error');
        }
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const nameA = (a.fullName || a.name || a.email || '').toLowerCase();
        const nameB = (b.fullName || b.name || b.email || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return (
        <DashboardLayout role={role}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* --- PAGE HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>User Management</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage system accounts and user permissions.</p>
                    </div>
                    {isFullAdmin && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenEditModal()}
                            className="btn-quantum" 
                            style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Plus size={18} /> ADD NEW USER
                        </motion.button>
                    )}
                </div>

                {/* --- ROLE FILTER TABS --- */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '10px' }}>
                    {['ALL', 'STUDENT', 'TRAINER', 'STAFF', 'REQUESTS'].filter(r => isFullAdmin || r !== 'STAFF').map(role => {
                        const requestCount = users.filter(u => u.requirementRequests?.length > 0).length;
                        return (
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
                                    whiteSpace: 'nowrap',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {role === 'TRAINER' ? 'TUTORS' : role === 'STAFF' ? 'STAFF / HR / ADMIN' : role === 'REQUESTS' ? 'LEAVE REQUESTS' : role}
                                {role === 'REQUESTS' && requestCount > 0 && (
                                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px' }}>{requestCount}</span>
                                )}
                            </button>
                        );
                    })}
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

                <div style={{ marginBottom: '1rem', color: 'var(--text-dim)', fontWeight: 700, fontSize: '0.9rem' }}>
                    Showing {sortedUsers.length} users from the database
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-dim)' }}>
                                            FETCHING USERS...
                                        </td>
                                    </tr>
                                ) : sortedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', fontWeight: 800 }}>
                                            No users matched the selected filter.
                                        </td>
                                    </tr>
                                ) : sortedUsers.map((u, i) => (
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
                                                <ActionButton icon={<Eye size={16} />} color="var(--primary)" onClick={() => handleViewDetails(u)} title="View profile details" />
                                                {isFullAdmin && (
                                                    <>
                                                        <ActionButton
                                                            icon={<Edit2 size={16} />}
                                                            onClick={() => handleOpenEditModal(u)}
                                                            disabled={isProtectedForAdmin(u)}
                                                            title={isProtectedForAdmin(u) ? 'Admin cannot edit Super Admin accounts' : 'Edit user'}
                                                        />
                                                        <ActionButton
                                                            icon={<Trash2 size={16} />}
                                                            color="#ef4444"
                                                            onClick={() => handleDelete(u)}
                                                            disabled={isProtectedForAdmin(u)}
                                                            title={isProtectedForAdmin(u) ? 'Admin cannot delete Super Admin accounts' : 'Delete user'}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
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
                                                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                      <div style={{ display: 'flex', gap: '10px' }}>
                                                          <HelpCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                                                          <p style={{ margin: 0, fontSize: '0.85rem' }}>{req}</p>
                                                      </div>
                                                      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                           <button 
                                                                onClick={() => handleLeaveApproval(selectedUser, i)}
                                                                style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                                                            >APPROVE</button>
                                                           <button 
                                                                onClick={() => handleLeaveRejection(selectedUser, i)}
                                                                style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}
                                                            >REJECT</button>
                                                      </div>
                                                  </div>
                                              ))
                                         ) : (
                                              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No pending requests or questions.</p>
                                         )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* --- COMMON: LEAVE HISTORY --- */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid #ef4444', paddingLeft: '1rem' }}>Resolution History</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                                            {selectedUser.leaveHistory?.length > 0 ? [...selectedUser.leaveHistory].reverse().map((log: string, idx: number) => {
                                                const isApproved = log.startsWith('APPROVED:');
                                                return (
                                                    <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: `3px solid ${isApproved ? '#10b981' : '#ef4444'}`, fontSize: '0.8rem' }}>
                                                        <div style={{ fontWeight: 900, color: isApproved ? '#10b981' : '#ef4444', fontSize: '0.65rem', marginBottom: '4px' }}>{isApproved ? 'APPROVED' : 'REJECTED'}</div>
                                                        <div style={{ color: 'var(--text-bright)' }}>{log.replace('APPROVED: ', '').replace('REJECTED: ', '')}</div>
                                                    </div>
                                                );
                                            }) : (
                                                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '20px' }}>
                                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No historical records found.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* --- TRAINER SPECIFIC: BATCHES --- */}
                                    {selectedUser.role === 'TRAINER' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem' }}>Trainer Batch Assignments</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                                                {trainerBatches.length > 0 ? trainerBatches.map((b, idx) => (
                                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{b.name}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                <Clock size={12} /> {b.startTime} - {b.endTime}
                                                            </div>
                                                        </div>
                                                        <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>ACADEMIC</div>
                                                    </div>
                                                )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No batches assigned.</p>}
                                            </div>
                                        </div>
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

export default function UserManagement() {
    return <UserManagementPage />;
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

function ActionButton({ icon, color, onClick, disabled, title }: any) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            title={title}
            style={{ 
                background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                color: disabled ? 'rgba(255,255,255,0.28)' : (color || 'var(--text-bright)'), 
                padding: '10px', 
                borderRadius: '10px', 
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.55 : 1,
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
