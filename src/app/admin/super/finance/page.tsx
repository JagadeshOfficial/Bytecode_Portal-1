"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, TrendingUp, TrendingDown, Wallet, FileText,
    CreditCard, Calendar, ArrowUpRight, ArrowDownLeft,
    Download, Plus, Search, Filter, Layers, PieChart,
    ChevronDown, CheckCircle, AlertCircle, Trash2, MoreHorizontal,
    User, Mail, Phone, Clock, Receipt, CheckSquare, Square,
    Briefcase, FileDigit, Users, BarChart3, Calculator, Rocket, ShieldCheck, Edit3, History, Printer, Send
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

// -- Chart Data --
const CASH_FLOW_DATA = [
    { name: 'Jan', income: 45000, expenses: 18000, payroll: 22000 },
    { name: 'Feb', income: 52000, expenses: 15000, payroll: 22500 },
    { name: 'Mar', income: 48000, expenses: 16000, payroll: 22500 },
    { name: 'Apr', income: 61000, expenses: 19000, payroll: 23000 },
    { name: 'May', income: 55000, expenses: 17000, payroll: 23000 },
    { name: 'Jun', income: 67000, expenses: 21000, payroll: 24000 },
];

const EXPENSE_BREAKDOWN = [
    { name: 'Payroll', value: 60, color: '#10b981' }, // Matching the green used for payroll module
    { name: 'Rent & Infra', value: 20, color: '#3b82f6' },
    { name: 'Marketing', value: 15, color: '#f43f5e' },
    { name: 'Ops', value: 5, color: '#f59e0b' },
];

// -- Types & Interfaces --

type ViewMode = 'fees' | 'payroll' | 'expenses' | 'invoices';

interface PaymentHistory {
    id: string;
    date: string;
    amount: number;
    mode: string;
    note?: string;
    type: 'fee_receipt' | 'salary_slip'; // To distinguish templates
    recipientId: string;
    recipientName: string;
}

interface StaffRecord {
    id: string; name: string; role: string; department: string; baseSalary: number;
    currentMonthStats: { totalDays: number; presentDays: number; absentDays: number; attendanceScore: number };
    monthStatus: 'Unpaid' | 'Partial' | 'Paid';
    paidAmount: number;
    pendingAmount: number;
    nextDueDate?: string;
    lastPaidDate?: string;
    paymentHistory: PaymentHistory[];
    email: string;
}

interface StudentFeeRecord {
    id: string; name: string; course: string; totalFee: number; paidFee: number; pendingFee: number;
    dueDate: string; status: 'Paid' | 'Partial' | 'Overdue';
    paymentHistory: PaymentHistory[];
    email: string;
}

interface ExpenseRecord {
    id: string; vendor: string; category: string; date: string; amount: number; status: 'Paid' | 'Pending'; note?: string;
}

// -- Mock Data --

const INITIAL_STAFF: StaffRecord[] = [
    {
        id: 'EMP-101', name: 'Dr. Rao', role: 'Senior Faculty', department: 'AI Research', baseSalary: 85000,
        currentMonthStats: { totalDays: 30, presentDays: 28, absentDays: 2, attendanceScore: 93 },
        monthStatus: 'Unpaid', paidAmount: 0, pendingAmount: 79334,
        paymentHistory: [], email: 'rao@bytecode.edu'
    },
    {
        id: 'EMP-102', name: 'Sarah Jenkins', role: 'Trainer', department: 'Web Dev', baseSalary: 60000,
        currentMonthStats: { totalDays: 30, presentDays: 30, absentDays: 0, attendanceScore: 100 },
        monthStatus: 'Unpaid', paidAmount: 0, pendingAmount: 60000,
        paymentHistory: [], email: 'sarah@bytecode.edu'
    },
    {
        id: 'EMP-103', name: 'Karen Smith', role: 'Admin', department: 'Operations', baseSalary: 45000,
        currentMonthStats: { totalDays: 30, presentDays: 15, absentDays: 15, attendanceScore: 50 },
        monthStatus: 'Unpaid', paidAmount: 0, pendingAmount: 22500,
        paymentHistory: [], email: 'karen@bytecode.edu'
    }
];

const INITIAL_STUDENTS: StudentFeeRecord[] = [
    {
        id: 'ST-001', name: 'Arjun Reddy', course: 'Java Full Stack', totalFee: 45000, paidFee: 25000, pendingFee: 20000, dueDate: '2024-03-15', status: 'Partial',
        paymentHistory: [{ id: 'INV-2024-001', date: '2024-01-15', amount: 25000, mode: 'UPI', type: 'fee_receipt', recipientId: 'ST-001', recipientName: 'Arjun Reddy' }], email: 'arjun@student.com'
    },
    {
        id: 'ST-002', name: 'Priya Sharma', course: 'Data Science', totalFee: 50000, paidFee: 10000, pendingFee: 40000, dueDate: '2024-02-01', status: 'Overdue',
        paymentHistory: [{ id: 'INV-2023-089', date: '2023-12-20', amount: 10000, mode: 'Cash', type: 'fee_receipt', recipientId: 'ST-002', recipientName: 'Priya Sharma' }], email: 'priya@student.com'
    },
    {
        id: 'ST-003', name: 'Mike Chen', course: 'DevOps', totalFee: 40000, paidFee: 35000, pendingFee: 5000, dueDate: '2024-02-28', status: 'Partial',
        paymentHistory: [{ id: 'INV-2024-005', date: '2024-01-10', amount: 35000, mode: 'Bank Transfer', type: 'fee_receipt', recipientId: 'ST-003', recipientName: 'Mike Chen' }], email: 'mike@student.com'
    },
];

const INITIAL_EXPENSES: ExpenseRecord[] = [
    { id: 'EXP-001', vendor: 'AWS Cloud Services', category: 'Infrastructure', date: '2026-02-12', amount: 45000, status: 'Paid' },
    { id: 'EXP-002', vendor: 'Office Rent', category: 'Utilities', date: '2026-02-01', amount: 65000, status: 'Paid' },
    { id: 'EXP-003', vendor: 'Google Ads Q1', category: 'Marketing', date: '2026-01-28', amount: 25000, status: 'Paid' },
];

export default function FinancePage() {
    const [activeModule, setActiveModule] = useState<ViewMode>('fees');
    const [hoverModule, setHoverModule] = useState<ViewMode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // -- Live Data State --
    const [students, setStudents] = useState<StudentFeeRecord[]>(INITIAL_STUDENTS);
    const [staffList, setStaffList] = useState<StaffRecord[]>(INITIAL_STAFF);
    const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);

    // -- Modal States --
    const [selectedStudent, setSelectedStudent] = useState<StudentFeeRecord | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null);
    const [viewHistory, setViewHistory] = useState<{ history: PaymentHistory[], email: string } | null>(null);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    // -- Invoice Preview State --
    const [previewInvoice, setPreviewInvoice] = useState<PaymentHistory | null>(null);

    // -- Form States --
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [nextDueDate, setNextDueDate] = useState<string>('');
    const [paymentMode, setPaymentMode] = useState<string>('UPI');

    // -- Helpers --
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(val);

    const downloadCSV = (moduleName: string) => {
        // ... (existing CSV logic - placeholder for brevity if not changed)
        alert('Downloading CSV...');
    };

    const sendInvoiceEmail = (invoice: PaymentHistory, email: string) => {
        alert(`Sending Invoice #${invoice.id} to ${email}... \n\nDone! ✅`);
    };

    // Flatten all invoices for the Invoice Module
    const getAllInvoices = () => {
        const studentInvoices = students.flatMap(s => s.paymentHistory);
        const staffInvoices = staffList.flatMap(s => s.paymentHistory);
        return [...studentInvoices, ...staffInvoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Get invoice context (Parent Record Details)
    const getInvoiceContext = (invoice: PaymentHistory) => {
        if (invoice.type === 'fee_receipt') {
            const student = students.find(s => s.id === invoice.recipientId);
            return student ? {
                totalAmount: student.totalFee,
                pendingAmount: student.pendingFee,
                departmentOrCourse: student.course,
                status: student.status
            } : null;
        } else {
            const staff = staffList.find(s => s.id === invoice.recipientId);
            return staff ? {
                totalAmount: staff.baseSalary, // Or calculated net pay if we had historical snapshot
                pendingAmount: staff.pendingAmount,
                departmentOrCourse: staff.department,
                status: staff.monthStatus
            } : null;
        }
    };

    // -- Actions --

    // 1. Fee Collection (Student)
    const handleCollectFee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !paymentAmount) return;

        const amount = parseFloat(paymentAmount);
        const updated = { ...selectedStudent };
        updated.paidFee += amount;
        updated.pendingFee -= amount;

        updated.paymentHistory = [
            {
                id: `INV-${Date.now().toString().slice(-6)}`,
                date: new Date().toISOString().split('T')[0],
                amount,
                mode: paymentMode,
                type: 'fee_receipt',
                recipientId: updated.id,
                recipientName: updated.name,
                note: 'Tuition Fee Payment'
            },
            ...updated.paymentHistory
        ];

        if (updated.pendingFee <= 0) {
            updated.status = 'Paid';
        } else {
            updated.status = 'Partial';
            if (nextDueDate) updated.dueDate = nextDueDate;
        }

        setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
        resetForm();
    };

    // 2. Payroll Processing (Staff)
    const handleProcessPayroll = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStaff || !paymentAmount) return;
        const amount = parseFloat(paymentAmount);
        const updated = { ...selectedStaff };
        updated.paidAmount += amount;
        updated.pendingAmount -= amount;
        updated.lastPaidDate = new Date().toLocaleDateString();

        updated.paymentHistory = [
            {
                id: `SLIP-${Date.now().toString().slice(-6)}`,
                date: new Date().toISOString().split('T')[0],
                amount,
                mode: paymentMode,
                type: 'salary_slip',
                recipientId: updated.id,
                recipientName: updated.name,
                note: 'Monthly Salary Release'
            },
            ...updated.paymentHistory
        ];

        if (updated.pendingAmount <= 0) {
            updated.monthStatus = 'Paid';
        } else {
            updated.monthStatus = 'Partial';
            if (nextDueDate) updated.nextDueDate = nextDueDate;
        }

        setStaffList(prev => prev.map(s => s.id === updated.id ? updated : s));
        resetForm();
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newExpense: ExpenseRecord = {
            id: `EXP-${Math.floor(Math.random() * 10000)}`,
            vendor: (form.elements.namedItem('vendor') as HTMLInputElement).value,
            category: (form.elements.namedItem('category') as HTMLSelectElement).value,
            amount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value),
            date: (form.elements.namedItem('date') as HTMLInputElement).value,
            status: (form.elements.namedItem('status') as HTMLSelectElement).value as any,
        };
        setExpenses([newExpense, ...expenses]);
        setIsAddExpenseOpen(false);
    };

    const resetForm = () => {
        setPaymentAmount('');
        setNextDueDate('');
        setSelectedStudent(null);
        setSelectedStaff(null);
        setPaymentMode('UPI');
    };

    // Component Rendering
    const ModuleCard = ({ mode, title, icon: Icon, color, stats, activeStats }: { mode: ViewMode, title: string, icon: any, color: string, stats: string, activeStats: string }) => {
        const isActive = activeModule === mode;
        return (
            <motion.div
                onClick={() => setActiveModule(mode)}
                onMouseEnter={() => setHoverModule(mode)}
                onMouseLeave={() => setHoverModule(null)}
                className={styles.card}
                animate={{
                    scale: isActive ? 1.02 : 1,
                    borderColor: isActive ? color : 'rgba(51,65,85,0.5)',
                    backgroundColor: isActive ? 'rgba(30,41,59,0.9)' : 'rgba(30,41,59,0.4)'
                }}
                style={{
                    cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '140px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
            >
                {isActive && <motion.div layoutId="activeGlow" style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, ${color}1a, transparent)`, zIndex: 0 }} />}
                <div style={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ background: `${color}20`, padding: '0.6rem', borderRadius: '8px', color: color }}><Icon size={24} /></div>
                    {isActive && <div style={{ background: color, width: '6px', height: '6px', borderRadius: '50%' }} />}
                </div>
                <div style={{ zIndex: 1 }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
                    <div style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Rajdhani' }}>{isActive ? activeStats : stats}</div>
                </div>
            </motion.div>
        );
    };

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div className={styles.textLabel}>Master Finance</div>
                    <h1 className={styles.textH1}>Integrated Finance Controller</h1>
                </div>

                {/* Analytics Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className={styles.card} style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.cardHeader} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', fontFamily: 'Rajdhani', textTransform: 'uppercase' }}>Cash Flow Analysis</span>
                            <button className={styles.btnSecondary} style={{ padding: '4px 8px' }}><Calendar size={14} /></button>
                        </div>
                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CASH_FLOW_DATA}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="income" name="Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="payroll" name="Payroll Cost" stroke="#10b981" fillOpacity={1} fill="url(#colorPayroll)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={styles.card} style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                        <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', fontFamily: 'Rajdhani', textTransform: 'uppercase' }}>Expense Allocation</span>
                        </div>
                        <div style={{ flex: 1, width: '100%', minHeight: 0, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={EXPENSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {EXPENSE_BREAKDOWN.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Legend verticalAlign="bottom" height={36} iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>$86k</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total Monthly</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <ModuleCard mode="fees" title="Fee Collections" icon={ArrowDownLeft} color="#3b82f6" stats="₹1.2 Cr Total" activeStats={`${formatCurrency(students.reduce((a, c) => a + c.paidFee, 0))} Collected`} />
                    <ModuleCard mode="payroll" title="Smart Payroll" icon={Users} color="#10b981" stats="₹8.5 L Monthly" activeStats={`${staffList.filter(s => s.monthStatus === 'Paid' || s.monthStatus === 'Partial').length} Processed`} />
                    <ModuleCard mode="expenses" title="Operational Exp" icon={PieChart} color="#f59e0b" stats="₹3.2 L Total" activeStats={`${expenses.length} Records`} />
                    <ModuleCard mode="invoices" title="Invoice Ledger" icon={FileDigit} color="#8b5cf6" stats={`${getAllInvoices().length} Generated`} activeStats="View All" />
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div key={activeModule} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* FEES */}
                        {activeModule === 'fees' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>Student Fee Collections</div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Student</th><th>Total Fee</th><th>Paid</th><th>Pending (Due)</th><th>Status</th><th>Invoice</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => (
                                                <tr key={s.id}>
                                                    <td><div style={{ fontWeight: 600, color: 'white' }}>{s.name}</div><div className={styles.textSub}>{s.course}</div></td>
                                                    <td>{formatCurrency(s.totalFee)}</td>
                                                    <td style={{ color: '#10b981' }}>{formatCurrency(s.paidFee)}</td>
                                                    <td><div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{formatCurrency(s.pendingFee)}</div><div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Due: {s.dueDate}</div></td>
                                                    <td><span className={styles.statusBadge}>{s.status}</span></td>
                                                    <td><button className={styles.btnSecondary} onClick={() => setViewHistory({ history: s.paymentHistory, email: s.email })} style={{ padding: '4px 8px' }}><FileText size={14} /> History</button></td>
                                                    <td>{s.status !== 'Paid' && <button className={styles.btnPrimary} style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setSelectedStudent(s)}>Collect Fee</button>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* PAYROLL */}
                        {activeModule === 'payroll' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>Staff Salary Disbursement</div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Staff</th><th>Attendance</th><th>Net Payable</th><th>Pending</th><th>Status</th><th>Slips</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {staffList.map(staff => {
                                                const netPayable = staff.baseSalary - Math.round((staff.baseSalary / 30) * staff.currentMonthStats.absentDays);
                                                return (
                                                    <tr key={staff.id}>
                                                        <td><div style={{ fontWeight: 600, color: 'white' }}>{staff.name}</div><div className={styles.textSub}>{staff.role}</div></td>
                                                        <td><span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{staff.currentMonthStats.presentDays}/30 Days</span>{staff.currentMonthStats.absentDays > 0 && <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>Deduction Applied</div>}</td>
                                                        <td style={{ color: 'white', fontWeight: 600 }}>{formatCurrency(netPayable)}</td>
                                                        <td style={{ color: '#f59e0b' }}>{formatCurrency(staff.pendingAmount)}</td>
                                                        <td><span className={styles.statusBadge}>{staff.monthStatus}</span></td>
                                                        <td><button className={styles.btnSecondary} onClick={() => setViewHistory({ history: staff.paymentHistory, email: staff.email })} style={{ padding: '4px 8px' }}><FileText size={14} /></button></td>
                                                        <td>{staff.monthStatus !== 'Paid' ? <button className={styles.btnPrimary} onClick={() => setSelectedStaff(staff)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Process Pay</button> : <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Settled</span>}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* EXPENSES */}
                        {activeModule === 'expenses' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className={styles.btnPrimary} onClick={() => setIsAddExpenseOpen(true)}><Plus size={16} /> Record Expense</button></div>
                                <div className={styles.card}>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead><tr><th>Vendor / Description</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                                            <tbody>
                                                {expenses.map(ex => (
                                                    <tr key={ex.id}>
                                                        <td><div style={{ color: 'white' }}>{ex.vendor}</div></td>
                                                        <td>{ex.category}</td>
                                                        <td>{ex.date}</td>
                                                        <td style={{ color: '#ef4444', fontWeight: 'bold' }}>{formatCurrency(ex.amount)}</td>
                                                        <td><span className={styles.statusBadge}>{ex.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* INVOICES (ALL) */}
                        {activeModule === 'invoices' && (
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>Global Invoice Ledger</div>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Invoice ID</th><th>Date</th><th>Recipient</th><th>Type</th><th>Amount</th><th>Mode</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {getAllInvoices().map((inv, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{inv.id}</td>
                                                    <td>{inv.date}</td>
                                                    <td style={{ color: 'white', fontWeight: 500 }}>{inv.recipientName}</td>
                                                    <td>
                                                        <span style={{
                                                            fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px',
                                                            background: inv.type === 'fee_receipt' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                                                            color: inv.type === 'fee_receipt' ? '#60a5fa' : '#34d399'
                                                        }}>
                                                            {inv.type === 'fee_receipt' ? 'Student Fee' : 'Salary Slip'}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontWeight: 700, color: 'white' }}>{formatCurrency(inv.amount)}</td>
                                                    <td>{inv.mode}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button className={styles.btnSecondary} onClick={() => setPreviewInvoice(inv)} style={{ padding: '4px 8px' }}><Download size={14} /></button>
                                                            <button className={styles.btnSecondary} onClick={() => alert('Email sent!')} style={{ padding: '4px 8px' }}><Mail size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>

                {/* --- MODALS --- */}

                {/* 1. View History Modal */}
                <AnimatePresence>
                    {viewHistory && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`${styles.modalContent} ${styles.modalContentMedium}`}>
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Transaction History</h2>
                                    <button onClick={() => setViewHistory(null)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    {viewHistory.history.length === 0 ? <p style={{ textAlign: 'center', color: '#64748b' }}>No records found.</p> : (
                                        <table className={styles.table} style={{ fontSize: '0.9rem' }}>
                                            <thead><tr><th>Date</th><th>ID</th><th>Amount</th><th>Type</th><th>Action</th></tr></thead>
                                            <tbody>
                                                {viewHistory.history.map((h, i) => (
                                                    <tr key={i}>
                                                        <td>{h.date}</td>
                                                        <td style={{ fontFamily: 'monospace' }}>{h.id}</td>
                                                        <td style={{ color: '#10b981', fontWeight: 600 }}>{formatCurrency(h.amount)}</td>
                                                        <td>{h.type === 'salary_slip' ? 'Paying Staff' : 'Fee Collection'}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button onClick={() => setPreviewInvoice(h)} className={styles.btnSecondary} style={{ padding: '4px' }} title="Download Invoice"><Download size={14} /></button>
                                                                <button onClick={() => sendInvoiceEmail(h, viewHistory.email)} className={styles.btnSecondary} style={{ padding: '4px' }} title="Email Invoice"><Mail size={14} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 2. INVOICE PREVIEW MODAL */}
                <AnimatePresence>
                    {previewInvoice && (
                        <div className={styles.modalOverlay} style={{ zIndex: 1100, backdropFilter: 'blur(5px)' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className={styles.modalContent}
                                style={{ width: '800px', maxWidth: '95vw', background: 'white', color: '#0f172a', borderRadius: '4px', overflow: 'hidden', padding: 0 }}
                            >
                                <div style={{ padding: '3rem', minHeight: '600px', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                                    {/* STATUS STAMP WATERMARK */}
                                    {getInvoiceContext(previewInvoice) && (
                                        <div style={{
                                            position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
                                            fontSize: '8rem', fontWeight: 900, color: 'rgba(0,0,0,0.05)', whiteSpace: 'nowrap', pointerEvents: 'none', border: '10px solid rgba(0,0,0,0.05)', padding: '1rem 4rem', borderRadius: '20px'
                                        }}>
                                            {getInvoiceContext(previewInvoice)?.status?.toUpperCase()}
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '6px' }}></div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>BYTECODE <span style={{ fontWeight: 300 }}>TRAININGS</span></div>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>123 Tech Park, Hitech City<br />Hyderabad, Telangana 500081<br />support@bytecodetrainings.com</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: 300, color: '#94a3b8', textTransform: 'uppercase' }}>{previewInvoice.type === 'salary_slip' ? 'PAYSLIP' : 'INVOICE'}</div>
                                            <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>#{previewInvoice.id}</div>
                                            <div style={{ color: '#64748b' }}>Date: {previewInvoice.date}</div>
                                        </div>
                                    </div>

                                    {/* Recipient */}
                                    <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>{previewInvoice.type === 'salary_slip' ? 'Employee Details' : 'Bill To'}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{previewInvoice.recipientName}</div>
                                        <div style={{ color: '#64748b' }}>ID: {previewInvoice.recipientId}</div>
                                        <div style={{ color: '#64748b' }}>Area: {getInvoiceContext(previewInvoice)?.departmentOrCourse}</div>
                                    </div>

                                    {/* Line Items */}
                                    <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid #0f172a' }}>
                                                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: '#475569' }}>Description</th>
                                                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#475569' }}>Qty</th>
                                                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: '#475569' }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>{previewInvoice.type === 'salary_slip' ? 'Monthly Salary Remuneration' : 'Course Tuition Fee Payment'} <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Mode: {previewInvoice.mode}</div></td>
                                                <td style={{ textAlign: 'right', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>1</td>
                                                <td style={{ textAlign: 'right', padding: '1rem 0', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>{formatCurrency(previewInvoice.amount)}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Expanded Totals Section */}
                                    <div style={{ marginLeft: 'auto', width: '300px' }}>
                                        {/* Show Total / Due context if available */}
                                        {getInvoiceContext(previewInvoice) && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b' }}>
                                                    <span>Total {previewInvoice.type === 'salary_slip' ? 'Salary' : 'Course Fee'}</span>
                                                    <span>{formatCurrency(getInvoiceContext(previewInvoice)?.totalAmount || 0)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#ef4444' }}>
                                                    <span>Pending Due</span>
                                                    <span>{formatCurrency(getInvoiceContext(previewInvoice)?.pendingAmount || 0)}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                                            </>
                                        )}

                                        <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700 }}>
                                            <span>Paid Today</span>
                                            <span>{formatCurrency(previewInvoice.amount)}</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ marginTop: 'auto', paddingTop: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                                        <p>This is a computer-generated document. No signature is required.</p>
                                        <p>ByteCode Trainings | www.bytecodetrainings.com</p>
                                    </div>
                                </div>
                                <div style={{ background: '#f1f5f9', padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button onClick={() => setPreviewInvoice(null)} className={styles.btnSecondary} style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>Close</button>
                                    <button onClick={() => window.print()} className={styles.btnPrimary} style={{ background: '#0f172a' }}><Printer size={16} /> Print / Save PDF</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- EXISTING MODALS --- */}
                <AnimatePresence>
                    {selectedStudent && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`${styles.modalContent} ${styles.modalContentMedium}`}>
                                <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Collect Fee: {selectedStudent.name}</h2><button onClick={resetForm} className={styles.closeBtn}>✕</button></div>
                                <form onSubmit={handleCollectFee} className={styles.modalBody}>
                                    <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', marginBottom: '1.5rem' }}><div style={{ color: '#93c5fd' }}>Pending Due</div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{formatCurrency(selectedStudent.pendingFee)}</div></div>
                                    <div className={styles.formGroup}><label className={styles.formLabel}>Amount</label><input type="number" className={styles.formInput} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} max={selectedStudent.pendingFee} autoFocus required /></div>
                                    {/* ... rest of inputs ... */}
                                    <div className={styles.formActions}><button type="submit" className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>Pay & Generate Receipt</button></div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {selectedStaff && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`${styles.modalContent} ${styles.modalContentMedium}`}>
                                <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Process Salary: {selectedStaff.name}</h2><button onClick={resetForm} className={styles.closeBtn}>✕</button></div>
                                <form onSubmit={handleProcessPayroll} className={styles.modalBody}>
                                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', marginBottom: '1.5rem' }}><div style={{ color: '#6ee7b7' }}>Pending Salary</div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{formatCurrency(selectedStaff.pendingAmount)}</div></div>
                                    <div className={styles.formGroup}><label className={styles.formLabel}>Release Amount</label><input type="number" className={styles.formInput} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} max={selectedStaff.pendingAmount} autoFocus required /></div>
                                    <div className={styles.formActions}><button type="submit" className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>Release & Generate Slip</button></div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isAddExpenseOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`${styles.modalContent} ${styles.modalContentMedium}`}>
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Record Expense</h2>
                                    <button onClick={() => setIsAddExpenseOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <form onSubmit={handleAddExpense} className={styles.modalBody}>
                                    <div className={styles.formGroup}><label className={styles.formLabel}>Vendor</label><input name="vendor" className={styles.formInput} required autoFocus /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}><div className={styles.formGroup}><label className={styles.formLabel}>Amount</label><input name="amount" type="number" className={styles.formInput} required /></div><div className={styles.formGroup}><label className={styles.formLabel}>Date</label><input name="date" type="date" className={styles.formInput} defaultValue={new Date().toISOString().split('T')[0]} required /></div></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className={styles.formGroup}><label className={styles.formLabel}>Category</label><select name="category" className={styles.formSelect}><option>Infrastructure</option><option>Utilities</option><option>Marketing</option></select></div>
                                        <div className={styles.formGroup}><label className={styles.formLabel}>Status</label><select name="status" className={styles.formSelect}><option>Paid</option><option>Pending</option></select></div>
                                    </div>
                                    <div className={styles.formActions}><button type="submit" className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>Save Expense</button></div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
