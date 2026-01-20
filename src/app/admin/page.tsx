"use client";

import DashboardLayout from '@/components/DashboardLayout';
import styles from '../page.module.css'; // Reusing grid styles or create new

export default function AdminDashboard() {
    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Administrator. Here is what is happening today.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatsCard title="Total Students" value="1,240" trend="+12%" color="blue" />
                <StatsCard title="Active Courses" value="24" trend="Active" color="green" />
                <StatsCard title="Total Revenue" value="$450k" trend="+5%" color="purple" />
                <StatsCard title="Pending Inquiries" value="18" trend="Urgent" color="orange" />
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Recent Admissions</h3>
                    <div style={{ color: 'var(--text-secondary)' }}>No recent data available.</div>
                </div>
                <div className="card" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Institute Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ProgressBar label="Server Status" value={98} color="green" />
                        <ProgressBar label="Disk Usage" value={45} color="blue" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatsCard({ title, value, trend, color }: any) {
    const colors: any = {
        blue: '#e0f2fe',
        green: '#dcfce7',
        purple: '#f3e8ff',
        orange: '#ffedd5'
    };
    const textColors: any = {
        blue: '#0369a1',
        green: '#15803d',
        purple: '#7e22ce',
        orange: '#c2410c'
    };

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{value}</div>
            <span style={{
                background: colors[color],
                color: textColors[color],
                padding: '0.25rem 0.5rem',
                borderRadius: '1rem',
                fontSize: '0.8rem',
                fontWeight: '600'
            }}>{trend}</span>
        </div>
    );
}

function ProgressBar({ label, value, color }: any) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    width: `${value}%`,
                    background: color === 'green' ? 'var(--success)' : 'var(--primary)',
                    height: '100%'
                }}></div>
            </div>
        </div>
    );
}
