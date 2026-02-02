"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Award } from 'lucide-react';
import styles from '../SuperAdmin.module.css';

export default function PlacementsPage() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="p-6 rounded-full bg-blue-500/10 mb-6 border border-blue-500/20">
                        <Briefcase size={64} className="text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">Corporate Placements</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Manage corporate relations, interview drives, and student offers.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        {['Corporate Database', 'Interview Scheduler', 'Offer Management'].map((item) => (
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
