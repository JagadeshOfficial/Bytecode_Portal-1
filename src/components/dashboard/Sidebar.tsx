
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV, Role } from '@/lib/dashboard-config';
import { LogOut, Hexagon, User, Settings, Shield, Bell, X, CheckCircle, Zap, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    role: Role;
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const navItems = DASHBOARD_NAV[role] || [];

    return (
        <aside style={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            width: '280px',
            background: 'rgba(3, 0, 20, 0.95)',
            borderRight: '1px solid rgba(124, 58, 237, 0.2)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Logo Section */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'white'
            }}>
                <Hexagon size={28} color="#22d3ee" strokeWidth={1.5} />
                <div>
                    BYTE<span style={{ color: '#7c3aed' }}>CODE</span>
                </div>
            </div>

            {/* Navigation */}
            <div style={{
                flex: 1,
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                color: isActive ? '#22d3ee' : '#94a3b8',
                                background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                                border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : 'none',
                                transition: 'all 0.2s',
                                fontWeight: 500
                            }}>
                                <item.icon size={20} color={isActive ? '#22d3ee' : 'currentColor'} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* User Profile / Logout */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
                <div style={{
                    background: pathname.includes('/profile') ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.03)',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    border: pathname.includes('/profile') ? '1px solid rgba(124, 58, 237, 0.5)' : '1px solid transparent'
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                    <Link href={role === 'super_admin' ? "/admin/super/profile" : "/admin/dashboard/profile"} style={{ textDecoration: 'none', flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {role.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Signed in as</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', textTransform: 'capitalize' }}>{role.replace('_', ' ')}</div>
                        </div>
                    </Link>

                    <Link href="/login" style={{ cursor: 'pointer', padding: '0.25rem' }}>
                        <LogOut size={16} color="#94a3b8" />
                    </Link>
                </div>
            </div>
        </aside >
    );
}
