"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, TrendingUp, CreditCard, AlertTriangle, Download,
    Search, Filter, Plus, FileText, Send, MoreHorizontal, CheckCircle,
    Users, Briefcase, Wallet, Building2, ChevronDown, Calendar
} from 'lucide-react';
import styles from '../Admin.module.css';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from 'recharts';

// -- Mock Data --

// 1. Transactions (Student Fees)
const FEE_TRANSACTIONS = [
    { id: 'TRX-9821', entity: 'Student Name 1', context: 'Full Stack Java', type: 'Course Fee', amount: 1200, date: 'Feb 04, 2026', status: 'Paid', method: 'Credit Card' },
    { id: 'TRX-9822', entity: 'Student Name 2', context: 'Data Science', type: 'Course Fee', amount: 800, date: 'Feb 03, 2026', status: 'Pending', method: 'Bank Transfer' },
    { id: 'TRX-9823', entity: 'Student Name 3', context: 'UI/UX Design', type: 'Installment 2', amount: 1500, date: 'Feb 02, 2026', status: 'Overdue', method: '-' },
    { id: 'TRX-9824', entity: 'Student Name 4', context: 'DevOps Cloud', type: 'Registration', amount: 200, date: 'Feb 01, 2026', status: 'Paid', method: 'PayPal' },
    { id: 'TRX-9825', entity: 'Student Name 5', context: 'Python & AI', type: 'Course Fee', amount: 950, date: 'Jan 30, 2026', status: 'Paid', method: 'Credit Card' },
];

// 2. Employee Payroll
const PAYROLL_DATA = [
    { id: 'PAY-2024-02-001', name: 'Sarah Connor', role: 'Senior Trainer', dept: 'Academics', salary: 4500, bonus: 200, status: 'Paid', payDate: 'Jan 31, 2026' },
    { id: 'PAY-2024-02-002', name: 'Mike Ross', role: 'Counselor Lead', dept: 'Sales', salary: 3200, bonus: 500, status: 'Processing', payDate: 'Feb 05, 2026' },
    { id: 'PAY-2024-02-003', name: 'Jessica Pearson', role: 'HR Manager', dept: 'HR', salary: 5000, bonus: 0, status: 'Paid', payDate: 'Jan 31, 2026' },
    { id: 'PAY-2024-02-004', name: 'Harvey Specter', role: 'Legal Advisor', dept: 'Legal', salary: 6500, bonus: 1000, status: 'Pending', payDate: 'Feb 05, 2026' },
    { id: 'PAY-2024-02-005', name: 'Louis Litt', role: 'Finance Head', dept: 'Finance', salary: 5500, bonus: 0, status: 'Paid', payDate: 'Jan 31, 2026' },
];

// 3. Operational Expenses
const EXPENSE_DATA = [
    { id: 'EXP-001', vendor: 'AWS Services', category: 'Infrastructure', amount: 850, date: 'Feb 01, 2026', status: 'Paid', recurring: true },
    { id: 'EXP-002', vendor: 'WeWork Properties', category: 'Rent', amount: 2500, date: 'Feb 01, 2026', status: 'Paid', recurring: true },
    { id: 'EXP-003', vendor: 'Adobe Creative Cloud', category: 'Software Lic', amount: 150, date: 'Feb 03, 2026', status: 'Pending', recurring: true },
    { id: 'EXP-004', vendor: 'Office Supplies Inc', category: 'Supplies', amount: 320, date: 'Jan 28, 2026', status: 'Paid', recurring: false },
    { id: 'EXP-005', vendor: 'Google Ads', category: 'Marketing', amount: 1200, date: 'Jan 30, 2026', status: 'Paid', recurring: true },
];

// 4. Charts Data
const CASH_FLOW_DATA = [
    { name: 'Jan', income: 45000, expenses: 18000, payroll: 22000 },
    { name: 'Feb', income: 52000, expenses: 15000, payroll: 22500 },
    { name: 'Mar', income: 48000, expenses: 16000, payroll: 22500 },
    { name: 'Apr', income: 61000, expenses: 19000, payroll: 23000 },
    { name: 'May', income: 55000, expenses: 17000, payroll: 23000 },
    { name: 'Jun', income: 67000, expenses: 21000, payroll: 24000 },
];

const FEE_STATUS_DATA = [
    { name: 'Paid', value: 65, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Overdue', value: 10, color: '#ef4444' },
];

const EXPENSE_BREAKDOWN = [
    { name: 'Payroll', value: 60, color: '#8b5cf6' },
    { name: 'Rent & Infra', value: 20, color: '#3b82f6' },
    { name: 'Marketing', value: 15, color: '#f43f5e' },
    { name: 'Ops', value: 5, color: '#f59e0b' },
];


export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'payroll' | 'expenses'>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    // Consolidated KPI Stats
    const stats = {
        totalRevenue: '$328,000',
        netProfit: '$64,500',
        pendingFees: '$12,400',
        monthlyPayroll: '$24,200',
        expenseRatio: '32%'
    };

    const renderOverview = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.mainGrid} style={{ marginTop: '1.5rem' }}>
            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className={styles.glassPanel}>
                    <div className={styles.cardHeader}>
                        <span>Cash Flow Analysis</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className={styles.iconBtn}><Calendar size={14} /></button>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={CASH_FLOW_DATA}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                                <Area type="monotone" dataKey="income" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="payroll" name="Payroll Cost" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPayroll)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className={styles.glassPanel}>
                    <div className={styles.cardHeader}>Expense Allocation</div>
                    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={EXPENSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value">
                                    {EXPENSE_BREAKDOWN.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>$86k</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Monthly</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className={styles.actionsGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <button className={styles.actionBtn}>
                    <Plus size={24} style={{ marginBottom: '0.5rem' }} /> Create Invoice
                </button>
                <button className={styles.actionBtn}>
                    <Users size={24} style={{ marginBottom: '0.5rem' }} /> Process Payroll
                </button>
                <button className={styles.actionBtn}>
                    <Building2 size={24} style={{ marginBottom: '0.5rem' }} /> Add Expense
                </button>
                <button className={styles.actionBtn}>
                    <Download size={24} style={{ marginBottom: '0.5rem' }} /> Download Report
                </button>
            </div>
        </motion.div>
    );

    const renderTable = (data: any[], type: 'fees' | 'payroll' | 'expenses') => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.glassPanel}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>
                    {type === 'fees' ? 'Recent Student Transactions' : type === 'payroll' ? 'Employee Salary History' : 'Operational Expenses'}
                </h4>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className={styles.searchGroup} style={{ width: '250px' }}>
                        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="text" placeholder="Search..." className={styles.searchInput} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className={styles.btnSecondary}><Filter size={16} /> Filter</button>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        {type === 'fees' && <tr><th>Transaction ID</th><th>Student</th><th>Context</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr>}
                        {type === 'payroll' && <tr><th>Pay ID</th><th>Employee</th><th>Role & Dept</th><th>Total Payout</th><th>Status</th><th>Pay Date</th><th>Actions</th></tr>}
                        {type === 'expenses' && <tr><th>Expense ID</th><th>Vendor</th><th>Category</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>}
                    </thead>
                    <tbody>
                        {type === 'fees' && FEE_TRANSACTIONS.map((row, i) => (
                            <tr key={i} className={styles.tableRow}>
                                <td style={{ fontFamily: 'monospace', color: '#a78bfa' }}>{row.id}</td>
                                <td><span style={{ fontWeight: 600, color: 'white' }}>{row.entity}</span></td>
                                <td className={styles.courseText}>{row.context} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({row.type})</span></td>
                                <td style={{ fontWeight: 700, color: 'white' }}>${row.amount}</td>
                                <td style={{ color: '#94a3b8' }}>{row.date}</td>
                                <td><span className={`${styles.statusBadge} ${row.status === 'Paid' ? styles.paid : styles.pending}`}>{row.status}</span></td>
                                <td><div style={{ display: 'flex', gap: '0.5rem' }}><button className={styles.iconBtn}><FileText size={14} /></button></div></td>
                            </tr>
                        ))}
                        {type === 'payroll' && PAYROLL_DATA.map((row, i) => (
                            <tr key={i} className={styles.tableRow}>
                                <td style={{ fontFamily: 'monospace', color: '#a78bfa' }}>{row.id.split('-').pop()}</td>
                                <td><span style={{ fontWeight: 600, color: 'white' }}>{row.name}</span></td>
                                <td><div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.85rem' }}>{row.role}</span><span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{row.dept}</span></div></td>
                                <td style={{ fontWeight: 700, color: 'white' }}>${row.salary + row.bonus}</td>
                                <td><span className={`${styles.statusBadge}`} style={{ background: row.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: row.status === 'Paid' ? '#34d399' : '#a78bfa' }}>{row.status}</span></td>
                                <td style={{ color: '#94a3b8' }}>{row.payDate}</td>
                                <td><div style={{ display: 'flex', gap: '0.5rem' }}><button className={styles.iconBtn}><Download size={14} /></button></div></td>
                            </tr>
                        ))}
                        {type === 'expenses' && EXPENSE_DATA.map((row, i) => (
                            <tr key={i} className={styles.tableRow}>
                                <td style={{ fontFamily: 'monospace', color: '#a78bfa' }}>{row.id.split('-').pop()}</td>
                                <td><span style={{ fontWeight: 600, color: 'white' }}>{row.vendor}</span></td>
                                <td><span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{row.category}</span></td>
                                <td style={{ fontWeight: 700, color: 'white' }}>${row.amount}</td>
                                <td><span className={`${styles.statusBadge} ${row.status === 'Paid' ? styles.paid : styles.pending}`}>{row.status}</span></td>
                                <td style={{ color: '#94a3b8' }}>{row.date}</td>
                                <td><div style={{ display: 'flex', gap: '0.5rem' }}><button className={styles.iconBtn}><MoreHorizontal size={14} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '1rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>FINANCE CENTER</h3>
                        <p className={styles.subTitle}>Manage payroll, track operational expenses, and monitor student fees.</p>
                    </div>
                    <div className={styles.actionBtnRow}>
                        <button className={styles.btnSecondary} onClick={() => alert('Exporting Financial Report...')}>
                            <Download size={16} /> Export Report
                        </button>
                        <button className={styles.btnPrimary} style={{ background: '#10b981' }}>
                            <CheckCircle size={16} /> Audit Log
                        </button>
                    </div>
                </div>

                {/* KPI Stats Row (Always Visible) */}
                <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '1.5rem', gap: '1rem' }}>
                    {[
                        { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: '#10b981' },
                        { label: 'Net Profit', value: stats.netProfit, icon: TrendingUp, color: '#3b82f6' },
                        { label: 'Pending Fees', value: stats.pendingFees, icon: Wallet, color: '#f59e0b' },
                        { label: 'Monthly Payroll', value: stats.monthlyPayroll, icon: Users, color: '#8b5cf6' },
                        { label: 'Expense Ratio', value: stats.expenseRatio, icon: AlertTriangle, color: '#f43f5e' },
                    ].map((stat, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }} className={styles.glassPanel} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
                                <stat.icon size={16} color={stat.color} />
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Rajdhani', color: 'white' }}>{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className={styles.tabContainer}>
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart },
                        { id: 'fees', label: 'Student Fees', icon: CreditCard },
                        { id: 'payroll', label: 'Employee Payroll', icon: Users },
                        { id: 'expenses', label: 'Op. Expenses', icon: Building2 },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dynamic Content */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'fees' && renderTable(FEE_TRANSACTIONS, 'fees')}
                        {activeTab === 'payroll' && renderTable(PAYROLL_DATA, 'payroll')}
                        {activeTab === 'expenses' && renderTable(EXPENSE_DATA, 'expenses')}
                    </motion.div>
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
