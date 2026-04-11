"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Clock, MousePointer2, Shield, Activity, 
    Monitor, Fingerprint, Database, CheckCircle,
    X, AlertTriangle, Terminal, HardDrive,
    Search, Filter, ExternalLink
} from 'lucide-react';

interface ActivityLoggerProps {
    type: 'TUTOR' | 'ADMIN';
}

export default function ActivityLogger({ type }: ActivityLoggerProps) {
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '32px'
    };

    const headerTitle = type === 'TUTOR' ? 'Tutor Full Tracking' : 'Admin Governance & Audit';
    const subTitle = type === 'TUTOR' 
        ? 'Track active classes, student engagement, and daily working hours.' 
        : 'Monitor system control actions, user management logs, and administrative health.';

    return (
        <div style={{ padding: '30px', color: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '8px' }}>{headerTitle}</h1>
                    <p style={{ color: '#aaa', fontWeight: 600 }}>{subTitle}</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ ...glassStyle, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>SYSTEM: ONLINE</span>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                    { label: 'Active Sessions', value: type === 'TUTOR' ? '12 Classes' : '4 Admins', icon: <Monitor /> },
                    { label: 'Avg Working Hours', value: '7.4h / day', icon: <Clock /> },
                    { label: 'Total Actions', value: '1,248 Today', icon: <Activity /> },
                    { label: 'Incident Reports', value: '0', icon: <Shield /> },
                ].map((stat, i) => (
                    <div key={i} style={{ ...glassStyle, padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ padding: '12px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}>{stat.icon}</div>
                            <div>
                                <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</p>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
                {/* Live Activity Stream */}
                <div style={{ ...glassStyle, padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Terminal color="var(--primary)" /> LIVE AUDIT LOGS
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                             <button className="log-filter active">ALL</button>
                             <button className="log-filter">{type === 'ADMIN' ? 'CRUD' : 'LIVES'}</button>
                             <button className="log-filter">SECURITY</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[1, 2, 3, 4, 5, 6].map((log) => (
                            <motion.div 
                                key={log}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: log * 0.1 }}
                                style={{ 
                                    padding: '18px 25px', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    borderRadius: '22px', 
                                    border: '1px solid rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: log % 2 === 0 ? '#10b981' : '#6366f1' }} />
                                    <div>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                                            {type === 'ADMIN' ? 'Deleted recording' : 'Started Live Class'} 
                                            <span style={{ color: 'var(--primary)' }}> #8420-{log}</span>
                                        </p>
                                        <div style={{ display: 'flex', gap: '15px', marginTop: '4px' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={12} /> 10:45 AM</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}><Fingerprint size={12} /> 115.112.4.52</span>
                                            <span style={{ fontSize: '0.7rem', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}><Database size={12} /> academic-db</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 900 }}>{type === 'TUTOR' ? 'Rahul M.' : 'Admin Manoj'}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#666' }}>ID: {type === 'TUTOR' ? 'T-852' : 'A-002'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Performance & Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ ...glassStyle, padding: '30px' }}>
                         <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '24px' }}>Health Overview</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
                                      <span>System Modification Rate</span>
                                      <span style={{ color: '#10b981' }}>Safe</span>
                                  </div>
                                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                      <div style={{ width: '42%', height: '100%', background: '#10b981' }} />
                                  </div>
                              </div>
                              <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
                                      <span>User Management Load</span>
                                      <span style={{ color: 'var(--primary)' }}>Normal</span>
                                  </div>
                                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                      <div style={{ width: '68%', height: '100%', background: 'var(--primary)' }} />
                                  </div>
                              </div>
                         </div>
                    </div>

                    <div style={{ ...glassStyle, padding: '30px', background: 'rgba(124, 58, 237, 0.05)' }}>
                         <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                             <AlertTriangle color="#f59e0b" />
                             <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Safety Checklist</h4>
                         </div>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                             {[
                                 'MFA verification enforced',
                                 'IP Whitelisting active',
                                 'Session auto-logout is 2hrs',
                                 'Daily audit backup generated'
                             ].map((text, i) => (
                                 <li key={i} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                     <CheckCircle size={14} color="#10b981" /> {text}
                                 </li>
                             ))}
                         </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .log-filter {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.05);
                    color: #fff;
                    padding: 6px 15px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    fontWeight: 900;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .log-filter.active {
                    background: var(--primary);
                    color: #000;
                    border-color: var(--primary);
                }
                .log-filter:hover:not(.active) {
                    background: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
}
