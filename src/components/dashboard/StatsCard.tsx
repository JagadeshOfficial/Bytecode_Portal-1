
"use client";

import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: any;
    color: string;
}

export default function StatsCard({ title, value, trend, trendUp, icon: Icon, color }: StatsCardProps) {
    // Determine a clean HEX color if possible
    let accentColor = color;
    if (color && !color.startsWith('#') && !color.startsWith('rgb')) {
        // Fallback for tailwind classes if they slip through
        if (color.includes('emerald')) accentColor = '#10b981';
        else if (color.includes('yellow')) accentColor = '#facc15';
        else if (color.includes('red')) accentColor = '#f87171';
        else accentColor = '#fff';
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            style={{
                background: 'rgba(19, 10, 48, 0.6)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '1rem',
                padding: '1.5rem',
                backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, margin: 0 }}>{title}</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', color: '#fff', marginTop: '0.5rem' }}>{value}</div>
                </div>
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: `${accentColor}20`, // low opacity bg
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={24} color={accentColor} />
                </div>
            </div>

            {trend && (
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: trendUp ? '#10b981' : '#f87171'
                }}>
                    <span>{trendUp ? '↑' : '↓'}</span>
                    <span>{trend}</span>
                </div>
            )}
        </motion.div>
    );
}
