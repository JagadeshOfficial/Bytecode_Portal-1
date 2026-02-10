"use client";

import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
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
}

export default function AdvancedModuleLayout({
    title,
    subtitle,
    stats,
    tabs = [],
    actions,
    children,
    activeTab,
    onTabChange
}: AdvancedModuleLayoutProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <DashboardLayout role="super_admin">
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

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={styles.glassPanel}
                            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <stat.icon size={64} />
                            </div>
                            <div className="flex justify-between items-start relative z-10">
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    background: `${stat.color}20`,
                                    color: stat.color,
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    <stat.icon size={20} />
                                </div>
                                {stat.trend && (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div className="relative z-10">
                                <div className={styles.textH1} style={{ fontSize: '2rem', marginTop: '0.5rem', lineHeight: 1 }}>{stat.value}</div>
                                <div className={styles.textLabel} style={{ opacity: 0.7, marginTop: '0.25rem' }}>{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                {tabs.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange && onTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                        ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.icon && <tab.icon size={16} />}
                                {tab.label}
                            </button>
                        ))}
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
