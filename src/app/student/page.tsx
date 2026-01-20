"use client";

import DashboardLayout from '@/components/DashboardLayout';

export default function StudentDashboard() {
    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Student Portal</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your learning journey and placement progress.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatsCard title="Course Progress" value="65%" trend="On Track" color="blue" />
                <StatsCard title="Attendance" value="92%" trend="Excellent" color="green" />
                <StatsCard title="Upcoming Exams" value="2" trend="Next Week" color="orange" />
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Active Courses</h3>
                    <CourseCard
                        title="Full Stack Java Development"
                        instructor="Mr. Sharma"
                        progress={65}
                        nextClass="Tomorrow, 10:00 AM"
                    />
                    <CourseCard
                        title="Data Structures & Algorithms"
                        instructor="Ms. Gupta"
                        progress={30}
                        nextClass="Friday, 02:00 PM"
                    />
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Notices</h3>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Placement Drive</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Infosys recruitment drive scheduled for 25th Jan. Submit resumes by tomorrow.</p>
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Holiday Notice</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Institute closed on 26th Jan for Republic Day.</p>
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

function CourseCard({ title, instructor, progress, nextClass }: any) {
    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{title}</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Instructor: {instructor}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Next Class: {nextClass}</div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{progress}%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Completed</div>
            </div>
        </div>
    )
}
