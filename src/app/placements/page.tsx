"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './placements.module.css';
import { TrendingUp, Users, Building, Award, Briefcase, DollarSign, CheckCircle, ArrowRight, Zap, Target, X, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const STATS = [
    { label: "Highest Package", value: "45 LPA", icon: <Award size={24} color="#f59e0b" /> },
    { label: "Average Hike", value: "120%", icon: <TrendingUp size={24} color="#10b981" /> },
    { label: "Hiring Partners", value: "500+", icon: <Building size={24} color="#3b82f6" /> },
    { label: "Alumni Hired", value: "8500+", icon: <Users size={24} color="#8b5cf6" /> }
];

const PARTNERS = [
    "Google", "Microsoft", "Amazon", "Netflix", "Adobe", "Uber",
    "Atlassian", "Salesforce", "Oracle", "Cisco", "Intel", "IBM",
    "Flipkart", "Walmart", "Paytm", "Zomato", "Swiggy", "Cred"
];

const SUCCESS_STORIES = [
    {
        name: "Rohan Das",
        role: "SDE-II",
        company: "Amazon",
        package: "45 LPA",
        prev: "3.5 LPA",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80",
        quote: "I never thought a non-CS grad could crack Amazon. The system design modules were the key differentiator."
    },
    {
        name: "Priya Sharma",
        role: "Data Scientist",
        company: "Microsoft",
        package: "38 LPA",
        prev: "Fresher",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        quote: "The mock interviews with actual Microsoft engineers helped me kill my nervousness. Best investment ever."
    },
    {
        name: "Amit Patel",
        role: "DevOps Engineer",
        company: "Adobe",
        package: "28 LPA",
        prev: "6 LPA",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
        quote: "Understanding the nuances of Kubernetes and Docker depth was what got me this offer. Truly advanced curriculum."
    },
    {
        name: "Sneha Reddy",
        role: "Product Manager",
        company: "Uber",
        package: "35 LPA",
        prev: "12 LPA",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
        quote: "Moving from development to product management was seamless with the strategic insights from the course."
    },
    {
        name: "Vikram Singh",
        role: "Backend Lead",
        company: "Zerodha",
        package: "42 LPA",
        prev: "15 LPA",
        image: "https://images.unsplash.com/photo-1566492031773-4fbc7dddfabd?auto=format&fit=crop&q=80",
        quote: "High-scale systems architecture is something you only learn by doing. This course made me do it."
    },
    {
        name: "Arjun K.",
        role: "Full Stack Dev",
        company: "Cred",
        package: "26 LPA",
        prev: "4.5 LPA",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        quote: "The frontend specialization with React and Next.js is top-notch. I felt confident from day one."
    }
];

// Fake live hires for the ticker
const LIVE_HIRES = [
    { name: "Rahul M.", company: "Google", role: "SDE-1" },
    { name: "Sara K.", company: "Amazon", role: "Data Analyst" },
    { name: "Varun T.", company: "Microsoft", role: "Cloud Eng." },
    { name: "Pooja R.", company: "Adobe", role: "UX Designer" },
    { name: "Kiran S.", company: "Swiggy", role: "Backend Dev" }
];

export default function Placements() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");

    const openEnroll = (course: string = "") => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    return (
        <main className={styles.main}>
            <Navbar />

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.glowOrb} style={{ top: '-10%', left: '20%' }} />
                <div className={styles.glowOrb} style={{ bottom: '10%', right: '20%', background: '#8b5cf6' }} />

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.heroTitle}
                    >
                        Success <span className={styles.heroHighlight}>Delivered.</span> <br />
                        Careers <span className={styles.heroHighlight}>Transformed.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.heroSubtitle}
                    >
                        Join thousands of students who have secured high-paying jobs at the world's leading tech companies. Your dream job is just a course away.
                    </motion.p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                        <button className={styles.demoBtn} onClick={() => openEnroll("Live Demo")}>
                            <PlayCircle size={20} /> Watch Free Demo
                        </button>
                    </div>

                    <div className={styles.statsContainer}>
                        {STATS.map((stat, i) => (
                            <div key={i} className={styles.statItem}>
                                {stat.icon}
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARTNERS MARQUEE */}
            <section className={styles.partnersSection}>
                <h3 style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', letterSpacing: '2px', fontSize: '0.9rem' }}>TRUSTED BY GLOBAL TEAMS</h3>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                            <div key={i} className={styles.partnerLogo}>
                                <Briefcase size={24} /> {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SALARY GROWTH CHART (Simulated) */}
            <section className={styles.salarySection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '2.5rem' }}>Skyrocket Your Earnings</h2>
                        <p className={styles.heroSubtitle}>Average salary growth of our alumni after completing the program.</p>
                    </div>

                    <div className={styles.chartContainer}>
                        <div className={styles.barGroup}>
                            <div className={styles.barValue}>4.5 LPA</div>
                            <div className={styles.bar} style={{ height: '30%' }}></div>
                            <div className={styles.barLabel}>Before</div>
                        </div>
                        <div className={styles.barGroup}>
                            <div className={styles.barValue}>12.0 LPA</div>
                            <div className={styles.bar} style={{ height: '60%', background: 'linear-gradient(to top, #8b5cf6, #a78bfa)' }}></div>
                            <div className={styles.barLabel}>Average</div>
                        </div>
                        <div className={styles.barGroup}>
                            <div className={styles.barValue}>45.0 LPA</div>
                            <div className={styles.bar} style={{ height: '100%', background: 'linear-gradient(to top, #10b981, #34d399)' }}></div>
                            <div className={styles.barLabel}>Highest</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES (Redesigned) */}
            <section className={styles.wallSection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>Wall of Fame</h2>
                        <p className={styles.heroSubtitle}>Real people. Real results. Real impact.</p>
                    </div>

                    <div className={styles.storyGrid}>
                        {SUCCESS_STORIES.map((story, i) => (
                            <motion.div
                                key={i}
                                className={styles.storyCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.profileImageWrapper}>
                                        <img src={story.image} alt={story.name} className={styles.storyImage} />
                                        <div className={styles.verifiedBadge} title="Verified Alumni">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                    <div className={styles.companyLogoPlaceholder}>
                                        {story.company}
                                    </div>
                                </div>

                                <h3 className={styles.storyName}>{story.name}</h3>
                                <div className={styles.storyRole}>{story.role} @ {story.company}</div>

                                <div className={styles.salaryHighlight}>
                                    <span className={styles.salaryLabel}>Package Achieved</span>
                                    <span className={styles.salaryValue}>{story.package}</span>
                                </div>

                                <p className={styles.storyQuote}>"{story.quote}"</p>

                                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
                                    <span style={{ fontSize: '0.8rem' }}>Prior Salary:</span>
                                    <span className={styles.prevSalary}>{story.prev}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLACEMENT PROCESS ROADMAP (New Feature) */}
            <section className={styles.roadmapSection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>How We Get You Hired</h2>
                        <p className={styles.heroSubtitle}>Our dedicated placement cell works with you at every step.</p>
                    </div>

                    <div className={styles.roadmapContainer}>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>01</div>
                            <h3 className={styles.stepTitle}>Profile Building</h3>
                            <p className={styles.stepDesc}>We help you craft a deadly resume and optimize your LinkedIn profile to attract recruiters.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>02</div>
                            <h3 className={styles.stepTitle}>Mock Interviews</h3>
                            <p className={styles.stepDesc}>15+ Mock interviews with industry experts to help you master technical and behavioral rounds.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>03</div>
                            <h3 className={styles.stepTitle}>Company Referrals</h3>
                            <p className={styles.stepDesc}>Our internal portal gives you direct referrals to our 500+ hiring partners.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>04</div>
                            <h3 className={styles.stepTitle}>Negotiation & Offer</h3>
                            <p className={styles.stepDesc}>We don't just get you an offer; we help you negotiate the best possible salary.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECRUITER VOICES (New Feature) */}
            <section className={styles.recruiterSection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '2.5rem' }}>What Hiring Managers Say</h2>
                        <p className={styles.heroSubtitle}>Why top companies prefer ByteCode graduates.</p>
                    </div>

                    <div className={styles.recruiterGrid}>
                        <div className={styles.recruiterCard}>
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" alt="Recruiter" className={styles.recruiterImage} />
                            <div className={styles.recruiterContent}>
                                <h4>James Wilson</h4>
                                <div className={styles.recruiterRole}>HR Director @ Flipkart</div>
                                <p className={styles.recruiterQuote}>"ByteCode students come with practical project experience that is rare to find in freshers. Changes our training timelines significantly."</p>
                            </div>
                        </div>
                        <div className={styles.recruiterCard}>
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" alt="Recruiter" className={styles.recruiterImage} />
                            <div className={styles.recruiterContent}>
                                <h4>Sarah Jenkins</h4>
                                <div className={styles.recruiterRole}>Tech Lead @ Swiggy</div>
                                <p className={styles.recruiterQuote}>"The system design knowledge these candidates possess is impressive. They are ready to deploy from Day 1."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* DEMO SECTION */}
            <section className="container">
                <div className={styles.demoSection}>
                    <h2 className={styles.heroTitle} style={{ fontSize: '2rem' }}>Not Sure Which Path To Choose?</h2>
                    <p className={styles.heroSubtitle} style={{ marginBottom: '2rem' }}>
                        Attend a free demo session with our lead instructors and see the magic happen live.
                    </p>
                    <button className={styles.demoBtn} onClick={() => openEnroll("Free Demo Session")}>
                        <Zap size={20} fill="currentColor" /> Book Your Free Demo
                    </button>
                </div>
            </section>

            <EnrollModal isOpen={showModal} onClose={() => setShowModal(false)} course={selectedCourse} />
            <HiredTicker />

            <Footer />
        </main>
    );
}

function EnrollModal({ isOpen, onClose, course }: any) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={styles.modalCard}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>

                    <h2 className={styles.modalTitle}>Start Your Journey</h2>
                    <p className={styles.modalSubtitle}>
                        {course ? `Registering for: ${course}` : "Take the first step towards your dream career."}
                    </p>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>Full Name</label>
                            <input type="text" className={styles.inputField} placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>Email Address</label>
                            <input type="email" className={styles.inputField} placeholder="rahul@example.com" />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.inputLabel}>Phone Number</label>
                            <input type="tel" className={styles.inputField} placeholder="+91 98765 43210" />
                        </div>

                        <button className={styles.submitBtn}>
                            Confirm Registration <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '5px' }} />
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function HiredTicker() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    setIndex((prev) => (prev + 1) % LIVE_HIRES.length);
                }, 500);
            }, 5000);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const current = LIVE_HIRES[index];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={styles.hiredToast}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                >
                    <div className={styles.toastIcon}>
                        <Zap size={24} />
                    </div>
                    <div className={styles.toastContent}>
                        <h4>{current.name} just got hired!</h4>
                        <p>{current.role} @ {current.company}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
