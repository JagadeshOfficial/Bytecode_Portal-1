"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, TrendingUp, PieChart, Download, Calendar, Filter,
    FileText, ArrowUpRight, ArrowDownRight, DollarSign, Users,
    Activity, Layers, Printer, Share2, Search, CheckCircle
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';

// -- Mock Data --
const FINANCIAL_DATA = [
    { month: 'Jan', revenue: 450000, expense: 320000 },
    { month: 'Feb', revenue: 480000, expense: 340000 },
    { month: 'Mar', revenue: 520000, expense: 380000 },
    { month: 'Apr', revenue: 510000, expense: 360000 },
    { month: 'May', revenue: 580000, expense: 410000 },
    { month: 'Jun', revenue: 640000, expense: 450000 },
];

const REPORT_CATS = [
    { id: 'academic', label: 'Academic Performance', icon: Layers, color: '#3b82f6' },
    { id: 'financial', label: 'Financial Audit', icon: DollarSign, color: '#10b981' },
    { id: 'operational', label: 'Operational Metrics', icon: Activity, color: '#f59e0b' },
];

const RECENT_REPORTS = [
    { id: 'R-2024-001', name: 'Q1 Financial Summary', type: 'Financial', date: '2024-04-10', size: '2.4 MB', author: 'Finance Team', status: 'Approved' },
    { id: 'R-2024-002', name: 'Student Attendance Report - March', type: 'Academic', date: '2024-04-02', size: '1.1 MB', author: 'Registrar', status: 'Pending' },
    { id: 'R-2024-003', name: 'Infrastructure Utilization Audit', type: 'Operational', date: '2024-03-28', size: '4.5 MB', author: 'Ops Manager', status: 'Approved' },
    { id: 'R-2024-004', name: 'Faculty Performance Review', type: 'Academic', date: '2024-03-25', size: '1.8 MB', author: 'HR Dept', status: 'Confidential' },
    { id: 'R-2024-005', name: 'Placement Drive Q1 Analysis', type: 'Academic', date: '2024-03-20', size: '3.2 MB', author: 'Placement Cell', status: 'Approved' },
];

export default function ReportsPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Filter reports
    const filteredReports = RECENT_REPORTS.filter(r =>
        (activeCategory === 'all' || r.type.toLowerCase().includes(activeCategory)) &&
        (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Helpers
    const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${styles.glassPanel} ${styles.neonBorder}`}
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${color}` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: `${color}20`, color: color }}>
                    <Icon size={24} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, color: trend.startsWith('+') ? '#10b981' : '#f43f5e', background: trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                    {trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}
                </div>
            </div>
            <div>
                <div className={styles.textLabel} style={{ marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{value}</div>
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* --- HEADER --- */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem',
                    padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)',
                    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div>
                        <div className={styles.textLabel} style={{ fontSize: '0.8rem', color: '#f472b6', marginBottom: '0.25rem' }}>INTELLIGENCE HUB</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Reports & Analytics
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className={styles.searchBar}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className={styles.btnSecondary}>
                            <Filter size={18} /> Filters
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => setIsExportOpen(true)}
                            style={{ background: '#ec4899', boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' }}
                        >
                            <Download size={18} strokeWidth={2.5} /> Export Data
                        </button>
                    </div>
                </div>

                {/* --- MOCK CHART SECTION --- */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Revenue Chart */}
                    <div className={styles.glassPanel} style={{ padding: '1.5rem' }}>
                        <div className={styles.cardHeader}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart3 size={20} color="#ec4899" />
                                Financial Performance (H1 2024)
                            </div>
                            <select className={styles.formSelect} style={{ width: 'auto', padding: '4px 12px', fontSize: '0.85rem' }}>
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div style={{ height: '300px', width: '100%', position: 'relative', marginTop: '1rem' }}>
                            <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                {[0, 1, 2, 3, 4].map(i => (
                                    <line key={i} x1="0" y1={i * 75} x2="800" y2={i * 75} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                ))}

                                {/* Bars */}
                                {FINANCIAL_DATA.map((d, i) => {
                                    const barWidth = 60;
                                    const gap = (800 - (FINANCIAL_DATA.length * barWidth)) / (FINANCIAL_DATA.length + 1);
                                    const maxVal = 700000;
                                    const hRev = (d.revenue / maxVal) * 300;
                                    const hExp = (d.expense / maxVal) * 300;
                                    const x = gap + i * (barWidth + gap);

                                    return (
                                        <g key={i} className={styles.hoverScale}>
                                            {/* Revenue Bar */}
                                            <rect x={x} y={300 - hRev} width={barWidth / 2} height={hRev} fill="#ec4899" rx="4" opacity="0.9" />
                                            {/* Expense Bar */}
                                            <rect x={x + barWidth / 2} y={300 - hExp} width={barWidth / 2} height={hExp} fill="#3b82f6" rx="4" opacity="0.6" />

                                            {/* Label */}
                                            <text x={x + barWidth / 2} y="320" fill="#94a3b8" fontSize="12" textAnchor="middle">{d.month}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                    <span style={{ width: '12px', height: '12px', background: '#ec4899', borderRadius: '2px' }}></span> Revenue
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                    <span style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></span> Expenses
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <StatCard title="Net Revenue" value="₹ 42.5L" trend="+12.5%" icon={DollarSign} color="#10b981" />
                        <StatCard title="Active Students" value="1,248" trend="+5.2%" icon={Users} color="#3b82f6" />
                        <StatCard title="Avg Attendance" value="94.2%" trend="-0.8%" icon={Activity} color="#f59e0b" />
                    </div>
                </div>

                {/* --- REPORTS LIST --- */}
                <div className={styles.glassPanel}>
                    <div className={styles.cardHeader} style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={20} color="#cbd5e1" /> Recent Generated Reports
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={activeCategory === 'all' ? styles.btnPrimary : styles.btnSecondary}
                                style={activeCategory === 'all' ? { background: '#ec4899', border: 'none' } : {}}
                            > All </button>
                            {REPORT_CATS.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={activeCategory === cat.id ? styles.btnPrimary : styles.btnSecondary}
                                    style={activeCategory === cat.id ? { background: '#ec4899', border: 'none' } : {}}
                                > {cat.id === 'academic' ? 'Academic' : cat.id === 'financial' ? 'Finance' : 'Ops'} </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Report Name</th>
                                    <th>Category</th>
                                    <th>Date Generated</th>
                                    <th>Author</th>
                                    <th>Size</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className={styles.interactiveRow}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#ec4899' }}>
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ color: 'white', fontWeight: 500 }}>{report.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {report.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                                background: report.type === 'Financial' ? 'rgba(16,185,129,0.1)' : report.type === 'Academic' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                                                color: report.type === 'Financial' ? '#10b981' : report.type === 'Academic' ? '#3b82f6' : '#f59e0b'
                                            }}>
                                                {report.type}
                                            </span>
                                        </td>
                                        <td>{report.date}</td>
                                        <td>{report.author}</td>
                                        <td style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{report.size}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                                {report.status === 'Approved' ? <CheckCircle size={14} color="#10b981" /> : <Activity size={14} color="#f59e0b" />}
                                                <span style={{ color: report.status === 'Approved' ? '#10b981' : '#f59e0b' }}>{report.status}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className={styles.btnSecondary} style={{ padding: '6px' }} title="Download"><Download size={14} /></button>
                                                <button className={styles.btnSecondary} style={{ padding: '6px' }} title="Print"><Printer size={14} /></button>
                                                <button className={styles.btnSecondary} style={{ padding: '6px' }} title="Share"><Share2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                No reports found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>

                {/* --- EXPORT MODAL --- */}
                <AnimatePresence>
                    {isExportOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.neonBorder}`}
                                style={{ maxWidth: '500px' }}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Export Data Report</h2>
                                    <button onClick={() => setIsExportOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <label className={styles.formLabel}>Select Data Range</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <input type="date" className={styles.formInput} />
                                                <input type="date" className={styles.formInput} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.formLabel}>Report Format</label>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {['PDF', 'Excel (CSV)', 'JSON', 'XML'].map(fmt => (
                                                    <label key={fmt} style={{
                                                        flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)',
                                                        borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                                                        border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', color: '#cbd5e1'
                                                    }}>
                                                        <input type="radio" name="format" style={{ marginRight: '8px' }} /> {fmt}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.formLabel}>Include Sections</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['Financial Summary', 'Student Analytics', 'Staff Performance', 'Inventory Logs', 'System Audit'].map(opt => (
                                                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', fontSize: '0.8rem', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <input type="checkbox" defaultChecked /> {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.formActions}>
                                            <button onClick={() => setIsExportOpen(false)} className={styles.btnSecondary} style={{ flex: 1 }}>Cancel</button>
                                            <button onClick={() => setIsExportOpen(false)} className={styles.btnPrimary} style={{ flex: 1, background: '#10b981' }}>
                                                <Download size={18} /> Generate & Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
