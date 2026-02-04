"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, Calendar, Filter, ChevronDown,
    BookOpen, DollarSign, Users, Clock, CheckCircle, X
} from 'lucide-react';
import styles from '../../dashboard/Admin.module.css';

// Report Categories
const REPORT_CATEGORIES = [
    {
        id: 'academic',
        title: 'Academic Performance',
        icon: BookOpen,
        color: '#8b5cf6',
        description: 'Course completion rates, assessments, and student progress reports.',
        reports: ['Course Completion Summary', 'Student Assessment Detailed', 'Batch Progress Tracker', 'Dropout Risk Analysis']
    },
    {
        id: 'financial',
        title: 'Financial Reports',
        icon: DollarSign,
        color: '#10b981',
        description: 'Revenue analysis, fee collection status, and expense audits.',
        reports: ['Monthly Revenue Statement', 'Outstanding Fees Report', 'Expense Breakdown', 'Payroll Summary']
    },
    {
        id: 'hr',
        title: 'HR & Staffing',
        icon: Users,
        color: '#f43f5e',
        description: 'Employee attendance, performance reviews, and hiring metrics.',
        reports: ['Staff Attendance Log', 'Performance Appraisal', 'Hiring & Onboarding Stats']
    },
    {
        id: 'attendance',
        title: 'Attendance Logs',
        icon: Clock,
        color: '#f59e0b',
        description: 'Detailed attendance records for students and staff.',
        reports: ['Student Attendance Monthly', 'Staff Late Arrival Report', 'Bio-metric Sync Logs']
    }
];

export default function ReportsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const activeCategoryData = REPORT_CATEGORIES.find(c => c.id === selectedCategory);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* Header */}
                <div className={styles.glassHeader} style={{ marginBottom: '2rem' }}>
                    <div className={styles.titleGroup}>
                        <h3 style={{ fontSize: '1.8rem' }}>Reports & Analytics Center</h3>
                        <p className={styles.subTitle}>Generate comprehensive reports across all organizational modules.</p>
                    </div>
                    <button className={styles.btnSecondary} onClick={() => alert('Viewing scheduled reports...')}>
                        <Clock size={16} /> Scheduled Reports
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                    {/* Left Column: Selection Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {REPORT_CATEGORIES.map((cat) => (
                            <motion.div
                                key={cat.id}
                                onClick={() => { setSelectedCategory(cat.id); setSelectedReport(null); }}
                                whileHover={{ x: 5 }}
                                className={styles.glassPanel}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    borderLeft: selectedCategory === cat.id ? `4px solid ${cat.color}` : '4px solid transparent',
                                    background: selectedCategory === cat.id ? 'rgba(255,255,255,0.05)' : undefined
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: `${cat.color}20`, color: cat.color }}>
                                        <cat.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{cat.title}</h4>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{cat.reports.length} Reports Available</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{cat.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Configuration & Preview */}
                    <div className={styles.glassPanel} style={{ display: 'flex', flexDirection: 'column', minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
                        {selectedCategory && activeCategoryData ? (
                            <motion.div
                                key={selectedCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: `${activeCategoryData.color}20`, color: activeCategoryData.color }}>
                                        <activeCategoryData.icon size={32} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', margin: 0 }}>{activeCategoryData.title}</h2>
                                        <p style={{ color: '#94a3b8' }}>Configure generation parameters</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label className={styles.formLabel}>Select Specific Report</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {activeCategoryData.reports.map(rep => (
                                                <div
                                                    key={rep}
                                                    onClick={() => setSelectedReport(rep)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '0.5rem',
                                                        background: selectedReport === rep ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.03)',
                                                        border: selectedReport === rep ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid transparent',
                                                        cursor: 'pointer',
                                                        color: selectedReport === rep ? 'white' : '#cbd5e1',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    {rep}
                                                    {selectedReport === rep && <CheckCircle size={16} color="#a78bfa" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <label className={styles.formLabel}>Date Range</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>From</span>
                                                    <input type="date" className={styles.searchInput} style={{ width: '100%' }} />
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>To</span>
                                                    <input type="date" className={styles.searchInput} style={{ width: '100%' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.formLabel}>Export Format</label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {['PDF Document', 'Excel Spreadsheet', 'CSV Raw Data'].map(fmt => (
                                                    <button key={fmt} className={styles.btnSecondary} style={{ flex: 1, fontSize: '0.8rem' }}>{fmt}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button className={styles.btnSecondary} onClick={() => { setSelectedCategory(null); setSelectedReport(null); }}>Cancel View</button>
                                    <button className={styles.btnPrimary} disabled={!selectedReport} style={{ opacity: selectedReport ? 1 : 0.5 }}>
                                        <Download size={18} /> Generate Report
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                <FileText size={64} color="#475569" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Select a Category</h3>
                                <p style={{ maxWidth: '300px', textAlign: 'center', color: '#94a3b8' }}>Choose a report category from the left panel to begin configuring your data export.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Recent Downloads Mock */}
                <div style={{ marginTop: '3rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Recent Downloads</h4>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead><tr><th>Report Name</th><th>Date Generated</th><th>Format</th><th>Size</th><th>Action</th></tr></thead>
                            <tbody>
                                {[
                                    { name: 'Monthly_Revenue_Jan2026', date: 'Feb 01, 2026', fmt: 'PDF', size: '2.4 MB' },
                                    { name: 'Student_Attendance_Q4', date: 'Jan 28, 2026', fmt: 'Excel', size: '1.1 MB' },
                                    { name: 'Staff_Payroll_Summary', date: 'Jan 25, 2026', fmt: 'CSV', size: '450 KB' },
                                ].map((row, i) => (
                                    <tr key={i} className={styles.tableRow}>
                                        <td style={{ fontWeight: 500, color: 'white' }}>{row.name}</td>
                                        <td style={{ color: '#94a3b8' }}>{row.date}</td>
                                        <td><span className={styles.statusBadge} style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{row.fmt}</span></td>
                                        <td style={{ fontFamily: 'monospace' }}>{row.size}</td>
                                        <td><button className={styles.iconBtn}><Download size={14} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </motion.div>
        </DashboardLayout>
    );
}
