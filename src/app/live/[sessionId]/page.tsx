"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/ui/Toast';
import {
    Mic, MicOff, Video, VideoOff, Monitor, PhoneOff,
    MessageSquare, Users, Settings, Shield, Hand,
    MoreVertical, Share2, Grid, Layout, Maximize2,
    Send, Smile, Paperclip, X, Crown, Radio, Clock,
    Calendar, Play, Square, Laptop, AlertCircle, Trash2
} from 'lucide-react';
import api from '@/lib/api';

interface LiveSession {
    id: string;
    title: string;
    batchId: string;
    mentorName: string;
    startTime: string;
    endTime?: string;
    duration: number;
    meetingLink: string;
    status: string;
    batchName?: string;
    courseName?: string;
}

export default function LiveSessionPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId;

    // Media States
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const [isJoining, setIsJoining] = useState(true);

    // Data States
    const [sessionData, setSessionData] = useState<LiveSession | null>({
        id: sessionId as string,
        title: 'Architecture Patterns & Microservices',
        mentorName: 'Mahendra Nath Chamnoor',
        duration: 90,
        status: 'LIVE',
        meetingLink: '',
        batchId: 'BATCH-2024-01',
        batchName: 'Full Stack Java-02',
        courseName: 'Advanced Enterprise Java',
        startTime: new Date().toISOString(),
        endTime: new Date(new Date().getTime() + 90 * 60000).toISOString()
    } as any);
    const [sessionTime, setSessionTime] = useState(0);
    const [recordingTime, setRecordingTime] = useState(0);
    const [loading, setLoading] = useState(true);

    // UI States
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [activeSidebar, setActiveSidebar] = useState<'chat' | 'participants' | 'recordings' | null>(null);
    const [archivedRecordings, setArchivedRecordings] = useState<any[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
    const [hasRaisedHand, setHasRaisedHand] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [isLeaveMenuOpen, setIsLeaveMenuOpen] = useState(false);
    const leaveMenuRef = useRef<HTMLDivElement>(null);
    const [pinnedParticipantId, setPinnedParticipantId] = useState<number | null>(1); // Default pin Trainer
    const [activeParticipantMenu, setActiveParticipantMenu] = useState<number | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [mediaPermissionError, setMediaPermissionError] = useState(false);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    // Current User Info (Simulated - would come from auth context)
    const currentUser = {
        name: "Koushik Krishna",
        role: "Super Admin",
        isAdmin: true
    };

    // Fetch Session Data
    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (sessionId) {
                    try {
                        // First attempt: Direct fetch by ID
                        const res = await api.get(`academic/sessions/${sessionId}`);
                        setSessionData(res.data);
                    } catch (err: any) {
                        // Fallback: If 404, search all sessions for a matching meetingLink
                        if (err.response?.status === 404) {
                            console.log("Session not found by ID, searching all sessions...");
                            const allRes = await api.get('academic/sessions');
                            const allSessions: LiveSession[] = allRes.data;
                            const found = allSessions.find(s => s.meetingLink && s.meetingLink.includes(sessionId as string));
                            if (found) {
                                setSessionData(found);
                            } else {
                                throw err; // Re-throw if truly not found
                            }
                        } else {
                            throw err;
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch session details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [sessionId]);

    // Unified Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        interval = setInterval(() => {
            if (!isJoining) setSessionTime(prev => prev + 1);
            if (isRecording) setRecordingTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isJoining, isRecording]);

    const formatElapsedTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Context for stream cleanup and attachment
    useEffect(() => {
        const startMedia = async () => {
            try {
                const userMedia = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(userMedia);
                setIsJoining(false);
            } catch (err: any) {
                console.error("Error accessing media devices:", err);
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setMediaPermissionError(true);
                }
                setIsJoining(false);
            }
        };

        startMedia();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (screenStream) screenStream.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (leaveMenuRef.current && !leaveMenuRef.current.contains(event.target as Node)) {
                setIsLeaveMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateString: string) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    // Attach stream to video element whenever it changes or state changes
    useEffect(() => {
        if (videoRef.current && stream && !isCameraOff) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isCameraOff, videoRef.current]);

    useEffect(() => {
        if (screenVideoRef.current && screenStream && isSharingScreen) {
            screenVideoRef.current.srcObject = screenStream;
        }
    }, [screenStream, isSharingScreen, screenVideoRef.current]);

    // Toggle Camera
    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = isCameraOff;
                setIsCameraOff(!isCameraOff);
            }
        }
    };

    // Toggle Mic
    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isMuted;
                setIsMuted(!isMuted);
            }
        }
    };

    // Toggle Screen Share
    const toggleScreenShare = async () => {
        if (!isSharingScreen) {
            try {
                const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                setScreenStream(captureStream);
                setIsSharingScreen(true);

                // Handle stop from browser's "Stop sharing" button
                captureStream.getVideoTracks()[0].onended = () => {
                    setIsSharingScreen(false);
                    setScreenStream(null);
                };
            } catch (err) {
                console.error("Error sharing screen:", err);
            }
        } else {
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }
            setScreenStream(null);
            setIsSharingScreen(false);
        }
    };

    // Demo Content
    const [messages, setMessages] = useState([
        { id: 1, user: "Trainer Mahendra", text: "Welcome everyone to today's Advanced React session!", time: "10:30 AM", isTrainer: true },
        { id: 2, user: "Vikas Koud", text: "Hello Sir! Ready for the session.", time: "10:31 AM" },
        { id: 3, user: "Ananya Iyer", text: "Will we cover Server Components today?", time: "10:32 AM" },
    ]);

    const [participants, setParticipants] = useState([
        { id: 1, name: "Mahendra Nath Chamnoor", role: "Trainer", isMe: false, isMuted: false, isCamera: true, isHost: true, isAdmin: true },
        { id: 2, name: "Koushik Krishna", role: "Super Admin (You)", isMe: true, isMuted: false, isCamera: true, isHost: true, isAdmin: true },
        { id: 3, name: "Vikas Koud", role: "Student", isMe: false, isMuted: true, isCamera: true, isHost: false, isAdmin: false },
        { id: 4, name: "Ananya Iyer", role: "Student", isMe: false, isMuted: false, isCamera: false, isHost: false, isAdmin: false },
        { id: 5, name: "Rahul Verma", role: "Student", isMe: false, isMuted: true, isCamera: true, isHost: false, isAdmin: false },
    ]);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const storedRemoved = localStorage.getItem(`removed_participants_${sessionId}`);
            if (storedRemoved) {
                const removedIds = JSON.parse(storedRemoved);
                setParticipants(prev => prev.filter(p => !removedIds.includes(p.id)));
            }

            // Load archived recordings
            const storedRecs = localStorage.getItem('bytecode_recordings');
            if (storedRecs) {
                setArchivedRecordings(JSON.parse(storedRecs));
            }
        }
    }, [sessionId]);



    const toggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
            setRecordingStartTime(Date.now());
            setRecordingTime(0);
            showToast('success', 'Session recording started. Information will be saved to archives.');
        } else {
            setIsRecording(false);
            const duration = formatElapsedTime(recordingTime);

            // Prepare recording metadata for 'database' (simulated via localStorage)
            const recordingEntry = {
                id: `REC-${Date.now()}`,
                sessionId: sessionId,
                title: sessionData?.title || 'Live Session',
                courseName: sessionData?.courseName || 'Advanced Development',
                batchName: sessionData?.batchName || 'Batch-2024',
                mentorName: sessionData?.mentorName || currentUser.name,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                duration: duration,
                views: Math.floor(Math.random() * 50) + 10,
                status: 'Archived',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
            };

            const existing = JSON.parse(localStorage.getItem('bytecode_recordings') || '[]');
            const updated = [recordingEntry, ...existing];
            localStorage.setItem('bytecode_recordings', JSON.stringify(updated));
            setArchivedRecordings(updated);

            showToast('success', 'Recording saved to database and Session Archive!');
            setRecordingStartTime(null);
            setRecordingTime(0);
        }
    };

    const removeParticipant = (participantId: number, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Participant',
            message: `Are you sure you want to remove ${name} from the session? This action cannot be undone.`,
            onConfirm: () => {
                setParticipants(prev => prev.filter(p => p.id !== participantId));

                // Persist removal across refreshes
                const storedRemoved = localStorage.getItem(`removed_participants_${sessionId}`);
                const removedIds = storedRemoved ? JSON.parse(storedRemoved) : [];
                if (!removedIds.includes(participantId)) {
                    localStorage.setItem(`removed_participants_${sessionId}`, JSON.stringify([...removedIds, participantId]));
                }

                if (pinnedParticipantId === participantId) setPinnedParticipantId(1);
                showToast('success', `${name} has been removed.`);
                setConfirmModal(null);
            }
        });
    };

    const togglePin = (id: number) => {
        setPinnedParticipantId(pinnedParticipantId === id ? null : id);
        setActiveParticipantMenu(null);
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            user: "Koushik Krishna",
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isTrainer: false
        }]);
        setChatInput("");
    };

    return (
        <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden flex flex-col font-outfit">
            {/* Top Bar */}
            <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Radio size={20} className="text-white animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-black tracking-wider uppercase text-blue-400">Bytecode Live</h1>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
                            {isRecording && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1.5 bg-red-600/10 border border-red-600/30 px-2 py-0.5 rounded-full text-[9px] font-black text-red-500 uppercase tracking-tighter shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                >
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                                    REC {formatElapsedTime(recordingTime)}
                                </motion.div>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Session ID: {sessionId}</p>
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> secure-p2p connection
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {participants.slice(0, 3).map((p, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {p.name.charAt(0)}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                            +{isMounted ? (participants.length - 3) : (5 - 3)}
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Video Grid */}
                <div className={`flex-1 p-6 transition-all duration-500 ${activeSidebar ? 'mr-[380px]' : ''}`}>
                    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                        {/* Main Spotlight (Usually the Trainer or Shared Screen) */}
                        <motion.div
                            layout
                            className={`relative rounded-3xl overflow-hidden bg-slate-900 border-2 ${pinnedParticipantId ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-white/5'} shadow-2xl group ${participants.length === 1 ? 'col-span-full row-span-full' : 'md:col-span-2 md:row-span-2'}`}
                        >


                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                                <span className="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                                    <Crown size={12} /> Spotlight
                                </span>
                                {pinnedParticipantId && (
                                    <motion.span
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-bold uppercase text-slate-300 flex items-center gap-1.5 border border-white/5"
                                    >
                                        <Layout size={10} /> Pinned
                                    </motion.span>
                                )}
                            </div>

                            {/* Main Stage Content */}
                            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden group cursor-zoom-in">
                                {isSharingScreen && screenStream ? (
                                    <video
                                        ref={screenVideoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        {(participants.find(p => p.id === (pinnedParticipantId || 1))?.isMe && !isCameraOff && stream) ? (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                                className="w-full h-full object-cover mirror"
                                            />
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                                <div className="text-center z-10">
                                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-4xl font-bold mb-4 shadow-2xl shadow-blue-500/20 mx-auto border-4 border-white/5">
                                                        {participants.find(p => p.id === (pinnedParticipantId || 1))?.name.charAt(0) || 'M'}
                                                    </div>
                                                    <h3 className="text-xl font-bold">{participants.find(p => p.id === (pinnedParticipantId || 1))?.name || 'Mahendra Nath Chamnoor'}</h3>
                                                    <p className="text-blue-400 font-medium">
                                                        {pinnedParticipantId ? 'Pinned to Stage' : `Presenting: ${sessionData?.title || 'Architecture Patterns'}`}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {/* Waveform Visualizer simulation */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-1 h-8">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, Math.random() * 20 + 8, 4] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                            className="w-1 bg-blue-500/50 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
                                <span className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold ring-1 ring-white/10">
                                    {isSharingScreen ? "You are sharing your screen" : (sessionData?.mentorName || "Mahendra Nath Chamnoor") + " (Host)"}
                                </span>
                                {!isSharingScreen && (
                                    <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg">
                                        <Mic size={14} />
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Other Participants */}
                        {participants.filter(p => p.id !== (pinnedParticipantId || 1)).slice(0, 4).map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-xl group"
                            >
                                <div className="absolute inset-0 bg-[#0d1117] flex items-center justify-center">
                                    {p.isMe && !isCameraOff && stream ? (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover mirror"
                                        />
                                    ) : (
                                        <div className={`w-20 h-20 rounded-full ${p.isMe ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-700'} flex items-center justify-center text-2xl font-bold shadow-xl border-4 border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                            {p.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                                    <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-200">
                                        {p.name}
                                    </span>
                                    <div className={`p-1 rounded-md ${p.isMuted || (p.isMe && isMuted) ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
                                        {(p.isMuted || (p.isMe && isMuted)) ? <MicOff size={10} /> : <Mic size={10} />}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar (Chat / Participants) */}
                <AnimatePresence>
                    {activeSidebar && (
                        <motion.aside
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="absolute right-0 inset-y-0 w-[380px] bg-[#0a0a0a] border-l border-white/10 z-30 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    {activeSidebar === 'chat' && <MessageSquare size={16} className="text-blue-500" />}
                                    {activeSidebar === 'participants' && <Users size={16} className="text-emerald-500" />}
                                    {activeSidebar === 'recordings' && <Monitor size={16} className="text-red-500" />}
                                    {activeSidebar === 'chat' ? 'Session Chat' : activeSidebar === 'participants' ? 'Participants' : 'Recording Archive'}
                                </h2>
                                <button onClick={() => setActiveSidebar(null)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {activeSidebar === 'chat' ? (
                                    <div className="space-y-6">
                                        {messages.map((m) => (
                                            <div key={m.id} className={`flex flex-col ${m.user === "Koushik Krishna" ? "items-end" : "items-start"}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${m.isTrainer ? "text-blue-400" : "text-slate-500"}`}>{m.user}</span>
                                                    <span className="text-[9px] text-slate-600">{m.time}</span>
                                                </div>
                                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${m.user === "Koushik Krishna"
                                                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10"
                                                    : "bg-white/5 text-slate-300 rounded-tl-none border border-white/5"
                                                    }`}>
                                                    {m.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : activeSidebar === 'participants' ? (
                                    <div className="space-y-2">
                                        {participants.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl ${p.isMe ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-800'} flex items-center justify-center font-bold text-sm`}>
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                            {p.name}
                                                            {p.isHost && <Crown size={12} className="text-amber-400" />}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{p.role}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className={`p-2 rounded-lg transition-colors ${p.isMuted ? 'text-red-400 bg-red-400/10' : 'text-slate-400 hover:bg-white/10'}`}
                                                        disabled={!currentUser.isAdmin && !p.isMe}
                                                        title={p.isMuted ? "Unmute" : "Mute"}
                                                    >
                                                        {p.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                                    </button>

                                                    {currentUser.isAdmin && !p.isMe && (
                                                        <button
                                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                            title="Remove Participant"
                                                            onClick={() => removeParticipant(p.id, p.name)}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}

                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setActiveParticipantMenu(activeParticipantMenu === p.id ? null : p.id)}
                                                            className={`p-2 rounded-lg transition-colors ${activeParticipantMenu === p.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-white/10'}`}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>

                                                        <AnimatePresence>
                                                            {activeParticipantMenu === p.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-1.5 z-[100]"
                                                                >
                                                                    <button
                                                                        onClick={() => togglePin(p.id)}
                                                                        className="w-full flex items-center gap-2 p-2.5 rounded-lg hover:bg-white/5 text-xs text-slate-300 hover:text-white transition-all font-bold"
                                                                    >
                                                                        <Layout size={14} className="text-blue-400" />
                                                                        {pinnedParticipantId === p.id ? 'Unpin' : 'Pin to Stage'}
                                                                    </button>
                                                                    <div className="h-px bg-white/5 my-1" />
                                                                    {currentUser.isAdmin && !p.isMe && (
                                                                        <button
                                                                            onClick={() => removeParticipant(p.id, p.name)}
                                                                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-xs text-red-400 transition-all"
                                                                        >
                                                                            <X size={14} /> Remove from call
                                                                        </button>
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl mb-4">
                                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-1">Local Archive</p>
                                            <p className="text-xs text-slate-500 leading-relaxed">Recorded sessions are stored locally and will appear in the operations console upon saving.</p>
                                        </div>
                                        {archivedRecordings.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="p-4 bg-white/5 rounded-2xl mb-4">
                                                    <Video size={32} className="text-slate-600" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-500">No recordings found</p>
                                                <p className="text-[10px] text-slate-600 mt-1">Start recording to see sessions here</p>
                                            </div>
                                        ) : (
                                            archivedRecordings.map((rec, i) => (
                                                <div key={rec.id || i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-red-500/30 transition-all group cursor-pointer">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">{rec.duration}</span>
                                                        <span className="text-[9px] text-slate-500 font-bold">{rec.date}</span>
                                                    </div>
                                                    <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors uppercase font-[Rajdhani] line-clamp-1">{rec.title}</h4>
                                                    <p className="text-[9px] text-slate-500 mt-1">{rec.batchName} • {rec.mentorName}</p>
                                                </div>
                                            ))
                                        )}
                                        {archivedRecordings.length > 0 && (
                                            <button
                                                onClick={() => router.push('/admin/dashboard/sessions')}
                                                className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Share2 size={14} /> View Global Dashboard Archive
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {activeSidebar === 'chat' && (
                                <div className="p-4 border-t border-white/5">
                                    <form onSubmit={sendMessage} className="relative">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                                            <button type="button" className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"><Smile size={18} /></button>
                                            <button type="submit" className="p-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"><Send size={18} /></button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </motion.aside>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Control Bar */}
            <footer className="h-24 px-8 flex items-center justify-between bg-[#080808] border-t border-white/5 z-40">
                <div className="flex items-center gap-4 w-1/4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <Clock size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white truncate max-w-[200px]">{sessionData?.title || 'Loading session...'}</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="text-emerald-500">{sessionData?.status || 'Ongoing'}</span>
                            <span>•</span>
                            <span>{formatTime(sessionData?.startTime || '')} - {formatTime(sessionData?.endTime || '')}</span>
                            <span>•</span>
                            <span className="text-blue-400 font-mono">{formatElapsedTime(sessionTime)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleMic}
                        className={`p-4 rounded-2xl transition-all duration-300 shadow-xl ${isMuted ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button
                        onClick={toggleCamera}
                        className={`p-4 rounded-2xl transition-all duration-300 shadow-xl ${isCameraOff ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                    >
                        {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                    <button
                        onClick={toggleScreenShare}
                        className={`p-4 rounded-2xl transition-all duration-300 shadow-xl ${isSharingScreen ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                        title={isSharingScreen ? "Stop Screen Share" : "Share Screen"}
                    >
                        <Monitor size={24} />
                    </button>

                    <div className="w-px h-10 bg-white/10 mx-2" />

                    <button
                        onClick={toggleRecording}
                        className={`p-4 rounded-2xl transition-all duration-300 border ${isRecording ? 'border-red-500 text-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title={isRecording ? "Stop Recording" : "Record Session"}
                    >
                        <Radio size={24} className={isRecording ? 'animate-pulse' : ''} />
                    </button>

                    <button
                        onClick={() => setHasRaisedHand(!hasRaisedHand)}
                        className={`p-4 rounded-2xl transition-all duration-300 border ${hasRaisedHand ? 'bg-amber-500 text-white shadow-amber-500/20 border-amber-500' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        title="Raise Hand"
                    >
                        <Hand size={24} fill={hasRaisedHand ? "currentColor" : "none"} />
                    </button>

                    <div className="relative" ref={leaveMenuRef}>
                        <button
                            onClick={() => setIsLeaveMenuOpen(!isLeaveMenuOpen)}
                            className="p-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold flex items-center gap-2 hover:from-red-700 hover:to-red-800 transition-all shadow-xl shadow-red-600/20 ml-4 group"
                        >
                            <PhoneOff size={20} className="group-hover:rotate-[135deg] transition-transform duration-500" />
                            Leave
                        </button>

                        <AnimatePresence>
                            {isLeaveMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full mb-4 right-0 w-64 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-2 z-50"
                                >
                                    <button
                                        onClick={() => {
                                            if (confirm("Are you sure you want to leave the session?")) router.push('/admin/super/courses');
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group"
                                    >
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            <PhoneOff size={18} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold">Leave Meeting</div>
                                            <div className="text-[10px] text-slate-500">Only you will leave the session</div>
                                        </div>
                                    </button>

                                    {currentUser.isAdmin && (
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to end the meeting for everyone?")) router.push('/admin/super/courses');
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all mt-1 group"
                                        >
                                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                <X size={18} fill="currentColor" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold">End Meeting for All</div>
                                                <div className="text-[10px] text-red-500/60 uppercase font-black tracking-tighter">Admin Only</div>
                                            </div>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 w-1/4">
                    <button
                        onClick={() => setActiveSidebar(activeSidebar === 'recordings' ? null : 'recordings')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebar === 'recordings' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Video size={16} />
                        Archive
                    </button>
                    <button
                        onClick={() => setActiveSidebar(activeSidebar === 'participants' ? null : 'participants')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebar === 'participants' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Users size={16} />
                        <span>{participants.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveSidebar(activeSidebar === 'chat' ? null : 'chat')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${activeSidebar === 'chat' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <MessageSquare size={16} />
                        Chat
                        {messages.length > 0 && !activeSidebar && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#080808]" />
                        )}
                    </button>
                </div>
            </footer>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
            {/* Premium Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && confirmModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-[#0f1115] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                                <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{confirmModal.title}</h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                {confirmModal.message}
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className="flex-1 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Media Permission Denied Modal */}
            <AnimatePresence>
                {mediaPermissionError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="w-full max-w-lg bg-[#0f1115] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 mx-auto">
                                <VideoOff size={40} className="text-red-500" />
                            </div>

                            <div className="text-center mb-10">
                                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Camera & Mic Blocked</h3>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    We couldn't access your camera or microphone. This usually happens if you clicked <span className="text-red-400 font-bold italic">"Block"</span> in your browser's permission prompt.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-center">
                                <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">How to fix this:</h4>
                                <ol className="text-sm text-slate-300 space-y-3 text-left max-w-[300px] mx-auto">
                                    <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                                        <span>Click the <span className="font-bold text-white">Camera/Padlock icon</span> in your browser address bar.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                                        <span>Change Camera & Mic from <span className="text-red-400 font-bold">Block</span> to <span className="text-emerald-400 font-bold">Allow</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</div>
                                        <span>Refresh this page to join the session.</span>
                                    </li>
                                </ol>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-5 rounded-[24px] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98]"
                            >
                                I've enabled it, Refresh Now
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Toast notifications */}
            <AnimatePresence>
                {toast && (
                    <Toast status={toast} onClose={() => setToast(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
