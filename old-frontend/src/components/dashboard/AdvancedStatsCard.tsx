
"use client";

import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useId } from 'react';

interface AdvancedStatsCardProps {
    title: string;
    value: string | number;
    trend: string;
    trendUp: boolean;
    icon: any;
    color: string;
    data?: any[]; // Optional data for sparkline
}

export default function AdvancedStatsCard({ title, value, trend, trendUp, icon: Icon, color, data }: AdvancedStatsCardProps) {
    // Generate a unique ID for gradients
    const gradientId = useId();

    // Default mock data if none provided
    const chartData = data || [
        { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 },
        { value: 18 }, { value: 25 }, { value: 22 }, { value: 30 }
    ];

    // Determine clean hex color
    let accentColor = color;
    if (color && !color.startsWith('#') && !color.startsWith('rgb')) {
        if (color.includes('emerald')) accentColor = '#10b981';
        else if (color.includes('yellow')) accentColor = '#facc15';
        else if (color.includes('red')) accentColor = '#f87171';
        else accentColor = '#8b5cf6';
    }

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${accentColor}40` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                background: 'rgba(19, 10, 48, 0.7)',
                border: `1px solid ${accentColor}30`,
                borderRadius: '1.25rem',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px'
            }}
        >
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
                filter: 'blur(40px)',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{
                        padding: '0.6rem',
                        borderRadius: '0.75rem',
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                        border: `1px solid ${accentColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${accentColor}20`
                    }}>
                        <Icon size={22} color={accentColor} />
                    </div>
                    {trend && (
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '1rem',
                            background: trendUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${trendUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            color: trendUp ? '#34d399' : '#f87171'
                        }}>
                            <span>{trendUp ? '↗' : '↘'}</span>
                            <span>{trend}</span>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, margin: 0, marginBottom: '0.25rem' }}>{title}</h4>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'Rajdhani, sans-serif', color: '#fff', lineHeight: 1 }}>
                        {value}
                    </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div style={{ height: '40px', width: '100%', marginLeft: '-5px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={accentColor}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#${gradientId})`}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
