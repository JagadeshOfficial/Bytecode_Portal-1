"use client";

import React, { useState, useEffect, useRef } from 'react';
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
    const [isMounted, setIsMounted] = useState(false);
    const [activeChat, setActiveChat] = useState('2');
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeChat, isMounted]);

    const chatList: ChatItem[] = [
        { id: '1', name: 'General Announcements', type: 'CHANNEL', lastMessage: 'The mock interview schedule is live.', time: '10:45 AM', unread: 2, category: 'OFFICIAL' },
        { id: '2', name: 'Batch PDA-86', type: 'GROUP', lastMessage: 'Check the new Python curriculum.', time: '11:20 AM', category: 'CHANNELS' },
        { id: '3', name: 'Trainer Rahul', type: 'DIRECT', lastMessage: 'Can we sync at 4 PM?', time: 'Yesterday', status: 'ONLINE', category: 'TEAM' },
        { id: '4', name: 'Koushik Krishna', type: 'DIRECT', lastMessage: 'Syllabus updated.', time: '2:15 PM', status: 'AWAY', category: 'TEAM' },
        { id: '5', name: 'Technical Support', type: 'CHANNEL', lastMessage: 'LMS access restored.', time: '3 days ago', category: 'SYSTEM' },
    ];

    const messages: Message[] = [
        { id: 'm1', senderId: 'bot', senderName: 'ByteAI', text: "Analyzing engagement for PDA-86... High activity detected in Module 4. Students are requesting more examples of asynchronous logic.", timestamp: new Date(Date.now() - 3600000), type: 'AI', status: 'SEEN' },
        { id: 'm2', senderId: 'u1', senderName: 'Koushik Krishna', text: "I've uploaded the Advanced Python PDF. Please ensure all trainers review the memory management section.", timestamp: new Date(Date.now() - 1800000), type: 'TEXT', status: 'SEEN', isPinned: true, reactions: [{ emoji: '👍', count: 5 }, { emoji: '🔥', count: 2 }] },
        { id: 'm3', senderId: 'u1', senderName: 'Koushik Krishna', text: "advanced_curriculum.pdf", timestamp: new Date(Date.now() - 1700000), type: 'FILE', fileName: 'advanced_curriculum.pdf', fileSize: '4.2 MB', status: 'SEEN' },
        { id: 'm4', senderId: 'me', senderName: 'Super Admin', text: "Great work. I will notify the respective coordinators immediately.", timestamp: new Date(Date.now() - 600000), type: 'TEXT', status: 'DELIVERED' },
    ];

    if (!isMounted) return <div style={{ background: '#fcfaff', height: '100vh' }} />;

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(109, 40, 217, 0.08)'
    };

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
                {[Home, MessageSquare, BarChart3, Users, Settings].map((Icon, i) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(109, 40, 217, 0.05)' }}
                        style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: i === 1 ? '#6d28d9' : '#94a3b8',
                            background: i === 1 ? 'rgba(109, 40, 217, 0.08)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <Icon size={20} />
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
                        <div style={{ background: '#f5f3ff', color: '#6d28d9', padding: '6px', borderRadius: '10px', cursor: 'pointer' }}><Plus size={16} /></div>
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
                                {chatList.filter(c => c.category === cat).map(chat => (
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
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{chatList.find(c => c.id === activeChat)?.name}</h3>
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
                                alignSelf: msg.senderId === 'me' ? 'flex-end' : 'flex-start', 
                                flexDirection: msg.senderId === 'me' ? 'row-reverse' : 'row' 
                            }}
                        >
                            <div style={{ width: 42, height: 42, borderRadius: '14px', background: msg.type === 'AI' ? '#f5f3ff' : '#fff', border: '1px solid rgba(109, 40, 217, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-start', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                {msg.type === 'AI' ? <BrainCircuit size={22} color="#6d28d9" /> : <User size={20} color="#94a3b8" />}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.senderId === 'me' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', marginBottom: '6px', padding: '0 4px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e1b4b' }}>{msg.senderName}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div 
                                    className="message-bubble-silk"
                                    style={{ 
                                        padding: '16px 22px', borderRadius: '24px',
                                        background: msg.senderId === 'me' ? 'linear-gradient(135deg, #6d28d9, #4f46e5)' : '#fff',
                                        color: msg.senderId === 'me' ? '#fff' : '#334155',
                                        border: '1px solid rgba(109, 40, 217, 0.08)',
                                        fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.6',
                                        boxShadow: msg.senderId === 'me' ? '0 10px 25px rgba(109, 40, 217, 0.2)' : '0 4px 15px rgba(0,0,0,0.03)',
                                        borderTopLeftRadius: msg.senderId === 'me' ? '24px' : '4px',
                                        borderTopRightRadius: msg.senderId === 'me' ? '4px' : '24px'
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
                            placeholder="Type something clever..."
                            style={{ flex: 1, background: 'none', border: 'none', color: '#1e1b4b', outline: 'none', fontSize: '1rem', fontWeight: 500, padding: '10px 0', resize: 'none', minHeight: '44px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className="input-tool ai-glow"><Sparkles size={20} /></div>
                            <motion.button 
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

            {/* PANEL 4: THE DRAWER (Details) */}
            <AnimatePresence>
                {isDetailsVisible && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '320px', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ 
                            width: '320px', 
                            flexShrink: 0, 
                            background: '#fcfaff', 
                            borderLeft: '1px solid rgba(109, 40, 217, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '40px',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ width: 110, height: 110, borderRadius: '40px', background: 'linear-gradient(135deg, #6d28d9, #c026d3)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(109, 40, 217, 0.25)' }}>
                                <Hash size={45} color="#fff" />
                            </div>
                            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e1b4b' }}>{chatList.find(c => c.id === activeChat)?.name}</h4>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', fontWeight: 600 }}>Batch PDA-86 Official Channel</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ padding: '20px', border: '1px solid rgba(109, 40, 217, 0.1)', borderRadius: '24px', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>HUB PERFORMANCE</span>
                                    <Zap size={14} color="#6d28d9" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>98.2%</span>
                                    <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>+4.1% TREND</span>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '15px', paddingLeft: '8px' }}>MEDIA ASSETS (128)</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} style={{ aspectRatio: '1', borderRadius: '14px', background: '#fff', border: '1px solid rgba(109, 40, 217, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <ImageIcon size={20} color="#e2e8f0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <button style={{ width: '100%', padding: '16px', borderRadius: '20px', background: '#fff', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', transition: '0.3s' }}>LEAVE CHANNEL</button>
                        </div>
                    </motion.div>
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
