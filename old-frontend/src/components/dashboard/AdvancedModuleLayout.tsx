"use client";

import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { Role } from '@/lib/dashboard-config';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, Search, MoreVertical, LayoutGrid, List } from 'lucide-react';
import styles from '@/app/admin/super/SuperAdmin.module.css';

interface Stat {
    label: string;
    value: string;
    icon: any;
    color: string;
    trend?: string;
}

interface Tab {
    id: string;
    label: string;
    icon?: any;
}

interface AdvancedModuleLayoutProps {
    title: string;
    subtitle: string;
    stats: Stat[];
    tabs?: Tab[];
    actions?: React.ReactNode;
    children: React.ReactNode;
    activeTab?: string;
    onTabChange?: (id: string) => void;
    role?: Role;
}

export default function AdvancedModuleLayout({
    title,
    subtitle,
    stats,
    tabs = [],
    actions,
    children,
    activeTab,
    onTabChange,
    role = 'super_admin'
}: AdvancedModuleLayoutProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <DashboardLayout role={role}>
            <div className={styles.container}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.textH1}
                        >
                            {title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className={styles.textSub}
                        >
                            {subtitle}
                        </motion.p>
                    </div>
                    <div className={styles.actionBtnRow}>
                        {actions || (
                            <>
                                <button className={styles.btnSecondary}>
                                    <Filter size={16} /> Filter
                                </button>
                                <button className={styles.btnPrimary}>
                                    <Plus size={16} /> Create New
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* High-Performance Stats Grid (Precision Design) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group bg-[#0d0d1f]/40 border border-white/5 rounded-2xl p-6 hover:border-violet-500/20 transition-all duration-500 overflow-hidden"
                        >
                            {/* Technical Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-violet-400 group-hover:border-violet-500/20 transition-all"
                                    style={{ color: stat.color }}
                                >
                                    <stat.icon size={18} />
                                </div>
                                {stat.trend && (
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                        {stat.trend}
                                    </span>
                                )}
                            </div>

                            <div>
                                <div className="text-2xl font-black text-white tracking-tighter mb-0.5 font-[Rajdhani]">{stat.value}</div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">{stat.label}</div>
                            </div>

                            {/* Background Glow Overlay */}
                            <div
                                className="absolute -right-4 -bottom-4 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-full"
                                style={{ backgroundColor: stat.color }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* High-Precision Professional Navigation (Sleek Ghost Style) */}
                {tabs.length > 0 && (
                    <div className="flex items-center gap-8 mb-12 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange && onTabChange(tab.id)}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black transition-all duration-500 relative group
                                        ${isActive
                                            ? 'text-violet-400 border border-violet-500/40 bg-violet-500/5 shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                                            : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                        }`}
                                >
                                    {tab.icon && (
                                        <tab.icon
                                            size={16}
                                            className={`transition-colors duration-300 ${isActive ? 'text-violet-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                                        />
                                    )}
                                    <span className="uppercase tracking-[0.2em]">{tab.label}</span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-12 h-[2px] bg-violet-500 shadow-[0_0_10px_#8b5cf6]"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab || 'content'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
