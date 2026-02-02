"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Box, Laptop, Server } from 'lucide-react';
import styles from '../SuperAdmin.module.css';

export default function AssetsPage() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="p-6 rounded-full bg-amber-500/10 mb-6 border border-amber-500/20">
                        <Box size={64} className="text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-rajdhani text-white mb-2">Assets & Inventory</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        Track infrastructure, lab equipment, and digital assets.
                    </p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        {['Lab Inventory', 'Hardware Tracking', 'Resource Allocation'].map((item) => (
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
