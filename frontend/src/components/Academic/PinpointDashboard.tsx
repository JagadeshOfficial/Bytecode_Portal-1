"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    RefreshCw,
    Search,
    ShieldAlert,
    Users,
    Wifi,
    X,
} from 'lucide-react';

type Summary = {
    totalUsers: number;
    totalStudents: number;
    totalStaff: number;
    trackedBatches: number;
    presentToday: number;
    suspiciousCount: number;
    avgAttendanceRate: number;
    geoFenceEnabledSessions: number;
    qrEnabledSessions: number;
};

type BatchFilter = {
    id: string;
    batchCode: string;
    batchName: string;
};

type TrackingAlert = {
    id: string;
    userId: string;
    userName: string;
    role: string;
    module: string;
    action: string;
    severity: string;
    timestamp: string;
    ipAddress: string;
    summary: string;
};

type TrackingRecord = {
    id: string;
    name: string;
    email: string;
    role: string;
    branch: string;
    department: string;
    userStatus: string;
    active: boolean;
    isRestricted: boolean;
    batchId: string;
    batchName: string;
    batchCode: string;
    courseName: string;
    attendanceRate: number;
    status: string;
    isToday: boolean;
    loginTime: string | null;
    logoutTime: string | null;
    lastActivityAt: string | null;
    lastSeen: string;
    device: string;
    os: string;
    browser: string;
    deviceFingerprint: string;
    ipAddress: string;
    location: string;
    sessionType: string;
    sessionTopic: string;
    flags: string[];
    risk: string;
    interviewsAttended: number;
    avgInterviewScore: number;
    testsTaken: number;
    avgTestScore: number;
    overallProgress: number;
};

type TrackingResponse = {
    generatedAt: string;
    summary: Summary;
    filters: {
        roles: string[];
        batches: BatchFilter[];
    };
    alerts: TrackingAlert[];
    records: TrackingRecord[];
};

const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.86)',
    backdropFilter: 'blur(26px)',
    border: '1px solid rgba(15, 23, 42, 0.06)',
    borderRadius: '28px',
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.08)',
};

function humanizeLabel(value: string) {
    return value
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value: string | null) {
    if (!value) return 'Not available';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not available';

    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'NA';
}

function statusColors(status: string) {
    switch (status) {
        case 'PRESENT':
            return { background: '#dcfce7', color: '#166534' };
        case 'LATE':
            return { background: '#fef3c7', color: '#92400e' };
        case 'SUSPICIOUS':
            return { background: '#fee2e2', color: '#b91c1c' };
        case 'ABSENT':
            return { background: '#e2e8f0', color: '#475569' };
        default:
            return { background: '#ede9fe', color: '#5b21b6' };
    }
}

function riskColors(risk: string) {
    switch (risk) {
        case 'HIGH':
            return { background: '#fee2e2', color: '#b91c1c' };
        case 'MEDIUM':
            return { background: '#fef3c7', color: '#92400e' };
        default:
            return { background: '#dcfce7', color: '#166534' };
    }
}

function StatCard({
    title,
    value,
    hint,
    icon,
    accent,
}: {
    title: string;
    value: string;
    hint: string;
    icon: React.ReactNode;
    accent: string;
}) {
    return (
        <div style={{ ...glassStyle, padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: `${accent}14`,
                    color: accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {title}
                </p>
                <h3 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>{value}</h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>{hint}</p>
            </div>
        </div>
    );
}

export default function PinpointDashboard() {
    const [data, setData] = useState<TrackingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [selectedBatch, setSelectedBatch] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<TrackingRecord | null>(null);

    const loadTrackingData = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8080/api/attendance/tracking-center', { cache: 'no-store' });
            if (!res.ok) {
                throw new Error('Failed to load tracking data');
            }

            const payload = await res.json();
            setData(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load tracking data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrackingData();
    }, []);

    const records = data?.records || [];
    const loweredSearch = searchTerm.trim().toLowerCase();
    const filteredRecords = records.filter((row) => {
        const matchesRole = selectedRole === 'ALL' || row.role === selectedRole;
        const matchesBatch = selectedBatch === 'ALL' || row.batchId === selectedBatch;
        const haystack = [
            row.name,
            row.email,
            row.role,
            row.batchName,
            row.batchCode,
            row.ipAddress,
            row.device,
            row.location,
            row.department,
        ]
            .join(' ')
            .toLowerCase();

        const matchesSearch = !loweredSearch || haystack.includes(loweredSearch);
        return matchesRole && matchesBatch && matchesSearch;
    });

    const highSeverityAlerts = (data?.alerts || []).filter((alert) => alert.severity === 'CRITICAL' || alert.severity === 'WARNING');
    const batchCoverage = (data?.filters.batches || []).map((batch) => {
        const count = records.filter((row) => row.batchId === batch.id).length;
        return { ...batch, count };
    }).sort((a, b) => b.count - a.count);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%)', padding: '20px', color: '#0f172a', overflowX: 'hidden' }}>
            <div style={{ ...glassStyle, padding: '22px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, #0f766e, #2563eb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            flexShrink: 0,
                        }}
                    >
                        <Activity size={24} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 900 }}>Tracking Center</h1>
                        <p style={{ margin: '6px 0 0', color: '#475569', fontWeight: 700 }}>
                            Live backend view of users, batches, attendance, alerts, and progress details.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', minWidth: 220 }}>
                        <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Last Sync
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                            {data ? formatDateTime(data.generatedAt) : 'Waiting for backend'}
                        </p>
                    </div>
                    <button
                        onClick={loadTrackingData}
                        style={{
                            border: 'none',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            background: '#0f172a',
                            color: '#fff',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="tracking-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <StatCard
                    title="Tracked Users"
                    value={String(data?.summary.totalUsers || 0)}
                    hint={`${data?.summary.totalStudents || 0} students and ${data?.summary.totalStaff || 0} staff`}
                    icon={<Users size={22} />}
                    accent="#2563eb"
                />
                <StatCard
                    title="Present Today"
                    value={String(data?.summary.presentToday || 0)}
                    hint="Users with attendance activity in today's sessions"
                    icon={<CheckCircle2 size={22} />}
                    accent="#059669"
                />
                <StatCard
                    title="Alerts"
                    value={String(data?.summary.suspiciousCount || 0)}
                    hint={`${highSeverityAlerts.length} active warning or critical alerts`}
                    icon={<ShieldAlert size={22} />}
                    accent="#dc2626"
                />
                <StatCard
                    title="Avg Attendance"
                    value={`${data?.summary.avgAttendanceRate || 0}%`}
                    hint="Average attendance rate across tracked users"
                    icon={<Activity size={22} />}
                    accent="#7c3aed"
                />
                <StatCard
                    title="Tracked Batches"
                    value={String(data?.summary.trackedBatches || 0)}
                    hint={`${data?.summary.geoFenceEnabledSessions || 0} geo-fenced sessions recorded`}
                    icon={<BookOpen size={22} />}
                    accent="#0f766e"
                />
                <StatCard
                    title="QR Sessions"
                    value={String(data?.summary.qrEnabledSessions || 0)}
                    hint="Attendance sessions with QR enabled"
                    icon={<Wifi size={22} />}
                    accent="#ea580c"
                />
            </div>

            <div className="tracking-filters" style={{ ...glassStyle, padding: '18px', marginBottom: '22px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.3fr) repeat(2, minmax(180px, 0.8fr))', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, batch, device, IP..."
                        style={{
                            width: '100%',
                            padding: '12px 14px 12px 42px',
                            borderRadius: '14px',
                            border: '1px solid #dbe3ef',
                            background: '#fff',
                            fontWeight: 700,
                            color: '#0f172a',
                        }}
                    />
                </div>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{ borderRadius: '14px', border: '1px solid #dbe3ef', padding: '12px 14px', background: '#fff', fontWeight: 800, color: '#0f172a' }}
                >
                    <option value="ALL">All Roles</option>
                    {(data?.filters.roles || []).map((role) => (
                        <option key={role} value={role}>{humanizeLabel(role)}</option>
                    ))}
                </select>

                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    style={{ borderRadius: '14px', border: '1px solid #dbe3ef', padding: '12px 14px', background: '#fff', fontWeight: 800, color: '#0f172a' }}
                >
                    <option value="ALL">All Batches</option>
                    {(data?.filters.batches || []).map((batch) => (
                        <option key={batch.id} value={batch.id}>
                            {batch.batchCode ? `${batch.batchCode} - ${batch.batchName}` : batch.batchName}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ ...glassStyle, padding: '36px', textAlign: 'center', fontWeight: 800, color: '#475569' }}>
                    Loading tracking data from backend...
                </div>
            ) : error ? (
                <div style={{ ...glassStyle, padding: '36px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#b91c1c' }}>{error}</p>
                    <p style={{ margin: '8px 0 0', color: '#64748b', fontWeight: 700 }}>
                        Check that the LMS backend on port `8080` is running and reachable.
                    </p>
                </div>
            ) : (
                <div className="tracking-shell" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '18px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ ...glassStyle, padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 900 }}>Alert Feed</h2>
                                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#dc2626' }}>
                                    {highSeverityAlerts.length} high-priority
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {(data?.alerts || []).length === 0 && (
                                    <div style={{ padding: '14px', borderRadius: '16px', background: '#f8fafc', color: '#64748b', fontWeight: 700 }}>
                                        No alerts from backend yet.
                                    </div>
                                )}

                                {(data?.alerts || []).map((alert) => {
                                    const tone = alert.severity === 'CRITICAL' ? '#dc2626' : alert.severity === 'WARNING' ? '#d97706' : '#2563eb';

                                    return (
                                        <div key={alert.id} style={{ padding: '14px', borderRadius: '18px', background: '#fff', border: `1px solid ${tone}22` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                                                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 900, color: tone }}>{humanizeLabel(alert.severity)}</p>
                                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                                                    {formatDateTime(alert.timestamp)}
                                                </p>
                                            </div>
                                            <p style={{ margin: '0 0 6px', fontWeight: 900, color: '#0f172a' }}>{alert.userName}</p>
                                            <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#334155', fontWeight: 700 }}>
                                                {humanizeLabel(alert.action)} in {humanizeLabel(alert.module)}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                                                {alert.summary}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ ...glassStyle, padding: '20px' }}>
                            <h2 style={{ margin: '0 0 14px', fontSize: '1.02rem', fontWeight: 900 }}>Batch Coverage</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {batchCoverage.length === 0 && (
                                    <p style={{ margin: 0, color: '#64748b', fontWeight: 700 }}>No batch data available from backend.</p>
                                )}
                                {batchCoverage.slice(0, 8).map((batch) => (
                                    <div key={batch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 900, color: '#0f172a' }}>
                                                {batch.batchCode || batch.batchName}
                                            </p>
                                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>
                                                {batch.batchName}
                                            </p>
                                        </div>
                                        <div style={{ minWidth: 42, textAlign: 'center', padding: '6px 10px', borderRadius: '999px', background: '#e0f2fe', color: '#075985', fontWeight: 900 }}>
                                            {batch.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...glassStyle, padding: '16px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 900 }}>Detailed Records</h2>
                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700 }}>
                                    Showing {filteredRecords.length} of {records.length} people from the backend.
                                </p>
                            </div>
                            <div style={{ padding: '9px 12px', borderRadius: '14px', background: '#f8fafc', color: '#475569', fontWeight: 800, fontSize: '0.82rem' }}>
                                Click a row to open full details
                            </div>
                        </div>

                        <div className="tracking-records-shell">
                                <div className="tracking-record-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr) minmax(0, 1fr) minmax(78px, 0.72fr) minmax(94px, 0.82fr) minmax(78px, 0.68fr)', gap: '10px', padding: '0 10px 10px', color: '#64748b', fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    <div>Person</div>
                                    <div>Role / Course / Batch</div>
                                    <div>Device / Network</div>
                                    <div>Progress</div>
                                    <div>Status</div>
                                    <div>Risk</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {filteredRecords.length === 0 && (
                                        <div style={{ padding: '26px', borderRadius: '18px', background: '#f8fafc', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                                            No records match the current filters.
                                        </div>
                                    )}

                                    {filteredRecords.map((row) => {
                                        const statusTone = statusColors(row.status);
                                        const riskTone = riskColors(row.risk);

                                        return (
                                            <motion.button
                                                key={row.id}
                                                whileHover={{ y: -2 }}
                                                type="button"
                                                onClick={() => setSelectedUser(row)}
                                                className="tracking-record-row"
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    border: '1px solid rgba(15, 23, 42, 0.06)',
                                                    background: '#fff',
                                                    borderRadius: '18px',
                                                    padding: '12px',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr) minmax(0, 1fr) minmax(78px, 0.72fr) minmax(94px, 0.82fr) minmax(78px, 0.68fr)',
                                                    gap: '10px',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    minWidth: 0,
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                                                    <div
                                                        style={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: '12px',
                                                            background: row.risk === 'HIGH' ? '#fee2e2' : '#dbeafe',
                                                            color: row.risk === 'HIGH' ? '#b91c1c' : '#1d4ed8',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {initials(row.name)}
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.92rem' }}>
                                                            {row.name}
                                                        </p>
                                                        <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {row.email}
                                                        </p>
                                                        {row.flags.length > 0 && (
                                                            <p style={{ margin: '3px 0 0', color: '#b45309', fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {row.flags.join(' • ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{humanizeLabel(row.role)}</p>
                                                    <p style={{ margin: '3px 0 0', color: '#334155', fontSize: '0.76rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.courseName || 'No course assigned'}
                                                    </p>
                                                    <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.76rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.batchCode || row.batchName}
                                                    </p>
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.device}</p>
                                                    <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.76rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.ipAddress || 'No IP recorded'}
                                                    </p>
                                                    <p style={{ margin: '3px 0 0', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.location}
                                                    </p>
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '0.88rem' }}>{row.overallProgress}%</p>
                                                    <div style={{ marginTop: '7px', height: '7px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                                                        <div style={{ width: `${row.overallProgress}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #0f766e, #2563eb)' }} />
                                                    </div>
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', background: statusTone.background, color: statusTone.color, fontWeight: 900, fontSize: '0.72rem' }}>
                                                        {humanizeLabel(row.status)}
                                                    </div>
                                                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {row.lastSeen}
                                                    </p>
                                                </div>

                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', background: riskTone.background, color: riskTone.color, fontWeight: 900, fontSize: '0.72rem' }}>
                                                        {humanizeLabel(row.risk)}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.58)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 1200,
                            padding: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.97, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.97, y: 20 }}
                            style={{ ...glassStyle, width: '100%', maxWidth: 920, maxHeight: '88vh', overflowY: 'auto', padding: '28px', position: 'relative' }}
                        >
                            <button
                                onClick={() => setSelectedUser(null)}
                                style={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    width: 42,
                                    height: 42,
                                    borderRadius: '999px',
                                    border: 'none',
                                    background: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <X size={20} />
                            </button>

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '24px', paddingRight: '44px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                                        <div style={{ width: 58, height: 58, borderRadius: '20px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                                            {initials(selectedUser.name)}
                                        </div>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{selectedUser.name}</h2>
                                            <p style={{ margin: '6px 0 0', color: '#475569', fontWeight: 700 }}>
                                                {humanizeLabel(selectedUser.role)} • {selectedUser.email}
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, color: '#64748b', fontWeight: 700 }}>
                                        {selectedUser.batchCode || selectedUser.batchName} {selectedUser.courseName ? `• ${selectedUser.courseName}` : ''}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    <div style={{ padding: '9px 12px', borderRadius: '999px', ...statusColors(selectedUser.status), fontWeight: 900 }}>
                                        {humanizeLabel(selectedUser.status)}
                                    </div>
                                    <div style={{ padding: '9px 12px', borderRadius: '999px', ...riskColors(selectedUser.risk), fontWeight: 900 }}>
                                        {humanizeLabel(selectedUser.risk)} Risk
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-detail-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
                                <StatCard title="Attendance" value={`${selectedUser.attendanceRate}%`} hint="Current backend attendance rate" icon={<CheckCircle2 size={20} />} accent="#059669" />
                                <StatCard title="Progress" value={`${selectedUser.overallProgress}%`} hint="Attendance + test + interview signal" icon={<Activity size={20} />} accent="#2563eb" />
                                <StatCard title="Tests Taken" value={String(selectedUser.testsTaken)} hint={`Avg score ${selectedUser.avgTestScore}%`} icon={<BookOpen size={20} />} accent="#7c3aed" />
                                <StatCard title="Interviews" value={String(selectedUser.interviewsAttended)} hint={`Avg score ${selectedUser.avgInterviewScore}%`} icon={<Users size={20} />} accent="#ea580c" />
                            </div>

                            <div className="tracking-detail-body" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '18px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                        <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Network and Device</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Device</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.device}</p>
                                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                                                    {[selectedUser.os, selectedUser.browser].filter(Boolean).join(' • ') || 'No OS or browser captured'}
                                                </p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>IP and Location</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.ipAddress || 'No IP recorded'}</p>
                                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                                                    {selectedUser.location}
                                                </p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Session</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.sessionType || 'No session type'}</p>
                                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                                                    {selectedUser.sessionTopic || 'No session topic recorded'}
                                                </p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Last Activity</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{formatDateTime(selectedUser.lastActivityAt)}</p>
                                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700, fontSize: '0.82rem' }}>
                                                    Login: {formatDateTime(selectedUser.loginTime)} • Logout: {formatDateTime(selectedUser.logoutTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                        <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Profile Context</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Department</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.department || 'Not available'}</p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Branch</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.branch || 'Not available'}</p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>User Status</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.userStatus || 'Not available'}</p>
                                            </div>
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Restrictions</p>
                                                <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedUser.isRestricted ? 'Restricted' : 'No restriction'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                        <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Flags</h3>
                                        {selectedUser.flags.length === 0 ? (
                                            <div style={{ padding: '14px', borderRadius: '18px', background: '#f0fdf4', color: '#166534', fontWeight: 800 }}>
                                                No backend risk flags for this person.
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {selectedUser.flags.map((flag) => (
                                                    <div key={flag} style={{ padding: '12px 14px', borderRadius: '16px', background: '#fff7ed', color: '#9a3412', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <AlertTriangle size={16} />
                                                        {flag}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                        <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Performance Mix</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {[
                                                { label: 'Attendance Rate', value: selectedUser.attendanceRate, icon: CheckCircle2 },
                                                { label: 'Test Average', value: selectedUser.avgTestScore, icon: BookOpen },
                                                { label: 'Interview Average', value: selectedUser.avgInterviewScore, icon: Users },
                                            ].map((item) => (
                                                <div key={item.label}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                        <p style={{ margin: 0, fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <item.icon size={15} />
                                                            {item.label}
                                                        </p>
                                                        <p style={{ margin: 0, fontWeight: 900 }}>{item.value}%</p>
                                                    </div>
                                                    <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                                                        <div style={{ width: `${item.value}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #0f766e, #2563eb)' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .tracking-records-shell {
                    width: 100%;
                    overflow: hidden;
                }

                @media (max-width: 1440px) {
                    .tracking-stats {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                }

                @media (max-width: 1100px) {
                    .tracking-filters,
                    .tracking-shell,
                    .tracking-detail-body {
                        grid-template-columns: 1fr !important;
                    }

                    .tracking-stats,
                    .tracking-detail-summary {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }

                @media (max-width: 1380px) {
                    .tracking-record-grid,
                    .tracking-record-row {
                        grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.95fr) minmax(0, 0.95fr) minmax(70px, 0.66fr) minmax(88px, 0.76fr) minmax(72px, 0.62fr) !important;
                        gap: 8px !important;
                    }
                }

                @media (max-width: 1240px) {
                    .tracking-record-grid,
                    .tracking-record-row {
                        grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr) minmax(0, 0.9fr) minmax(64px, 0.6fr) minmax(84px, 0.72fr) minmax(68px, 0.58fr) !important;
                    }
                }

                @media (max-width: 720px) {
                    .tracking-stats,
                    .tracking-detail-summary {
                        grid-template-columns: 1fr !important;
                    }

                    .tracking-record-grid {
                        display: none !important;
                    }

                    .tracking-record-row {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }
                }

                @media (max-width: 560px) {
                    .tracking-record-row {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
