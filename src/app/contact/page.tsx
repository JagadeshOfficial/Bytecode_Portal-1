"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './contact.module.css';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, ArrowRight, Twitter, Linkedin, Instagram, Facebook, X } from 'lucide-react';

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
    { q: "How quickly do you respond to queries?", a: "Our support team typically responds within 2-4 hours during business days." },
    { q: "Do you offer corporate training partnerships?", a: "Yes, we have dedicated B2B solutions for optimizing your workforce." },
    { q: "Can I visit your office in person?", a: "Absolutely! We welcome students and partners at our Bengaluru HQ." },
    { q: "Is there a refund policy?", a: "We offer a 7-day no-questions-asked refund policy for all our self-paced courses." }
];

type ChatState = 'IDLE' | 'ASK_NAME' | 'ASK_EMAIL' | 'ASK_PHONE' | 'ASK_QUALIFICATION' | 'ASK_COURSE' | 'ASK_GAP' | 'FINAL';
type Message = { id: string, text: string, sender: 'bot' | 'user', type?: 'text' | 'options', options?: string[], timestamp: string };

function ChatWidget({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [chatState, setChatState] = useState<ChatState>('IDLE');
    const [isTyping, setIsTyping] = useState(false);
    const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', qualification: '', interest: '', gap: '' });

    useEffect(() => {
        const saved = localStorage.getItem('bytecode_chat_history');
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            addBotMessage("Hi there! 👋 I'm **Nova**, your ByteCode Expert. How can I help you today?", 'options', ['Explore Courses', 'Check Fees', 'Talk to Admin'], 500);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) localStorage.setItem('bytecode_chat_history', JSON.stringify(messages));
    }, [messages]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const addBotMessage = (text: string, type: 'text' | 'options' = 'text', options: string[] = [], delay = 600) => {
        setTimeout(() => setIsTyping(true), 100);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'bot', type, options, timestamp: getCurrentTime() }]);
        }, delay);
    };

    const handleSend = (textInput = input) => {
        const finalText = textInput.trim();
        if (!finalText) return;
        setMessages(prev => [...prev, { id: Date.now().toString(), text: finalText, sender: 'user', timestamp: getCurrentTime() }]);
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

        addBotMessage("I'm trained on ByteCode Courses. Ask me about **Java**, **MERN**, **Fees**, or say **Talk to Admin**.", 'options', ['Java Details', 'MERN Stack', 'Connect to Admin']);
    };

    const getWhatsAppLink = () => {
        const transcript = messages.slice(-8).map(m => `${m.sender === 'user' ? '👤' : '🤖'}: ${m.text.replace(/\*/g, '')}`).join('\n');
        const lead = chatState === 'FINAL' ? `🔥 STUDENT REGISTRATION\nName: ${leadData.name}\nPhone: ${leadData.phone}\nEmail: ${leadData.email}\nEducation: ${leadData.qualification}\nCourse: ${leadData.interest}\nGap: ${leadData.gap}` : `📍 QUICK INQUIRY`;
        const body = `${lead}\n\n--- CHAT ---\n${transcript}`;
        return `https://wa.me/918790055638?text=${encodeURIComponent(body)}`;
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
                    <button onClick={() => { setMessages([]); localStorage.removeItem('bytecode_chat_history'); setChatState('IDLE'); }} className={styles.chatCloseBtn} title="Restart">↺</button>
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
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', qualification: '', course: '', gap: '', message: '' });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `🔥 *NEW STUDENT APPLICATION*\n\n*Name:* ${formData.firstName} ${formData.lastName}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Education:* ${formData.qualification}\n*Course:* ${formData.course}\n*Gap:* ${formData.gap}\n*Query:* ${formData.message}`;
        window.open(`https://wa.me/918790055638?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <div className={styles.bgDecor}><div className={`${styles.blob} ${styles.blob1}`}></div><div className={`${styles.blob} ${styles.blob2}`}></div></div>

            <div className={styles.splitWrapper}>
                <div className={styles.infoColumn}>
                    <LiveOfficeStatus />
                    <section className={styles.heroSection}>
                        <h1 className={styles.heroTitle}>Step Into Your <br /><span className={styles.heroHighlight}>Future.</span></h1>
                        <p className={styles.heroSubtitle}>Apply for our 2026 Tech Bootcamps. Master high-demand skills with placement guarantee.</p>
                    </section>
                    <div className={styles.channelsList}>
                        <div className={styles.channelItem} style={{ cursor: 'pointer' }} onClick={() => setIsChatOpen(true)}>
                            <div className={styles.iconBox}><MessageSquare size={24} /></div>
                            <div>
                                <h4>Instant AI Chat</h4>
                                <p>Talk to Nova for instant answers on fees and curriculum.</p>
                            </div>
                        </div>
                        <div className={styles.channelItem} style={{ cursor: 'pointer' }} onClick={() => window.location.href = 'tel:+918790055638'}>
                            <div className={styles.iconBox}><Phone size={24} /></div>
                            <div>
                                <h4>Direct Helpdesk</h4>
                                <p>Emergency inquiry? Call us at +91 87900 55638</p>
                            </div>
                        </div>
                        <div className={styles.channelItem} style={{ cursor: 'pointer' }} onClick={() => window.location.href = 'mailto:admissions@bytecode.com'}>
                            <div className={styles.iconBox}><Mail size={24} /></div>
                            <div>
                                <h4>Admissions Email</h4>
                                <p>Drop a detailed query at admissions@bytecode.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formColumn}>
                    <motion.div className={styles.floatingForm} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <h3>Fast-Track Admission</h3>
                        <p>Fill in this secured form to get the latest brochure.</p>
                        <form onSubmit={handleFormSubmit}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}><label>First Name</label><input type="text" placeholder="John" required onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
                                <div className={styles.inputGroup}><label>Last Name</label><input type="text" placeholder="Doe" required onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
                            </div>
                            <div className={styles.inputGroup}><label>Email Address</label><input type="email" placeholder="john@example.com" required onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                            <div className={styles.inputGroup}><label>WhatsApp Number</label><input type="tel" placeholder="+91 00000 00000" required onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>

                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}><label>Education</label><select required onChange={e => setFormData({ ...formData, qualification: e.target.value })}><option value="">Select</option><option value="B.Tech">B.Tech</option><option value="MCA/M.Tech">MCA</option><option value="Degree">Degree</option></select></div>
                                <div className={styles.inputGroup}><label>Course</label><select required onChange={e => setFormData({ ...formData, course: e.target.value })}><option value="">Select</option><option value="Java">Java</option><option value="Python">Python</option><option value="MERN">MERN</option><option value="AI">AI / DS</option></select></div>
                            </div>

                            <div className={styles.inputGroup}><label>Career Gap</label><select required onChange={e => setFormData({ ...formData, gap: e.target.value })}><option value="0">No Gap</option><option value="1">1 Year</option><option value="2+">2+ Years</option></select></div>
                            <div className={styles.inputGroup}><label>Queries</label><textarea placeholder="Ask us anything..." rows={2} onChange={e => setFormData({ ...formData, message: e.target.value })} /></div>
                            <button type="submit" className={styles.submitBtn}>Apply Now via WhatsApp <Send size={20} /></button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* NEW MODULE: ADMISSION PROCESS TIMELINE */}
            <section className={styles.processSection}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif' }}>Your Path to <span className={styles.heroHighlight}>Greatness</span></h2>
                    <ProcessSteps />
                </div>
            </section>

            {/* NEW MODULE: INTERACTIVE MAP & HQ INFO */}
            <section className={styles.locationContainer}>
                <div className={styles.mapSide}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7505291247!2d77.60893!3d12.923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b17bd99a67%3A0xc172e259b646c0d!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1643190000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(90%) grayscale(100%)' }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
                <div className={styles.hqDetails}>
                    <div className={styles.hqBadge}>HEADQUARTERS</div>
                    <h3>ByteCode Technology Hub</h3>
                    <p>88, MG Road, 3rd Block, Jayanagar,<br />Bengaluru, Karnataka - 560011</p>
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

            <AnimatePresence>{isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}</AnimatePresence>
            <Footer />
        </main>
    );
}

/* --- NEW COMPONENT: ADMISSION PROCESS --- */
function ProcessSteps() {
    const steps = [
        { title: 'Submit Application', desc: 'Securely fill the form with your tech interest.' },
        { title: 'AI Profile Review', desc: 'Our Nova AI validates your career goals.' },
        { title: 'Expert Callback', desc: 'Senior counselor calls within 2-4 hours.' },
        { title: 'Get Enrolled', desc: 'Receive brochure & batch details on WhatsApp.' }
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
