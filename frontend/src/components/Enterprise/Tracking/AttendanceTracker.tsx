"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Calendar, Users, MapPin, Smartphone, 
    Clock, AlertCircle, CheckCircle, XCircle,
    QrCode, Link as LinkIcon, Download, Filter,
    Activity, ArrowUpRight, ArrowDownRight, Search
} from 'lucide-react';

export default function AttendanceTracker() {
    const [viewMode, setViewMode] = useState<'STUDENTS' | 'TRAINERS'>('STUDENTS');

    const stats = [
        { label: 'Avg Attendance', value: '92.4%', change: '+2.1%', icon: <Activity color="#8b5cf6" /> },
        { label: 'Late Logins', value: '14', change: '-4', icon: <Clock color="#f59e0b" /> },
        { label: 'Suspicious IPs', value: '2', change: '+1', icon: <MapPin color="#ef4444" /> },
        { label: 'Early Logouts', value: '5', change: '0', icon: <ArrowDownRight color="#6366f1" /> },
    ];

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '32px'
    };

    return (
        <div style={{ padding: '30px', color: '#fff', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '8px' }}>Pinpoint Attendance</h1>
                    <p style={{ color: '#aaa', fontWeight: 600 }}>Real-time student & trainer tracking with IP and device audit.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="attendance-btn secondary"><Download size={18} /> EXPORT REPORT</button>
                    <button className="attendance-btn primary"><QrCode size={18} /> GENERATE QR</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{ ...glassStyle, padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ padding: '10px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)' }}>{stat.icon}</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }}>{stat.change}</span>
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '4px' }}>{stat.value}</h3>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
                {/* Left: Quick Actions & Live Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ ...glassStyle, padding: '24px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px' }}>Join Control</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Smartphone size={20} color="#6366f1" />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>Mobile Access</p>
                                    <p style={{ fontSize: '0.7rem', color: '#666' }}>Active for 86.4% of users</p>
                                </div>
                                <div style={{ width: 30, height: 16, background: '#10b981', borderRadius: '10px' }} />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={20} color="#ef4444" />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>Geo-Fencing</p>
                                    <p style={{ fontSize: '0.7rem', color: '#666' }}>Restricted to Hyderabad Hub</p>
                                </div>
                                <div style={{ width: 30, height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ ...glassStyle, padding: '24px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px' }}>Low Attendance Warnings</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[
                                { name: 'Rahul M.', score: '64%', batch: 'PDA-86' },
                                { name: 'Sneha K.', score: '42%', batch: 'BC-202' }
                            ].map((user, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>{user.name}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#666' }}>{user.batch}</p>
                                    </div>
                                    <span style={{ color: '#ef4444', fontWeight: 900 }}>{user.score}</span>
                                </div>
                            ))}
                            <button style={{ width: '100%', padding: '12px', borderRadius: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 800, marginTop: '10px' }}>NOTIFY ALL</button>
                        </div>
                    </div>
                </div>

                {/* Right: Data Table */}
                <div style={{ ...glassStyle, padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '16px' }}>
                            <button onClick={() => setViewMode('STUDENTS')} style={{ padding: '8px 20px', borderRadius: '12px', background: viewMode === 'STUDENTS' ? 'var(--primary)' : 'transparent', color: viewMode === 'STUDENTS' ? '#000' : '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>STUDENTS</button>
                            <button onClick={() => setViewMode('TRAINERS')} style={{ padding: '8px 20px', borderRadius: '12px', background: viewMode === 'TRAINERS' ? 'var(--primary)' : 'transparent', color: viewMode === 'TRAINERS' ? '#000' : '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>TRAINERS</button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} size={16} color="#666" />
                            <input placeholder="Search records..." style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '16px', padding: '12px 12px 12px 45px', color: '#fff', width: '250px', fontWeight: 600 }} />
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>PARTICIPANT</th>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>BATCH</th>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>LOGIN TIME</th>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>DEVICE / IP</th>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>STATUS</th>
                                <th style={{ padding: '15px', color: '#666', fontSize: '0.8rem', fontWeight: 900 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900 }}>S</div>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>Student {item}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#666' }}>ID: BC-2026-00{item}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 700, fontSize: '0.85rem' }}>PDA-86</td>
                                    <td style={{ padding: '15px' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>10:15 AM</p>
                                        <p style={{ fontSize: '0.65rem', color: '#10b981' }}>On-Time</p>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>MacBook Pro (Chrome)</p>
                                        <p style={{ fontSize: '0.7rem', color: '#666' }}>192.168.1.1</p>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'inline-flex', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 900 }}>PRESENT</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><ArrowUpRight size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .attendance-btn {
                    padding: 12px 24px;
                    border-radius: 18px;
                    border: none;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .attendance-btn.primary {
                    background: var(--primary);
                    color: #000;
                }
                .attendance-btn.secondary {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .attendance-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
}
