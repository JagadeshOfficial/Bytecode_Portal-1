"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
    FileText, Download, Calendar, Filter, BarChart2, PieChart as PieChartIcon,
    Users, DollarSign, TrendingUp, BookOpen, Clock, Globe
} from 'lucide-react';
import styles from '../Admin.module.css';

// -- Mock Report Types --
const REPORT_CATEGORIES = [
    {
        id: 'academic',
        title: 'Academic Performance',
        icon: BookOpen,
        color: '#8b5cf6',
        description: 'Course completion rates, assessments, and student progress reports.',
        reports: ['Course Completion Summary', 'Student Assessment Detailed', 'Batch Progress Tracker']
    },
    {
        id: 'finance',
        title: 'Financial & Fees',
        icon: DollarSign,
        color: '#10b981',
        description: 'Revenue analysis, outstanding fee reports, and transaction history.',
        reports: ['Monthly Revenue Statement', 'Outstanding Fees List', 'Expense Detailed Breakdown']
    },
    {
        id: 'attendance',
        title: 'Attendance & Activity',
        icon: Clock,
        color: '#f59e0b',
        description: 'Daily attendance logs, late arrival trends, and engagement metrics.',
        reports: ['Monthly Attendance Register', 'Low Attendance Alert', 'Staff Timesheet']
    },
    {
        id: 'hr',
        title: 'HR & Staffing',
        icon: Users,
        color: '#3b82f6',
        description: 'Staff performance, payroll insights, and resource allocation.',
        reports: ['Tutor Performance Review', 'Payroll Summary', 'Recruitment Pipeline']
    }
];

export default function ReportsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState('Last 30 Days');

    return (
        <DashboardLayout role="admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '2rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>REPORTS & ANALYTICS Center</h3>
                        <p className={styles.subTitle}>Generate insights, export data, and track organizational performance.</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                    {/* Left Column: Selection Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Report Categories */}
                        <div className={styles.glassPanel} style={{ padding: '0', overflow: 'hidden' }}>
                            <div className={styles.panelHeader} style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0' }}>Select Category</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {REPORT_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setSelectedReport(null); }}
                                        className={styles.interactiveRow}
                                        style={{
                                            padding: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            background: selectedCategory === cat.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                            borderLeft: selectedCategory === cat.id ? `4px solid ${cat.color}` : '4px solid transparent',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{ padding: '0.6rem', borderRadius: '0.6rem', background: `rgba(${parseInt(cat.color.slice(1, 3), 16)}, ${parseInt(cat.color.slice(3, 5), 16)}, ${parseInt(cat.color.slice(5, 7), 16)}, 0.1)`, color: cat.color }}>
                                            <cat.icon size={20} />
                                        </div>
                                        <div>
                                            <div style={{ color: selectedCategory === cat.id ? 'white' : '#cbd5e1', fontWeight: 600 }}>{cat.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.reports.length} Reports Available</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Downloads (Mock) */}
                        <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Downloads</h4>
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                    <FileText size={18} color="#64748b" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Financial_Jan_2026.pdf</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Downloaded 2 hours ago</div>
                                    </div>
                                    <Download size={14} color="#64748b" style={{ cursor: 'pointer' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Configuration & Preview */}
                    <div className={styles.glassPanel} style={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
                        {selectedCategory ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>

                                {/* Header Section */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                                        {(() => {
                                            const CatIcon = REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.icon || FileText;
                                            return <CatIcon size={32} color={REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.color} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', margin: 0, fontFamily: 'Rajdhani' }}>
                                            {REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.title}
                                        </h2>
                                        <p style={{ color: '#94a3b8', marginTop: '0.5rem', maxWidth: '600px' }}>
                                            {REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Report Type Selection */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', color: '#cbd5e1', fontSize: '0.9rem' }}>Select Specific Report</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {REPORT_CATEGORIES.find(c => c.id === selectedCategory)?.reports.map((report) => (
                                            <button
                                                key={report}
                                                onClick={() => setSelectedReport(report)}
                                                style={{
                                                    padding: '1rem',
                                                    background: selectedReport === report ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
                                                    border: selectedReport === report ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '0.75rem',
                                                    color: selectedReport === report ? 'white' : '#94a3b8',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {report}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Configuration Controls */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Date Range</label>
                                        <div style={{ position: 'relative' }}>
                                            <Calendar size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                            <select
                                                value={dateRange}
                                                onChange={(e) => setDateRange(e.target.value)}
                                                className={styles.formSelect}
                                                style={{ width: '100%', paddingLeft: '2.5rem' }}
                                            >
                                                <option>Last 7 Days</option>
                                                <option>Last 30 Days</option>
                                                <option>This Quarter</option>
                                                <option>Year to Date</option>
                                                <option>Custom Range...</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>Export Format</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {['PDF', 'Excel', 'CSV'].map(fmt => (
                                                <button key={fmt} className={styles.btnSecondary} style={{ flex: 1, justifyContent: 'center' }}>
                                                    {fmt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Action */}
                                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button className={styles.btnSecondary}>Preview Data</button>
                                    <button
                                        className={styles.btnPrimary}
                                        disabled={!selectedReport}
                                        style={{ padding: '0.8rem 2rem', opacity: !selectedReport ? 0.5 : 1, cursor: !selectedReport ? 'not-allowed' : 'pointer' }}
                                    >
                                        Generate Report
                                    </button>
                                </div>

                            </motion.div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                <div style={{ padding: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', marginBottom: '1.5rem' }}>
                                    <BarChart2 size={48} strokeWidth={1} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 500 }}>Select a Report Category</h3>
                                <p>Choose a category from the sidebar to start generating reports.</p>
                            </div>
                        )}
                    </div>
                </div>

            </motion.div>
        </DashboardLayout>
    );
}
