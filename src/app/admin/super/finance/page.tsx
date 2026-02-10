"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    PieChart,
    Wallet,
    FileText,
    Download,
    MoreVertical,
    Clock,
    Briefcase
} from 'lucide-react';

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: "Total Revenue", value: "₹24.5M", icon: DollarSign, color: "#10b981", trend: "+12.5% MoM" },
        { label: "Expenses", value: "₹8.2M", icon: CreditCard, color: "#ef4444", trend: "-2.1% MoM" },
        { label: "Net Profit", value: "₹16.3M", icon: TrendingUp, color: "#3b82f6", trend: "+18% YoY" },
        { label: "Pending Invoices", value: "14", icon: FileText, color: "#f59e0b", trend: "Due Soon" },
    ];

    const transactions = [
        { desc: "Tuition Fee - Batch #24", date: "Today, 10:24 AM", amount: "+₹1,25,000", type: "income", status: "Completed" },
        { desc: "Cloud Server Costs (AWS)", date: "Yesterday, 4:15 PM", amount: "-₹18,450", type: "expense", status: "Completed" },
        { desc: "Instructor Payroll - Feb", date: "Feb 01, 2026", amount: "-₹4,50,000", type: "expense", status: "Processing" },
        { desc: "Corporate Training Revenue", date: "Jan 28, 2026", amount: "+₹8,00,000", type: "income", status: "Completed" },
        { desc: "Office Rent", date: "Jan 25, 2026", amount: "-₹1,50,000", type: "expense", status: "Completed" },
    ];

    return (
        <AdvancedModuleLayout
            title="Financial Management"
            subtitle="Track revenue, expenses, payroll, and invoicing."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
                { id: 'overview', label: 'Overview', icon: PieChart },
                { id: 'revenue', label: 'Revenue Streams', icon: TrendingUp },
                { id: 'expenses', label: 'Expenses', icon: CreditCard },
                { id: 'invoices', label: 'Invoices', icon: FileText },
            ]}
        >
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock size={20} className="text-emerald-400" /> Recent Transactions
                            </h3>
                            <button className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:underline">
                                <Download size={14} /> Full Report
                            </button>
                        </div>
                        <div className="space-y-4">
                            {transactions.map((txn, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${txn.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {txn.type === 'income' ? <TrendingUp size={20} /> : <CreditCard size={20} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{txn.desc}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-2">
                                                <span>{txn.date}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                <span className={txn.status === 'Processing' ? 'text-amber-400' : 'text-slate-500'}>{txn.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-lg font-mono font-bold ${txn.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {txn.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Financial Health</h3>
                            <div className="flex items-center justify-center py-6">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
                                        <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset="44" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white">92%</span>
                                        <span className="text-xs text-slate-400 uppercase">Healthy</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <div className="text-xs text-slate-400 mb-1">Cash Flow</div>
                                    <div className="text-emerald-400 font-bold">+14%</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                    <div className="text-xs text-slate-400 mb-1">Liability</div>
                                    <div className="text-slate-200 font-bold">Low</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors">
                                + Create Invoice
                            </button>
                            <button className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-sm font-bold border border-white/10 hover:bg-white/10 transition-colors">
                                Export PDF
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-slate-400 border border-white/5 cursor-pointer hover:text-white">All</span>
                            <span className="px-3 py-1 bg-amber-500/10 rounded-lg text-xs font-bold text-amber-400 border border-amber-500/20 cursor-pointer">Pending</span>
                            <span className="px-3 py-1 bg-emerald-500/10 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/20 cursor-pointer">Paid</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Invoice ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Client / Student</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Status</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase border-b border-white/5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: "#INV-2024-001", client: "TechCorp Solutions", date: "Feb 10, 2026", amount: "₹4,50,000", status: "Paid" },
                                    { id: "#INV-2024-002", client: "Rahul Sharma (Student)", date: "Feb 09, 2026", amount: "₹85,000", status: "Pending" },
                                    { id: "#INV-2024-003", client: "Innovate Inc", date: "Feb 08, 2026", amount: "₹2,10,000", status: "Overdue" },
                                    { id: "#INV-2024-004", client: "Priya Patel (Student)", date: "Feb 05, 2026", amount: "₹45,000", status: "Paid" },
                                ].map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 border-b border-white/5 font-mono text-sm text-slate-300">{inv.id}</td>
                                        <td className="p-4 border-b border-white/5 font-bold text-white">{inv.client}</td>
                                        <td className="p-4 border-b border-white/5 text-sm text-slate-400">{inv.date}</td>
                                        <td className="p-4 border-b border-white/5 font-mono text-white">
                                            {inv.amount}
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-red-500/10 text-red-400'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-white/5">
                                            <button className="text-slate-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
