"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, PieChart } from 'lucide-react';
import styles from '../SuperAdmin.module.css';

export default function FinancePage() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="p-6 rounded-full bg-emerald-500/10 mb-6 border border-emerald-500/20">
                        <DollarSign size={64} className="text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">Financial Command Center</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Centralized tracking for Fees, ROI, and Operational Expenses.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        {['Fee Collection', 'Expense Tracking', 'Payroll Systems'].map((item) => (
                            <div key={item} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
