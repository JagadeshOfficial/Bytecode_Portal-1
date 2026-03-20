
"use client";

import { motion } from 'framer-motion';
import { Server, Activity, Cpu, Wifi, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from '../../app/admin/dashboard/Admin.module.css';

export default function SystemHealthWidget() {
    // Mock rotating stats for "live" feel
    const [cpuLoad, setCpuLoad] = useState(45);
    const [memory, setMemory] = useState(62);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(prev => Math.min(100, Math.max(20, prev + (Math.random() * 10 - 5))));
            setMemory(prev => Math.min(100, Math.max(40, prev + (Math.random() * 8 - 4))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.systemWidget}
        >
            {/* Ambient Background Glow */}
            <div className={styles.glowBlob} />

            <div className={styles.sysHeader}>
                <h3>
                    <Server size={20} color="#6366f1" />
                    SYSTEM STATUS
                </h3>
                <div className={styles.sysStatus}>
                    <div className={styles.pulseDot} />
                    <span className={styles.sysStatusText}>OPERATIONAL</span>
                </div>
            </div>

            <div className={styles.sysGrid}>
                {/* CPU Widget */}
                <div className={styles.sysCard}>
                    <div className={styles.sysCardHeader}>
                        <span>CPU_CORE_01</span>
                        <Cpu size={14} />
                    </div>
                    <div className={styles.sysValue}>
                        {cpuLoad.toFixed(1)}%
                    </div>
                    <div className={styles.sysBarBg}>
                        <motion.div
                            animate={{ width: `${cpuLoad}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className={styles.sysBarFill}
                            style={{ background: cpuLoad > 80 ? '#ef4444' : '#6366f1' }}
                        />
                    </div>
                </div>

                {/* Memory Widget */}
                <div className={styles.sysCard}>
                    <div className={styles.sysCardHeader}>
                        <span>MEMORY_ALLOC</span>
                        <Database size={14} />
                    </div>
                    <div className={styles.sysValue}>
                        {memory.toFixed(1)}%
                    </div>
                    <div className={styles.sysBarBg}>
                        <motion.div
                            animate={{ width: `${memory}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                            className={styles.sysBarFill}
                            style={{ background: '#a855f7' }}
                        />
                    </div>
                </div>

                {/* Network Widget */}
                <div className={`${styles.sysCard} ${styles.networkCard}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <Wifi size={16} />
                        </div>
                        <div>
                            <div className={styles.sysCardHeader} style={{ marginBottom: 0 }}>LATENCY</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                                24ms <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#10b981' }}>Excellent</span>
                            </div>
                        </div>
                    </div>
                    <Activity size={32} style={{ color: 'rgba(255,255,255,0.1)' }} />
                </div>
            </div>

            {/* Scrolling Log */}
            <div className={styles.sysLog}>
                <div style={{ opacity: 0.5 }}>[10:42:01] System sync initiated... ok</div>
                <div style={{ opacity: 0.7 }}>[10:42:04] DB_Shard_01 connection stable</div>
                <div style={{ opacity: 0.9, color: '#818cf8' }}>[10:42:12] Incoming batch stream processed</div>
                <div style={{ opacity: 0.6 }}>[10:42:15] User session refreshed (ID: 9942)</div>
            </div>
        </motion.div>
    );
}
