"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    DollarSign, Calendar, Clock, TrendingUp, 
    CheckCircle, AlertCircle, FileText, Download
} from 'lucide-react';
import { fetchJsonSafe } from '@/lib/fetchJson';

export default function TutorSalaryPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    const salary = user?.salary || 0;
    const deductions = user?.deductions || 0;
    const netSalary = salary - deductions;

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
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Salary & Payouts</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>View your salary details and payment history.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #10b981' }}>
                        <DollarSign size={24} color="#10b981" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>GROSS SALARY</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{salary.toLocaleString()}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #ef4444' }}>
                        <AlertCircle size={24} color="#ef4444" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>DEDUCTIONS</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{deductions.toLocaleString()}</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderLeft: '4px solid #3b82f6' }}>
                        <TrendingUp size={24} color="#3b82f6" />
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '8px' }}>NET SALARY</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{netSalary.toLocaleString()}</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Payment History</h3>
                        <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                            <Download size={16} /> Export
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>
                                <th style={{ padding: '15px' }}>Month</th>
                                <th style={{ padding: '15px' }}>Payment Date</th>
                                <th style={{ padding: '15px' }}>Amount</th>
                                <th style={{ padding: '15px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment, i) => (
                                <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '15px', fontWeight: 800 }}>{payment.month}</td>
                                    <td style={{ padding: '15px', color: 'var(--text-dim)' }}>{payment.date}</td>
                                    <td style={{ padding: '15px', fontWeight: 900 }}>₹{payment.amount.toLocaleString()}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900,
                                            background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'
                                        }}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Leave Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px' }}>TOTAL LEAVES</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{user?.leavesTotal || 0}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px' }}>ACCEPTED</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>{user?.leavesAccepted || 0}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginBottom: '8px' }}>REJECTED</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>{user?.leavesRejected || 0}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}