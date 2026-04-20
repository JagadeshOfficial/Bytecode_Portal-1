import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, 
    Users, Settings, PhoneOff, Maximize, Circle, Square,
    Hand, Smile, MoreVertical, X, LayoutGrid, LayoutTemplate, Share2,
    LogOut, XCircle
} from 'lucide-react';

export default function BytecodeMeetingRoom({ session, roomName, onLeave, onRecordingSaved, currentUserRole = 'SUPER_ADMIN', currentUserName = 'Mewin', students = [] }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Media States
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const recordCamRef = useRef<HTMLVideoElement>(null);
    const recordScreenRef = useRef<HTMLVideoElement>(null);
    const recordingCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isRecordingRef = useRef(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<any>(null);
    
    // Feature States
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingPaused, setIsRecordingPaused] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [viewMode, setViewMode] = useState<'GALLERY' | 'SPEAKER'>('GALLERY');
    const [permissionDenied, setPermissionDenied] = useState(false);
    
    // Sidebar States
    const [activeSidebar, setActiveSidebar] = useState<'CHAT' | 'PARTICIPANTS' | null>(null);
    const [chatMessages, setChatMessages] = useState<{sender: string, text: string, time: string}[]>([]);
    const [chatInput, setChatInput] = useState('');

    // Roles logic: SUPER_ADMIN, ADMIN, TUTOR are Hosts. STUDENT is normal.
    const isHost = ['SUPER_ADMIN', 'ADMIN', 'TUTOR'].includes(currentUserRole);

    // Real-time synchronization of participants
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        const localUser = { id: 'local', name: currentUserName, role: currentUserRole, isHost: isHost, isMuted: isMuted, isVideoOff: isVideoOff, isSpeaking: true, handRaised: isHandRaised, stream: 'local' };
        
        const realParticipants = (students || []).map((s: any, idx: number) => ({
            id: s.id || `s-${idx}`,
            name: s.fullName || s.name || s.username || s.email,
            role: 'STUDENT',
            isHost: false,
            isMuted: true,
            isVideoOff: false,
            isSpeaking: false,
            handRaised: false,
            color: '#'+Math.floor(Math.random()*16777215).toString(16),
            avatar: (s.fullName || s.name || s.username || 'S')[0].toUpperCase()
        }));

        setParticipants([localUser, ...realParticipants]);
    }, [students, currentUserName, isHost, currentUserRole]);

    const [jitsiApi, setJitsiApi] = useState<any>(null);
    const jitsiContainerRef = useRef<HTMLDivElement>(null);

    // Initial Camera & Jitsi Setup
    useEffect(() => {
        if (!jitsiContainerRef.current) return;

        const domain = "meet.jit.si";
        const options = {
            roomName: roomName.replace(/\s+/g, '-'),
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: currentUserName
            },
            configOverwrite: {
                startWithAudioMuted: false,
                disableThirdPartyRequests: true,
                prejoinPageEnabled: false,
                enableWelcomePage: false,
                disableRemoteMute: false,
                remoteVideoMenu: {
                    disableKick: false
                }
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                BRAND_WATERMARK_LINK: "",
                DEFAULT_BACKGROUND: '#09090b',
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security'
                ],
            }
        };

        const api = new (window as any).JitsiMeetExternalAPI(domain, options);
        setJitsiApi(api);

        api.addEventListeners({
            readyToClose: () => handleLeave(),
            participantJoined: (p: any) => console.log("Joined:", p),
            videoConferenceJoined: () => {
                if (isHost && !isRecording) startRecording();
            }
        });

        return () => {
            if (api) api.dispose();
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // AUTO-START RECORDING FOR HOST
    useEffect(() => {
        if (isHost && stream && !isRecording) {
            startRecording();
        }
    }, [isHost, stream]);

    // Recording Timer Effect
    useEffect(() => {
        if (isRecording && !isRecordingPaused) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRecording, isRecordingPaused]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => { track.enabled = !track.enabled; });
            const newMuted = !stream.getAudioTracks()[0]?.enabled;
            setIsMuted(newMuted);
            updateLocalParticipant({ isMuted: newMuted });
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => { track.enabled = !track.enabled; });
            const newVideoOff = !stream.getVideoTracks()[0]?.enabled;
            setIsVideoOff(newVideoOff);
            updateLocalParticipant({ isVideoOff: newVideoOff });
        }
    };

    const updateLocalParticipant = (updates: any) => {
        setParticipants(prev => prev.map(p => p.stream === 'local' ? { ...p, ...updates } : p));
    };

    const toggleScreenShare = async () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
            screenStreamRef.current = null;
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
            setViewMode('GALLERY');
        } else {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                setScreenStream(displayStream);
                screenStreamRef.current = displayStream;
                setViewMode('SPEAKER'); // Switch to speaker view to highlight screen
                if (screenRef.current) screenRef.current.srcObject = displayStream;
                if (recordScreenRef.current) recordScreenRef.current.srcObject = displayStream;
                
                displayStream.getVideoTracks()[0].onended = () => {
                    setScreenStream(null);
                    setViewMode('GALLERY');
                };
            } catch (err) {
                console.error("Screen share failed or cancelled", err);
            }
        }
    };

    const startRecording = async () => { 
        if (!localStreamRef.current) return;
        
        // --- STABILITY BOOSTER: Ensure both elements are 'active' and 'playing' ---
        if (recordCamRef.current) {
            recordCamRef.current.srcObject = localStreamRef.current;
            await recordCamRef.current.play().catch(e => console.warn("Cam playback fail", e));
        }
        if (recordScreenRef.current && screenStreamRef.current) {
            recordScreenRef.current.srcObject = screenStreamRef.current;
            await recordScreenRef.current.play().catch(e => console.warn("Screen playback fail", e));
        }
        
        // Wait for video to actually be 'scanned' by the browser (crucial for Canvas drawImage)
        await new Promise(r => setTimeout(r, 1500));
        
        setIsRecording(true); 
        isRecordingRef.current = true;
        setIsRecordingPaused(false); 
        setRecordingTime(0);
        audioChunks.current = [];

        // Digital Director Engine
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawFrame = () => {
            if (!isRecordingRef.current) return;
            
            // Background Blackout
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const sStream = screenStreamRef.current;
            const lStream = localStreamRef.current;

            try {
                // Scenario A: Screen Share is Active (MAIN VIEW)
                if (sStream && recordScreenRef.current && (recordScreenRef.current.readyState >= 2 || recordScreenRef.current.videoWidth > 0)) {
                    ctx.drawImage(recordScreenRef.current, 0, 0, canvas.width, canvas.height);
                    
                    // Overlay Camera as Picture-in-Picture (PIP)
                    if (recordCamRef.current && !isVideoOff && (recordCamRef.current.readyState >= 2 || recordCamRef.current.videoWidth > 0)) {
                        const pipW = 300;
                        const pipH = 170;
                        const margin = 20;
                        ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
                        ctx.fillRect(canvas.width - pipW - margin - 1, canvas.height - pipH - margin - 1, pipW + 2, pipH + 2);
                        ctx.drawImage(recordCamRef.current, canvas.width - pipW - margin, canvas.height - pipH - margin, pipW, pipH);
                    }
                } else if (recordCamRef.current && !isVideoOff && (recordCamRef.current.readyState >= 2 || recordCamRef.current.videoWidth > 0)) {
                    // Scenario B: Camera Only (FULL VIEW)
                    ctx.drawImage(recordCamRef.current, 0, 0, canvas.width, canvas.height);
                } else {
                    // Fallback visual to confirm loop is alive
                    ctx.fillStyle = "#050505";
                    ctx.fillRect(0,0, canvas.width, canvas.height);
                    ctx.font = "bold 26px sans-serif";
                    ctx.fillStyle = "#8b5cf6";
                    ctx.fillText("Bytecode Engine: Synchronizing Streams...", 430, 340);
                    ctx.font = "16px sans-serif";
                    ctx.fillStyle = "rgba(255,255,255,0.4)";
                    ctx.fillText("Connecting to hardware video vault...", 520, 370);
                }
            } catch (err) {
                console.error("Canvas draw frame error", err);
            }

            animationFrameRef.current = requestAnimationFrame(drawFrame);
        };
        drawFrame();

        const canvasStream = canvas.captureStream(30);
        const combinedTracks = [
            ...canvasStream.getVideoTracks(),
            ...localStreamRef.current.getAudioTracks()
        ];
        const finalStream = new MediaStream(combinedTracks);
        
        try {
            const recorder = new MediaRecorder(finalStream, { mimeType: 'video/webm;codecs=vp9' });
            recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
            recorder.start();
            setMediaRecorder(recorder);
        } catch (e) {
            console.error("Recording initialization failed", e);
            // Fallback for Safari/Legacy browsers
            const recorder = new MediaRecorder(finalStream);
            recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
            recorder.start();
            setMediaRecorder(recorder);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorder) {
            if (isRecordingPaused) mediaRecorder.resume();
            else mediaRecorder.pause();
            setIsRecordingPaused(!isRecordingPaused);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder) {
            setIsRecording(false);
            isRecordingRef.current = false;
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            
            mediaRecorder.onstop = async () => {
                const blob = new Blob(audioChunks.current, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                
                setIsRecordingPaused(false);
                
                if (session && session.id) {
                    try {
                        const res = await fetch(`http://localhost:8080/api/academic/sessions/${session.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...session, recordingUrl: videoUrl })
                        });
                        if (res.ok) {
                            onRecordingSaved && onRecordingSaved(videoUrl);
                        }
                    } catch (e) {
                        onRecordingSaved && onRecordingSaved(videoUrl);
                    }
                }
            };
            mediaRecorder.stop();
        }
    };
    
    const toggleHandRaise = () => {
        const newState = !isHandRaised;
        setIsHandRaised(newState);
        updateLocalParticipant({ handRaised: newState });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages([...chatMessages, {
            sender: currentUserName,
            text: chatInput,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);
        setChatInput('');
    };

    const handleLeave = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (screenStream) screenStream.getTracks().forEach(track => track.stop());
        onLeave();
    };

    const activeSpeaker = participants.find(p => p.isSpeaking) || participants[0];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#09090b', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
            
            {/* --- TOP BAR --- */}
            <div style={{ padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px' }}>{roomName.toUpperCase()}</h2>
                    </div>
                    {isRecording && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: isRecordingPaused ? 1 : [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isRecordingPaused ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '8px', color: isRecordingPaused ? '#f59e0b' : '#ef4444', fontSize: '0.8rem', fontWeight: 900 }}>
                            <Circle fill={isRecordingPaused ? "#f59e0b" : "#ef4444"} size={10} /> 
                            {isRecordingPaused ? 'REC PAUSED' : 'RECORDING'} 
                            <span style={{ marginLeft: '5px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '8px', color: '#fff' }}>{formatTime(recordingTime)}</span>
                        </motion.div>
                    )}
                </div>
                
                <div style={{ display: 'flex', gap: '15px', color: 'var(--text-dim)' }}>
                    <button onClick={() => setViewMode(viewMode === 'GALLERY' ? 'SPEAKER' : 'GALLERY')} title="Toggle View" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', color: '#fff', cursor: 'pointer' }}>
                        {viewMode === 'GALLERY' ? <><LayoutTemplate size={16} /> Speaker View</> : <><LayoutGrid size={16} /> Gallery View</>}
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Maximize size={20} /></button>
                </div>
            </div>

            {/* --- MAIN CONTENT LAYOUT --- */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                
                {/* Stage Area */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
                    <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
                    
                    {/* Overlay Controls (Floating) */}
                    <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', gap: '15px' }}>
                         {isRecording && (
                             <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.9)', padding: '10px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>REC {formatTime(recordingTime)}</span>
                             </motion.div>
                         )}
                    </div>
                </div>

                {/* Sidebars */}
                <AnimatePresence>
                    {activeSidebar === 'CHAT' && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#18181b', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Meeting Chat</h3>
                                <button onClick={() => setActiveSidebar(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {chatMessages.map((msg, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: msg.sender === currentUserName ? 'var(--primary)' : '#fff' }}>{msg.sender}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{msg.time}</span>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', color: '#e4e4e7', borderTopLeftRadius: '2px' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
                            </form>
                        </motion.div>
                    )}

                    {activeSidebar === 'PARTICIPANTS' && (
                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', background: '#18181b', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Participants ({participants.length})</h3>
                                <button onClick={() => setActiveSidebar(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ flex: 1, padding: '15px' }}>
                                {participants.sort((a,b) => (b.isHost ? 1 : 0) - (a.isHost ? 1 : 0)).map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: p.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>
                                                {p.avatar || currentUserName[0]}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{p.name} {p.stream === 'local' && '(You)'}</span>
                                                <span style={{ fontSize: '0.65rem', color: p.isHost ? '#f59e0b' : 'var(--text-dim)', fontWeight: 900 }}>{p.isHost ? 'HOST / ' + p.role : 'PARTICIPANT'}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-dim)' }}>
                                            {p.handRaised && <Hand size={16} color="#f59e0b" />}
                                            {p.isMuted ? <MicOff size={16} color="#ef4444" /> : <Mic size={16} color="#10b981" />}
                                            {p.isVideoOff ? <VideoOff size={16} color="#ef4444" /> : <Video size={16} color="#10b981" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- BOTTOM CONTROLS --- */}
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                
                {/* Left Controls */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button onClick={toggleMute} style={{ width: '56px', height: '56px', borderRadius: '20px', background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.06)', border: isMuted ? 'none' : '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button onClick={toggleVideo} style={{ width: '56px', height: '56px', borderRadius: '20px', background: isVideoOff ? '#ef4444' : 'rgba(255,255,255,0.06)', border: isVideoOff ? 'none' : '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                        </button>
                    </div>
                </div>

                {/* Center Core Controls */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <ControlButton icon={<MonitorUp size={22} color={screenStream ? '#10b981' : '#fff'} />} label="Share Screen" onClick={toggleScreenShare} active={!!screenStream} />
                    <ControlButton icon={<Users size={22} />} label="Participants" onClick={() => setActiveSidebar(activeSidebar === 'PARTICIPANTS' ? null : 'PARTICIPANTS')} active={activeSidebar === 'PARTICIPANTS'} />
                    <ControlButton icon={<MessageSquare size={22} />} label="Chat" onClick={() => setActiveSidebar(activeSidebar === 'CHAT' ? null : 'CHAT')} active={activeSidebar === 'CHAT'} />
                    
                    {/* Exclusive Host Control */}
                    {isHost && !isRecording && (
                        <ControlButton 
                            icon={<Circle size={22} color="#fff" />} 
                            label="Start Record" 
                            onClick={startRecording}
                        />
                    )}
                    {isHost && isRecording && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <ControlButton 
                                icon={isRecordingPaused ? <Circle size={22} color="#f59e0b" /> : <Square size={22} color="#f59e0b" />} 
                                label={isRecordingPaused ? "Resume Record" : "Pause Record"} 
                                onClick={pauseRecording} 
                                active={true}
                                color="rgba(245, 158, 11, 0.4)"
                            />
                            <ControlButton 
                                icon={<Square size={22} fill="#ef4444" color="#ef4444" />} 
                                label="Stop Record" 
                                onClick={stopRecording} 
                                active={true} 
                                color="rgba(239, 68, 68, 0.4)"
                            />
                        </div>
                    )}

                    <ControlButton 
                        icon={<Hand size={22} color={isHandRaised ? '#f59e0b' : '#fff'} />} 
                        label="Raise Hand" 
                        onClick={toggleHandRaise} 
                        active={isHandRaised} 
                    />
                    <ControlButton icon={<Smile size={22} />} label="React" />
                </div>

                {/* Right End Call */}
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => {
                            if (isHost) {
                                // For hosts, show dropdown or toggle state
                                (window as any)._leaveDropdownOpen = !(window as any)._leaveDropdownOpen;
                                // Force re-render simple way
                                setParticipants([...participants]); 
                            } else {
                                handleLeave();
                            }
                        }} 
                        style={{ padding: '0 30px', height: '56px', borderRadius: '20px', background: '#ef4444', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)', transition: 'all 0.2s' }}
                    >
                        <PhoneOff size={20} />
                        {isHost ? 'LEAVE' : 'LEAVE MEETING'}
                    </button>
                    
                    {isHost && (window as any)._leaveDropdownOpen && (
                        <div style={{ position: 'absolute', bottom: '70px', right: 0, width: '220px', background: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '8px', zIndex: 1000, boxShadow: '0 15px 30px rgba(0,0,0,0.5)' }}>
                            <button 
                                onClick={() => { (window as any)._leaveDropdownOpen = false; handleLeave(); }}
                                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <LogOut size={16} /> Leave Meeting
                            </button>
                            <button 
                                onClick={() => { 
                                    (window as any)._leaveDropdownOpen = false;
                                    if (jitsiApi) jitsiApi.executeCommand('hangup');
                                    handleLeave();
                                }}
                                style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', textAlign: 'left', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            >
                                <XCircle size={16} /> End Meeting for All
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Capture Vault for Digital Director Engine */}
            <div style={{ position: 'fixed', top: -1000, left: -1000, pointerEvents: 'none', opacity: 0 }}>
                <video ref={recordCamRef} muted playsInline autoPlay />
                <video ref={recordScreenRef} muted playsInline autoPlay />
            </div>
        </div>
    );
}

// Sub-components
function ControlButton({ icon, label, onClick, active, color }: any) {
    return (
        <button onClick={onClick} style={{ padding: '0 20px', height: '56px', borderRadius: '20px', background: active ? (color || 'rgba(139, 92, 246, 0.2)') : 'rgba(255,255,255,0.03)', border: active ? (color ? `1px solid ${color}` : '1px solid var(--primary)') : '1px solid rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title={label}>
            {icon}
        </button>
    );
}

function PlaceholderAvatar({ p }: any) {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #18181b, #09090b)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: p.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 900, color: '#fff' }}>
                {p.avatar || 'YOU'}
            </div>
        </div>
    );
}

function ParticipantLabel({ p }: any) {
    return (
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', border: p.isHost ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
            {p.name} {p.stream === 'local' && '(You)'}
            {p.isHost && <span style={{ background: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.6rem', color: '#000', fontWeight: 900 }}>HOST</span>}
            {p.isMuted && <MicOff size={14} color="#ef4444" />}
            {p.handRaised && <Hand size={14} color="#f59e0b" />}
        </div>
    );
}
