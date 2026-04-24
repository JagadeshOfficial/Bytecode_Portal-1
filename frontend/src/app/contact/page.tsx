"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './contact.module.css';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowRight, Twitter, Linkedin, Instagram, Facebook, X, Users, Target, ChevronDown } from 'lucide-react';


/* --- ENHANCED KNOWLEDGE BASE --- */
const COURSE_DB = {
    'java': {
        name: 'Java Full Stack',
        duration: '5 Months',
        fee: '₹35,000',
        stack: 'Java 17, Spring Boot, React, Microservices',
        syllabus: ['Java Foundations', 'Spring Boot 3', 'Microservices', 'React.js', 'AWS Cloud']
    },
    'python': {
        name: 'Python Full Stack',
        duration: '4 Months',
        fee: '₹35,000',
        stack: 'Python, Django, React, PostgreSQL',
        syllabus: ['Python Optimization', 'Django REST', 'React Frontend', 'Data Structures', 'System Design']
    },
    'mern': {
        name: 'MERN Stack',
        duration: '4 Months',
        fee: '₹30,000',
        stack: 'MongoDB, Express, React, Node.js',
        syllabus: ['NoSQL Design', 'Express Engine', 'React Patterns', 'Node Performance', 'Tailwind']
    },
    'data': {
        name: 'Data Science & AI',
        duration: '6 Months',
        fee: '₹45,000',
        stack: 'Python, ML, Deep Learning, PowerBI',
        syllabus: ['Math & Stats', 'Deep Learning', 'Generative AI', 'Big Data', 'Model Deployment']
    }
};

const FAQS = [
    { q: "I'm a fresher with no experience. Can I really get a Job?", a: "Yes. Our curriculum is designed to take you from absolute zero to industry-ready. We focus on practical skills that companies actually hire for, not just theory. 100% of our placed students started exactly where you are." },
    { q: "What does 'Placement Guaranteed' actually mean?", a: "It means we don't stop until you are hired. We provide unlimited interview opportunities, dedicated placement support, and salary negotiation help until you sign your offer letter." },
    { q: "B.Tech takes 4 years. How can you train me in just 4-6 months?", a: "Colleges teach general engineering. We focus 100% on the specific, high-demand tech stack matching current industry requirements. It's targeted, intensive, and efficient learning." },
    { q: "Do I need a Computer Science (CS) background?", a: "Not at all. We have successfully placed Mechanical, Civil, and Commerce graduates. Passion and consistency matter more than your degree branch." },
    { q: "What if I miss a live class?", a: "No worries. Every session is recorded and uploaded to your student portal immediately. You can watch it at your own pace and clarify doubts in the next session." },
    { q: "Will I build real-world projects?", a: "Absolutely. You won't just learn syntax; you will build 10-15 industrial-grade projects. Your GitHub profile will look like that of an experienced developer by the end." },
    { q: "Do you help with Resume & Interview prep?", a: "Yes. We have a dedicated 'Career Services' module. We build your resume, optimize your LinkedIn, and conduct rigorous mock interviews with industry experts." },
    { q: "Are there EMI or Scholarship options?", a: "Yes, we offer merit-based scholarships and flexible EMI options starting at just ₹5000/month. Chat with us to verify your eligibility." }
];

type ChatState = 'IDLE' | 'ASK_NAME' | 'ASK_EMAIL' | 'ASK_PHONE' | 'ASK_QUALIFICATION' | 'ASK_COURSE' | 'ASK_GAP' | 'FINAL';
type Message = { id: string, text: string, sender: 'bot' | 'user', type?: 'text' | 'options', options?: string[], timestamp: string };

function ChatWidget({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [chatState, setChatState] = useState<ChatState>('IDLE');
    const [isTyping, setIsTyping] = useState(false);
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', qualification: '', interest: '', gap: '' });
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;

        const saved = localStorage.getItem('Bytecode_chat_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) {
                setMessages(parsed);
                hasInitialized.current = true;
                return;
            }
        }

        addBotMessage("Hi there! 👋 I'm **Nova**, your Bytecode Expert. How can I help you today?", 'options', ['Explore Courses', 'Check Fees', 'Talk to Admin'], 500);
        hasInitialized.current = true;
    }, []);

    useEffect(() => {
        if (messages.length > 0) localStorage.setItem('Bytecode_chat_history', JSON.stringify(messages));
    }, [messages]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const addBotMessage = (text: string, type: 'text' | 'options' = 'text', options: string[] = [], delay = 600) => {
        setTimeout(() => setIsTyping(true), 100);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => {
                const newId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                return [...prev, { id: newId, text, sender: 'bot', type, options, timestamp: getCurrentTime() }];
            });
        }, delay);
    };

    const handleSend = (textInput = input) => {
        const finalText = textInput.trim();
        if (!finalText) return;
        const newId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        setMessages(prev => [...prev, { id: newId, text: finalText, sender: 'user', timestamp: getCurrentTime() }]);
        setInput("");
        processInput(finalText);
    };

    const processInput = (text: string) => {
        const lower = text.toLowerCase();

        if (chatState === 'ASK_NAME') {
            setLeadData(prev => ({ ...prev, name: text }));
            addBotMessage(`Nice to meet you, **${text}**! 😊 What is your **Email Address**?`);
            setChatState('ASK_EMAIL');
            return;
        }
        if (chatState === 'ASK_EMAIL') {
            setLeadData(prev => ({ ...prev, email: text }));
            addBotMessage("Got it! And your **WhatsApp Number**?");
            setChatState('ASK_PHONE');
            return;
        }
        if (chatState === 'ASK_PHONE') {
            setLeadData(prev => ({ ...prev, phone: text }));
            addBotMessage("Great! What is your **Qualification**?", 'options', ['Student', 'Graduate', 'Working Pro']);
            setChatState('ASK_QUALIFICATION');
            return;
        }
        if (chatState === 'ASK_QUALIFICATION') {
            setLeadData(prev => ({ ...prev, qualification: text }));
            addBotMessage("Which course are you interested in?", 'options', ['Java', 'Python', 'MERN', 'AI']);
            setChatState('ASK_COURSE');
            return;
        }
        if (chatState === 'ASK_COURSE') {
            setLeadData(prev => ({ ...prev, interest: text }));
            addBotMessage("Do you have any **Career Gap**?", 'options', ['No Gap', '1 Year', '2+ Years']);
            setChatState('ASK_GAP');
            return;
        }
        if (chatState === 'ASK_GAP') {
            setLeadData(prev => ({ ...prev, gap: text }));
            addBotMessage("🎉 Awesome! Your career profile is ready. Click the button below to connect with our Admission Head.");
            setChatState('FINAL');
            return;
        }

        if (lower.includes('java')) {
            const c = COURSE_DB.java;
            addBotMessage(`☕ **${c.name}**\n\n• **Modules:** ${c.syllabus.join(', ')}\n• **Fee:** ${c.fee}\n\nWant to book a free demo?`, 'options', ['Book Demo', 'Check other courses']);
            return;
        }
        if (lower.includes('python')) {
            const c = COURSE_DB.python;
            addBotMessage(`🐍 **${c.name}**\n\n• **Fee:** ${c.fee}\n• **Duration:** ${c.duration}\n\nInterested in a callback?`, 'options', ['Call Me', 'Talk to Admin']);
            return;
        }
        if (lower.includes('mern') || lower.includes('web')) {
            const c = COURSE_DB.mern;
            addBotMessage(`⚛️ **${c.name}**\n\n• **Modules:** ${c.syllabus.join(', ')}\n\nWant the syllabus PDF?`, 'options', ['Get PDF', 'Talk to Admin']);
            return;
        }
        if (lower.includes('data') || lower.includes('ai')) {
            const c = COURSE_DB.data;
            addBotMessage(`🤖 **${c.name}**\n\n• **Stack:** ${c.stack}\n\nReady to start?`, 'options', ['Talk to Admin']);
            return;
        }
        if (lower.includes('fee') || lower.includes('price')) {
            addBotMessage("💰 **Standard Fees:**\n\n• Dev Courses: ₹35k\n• Data Science: ₹45k\n\nEMI starts at ₹5k/month.", 'options', ['Talk to Admin']);
            return;
        }
        if (lower.includes('talk') || lower.includes('admin') || lower.includes('connect')) {
            setChatState('ASK_NAME');
            addBotMessage("Sure! Let's get you connected. What is your **Full Name**?");
            return;
        }

        addBotMessage("I'm trained on Bytecode Courses. Ask me about **Java**, **MERN**, **Fees**, or say **Talk to Admin**.", 'options', ['Java Details', 'MERN Stack', 'Connect to Admin']);
    };

    const getWhatsAppLink = () => {
        const transcript = messages.slice(-8).map(m => `${m.sender === 'user' ? '👤' : '🤖'}: ${m.text.replace(/\*/g, '')}`).join('\n');
        const lead = chatState === 'FINAL' ? `🔥 STUDENT REGISTRATION\nName: ${leadData.name}\nPhone: ${leadData.phone}\nEmail: ${leadData.email}\nEducation: ${leadData.qualification}\nCourse: ${leadData.interest}\nGap: ${leadData.gap}` : `📍 QUICK INQUIRY`;
        const body = `${lead}\n\n--- CHAT ---\n${transcript}`;
        return `https://wa.me/918309879187?text=${encodeURIComponent(body)}`;
    };

    const formatText = (text: string) => {
        return text.split('\n').map((line, i) => (
            <span key={i} style={{ display: 'block', marginBottom: '4px' }}>
                {line.split(/(\*\*.*?\*\*)/).map((part, j) => part.startsWith('**') && part.endsWith('**') ? <strong key={j} style={{ color: '#3b82f6' }}>{part.slice(2, -2)}</strong> : part)}
            </span>
        ));
    };

    return (
        <motion.div className={styles.chatOverlay} initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
            <div className={styles.chatHeader}>
                <div className={styles.chatTitleGroup}>
                    <div className={styles.botAvatar}><MessageSquare size={24} /></div>
                    <div>
                        <span className={styles.chatTitle}>Nova AI</span>
                        <div className={styles.chatStatus}><div className={styles.statusDot}></div> Online</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setMessages([]); localStorage.removeItem('Bytecode_chat_history'); setChatState('IDLE'); }} className={styles.chatCloseBtn} title="Restart">↺</button>
                    <button onClick={onClose} className={styles.chatCloseBtn}><X size={20} /></button>
                </div>
            </div>
            <div className={styles.chatBody}>
                {messages.map(msg => (
                    <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'bot' ? styles.msgBot : styles.msgUser}`}>
                        <div className={styles.message}>{formatText(msg.text)}</div>
                        <div className={styles.timeStamp}>{msg.timestamp}</div>
                        {msg.type === 'options' && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                {msg.options?.map((opt, idx) => <button key={idx} onClick={() => handleSend(opt)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: '20px', padding: '8px 15px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>{opt}</button>)}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && <div className={styles.typingIndicator}><div className={styles.dot}></div><div className={styles.dot}></div><div className={styles.dot}></div></div>}
                {messages.length > 2 && !isTyping && (
                    <div style={{ padding: '10px', textAlign: 'center' }}>
                        <button onClick={() => window.open(getWhatsAppLink(), '_blank')} style={{ background: chatState === 'FINAL' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.05)', border: 'none', padding: '12px 25px', borderRadius: '30px', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <MessageSquare size={18} /> {chatState === 'FINAL' ? 'Send Application to Admin' : 'Connect with Counselor'}
                        </button>
                    </div>
                )}
                <div style={{ height: '10px' }}></div>
            </div>
            <div className={styles.chatFooter}>
                <input type="text" className={styles.chatInput} placeholder="Ask Nova..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <button className={styles.chatSendBtn} onClick={() => handleSend()}><Send size={24} /></button>
            </div>
        </motion.div>
    );
}

export default function Contact() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [status, setStatus] = useState("Graduate");
    const [interest, setInterest] = useState("Java Full Stack");
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', goal: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Send Data to API (SMTP)
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status, interest })
            });

            if (response.ok) {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000); // Auto hide after 5s
                setFormData({ fullName: '', email: '', phone: '', goal: '' });
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting form. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <div className={styles.bgDecor}><div className={`${styles.blob} ${styles.blob1}`}></div><div className={`${styles.blob} ${styles.blob2}`}></div></div>

            <div className={styles.heroRow}>
                <div className={styles.heroContent}>
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <LiveOfficeStatus />
                        <section className={styles.landingHeader}>
                            <h1 className={styles.heroTitle}>Step Into Your <br /><span className={styles.heroHighlight}>IT Career.</span></h1>
                            <p className={styles.heroSubtitle}>Start your journey with us. Master high-demand skills with our 2026 Tech Bootcamps and secure your dream job at top MNCs.</p>
                        </section>

                        <div className={styles.statusIconsRow}>
                            <button className={styles.eliteSubmitBtn} style={{ flex: 1, margin: 0, height: '60px' }} onClick={() => setIsChatOpen(true)}>
                                <MessageSquare size={20} /> CHAT WITH NOVA AI
                            </button>
                            <button className={styles.eliteSubmitBtn} style={{ flex: 1, margin: 0, height: '60px', background: 'var(--bg-panel)', border: 'var(--border-luminous)', color: 'var(--text-bright)' }} onClick={() => window.location.href = 'tel:+918309879187'}>
                                <Phone size={20} /> CALL COUNSELOR
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className={styles.heroVisual}>
                    <div className={styles.visualWrapper}>
                        <div className={styles.visualGlow}></div>
                        
                        <motion.div 
                            className={`${styles.floatingContactCard} ${styles.fCard1}`}
                            onClick={() => window.location.href = 'mailto:info@Bytecodetrainings.com'}
                        >
                            <div className={styles.iconBox} style={{ width: '40px', height: '40px' }}><Mail size={18} /></div>
                            <div>
                                <h4 style={{ fontSize: '1rem', margin: 0 }}>Email Us</h4>
                                <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7 }}>24/7 Support</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`${styles.floatingContactCard} ${styles.fCard2}`}
                            onClick={() => window.open('https://wa.me/918309879187', '_blank')}
                        >
                            <div className={styles.iconBox} style={{ width: '40px', height: '40px', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.2)' }}><MessageSquare size={18} /></div>
                            <div>
                                <h4 style={{ fontSize: '1rem', margin: 0 }}>WhatsApp</h4>
                                <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7 }}>Instant Reply</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className={`${styles.floatingContactCard} ${styles.fCard3}`}
                            onClick={() => window.location.href = 'tel:+918309879187'}
                        >
                            <div className={styles.iconBox} style={{ width: '40px', height: '40px' }}><Phone size={18} /></div>
                            <div>
                                <h4 style={{ fontSize: '1rem', margin: 0 }}>Call Support</h4>
                                <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7 }}>Direct Line</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <Image src="/tech_admission.png" alt="Tech Future" className={styles.mainIllustration} width={600} height={600} priority />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className={styles.portalRow}>
                <motion.div className={styles.elitePortal} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                    <div className={styles.portalHeader}>
                        <div className={styles.statusPill}><span className={styles.pulseDot}></span> ADMISSIONS ACTIVE</div>
                        <h3>Get Free Counseling</h3>
                        <p>Fill out the form below and our career experts will guide you to the right path.</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className={styles.portalForm}>
                        <div className={styles.horizontalGroup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className={styles.formSection}>
                                <div className={styles.sectionLabel}>FULL NAME</div>
                                <div className={styles.advancedInputGroup}>
                                    <input type="text" required onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                    <div className={styles.inputIcon}><Users size={18} /></div>
                                </div>
                            </div>
                            <div className={styles.formSection}>
                                <div className={styles.sectionLabel}>EMAIL ADDRESS</div>
                                <div className={styles.advancedInputGroup}>
                                    <input type="email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    <div className={styles.inputIcon}><Mail size={18} /></div>
                                </div>
                            </div>
                            <div className={styles.formSection}>
                                <div className={styles.sectionLabel}>WHATSAPP NUMBER</div>
                                <div className={styles.advancedInputGroup}>
                                    <input type="tel" required onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    <div className={styles.inputIcon}><Phone size={18} /></div>
                                </div>
                            </div>
                            <div className={styles.formSection}>
                                <div className={styles.sectionLabel}>CAREER GOAL</div>
                                <div className={styles.advancedInputGroup}>
                                    <input type="text" onChange={e => setFormData({ ...formData, goal: e.target.value })} />
                                    <div className={styles.inputIcon}><Target size={18} /></div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.horizontalGroup}>
                            <div className={styles.formSection} style={{ flex: 1 }}>
                                <div className={styles.sectionLabel}>CURRENT STATUS</div>
                                <div className={styles.chipGrid}>
                                    {["Student", "Graduate", "Professional"].map(s => (
                                        <button key={s} type="button" className={status === s ? styles.activeChip : styles.chip} onClick={() => setStatus(s)}>{s}</button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.formSection} style={{ flex: 1.5 }}>
                                <div className={styles.sectionLabel}>COURSE YOU'RE INTERESTED IN</div>
                                <div className={styles.advancedInputGroup} style={{ position: 'relative' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const dropdown = document.getElementById('cohort-dropdown');
                                            if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                                        }}
                                        style={{
                                            width: '100%',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '1rem',
                                            textAlign: 'left',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {interest}
                                        <ChevronDown size={18} />
                                    </button>

                                    <div
                                        id="cohort-dropdown"
                                        style={{
                                            display: 'none',
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            width: '100%',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            background: 'rgba(20, 20, 30, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '0 0 12px 12px',
                                            zIndex: 100,
                                            marginTop: '4px',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        {[
                                            "Python with Data Analytics",
                                            "Java Full Stack",
                                            "Python Full Stack",
                                            "Data Science & AI Masterclass",
                                            "DevOps & Cloud Engineering",
                                            "Cyber Security & Ethical Hacking",
                                            "MERN Stack"
                                        ].map((opt) => (
                                            <div
                                                key={opt}
                                                onClick={() => {
                                                    setInterest(opt);
                                                    const dropdown = document.getElementById('cohort-dropdown');
                                                    if (dropdown) dropdown.style.display = 'none';
                                                }}
                                                style={{
                                                    padding: '12px 16px',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                                                    e.currentTarget.style.color = '#fff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '1rem' }}>
                            <button type="submit" className={styles.eliteSubmitBtn} style={{ flex: 2, margin: 0 }} disabled={isSubmitting}>
                                {isSubmitting ? 'SENDING...' : <>SUBMIT <ArrowRight size={20} /></>}
                            </button>
                            <div className={styles.trustStrip} style={{ flex: 1, margin: 0, justifyContent: 'flex-end' }}>
                                <Globe size={14} /> Global Admissions Open
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* NEW MODULE: ADMISSION PROCESS TIMELINE */}
            <section className={styles.processSection}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif' }}>How to <span className={styles.heroHighlight}>Enroll</span></h2>
                    <ProcessSteps />
                </div>
            </section>

            {/* NEW MODULE: INTERACTIVE MAP & HQ INFO */}
            <section className={styles.locationContainer}>
                <div className={styles.mapSide}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.302381270634!2d78.3967963!3d17.4930691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f4f4f4f4f5%3A0x6b4f4f4f4f4f4f4f!2sManjeera%20Trinity%20Corporate!5e0!3m2!1sen!2sin!4v1643190000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(90%) grayscale(100%)' }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
                <div className={styles.hqDetails}>
                    <div className={styles.hqBadge}>HEADQUARTERS</div>
                    <h3>Bytecode Trainings and Placements</h3>
                    <p>6th Floor, Manjeera Trinity Corporate,<br />Beside LuLu Mall, KPHB, Hyderabad, Telangana</p>
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> +91 8309879187</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> info@Bytecodetrainings.com</div>
                    </div>
                    <div className={styles.hqStats}>
                        <div className={styles.stat}>
                            <strong>8,500+</strong>
                            <span>Alumni</span>
                        </div>
                        <div className={styles.stat}>
                            <strong>500+</strong>
                            <span>Partners</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.mapSection}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.828693899478!2d78.3907722751667!3d17.49520428340989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb911a37827dbd%3A0xc0fb1f2c2771fc1d!2sManjeera%20Trinity%20Corporate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    className={styles.mapIframe}
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bytecode Trainings Location Map"
                ></iframe>
            </section>

            <section className={styles.faqSection}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif' }}>Everything you need to know</h2>
                {FAQS.map((faq, idx) => (
                    <div key={idx} className={styles.faqItem}>
                        <button className={styles.faqQuestion} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                            {faq.q} <span>{activeFaq === idx ? '−' : '+'}</span>
                        </button>
                        <div className={`${styles.faqAnswer} ${activeFaq === idx ? styles.active : ''}`}>{faq.a}</div>
                    </div>
                ))}
            </section>

            <AnimatePresence>
                {/* Custom Toast Notification */}
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            background: '#059669',
                            color: 'white',
                            padding: '16px 24px',
                            borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            minWidth: '350px'
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Application Submitted</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Confirmation email sent successfully.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}</AnimatePresence>
            <Footer />
        </main >
    );
}

/* --- NEW COMPONENT: ADMISSION PROCESS --- */
function ProcessSteps() {
    const steps = [
        { title: 'Submit Details', desc: 'Securely fill the form with your tech interest.' },
        { title: 'Profile Consultation', desc: 'Our career guide will review your background.' },
        { title: 'Counselor Callback', desc: 'A senior counselor will call you shortly.' },
        { title: 'Join the Batch', desc: 'Receive batch details and start your journey.' }
    ];

    return (
        <div className={styles.processGrid}>
            {steps.map((step, i) => (
                <div key={i} className={styles.processStep}>
                    <div className={styles.stepNumber}>{i + 1}</div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                    {i < steps.length - 1 && <div className={styles.stepLine}></div>}
                </div>
            ))}
        </div>
    );
}

/* --- NEW COMPONENT: LIVE OFFICE STATUS --- */
function LiveOfficeStatus() {
    const [status, setStatus] = useState({ label: 'Checking...', color: '#94a3b8' });

    useEffect(() => {
        const updateStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 is Sunday
            const hour = now.getHours();

            if (day === 0) {
                setStatus({ label: 'Office Closed (Sun)', color: '#ef4444' });
            } else if (hour >= 9 && hour < 18) {
                setStatus({ label: 'Office Open (9 AM - 6 PM)', color: '#4ade80' });
            } else {
                setStatus({ label: 'Closed (Opens at 9 AM)', color: '#f59e0b' });
            }
        };
        updateStatus();
        const interval = setInterval(updateStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.statusBadge} style={{ borderColor: status.color + '44' }}>
            <div className={styles.innerDot} style={{ background: status.color }}></div>
            <span style={{ color: status.color }}>{status.label}</span>
        </div>
    );
}
