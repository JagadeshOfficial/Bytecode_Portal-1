"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare,
    Users, PhoneOff, Circle, Square, Hand, X, LayoutGrid,
    LayoutTemplate, Copy, CheckCheck, Download, Pause, Play,
    VolumeX, AlertCircle, Save, Check
} from 'lucide-react';

export default function BytecodeWebRTCRoom() {
    const params  = useParams();
    const router  = useRouter();
    const roomId  = params.id as string;

    // ── Refs (never trigger re-renders) ──────────────────────────────
    const localVideoRef    = useRef<HTMLVideoElement>(null);
    const screenVideoRef   = useRef<HTMLVideoElement>(null);
    const hiddenCamRef     = useRef<HTMLVideoElement>(null);   // recording source
    const hiddenScreenRef  = useRef<HTMLVideoElement>(null);   // recording source
    const localStreamRef   = useRef<MediaStream | null>(null);
    const screenStreamRef  = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef        = useRef<Blob[]>([]);
    const animFrameRef     = useRef<number>(0);
    const recActiveRef     = useRef(false);  // truth-source for draw loop
    const isVideoOffRef    = useRef(false);  // mirror of state for draw loop
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const recStartedRef    = useRef(false);  // guard against double-start

    // ── State ─────────────────────────────────────────────────────────
    const [camReady,      setCamReady]      = useState(false);
    const [permDenied,    setPermDenied]    = useState(false);
    const [isMuted,       setIsMuted]       = useState(false);
    const [isVideoOff,    setIsVideoOff]    = useState(false);
    const [screenStream,  setScreenStream]  = useState<MediaStream | null>(null);
    const [viewMode,      setViewMode]      = useState<'GALLERY' | 'SPEAKER'>('GALLERY');
    const [isRecording,   setIsRecording]   = useState(false);
    const [isPaused,      setIsPaused]      = useState(false);
    const [recTime,       setRecTime]       = useState(0);
    const [recBlob,       setRecBlob]       = useState<Blob | null>(null);
    const [recError,      setRecError]      = useState('');
    const [handRaised,    setHandRaised]    = useState(false);
    const [sidebar,       setSidebar]       = useState<'CHAT' | 'PARTICIPANTS' | null>(null);
    const [chatMsgs,      setChatMsgs]      = useState<{ name: string; text: string; t: string }[]>([]);
    const [chatInput,     setChatInput]     = useState('');
    const [copied,        setCopied]        = useState(false);
    const [isSaving,      setIsSaving]      = useState(false);
    const [saveSuccess,   setSaveSuccess]   = useState(false);

    // ── Init camera + mic ─────────────────────────────────────────────
    useEffect(() => {
        async function init() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: true,
                });
                localStreamRef.current = stream;
                setCamReady(true);
            } catch {
                setPermDenied(true);
            }
        }
        init();

        return () => {
            localStreamRef.current?.getTracks().forEach(t => t.stop());
            screenStreamRef.current?.getTracks().forEach(t => t.stop());
            stopTimer();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            mediaRecorderRef.current?.stop();
        };
    }, []); // eslint-disable-line

    // ── Re-attach streams to elements when they mount ─────────────────
    useEffect(() => {
        if (localVideoRef.current && localStreamRef.current && !isVideoOff) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    }, [isVideoOff, camReady]);

    useEffect(() => {
        if (screenVideoRef.current && screenStream) {
            screenVideoRef.current.srcObject = screenStream;
        }
    }, [screenStream, viewMode]);

    // Hidden sources for recording (needs to stay attached even when UI hidden)
    useEffect(() => {
        if (hiddenCamRef.current && localStreamRef.current) {
            hiddenCamRef.current.srcObject = localStreamRef.current;
            hiddenCamRef.current.play().catch(() => {});
        }
    }, [camReady]);

    // ── Timer helpers ─────────────────────────────────────────────────
    const startTimer = () => {
        stopTimer();
        timerIntervalRef.current = setInterval(() => setRecTime(p => p + 1), 1000);
    };
    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const fmt = (s: number) =>
        `${String(Math.floor(s / 3600)).padStart(2, '0')}:` +
        `${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:` +
        `${String(s % 60).padStart(2, '0')}`;

    // ── Mic / Camera toggling ─────────────────────────────────────────
    const toggleMic = () => {
        const tracks = localStreamRef.current?.getAudioTracks() ?? [];
        tracks.forEach(t => { t.enabled = !t.enabled; });
        setIsMuted(p => !p);
    };

    const toggleVideo = () => {
        const tracks = localStreamRef.current?.getVideoTracks() ?? [];
        const next = !isVideoOffRef.current;
        tracks.forEach(t => { t.enabled = !next; });
        isVideoOffRef.current = next;
        setIsVideoOff(next);
    };

    // ── Screen share ──────────────────────────────────────────────────
    const toggleScreen = async () => {
        if (screenStream) {
            screenStream.getTracks().forEach(t => t.stop());
            setScreenStream(null);
            screenStreamRef.current = null;
            if (hiddenScreenRef.current) hiddenScreenRef.current.srcObject = null;
            setViewMode('GALLERY');
            return;
        }
        try {
            const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            screenStreamRef.current = s;
            setScreenStream(s);
            setViewMode('SPEAKER');
            if (hiddenScreenRef.current) {
                hiddenScreenRef.current.srcObject = s;
                hiddenScreenRef.current.play().catch(() => {});
            }
            s.getVideoTracks()[0].onended = () => {
                setScreenStream(null);
                screenStreamRef.current = null;
                if (hiddenScreenRef.current) hiddenScreenRef.current.srcObject = null;
                setViewMode('GALLERY');
            };
        } catch {
            /* user cancelled */
        }
    };

    // ── RECORDING ─────────────────────────────────────────────────────
    const startRecording = async () => {
        if (recStartedRef.current) return;
        if (!localStreamRef.current) {
            setRecError('Camera not ready. Allow camera access first.');
            return;
        }
        recStartedRef.current = true;
        setRecError('');
        setRecBlob(null);
        setRecTime(0);
        chunksRef.current = [];

        // Make sure hidden cam video is playing
        const camEl = hiddenCamRef.current!;
        if (camEl.paused) await camEl.play().catch(() => {});

        // Wait a tick for video to have real dimensions
        await new Promise<void>(r => {
            const check = () => {
                if (camEl.videoWidth > 0) return r();
                requestAnimationFrame(check);
            };
            check();
        });

        // Off-screen compositor canvas (1280×720)
        const canvas  = document.createElement('canvas');
        canvas.width  = 1280;
        canvas.height = 720;
        const ctx     = canvas.getContext('2d')!;

        // Draw loop — runs until recActiveRef is false
        recActiveRef.current = true;
        const drawFrame = () => {
            if (!recActiveRef.current) return;

            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, 1280, 720);

            const scrEl  = hiddenScreenRef.current;
            const hasScr = scrEl && scrEl.srcObject && scrEl.videoWidth > 0;
            const hasCam = !isVideoOffRef.current && camEl.videoWidth > 0;

            if (hasScr) {
                ctx.drawImage(scrEl, 0, 0, 1280, 720);
                if (hasCam) {
                    // Purple border PiP (top-left)
                    ctx.fillStyle = 'rgba(139,92,246,0.6)';
                    ctx.fillRect(20, 20, 302, 172);
                    ctx.drawImage(camEl, 21, 21, 300, 170);
                }
            } else if (hasCam) {
                ctx.drawImage(camEl, 0, 0, 1280, 720);
            } else {
                ctx.fillStyle = '#0f0f0f';
                ctx.fillRect(0, 0, 1280, 720);
                ctx.fillStyle = '#8b5cf6';
                ctx.font = 'bold 26px Inter, sans-serif';
                ctx.fillText('Bytecode LMS — Session Recording', 300, 360);
            }

            animFrameRef.current = requestAnimationFrame(drawFrame);
        };
        drawFrame();

        // Build final stream: canvas video + mic audio
        const canvasStream = canvas.captureStream(30);
        const audioTracks  = localStreamRef.current.getAudioTracks();
        const finalStream  = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioTracks,
        ]);

        const mimeType = 'video/webm;codecs=vp9,opus';
        let rec: MediaRecorder;
        try {
            rec = new MediaRecorder(finalStream, { mimeType });
        } catch {
            rec = new MediaRecorder(finalStream);
        }

        rec.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };

        rec.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecBlob(blob);
            recStartedRef.current = false;
        };

        rec.start(500); 
        mediaRecorderRef.current = rec;
        setIsRecording(true);
        setIsPaused(false);
        startTimer();
    };

    const stopRecording = () => {
        recActiveRef.current = false;
        cancelAnimationFrame(animFrameRef.current);
        stopTimer();
        const rec = mediaRecorderRef.current;
        if (rec && rec.state !== 'inactive') {
            rec.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
    };

    const downloadRecording = () => {
        if (!recBlob) return;
        const url = URL.createObjectURL(recBlob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = `bytecode-session-${roomId}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    };

    const handleSaveToDashboard = async () => {
        if (!recBlob || isSaving) return;
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('recording', recBlob, `recording-${roomId}-${Date.now()}.webm`);
            formData.append('sessionId', roomId.split('-')[1] || roomId); // Try to get actual DB ID if possible

            const res = await fetch(`http://localhost:8080/api/academic/sessions/${roomId}/recording`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                throw new Error('Failed to upload');
            }
        } catch (err) {
            console.error(err);
            setRecError('Failed to save to dashboard. Please download instead.');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Chat ──────────────────────────────────────────────────────────
    const sendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMsgs(p => [...p, { name: 'You', text: chatInput.trim(), t: now }]);
        setChatInput('');
    };

    // ── Copy invite link ──────────────────────────────────────────────
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // ── Leave ─────────────────────────────────────────────────────────
    const leave = () => {
        if (isRecording) stopRecording();
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        screenStreamRef.current?.getTracks().forEach(t => t.stop());
        router.back();
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#09090b', display: 'flex', flexDirection: 'column',
            fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
        }}>

            <div style={{
                padding: '12px 22px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: '#10b981', boxShadow: '0 0 8px #10b981',
                        }} />
                        <span style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: 1 }}>
                            BYTECODE LIVE — {decodeURIComponent(roomId).toUpperCase()}
                        </span>
                    </div>

                    {isRecording && (
                        <motion.div
                            animate={{ opacity: isPaused ? 1 : [1, 0.35, 1] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                background: isPaused ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                                border: `1px solid ${isPaused ? '#f59e0b' : '#ef4444'}`,
                                padding: '5px 12px', borderRadius: 8,
                                color: isPaused ? '#f59e0b' : '#ef4444',
                                fontSize: '0.75rem', fontWeight: 900,
                            }}>
                            <Circle fill={isPaused ? '#f59e0b' : '#ef4444'} size={8} />
                            {isPaused ? 'PAUSED' : 'REC'} {fmt(recTime)}
                        </motion.div>
                    )}

                    {!isRecording && recBlob && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                onClick={handleSaveToDashboard}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: saveSuccess ? 'rgba(16,185,129,0.2)' : 'rgba(139,92,246,0.15)', 
                                    border: `1px solid ${saveSuccess ? '#10b981' : '#8b5cf6'}`,
                                    padding: '5px 14px', borderRadius: 8, color: saveSuccess ? '#10b981' : '#fff',
                                    fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer',
                                }}>
                                {isSaving ? 'UPLOADING...' : saveSuccess ? <><Check size={13} /> SAVED TO DASHBOARD</> : <><Save size={13} /> SAVE TO DASHBOARD</>}
                            </motion.button>
                            
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                onClick={downloadRecording}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '5px 14px', borderRadius: 8, color: '#fff',
                                    fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer',
                                }}>
                                <Download size={13} /> DOWNLOAD
                            </motion.button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button onClick={copyLink} style={topBtnStyle}>
                        {copied
                            ? <><CheckCheck size={13} color="#10b981" /> Copied!</>
                            : <><Copy size={13} /> Invite Link</>}
                    </button>
                    <button onClick={() => setViewMode(p => p === 'GALLERY' ? 'SPEAKER' : 'GALLERY')} style={topBtnStyle}>
                        {viewMode === 'GALLERY'
                            ? <><LayoutTemplate size={13} /> Speaker</>
                            : <><LayoutGrid size={13} /> Gallery</>}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
                    {permDenied && (
                        <div style={centeredOverlay}>
                            <VolumeX size={48} color="#ef4444" />
                            <p style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: 16 }}>Camera Access Denied</p>
                        </div>
                    )}

                    {viewMode === 'SPEAKER' && screenStream && (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <video ref={screenVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <div style={{
                                position: 'absolute', bottom: 20, right: 20,
                                width: 240, height: 135, borderRadius: 14, overflow: 'hidden',
                                border: '2px solid rgba(139,92,246,0.7)',
                            }}>
                                {isVideoOff ? <div style={avatarBox}>Y</div> : <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />}
                            </div>
                        </div>
                    )}

                    {(viewMode === 'GALLERY' || !screenStream) && camReady && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                            <div style={{
                                position: 'relative', width: 'min(780px,100%)', aspectRatio: '16/9',
                                borderRadius: 20, overflow: 'hidden', background: '#111',
                            }}>
                                {isVideoOff ? <div style={avatarBox}>Y</div> : <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />}
                                <div style={{
                                    position: 'absolute', bottom: 14, left: 14,
                                    background: 'rgba(0,0,0,0.65)', padding: '5px 12px', borderRadius: 9, fontSize: '0.82rem', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(245,158,11,0.35)',
                                }}>
                                    You (Host) {isMuted && <MicOff size={12} color="#ef4444" />} {handRaised && <Hand size={12} color="#f59e0b" />}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {sidebar === 'CHAT' && (
                        <motion.div key="chat" initial={{ width: 0 }} animate={{ width: 360 }} exit={{ width: 0 }} style={sidebarStyle}>
                            <SidebarHeader title="Meeting Chat" onClose={() => setSidebar(null)} />
                            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {chatMsgs.map((m, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed' }}>{m.name}</span>
                                            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{m.t}</span>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '9px 13px', borderRadius: 11, fontSize: '0.86rem' }}>{m.text}</div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={sendMsg} style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message…" style={{ flex: 1, padding: '9px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                <button type="submit" style={{ padding: '9px 14px', borderRadius: 10, background: '#7c3aed', color: '#fff' }}>Send</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{
                padding: '16px 26px', background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', gap: 10 }}>
                    <CtrlBtn icon={isMuted ? <MicOff size={21} /> : <Mic size={21} />} label={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMic} danger={isMuted} />
                    <CtrlBtn icon={isVideoOff ? <VideoOff size={21} /> : <Video size={21} />} label={isVideoOff ? 'Start Cam' : 'Stop Cam'} onClick={toggleVideo} danger={isVideoOff} />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <CtrlBtn icon={<MonitorUp size={21} color={screenStream ? '#10b981' : '#fff'} />} label="Share Screen" onClick={toggleScreen} active={!!screenStream} />
                    <CtrlBtn icon={<Users size={21} />} label="People" onClick={() => setSidebar(sidebar === 'PARTICIPANTS' ? null : 'PARTICIPANTS')} active={sidebar === 'PARTICIPANTS'} />
                    <CtrlBtn icon={<MessageSquare size={21} />} label="Chat" onClick={() => setSidebar(sidebar === 'CHAT' ? null : 'CHAT')} active={sidebar === 'CHAT'} />
                    
                    {!isRecording ? (
                        <CtrlBtn icon={<Circle size={21} color="#ef4444" />} label="Record" onClick={startRecording} />
                    ) : (
                        <CtrlBtn icon={<Square size={21} fill="#ef4444" color="#ef4444" />} label="Stop Rec" onClick={stopRecording} active bColor="rgba(239,68,68,0.18)" />
                    )}
                </div>

                <button onClick={leave} style={{ padding: '0 26px', height: 50, borderRadius: 16, background: '#ef4444', color: '#fff', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
                    <PhoneOff size={18} /> End Call
                </button>
            </div>

            <div style={{ position: 'fixed', top: -3000, left: -3000, pointerEvents: 'none', opacity: 0 }}>
                <video ref={hiddenCamRef}    autoPlay playsInline muted width={1280} height={720} />
                <video ref={hiddenScreenRef} autoPlay playsInline muted width={1280} height={720} />
            </div>
        </div>
    );
}

const centeredOverlay: React.CSSProperties = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' };
const avatarBox: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', fontSize: '2rem' };
const sidebarStyle: React.CSSProperties = { borderLeft: '1px solid rgba(255,255,255,0.06)', background: '#111', display: 'flex', flexDirection: 'column' };
const topBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 9, padding: '7px 13px', color: '#fff', fontSize: '0.8rem' };

function SidebarHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900 }}>{title}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff' }}><X size={17} /></button>
        </div>
    );
}

function CtrlBtn({ icon, label, onClick, active, danger, bColor }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <button onClick={onClick} style={{
                width: 50, height: 50, borderRadius: 15, cursor: 'pointer',
                background: danger ? '#ef4444' : active ? (bColor ?? 'rgba(139,92,246,0.18)') : 'rgba(255,255,255,0.06)',
                border: 'none', color: '#fff',
            }}>{icon}</button>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{label}</span>
        </div>
    );
}
