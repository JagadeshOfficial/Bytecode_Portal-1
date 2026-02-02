"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Settings, Database, Lock } from 'lucide-react';
import styles from '../SuperAdmin.module.css';

export default function SettingsPage() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="p-6 rounded-full bg-slate-500/10 mb-6 border border-slate-500/20">
                        <Settings size={64} className="text-slate-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">Platform Configuration</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        System-wide settings, access controls, and platform preferences.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        {['General Config', 'Access Control', 'Audit Logs'].map((item) => (
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
