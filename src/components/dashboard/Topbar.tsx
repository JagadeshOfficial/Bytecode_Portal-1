
"use client";

import { Bell, Search } from 'lucide-react';

export default function Topbar() {
    return (
        <header style={{
            height: '80px',
            borderBottom: '1px solid rgba(124, 58, 237, 0.1)',
            background: 'rgba(3, 0, 20, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40
        }}>
            {/* Left: Mobile Toggle & Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white', fontFamily: 'Rajdhani, sans-serif', textTransform: 'uppercase' }}>
                        DASHBOARD <span style={{ color: '#22d3ee' }}>\</span> OVERVIEW
                    </h2>
                </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '100px',
                    padding: '0.5rem 1rem',
                    width: '300px'
                }}>
                    <Search size={16} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            marginLeft: '0.5rem',
                            width: '100%',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <div style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        background: '#d946ef',
                        borderRadius: '50%',
                        boxShadow: '0 0 5px #d946ef'
                    }}></div>
                    <Bell size={20} color="#94a3b8" />
                </div>
            </div>
        </header>
    );
}
