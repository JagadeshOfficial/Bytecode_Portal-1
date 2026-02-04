"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Laptop, Server, Cpu, Wifi, Battery, Monitor,
    AlertTriangle, CheckCircle, RefreshCw, Search, Plus,
    MoreVertical, Wrench, Trash2
} from 'lucide-react';
import styles from '../SuperAdmin.module.css';

// -- Mock Data --
const LAB_STATUS = [
    { id: 'L1', name: 'AI Research Lab', capacity: 40, active: 32, status: 'Online', health: 98 },
    { id: 'L2', name: 'DevOps Center', capacity: 30, active: 28, status: 'Online', health: 95 },
    { id: 'L3', name: 'CyberSec Range', capacity: 25, active: 0, status: 'Maintenance', health: 80 },
    { id: 'L4', name: 'General Lab A', capacity: 60, active: 45, status: 'Online', health: 92 },
];

const INVENTORY_ITEMS = [
    { id: 'HW-1024', name: 'MacBook Pro M2', category: 'Laptop', assignedTo: 'John Doe (Faculty)', condition: 'Good', lastCheck: '2024-03-15', status: 'In Use' },
    { id: 'HW-1025', name: 'Dell XPS 15', category: 'Laptop', assignedTo: 'Lab L1-04', condition: 'Excellent', lastCheck: '2024-04-01', status: 'Available' },
    { id: 'HW-1026', name: 'Cisco Switch 2960', category: 'Network', assignedTo: 'Server Room B', condition: 'Fair', lastCheck: '2023-12-10', status: 'Maintenance' },
    { id: 'HW-1027', name: 'Sony Projector 4K', category: 'AV', assignedTo: 'Auditorium', condition: 'Good', lastCheck: '2024-02-20', status: 'In Use' },
    { id: 'HW-1028', name: 'iPad Pro 12.9', category: 'Tablet', assignedTo: 'Design Team', condition: 'Excellent', lastCheck: '2024-03-28', status: 'In Use' },
];

export default function AssetsPage() {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

    // -- Visual Components --
    const LabCard = ({ lab }: any) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${styles.glassPanel} ${styles.neonBorder}`}
            style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: lab.status === 'Online' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: lab.status === 'Online' ? '#10b981' : '#f59e0b' }}>
                    <Server size={24} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                    ID: {lab.id}
                </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{lab.name}</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                <span>Active Nodes: <span style={{ color: 'white', fontWeight: 600 }}>{lab.active}/{lab.capacity}</span></span>
                <span>Health: <span style={{ color: lab.health > 90 ? '#10b981' : '#f59e0b' }}>{lab.health}%</span></span>
            </div>

            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(lab.active / lab.capacity) * 100}%`, height: '100%', background: '#3b82f6' }}></div>
            </div>

            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
                {lab.status === 'Online' ? <Wifi size={16} color="#10b981" /> : <Wrench size={16} color="#f59e0b" />}
            </div>
        </motion.div>
    );

    return (
        <DashboardLayout role="super_admin">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.container}>

                {/* --- HEADER --- */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem',
                    padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)',
                    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div>
                        <div className={styles.textLabel} style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.25rem' }}>INFRASTRUCTURE CONTROL</div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Assets & Inventory
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className={styles.searchBar}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => setIsAddAssetOpen(true)}
                            style={{ background: '#f59e0b', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}
                        >
                            <Plus size={18} strokeWidth={2.5} /> Add Asset
                        </button>
                    </div>
                </div>

                {/* --- LAB STATUS GRID --- */}
                <div style={{ marginBottom: '2rem' }}>
                    <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Cpu size={20} color="#3b82f6" /> Lab Status Overview
                        </div>
                    </div>
                    <div className={styles.statsGrid}>
                        {LAB_STATUS.map(lab => <LabCard key={lab.id} lab={lab} />)}
                    </div>
                </div>

                {/* --- INVENTORY LIST --- */}
                <div className={styles.glassPanel}>
                    <div className={styles.cardHeader} style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Box size={20} color="#cbd5e1" /> Hardware Inventory
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['All', 'In Use', 'Available', 'Maintenance'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={filterStatus === status ? styles.btnPrimary : styles.btnSecondary}
                                    style={filterStatus === status ? { background: '#f59e0b', border: 'none' } : {}}
                                > {status} </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Asset Name</th>
                                    <th>Category</th>
                                    <th>Assigned To</th>
                                    <th>Condition</th>
                                    <th>Status</th>
                                    <th>Last Check</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {INVENTORY_ITEMS.filter(item => filterStatus === 'All' || item.status === filterStatus).map((item) => (
                                    <tr key={item.id} className={styles.interactiveRow}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: '#f59e0b' }}>
                                                    {item.category === 'Laptop' ? <Laptop size={16} /> : item.category === 'Network' ? <Wifi size={16} /> : <Monitor size={16} />}
                                                </div>
                                                <div>
                                                    <div style={{ color: 'white', fontWeight: 500 }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ color: '#cbd5e1' }}>{item.category}</td>
                                        <td style={{ color: '#white' }}>{item.assignedTo}</td>
                                        <td>
                                            <span style={{ color: item.condition === 'Excellent' ? '#10b981' : item.condition === 'Good' ? '#3b82f6' : '#f59e0b' }}>
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                                background: item.status === 'Available' ? 'rgba(16,185,129,0.1)' : item.status === 'In Use' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)',
                                                color: item.status === 'Available' ? '#10b981' : item.status === 'In Use' ? '#3b82f6' : '#f59e0b'
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{item.lastCheck}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className={styles.btnSecondary} style={{ padding: '6px' }} title="Edit"><Wrench size={14} /></button>
                                                <button className={styles.btnSecondary} style={{ padding: '6px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} title="Delete"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- ADD ASSET MODAL --- */}
                <AnimatePresence>
                    {isAddAssetOpen && (
                        <div className={styles.modalOverlay}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className={`${styles.modalContent} ${styles.neonBorder}`}
                                style={{ maxWidth: '600px' }}
                            >
                                <div className={styles.modalHeader}>
                                    <h2 className={styles.modalTitle}>Register New Asset</h2>
                                    <button onClick={() => setIsAddAssetOpen(false)} className={styles.closeBtn}>✕</button>
                                </div>
                                <div className={styles.modalBody}>
                                    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Asset Name</label>
                                            <input type="text" className={styles.formInput} placeholder="e.g. MacBook Air M2" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Category</label>
                                            <select className={styles.formSelect}>
                                                <option>Laptop</option>
                                                <option>Desktop</option>
                                                <option>Server</option>
                                                <option>Networking</option>
                                                <option>Peripheral</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Serial Number</label>
                                            <input type="text" className={styles.formInput} placeholder="S/N: XXXXX-XXXX" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Purchase Date</label>
                                            <input type="date" className={styles.formInput} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Assign To (Optional)</label>
                                            <input type="text" className={styles.formInput} placeholder="Lab or Person Name" />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Initial Status</label>
                                            <select className={styles.formSelect}>
                                                <option>Available</option>
                                                <option>In Use</option>
                                                <option>Maintenance</option>
                                            </select>
                                        </div>
                                        <div className={styles.formActions} style={{ gridColumn: 'span 2' }}>
                                            <button type="button" onClick={() => setIsAddAssetOpen(false)} className={styles.btnSecondary} style={{ flex: 1 }}>Cancel</button>
                                            <button type="button" onClick={() => setIsAddAssetOpen(false)} className={styles.btnPrimary} style={{ flex: 1, background: '#f59e0b' }}>
                                                Check In Asset
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </motion.div>
        </DashboardLayout>
    );
}
