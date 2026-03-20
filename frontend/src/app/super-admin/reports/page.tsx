"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    BarChart3, FileDown, Search, Filter, 
    PieChart, TrendingUp, Calendar, 
    Download, Activity, Layers, Users, DollarSign
} from 'lucide-react';

export default function ReportsManagement() {
    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Platform Intelligence Center</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Aggregate cross-service data into actionable multi-dimensional reports.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <ReportCategoryCard icon={<Users size={24} />} title="Student Life Cycle" desc="Enrollment to placement funnel, attendance and competency mapping." color="#8b5cf6" />
                    <ReportCategoryCard icon={<DollarSign size={24} />} title="Revenue Architecture" desc="Daily yields, outstanding liabilities, and regional growth metrics." color="#10b981" />
                    <ReportCategoryCard icon={<Activity size={24} />} title="Operations Velocity" desc="Employee throughput, batch performance, and system uptime." color="#3b82f6" />
                </div>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Universal Data Exports</h3>
                        <div style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                            <Calendar size={16} style={{ marginRight: '10px' }} /> PERIOD: LAST 30 DAYS
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ExportRow title="Global Revenue Statement - MAR 2026" type="FINANCE" format="PDF / XLSX" size="2.4 MB" />
                        <ExportRow title="Student Placement Readiness Matrix" type="CAREER" format="PDF" size="1.8 MB" />
                        <ExportRow title="Employee Performance Index" type="WORKFORCE" format="XLSX" size="4.2 MB" />
                        <ExportRow title="Batch-wise Attendance Aggregate" type="ACADEMIC" format="PDF" size="1.1 MB" />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function ReportCategoryCard({ icon, title, desc, color }: any) {
    return (
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', borderTop: `5px solid ${color}`, background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, transparent 100%)' }}>
            <div style={{ color, marginBottom: '1.5rem', background: `${color}10`, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{desc}</p>
            <button style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>GENERATE DATA →</button>
        </div>
    );
}

function ExportRow({ title, type, format, size }: any) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 150px 100px', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.015)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'var(--primary)' }}><FileDown size={20} /></div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{title}</div>
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)', textAlign: 'center' }}>{type}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>{format}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textAlign: 'center' }}>{size}</div>
            <div style={{ textAlign: 'right' }}>
                <button style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}><Download size={14} /></button>
            </div>
        </div>
    );
}
