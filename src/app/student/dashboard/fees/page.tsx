"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    CreditCard,
    DollarSign,
    FileText,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter,
    ArrowDownToLine,
    ShieldCheck,
    Lock
} from 'lucide-react';

const FEE_STRUCTURE = {
    total: 85000,
    paid: 65000,
    remaining: 20000,
    nextDueDate: "March 15, 2026",
    installmentType: "Quarterly"
};

const TRANSACTIONS = [
    { id: "TX-9921", date: "Feb 05, 2026", amount: 25000, method: "UPI / PhonePe", status: "Success", receipt: "#REC-102" },
    { id: "TX-8812", date: "Jan 03, 2026", amount: 20000, method: "Debit Card", status: "Success", receipt: "#REC-101" },
    { id: "TX-7745", date: "Dec 01, 2025", amount: 20000, method: "Net Banking", status: "Success", receipt: "#REC-098" },
];

export default function StudentFeesPage() {
    return (
        <DashboardLayout role="student">
            <div className="flex flex-col gap-8 pb-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                            Financial <span className="text-emerald-400">Portal</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Manage your course investments, download receipts, and track payment schedules.</p>
                    </div>
                </div>

                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#0a0a1a]/60 border border-emerald-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -mr-24 -mt-24 rounded-full" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10">
                                    <Wallet size={28} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">PAID ON TIME</span>
                            </div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 tracking-tighter">Total Amount Paid</h3>
                            <div className="text-4xl font-black text-white tracking-tight">₹{FEE_STRUCTURE.paid.toLocaleString()}</div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                <ShieldCheck size={12} className="text-emerald-500" />
                                Verified Institutional Record
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a1a]/60 border border-amber-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[80px] -mr-24 -mt-24 rounded-full" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/10">
                                    <CreditCard size={28} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">NEXT INSTALLMENT</span>
                                    <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase leading-none">{FEE_STRUCTURE.nextDueDate}</span>
                                </div>
                            </div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 tracking-tighter">Remaining Balance</h3>
                            <div className="text-4xl font-black text-white tracking-tight">₹{FEE_STRUCTURE.remaining.toLocaleString()}</div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                <AlertCircle size={12} className="text-amber-500" />
                                No Penalties Accrued
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-600/20 via-transparent to-transparent border border-violet-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Clear Your Dues</h3>
                        <p className="text-xs text-slate-500 font-medium mb-8">Pay via UPI, Cards or Net Banking instantly.</p>
                        <button className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-black text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-violet-500/30 transition-all uppercase">PROCEED TO PAY ₹{FEE_STRUCTURE.remaining.toLocaleString()}</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Transaction Ledger</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Full payment history & receipts</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Search size={18} /></button>
                                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Filter size={18} /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                                            <th className="pb-6 pl-4 font-black">TRANSACTION ID</th>
                                            <th className="pb-6 px-4 font-black">DATE</th>
                                            <th className="pb-6 px-4 font-black text-right">AMOUNT</th>
                                            <th className="pb-6 px-4 font-black">METHOD</th>
                                            <th className="pb-6 pr-4 font-black text-right">RECEIPT</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {TRANSACTIONS.map((tx) => (
                                            <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all">
                                                <td className="py-6 pl-4">
                                                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{tx.id}</div>
                                                    <div className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">SUCCESSFUL</div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{tx.date}</div>
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    <div className="text-sm font-black text-white">₹{tx.amount.toLocaleString()}</div>
                                                </td>
                                                <td className="py-6 px-4">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.method}</div>
                                                </td>
                                                <td className="py-6 pr-4 text-right">
                                                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all shadow-lg group-hover:scale-110">
                                                        <ArrowDownToLine size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Structure Details & Support */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0a0a1a]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-tight">
                                <FileText className="text-violet-400" size={24} />
                                Fee Template
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Total Tuition Fee", val: 75000 },
                                    { label: "Admission & Admin", val: 5000 },
                                    { label: "LMS & Exam Access", val: 5000 },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-500 uppercase tracking-tight">{item.label}</span>
                                        <span className="text-white">₹{item.val.toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-sm font-black text-white uppercase tracking-[0.1em]">Grand Total</span>
                                    <span className="text-xl font-black text-emerald-400">₹{FEE_STRUCTURE.total.toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">DOWNLOAD FEE STRUCTURE</button>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-[#0c051a] to-[#030014] border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="flex gap-5 items-start relative z-10">
                                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400 shadow-xl shadow-blue-500/5">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Secure Payments</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">All transactions are encrypted with 256-bit SSL. Receipts are tamper-proof and available globally.</p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] relative z-10">
                                <Lock size={12} /> PCI DSS COMPLIANT
                            </div>
                            {/* Decorative Grid BG */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
