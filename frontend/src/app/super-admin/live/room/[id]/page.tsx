"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize2, Users, Settings } from 'lucide-react';

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export default function MeetingRoom() {
    const params = useParams();
    const router = useRouter();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const apiRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const roomId = params.id as string;

    useEffect(() => {
        const initJitsi = () => {
            if (!window.JitsiMeetExternalAPI) {
                console.error('Jitsi API not loaded');
                return;
            }

            const domain = 'meet.jit.si';
            const options = {
                roomName: `BYTECODE-${roomId}`,
                width: '100%',
                height: '100%',
                parentNode: jitsiContainerRef.current,
                configOverwrite: {
                    startWithAudioMuted: true,
                    disableDeepLinking: true,
                    prejoinPageEnabled: false,
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_BACKGROUND: '#0a0a0a',
                },
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);
            apiRef.current = api;

            api.addEventListener('videoConferenceJoined', () => {
                setIsLoading(false);
            });

            api.addEventListener('readyToClose', () => {
                router.back();
            });
        };

        const timer = setTimeout(() => {
            initJitsi();
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (apiRef.current) apiRef.current.dispose();
        };
    }, [roomId, router]);

    return (
        <DashboardLayout role="super_admin">
            <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* --- MEETING HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            onClick={() => router.back()}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Bytecode Meeting Space</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Room ID: {roomId}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '111px', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="pulse" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
                            ENCRYPTED CONNECTION
                        </div>
                    </div>
                </div>

                {/* --- VIDEO CONTAINER --- */}
                <div 
                    className="glass-panel" 
                    style={{ flex: 1, position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    {isLoading && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', zIndex: 10 }}>
                            <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                            <p style={{ marginTop: '20px', fontWeight: 800, color: 'var(--text-dim)' }}>Initializing Secure Stream...</p>
                        </div>
                    )}
                    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>
        </DashboardLayout>
    );
}
