"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    DollarSign, Plus, Search, FileText, 
    TrendingUp, Wallet, ShoppingBag, PieChart,
    ChevronUp, ChevronDown, Calendar, Download,
    CheckCircle, AlertCircle
} from 'lucide-react';

export default function FinanceManagement() {
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        setTransactions([
            { id: 1, entity: 'Sai Kiran', amount: '$1,200', type: 'ENROLLMENT', status: 'PAID', date: '2026-03-20' },
            { id: 2, entity: 'Deepak Kumar', amount: '$450', type: 'INSTALLMENT', status: 'PENDING', date: '2026-03-22' },
            { id: 3, entity: 'Enterprise: TechCorp', amount: '$5,000', type: 'CORPORATE_TR', status: 'PAID', date: '2026-03-18' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Platform Finance Engine</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Architect global revenue nodes and oversee transactional integrity.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button className="btn-quantum" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                            <Download size={18} style={{ marginRight: '8px' }} /> TAX REPORTS
                        </button>
                        <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> NEW LEDGER ENTRY
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
                    <FinanceMetricCard title="Gross Yield" value="$842,500" trend="+14% YoY" color="#10b981" />
                    <FinanceMetricCard title="Operational Burn" value="$212,000" trend="Next 30D proj" color="#ef4444" />
                    <FinanceMetricCard title="Retention Rate" value="98.4%" trend="Optimal Level" color="#8b5cf6" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                    {/* --- RECENT TRANSACTIONS --- */}
                    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem' }}>Real-time Ledger Feed</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {transactions.map((t, i) => (
                                <TransactionRow key={t.id} {...t} />
                            ))}
                        </div>
                    </div>

                    {/* --- ANALYTICS PANEL --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Revenue Mapping</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <RevenueSource label="Direct Enrollments" percent={65} color="#8b5cf6" />
                                <RevenueSource label="Corporate Training" percent={22} color="#3b82f6" />
                                <RevenueSource label="Govt Artifacts" percent={13} color="#10b981" />
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', borderLeft: '4px solid #f59e0b' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', color: '#f59e0b' }}>Fee Collection Alert</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>42 Pending dues identified ($12.4k total). Automatic follow-up protocols initialized for Batch J1.</p>
                            <button style={{ width: '100%', marginTop: '1.5rem', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', borderRadius: '10px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}>OVERSEE COMPLIANCE</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function FinanceMetricCard({ title, value, trend, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ padding: '10px', background: `${color}15`, color, borderRadius: '12px' }}>
                    <DollarSign size={24} />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> {trend}
                </div>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '5px' }}>{value}</div>
        </div>
    );
}

function TransactionRow({ entity, amount, type, status, date }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{entity.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{entity}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ShoppingBag size={12} /> {type}
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{amount}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: status === 'PAID' ? '#10b981' : '#f59e0b', letterSpacing: '1px' }}>{status}</div>
            </div>
        </div>
    );
}

function RevenueSource({ label, percent, color }: any) {
    return (
        <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                <span>{percent}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '100px' }} />
            </div>
        </div>
    );
}
