"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    DollarSign, Calendar, Clock, TrendingUp, 
    CheckCircle, AlertCircle, FileText, Download,
    Send, Plus, X, Inbox, UserPlus, Info
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorSalaryPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveDate, setLeaveDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            fetchUserData(parsed.id || parsed._id);
        }
    }, []);

    const fetchUserData = async (userId: string) => {
        setLoading(true);
        const result = await fetchJsonSafe<any>(`http://localhost:8080/api/users/${userId}`);
        if (result.ok && result.data) {
            setUser(result.data);
        }
        setLoading(false);
    };

    const handleApplyLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaveReason || !leaveDate) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const newRequest = `LEAVE REQUEST for ${leaveDate}: ${leaveReason} (Requested on ${new Date().toLocaleDateString()})`;
            const updatedRequests = [...(user.requirementRequests || []), newRequest];
            
            const res = await fetch(`http://localhost:8080/api/users/${user._id || user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirementRequests: updatedRequests })
            });

            if (res.ok) {
                showNotification('Leave application sent to Admin successfully!');
                setIsLeaveModalOpen(false);
                setLeaveReason('');
                setLeaveDate('');
                fetchUserData(user._id || user.id);
            } else {
                showNotification('Failed to send leave application.', 'error');
            }
        } catch (err) {
            showNotification('Server connection failed.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const salary = user?.salary || 0;
    const deductions = user?.deductions || 0;
    
    // Auto-calculate logic: If leaves accepted > total allowed, deduct proportionally
    const extraLeaves = Math.max(0, (user?.leavesAccepted || 0) - (user?.leavesTotal || 10));
    const leaveDeduction = extraLeaves > 0 ? Math.round((salary / 30) * extraLeaves) : 0;
    const totalDeductions = deductions + leaveDeduction;
    const netSalary = salary - totalDeductions;

    const paymentHistory = [
        { month: 'April 2026', amount: netSalary, status: 'PAID', date: '2026-04-15' },
        { month: 'March 2026', amount: netSalary, status: 'PAID', date: '2026-03-15' },
        { month: 'February 2026', amount: netSalary, status: 'PAID', date: '2026-02-15' },
    ];

    return (
        <DashboardLayout role="tutor">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Salary & Compensation</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Manage your payouts, leaf tracking, and financial history.</p>
                    </div>
                    <button className="btn-quantum" onClick={() => setIsLeaveModalOpen(true)} style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={18} /> APPLY FOR LEAVE
                    </button>
                </div>

                {/* --- FINANCIAL SNAPSHOT --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <StatBox icon={<DollarSign size={20} />} label="Base Salary" value={`₹${salary.toLocaleString()}`} color="#10b981" />
                    <StatBox icon={<AlertCircle size={20} />} label="Misc Deductions" value={`₹${deductions.toLocaleString()}`} color="#f59e0b" />
                    <StatBox icon={<Calendar size={20} />} label="Leave Impact" value={`-₹${leaveDeduction.toLocaleString()}`} color="#ef4444" hint={`${extraLeaves} unpaid leaves`} />
                    <StatBox icon={<TrendingUp size={20} />} label="Expected Payout" value={`₹${netSalary.toLocaleString()}`} color="#3b82f6" isBold />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                    
                    {/* --- LEAVE LOGS & REQUESTS --- */}
                    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Leave & Request History</h3>
                         </div>
                         
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {user?.requirementRequests?.length > 0 ? [...user.requirementRequests].reverse().map((req: string, i: number) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Inbox size={18} /></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{req}</p>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>SUBMITTED TO ADMIN</span>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f59e0b', padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '100px' }}>PENDING</span>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
                                    <Info size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                                    <p>No recent requests or leave records.</p>
                                </div>
                            )}
                         </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                         {/* --- LEAVE SUMMARY --- */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Quotas & Utilization</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <UtilizationRow label="Allocated Leaves" value={user?.leavesTotal || 10} total={15} color="var(--primary)" />
                                <UtilizationRow label="Approved Leaves" value={user?.leavesAccepted || 0} total={user?.leavesTotal || 10} color="#10b981" />
                                <UtilizationRow label="Rejected Requests" value={user?.leavesRejected || 0} total={5} color="#ef4444" />
                            </div>
                        </div>

                        {/* --- PAYMENT HISTORY --- */}
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Recent Settlements</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {paymentHistory.map((p, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.month}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{p.date}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>₹{p.amount.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981' }}>SUCCESS</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- LEAVE APPLICATION MODAL --- */}
            <AnimatePresence>
                {isLeaveModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                         <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', borderRadius: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Request for Leave</h3>
                                <button onClick={() => setIsLeaveModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleApplyLeave}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '8px' }}>LEAVE DATE</label>
                                    <input type="date" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', marginBottom: '8px' }}>REASON FOR ABSENCE</label>
                                    <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="Please explain the reason for your leave request..." style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn-quantum" style={{ width: '100%', padding: '15px', fontWeight: 900 }}>
                                    {isSubmitting ? 'SENDING...' : 'SUBMIT REQUEST TO ADMIN'}
                                </button>
                            </form>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- NOTIFICATION --- */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10001, background: notification.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}

function StatBox({ icon, label, value, color, hint, isBold }: any) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', borderLeft: `4px solid ${color}` }}>
            <div style={{ color }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '10px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: isBold ? '2rem' : '1.5rem', fontWeight: 900, marginTop: '5px' }}>{value}</div>
            {hint && <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 700 }}>{hint}</div>}
        </div>
    );
}

function UtilizationRow({ label, value, total, color }: any) {
    const percentage = Math.min(100, (value / total) * 100);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 800 }}>{label}</span>
                <span style={{ fontWeight: 900, color }}>{value} / {total}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} style={{ height: '100%', background: color }} />
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'inherit'
};