"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
    UserCheck, Plus, Search, Edit2, Trash2, 
    Clock, Activity, MapPin, Shield,
    CheckCircle, XCircle, MoreVertical, Calendar
} from 'lucide-react';

export default function EmployeeTracking() {
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        setEmployees([
            { id: 1, name: 'Vamsi Krishna', role: 'HEAD_TRAINER', status: 'ONLINE', login: '09:00 AM', ip: '192.168.1.45', activity: 'Teaching: Batch J1' },
            { id: 2, name: 'Anjali Sharma', role: 'COUNSELOR', status: 'AWAY', login: '09:30 AM', ip: '103.44.22.11', activity: 'CRM Leads Prep' },
            { id: 3, name: 'Siddharth M.', role: 'TRAINER', status: 'OFFLINE', login: '09:15 AM', ip: '192.168.1.12', activity: 'End of Shift' },
        ]);
    }, []);

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>Workforce Performance Hub</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Monitor real-time employee attendance, session logs, and task throughput.</p>
                    </div>
                    <button className="btn-quantum" style={{ padding: '14px 28px' }}>
                        <Calendar size={18} style={{ marginRight: '8px' }} /> EXPORT TIMESHEETS
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {employees.map((e, idx) => (
                        <EmployeeCard key={e.id} {...e} />
                    ))}
                </div>

                {/* --- ACTIVITY LOGS --- */}
                <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem' }}>Global Security & Access Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <AccessLogRow user="Anjali Sharma" action="LOGIN" status="SUCCESS" ip="103.44.22.11" time="Just Now" />
                        <AccessLogRow user="Siddharth M." action="LOGOUT" status="SECURE" ip="192.168.1.12" time="15m ago" />
                        <AccessLogRow user="Vamsi Krishna" action="FILE_EXPORT" status="AUTHORIZED" ip="192.168.1.45" time="22m ago" />
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

function EmployeeCard({ name, role, status, login, ip, activity }: any) {
    const statusMap: any = {
        'ONLINE': { color: '#10b981', label: 'ACTIVE' },
        'AWAY': { color: '#f59e0b', label: 'IDLE' },
        'OFFLINE': { color: '#64748b', label: 'SESSION_END' }
    };
    return (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>{name.charAt(0)}</div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800 }}>{role}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: statusMap[status]?.color, letterSpacing: '1px', background: `${statusMap[status]?.color}15`, padding: '4px 10px', borderRadius: '100px' }}>{statusMap[status]?.label}</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800 }}>IP: {ip}</div>
                </div>
             </div>

             <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>LAST ACTIVITY</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-dim)' }}>{login} LOGIN</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={14} /> {activity}
                </div>
             </div>

             <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>VIEW LOGS</button>
                <button style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: '#fff' }}><Shield size={16} /></button>
             </div>
        </div>
    );
}

function AccessLogRow({ user, action, status, ip, time }: any) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{user.charAt(0)}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Protocol: {action} • IP: {ip}</div>
                </div>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>{status}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '2px' }}>{time}</div>
            </div>
        </div>
    );
}
