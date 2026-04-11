"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Plus, Hash, User, MessageSquare, 
    Video, Phone, MoreVertical, Send, Paperclip, 
    Smile, Star, Pin, Reply, Globe, Bot, 
    BarChart3, Users, Volume2, Mic, Settings,
    CheckCircle2, Clock, Shield, Image as ImageIcon,
    FileText, Download, X, Maximize2, Home, 
    Layers, Zap, Bell, ChevronDown, AtSign, 
    Command, Sparkles, SendHorizontal, Edit3,
    Activity, Cpu, BrainCircuit, CornerDownRight,
    Briefcase, LogOut, Info, Trash2, Share2
} from 'lucide-react';

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

export default function ByteChat() {
    const router = useRouter();
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
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [isDeletingMessage, setIsDeletingMessage] = useState<Message | null>(null);
    const [isForwardingMessage, setIsForwardingMessage] = useState<Message | null>(null);
    const [forwardSearch, setForwardSearch] = useState('');
    const [mediaPickerTab, setMediaPickerTab] = useState<'EMOJI' | 'GIF' | 'STICKER'>('EMOJI');
    const [isAIMenuVisible, setIsAIMenuVisible] = useState(false);
    const [aiPromptModal, setAIPromptModal] = useState<{ visible: boolean, action: 'PROFESSIONAL' | 'GRAMMAR' | 'FUNNY' | 'IMAGE' | null }>({ visible: false, action: null });
    const [aiPromptText, setAIPromptText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeChatRef = useRef<string | null>(null);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editedChatName, setEditedChatName] = useState('');
    const [editedChatImage, setEditedChatImage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_BASE = 'http://localhost:8080/api/chat';

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
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            const mapped: Message[] = data.map((msg: any) => {
                const sId = (msg.sender?._id || msg.sender)?.toString();
                const curId = (currentUser?.id || currentUser?._id)?.toString();
                const isMe = sId === curId;
                const foundUser = allUsers.find(u => (u.id?.toString() === sId || u._id?.toString() === sId));
                
                return {
                    id: msg._id || msg.id,
                    _id: msg._id || msg.id,
                    senderId: sId,
                    senderName: isMe ? (currentUser.fullName || currentUser.name || "You") : (msg.sender?.fullName || foundUser?.fullName || 'Member'),
                    senderImage: isMe ? currentUser.profileImage : (msg.sender?.profileImage || foundUser?.profileImage),
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

    const handleAIWrite = (action: 'PROFESSIONAL' | 'GRAMMAR' | 'FUNNY' | 'IMAGE', customPrompt?: string) => {
        const inputToUse = customPrompt || messageInput;
        if (!inputToUse.trim()) {
            setAIPromptModal({ visible: true, action });
            setAIPromptText(messageInput);
            return;
        }
        setIsGeneratingAI(true);
        setIsAIMenuVisible(false);
        setAIPromptModal({ visible: false, action: null });

        setTimeout(() => {
            let result = '';
            if (action === 'PROFESSIONAL') {
                result = `[Professional]: ${inputToUse}. We request your immediate review and feedback on this matter. Regards.`;
                setMessageInput(result);
            } else if (action === 'GRAMMAR') {
                result = `[Corrected]: ${inputToUse.charAt(0).toUpperCase() + inputToUse.slice(1).replace(/([?!.,])\s*/g, '$1 ')}`;
                setMessageInput(result);
            } else if (action === 'FUNNY') {
                result = `[Funny]: Guys, listen up! 🚀 ${inputToUse} - Let's get it done! Cheers! 🎉`;
                setMessageInput(result);
            } else if (action === 'IMAGE') {
                const keywords = inputToUse.split(' ').slice(0, 3).join(',');
                const mockImageUrl = `https://images.unsplash.com/photo-1512446816042-4412c7c12500?auto=format&fit=crop&q=80&w=800&keywords=${keywords}`;
                handleSendMessage(mockImageUrl, 'IMAGE', { name: 'AI_Generated.png', size: 'AI Visual' });
                setMessageInput('');
            }
            setIsGeneratingAI(false);
            setAIPromptText('');
        }, 1500);
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

    useEffect(() => {
        setIsMounted(true);
        fetchChats();
        fetchAllUsers();

        const syncUser = () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setCurrentUser(parsed);
            }
        };

        syncUser();
        // Also listen for potential storage changes
        window.addEventListener('storage', syncUser);
        return () => window.removeEventListener('storage', syncUser);
    }, []);

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
                    { icon: Home, route: '/super-admin' },
                    { icon: MessageSquare, route: '/super-admin/chat' },
                    { icon: BarChart3, route: '/super-admin/global-tracking' },
                    { icon: Users, route: '/super-admin/academic' },
                    { icon: Settings, route: '/super-admin/settings' }
                ].map((item, i) => (
                    <motion.div 
                        key={i} 
                        onClick={() => router.push(item.route)}
                        whileHover={{ scale: 1.15, backgroundColor: 'rgba(109, 40, 217, 0.1)' }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: '48px', height: '48px', borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: item.route === '/super-admin/chat' ? '#6d28d9' : '#94a3b8',
                            background: item.route === '/super-admin/chat' ? 'rgba(109, 40, 217, 0.1)' : 'transparent',
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
                        <div className="action-circle-soft" style={{ width: 36, height: 36 }}><Phone size={16} /></div>
                        <div className="action-circle-soft" style={{ width: 36, height: 36 }}><Video size={16} /></div>
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
                                alignSelf: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'flex-end' : 'flex-start', 
                                flexDirection: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'row-reverse' : 'row' 
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
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'flex-end' : 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px', padding: '0 4px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e1b4b' }}>{(msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'You' : msg.senderName}</span>
                                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {msg.parentMessage && (
                                    <div style={{ fontSize: '0.7rem', color: '#6d28d9', background: 'rgba(109, 40, 217, 0.05)', padding: '6px 12px', borderRadius: '10px', marginBottom: '4px', borderLeft: '3px solid #6d28d9', maxWidth: '200px', cursor: 'pointer' }}>
                                        <p style={{ fontWeight: 800, marginBottom: '2px' }}>{msg.parentMessage.sender?.fullName || 'User'}</p>
                                        <p style={{ opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                                        background: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'linear-gradient(135deg, #6d28d9, #4f46e5)' : '#fff',
                                        color: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '#fff' : '#334155',
                                        border: '1px solid rgba(109, 40, 217, 0.08)',
                                        fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.5',
                                        boxShadow: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '0 10px 25px rgba(109, 40, 217, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                                        borderRadius: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) 
                                            ? '20px 4px 20px 20px' 
                                            : '4px 20px 20px 20px'
                                    }}
                                >
                                    {/* Action Hover */}
                                    <div className="message-actions" style={{ position: 'absolute', top: '-10px', right: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'none' : '-65px', left: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '-65px' : 'none', display: 'flex', gap: '4px', zIndex: 10 }}>
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
                        <div style={{ position: 'absolute', bottom: '80px', left: '25px', background: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(30,27,75,0.2)', width: '340px', zIndex: 110, border: '1px solid rgba(109, 40, 217, 0.1)' }}>
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
                                            onClick={() => { setMessageInput(prev => prev + emoji); setIsEmojiPickerVisible(false); }} 
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
                        </div>
                        <input 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type something clever..."
                            style={{ flex: 1, background: 'none', border: 'none', color: '#1e1b4b', outline: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '10px 0' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                             <div className={`input-tool ai-glow ${isGeneratingAI ? 'generating' : ''}`} onClick={() => setIsAIMenuVisible(!isAIMenuVisible)} style={{ padding: '6px', position: 'relative' }}>
                                <Sparkles size={16} style={{ animation: isGeneratingAI ? 'spin 1s linear infinite' : 'none' }} />
                                
                                {isAIMenuVisible && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ position: 'absolute', bottom: '50px', right: '0', background: '#fff', borderRadius: '20px', padding: '12px', width: '220px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', border: '1px solid rgba(109,40,217,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', padding: '8px', letterSpacing: '1px' }}>AI COMMANDS</p>
                                        <button onClick={() => handleAIWrite('PROFESSIONAL')} style={{ padding: '10px 14px', borderRadius: '12px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', cursor: 'pointer', textAlign: 'left' }}><Activity size={14} /> Professional Rewrite</button>
                                        <button onClick={() => handleAIWrite('GRAMMAR')} style={{ padding: '10px 14px', borderRadius: '12px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', cursor: 'pointer', textAlign: 'left' }}><CheckCircle2 size={14} /> Fix English & Grammar</button>
                                        <button onClick={() => handleAIWrite('FUNNY')} style={{ padding: '10px 14px', borderRadius: '12px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#475569', cursor: 'pointer', textAlign: 'left' }}><Zap size={14} /> Make it Funny</button>
                                        <button onClick={() => handleAIWrite('IMAGE')} style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(109,40,217,0.05)', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#6d28d9', cursor: 'pointer', textAlign: 'left' }}><ImageIcon size={14} /> Generate Visual (AI)</button>
                                    </motion.div>
                                )}
                             </div>
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
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.role}</p>
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
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{user.role}</p>
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
                .ai-glow { color: #6d28d9; background: rgba(109, 40, 217, 0.06); }
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: rgba(109, 40, 217, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}
