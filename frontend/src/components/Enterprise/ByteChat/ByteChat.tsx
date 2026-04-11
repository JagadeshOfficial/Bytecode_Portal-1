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
    Command, Sparkles, SendHorizontal, Trash2, Edit3,
    Activity, Cpu, BrainCircuit, CornerDownRight,
    Briefcase, LogOut, Info
} from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
    type: 'TEXT' | 'FILE' | 'AI' | 'SYSTEM';
    status: 'SENT' | 'DELIVERED' | 'SEEN';
    reactions?: { emoji: string; count: number }[];
    isPinned?: boolean;
    fileName?: string;
    fileSize?: string;
}

interface ChatItem {
    id: string;
    name: string;
    type: 'CHANNEL' | 'GROUP' | 'DIRECT';
    lastMessage: string;
    time: string;
    unread?: number;
    status?: 'ONLINE' | 'OFFLINE' | 'AWAY';
    category: string;
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
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_BASE = 'http://localhost:8080/api/chat';

    const fetchChats = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            const formatted = data.map((c: any) => ({
                id: c._id,
                name: c.name,
                type: c.type,
                lastMessage: c.lastMessage?.text || 'No messages yet',
                time: new Date(c.lastMessage?.timestamp || c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                category: c.category || 'CHANNELS',
                status: 'ONLINE'
            }));
            setChats(formatted);
            if (!activeChat && formatted.length > 0) setActiveChat(formatted[0].id);
        } catch (err) {
            console.error('Chat fetch error:', err);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const res = await fetch(`${API_BASE}/${chatId}/messages`);
            const data = await res.json();
            const mapped = data.map((msg: any) => {
                const sId = (msg.sender?._id || msg.sender)?.toString();
                const curId = (currentUser?.id || currentUser?._id)?.toString();
                const isMe = sId === curId;
                const foundUser = allUsers.find(u => (u.id?.toString() === sId || u._id?.toString() === sId));
                
                return {
                    id: msg._id,
                    senderId: sId,
                    senderName: isMe ? (currentUser.fullName || currentUser.name || "You") : (msg.sender?.fullName || foundUser?.fullName || 'Member'),
                    senderImage: isMe ? currentUser.profileImage : (msg.sender?.profileImage || foundUser?.profileImage),
                    text: msg.text,
                    timestamp: new Date(msg.createdAt),
                    type: msg.type,
                    status: msg.status
                };
            });
            setMessages(mapped);
        } catch (err) {
            console.error('Fetch messages error:', err);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeChat || !currentUser) return;

        try {
            const res = await fetch(`${API_BASE}/${activeChat}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: currentUser.id || currentUser._id, 
                    text: messageInput,
                    type: 'TEXT'
                })
            });
            
            if (res.ok) {
                setMessageInput('');
                fetchMessages(activeChat);
                fetchChats();
            }
        } catch (err) {
            console.error('Send error:', err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users');
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

    useEffect(() => {
        if (activeChat && isMounted) fetchMessages(activeChat);
    }, [activeChat, isMounted, allUsers, currentUser]); // Re-run when users load

    useEffect(() => {
        if (activeChat) fetchMessages(activeChat);
    }, [activeChat]);



    const handleCreateChat = async () => {
        if (!newChatName.trim()) return;
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newChatName,
                    type: newChatType,
                    category: newChatCategory,
                    participants: [...selectedMembers, '65f1a58e8e3f9a1234567890'] // Include selected + mock admin
                })
            });
            if (res.ok) {
                setNewChatName('');
                setSelectedMembers([]);
                setIsCreateModalVisible(false);
                fetchChats();
            }
        } catch (err) {
            console.error('Create chat error:', err);
        }
    };

    const fetchParticipants = async (chatId: string) => {
        try {
            const res = await fetch(`${API_BASE}/${chatId}`);
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
                    {['OFFICIAL', 'CHANNELS', 'TEAM'].map(cat => (
                        <div key={cat} style={{ marginBottom: '28px' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1.5px', padding: '0 12px', marginBottom: '12px' }}>{cat}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chats.filter(c => c.category === cat).map(chat => (
                                    <motion.div 
                                        key={chat.id} 
                                        onClick={() => setActiveChat(chat.id)}
                                        whileHover={{ backgroundColor: 'rgba(109, 40, 217, 0.03)' }}
                                        style={{
                                            padding: '12px', borderRadius: '16px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            background: activeChat === chat.id ? 'linear-gradient(135deg, rgba(109, 40, 217, 0.08), rgba(109, 40, 217, 0.02))' : 'transparent',
                                            border: activeChat === chat.id ? '1px solid rgba(109, 40, 217, 0.1)' : '1px solid transparent'
                                        }}
                                    >
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ width: 40, height: 40, borderRadius: '12px', background: chat.type === 'DIRECT' ? '#f8fafc' : 'linear-gradient(135deg, #6d28d9, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: chat.type === 'DIRECT' ? 'none' : '0 4px 8px rgba(109, 40, 217, 0.15)' }}>
                                                {chat.type === 'DIRECT' ? <AtSign size={18} color="#6d28d9" /> : <Hash size={18} color="#fff" />}
                                            </div>
                                            {chat.status === 'ONLINE' && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', background: '#10b981', border: '2px solid #fff' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: activeChat === chat.id ? '#6d28d9' : '#1e1b4b' }}>{chat.name}</span>
                                                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{chat.time}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{chat.lastMessage}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL 3: THE HEART (Main Chat) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                {/* Header */}
                <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(109, 40, 217, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '16px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(109, 40, 217, 0.1)' }}>
                             <Hash size={24} color="#6d28d9" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{chats.find(c => c.id === activeChat)?.name || 'Select a Chat'}</h3>
                            <p style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> 12 Active Members
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="action-circle-soft"><Phone size={18} /></div>
                        <div className="action-circle-soft"><Video size={18} /></div>
                        <div 
                            className={`action-circle-soft ${isDetailsVisible ? 'active' : ''}`}
                            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                        >
                            <Info size={18} />
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'radial-gradient(circle at 50% 50%, #fff, #fcfaff)' }}>
                    {messages.map((msg, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id} 
                            style={{ 
                                display: 'flex', 
                                gap: '18px', 
                                maxWidth: '80%', 
                                alignSelf: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'flex-end' : 'flex-start', 
                                flexDirection: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'row-reverse' : 'row' 
                            }}
                        >
                            <div style={{ width: 42, height: 42, borderRadius: '14px', background: msg.type === 'AI' ? '#f5f3ff' : '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-start', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                                {msg.type === 'AI' ? <BrainCircuit size={22} color="#6d28d9" /> : (
                                    msg.senderImage ? (
                                        <img src={msg.senderImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                            {msg.senderName?.[0] || 'U'}
                                        </div>
                                    )
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'flex-end' : 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', marginBottom: '6px', padding: '0 4px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{(msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'You' : msg.senderName}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div 
                                    className="message-bubble-silk"
                                    style={{ 
                                        padding: '16px 22px', borderRadius: '24px',
                                        background: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? 'linear-gradient(135deg, #6d28d9, #4f46e5)' : '#fff',
                                        color: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '#fff' : '#334155',
                                        border: '1px solid rgba(109, 40, 217, 0.08)',
                                        fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6',
                                        boxShadow: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '0 10px 25px rgba(109, 40, 217, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                                        borderTopLeftRadius: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '24px' : '4px',
                                        borderTopRightRadius: (msg.senderId === currentUser?.id || msg.senderId === currentUser?._id) ? '4px' : '24px'
                                    }}
                                >
                                    {msg.type === 'FILE' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}><FileText size={22} /></div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>{msg.fileName}</p>
                                                <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>{msg.fileSize} • PDF</p>
                                            </div>
                                            <Download size={18} style={{ cursor: 'pointer' }} />
                                        </div>
                                    ) : msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ padding: '0 32px 32px' }}>
                    <div style={{ 
                        background: '#fff', 
                        border: '1px solid rgba(109, 40, 217, 0.12)', 
                        borderRadius: '28px', padding: '12px 20px',
                        boxShadow: '0 15px 35px -5px rgba(0,0,0,0.05)',
                        display: 'flex', alignItems: 'center', gap: '15px'
                    }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                             <div className="input-tool"><Paperclip size={20} /></div>
                             <div className="input-tool"><Smile size={20} /></div>
                        </div>
                        <textarea 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                            placeholder="Type something clever..."
                            style={{ flex: 1, background: 'none', border: 'none', color: '#1e1b4b', outline: 'none', fontSize: '1rem', fontWeight: 500, padding: '10px 0', resize: 'none', minHeight: '44px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="input-tool ai-glow"><Sparkles size={20} /></div>
                            <motion.button 
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(109, 40, 217, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                style={{ 
                                    padding: '12px 24px', borderRadius: '18px', 
                                    background: 'linear-gradient(135deg, #6d28d9, #4f46e5)',
                                    color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                                    cursor: 'pointer', fontWeight: 800
                                }}
                            >
                                SEND <SendHorizontal size={18} />
                            </motion.button>
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

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #f1f5f9' }}>
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

                            {activeDetailTab === 'OVERVIEW' ? (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                        <div style={{ width: 100, height: 100, borderRadius: '35px', background: 'linear-gradient(135deg, #6d28d9, #c026d3)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.25)' }}>
                                            <Hash size={45} color="#fff" />
                                        </div>
                                        <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>{chats.find(c => c.id === activeChat)?.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '6px', fontWeight: 600 }}>Operational Unit PDA-86</p>
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
                                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                                                {p.fullName?.[0] || 'U'}
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

                            <button style={{ 
                                width: '100%', marginTop: '30px', padding: '16px', borderRadius: '20px', 
                                background: '#fff', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', 
                                fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem'
                            }}>
                                LEAVE CHANNEL
                            </button>
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
                            
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>SELECT TYPE</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['CHANNEL', 'GROUP', 'COMMUNITY'].map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setNewChatType(t)}
                                            style={{ 
                                                flex: 1, padding: '10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                                                background: newChatType === t ? '#6d28d9' : '#f8fafc',
                                                color: newChatType === t ? '#fff' : '#475569',
                                                border: 'none', cursor: 'pointer', transition: '0.2s'
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>ORGANIZATIONAL CATEGORY</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {['OFFICIAL', 'CHANNELS', 'TEAM'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setNewChatCategory(c)}
                                            style={{ 
                                                flex: 1, padding: '10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                                                background: newChatCategory === c ? 'rgba(109, 40, 217, 0.1)' : '#f8fafc',
                                                color: newChatCategory === c ? '#6d28d9' : '#475569',
                                                border: 'none', cursor: 'pointer', transition: '0.2s'
                                            }}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <input 
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                placeholder="Name your hub..."
                                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '1rem', fontWeight: 600 }}
                            />

                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '10px' }}>INVITE PARTICIPANTS</p>
                                <div style={{ height: '150px', overflowY: 'auto', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '8px' }}>
                                    {allUsers.map(user => (
                                        <div 
                                            key={user.id} 
                                            onClick={() => setSelectedMembers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                                            style={{ 
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', cursor: 'pointer',
                                                background: selectedMembers.includes(user.id) ? 'rgba(109, 40, 217, 0.05)' : 'transparent'
                                            }}
                                        >
                                            <div style={{ width: 30, height: 30, borderRadius: '8px', background: '#6d28d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem' }}>
                                                {user.fullName?.[0]}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, flex: 1 }}>{user.fullName}</span>
                                            <div style={{ width: 18, height: 18, borderRadius: '4px', border: '2px solid #6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selectedMembers.includes(user.id) ? '#6d28d9' : 'transparent' }}>
                                                {selectedMembers.includes(user.id) && <CheckCircle2 size={12} color="#fff" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setIsCreateModalVisible(false)} style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#f8fafc', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleCreateChat} style={{ flex: 1, padding: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Create Hub</button>
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
