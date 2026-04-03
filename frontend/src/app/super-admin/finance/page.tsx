"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
    DollarSign, CreditCard, PieChart, TrendingUp, 
    ArrowUpRight, ArrowDownRight, FileText, Download,
    Plus, Search, Filter, CheckCircle, Clock, AlertCircle,
    Package, Layers, MapPin
} from 'lucide-react';

export default function WealthMatrix() {
    const [view, setViewMode] = useState<'OVERVIEW' | 'TRANSACTIONS' | 'INVOICES' | 'INSTALLMENTS'>('OVERVIEW');

    const transactions = [
        { id: 'TXN001', student: 'Ravi Teja', amount: '₹15,000', method: 'UPI / PhonePe', status: 'SUCCESS', date: 'Oct 12, 2023 10:30 AM' },
        { id: 'TXN002', student: 'Sneha Reddy', amount: '₹8,500', method: 'Bank Transfer', status: 'SUCCESS', date: 'Oct 11, 2023 04:15 PM' },
        { id: 'TXN003', student: 'Deepak Rao', amount: '₹5,000', method: 'Cash', status: 'PENDING', date: 'Oct 11, 2023 02:20 PM' },
    ];

    const installments = [
        { student: 'Sai Kiran', total: '₹25,000', paid: '₹10,000', remaining: '₹15,000', progress: 40, dueDate: 'Oct 25, 2023' },
        { student: 'Arjun Das', total: '₹12,000', paid: '₹12,000', remaining: '₹0', progress: 100, dueDate: '-' },
        { student: 'Ankita Ray', total: '₹18,000', paid: '₹6,000', remaining: '₹12,000', progress: 33, dueDate: 'Oct 20, 2023' },
    ];

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Economics & Revenue</div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-2px', lineHeight: 0.9 }}>Wealth Matrix</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '15px' }}>Financial transparency across branches, students, and operational costs.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-quantum" style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <FileText size={18} /> EXPORT STATEMENTS
                        </button>
                        <button className="btn-quantum" style={{ padding: '15px 30px' }}>
                            <Plus size={18} /> MANUAL ENTRY
                        </button>
                    </div>
                </div>

                {/* --- STAT GARDS --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <FinanceStatCard title="Gross Revenue" value="₹12,45,000" trend="+12% VS PREV" color="#10b981" icon={<ArrowUpRight size={20} />} />
                    <FinanceStatCard title="Total Collected" value="₹8,12,000" trend="Next week projection" color="#8b5cf6" icon={<TrendingUp size={20} />} />
                    <FinanceStatCard title="Pending Outstanding" value="₹4,33,000" trend="12 students overdue" color="#ef4444" icon={<Clock size={20} />} />
                    <FinanceStatCard title="Total Refunds" value="₹12,000" trend="0.5% rate" color="#3b82f6" icon={<Download size={20} />} />
                </div>

                {/* --- TABS --- */}
                <div className="glass-panel" style={{ padding: '8px', borderRadius: '20px', display: 'inline-flex', gap: '5px', marginBottom: '2.5rem' }}>
                    <TabButton active={view === 'OVERVIEW'} onClick={() => setViewMode('OVERVIEW')} label="Revenue Pulse" icon={<PieChart size={16} />} />
                    <TabButton active={view === 'TRANSACTIONS'} onClick={() => setViewMode('TRANSACTIONS')} label="Transaction Log" icon={<CreditCard size={16} />} />
                    <TabButton active={view === 'INSTALLMENTS'} onClick={() => setViewMode('INSTALLMENTS')} label="Installment Tracker" icon={<Layers size={16} />} />
                    <TabButton active={view === 'INVOICES'} onClick={() => setViewMode('INVOICES')} label="Invoice Vault" icon={<FileText size={16} />} />
                </div>

                <AnimatePresence mode="wait">
                    {view === 'TRANSACTIONS' && (
                        <motion.div key="tx" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                             <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                <thead>
                                    <tr style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '10px 20px', textAlign: 'left' }}>TXN Reference</th>
                                        <th style={{ padding: '10px 20px', textAlign: 'left' }}>Student Name</th>
                                        <th style={{ padding: '10px 20px', textAlign: 'left' }}>Amount</th>
                                        <th style={{ padding: '10px 20px', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '10px 20px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id} style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px' }}>
                                            <td style={{ padding: '20px', fontWeight: 900, color: 'var(--primary)' }}>{t.id}</td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ fontWeight: 800 }}>{t.student}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{t.date}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ fontWeight: 950, fontSize: '1.1rem' }}>{t.amount}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Via {t.method}</div>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{ background: t.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: t.status === 'SUCCESS' ? '#10b981' : '#f59e0b', padding: '5px 12px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900 }}>{t.status}</span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 16px 16px 0' }}>
                                                <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer' }}>GEN RECEIPT</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {view === 'INSTALLMENTS' && (
                        <motion.div key="inst" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                            {installments.map(ins => (
                                <div key={ins.student} className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '4px' }}>{ins.student}</h3>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>DUE BY: {ins.dueDate}</div>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 900 }}>{ins.progress}% PAID</div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 900 }}>
                                         <span>COLLECTED: <span style={{ color: '#fff', fontSize: '1rem' }}>{ins.paid}</span></span>
                                         <span>REMAINING: <span style={{ color: '#ef4444', fontSize: '1rem' }}>{ins.remaining}</span></span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', background: ins.progress === 100 ? '#10b981' : 'var(--primary)', width: `${ins.progress}%`, boxShadow: `0 0 15px ${ins.progress === 100 ? '#10b981' : 'var(--primary)'}50` }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                                        <button style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer' }}>COLLECT NEXT</button>
                                        <button style={{ width: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>

            <style jsx>{`
                .glass-panel {
                    background: rgba(255, 255, 255, 0.015);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </DashboardLayout>
    );
}

function TabButton({ active, label, icon, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            style={{ 
                padding: '12px 24px', borderRadius: '16px', border: 'none',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text-dim)',
                fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', transition: 'all 0.4s'
            }}
        >
            {icon} {label}
        </button>
    );
}

function FinanceStatCard({ title, value, trend, color, icon }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }}>
                {icon}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '15px', color: '#fff' }}>{value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 950, color: color }}>
                {icon} {trend}
            </div>
        </div>
    );
}
