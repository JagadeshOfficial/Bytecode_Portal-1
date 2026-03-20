"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    DollarSign, Plus, Search, FileDown, 
    TrendingUp, Wallet, ShoppingBag, PieChart,
    ChevronUp, ChevronDown, Calendar, Download,
    CheckCircle, AlertCircle, User, Award, 
    CreditCard, Zap
} from 'lucide-react';

export default function SalaryManagement() {
    const [payrolls, setPayrolls] = useState<any[]>([]);

    useEffect(() => {
        setPayrolls([
            { id: 1, name: 'Vamsi Krishna', base: '$4,200', incentive: '$850', net: '$5,050', status: 'DISBURSED', date: '2026-03-01' },
            { id: 2, name: 'Anjali Sharma', base: '$3,800', incentive: '$420', net: '$4,220', status: 'PENDING', date: '2026-03-31' },
            { id: 3, name: 'Siddharth M.', base: '$3,800', incentive: '$600', net: '$4,400', status: 'VERIFIED', date: '2026-03-25' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Salary & Payroll Engine</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect global compensation models, track incentives, and manage payslip cycles.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-quantum" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <FileDown size={18} style={{ marginRight: '8px' }} /> BULK PAYSLIPS
                        </button>
                        <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> NEW PAYROLL NODE
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
                    <PayrollStatCard icon={<Wallet size={24} />} title="Global Payroll Load" value="$142,500" sub="Current Month" color="#8b5cf6" />
                    <PayrollStatCard icon={<Award size={24} />} title="Performance Incentives" value="$12,850" sub="Across 82 Employees" color="#10b981" />
                    <PayrollStatCard icon={<Zap size={24} />} title="Calculated Deductions" value="$4,200" sub="Tax/Insurance" color="#ef4444" />
                </div>

                {/* --- PAYROLL LEDGER --- */}
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Production Payroll Ledger</h3>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '400px' }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px' }}>
                                <Search size={16} color="var(--text-dim)" />
                                <input type="text" placeholder="Search employee payroll..." style={{ width: '100%', padding: '12px 0', background: 'none', border: 'none', color: '#fff', outline: 'none' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                            <thead>
                                <tr style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Employee Personnel</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Base Salary</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>KPI Incentives</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Net Disbursable</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'left' }}>Status Rank</th>
                                    <th style={{ padding: '10px 20px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.map((p, i) => (
                                    <motion.tr 
                                        key={p.id} 
                                        initial={{ opacity: 0, scale: 0.95 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        transition={{ delay: i * 0.1 }}
                                        style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '16px' }}
                                    >
                                        <td style={{ padding: '20px', borderRadius: '16px 0 0 16px', fontWeight: 900 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{p.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 900 }}>{p.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #EMP_{p.id}00</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px', color: 'var(--text-dim)', fontWeight: 800, fontSize: '0.85rem' }}>{p.base}</td>
                                        <td style={{ padding: '20px', color: '#10b981', fontWeight: 900, fontSize: '0.85rem' }}>{p.incentive}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-bright)', fontWeight: 900, fontSize: '1.1rem' }}>{p.net}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                background: p.status === 'DISBURSED' ? 'rgba(16, 185, 129, 0.1)' : (p.status === 'VERIFIED' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)'),
                                                color: p.status === 'DISBURSED' ? '#10b981' : (p.status === 'VERIFIED' ? '#3b82f6' : '#f59e0b'),
                                                padding: '5px 14px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                letterSpacing: '1px'
                                            }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}><Download size={14} style={{ marginRight: '5px' }} /> PAYSLIP</button>
                                                <button style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: '#fff' }}><CreditCard size={14} /></button>
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

function PayrollStatCard({ icon, title, value, sub, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', borderBottom: `4px solid ${color}`, background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%)' }}>
            <div style={{ color, marginBottom: '1.25rem', background: `${color}10`, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, margin: '5px 0' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)' }}>{sub}</div>
        </div>
    );
}
