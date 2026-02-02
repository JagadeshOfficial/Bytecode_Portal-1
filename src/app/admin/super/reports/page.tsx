"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import styles from '../SuperAdmin.module.css';

export default function ReportsPage() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="p-6 rounded-full bg-pink-500/10 mb-6 border border-pink-500/20">
                        <BarChart3 size={64} className="text-pink-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">Deep Analytics</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Comprehensive reports on academic, financial, and operational performance.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        {['Academic Reports', 'Financial Audits', 'Operational Metrics'].map((item) => (
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
