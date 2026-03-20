"use client";

import { useState } from 'react';
import AdvancedModuleLayout from '@/components/dashboard/AdvancedModuleLayout';
import { motion } from 'framer-motion';
import {
    Wallet,
    DollarSign,
    TrendingUp,
    PieChart,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle,
    Clock,
    User,
    ArrowRight,
    MessageSquare,
    Percent,
    CreditCard
} from 'lucide-react';

export default function AdministrativeFinancePage() {
    const [activeTab, setActiveTab] = useState('tracking');

    const stats = [
        { label: "Total Remittance", value: "₹42.8L", icon: Wallet, color: "#10b981", trend: "+12.4% vs prev month" },
        { label: "Pending Fees", value: "₹8.2L", icon: Clock, color: "#f59e0b", trend: "45 students" },
        { label: "Discount Requests", value: "12", icon: Percent, color: "#3b82f6", trend: "05 Urgent" },
        { label: "Operating Margin", value: "32%", icon: TrendingUp, color: "#a855f7" },
    ];

    const feePayments = [
        { id: "PAY-1042", student: "Arjun Mehra", course: "React Masterclass", amount: "₹45,000", date: "Today, 10:45 AM", method: "UPI", status: "Success" },
        { id: "PAY-1041", student: "Sneha Gupta", course: "Java Full Stack", amount: "₹12,500", date: "Today, 09:12 AM", method: "Cards", status: "Success" },
        { id: "PAY-1040", student: "Rahul Verma", course: "Data Science", amount: "₹35,000", date: "Yesterday", method: "Net Banking", status: "Success" },
        { id: "PAY-1039", student: "Priya Sharma", course: "UI/UX Design", amount: "₹22,000", date: "Yesterday", method: "UPI", status: "Pending" },
    ];

    const discountRequests = [
        { id: "DSC-82", student: "Vikram Shah", requested: "20%", reason: "Academic Merit - 95% Score", status: "Review" },
        { id: "DSC-81", student: "Meera Nair", requested: "15%", reason: "Financial Assistance Request", status: "Review" },
    ];

    return (
        <AdvancedModuleLayout
            title="Finance & Fee Control"
            subtitle="Institute-level financial oversight, student payment tracking, and discount authorization."
            stats={stats}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            role="admin"
            tabs={[
                { id: 'tracking', label: 'Payment Logs', icon: DollarSign },
                { id: 'discounts', label: 'Discount Approvals', icon: Percent },
                { id: 'invoices', label: 'Batch Invoicing', icon: CreditCard },
                { id: 'analytics', label: 'Revenue Analytics', icon: PieChart },
            ]}
        >
            {activeTab === 'tracking' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Search by student, ID, or payment ref..." className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all">
                                <ArrowRight size={18} /> RECONCILE ACCOUNTS
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction Ref</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student & Course</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {feePayments.map((pay, i) => (
                                    <motion.tr
                                        key={pay.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <td className="p-5 text-sm font-bold text-white font-mono">{pay.id}</td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-white">{pay.student}</div>
                                            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{pay.course}</div>
                                        </td>
                                        <td className="p-5 text-xs text-slate-400">{pay.date}</td>
                                        <td className="p-5 text-sm font-bold text-white">{pay.amount}</td>
                                        <td className="p-5 text-xs text-slate-500">{pay.method}</td>
                                        <td className="p-5 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${pay.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>{pay.status}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'discounts' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {discountRequests.map((req, i) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] backdrop-blur-md relative group hover:border-blue-500/30 transition-all"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-16 -mt-16 rounded-full" />
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{req.student}</h3>
                                        <p className="text-xs text-slate-500 font-mono tracking-widest">{req.id}</p>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl">
                                    <span className="text-xl font-black text-blue-400">{req.requested}</span>
                                    <span className="text-[10px] block font-bold text-blue-500/80 uppercase">Discount Requested</span>
                                </div>
                            </div>

                            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mb-8">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                    <MessageSquare size={12} /> Reason for Request
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed italic">"{req.reason}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold text-xs tracking-widest uppercase hover:bg-emerald-600 hover:text-white transition-all">
                                    APPROVE
                                </button>
                                <button className="flex-1 py-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-400 font-bold text-xs tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
                                    REJECT
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </AdvancedModuleLayout>
    );
}
