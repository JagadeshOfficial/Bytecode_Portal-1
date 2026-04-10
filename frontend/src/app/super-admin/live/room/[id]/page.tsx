"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare,
    Users, PhoneOff, Circle, Square, Hand, X, LayoutGrid,
    LayoutTemplate, Copy, CheckCheck, Download, Pause, Play,
    VolumeX, AlertCircle, Save, Check, Loader2, Maximize, Minimize,
    UserCircle, MoreVertical
} from 'lucide-react';

export default function BytecodeWebRTCRoom() {
    const params  = useParams();
    const router  = useRouter();
    const roomId  = params.id as string;
    const roomRef = useRef<HTMLDivElement>(null);

    // ── Refs ────────────────────────────────────────────────────────
    const localVideoRef    = useRef<HTMLVideoElement>(null);
    const screenVideoRef   = useRef<HTMLVideoElement>(null);
    const hiddenCamRef     = useRef<HTMLVideoElement>(null);   
    const hiddenScreenRef  = useRef<HTMLVideoElement>(null);   
    const localStreamRef   = useRef<MediaStream | null>(null);
    const screenStreamRef  = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef        = useRef<Blob[]>([]);
    const animFrameRef     = useRef<number>(0);
    const recActiveRef     = useRef(false);  
    const isVideoOffRef    = useRef(false);  
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const recStartedRef    = useRef(false);  

    // ── State ────────────────────────────────────────────────────────
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
    const [isFullscreen,  setIsFullscreen]  = useState(false);
    
    // Mock participants
    const [participants,  setParticipants]  = useState([
        { id: 1, name: 'You (Host)', avatar: 'Y', isMuted: false, isVideoOff: false, role: 'Tutor' },
        { id: 2, name: 'Suryavardhan', avatar: 'S', isMuted: true, isVideoOff: true, role: 'Student' },
        { id: 3, name: 'Rahul Kumar', avatar: 'R', isMuted: false, isVideoOff: false, role: 'Student' },
        { id: 4, name: 'Priya Sharma', avatar: 'P', isMuted: true, isVideoOff: false, role: 'Student' },
    ]);

    // ── Init camera + mic ─────────────────────────────────────────────
    useEffect(() => {
        window.addEventListener('beforeunload', cleanupStreams);
        async function init() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: true,
                });
                localStreamRef.current = stream;
                // Double ensure these are attached
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                if (hiddenCamRef.current) {
                    hiddenCamRef.current.srcObject = stream;
                    hiddenCamRef.current.play().catch(() => {});
                }
                setCamReady(true);
            } catch {
                setPermDenied(true);
            }
        }
        init();

        return () => {
             window.removeEventListener('beforeunload', cleanupStreams);
             cleanupStreams();
        };
    }, []); // eslint-disable-line

    const cleanupStreams = () => {
        console.log("Cleaning up all media streams...");
        // 1. Nul out all video elements to break references
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
        if (hiddenCamRef.current) hiddenCamRef.current.srcObject = null;
        if (hiddenScreenRef.current) hiddenScreenRef.current.srcObject = null;

        // 2. Stop all tracks in both streams
        [localStreamRef.current, screenStreamRef.current].forEach(s => {
            if (s) {
                s.getTracks().forEach(t => {
                    t.enabled = false;
                    t.stop();
                });
            }
        });

        // 3. Clear refs
        localStreamRef.current = null;
        screenStreamRef.current = null;
        
        // 4. Stop timers and intervals
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    // ── Re-attach streams ─────────────────────────────────────────────
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

    useEffect(() => {
        if (hiddenCamRef.current && localStreamRef.current) {
            hiddenCamRef.current.srcObject = localStreamRef.current;
            hiddenCamRef.current.play().catch(() => {});
        }
    }, [camReady]);

    useEffect(() => {
        if (hiddenScreenRef.current && screenStream) {
            hiddenScreenRef.current.srcObject = screenStream;
            hiddenScreenRef.current.play().catch(() => {});
        } else if (hiddenScreenRef.current && !screenStream) {
            hiddenScreenRef.current.srcObject = null;
        }
    }, [screenStream]);

    // ── Timer ────────────────────────────────────────────────────────
    const startTimer = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => {
            if (!isPaused) setRecTime(p => p + 1);
        }, 1000);
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

    // ── Toggles ───────────────────────────────────────────────────────
    const toggleMic = () => {
        const tracks = localStreamRef.current?.getAudioTracks() ?? [];
        tracks.forEach(t => { t.enabled = !t.enabled; });
        setIsMuted(p => !p);
        setParticipants(prev => prev.map(p => p.id === 1 ? { ...p, isMuted: !p.isMuted } : p));
    };

    const toggleVideo = () => {
        const tracks = localStreamRef.current?.getVideoTracks() ?? [];
        const next = !isVideoOffRef.current;
        tracks.forEach(t => { t.enabled = !next; });
        isVideoOffRef.current = next;
        setIsVideoOff(next);
        setParticipants(prev => prev.map(p => p.id === 1 ? { ...p, isVideoOff: next } : p));
    };

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
            s.getVideoTracks()[0].onended = () => {
                setScreenStream(null);
                screenStreamRef.current = null;
                setViewMode('GALLERY');
            };
        } catch { }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            roomRef.current?.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // ── AUTO-SAVE LOGIC ───────────────────────────────────────────────
    const uploadRecording = useCallback(async (blob: Blob) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('recording', blob, `recording-${roomId}-${Date.now()}.webm`);
            const res = await fetch(`http://localhost:8080/api/academic/sessions/${roomId}/recording`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            setRecError('Auto-save failed.');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [roomId]);

    // ── RECORDING CONTROLS ─────────────────────────────────────────────
    const startRecording = async () => {
        if (recStartedRef.current) return;
        if (!localStreamRef.current) return;
        
        recStartedRef.current = true;
        setRecError('');
        setRecBlob(null);
        setRecTime(0);
        chunksRef.current = [];

        const camEl = hiddenCamRef.current!;
        if (camEl.paused) await camEl.play().catch(() => {});
        await new Promise<void>(r => {
            const check = () => { if (camEl.videoWidth > 0) return r(); requestAnimationFrame(check); };
            check();
        });

        const canvas  = document.createElement('canvas');
        canvas.width  = 1280; canvas.height = 720;
        const ctx     = canvas.getContext('2d')!;

        recActiveRef.current = true;
        const drawFrame = () => {
            if (!recActiveRef.current) return;
            
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, 1280, 720);

            const scrEl  = hiddenScreenRef.current;
            const hasScr = scrEl && scrEl.srcObject && scrEl.videoWidth > 0;
            const hasCam = !isVideoOffRef.current && camEl && camEl.srcObject && camEl.videoWidth > 0;

            // Ensure they are playing (vital for compositor)
            if (hasScr && scrEl.paused) scrEl.play().catch(() => {});
            if (hasCam && camEl.paused) camEl.play().catch(() => {});

            if (hasScr) {
                ctx.drawImage(scrEl, 0, 0, 1280, 720);
                if (hasCam) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
                    ctx.fillRect(20, 20, 304, 174);
                    ctx.drawImage(camEl, 22, 22, 300, 170);
                }
            } else if (hasCam) {
                ctx.drawImage(camEl, 0, 0, 1280, 720);
            } else {
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, 1280, 720);
                ctx.fillStyle = '#8b5cf6';
                ctx.font = 'bold 32px Inter';
                ctx.fillText('BYTECODE SESSION RECORDING', 400, 360);
            }
            animFrameRef.current = requestAnimationFrame(drawFrame);
        };
        drawFrame();

        const canvasStream = canvas.captureStream(30);
        const finalStream  = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...localStreamRef.current.getAudioTracks(),
        ]);

        const mimeType = 'video/webm;codecs=vp9,opus';
        let rec: MediaRecorder;
        try { rec = new MediaRecorder(finalStream, { mimeType }); } 
        catch { rec = new MediaRecorder(finalStream); }

        rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        
        rec.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecBlob(blob);
            recStartedRef.current = false;
            await uploadRecording(blob);
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
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    // ── Chat / Navigation ──────────────────────────────────────────────
    const sendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMsgs(p => [...p, { name: 'You', text: chatInput.trim(), t: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setChatInput('');
    };

    const leave = async () => {
        const confirmExit = window.confirm("Are you sure you want to end this session for everyone?");
        if (!confirmExit) return;
        
        if (isRecording) {
            stopRecording();
            // Wait for upload in the overlay
        } else {
            cleanupStreams();
            router.back();
        }
    };

    useEffect(() => {
        if (saveSuccess && !isRecording && !mediaRecorderRef.current) {
            cleanupStreams();
            router.back();
        }
    }, [saveSuccess, isRecording, router]);

    return (
        <div ref={roomRef} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#09090b', display: 'flex', flexDirection: 'column', color: '#fff' }}>
            
            {/* SAVING OVERLAY */}
            <AnimatePresence>
                {isSaving && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(15px)' }}>
                        <div className="loader-container" style={{ position: 'relative', width: 100, height: 100 }}>
                            <Loader2 size={60} className="animate-spin" color="#8b5cf6" style={{ position: 'absolute', top: 20, left: 20 }} />
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', inset: 0, border: '4px solid #8b5cf6', borderRadius: '50%', borderTopColor: 'transparent' }} />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '30px', letterSpacing: '-1px' }}>Securing Your Session...</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '1.1rem' }}>Uploading high-quality recording to MongoDB GridFS</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />
                        <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.5px' }}>{decodeURIComponent(roomId).toUpperCase()}</span>
                    </div>

                    {isRecording && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <motion.div animate={{ opacity: isPaused ? 1 : [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: isPaused ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${isPaused ? '#f59e0b' : '#ef4444'}`, padding: '6px 14px', borderRadius: 10, color: isPaused ? '#f59e0b' : '#ef4444', fontSize: '0.8rem', fontWeight: 900 }}>
                                <Circle fill={isPaused ? '#f59e0b' : '#ef4444'} size={10} /> {isPaused ? 'PAUSED' : 'RECORDING'} {fmt(recTime)}
                            </motion.div>
                            
                            {isPaused ? (
                                <button onClick={resumeRecording} style={{ ...topBtnStyle, background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', color: '#10b981' }}><Play size={14} /> Resume</button>
                            ) : (
                                <button onClick={pauseRecording} style={{ ...topBtnStyle, background: 'rgba(245,158,11,0.1)', borderColor: '#f59e0b', color: '#f59e0b' }}><Pause size={14} /> Pause</button>
                            )}
                        </div>
                    )}

                    {!isRecording && recBlob && (
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(16,185,129,0.1)', padding: '6px 15px', borderRadius: 10, border: '1px solid #10b981' }}>
                            <Check size={16} color="#10b981" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>SESSION SAVED TO DB</span>
                        </motion.div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={toggleFullscreen} style={topBtnStyle}>
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} style={topBtnStyle}>
                        {copied ? <CheckCheck size={16} color="#10b981" /> : <Copy size={16} />} Invite
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '10px' }}>
                <div style={{ flex: 1, position: 'relative', background: '#000', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    {viewMode === 'SPEAKER' && screenStream ? (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <video ref={screenVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <div style={{ position: 'absolute', bottom: 30, right: 30, width: 280, height: 157, borderRadius: 20, overflow: 'hidden', border: '3px solid rgba(139,92,246,0.8)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                {isVideoOff ? <div style={avatarBox}>{participants[0].avatar}</div> : <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />}
                            </div>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                             {/* Mock Gallery View */}
                             <div style={{ position: 'relative', width: 'min(780px, calc(100% - 40px))', aspectRatio: '16/9', borderRadius: 24, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                                {isVideoOff ? <div style={avatarBox}>{participants[0].avatar}</div> : <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />}
                                <div style={participantLabel}>You (Tutor)</div>
                             </div>
                             {participants.slice(1).map(p => (
                                 <div key={p.id} style={{ position: 'relative', width: '280px', aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.05)' }}>
                                     <div style={avatarBox}>{p.avatar}</div>
                                     <div style={participantLabel}>{p.name}</div>
                                     {p.isMuted && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(239,68,68,0.8)', padding: 4, borderRadius: '50%' }}><MicOff size={12} /></div>}
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {sidebar && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} style={sidebarStyle}>
                            <SidebarHeader title={sidebar === 'CHAT' ? "Meeting Chat" : "Participants"} onClose={() => setSidebar(null)} />
                            
                            {sidebar === 'PARTICIPANTS' ? (
                                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 900, textTransform: 'uppercase', marginBottom: 5 }}>Online — {participants.length}</div>
                                    {participants.map(p => (
                                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: p.role === 'Tutor' ? 'var(--primary)' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>{p.avatar}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{p.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{p.role}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {p.isMuted ? <MicOff size={16} color="#ef4444" /> : <Mic size={16} color="#10b981" />}
                                                {p.isVideoOff ? <VideoOff size={16} color="#ef4444" /> : <Video size={16} color="#10b981" />}
                                                <MoreVertical size={16} color="rgba(255,255,255,0.2)" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 15 }}>
                                        {chatMsgs.map((m, i) => (
                                            <div key={i} style={{ alignSelf: m.name === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 10 }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: m.name === 'You' ? '#8b5cf6' : '#999' }}>{m.name}</span>
                                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{m.t}</span>
                                                </div>
                                                <div style={{ background: m.name === 'You' ? '#8b5cf6' : 'rgba(255,255,255,0.06)', padding: '10px 15px', borderRadius: m.name === 'You' ? '18px 2px 18px 18px' : '2px 18px 18px 18px', fontSize: '0.9rem' }}>{m.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={sendMsg} style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10 }}>
                                        <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Send a message..." style={{ flex: 1, padding: '12px 18px', borderRadius: '14px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
                                        <button type="submit" style={{ width: 44, height: 44, borderRadius: '14px', background: '#8b5cf6', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} /></button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CONTROLS */}
            <div style={{ padding: '20px 30px', background: '#0a0a0f', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    <CtrlBtn icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />} label={isMuted ? 'UNMUTE' : 'MUTE'} onClick={toggleMic} danger={isMuted} />
                    <CtrlBtn icon={isVideoOff ? <VideoOff size={22} /> : <Video size={22} />} label={isVideoOff ? 'START CAM' : 'STOP CAM'} onClick={toggleVideo} danger={isVideoOff} />
                </div>

                <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <CtrlBtn icon={<MonitorUp size={22} color={screenStream ? '#10b981' : '#fff'} />} label="SHARE" onClick={toggleScreen} active={!!screenStream} />
                    <CtrlBtn icon={<Users size={22} />} label="PEOPLE" onClick={() => setSidebar(sidebar === 'PARTICIPANTS' ? null : 'PARTICIPANTS')} active={sidebar === 'PARTICIPANTS'} />
                    <CtrlBtn icon={<MessageSquare size={22} />} label="CHAT" onClick={() => setSidebar(sidebar === 'CHAT' ? null : 'CHAT')} active={sidebar === 'CHAT'} />
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }} />
                    {!isRecording ? (
                        <CtrlBtn icon={<Circle size={22} color="#ef4444" />} label="RECORD" onClick={startRecording} />
                    ) : (
                        <CtrlBtn icon={<Square size={22} fill="#ef4444" color="#ef4444" />} label="STOP REC" onClick={stopRecording} active bColor="rgba(239,68,68,0.25)" />
                    )}
                </div>

                <button onClick={leave} style={{ padding: '0 30px', height: 54, borderRadius: '18px', background: '#ef4444', color: '#fff', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(239,68,68,0.2)' }}>
                    <PhoneOff size={20} /> END SESSION
                </button>
            </div>

            {/* COMPOSITOR SOURCES */}
            <div style={{ position: 'fixed', bottom: 0, right: 0, width: '2px', height: '2px', opacity: 0.01, pointerEvents: 'none', overflow: 'hidden' }}>
                <video ref={hiddenCamRef} autoPlay playsInline muted width={1280} height={720} />
                <video ref={hiddenScreenRef} autoPlay playsInline muted width={1280} height={720} />
            </div>
            
            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}

const avatarBox: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1c1f', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)' };
const sidebarStyle: React.CSSProperties = { borderLeft: '1px solid rgba(255,255,255,0.08)', background: '#111', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px 0 0 24px', marginLeft: '10px' };
const topBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 16px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 700 };
const participantLabel: React.CSSProperties = { position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#fff', backdropFilter: 'blur(4px)' };

function SidebarHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{title}</span>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', padding: 8, borderRadius: '50%' }}><X size={18} /></button>
        </div>
    );
}

function CtrlBtn({ icon, label, onClick, active, danger, bColor }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <button onClick={onClick} style={{ width: 54, height: 54, borderRadius: '18px', cursor: 'pointer', background: danger ? '#ef4444' : active ? (bColor ?? 'rgba(139,92,246,0.2)') : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</button>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{label}</span>
        </div>
    );
}
