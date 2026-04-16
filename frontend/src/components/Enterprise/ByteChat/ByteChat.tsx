"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Hash, User, MessageSquare,
    Video, Phone, MoreVertical, Send, Paperclip,
    Smile, Star, Pin, Reply, Globe, Bot,
    BarChart3, Users, Volume2, Mic, Settings,
    CheckCircle2, Clock, Shield, Image as ImageIcon,
    FileText, Download, X, Maximize2, Home,
    Layers, Zap, Bell, ChevronDown, AtSign,
    Command, SendHorizontal, Edit3,
    Activity, CornerDownRight, Camera, Circle, StopCircle, BrainCircuit,
    Briefcase, LogOut, Info, Trash2, Share2, Mail, MicOff, VideoOff, Monitor, ScreenShare, ScreenShareOff, StopCircle as StopIcon
} from 'lucide-react';

type DashboardRole = 'super_admin' | 'admin';

interface Message {
    id: string;
    _id?: string;
    senderId: string;
    senderName: string;
    senderImage?: string;
    text: string;
    timestamp: Date;
    type: 'TEXT' | 'FILE' | 'AI' | 'SYSTEM' | 'IMAGE' | 'VIDEO' | 'AUDIO';
    status: 'SENT' | 'DELIVERED' | 'SEEN';
    reactions?: { emoji: string; count: number }[];
    isPinned?: boolean;
    fileName?: string;
    fileSize?: string;
    parentMessage?: {
        sender?: { fullName: string };
        text: string;
        type: 'TEXT' | 'FILE' | 'AI' | 'SYSTEM' | 'IMAGE' | 'VIDEO' | 'AUDIO';
        fileName?: string;
    };
}

interface ChatItem {
    id: string;
    name: string;
    image?: string;
    type: 'CHANNEL' | 'GROUP' | 'DIRECT' | 'BROADCAST' | 'TEAM';
    lastMessage: string;
    time: string;
    unread?: number;
    status?: 'ONLINE' | 'OFFLINE' | 'AWAY';
    category: 'OFFICIAL' | 'CHANNELS' | 'TEAM' | 'SYSTEM' | 'DIRECT';
    participants: any[];
    isArchived: boolean;
}

export default function ByteChat({ role = 'super_admin' }: { role?: DashboardRole }) {
    const router = useRouter();
    const pathname = usePathname();
    const baseRoute = role === 'admin' ? '/admin' : '/super-admin';
    const [isMounted, setIsMounted] = useState(false);
    const [chats, setChats] = useState<ChatItem[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [newChatType, setNewChatType] = useState('GROUP');
    const [newChatCategory, setNewChatCategory] = useState('CHANNELS');
    const [activeDetailTab, setActiveDetailTab] = useState<'OVERVIEW' | 'MEMBERS'>('OVERVIEW');
    const [participants, setParticipants] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [isDeletingMessage, setIsDeletingMessage] = useState<Message | null>(null);
    const [isForwardingMessage, setIsForwardingMessage] = useState<Message | null>(null);
    const [forwardSearch, setForwardSearch] = useState('');
    const [mediaPickerTab, setMediaPickerTab] = useState<'EMOJI' | 'GIF' | 'STICKER'>('EMOJI');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeChatRef = useRef<string | null>(null);
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<'WAITING' | 'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');
    const [callType, setCallType] = useState<'AUDIO' | 'VIDEO'>('AUDIO');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [isLocalCameraOff, setIsLocalCameraOff] = useState(false);
    const [callTimer, setCallTimer] = useState(0);
    const [activeCallId, setActiveCallId] = useState<string | null>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [emailData, setEmailData] = useState({ 
        recipients: [] as any[], // { id, name, email, selected: boolean }
        subject: 'ByteChat: Organizational Correspondence', 
        body: '' 
    });
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editedChatName, setEditedChatName] = useState('');
    const [editedChatImage, setEditedChatImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isAudioRecording, setIsAudioRecording] = useState(false);
    const [audioTimer, setAudioTimer] = useState(0);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [videoTimer, setVideoTimer] = useState(0);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const callVideoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const API_BASE = 'http://localhost:8080/api/chat';

    // Helper to check if message is from current user
    const isMessageFromCurrentUser = (senderId: string | null | undefined): boolean => {
        if (!senderId || !currentUser) return false;
        const senderIdStr = senderId.toString().trim();
        const currentIdStr = (currentUser?.id || currentUser?._id)?.toString().trim();
        return senderIdStr === currentIdStr && senderIdStr.length > 0;
    };

    const fetchChats = async () => {
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error('Failed to fetch chats');
            const data = await res.json();
            const formatted = data.map((c: any) => {
                let chatName = c.name;
                if (c.type === 'DIRECT' && currentUser) {
                    const other = c.participants?.find((p: any) => (p._id || p) !== (currentUser.id || currentUser._id));
                    if (other && typeof other === 'object') chatName = other.fullName;
                }

                return {
                    id: c._id,
                    name: chatName || 'Personal Chat',
                    image: c.image,
                    type: c.type,
                    lastMessage: c.lastMessage?.text || 'No messages yet...',
                    time: c.lastMessage?.timestamp ? new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                    unread: 0,
                    category: c.type === 'DIRECT' ? 'DIRECT' : (c.category || 'CHANNELS'),
                    status: 'ONLINE',
                    participants: c.participants,
                    isArchived: !!c.isArchived
                };
            });
            setChats(formatted);
            if (!activeChat && formatted.length > 0) setActiveChat(formatted[0].id);

            // Sync activeChatRef
            if (activeChat) activeChatRef.current = activeChat;

            // Sync participants if we have an active chat
            if (activeChat) {
                const found = formatted.find((c: any) => c.id === activeChat);
                if (found) setParticipants(found.participants || []);
            }
        } catch (err) {
            console.error('Chat fetch error:', err);
        }
    };

    const fetchMessages = async (chatId: string) => {
        if (!chatId) return;
        try {
            const res = await fetch(`${API_BASE}/${chatId}/messages`);
            if (!res.ok) {
                console.error(`Correspondence Fetch Error [Status: ${res.status}] for Hub: ${chatId}`);
                throw new Error('Failed to fetch messages');
            }
            const data = await res.json();
            console.log(`Resolved ${data.length} messages for Hub: ${chatId}`);
            const mapped: Message[] = data.map((msg: any) => {
                const sId = (msg.sender?._id || msg.sender?.id || msg.sender)?.toString();
                const curId = (currentUser?.id || currentUser?._id)?.toString();
                const isMe = sId === curId;
                const foundUser = allUsers.find(u => (u.id?.toString() === sId || u._id?.toString() === sId));

                // Prioritize sender object if it's populated with full user data
                const senderObj = typeof msg.sender === 'object' && msg.sender?._id ? msg.sender : foundUser;
                const resolvedSenderImage = isMe ? currentUser.profileImage : (senderObj?.profileImage || '');

                return {
                    id: msg._id || msg.id,
                    _id: msg._id || msg.id,
                    senderId: sId,
                    senderName: isMe ? (currentUser.fullName || currentUser.name || "You") : (senderObj?.fullName || 'Member'),
                    senderImage: resolvedSenderImage,
                    text: msg.text,
                    timestamp: new Date(msg.createdAt),
                    type: msg.type,
                    status: msg.status,
                    parentMessage: msg.parentMessage,
                    fileName: msg.fileName,
                    fileSize: msg.fileSize,
                    isPinned: msg.isPinned,
                    reactions: msg.reactions
                };
            });
            setMessages(mapped);
        } catch (err) {
            console.error('Fetch messages error:', err);
        }
    };

    const handleSendMessage = async (customText?: string, type: 'TEXT' | 'FILE' | 'AI' | 'IMAGE' | 'VIDEO' | 'AUDIO' = 'TEXT', fileData?: any) => {
        const textToSend = customText || messageInput;
        // Allow sending if there's text OR if it's a media/file type
        if (!textToSend.trim() && !['FILE', 'IMAGE', 'VIDEO'].includes(type)) return;
        if (!activeChat || !currentUser) return;

        try {
            const res = await fetch(`${API_BASE}/${activeChat}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: currentUser.id || currentUser._id,
                    text: textToSend,
                    type: type,
                    parentMessage: replyingTo?.id || replyingTo?._id,
                    ...(fileData && { fileName: fileData.name, fileSize: fileData.size })
                })
            });

            if (res.ok) {
                setMessageInput('');
                setReplyingTo(null);
                if (activeChat) fetchMessages(activeChat);
                fetchChats();
            } else {
                const errData = await res.json();
                alert(`Upload failed: ${errData.error || 'Server error'}`);
            }
        } catch (err) {
            console.error('Send error:', err);
            alert('Connection lost. Please check your file size or network.');
        }
    };

    const handleDeleteMessage = async (forEveryone: boolean) => {
        if (!isDeletingMessage) return;
        try {
            const res = await fetch(`${API_BASE}/messages/${isDeletingMessage.id || isDeletingMessage._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ forEveryone, userId: currentUser.id || currentUser._id })
            });
            if (res.ok) {
                setIsDeletingMessage(null);
                if (activeChat) fetchMessages(activeChat);
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1GB Limit (Enterprise Scaling)
        const MAX_SIZE = 1024 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            alert(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload files smaller than 1GB for optimal performance.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            let type: 'IMAGE' | 'VIDEO' | 'FILE' | 'AUDIO' = 'FILE';

            if (file.type.startsWith('image/')) type = 'IMAGE';
            else if (file.type.startsWith('video/')) type = 'VIDEO';
            else if (file.type.startsWith('audio/')) type = 'AUDIO';

            handleSendMessage(base64, type, { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
        };
        reader.readAsDataURL(file);
    };


    const handleDownload = (base64: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = base64;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleForwardMessage = async (targetChatId: string) => {
        if (!isForwardingMessage) return;
        try {
            const res = await fetch(`${API_BASE}/${targetChatId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: currentUser.id || currentUser._id,
                    text: `[Forwarded]: ${isForwardingMessage.text}`,
                    type: isForwardingMessage.type === 'TEXT' ? 'TEXT' : 'FILE',
                    ...(isForwardingMessage.fileName && { fileName: isForwardingMessage.fileName, fileSize: isForwardingMessage.fileSize })
                })
            });
            if (res.ok) {
                setIsForwardingMessage(null);
                alert('Message forwarded successfully!');
            }
        } catch (err) {
            console.error('Forward error:', err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setAllUsers(data);
        } catch (err) {
            console.error('User fetch error:', err);
        }
    };

    // Incoming Call Signaling Pipeline
    useEffect(() => {
        if (!currentUser || isCalling || incomingCall) return;
        
        const checkCalls = async () => {
            try {
                const res = await fetch(`${API_BASE}/calls/active/${currentUser.id || currentUser._id}`);
                const call = await res.json();
                if (call) setIncomingCall(call);
            } catch (err) { /* Silent polling */ }
        };

        const interval = setInterval(checkCalls, 4000);
        return () => clearInterval(interval);
    }, [currentUser, isCalling, incomingCall]);

    const initiateCall = async (type: 'AUDIO' | 'VIDEO') => {
        console.log(`Initiating ${type} call... Context:`, { activeChat, hasUser: !!currentUser });
        
        if (!activeChat || !currentUser) {
            alert('Please select a chat first to initiate a call.');
            return;
        }

        // 1. Instantly update UI for high-performance feel
        setCallType(type);
        setIsCalling(true);
        setCallStatus('WAITING');
        setCallTimer(0);
        
        try {
            const chatObj = chats.find(c => c.id === activeChat);
            if (!chatObj) throw new Error('Active chat not found in registry');

            const receiver = chatObj.participants?.find((p: any) => {
                const pid = typeof p === 'object' ? (p._id || p.id) : p;
                return pid !== (currentUser.id || currentUser._id);
            });

            if (!receiver) {
                console.warn('No receiver found for call. Defaulting to system signal.');
            }
            
            const res = await fetch(`${API_BASE}/calls`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: activeChat,
                    initiatorId: currentUser.id || currentUser._id,
                    receiverId: typeof receiver === 'object' ? (receiver._id || receiver.id) : (receiver || currentUser.id || currentUser._id),
                    type
                })
            });
            const data = await res.json();
            if (data._id) setActiveCallId(data._id);
        } catch (err) {
            console.error('Call Initiation Error:', err);
        }
    };

    // Bilateral Signaling Monitor (Detect Acceptance)
    useEffect(() => {
        if (!isCalling || !activeCallId || callStatus === 'CONNECTED') return;

        const monitorSignal = async () => {
            try {
                const res = await fetch(`${API_BASE}/calls/active/${currentUser.id || currentUser._id}`); // We reuse this or create a direct check
                // For simplicity, let's fetch the specific call status
                const callRes = await fetch(`${API_BASE}/calls/${activeCallId}`);
                const call = await callRes.json();
                
                if (call.status === 'ACTIVE') {
                    setCallStatus('CONNECTED');
                    console.log('Remote Participant Joined. Stream live.');
                } else if (call.status === 'REJECTED' || call.status === 'ENDED') {
                    setIsCalling(false);
                    setCallStatus('DISCONNECTED');
                    setActiveCallId(null);
                }
            } catch (err) { /* Silent monitor */ }
        };

        const interval = setInterval(monitorSignal, 3000);
        return () => clearInterval(interval);
    }, [isCalling, activeCallId, callStatus]);

    const handleCallAction = async (status: 'ACTIVE' | 'ENDED' | 'REJECTED') => {
        const id = activeCallId || incomingCall?._id;
        if (!id) return;
        
        try {
            await fetch(`${API_BASE}/calls/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (status === 'ACTIVE') {
                setIsCalling(true);
                setCallStatus('CONNECTED');
                setCallType(incomingCall.type);
                setActiveCallId(incomingCall._id);
                setIncomingCall(null);
            } else {
                // Industrial Resource Cleanup
                stopCamera();
                stopScreenShare();
                
                setIsCalling(false);
                setCallStatus('DISCONNECTED');
                setIncomingCall(null);
                setActiveCallId(null);
            }
        } catch (err) {
            console.error('Call Action Error:', err);
        }
    };

    const toggleScreenShare = async () => {
        setPermissionError(null);
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                if (callVideoRef.current) callVideoRef.current.srcObject = screenStream;
                setIsScreenSharing(true);
                
                screenStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare();
                };
            } catch (err: any) {
                if (err.name === 'NotAllowedError') {
                    setPermissionError('Screen capture access was denied. Please enable it in your browser to share your display.');
                }
                console.error('Screen Share Failed:', err);
            }
        } else {
            stopScreenShare();
        }
    };

    const toggleMic = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMicMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleLocalCamera = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsLocalCameraOff(!videoTrack.enabled);
            }
        }
    };

    const stopScreenShare = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        setIsScreenSharing(false);
        // Switch back to camera stream if in video call
        if (isCalling && callType === 'VIDEO' && streamRef.current && callVideoRef.current) {
            callVideoRef.current.srcObject = streamRef.current;
        }
    };

    const handleSendEmail = async () => {
        const activeRecipients = emailData.recipients.filter(r => r.selected).map(r => r.email);
        if (activeRecipients.length === 0) return alert('Please select at least one recipient.');
        
        setIsSendingEmail(true);
        try {
            const res = await fetch(`${API_BASE}/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    to: activeRecipients,
                    subject: emailData.subject, 
                    body: emailData.body 
                })
            });
            if (res.ok) {
                alert(`Organizational Email Dispatched to ${activeRecipients.length} members!`);
                setIsEmailModalVisible(false);
            }
        } catch (err) {
            console.error('Email Error:', err);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const openEmailHub = () => {
        const chatObj = chats.find(c => c.id === activeChat);
        if (!chatObj) return;

        const participantList = (chatObj.participants || []).filter((p: any) => {
            const pid = typeof p === 'object' ? (p._id || p.id) : p;
            return pid !== (currentUser.id || currentUser._id);
        }).map((p: any) => ({
            id: typeof p === 'object' ? (p._id || p.id) : p,
            name: typeof p === 'object' ? p.fullName : 'Member',
            email: typeof p === 'object' ? p.email : 'contact@bytecode.corp',
            selected: true
        }));
        
        const userName = currentUser?.fullName || currentUser?.name || 'ByteChat User';
        setEmailData({
            recipients: participantList,
            subject: `ByteChat: Following up on hub "${chatObj.name}"`,
            body: `Hi there,\n\nI'm reaching out regarding our discussion in the ${chatObj.name} hub on ByteChat.\n\nRegards,\n${userName}`
        });
        setIsEmailModalVisible(true);
    };

    const toggleRecipient = (id: string) => {
        setEmailData(prev => ({
            ...prev,
            recipients: prev.recipients.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
        }));
    };

    const toggleAllRecipients = (select: boolean) => {
        setEmailData(prev => ({
            ...prev,
            recipients: prev.recipients.map(r => ({ ...r, selected: select }))
        }));
    };

    useEffect(() => {
        setIsMounted(true);
        fetchChats();
        fetchAllUsers();

        const syncUser = async () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                const userId = parsed.id || parsed._id;
                
                // First set from localStorage
                const normalizedName = parsed.fullName || parsed.name || parsed.email || 'You';
                setCurrentUser({
                    ...parsed,
                    id: userId,
                    _id: userId,
                    fullName: normalizedName,
                    name: normalizedName
                });

                // Then fetch full profile from API to get all details (profileImage, etc)
                if (userId) {
                    try {
                        const res = await fetch(`http://localhost:8080/api/users/${userId}`);
                        if (res.ok) {
                            const fullProfile = await res.json();
                            const apiName = fullProfile.fullName || fullProfile.name || parsed.name || parsed.email || 'You';
                            const mergedUser = {
                                ...parsed,
                                ...fullProfile,
                                id: userId,
                                _id: userId,
                                fullName: apiName,
                                name: apiName
                            };
                            setCurrentUser(mergedUser);
                            // Update localStorage with full profile data
                            localStorage.setItem('user', JSON.stringify(mergedUser));
                        }
                    } catch (err) {
                        console.error('Failed to fetch user profile:', err);
                    }
                }
            }
        };

        syncUser();
        // Also listen for potential storage changes
        window.addEventListener('storage', syncUser);
        return () => {
            window.removeEventListener('storage', syncUser);
        };
    }, []);

    // Outside Click Handler for Emoji Picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsEmojiPickerVisible(false);
            }
        };

        if (isEmojiPickerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEmojiPickerVisible]);

    // Dedicated Call Timer Hook
    useEffect(() => {
        let timer: any;
        if (isCalling && callStatus === 'CONNECTED') {
            timer = setInterval(() => {
                setCallTimer(prev => prev + 1);
            }, 1000);
        } else {
            setCallTimer(0);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isCalling, callStatus]);

    // Video Recording Timer Hook
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => setVideoTimer(prev => prev + 1), 1000);
        } else {
            setVideoTimer(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);

    const startCamera = async () => {
        setPermissionError(null);
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream;
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setPermissionError('Camera/Microphone access was denied. Please enable permissions in your browser bar.');
            }
            console.error('Camera access denied:', err);
        }
    };

    // Sync Stream with Video Element
    useEffect(() => {
        if (isCameraActive && streamRef.current && videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = streamRef.current;
        }
    }, [isCameraActive]);

    // Call Stream Lifecycle Manager
    useEffect(() => {
        if (isCalling && callType === 'VIDEO') {
            const startCallStream = async () => {
                try {
                    setPermissionError(null);
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    streamRef.current = stream;
                    if (callVideoRef.current) callVideoRef.current.srcObject = stream;
                } catch (err: any) {
                    if (err.name === 'NotAllowedError') {
                        setPermissionError('Camera/Microphone access was denied. Please click the "Camera" icon in your browser address bar and select "Always allow" to go live.');
                    }
                    console.error('Call Stream Failed:', err);
                }
            };
            startCallStream();
        } else if (!isCalling && !isCameraActive) {
            stopCamera();
        }
    }, [isCalling, callType]);

    // Internal sync for call video element
    useEffect(() => {
        if (isCalling && callType === 'VIDEO' && streamRef.current && callVideoRef.current) {
            callVideoRef.current.srcObject = streamRef.current;
        }
    }, [isCalling, callType]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
        setIsRecording(false);
    };

    const startRecording = () => {
        if (!streamRef.current) return;
        const mediaRecorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                handleSendMessage(base64, 'VIDEO', { name: `Record_${Date.now()}.webm`, size: (blob.size / 1024).toFixed(1) + ' KB' });
            };
            reader.readAsDataURL(blob);
            stopCamera();
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const takePhoto = () => {
        if (!videoPreviewRef.current) return;
        const video = videoPreviewRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg');
            handleSendMessage(base64, 'IMAGE', { name: `Photo_${Date.now()}.jpg`, size: 'Captured' });
            stopCamera();
        }
    };

    // Audio Recording Logic
    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    handleSendMessage(base64, 'AUDIO', { name: `VoiceNote_${Date.now()}.webm`, size: (blob.size / 1024).toFixed(1) + ' KB' });
                };
                reader.readAsDataURL(blob);
                if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start();
            setIsAudioRecording(true);
            setAudioTimer(0);
        } catch (err) {
            console.error('Audio Access Failed:', err);
            alert('Unable to access microphone.');
        }
    };

    const stopAudioRecording = () => {
        if (mediaRecorderRef.current && isAudioRecording) {
            mediaRecorderRef.current.stop();
            setIsAudioRecording(false);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isAudioRecording) {
            interval = setInterval(() => setAudioTimer(prev => prev + 1), 1000);
        } else {
            setAudioTimer(0);
        }
        return () => clearInterval(interval);
    }, [isAudioRecording]);

    // Sync ref when state changes
    useEffect(() => {
        activeChatRef.current = activeChat;
        if (activeChat) fetchMessages(activeChat);
    }, [activeChat]);

    // Constant-size hook for polling
    useEffect(() => {
        if (!isMounted) return;

        const interval = setInterval(() => {
            const currentChat = activeChatRef.current;
            if (currentChat) {
                fetchMessages(currentChat);
                fetchChats();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [activeChat, isMounted]);



    const handleCreateChat = async () => {
        if (newChatType !== 'DIRECT' && !newChatName.trim()) {
            alert('Please enter a group name');
            return;
        }
        if (selectedMembers.length === 0) {
            alert('Please select at least one participant');
            return;
        }

        try {
            const payload = {
                name: newChatType === 'DIRECT' ? 'Private Chat' : newChatName,
                type: newChatType,
                category: newChatType === 'DIRECT' ? 'DIRECT' : newChatCategory,
                participants: [currentUser?.id || currentUser?._id, ...selectedMembers].filter(Boolean)
            };
            console.log('Creating Hub with payload:', payload);

            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const newChat = await res.json();
                setNewChatName('');
                setSelectedMembers([]);
                setIsCreateModalVisible(false);
                await fetchChats();
                setActiveChat(newChat._id || newChat.id);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to create hub'}`);
            }
        } catch (err) {
            console.error('Create chat error:', err);
        }
    };

    const fetchParticipants = async (chatId: string) => {
        if (!chatId || chatId === 'null') return;
        try {
            const res = await fetch(`${API_BASE}/${chatId}`);
            if (!res.ok) throw new Error('Failed to fetch participants');
            const data = await res.json();
            setParticipants(data.participants || []);
        } catch (err) {
            console.error('Participant fetch error:', err);
        }
    };

    const handleKickMember = async (userId: string) => {
        if (!activeChat) return;
        try {
            const res = await fetch(`${API_BASE}/${activeChat}/members/${userId}`, { method: 'DELETE' });
            if (res.ok) fetchParticipants(activeChat);
        } catch (err) {
            console.error('Kick error:', err);
        }
    };

    const handlePromoteAdmin = async (userId: string) => {
        if (!activeChat) return;
        try {
            const res = await fetch(`${API_BASE}/${activeChat}/admins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (res.ok) fetchParticipants(activeChat);
        } catch (err) {
            console.error('Admin promotion error:', err);
        }
    };

    useEffect(() => {
        if (isDetailsVisible && activeChat) fetchParticipants(activeChat);
    }, [isDetailsVisible, activeChat]);

    const handleArchiveChat = async () => {
        if (!activeChat) return;
        try {
            const res = await fetch(`${API_BASE}/${activeChat}/archive`, { method: 'PATCH' });
            if (res.ok) {
                await fetchChats();
                setIsDetailsVisible(false);
            }
        } catch (err) {
            console.error('Archive error:', err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('File selected:', file.name, file.size);
        const reader = new FileReader();
        reader.onloadstart = () => console.log('Starting file read...');
        reader.onloadend = () => {
            console.log('File read complete. Size:', (reader.result as string).length);
            setEditedChatImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateHub = async () => {
        if (!activeChat) return;
        setIsSaving(true);
        try {
            const res = await fetch(`${API_BASE}/${activeChat}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editedChatName, image: editedChatImage })
            });
            if (res.ok) {
                await fetchChats();
                setTimeout(() => {
                    setIsEditingDetails(false);
                    setIsSaving(false);
                }, 1000);
            } else {
                alert('Failed to save changes');
                setIsSaving(false);
            }
        } catch (err) {
            console.error('Update error:', err);
            setIsSaving(false);
        }
    };

    const handleDeleteHub = async () => {
        if (!activeChat || !confirm('Permanently delete this hub and all messages?')) return;
        try {
            const res = await fetch(`${API_BASE}/${activeChat}`, { method: 'DELETE' });
            if (res.ok) {
                setIsDetailsVisible(false);
                setActiveChat(null);
                fetchChats();
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    useEffect(() => {
        if (isDetailsVisible && activeChat) {
            fetchParticipants(activeChat);
            const chat = chats.find(c => c.id === activeChat);
            if (chat) {
                setEditedChatName(chat.name);
                setEditedChatImage(chat.image || '');
            }
        }
    }, [isDetailsVisible, activeChat, chats]);

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(109, 40, 217, 0.08)'
    };

    if (!isMounted) return <div style={{ background: '#fcfaff', height: '100vh' }} />;

    return (
        <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            background: '#fcfaff',
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#1e1b4b'
        }}>

            {/* PANEL 1: ICON STRIP */}
            <div style={{
                width: '72px',
                flexShrink: 0,
                background: '#ffffff',
                borderRight: '1px solid rgba(109, 40, 217, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 0',
                gap: '16px'
            }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, #6d28d9, #c026d3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(109, 40, 217, 0.2)',
                    marginBottom: '12px'
                }}>
                    <Zap size={22} color="#fff" />
                </div>
                {[
                    { icon: Home, route: `${baseRoute}` },
                    { icon: MessageSquare, route: `${baseRoute}/chat` },
                    { icon: BarChart3, route: `${baseRoute}/global-tracking` },
                    { icon: Users, route: `${baseRoute}/academic` },
                    { icon: Settings, route: `${baseRoute}/settings` }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        onClick={() => router.push(item.route)}
                        whileHover={{ scale: 1.15, backgroundColor: 'rgba(109, 40, 217, 0.1)' }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: '48px', height: '48px', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: item.route === pathname ? '#6d28d9' : '#94a3b8',
                            background: item.route === pathname ? 'rgba(109, 40, 217, 0.1)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <item.icon size={22} />
                    </motion.div>
                ))}
            </div>

            {/* PANEL 2: NAVIGATION NEXUS */}
            <div style={{
                width: '300px',
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.4)',
                borderRight: '1px solid rgba(109, 40, 217, 0.08)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>ByteChat</h2>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsCreateModalVisible(true)}
                            style={{ background: '#f5f3ff', color: '#6d28d9', padding: '6px', borderRadius: '10px', cursor: 'pointer' }}
                        >
                            <Plus size={16} />
                        </motion.div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <Search size={16} color="#94a3b8" />
                        <input placeholder="Search..." style={{ background: 'none', border: 'none', color: '#334155', outline: 'none', width: '100%', fontSize: '0.9rem', fontWeight: 600 }} />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
                    {['OFFICIAL', 'CHANNELS', 'TEAM', 'DIRECT'].map(cat => (
                        <div key={cat} style={{ marginBottom: '32px' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1.5px', padding: '0 12px', marginBottom: '12px' }}>{cat === 'DIRECT' ? 'PERSONAL' : cat}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chats.filter(c => c.category === cat && !c.isArchived).map(chat => (
                                    <motion.div
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat.id)}
                                        whileHover={{ backgroundColor: 'rgba(109, 40, 217, 0.03)' }}
                                        style={{
                                            padding: '12px', borderRadius: '18px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            background: activeChat === chat.id ? 'rgba(109, 40, 217, 0.08)' : 'transparent',
                                            border: activeChat === chat.id ? '1px solid rgba(109, 40, 217, 0.1)' : '1px solid transparent',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        <div style={{ width: 40, height: 40, borderRadius: '14px', background: activeChat === chat.id ? '#6d28d9' : '#fff', color: activeChat === chat.id ? '#fff' : '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.02)', border: '1px solid rgba(109, 40, 217, 0.05)', overflow: 'hidden' }}>
                                            {chat.image ? (
                                                <img src={chat.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                chat.type === 'DIRECT' ? <AtSign size={18} /> :
                                                    chat.type === 'CHANNEL' ? <Volume2 size={18} /> :
                                                        chat.type === 'GROUP' ? <Users size={18} /> : <Hash size={18} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: activeChat === chat.id ? '#6d28d9' : '#1e1b4b' }}>{chat.name}</span>
                                                <span style={{ fontSize: '0.55rem', color: '#94a3b8' }}>{chat.time}</span>
                                            </div>
                                            <p style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>{chat.lastMessage}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {chats.some(c => c.isArchived) && (
                        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(109, 40, 217, 0.05)', paddingTop: '20px' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1.5px', padding: '0 12px', marginBottom: '12px' }}>ARCHIVED</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chats.filter(c => c.isArchived).map(chat => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat.id)}
                                        style={{ padding: '12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: '10px', background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Layers size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{chat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PANEL 3: THE HEART (Main Chat) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {/* Header */}
                <div style={{ padding: '14px 32px', borderBottom: '1px solid rgba(109, 40, 217, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '14px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(109, 40, 217, 0.1)', overflow: 'hidden' }}>
                            {chats.find(c => c.id === activeChat)?.image ? (
                                <img src={chats.find(c => c.id === activeChat)?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                chats.find(c => c.id === activeChat)?.type === 'DIRECT' ? <AtSign size={20} color="#6d28d9" /> : <Hash size={20} color="#6d28d9" />
                            )}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{chats.find(c => c.id === activeChat)?.name || 'Select a Chat'}</h3>
                            <p style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} /> {participants.length} Active Members
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div className="action-circle-soft" onClick={() => initiateCall('AUDIO')} style={{ width: 36, height: 36 }}><Phone size={16} /></div>
                        <div className="action-circle-soft" onClick={() => initiateCall('VIDEO')} style={{ width: 36, height: 36 }}><Video size={16} /></div>
                        <div className="action-circle-soft" onClick={openEmailHub} style={{ width: 36, height: 36 }}><Mail size={16} /></div>
                        <div
                            className={`action-circle-soft ${isDetailsVisible ? 'active' : ''}`}
                            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                            style={{ width: 36, height: 36 }}
                        >
                            <Info size={16} />
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', background: 'radial-gradient(circle at 50% 50%, #fff, #fcfaff)' }}>
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            style={{
                                display: 'flex',
                                gap: '14px',
                                maxWidth: '85%',
                                alignSelf: isMessageFromCurrentUser(msg.senderId) ? 'flex-end' : 'flex-start',
                                flexDirection: isMessageFromCurrentUser(msg.senderId) ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{ width: 36, height: 36, borderRadius: '12px', background: msg.type === 'AI' ? '#f5f3ff' : '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-start', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                                {msg.type === 'AI' ? <BrainCircuit size={18} color="#6d28d9" /> : (
                                    msg.senderImage ? (
                                        <img src={msg.senderImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                            {msg.senderName?.[0] || 'U'}
                                        </div>
                                    )
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMessageFromCurrentUser(msg.senderId) ? 'flex-end' : 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px', padding: '0 4px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b' }}>{isMessageFromCurrentUser(msg.senderId) ? 'You' : msg.senderName}</span>
                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {msg.parentMessage && (
                                    <div style={{ fontSize: '0.7rem', color: '#6d28d9', background: 'rgba(109, 40, 217, 0.05)', padding: '6px 12px', borderRadius: '10px', marginBottom: '4px', borderLeft: '3px solid #6d28d9', maxWidth: '200px', cursor: 'pointer' }}>
                                        <p style={{ fontWeight: 800, marginBottom: '2px' }}>{msg.parentMessage.sender?.fullName || 'User'}</p>
                                        <p style={{ opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                                            {msg.parentMessage.type === 'TEXT' ? msg.parentMessage.text :
                                                msg.parentMessage.type === 'IMAGE' ? '[Image]' :
                                                    msg.parentMessage.type === 'VIDEO' ? '[Video]' :
                                                        msg.parentMessage.type === 'AUDIO' ? '[Audio]' :
                                                            `[File: ${msg.parentMessage.fileName}]`}
                                        </p>
                                    </div>
                                )}

                                <div
                                    className="message-bubble-silk group"
                                    style={{
                                        position: 'relative',
                                        padding: '12px 18px',
                                        background: isMessageFromCurrentUser(msg.senderId) ? 'linear-gradient(135deg, #6d28d9, #4f46e5)' : '#fff',
                                        color: isMessageFromCurrentUser(msg.senderId) ? '#fff' : '#334155',
                                        border: '1px solid rgba(109, 40, 217, 0.08)',
                                        fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.5',
                                        boxShadow: isMessageFromCurrentUser(msg.senderId) ? '0 10px 25px rgba(109, 40, 217, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                                        borderRadius: isMessageFromCurrentUser(msg.senderId)
                                            ? '20px 4px 20px 20px'
                                            : '4px 20px 20px 20px'
                                    }}
                                >
                                    {/* Action Hover */}
                                    <div className="message-actions" style={{ position: 'absolute', top: '-10px', right: isMessageFromCurrentUser(msg.senderId) ? 'none' : '-65px', left: isMessageFromCurrentUser(msg.senderId) ? '-65px' : 'none', display: 'flex', gap: '4px', zIndex: 10 }}>
                                        <button onClick={() => setReplyingTo(msg)} title="Reply" style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><CornerDownRight size={10} /></button>
                                        <button onClick={() => setIsForwardingMessage(msg)} title="Forward" style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><Share2 size={10} /></button>
                                        <button onClick={() => setIsDeletingMessage(msg)} title="Delete" style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '1px solid #fee2e2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><Trash2 size={10} /></button>
                                    </div>
                                    {msg.type === 'IMAGE' ? (
                                        <div style={{ position: 'relative' }}>
                                            <motion.img
                                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                src={msg.text}
                                                style={{ maxWidth: '280px', borderRadius: '12px', display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                                alt="Shared image"
                                            />
                                            <div onClick={() => handleDownload(msg.text, msg.fileName || 'image.png')} style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><Download size={14} color="#6d28d9" /></div>
                                        </div>
                                    ) : msg.type === 'VIDEO' ? (
                                        <div style={{ position: 'relative' }}>
                                            <video controls style={{ maxWidth: '320px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                                <source src={msg.text} />
                                            </video>
                                            <div onClick={() => handleDownload(msg.text, msg.fileName || 'video.mp4')} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><Download size={14} color="#6d28d9" /></div>
                                        </div>
                                    ) : msg.type === 'AUDIO' ? (
                                        <div style={{ padding: '4px', position: 'relative' }}>
                                            <audio controls style={{ width: '220px', height: '32px' }}>
                                                <source src={msg.text} />
                                            </audio>
                                            <div onClick={() => handleDownload(msg.text, msg.fileName || 'audio.mp3')} style={{ position: 'absolute', right: '-10px', top: '10px', background: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}><Download size={14} color="#6d28d9" /></div>
                                        </div>
                                    ) : msg.type === 'FILE' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px' }}>
                                            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}><FileText size={18} /></div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{msg.fileName}</p>
                                                <p style={{ fontSize: '0.6rem', opacity: 0.7 }}>{msg.fileSize} • ATTACHMENT</p>
                                            </div>
                                            <Download
                                                size={16}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDownload(msg.text, msg.fileName || 'download')}
                                            />
                                        </div>
                                    ) : msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '0 20px 20px', background: '#fff' }}>
                    {replyingTo && (
                        <div style={{ padding: '8px 16px', background: '#f5f3ff', borderRadius: '12px 12px 0 0', border: '1px solid rgba(109, 40, 217, 0.1)', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.75rem' }}>
                                <span style={{ fontWeight: 800, color: '#6d28d9' }}>Replying to {replyingTo.senderName}</span>
                                <p style={{ opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                    {replyingTo.type === 'TEXT' ? replyingTo.text :
                                        replyingTo.type === 'IMAGE' ? '🖼️ [Image]' :
                                            replyingTo.type === 'VIDEO' ? '🎥 [Video]' :
                                                replyingTo.type === 'AUDIO' ? '🎵 [Audio]' :
                                                    `📁 [File: ${replyingTo.fileName}]`}
                                </p>
                            </div>
                            <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><LogOut size={14} /></button>
                        </div>
                    )}

                    {isEmojiPickerVisible && (
                        <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '80px', left: '25px', background: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(30,27,75,0.2)', width: '340px', zIndex: 110, border: '1px solid rgba(109, 40, 217, 0.1)' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                {['EMOJI', 'GIF', 'STICKER'].map((tab: any) => (
                                    <button
                                        key={tab}
                                        onClick={() => setMediaPickerTab(tab)}
                                        style={{ flex: 1, padding: '8px', borderRadius: '12px', background: mediaPickerTab === tab ? '#f5f3ff' : 'none', border: 'none', fontSize: '0.7rem', fontWeight: 900, color: mediaPickerTab === tab ? '#6d28d9' : '#94a3b8', cursor: 'pointer' }}
                                    >{tab}</button>
                                ))}
                            </div>

                            <div style={{ height: '240px', overflowY: 'auto', display: 'grid', gridTemplateColumns: mediaPickerTab === 'EMOJI' ? 'repeat(7, 1fr)' : 'repeat(2, 1fr)', gap: '8px' }}>
                                {mediaPickerTab === 'EMOJI' ? (
                                    [
                                        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
                                        "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"
                                    ].map((emoji, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMessageInput(prev => prev + emoji)}
                                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', padding: '4px', cursor: 'pointer' }}
                                        >
                                            {emoji}
                                        </button>
                                    ))
                                ) : mediaPickerTab === 'GIF' ? (
                                    [
                                        { name: 'Excited', url: 'https://media.giphy.com/media/l0HlHFRbMa9FBKYzC/giphy.gif' },
                                        { name: 'Celebrating', url: 'https://media.giphy.com/media/lMameLqvT9Yp5XMcMW/giphy.gif' },
                                        { name: 'Cat Dance', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' },
                                        { name: 'Success', url: 'https://media.giphy.com/media/26u4lOMA8JKSvL9G8/giphy.gif' },
                                        { name: 'Wow', url: 'https://media.giphy.com/media/oYtVHSxngR3mo/giphy.gif' },
                                        { name: 'Laughing', url: 'https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif' },
                                        { name: 'Mind Blown', url: 'https://media.giphy.com/media/26ufdipLchakBUZi8/giphy.gif' },
                                        { name: 'Thank You', url: 'https://media.giphy.com/media/217t5u87kYIic/giphy.gif' }
                                    ].map((gif, idx) => (
                                        <div key={idx} onClick={() => { handleSendMessage(gif.url, 'IMAGE', { name: `${gif.name}.gif`, size: 'Curated GIF' }); setIsEmojiPickerVisible(false); }} style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', aspectRatio: '1.4' }}>
                                            <img src={gif.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={gif.name} />
                                        </div>
                                    ))
                                ) : (
                                    [
                                        { name: 'Cool Bear', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' },
                                        { name: 'Happy Dog', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069186.png' },
                                        { name: 'Love Cat', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069222.png' },
                                        { name: 'Funny Fox', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069178.png' },
                                        { name: 'Party Pig', url: 'https://cdn-icons-png.flaticon.com/512/3069/3069168.png' },
                                        { name: 'Super Star', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392461.png' }
                                    ].map((sticker, idx) => (
                                        <div key={idx} onClick={() => { handleSendMessage(sticker.url, 'IMAGE', { name: `${sticker.name}.png`, size: 'Sticker' }); setIsEmojiPickerVisible(false); }} style={{ padding: '8px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={sticker.url} style={{ width: '80%', height: '80%', objectFit: 'contain' }} alt={sticker.name} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

                    <div style={{
                        background: '#fcfaff',
                        border: '1px solid rgba(109, 40, 217, 0.1)',
                        borderRadius: '20px', padding: '8px 16px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <div className="input-tool" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px' }}><Paperclip size={16} /></div>
                            <div className="input-tool" onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)} style={{ padding: '6px' }}><Smile size={16} /></div>
                            <div className="input-tool" onClick={startCamera} style={{ padding: '6px' }}><Camera size={16} /></div>
                            <div className="input-tool" onClick={startAudioRecording} style={{ padding: '6px' }}><Mic size={16} /></div>
                        </div>
                        {isAudioRecording ? (
                            <div style={{ flex: 1, height: '40px', background: 'rgba(109,40,217,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1e1b4b', fontFamily: 'monospace' }}>
                                        {Math.floor(audioTimer / 60).toString().padStart(2, '0')}:{(audioTimer % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6d28d9', opacity: 0.8 }}>RECORDING AUDIO...</span>
                                    <button onClick={stopAudioRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800 }}>STOP & SEND</button>
                                </div>
                            </div>
                        ) : (
                            <input
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type something clever..."
                                style={{ flex: 1, background: 'none', border: 'none', color: '#1e1b4b', outline: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '10px 0' }}
                            />
                        )}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                                onClick={() => handleSendMessage()}
                                style={{
                                    padding: '8px 16px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #6d28d9, #4f46e5)',
                                    color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                                    cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem'
                                }}
                            >
                                SEND <Send size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PANEL 4: THE POPUP MODAL (Details) */}
            <AnimatePresence>
                {isDetailsVisible && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailsVisible(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(8px)' }}
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{
                                width: '100%',
                                maxWidth: '420px',
                                background: '#fff',
                                borderRadius: '40px',
                                padding: '40px',
                                position: 'relative',
                                boxShadow: '0 30px 60px -12px rgba(30, 27, 75, 0.25)',
                                border: '1px solid rgba(109, 40, 217, 0.1)',
                                zIndex: 1001,
                                overflow: 'hidden'
                            }}
                        >
                            <button
                                onClick={() => setIsDetailsVisible(false)}
                                style={{ position: 'absolute', top: '24px', right: '24px', padding: '8px', borderRadius: '50%', background: '#f5f3ff', border: 'none', cursor: 'pointer', color: '#6d28d9', zIndex: 10 }}
                            >
                                <X size={20} />
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {['OVERVIEW', 'MEMBERS'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveDetailTab(tab as any)}
                                            style={{
                                                background: 'none', border: 'none', padding: '12px 4px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                                                color: activeDetailTab === tab ? '#6d28d9' : '#94a3b8',
                                                borderBottom: activeDetailTab === tab ? '2px solid #6d28d9' : '2px solid transparent'
                                            }}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setIsEditingDetails(!isEditingDetails)}
                                    style={{ background: isEditingDetails ? '#6d28d9' : '#f5f3ff', color: isEditingDetails ? '#fff' : '#6d28d9', padding: '6px 14px', borderRadius: '10px', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    {isEditingDetails ? 'SAVE' : 'EDIT'}
                                </button>
                            </div>

                            {activeDetailTab === 'OVERVIEW' ? (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <div
                                            onClick={() => isEditingDetails && fileInputRef.current?.click()}
                                            style={{
                                                width: 100, height: 100, borderRadius: '35px',
                                                background: 'linear-gradient(135deg, #6d28d9, #c026d3)',
                                                margin: '0 auto 24px', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.25)',
                                                overflow: 'hidden', cursor: isEditingDetails ? 'pointer' : 'default',
                                                position: 'relative'
                                            }}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                            />
                                            {(editedChatImage || chats.find(c => c.id === activeChat)?.image) ? (
                                                <img
                                                    src={editedChatImage || chats.find(c => c.id === activeChat)?.image}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                                                    alt="Hub Preview"
                                                />
                                            ) : (
                                                <Hash size={45} color="#fff" style={{ pointerEvents: 'none' }} />
                                            )}
                                            {isEditingDetails && (
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}>
                                                    <Plus size={24} color="#fff" />
                                                    <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>CHOOSE PHOTO</span>
                                                </div>
                                            )}
                                        </div>

                                        {isEditingDetails ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textAlign: 'left', marginBottom: '6px' }}>HUB NAME</p>
                                                    <input
                                                        value={editedChatName}
                                                        onChange={(e) => setEditedChatName(e.target.value)}
                                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #6d28d9', fontSize: '1rem', fontWeight: 700 }}
                                                        placeholder="Group Name"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleUpdateHub}
                                                    disabled={isSaving}
                                                    style={{
                                                        background: isSaving ? '#94a3b8' : '#6d28d9',
                                                        color: '#fff', padding: '14px', borderRadius: '12px',
                                                        border: 'none', fontWeight: 800, cursor: isSaving ? 'default' : 'pointer',
                                                        marginTop: '10px', transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {isSaving ? 'SYNCING CHANGES...' : 'SAVE HUB DETAILS'}
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>{chats.find(c => c.id === activeChat)?.name}</h4>
                                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px', fontWeight: 600 }}>Operational Unit PDA-86</p>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ padding: '20px', border: '1px solid rgba(109, 40, 217, 0.1)', borderRadius: '24px', background: '#fcfaff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>ACTIVE ENGAGEMENT</p>
                                                <p style={{ fontSize: '1.2rem', fontWeight: 900 }}>98.2%</p>
                                            </div>
                                            <Zap size={24} color="#6d28d9" />
                                        </div>

                                        <div style={{ padding: '20px', border: '1px solid rgba(109, 40, 217, 0.1)', borderRadius: '24px', background: '#fff' }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px' }}>RECENT ASSETS</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} style={{ aspectRatio: '1', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {participants.map(p => (
                                        <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#fcfaff' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: p.profileImage ? 'none' : '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', overflow: 'hidden' }}>
                                                {p.profileImage ? <img src={p.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (p.fullName?.[0] || 'U')}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{p.fullName}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.email || p.role || 'Member'}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handlePromoteAdmin(p._id)} style={{ padding: '6px', borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Shield size={14} color="#6d28d9" /></button>
                                                <button onClick={() => handleKickMember(p._id)} style={{ padding: '6px', borderRadius: '8px', background: '#fff', border: '1px solid #fee2e2', cursor: 'pointer' }}><LogOut size={14} color="#ef4444" /></button>
                                            </div>
                                        </div>
                                    ))}
                                    <button style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#6d28d9', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', marginTop: '10px' }}>
                                        ADD MEMBER
                                    </button>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                                <button
                                    onClick={handleArchiveChat}
                                    style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    {chats.find(c => c.id === activeChat)?.isArchived ? 'UNARCHIVE' : 'ARCHIVE'}
                                </button>
                                <button
                                    onClick={() => setIsDetailsVisible(false)}
                                    style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#fff', color: '#6d28d9', border: '1px solid rgba(109, 40, 217, 0.2)', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    LEAVE
                                </button>
                                <button
                                    onClick={handleDeleteHub}
                                    style={{ flex: 1, padding: '16px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    DELETE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* NEW CHAT MODAL */}
            <AnimatePresence>
                {isCreateModalVisible && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalVisible(false)}
                            style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '32px', padding: '32px', position: 'relative', zIndex: 1 }}
                        >
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px' }}>Create New Hub</h3>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid rgba(109, 40, 217, 0.08)' }}>
                                {[{ id: 'GROUP', label: 'NEW GROUP', icon: <Users size={16} /> }, { id: 'DIRECT', label: 'DIRECT MESSAGE', icon: <User size={16} /> }].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setNewChatType(type.id as any);
                                            setSelectedMembers([]);
                                        }}
                                        style={{
                                            background: 'none', border: 'none', padding: '12px 4px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                                            color: newChatType === type.id ? '#6d28d9' : '#94a3b8',
                                            borderBottom: newChatType === type.id ? '2px solid #6d28d9' : '2px solid transparent',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        {type.icon} {type.label}
                                    </button>
                                ))}
                            </div>

                            {newChatType === 'GROUP' && (
                                <>
                                    <div style={{ marginBottom: '24px' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>GROUP NAME</p>
                                        <input
                                            value={newChatName}
                                            onChange={(e) => setNewChatName(e.target.value)}
                                            placeholder="Enter community name..."
                                            style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid rgba(109, 40, 217, 0.1)', background: '#fcfaff', fontSize: '0.9rem', fontWeight: 600 }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>HUB PURPOSE (CATEGORY)</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['CHANNELS', 'TEAM', 'OFFICIAL'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setNewChatCategory(cat as any)}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer',
                                                        background: newChatCategory === cat ? 'rgba(109, 40, 217, 0.1)' : '#f8fafc',
                                                        color: newChatCategory === cat ? '#6d28d9' : '#475569',
                                                        border: 'none', transition: '0.2s'
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>
                                {newChatType === 'GROUP' ? 'ADD MEMBERS' : 'SELECT RECIPIENT'}
                            </p>
                            <div style={{ height: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '30px' }}>
                                {allUsers.filter(u => (u._id || u.id) !== (currentUser?.id || currentUser?._id)).map(user => {
                                    const uId = user._id || user.id;
                                    const isSelected = selectedMembers.includes(uId);
                                    return (
                                        <div
                                            key={uId}
                                            onClick={() => {
                                                if (newChatType === 'DIRECT') {
                                                    setSelectedMembers([uId]);
                                                } else {
                                                    setSelectedMembers(prev => isSelected ? prev.filter(id => id !== uId) : [...prev, uId]);
                                                }
                                            }}
                                            style={{
                                                padding: '12px', borderRadius: '14px', cursor: 'pointer',
                                                background: isSelected ? 'rgba(109, 40, 217, 0.05)' : 'transparent',
                                                border: isSelected ? '1px solid rgba(109, 40, 217, 0.1)' : '1px solid transparent',
                                                display: 'flex', alignItems: 'center', gap: '12px'
                                            }}
                                        >
                                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', border: '1px solid rgba(109, 40, 217, 0.1)' }}>
                                                {(user.profileImage || user.image || user.avatar || user.photo) ? (
                                                    <img src={user.profileImage || user.image || user.avatar || user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                ) : (
                                                    user.fullName?.[0] || 'U'
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.fullName}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{user.email || user.role || 'Member'}</p>
                                            </div>
                                            {isSelected && <CheckCircle2 size={18} color="#6d28d9" />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setIsCreateModalVisible(false)} style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#f8fafc', border: 'none', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
                                <button
                                    onClick={handleCreateChat}
                                    style={{ flex: 2, padding: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.15)' }}
                                >
                                    {newChatType === 'GROUP' ? 'INITIALIZE HUB' : 'START PRIVATE CHAT'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {/* Delete Confirmation Modal */}
                {isDeletingMessage && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div onClick={() => setIsDeletingMessage(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fff', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>Delete Message?</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>This action cannot be undone. How would you like to delete this?</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button onClick={() => handleDeleteMessage(true)} style={{ padding: '12px', background: '#ef4444', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Delete for Everyone</button>
                                <button onClick={() => handleDeleteMessage(false)} style={{ padding: '12px', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Delete for Me</button>
                                <button onClick={() => setIsDeletingMessage(null)} style={{ padding: '12px', background: 'none', color: '#94a3b8', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Forwarding Modal */}
                {isForwardingMessage && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div onClick={() => setIsForwardingMessage(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: '#fff', borderRadius: '32px', padding: '32px', width: '100%', maxWidth: '440px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.2)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Distribution Hub</h3>
                                <button onClick={() => setIsForwardingMessage(null)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}><X size={18} /></button>
                            </div>

                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
                                <input
                                    type="text"
                                    placeholder="Search hubs or members..."
                                    value={forwardSearch}
                                    onChange={(e) => setForwardSearch(e.target.value)}
                                    style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '16px', border: '1px solid rgba(109,40,217,0.1)', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                                {chats
                                    .filter(c => c.id !== activeChat && c.name.toLowerCase().includes(forwardSearch.toLowerCase()))
                                    .map(chat => (
                                        <div
                                            key={chat.id}
                                            onClick={() => handleForwardMessage(chat.id)}
                                            style={{ padding: '12px 16px', borderRadius: '18px', background: '#f8fafc', border: '1px solid rgba(109,40,217,0.03)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: '0.2s' }}
                                            className="forward-item"
                                        >
                                            <div style={{
                                                width: 38, height: 38, borderRadius: '12px',
                                                background: chat.type === 'CHANNEL' ? 'rgba(109,40,217,0.1)' : chat.type === 'TEAM' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                                                color: chat.type === 'CHANNEL' ? '#6d28d9' : chat.type === 'TEAM' ? '#10b981' : '#6366f1',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800
                                            }}>
                                                {chat.type === 'CHANNEL' ? '#' : chat.type === 'TEAM' ? <Users size={16} /> : chat.name[0]}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 800, color: '#1e1b4b', fontSize: '0.9rem' }}>{chat.name}</p>
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{chat.type}</p>
                                            </div>
                                            <SendHorizontal size={16} color="#6d28d9" style={{ opacity: 0.4 }} />
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CAMERA & VIDEO RECORDING MODAL */}
            <AnimatePresence>
                {isCameraActive && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={stopCamera} style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.9)', backdropFilter: 'blur(10px)' }} />

                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} style={{ position: 'relative', background: '#000', borderRadius: '40px', overflow: 'hidden', width: '100%', maxWidth: '640px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <video ref={videoPreviewRef} autoPlay muted playsInline style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />

                            {isRecording && (
                                <div style={{ position: 'absolute', top: '30px', left: '30px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.8)', padding: '8px 16px', borderRadius: '50px', backdropFilter: 'blur(5px)', zIndex: 10 }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
                                    <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px' }}>
                                        {Math.floor(videoTimer / 60).toString().padStart(2, '0')}:{(videoTimer % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            )}

                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '40px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', justifyContent: 'center', gap: '30px', zIndex: 10 }}>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={stopCamera} style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}><X size={24} color="#fff" /></motion.div>

                                {!isRecording ? (
                                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={takePhoto} style={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }} title="Capture Photo"><ImageIcon size={24} color="#fff" /></motion.div>

                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={startRecording} style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 30px rgba(255,255,255,0.3)' }} title="Start Recording">
                                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ef4444' }} />
                                        </motion.div>
                                    </div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={stopRecording} style={{ width: 80, height: 80, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }} title="Stop Recording">
                                        <StopCircle size={40} color="#fff" />
                                    </motion.div>
                                )}

                                <div style={{ width: 60, height: 60 }} /> {/* Spacer */}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* INCOMING CALL SIGNAL */}
            <AnimatePresence>
                {incomingCall && (
                    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 7000 }}>
                        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: '#fff', padding: '24px', borderRadius: '32px', boxShadow: '0 30px 60px rgba(30,27,75,0.25)', border: '1px solid rgba(109,40,217,0.1)', display: 'flex', alignItems: 'center', gap: '20px', minWidth: '320px' }}>
                            <div style={{ width: 56, height: 56, borderRadius: '20px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={incomingCall.initiator?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e1b4b' }}>{incomingCall.initiator?.fullName}</p>
                                <p style={{ fontSize: '0.7rem', color: '#6d28d9', fontWeight: 700, letterSpacing: '1px' }}>INCOMING {incomingCall.type} CALL...</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <motion.div whileTap={{ scale: 0.9 }} onClick={() => handleCallAction('REJECTED')} style={{ width: 44, height: 44, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></motion.div>
                                <motion.div whileTap={{ scale: 0.9 }} onClick={() => handleCallAction('ACTIVE')} style={{ width: 44, height: 44, borderRadius: '50%', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={18} /></motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* EMAIL CORRESPONDENCE MODAL */}
            <AnimatePresence>
                {isEmailModalVisible && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 6500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsEmailModalVisible(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(10px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} style={{ position: 'relative', background: '#fff', borderRadius: '40px', width: '100%', maxWidth: '600px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1b4b' }}>Dispatch Correspondence</h2>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Professional context-aware electronic mail.</p>
                                </div>
                                <button onClick={() => setIsEmailModalVisible(false)} style={{ background: '#f8fafc', border: 'none', padding: '12px', borderRadius: '16px', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6d28d9', letterSpacing: '1px', textTransform: 'uppercase' }}>Recipients ({emailData.recipients.filter(r => r.selected).length})</label>
                                        {emailData.recipients.length > 1 && (
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button onClick={() => toggleAllRecipients(true)} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>SELECT ALL</button>
                                                <button onClick={() => toggleAllRecipients(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer' }}>NONE</button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '16px', maxHeight: '180px', overflowY: 'auto', border: '1px solid rgba(109,40,217,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {emailData.recipients.length > 0 ? emailData.recipients.map((r: any) => (
                                            <div 
                                                key={r.id} 
                                                onClick={() => toggleRecipient(r.id)}
                                                style={{ padding: '10px 16px', borderRadius: '14px', background: r.selected ? '#eeebff' : '#fff', border: '1px solid', borderColor: r.selected ? '#6d28d9' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.2s' }}
                                            >
                                                <div style={{ width: 18, height: 18, borderRadius: '6px', border: '2px solid #6d28d9', background: r.selected ? '#6d28d9' : 'transparent', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {r.selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{r.name}</p>
                                                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{r.email}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>No other members in this hub.</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6d28d9', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Subject</label>
                                    <input value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(109,40,217,0.1)', fontSize: '1rem', fontWeight: 700, color: '#1e1b4b', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6d28d9', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Message Body</label>
                                    <textarea rows={6} value={emailData.body} onChange={(e) => setEmailData({...emailData, body: e.target.value})} style={{ width: '100%', padding: '20px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(109,40,217,0.1)', fontSize: '1rem', fontWeight: 600, color: '#334155', outline: 'none', resize: 'none' }} />
                                </div>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={handleSendEmail}
                                    disabled={isSendingEmail}
                                    style={{ width: '100%', padding: '20px', borderRadius: '20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(109,40,217,0.3)' }}
                                >
                                    {isSendingEmail ? 'DISPATCHING...' : <>SEND CORRESPONDENCE <Mail size={18} /></>}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CINEMATIC TELECOMMUNICATION OVERLAY (v3) */}
            <AnimatePresence>
                {isCalling && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)', backdropFilter: 'blur(30px)' }} 
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                        >
                            {/* Visual Layer */}
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {callType === 'VIDEO' ? (
                                    <video ref={callVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <motion.div 
                                            animate={{ boxShadow: ['0 0 0px 0px rgba(109,40,217,0)', '0 0 100px 20px rgba(109,40,217,0.3)', '0 0 0px 0px rgba(109,40,217,0)'] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            style={{ width: 220, height: 220, borderRadius: '80px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', overflow: 'hidden', position: 'relative' }}
                                        >
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(109,40,217,0.2), transparent)' }} />
                                            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Identity" />
                                        </motion.div>
                                        <div style={{ textAlign: 'center' }}>
                                            <h2 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '12px' }}>
                                                {(() => {
                                                    const chatObj = chats.find(c => c.id === activeChat);
                                                    if (!chatObj) return 'Organizational Member';
                                                    if (chatObj.type === 'DIRECT') {
                                                        const pId = chatObj.participants?.find((p: any) => {
                                                            const id = (typeof p === 'object' ? (p._id || p.id) : p)?.toString();
                                                            return id !== (currentUser.id || currentUser._id)?.toString();
                                                        });
                                                        const p = typeof pId === 'object' ? pId : allUsers.find(u => (u._id || u.id)?.toString() === pId?.toString());
                                                        return p?.fullName || p?.name || 'Member';
                                                    }
                                                    return chatObj.name;
                                                })()}
                                            </h2>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: callStatus === 'CONNECTED' ? '#10b981' : '#f59e0b', boxShadow: '0 0 15px currentColor' }} />
                                                <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, letterSpacing: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                                    {callStatus === 'CONNECTED' ? (isScreenSharing ? 'SCREEN BROADCAST LIVE' : 'SECURE LINE ACTIVE') : 'ESTABLISHING HANDSHAKE...'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Floating Action Nexus */}
                            <div style={{ position: 'absolute', bottom: '60px', left: '0', right: '0', display: 'flex', justifyContent: 'center', padding: '0 40px', zIndex: 100 }}>
                                <motion.div 
                                    initial={{ y: 100 }} animate={{ y: 0 }}
                                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(40px)', padding: '24px 40px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
                                >
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} 
                                        onClick={toggleMic}
                                        style={{ background: isMicMuted ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: '0.3s' }}
                                    >
                                        {isMicMuted ? <MicOff size={28} /> : <Mic size={28} />}
                                    </motion.button>
                                    
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} 
                                        onClick={toggleScreenShare}
                                        style={{ background: isScreenSharing ? '#6d28d9' : 'rgba(255,255,255,0.1)', border: 'none', width: 64, height: 64, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: '0.3s' }}
                                    >
                                        {isScreenSharing ? <Monitor size={28} /> : <ScreenShare size={28} />}
                                    </motion.button>

                                    <motion.button 
                                        whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} 
                                        onClick={() => handleCallAction('ENDED')}
                                        style={{ background: '#ef4444', border: 'none', width: 80, height: 80, borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)' }}
                                    >
                                        <Phone size={36} style={{ transform: 'rotate(135deg)' }} />
                                    </motion.button>

                                    <motion.button 
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} 
                                        onClick={toggleLocalCamera}
                                        style={{ background: isLocalCameraOff ? '#ef4444' : 'rgba(255,255,255,0.1)', border: 'none', width: 56, height: 56, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: '0.3s' }}
                                    >
                                        {isLocalCameraOff ? <VideoOff size={28} /> : <Video size={28} />}
                                    </motion.button>
                                    
                                    <motion.div style={{ color: '#fff', fontWeight: 900, minWidth: '80px', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '1px' }}>
                                        {callStatus === 'CONNECTED' ? (
                                            `${Math.floor(callTimer / 60).toString().padStart(2, '0')}:${(callTimer % 60).toString().padStart(2, '0')}`
                                        ) : (
                                            '00:00'
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* PERMISSION ERROR SHIELD */}
                            {permissionError && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    style={{ position: 'absolute', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
                                >
                                    <div style={{ maxWidth: '400px', textAlign: 'center' }}>
                                        <div style={{ width: 80, height: 80, borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                            <Camera size={32} color="#ef4444" />
                                        </div>
                                        <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Access Required</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, lineHeight: 1.6, marginBottom: '32px' }}>
                                            {permissionError}
                                        </p>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={() => setPermissionError(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>DISMISS</button>
                                            <button onClick={() => { setPermissionError(null); startCamera(); }} style={{ flex: 2, padding: '16px', borderRadius: '16px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>RETRY ACCESS</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Status Header */}
                            <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 100 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(0,0,0,0.4)', padding: '12px 24px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BrainCircuit size={20} color="#fff" />
                                    </div>
                                    <div>
                                        <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900 }}>ByteChat Industrial</p>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            {(() => {
                                                const chatObj = chats.find(c => c.id === activeChat);
                                                if (chatObj?.type === 'DIRECT') {
                                                    const pId = chatObj.participants?.find((p: any) => {
                                                        const id = (typeof p === 'object' ? (p._id || p.id) : p)?.toString();
                                                        return id !== (currentUser.id || currentUser._id)?.toString();
                                                    });
                                                    const p = typeof pId === 'object' ? pId : allUsers.find(u => (u._id || u.id)?.toString() === pId?.toString());
                                                    return `ENCRYPTED: ${p?.fullName || p?.name || 'MEMBER'}`;
                                                }
                                                return 'PDA-CORP SIG-9';
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .action-circle-soft {
                    width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    background: transparent; color: #94a3b8; cursor: pointer; transition: 0.2s;
                }
                .action-circle-soft:hover { background: #f5f3ff; color: #6d28d9; }
                .input-tool {
                    color: #94a3b8; cursor: pointer; padding: 10px; border-radius: 12px; transition: 0.2s;
                }
                .input-tool:hover { background: #f5f3ff; color: #6d28d9; }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin { animation: spin 1s linear infinite; }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: rgba(109, 40, 217, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}
