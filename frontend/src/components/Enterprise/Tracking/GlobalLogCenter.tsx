"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    AlertTriangle,
    Clock3,
    Database,
    Info,
    RefreshCw,
    Search,
    ShieldAlert,
    User,
    Users,
    X,
} from 'lucide-react';

type ActivitySummary = {
    totalEvents: number;
    last24HoursCount: number;
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    activeModules: number;
    uniqueUsers: number;
};

type ModuleBreakdown = {
    module: string;
    count: number;
};

type ActivityEvent = {
    id: string;
    timestamp: string;
    module: string;
    action: string;
    severity: string;
    userName: string;
    userRole: string;
    source: string;
    target: string;
    summary: string;
    details: Record<string, unknown> | string | null;
};

type ActivityResponse = {
    generatedAt: string;
    summary: ActivitySummary;
    moduleBreakdown: ModuleBreakdown[];
    events: ActivityEvent[];
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

function severityColors(severity: string) {
    switch (severity) {
        case 'CRITICAL':
            return { background: '#fee2e2', color: '#b91c1c', border: '#fecaca' };
        case 'WARNING':
            return { background: '#fef3c7', color: '#92400e', border: '#fde68a' };
        default:
            return { background: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' };
    }
}

function moduleColor(module: string) {
    switch (module) {
        case 'USERS':
            return '#2563eb';
        case 'ACADEMIC':
            return '#0f766e';
        case 'LIVE':
            return '#7c3aed';
        case 'INTERVIEW':
            return '#ea580c';
        case 'ATTENDANCE':
            return '#059669';
        case 'ASSESSMENT':
            return '#dc2626';
        default:
            return '#475569';
    }
}

function getDetailEntries(details: ActivityEvent['details']) {
    if (!details || typeof details !== 'object' || Array.isArray(details)) {
        return [];
    }

    return Object.entries(details).filter(([, value]) => value !== '' && value !== null && value !== undefined);
}

function formatDetailValue(value: unknown) {
    if (Array.isArray(value)) {
        return value.map((entry) => formatDetailValue(entry)).join(', ');
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }

    return String(value);
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

export default function GlobalLogCenter() {
    const [data, setData] = useState<ActivityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState('ALL');
    const [selectedModule, setSelectedModule] = useState('ALL');
    const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

    const loadActivityData = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8080/api/admin/system-activity', { cache: 'no-store' });
            if (!res.ok) {
                throw new Error('Failed to load system activity');
            }

            const payload = await res.json();
            setData(payload);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load system activity');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivityData();
    }, []);

    const events = data?.events || [];
    const loweredSearch = searchTerm.trim().toLowerCase();
    const filteredEvents = events.filter((event) => {
        const matchesSeverity = selectedSeverity === 'ALL' || event.severity === selectedSeverity;
        const matchesModule = selectedModule === 'ALL' || event.module === selectedModule;
        const haystack = [
            event.userName,
            event.userRole,
            event.module,
            event.action,
            event.source,
            event.target,
            event.summary,
            typeof event.details === 'string' ? event.details : JSON.stringify(event.details || {}),
        ]
            .join(' ')
            .toLowerCase();

        return matchesSeverity && matchesModule && (!loweredSearch || haystack.includes(loweredSearch));
    });

    const highlightedEvents = events.filter((event) => event.severity === 'CRITICAL' || event.severity === 'WARNING').slice(0, 5);
    const modules = data?.moduleBreakdown || [];
    const maxModuleCount = modules.reduce((max, item) => Math.max(max, item.count), 1);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%)', padding: '20px', color: '#0f172a', overflowX: 'hidden' }}>
            <div className="activity-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 14px', borderRadius: '16px', background: '#ffffffb8', border: '1px solid #e2e8f0', minWidth: 220 }}>
                    <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Last Sync
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                        {data ? formatDateTime(data.generatedAt) : 'Waiting for backend'}
                    </p>
                </div>
                <button
                    onClick={loadActivityData}
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

            <div className="activity-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <StatCard
                    title="Total Events"
                    value={String(data?.summary.totalEvents || 0)}
                    hint="Latest records combined from backend modules"
                    icon={<Database size={22} />}
                    accent="#2563eb"
                />
                <StatCard
                    title="Last 24 Hours"
                    value={String(data?.summary.last24HoursCount || 0)}
                    hint="Recent events captured in the last day"
                    icon={<Clock3 size={22} />}
                    accent="#0f766e"
                />
                <StatCard
                    title="Warnings"
                    value={String(data?.summary.warningCount || 0)}
                    hint="Warning-level items that need review"
                    icon={<AlertTriangle size={22} />}
                    accent="#d97706"
                />
                <StatCard
                    title="Critical"
                    value={String(data?.summary.criticalCount || 0)}
                    hint="Critical events currently recorded"
                    icon={<ShieldAlert size={22} />}
                    accent="#dc2626"
                />
                <StatCard
                    title="Modules"
                    value={String(data?.summary.activeModules || 0)}
                    hint="Backend modules contributing activity"
                    icon={<Activity size={22} />}
                    accent="#7c3aed"
                />
                <StatCard
                    title="Users Seen"
                    value={String(data?.summary.uniqueUsers || 0)}
                    hint={`${data?.summary.infoCount || 0} info-level activity entries`}
                    icon={<Users size={22} />}
                    accent="#0891b2"
                />
            </div>

            <div className="activity-filters" style={{ ...glassStyle, padding: '18px', marginBottom: '22px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(2, minmax(180px, 0.8fr))', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by user, module, action, source, target..."
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
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    style={{ borderRadius: '14px', border: '1px solid #dbe3ef', padding: '12px 14px', background: '#fff', fontWeight: 800, color: '#0f172a' }}
                >
                    <option value="ALL">All Severity</option>
                    <option value="INFO">Info</option>
                    <option value="WARNING">Warning</option>
                    <option value="CRITICAL">Critical</option>
                </select>

                <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    style={{ borderRadius: '14px', border: '1px solid #dbe3ef', padding: '12px 14px', background: '#fff', fontWeight: 800, color: '#0f172a' }}
                >
                    <option value="ALL">All Modules</option>
                    {modules.map((item) => (
                        <option key={item.module} value={item.module}>
                            {humanizeLabel(item.module)}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ ...glassStyle, padding: '36px', textAlign: 'center', fontWeight: 800, color: '#475569' }}>
                    Loading system activity from backend...
                </div>
            ) : error ? (
                <div style={{ ...glassStyle, padding: '36px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#b91c1c' }}>{error}</p>
                    <p style={{ margin: '8px 0 0', color: '#64748b', fontWeight: 700 }}>
                        Check that the LMS backend on port `8080` is running and reachable.
                    </p>
                </div>
            ) : (
                <div className="activity-shell" style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '18px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div style={{ ...glassStyle, padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 900 }}>Module Breakdown</h2>
                                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#64748b' }}>{modules.length} modules</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {modules.length === 0 && (
                                    <p style={{ margin: 0, color: '#64748b', fontWeight: 700 }}>No module activity available yet.</p>
                                )}

                                {modules.map((item) => {
                                    const accent = moduleColor(item.module);
                                    const width = `${Math.max((item.count / maxModuleCount) * 100, 8)}%`;

                                    return (
                                        <div key={item.module}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '7px' }}>
                                                <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '0.84rem' }}>{humanizeLabel(item.module)}</p>
                                                <p style={{ margin: 0, color: '#64748b', fontWeight: 800, fontSize: '0.78rem' }}>{item.count}</p>
                                            </div>
                                            <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                                                <div style={{ width, height: '100%', borderRadius: '999px', background: accent }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ ...glassStyle, padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 900 }}>Needs Attention</h2>
                                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: highlightedEvents.length > 0 ? '#d97706' : '#059669' }}>
                                    {highlightedEvents.length > 0 ? `${highlightedEvents.length} flagged` : 'All clear'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {highlightedEvents.length === 0 && (
                                    <div style={{ padding: '14px', borderRadius: '16px', background: '#f8fafc', color: '#64748b', fontWeight: 700 }}>
                                        No warning or critical events in the current backend feed.
                                    </div>
                                )}

                                {highlightedEvents.map((event) => {
                                    const tone = severityColors(event.severity);

                                    return (
                                        <button
                                            key={event.id}
                                            type="button"
                                            onClick={() => setSelectedEvent(event)}
                                            style={{
                                                padding: '14px',
                                                borderRadius: '18px',
                                                background: '#fff',
                                                border: `1px solid ${tone.border}`,
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                                                <span style={{ padding: '5px 9px', borderRadius: '999px', background: tone.background, color: tone.color, fontWeight: 900, fontSize: '0.72rem' }}>
                                                    {humanizeLabel(event.severity)}
                                                </span>
                                                <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
                                                    {formatDateTime(event.timestamp)}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 6px', fontWeight: 900, color: '#0f172a' }}>{event.summary}</p>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
                                                {event.userName} in {humanizeLabel(event.module)}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...glassStyle, padding: '16px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 900 }}>Activity Feed</h2>
                                <p style={{ margin: '6px 0 0', color: '#64748b', fontWeight: 700 }}>
                                    Showing {filteredEvents.length} of {events.length} backend events.
                                </p>
                            </div>
                            <div style={{ padding: '9px 12px', borderRadius: '14px', background: '#f8fafc', color: '#475569', fontWeight: 800, fontSize: '0.82rem' }}>
                                Click an event to open full details
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {filteredEvents.length === 0 && (
                                <div style={{ padding: '26px', borderRadius: '18px', background: '#f8fafc', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                                    No activity matches the current filters.
                                </div>
                            )}

                            {filteredEvents.map((event) => {
                                const tone = severityColors(event.severity);
                                const accent = moduleColor(event.module);

                                return (
                                    <motion.button
                                        key={event.id}
                                        whileHover={{ y: -2 }}
                                        type="button"
                                        onClick={() => setSelectedEvent(event)}
                                        className="activity-event-card"
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            border: '1px solid rgba(15, 23, 42, 0.06)',
                                            background: '#fff',
                                            borderRadius: '20px',
                                            padding: '15px',
                                            display: 'grid',
                                            gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr) auto',
                                            gap: '14px',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            minWidth: 0,
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                <span style={{ padding: '5px 9px', borderRadius: '999px', background: `${accent}14`, color: accent, fontWeight: 900, fontSize: '0.72rem' }}>
                                                    {humanizeLabel(event.module)}
                                                </span>
                                                <span style={{ padding: '5px 9px', borderRadius: '999px', background: tone.background, color: tone.color, fontWeight: 900, fontSize: '0.72rem' }}>
                                                    {humanizeLabel(event.severity)}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', fontSize: '0.9rem' }}>
                                                {formatDateTime(event.timestamp)}
                                            </p>
                                            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.78rem', fontWeight: 700 }}>
                                                {humanizeLabel(event.action)}
                                            </p>
                                        </div>

                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ margin: '0 0 6px', fontWeight: 900, color: '#0f172a', fontSize: '0.94rem' }}>{event.summary}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, marginBottom: '8px' }}>
                                                <div
                                                    style={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: '12px',
                                                        background: `${accent}14`,
                                                        color: accent,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    {initials(event.userName)}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.86rem' }}>
                                                        {event.userName || 'System'}
                                                    </p>
                                                    <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.76rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {event.userRole ? humanizeLabel(event.userRole) : 'System Event'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.5 }}>
                                                Source: {event.source || 'Not available'}
                                                {event.target ? `  |  Target: ${event.target}` : ''}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifySelf: 'end' }}>
                                            <div style={{ width: 38, height: 38, borderRadius: '12px', background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Info size={18} />
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selectedEvent && (
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
                            style={{ ...glassStyle, width: '100%', maxWidth: 900, maxHeight: '88vh', overflowY: 'auto', padding: '28px', position: 'relative' }}
                        >
                            <button
                                onClick={() => setSelectedEvent(null)}
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

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '24px', paddingRight: '44px', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                                        <div
                                            style={{
                                                width: 58,
                                                height: 58,
                                                borderRadius: '20px',
                                                background: `${moduleColor(selectedEvent.module)}14`,
                                                color: moduleColor(selectedEvent.module),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 900,
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{selectedEvent.userName || 'System'}</h2>
                                            <p style={{ margin: '6px 0 0', color: '#475569', fontWeight: 700 }}>
                                                {selectedEvent.userRole ? humanizeLabel(selectedEvent.userRole) : 'System Event'}  |  {humanizeLabel(selectedEvent.module)}
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, color: '#64748b', fontWeight: 700 }}>
                                        {formatDateTime(selectedEvent.timestamp)}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    <div style={{ padding: '9px 12px', borderRadius: '999px', background: `${moduleColor(selectedEvent.module)}14`, color: moduleColor(selectedEvent.module), fontWeight: 900 }}>
                                        {humanizeLabel(selectedEvent.action)}
                                    </div>
                                    <div style={{ padding: '9px 12px', borderRadius: '999px', ...severityColors(selectedEvent.severity), fontWeight: 900 }}>
                                        {humanizeLabel(selectedEvent.severity)}
                                    </div>
                                </div>
                            </div>

                            <div className="activity-detail-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
                                <StatCard title="Module" value={humanizeLabel(selectedEvent.module)} hint="Module that produced this event" icon={<Activity size={20} />} accent={moduleColor(selectedEvent.module)} />
                                <StatCard title="Action" value={humanizeLabel(selectedEvent.action)} hint="Recorded backend action" icon={<Info size={20} />} accent="#2563eb" />
                                <StatCard title="Source" value={selectedEvent.source || 'N/A'} hint="Source system or origin" icon={<Database size={20} />} accent="#0f766e" />
                                <StatCard title="Target" value={selectedEvent.target || 'N/A'} hint="Affected resource or record" icon={<Search size={20} />} accent="#7c3aed" />
                            </div>

                            <div className="activity-detail-body" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px' }}>
                                <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                    <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Event Summary</h3>
                                    <div style={{ padding: '16px', borderRadius: '18px', background: '#f8fafc' }}>
                                        <p style={{ margin: 0, color: '#0f172a', fontWeight: 800, lineHeight: 1.65 }}>{selectedEvent.summary}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginTop: '14px' }}>
                                        <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>User</p>
                                            <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedEvent.userName || 'System'}</p>
                                        </div>
                                        <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Severity</p>
                                            <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{humanizeLabel(selectedEvent.severity)}</p>
                                        </div>
                                        <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Source</p>
                                            <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedEvent.source || 'Not available'}</p>
                                        </div>
                                        <div style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>Target</p>
                                            <p style={{ margin: '8px 0 0', fontWeight: 900 }}>{selectedEvent.target || 'Not available'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ ...glassStyle, padding: '18px', boxShadow: 'none' }}>
                                    <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 900 }}>Captured Details</h3>
                                    {typeof selectedEvent.details === 'string' && selectedEvent.details ? (
                                        <div style={{ padding: '16px', borderRadius: '18px', background: '#f8fafc', color: '#334155', fontWeight: 700, lineHeight: 1.6 }}>
                                            {selectedEvent.details}
                                        </div>
                                    ) : getDetailEntries(selectedEvent.details).length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {getDetailEntries(selectedEvent.details).map(([key, value]) => (
                                                <div key={key} style={{ padding: '14px', borderRadius: '18px', background: '#f8fafc' }}>
                                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.74rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                                        {humanizeLabel(key)}
                                                    </p>
                                                    <p style={{ margin: '8px 0 0', fontWeight: 900, color: '#0f172a', lineHeight: 1.55 }}>
                                                        {formatDetailValue(value)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ padding: '16px', borderRadius: '18px', background: '#f8fafc', color: '#64748b', fontWeight: 700 }}>
                                            No extra detail fields were stored for this event.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .activity-event-card:hover {
                    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
                }

                @media (max-width: 1320px) {
                    .activity-stats {
                        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    }
                }

                @media (max-width: 1180px) {
                    .activity-shell {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 1024px) {
                    .activity-event-card {
                        grid-template-columns: 1fr !important;
                    }

                    .activity-detail-summary {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .activity-detail-body {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 860px) {
                    .activity-toolbar {
                        justify-content: stretch !important;
                    }

                    .activity-filters {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 720px) {
                    .activity-stats {
                        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    }

                    .activity-detail-summary {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 520px) {
                    .activity-stats {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
