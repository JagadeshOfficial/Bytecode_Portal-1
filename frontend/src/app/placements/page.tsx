"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import styles from './placements.module.css';
import { ArrowRight, Star, TrendingUp, Users, Building2, Globe, Award, Download, CheckCircle, ShieldCheck, Layers, Target, Zap, X, GraduationCap, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { getCompanyLogo } from '@/utils/logoUtils';
import { SUCCESS_STORIES } from '@/data/placements';
import SafeImage from '@/components/SafeImage';

const STATS = [
    { label: "Highest Package", value: 18, suffix: " LPA", icon: <Award size={32} color="#f59e0b" /> },
    { label: "Average Hike", value: 120, suffix: "%", icon: <TrendingUp size={32} color="#10b981" /> },
    { label: "Hiring Partners", value: 500, suffix: "+", icon: <Building2 size={32} color="#3b82f6" /> },
    { label: "Alumni Hired", value: 8500, suffix: "+", icon: <Users size={32} color="#8b5cf6" /> }
];

function CountUp({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const totalMiliseconds = duration * 1000;
        const incrementTime = 50;
        const totalIncrements = totalMiliseconds / incrementTime;
        const increment = end / totalIncrements;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <span className={styles.countUp}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

const PARTNERS = [
    "Google", "Microsoft", "Amazon", "Netflix", "Adobe", "Uber",
    "Atlassian", "Salesforce", "Oracle", "Cisco", "Intel", "IBM",
    "Flipkart", "Walmart", "Paytm", "Zomato", "Swiggy", "Cred"
];

const RECRUITER_VOICES = [
    { name: "James Wilson", role: "HR Director @ Flipkart", image: "https://i.pravatar.cc/150?u=jwilson", quote: "Bytecode graduates possess a rare architectural depth that slashes our onboarding 40%." },
    { name: "Sarah Jenkins", role: "Tech Lead @ Swiggy", image: "https://i.pravatar.cc/150?u=sjenkins", quote: "We prioritize these candidates for our Core Platform teams due to their systems knowledge." },
    { name: "Michael Chen", role: "SVP Engineering @ Zomato", image: "https://i.pravatar.cc/150?u=mchen", quote: "The problem-solving speed displayed by Bytecode alumni set them apart in our SDE-II rounds." },
    { name: "Anita Rao", role: "Talent Head @ Razorpay", image: "https://i.pravatar.cc/150?u=arao", quote: "Most freshers lack production context. Bytecode freshers are 'Deploy-Ready' on Day 1." },
    { name: "David Miller", role: "Head of Talent @ Amazon", image: "https://i.pravatar.cc/150?u=david", quote: "The curriculum here align perfectly with our Bar Raiser standards." },
    { name: "Elena Gilbert", role: "Engineering Manager @ Meta", image: "https://i.pravatar.cc/150?u=elena", quote: "We find candidates here who actually understand low-level systems and scalability." },
    { name: "Robert Downey", role: "CTO @ Ather Energy", image: "https://i.pravatar.cc/150?u=rob", quote: "Exceptional quality of engineers. The capstone projects are genuinely impressive." },
    { name: "Scarlett J.", role: "HR Head @ Netflix", image: "https://i.pravatar.cc/150?u=scarlett", quote: "Bytecode alumni are among the few who can handle Netflix's freedom and responsibility model." },
    { name: "Chris Evans", role: "SDE Lead @ Google", image: "https://i.pravatar.cc/150?u=chris", quote: "Their focus on algorithmic efficiency and data structures is world-class." }
];

const FAANG_DRILLS = [
    { title: "Real Interview Questions", icon: <Layers size={24} />, desc: "Weekly practice with actual questions asked in MNCs and top product companies." },
    { title: "Mock Interviews", icon: <Users size={24} />, desc: "Interviews conducted by senior engineers to remove your fear and build confidence." },
    { title: "Resume & HR Round Prep", icon: <TrendingUp size={24} />, desc: "Expert workshops on building a strong resume and cleverly clearing HR rounds." }
];

export default function Placements() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");

    // Calculator State
    const [salary, setSalary] = useState(600000);
    const [experience, setExperience] = useState("1-3 Years");
    const [domain, setDomain] = useState("Full Stack");
    const [projected, setProjected] = useState({ hike: 185, total: 1425000 });

    useEffect(() => {
        const baseMultiplier = domain === "AI / ML" ? 2.5 : domain === "DevOps" ? 2.2 : 2.0;
        const expBonus = experience === "0-1 Years (Fresher)" ? 1 : experience === "1-3 Years" ? 1.5 : experience === "3-5 Years" ? 2 : 2.5;

        const finalSalary = salary * baseMultiplier * (1 + (expBonus * 0.1));
        const hikePercent = ((finalSalary - salary) / salary) * 100;

        setProjected({
            hike: Math.round(hikePercent),
            total: Math.round(finalSalary)
        });
    }, [salary, experience, domain]);

    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles([...Array(15)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${Math.random() * 12 + 8}s`,
            delay: `${Math.random() * 5}s`
        })));
    }, []);

    const openEnroll = (course: string = "") => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    return (
        <main className={styles.main}>
            <Navbar />

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={`${styles.heroContainer} container`}>
                    <div className={styles.heroText}>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={styles.heroTitle}
                        >
                            Your First Job <br />
                            <span className={styles.heroHighlight}>is Waiting.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={styles.heroSubtitle}
                        >
                            FROM COMPLETE BEGINNERS TO HIGH-PAYING IT PROFESSIONALS. YOUR SUCCESS IS OUR REPUTATION.
                        </motion.p>
                    </div>

                    <div className={styles.heroVisual}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <Image 
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80" 
                                alt="Placement Success" 
                                width={600} 
                                height={500} 
                                className={styles.heroMainImg}
                            />
                        </motion.div>

                        <motion.div className={`${styles.achievementCard} ${styles.achieve1}`}>
                            <div className={styles.achieveIcon}><Award size={24} /></div>
                            <div className={styles.achieveText}>
                                <h4>18 LPA</h4>
                                <p>Highest Package</p>
                            </div>
                        </motion.div>

                        <motion.div className={`${styles.achievementCard} ${styles.achieve2}`}>
                            <div className={styles.achieveIcon}><Building2 size={24} /></div>
                            <div className={styles.achieveText}>
                                <h4>500+</h4>
                                <p>Hiring Partners</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 10, marginTop: '4rem' }}>
                    <div className={styles.statsContainer}>
                        {STATS.map((stat, i) => (
                            <div key={i} className={styles.statItem}>
                                <div className={styles.statIconWrapper}>{stat.icon}</div>
                                <span className={styles.statValue}>
                                    <CountUp end={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECENT PLACEMENTS - DYNAMIC GRID */}
            <section className={styles.wallSection} style={{ position: 'relative' }}>
                <div className={styles.scanline} />
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className={styles.bgParticle}
                            style={{
                                left: p.left,
                                top: p.top,
                                animationDuration: p.duration,
                                animationDelay: p.delay
                            }}
                        />
                    ))}
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.heroTitle}
                            style={{ fontSize: '3.5rem', textAlign: 'center' }}
                        >
                            Inspiring <span className={styles.heroHighlight}>Stories</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className={styles.heroSubtitle}
                            style={{ textAlign: 'center', margin: '0 auto' }}
                        >
                            See how students from non-IT backgrounds transformed their careers and secured high-paying jobs.
                        </motion.p>
                    </div>

                    <motion.div
                        className={styles.storyGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {SUCCESS_STORIES.map((story, i) => (
                            <motion.div
                                key={i}
                                className={styles.storyCard}
                                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const y = e.clientY - rect.top;
                                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                                }}
                                variants={{
                                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1 }
                                }}
                                whileHover={{ y: -20, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.profileImageWrapper}>
                                        <SafeImage
                                            src={story.image}
                                            name={story.name}
                                            alt={`${story.name} placed at ${story.company} after Bytecode Trainings course in Hyderabad`}
                                            fill
                                            className={styles.storyImage}
                                        />
                                        <div className={styles.verifiedBadge}>
                                            <ShieldCheck size={12} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={styles.storyName}>{story.name}</h3>
                                        <div className={styles.companyBadgeMini}>
                                            <Image
                                                src={getCompanyLogo(story.company)}
                                                alt={`${story.company} hiring partner at Bytecode Trainings`}
                                                width={80}
                                                height={30}
                                                style={{
                                                    objectFit: 'contain',
                                                    ...(story.company === 'Innovation Labs' ? { filter: 'brightness(0)' } : {})
                                                }}
                                                onError={(e: any) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.storyRole}>
                                    {story.role} @ <span style={{ color: 'var(--text-bright)', fontWeight: 700 }}>{story.company}</span>
                                </div>

                                <div className={styles.salaryHighlight}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className={styles.salaryLabel}>Package Achieved</span>
                                        <span className={styles.salaryValue}>
                                            {(() => {
                                                const match = story.package.match(/^([\d.]+)(.*)$/);
                                                if (match) {
                                                    return <CountUp end={parseFloat(match[1])} suffix={match[2]} duration={2} />;
                                                }
                                                return story.package;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                <p className={styles.storyQuote}>"{story.quote}"</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Target size={14} color="#3b82f6" />
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Prior: {story.prev}</span>
                                    </div>
                                    <ArrowRight size={18} color="#3b82f6" style={{ opacity: 0.5 }} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAANG DRILLS SECTION */}
            <section className={styles.faangSection}>
                <div className="container">
                    <div className={styles.faangGrid}>
                        <div className={styles.faangContent}>
                            <h2 className={styles.heroTitle} style={{ fontSize: '3rem', textAlign: 'left' }}>Interview Prep <span className={styles.heroHighlight}>Like No Other</span></h2>
                            <p className={styles.heroSubtitle} style={{ margin: '0 0 3rem' }}>WE TRAIN YOU EXPERTLY SO YOU CAN CRACK ANY INTERVIEW WITH CONFIDENCE.</p>

                            <div className={styles.drillList}>
                                {FAANG_DRILLS.map((drill, i) => (
                                    <div key={i} className={styles.drillItem}>
                                        <div className={styles.drillIcon}>{drill.icon}</div>
                                        <div>
                                            <h4>{drill.title}</h4>
                                            <p>{drill.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.faangImageWrap}>
                            <div className={styles.faangGlow} />
                            <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" alt="FAANG" fill style={{ objectFit: 'cover', borderRadius: '32px' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SALARY GROWTH PROJECTOR */}

            <section className={styles.salarySection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem', textAlign: 'center' }}>Check Your Salary <span className={styles.heroHighlight}>Potential</span></h2>
                        <p className={styles.heroSubtitle} style={{ textAlign: 'center', margin: '0 auto' }}>SEE HOW MUCH YOU CAN EARN AFTER COMPLETING OUR TRAINING.</p>
                    </div>

                    <div className={styles.calculatorCard}>
                        <div className={styles.calcLeft}>
                            <h3 className={styles.calcTitle}>Calculate Your Potential</h3>
                            <div className={styles.calcGroup}>
                                <label>Current Annual Salary</label>
                                <div className={styles.calcInputWrapper}>
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={salary}
                                        onChange={(e) => setSalary(Number(e.target.value))}
                                        placeholder="e.g. 600000"
                                    />
                                </div>
                            </div>
                            <div className={styles.calcGroup}>
                                <label>Years of Experience</label>
                                <select
                                    className={styles.calcSelect}
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                >
                                    <option>0-1 Years (Fresher)</option>
                                    <option>1-3 Years</option>
                                    <option>3-5 Years</option>
                                    <option>5+ Years</option>
                                </select>
                            </div>
                            <div className={styles.calcGroup}>
                                <label>Target Domain</label>
                                <div className={styles.calcTabs}>
                                    {["Full Stack", "AI / ML", "DevOps"].map(t => (
                                        <button
                                            key={t}
                                            className={domain === t ? styles.calcTabActive : styles.calcTab}
                                            onClick={() => setDomain(t)}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.calcRight}>
                            <div className={styles.resultCircle}>
                                <div className={styles.resultValue}>
                                    <CountUp end={projected.hike} suffix="%" />
                                </div>
                                <div className={styles.resultLabel}>Expected Hike</div>
                            </div>
                            <div className={styles.projectedSalary}>
                                <span>Projected Package</span>
                                <h4>₹{(projected.total / 100000).toFixed(2)} LPA</h4>
                            </div>
                            <button className={styles.demoBtn} style={{ width: '100%' }} onClick={() => openEnroll("Salary Projection")}>
                                Get This Package <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLACEMENT PROCESS ROADMAP */}
            <section className={styles.roadmapSection}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem', textAlign: 'center' }}>Your Pathway to <span className={styles.heroHighlight}>Placement</span></h2>
                        <p className={styles.heroSubtitle} style={{ textAlign: 'center', margin: '0 auto' }}>STEP-BY-STEP GUIDANCE TO SECURE YOUR DREAM IT JOB.</p>
                    </div>

                    <div className={styles.roadmapContainer}>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>01</div>
                            <h3 className={styles.stepTitle}>Profile Building</h3>
                            <p className={styles.stepDesc}>WE HELP YOU CRAFT A PROFESSIONAL RESUME AND OPTIMIZE YOUR LINKEDIN PROFILE TO ATTRACT RECRUITERS.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>02</div>
                            <h3 className={styles.stepTitle}>Mock Interviews</h3>
                            <p className={styles.stepDesc}>15+ MOCK INTERVIEWS WITH INDUSTRY EXPERTS TO HELP YOU MASTER TECHNICAL AND BEHAVIORAL ROUNDS.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>03</div>
                            <h3 className={styles.stepTitle}>Company Referrals</h3>
                            <p className={styles.stepDesc}>OUR INTERNAL PORTAL GIVES YOU DIRECT REFERRALS TO OUR 500+ HIRING PARTNERS.</p>
                        </div>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>04</div>
                            <h3 className={styles.stepTitle}>Negotiation & Offer</h3>
                            <p className={styles.stepDesc}>WE DON'T JUST GET YOU AN OFFER; WE HELP YOU NEGOTIATE THE BEST POSSIBLE SALARY.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RECRUITER INTELLIGENCE - HORIZONTAL MARQUEE */}
            <section className={styles.recruiterSection} style={{ overflow: 'hidden' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem', textAlign: 'center' }}>Why Companies <span className={styles.heroHighlight}>Hire Us</span></h2>
                        <p className={styles.heroSubtitle} style={{ textAlign: 'center', margin: '0 auto 4rem' }}>WHY TOP IT COMPANIES PREFER HIRING Bytecode TRAINED PROFESSIONALS.</p>
                    </div>
                </div>

                <div className={styles.horizontalMarquee}>
                    <div className={styles.horizontalTrackSlow}>
                        {[...RECRUITER_VOICES, ...RECRUITER_VOICES].map((rec, i) => (
                            <div key={i} className={styles.recruiterCard} style={{ minWidth: '450px' }}>
                                <div className={styles.recruiterHeader}>
                                    <Image src={rec.image} alt={rec.name} width={60} height={60} className={styles.recruiterImage} />
                                    <div>
                                        <h4>{rec.name}</h4>
                                        <div className={styles.recruiterRole}>{rec.role}</div>
                                    </div>
                                </div>
                                <p className={styles.recruiterQuote}>"{rec.quote}"</p>
                                <div className={styles.recruiterTrust}>
                                    <CheckCircle size={16} color="#10b981" /> Verified Partner
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* COLLEGES & PARTNERS LOGO SCROLL */}
            <section className={styles.partnersSection}>
                <div className={styles.ambientGlow} style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }} />
                <h3 style={{ textAlign: 'center', color: '#64748b', marginBottom: '4rem', letterSpacing: '3px', fontSize: '0.9rem', fontWeight: 700, position: 'relative', zIndex: 5 }}>OUR HIRING & ACADEMIC PARTNERS</h3>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...Array(54), ...Array(54)].map((_, i) => {
                            const logoNumber = (i % 54) + 1;
                            const extension = logoNumber === 54 ? 'svg' : 'png';
                            return (
                                <div key={i} className={styles.partnerLogoWrapper}>
                                    <Image
                                        src={`/CompanyLogos/${logoNumber}.${extension}`}
                                        alt={`Partner Logo ${logoNumber}`}
                                        width={150}
                                        height={60}
                                        className={styles.partnerLogoImage}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="container">
                <div className={styles.demoSection}>
                    <h2 className={styles.heroTitle} style={{ fontSize: '2rem' }}>Ready to Scale Your Career?</h2>
                    <p className={styles.heroSubtitle} style={{ marginBottom: '2rem' }}>
                        Attend a free demo session with our lead instructors and see the magic happen live.
                    </p>
                    <button className={styles.demoBtn} onClick={() => openEnroll("Free Demo Session")}>
                        <Zap size={20} fill="currentColor" /> Book Your Free Demo
                    </button>
                </div>
            </section>

            <EnrollModal isOpen={showModal} onClose={() => setShowModal(false)} course={selectedCourse} />

            <Footer />
        </main >
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
