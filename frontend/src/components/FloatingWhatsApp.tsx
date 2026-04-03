"use client";

import { MessageCircle, X, Send, User, ChevronRight, Zap, Target, BookOpen, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [autoPopup, setAutoPopup] = useState(false);

    const phoneNumber = "918309879187";
    
    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        
        // Appear after 2s, Auto-popup after 6s
        const timer1 = setTimeout(() => setShowBubble(true), 2000);
        const timer2 = setTimeout(() => {
            if (!isOpen) setAutoPopup(true);
        }, 6000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const handleSendMessage = (text: string) => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        setIsOpen(false);
        setAutoPopup(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: isMobile ? '30px' : '40px', right: isMobile ? '20px' : '40px', zIndex: 999999 }}>
            
            <AnimatePresence>
                {(isOpen || autoPopup) && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.85, y: 50, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="elite-wa-window shadow-quantum"
                    >
                        {/* Mesh Header */}
                        <div className="elite-wa-header">
                            <div className="elite-wa-header-info">
                                <div className="elite-wa-avatar">
                                    <MessageCircle size={22} color="white" />
                                    <div className="elite-wa-dot" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 950, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.5px' }}>Bytecode Career Expert</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.9, color: '#fff', fontWeight: 700 }}>Online & Ready to Help</div>
                                </div>
                            </div>
                            <button className="elite-wa-close" onClick={() => { setIsOpen(false); setAutoPopup(false); }}><X size={18} /></button>
                        </div>

                        {/* Chat Body */}
                        <div className="elite-wa-body">
                            <div className="elite-wa-msg-row">
                                <div className="elite-wa-msg">Hi! 👋 I'm here from Bytecode. Looking for the best course to land a high-paying IT job?</div>
                                <span className="elite-wa-time">Replied 1m ago</span>
                            </div>

                            <div className="elite-wa-typing">
                                <div className="dot" />
                                <div className="dot" />
                                <div className="dot" />
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <QuickAction label="Explore Courses" icon={<BookOpen size={14} />} onClick={() => handleSendMessage("Hi! I'm looking for course details.")} />
                                <QuickAction label="Placement Stats" icon={<Target size={14} />} onClick={() => handleSendMessage("Hi! Show me your latest placement success stories.")} />
                                <QuickAction label="Talk to Advisor" icon={<UserPlus size={14} />} onClick={() => handleSendMessage("Hi! I need a career advice session.")} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="elite-wa-footer">
                            <div className="elite-wa-input">
                                <input placeholder="How can we help today?" onKeyDown={(e) => e.key === 'Enter' && handleSendMessage((e.target as HTMLInputElement).value)} />
                                <button className="elite-wa-send" onClick={() => handleSendMessage("Hi! I have a question.")}><Send size={18} /></button>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.6rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '2px', opacity: 0.5 }}>ELITE CAREER ENGINE v5.0</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showBubble && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setIsOpen(!isOpen); setAutoPopup(false); }}
                        className={`elite-wa-bubble ${isOpen ? 'active' : ''} shadow-quantum`}
                    >
                        {isOpen ? <X size={26} /> : (
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382C17.119 14.205 15.396 13.359 15.078 13.254C14.76 13.149 14.53 13.096 14.3 13.431C14.07 13.766 13.417 14.524 13.223 14.754C13.029 14.984 12.835 15.019 12.482 14.843C12.129 14.666 10.992 14.293 9.646 13.093C8.583 12.146 7.865 10.976 7.653 10.606C7.441 10.236 7.63 10.039 7.807 9.863C7.966 9.705 8.16 9.458 8.337 9.247C8.514 9.035 8.567 8.876 8.69 8.629C8.814 8.383 8.761 8.172 8.673 7.996C8.584 7.82 7.865 6.058 7.566 5.353C7.274 4.666 6.98 4.761 6.786 4.761C6.609 4.761 6.415 4.755 6.221 4.755C6.027 4.755 5.709 4.825 5.444 5.108C5.179 5.39 4.438 6.077 4.438 7.47C4.438 8.863 5.462 10.203 5.604 10.397C5.745 10.591 7.616 13.468 10.482 14.706C11.164 15.001 11.696 15.177 12.11 15.309C12.921 15.567 13.666 15.531 14.253 15.443C14.908 15.346 16.267 14.622 16.55 13.829C16.832 13.036 16.832 12.348 16.744 12.189C16.656 12.03 16.426 11.942 16.073 11.765ZM12.041 21.785C10.264 21.785 8.598 21.329 7.135 20.533L6.822 20.347L3.064 21.332L4.081 17.655L3.877 17.331C2.989 15.917 2.52 14.27 2.52 12.57C2.52 7.322 6.791 3.051 12.041 3.051C14.584 3.051 16.974 4.041 18.771 5.839C20.57 7.637 21.56 10.027 21.56 12.57C21.56 17.822 17.29 22.089 12.043 21.785H12.041Z" />
                            </svg>
                        )}
                        {!isOpen && <div className="elite-wa-pulse" />}
                    </motion.button>
                )}
            </AnimatePresence>

            <style jsx>{`
                .elite-wa-bubble {
                    width: 74px; height: 74px; border-radius: 24px;
                    background: #25D366; color: #fff; border: none;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; position: relative; z-index: 1000;
                    box-shadow: 0 20px 40px rgba(37, 211, 102, 0.4);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .elite-wa-bubble.active { background: #000; border-radius: 50%; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
                
                .elite-wa-pulse {
                    position: absolute; inset: -5px; border: 3px solid #25D366;
                    border-radius: 28px; animation: elitePulse 2.5s infinite; pointer-events: none;
                }
                @keyframes elitePulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.6); opacity: 0; }
                }

                .elite-wa-window {
                    position: absolute; bottom: 95px; right: 0;
                    width: 400px; background: #fff; border-radius: 35px;
                    overflow: hidden; display: flex; flex-direction: column;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.25);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .elite-wa-header {
                    background: linear-gradient(135deg, #25D366 0%, #10b981 100%);
                    padding: 30px; display: flex; justify-content: space-between; align-items: center;
                }
                .elite-wa-header-info { display: flex; align-items: center; gap: 18px; }
                .elite-wa-avatar {
                    width: 54px; height: 54px; border-radius: 16px;
                    background: rgba(255,255,255,0.15); display: flex;
                    align-items: center; justify-content: center; position: relative;
                }
                .elite-wa-dot {
                    position: absolute; bottom: -3px; right: -3px;
                    width: 14px; height: 14px; background: #fff;
                    border-radius: 50%; border: 4px solid #10b981;
                }
                .elite-wa-close { background: rgba(0,0,0,0.1); border: none; color: #fff; padding: 8px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
                .elite-wa-close:hover { background: #000; }
                
                .elite-wa-body { padding: 30px; background: #fdfdfd; flex: 1; }
                .elite-wa-msg-row { display: flex; flexDirection: column; gap: 8px; max-width: 90%; }
                .elite-wa-msg {
                    background: #fff; padding: 18px 24px; border-radius: 0 25px 25px 25px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05); font-size: 0.95rem;
                    color: #1e293b; line-height: 1.6; font-weight: 600;
                    border: 1px solid rgba(0,0,0,0.02);
                }
                .elite-wa-time { font-size: 0.65rem; color: #94a3b8; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }

                .elite-wa-typing { display: flex; gap: 4px; padding: 12px 18px; background: #fff; border-radius: 20px; width: fit-content; margin-top: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.03); }
                .elite-wa-typing .dot { width: 6px; height: 6px; border-radius: 50%; background: #25D366; animation: typing 1s infinite alternate; }
                .elite-wa-typing .dot:nth-child(2) { animation-delay: 0.2s; }
                .elite-wa-typing .dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { from { transform: translateY(0); opacity: 0.3; } to { transform: translateY(-4px); opacity: 1; } }

                .elite-wa-footer { padding: 25px; background: #fff; border-top: 1px solid #f1f5f9; }
                .elite-wa-input {
                    display: flex; align-items: center; background: #f8fafc;
                    padding: 10px 20px; border-radius: 100px; gap: 15px; border: 1px solid rgba(0,0,0,0.03);
                }
                .elite-wa-input input {
                    flex: 1; background: none; border: none; outline: none;
                    font-size: 0.9rem; padding: 10px 0; font-weight: 700; color: #1e293b;
                }
                .elite-wa-send { background: none; border: none; color: #25D366; cursor: pointer; display: flex; align-items: center; transition: transform 0.2s; }
                .elite-wa-send:hover { transform: scale(1.1) rotate(-10deg); }

                @media (max-width: 768px) {
                    .elite-wa-window { width: calc(100vw - 40px); bottom: 100px; border-radius: 30px; }
                }
            `}</style>
        </div>
    );
}

function QuickAction({ label, icon, onClick }: any) {
    return (
        <button className="elite-action-btn" onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="action-icon">{icon}</div>
                <span style={{ fontWeight: 950, fontSize: '0.9rem', letterSpacing: '-0.2px' }}>{label}</span>
            </div>
            <ChevronRight size={16} opacity={0.3} />
            <style jsx>{`
                .elite-action-btn {
                    width: 100%; textAlign: left; background: #fff;
                    border: 1px solid rgba(0,0,0,0.05); padding: 18px 22px;
                    border-radius: 20px; color: #1e293b; cursor: pointer;
                    display: flex; justify-content: space-between; align-items: center;
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .elite-action-btn:hover { background: #000; color: #fff; transform: scale(1.02); }
                .action-icon { color: #10b981; }
                .elite-action-btn:hover .action-icon { color: #fff; }
            `}</style>
        </button>
    );
}
