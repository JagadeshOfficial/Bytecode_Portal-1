"use client";

import DashboardLayout from '@/components/DashboardLayout';

export default function EmployeeDashboard() {
    return (
        <DashboardLayout role="employee">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Faculty Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your classes and student progress.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatsCard title="Scheduled Classes" value="4" trend="Today" color="blue" />
                <StatsCard title="Assignments to Grade" value="12" trend="Pending" color="orange" />
                <StatsCard title="Average Attendance" value="88%" trend="Good" color="green" />
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Today's Schedule</h3>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '100px 1fr 100px', fontWeight: '600', background: 'var(--surface)' }}>
                    <div>Time</div>
                    <div>Course</div>
                    <div>Action</div>
                </div>
                <ScheduleRow time="10:00 AM" title="Java Full Stack Development - Batch A" status="Live Now" />
                <ScheduleRow time="02:00 PM" title="React.js Advanced Concepts" status="Upcoming" />
                <ScheduleRow time="04:00 PM" title="System Design Workshop" status="Upcoming" />
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

function ScheduleRow({ time, title, status }: any) {
    return (
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '100px 1fr 100px', alignItems: 'center' }}>
            <div style={{ color: 'var(--text-secondary)' }}>{time}</div>
            <div style={{ fontWeight: '500' }}>{title}</div>
            <div>
                <button style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: status === 'Live Now' ? 'var(--danger)' : 'var(--primary)',
                    color: 'white',
                    cursor: 'pointer'
                }}>
                    {status === 'Live Now' ? 'Join' : 'View'}
                </button>
            </div>
        </div>
    )
}
