"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, Globe, Shield, Terminal, 
    MousePointer2, Upload, Download, Search,
    Filter, Database, Cpu, Layout, 
    FileSpreadsheet, FileJson, Share2, Info, User
} from 'lucide-react';

export default function GlobalLogCenter() {
    const [filter, setFilter] = useState('ALL');

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '35px'
    };

    return (
        <div style={{ padding: '30px', color: '#fff', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
                <div>
                    <h1 style={{ fontSize: '2.6rem', fontWeight: 900, marginBottom: '10px', background: 'linear-gradient(90deg, #fff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Universal System Audit
                    </h1>
                    <p style={{ color: '#aaa', fontWeight: 700, fontSize: '1.1rem' }}>Global monitoring of every interaction, session, and administrative action across Bytecode Trainings.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="export-btn"><FileSpreadsheet size={18} /> EXCEL</button>
                    <button className="export-btn"><FileJson size={18} /> PDF REPORT</button>
                </div>
            </div>

            {/* Real-time Status Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                    { label: 'Active Sessions', value: '428', icon: <Globe color="#3b82f6" />, color: '#3b82f6' },
                    { label: 'DB Queries / sec', value: '1.2k', icon: <Database color="#10b981" />, color: '#10b981' },
                    { label: 'File Operations', value: '84 Today', icon: <Upload color="#f59e0b" />, color: '#f59e0b' },
                    { label: 'Security Handshakes', value: '100% Secure', icon: <Shield color="#8b5cf6" />, color: '#8b5cf6' },
                ].map((item, i) => (
                    <div key={i} style={{ ...glassStyle, padding: '24px', borderLeft: `4px solid ${item.color}` }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ padding: '15px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)' }}>{item.icon}</div>
                            <div>
                                <h4 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{item.value}</h4>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>{item.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls & Search */}
            <div style={{...glassStyle, padding: '20px 35px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '12px' }}>
                     {['ALL', 'INTERACTIONS', 'SECURITY', 'DATA_MODS', 'AUTH'].map(btn => (
                         <button 
                            key={btn}
                            onClick={() => setFilter(btn)}
                            style={{ 
                                padding: '8px 18px', 
                                borderRadius: '14px', 
                                border: 'none', 
                                background: filter === btn ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: filter === btn ? '#000' : '#fff',
                                fontWeight: 900,
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                         >
                             {btn.replace('_', ' ')}
                         </button>
                     ))}
                 </div>
                 <div style={{ display: 'flex', gap: '20px' }}>
                      <div style={{ position: 'relative' }}>
                          <Search size={18} color="#666" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                          <input placeholder="Search logs by IP, User or ID..." style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '18px', padding: '12px 20px 12px 45px', color: '#fff', width: '350px', outline: 'none', fontWeight: 700 }} />
                      </div>
                      <button style={{ padding: '12px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}><Filter size={20} color="#fff" /></button>
                 </div>
            </div>

            {/* The Unified Log View */}
            <div style={{ ...glassStyle, overflow: 'hidden' }}>
                 <div style={{ padding: '25px 35px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}><Terminal size={22} color="var(--primary)" /> MASTER AUDIT FEED</h3>
                     <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 800 }}>SHOWING LAST 500 INTERACTIONS</div>
                 </div>
                 
                 <div style={{ padding: '0 15px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ color: '#666', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Timestamp</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Origin (IP/Device)</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>User / Identity</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Interaction Target</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Audit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((log) => (
                                <motion.tr 
                                    key={log}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: log * 0.05 }}
                                    style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}
                                >
                                    <td style={{ padding: '20px 15px', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                        <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>Apr 11, 2026</p>
                                        <p style={{ fontSize: '0.7rem', color: '#666' }}>11:45:2{log} AM</p>
                                    </td>
                                    <td style={{ padding: '20px 15px' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>192.168.1.52</p>
                                        <p style={{ fontSize: '0.7rem', color: '#3b82f6' }}>Chrome / Windows 11</p>
                                    </td>
                                    <td style={{ padding: '20px 15px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#000" /></div>
                                            <div>
                                                <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>Super Admin</p>
                                                <p style={{ fontSize: '0.7rem', color: '#666' }}>ID: AD-001</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 15px' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px' }}>DELETE</span>
                                            /api/academic/batches/82a...
                                        </p>
                                        <p style={{ fontSize: '0.7rem', color: '#666' }}>Target: Batch Workspace Folder</p>
                                    </td>
                                    <td style={{ padding: '20px 15px' }}>
                                        <div style={{ display: 'inline-flex', padding: '5px 12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>SUCCESS (200)</div>
                                    </td>
                                    <td style={{ padding: '20px 15px', textAlign: 'center', borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}>
                                        <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Info size={18} /></button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>

            <style jsx>{`
                .export-btn {
                    padding: 12px 24px;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .export-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}
