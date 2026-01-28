"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './placements.module.css';
import { TrendingUp, Users, Building, Award, Briefcase, DollarSign, CheckCircle, ArrowRight, Zap, Target, X, PlayCircle, Layers } from 'lucide-react';
import Image from 'next/image';

const STATS = [
    { label: "Highest Package", value: 45, suffix: " LPA", icon: <Award size={32} color="#f59e0b" /> },
    { label: "Average Hike", value: 120, suffix: "%", icon: <TrendingUp size={32} color="#10b981" /> },
    { label: "Hiring Partners", value: 500, suffix: "+", icon: <Building size={32} color="#3b82f6" /> },
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

const SUCCESS_STORIES = [
    { name: "Vamsi Tammisetty", role: "Software Engineer", company: "Cognizant", package: "3.5 LPA", prev: "Fresher", image: "/placements/Vamsi-T.png", quote: "The foundation built here helped me crack my first tech role.", hike: 100 },
    { name: "Jagadesh", role: "Backend Developer", company: "Forsys", package: "4 LPA", prev: "Fresher", image: "/placements/Jagadesh.png", quote: "Practical projects gave me the edge during technical rounds.", hike: 120 },
    { name: "Vamsi K", role: "Software Engineer", company: "Cognizant", package: "3.5 LPA", prev: "Fresher", image: "/placements/Vamsi-K.png", quote: "Step-by-step guidance made my transition into tech very smooth.", hike: 100 },
    { name: "Rajasekhar", role: "Full Stack Developer", company: "Accenture", package: "5 LPA", prev: "Fresher", image: "/placements/Rajasekhar.png", quote: "Direct mentorship from industry experts is invaluable.", hike: 150 },
    { name: "Manoj", role: "Associate Developer", company: "Absolute Labs", package: "5 LPA", prev: "Fresher", image: "/placements/Manoj.png", quote: "The platform's recursive training approach is truly unique.", hike: 150 },
    { name: "Sampath", role: "Systems Engineer", company: "Accenture", package: "5 LPA", prev: "Fresher", image: "/placements/Sampath.png", quote: "Focusing on core fundamentals was the key to my success.", hike: 150 },
    { name: "Karthik", role: "Software Engineer", company: "Accenture", package: "4 LPA", prev: "Fresher", image: "/placements/Karthik.png", quote: "Mock interviews prepared me for exactly what to expect.", hike: 120 },
    { name: "Prasad", role: "Associate Engineer", company: "Gemini", package: "3.5 LPA", prev: "Fresher", image: "/placements/Prasad.png", quote: "A great place for freshers to start their software journey.", hike: 100 },
    { name: "Ganesh", role: "Software Engineer", company: "Tech Mahendra", package: "5 LPA", prev: "Fresher", image: "/placements/Ganesh-K.png", quote: "Curriculum is perfectly aligned with what the industry needs.", hike: 150 },
    { name: "Harish", role: "Developer", company: "Cloud Leaf L.L.C", package: "5 LPA", prev: "Fresher", image: "/placements/Harish-K.png", quote: "The hands-on assignments helped me understand complex concepts.", hike: 150 },
    { name: "Santhavana", role: "Software Engineer", company: "Cognizant", package: "4 LPA", prev: "Fresher", image: "/placements/Santhavana.png", quote: "I constant support from recruiters made a huge difference.", hike: 120 },
    { name: "Phani B", role: "Junior Developer", company: "Centillion Networks", package: "3.5 LPA", prev: "Fresher", image: "/placements/Phani.png", quote: "The real-world project simulations were very helpful.", hike: 100 },
    { name: "Rishi", role: "Software Engineer", company: "Innovation Labs", package: "3.5 LPA", prev: "Fresher", image: "/placements/Rishi.png", quote: "Excellent training and great placement support.", hike: 100 },
    { name: "Midhun", role: "Associate Developer", company: "Terralogic", package: "4 LPA", prev: "Fresher", image: "/placements/Midhun.png", quote: "I am grateful for the mentorship I received here.", hike: 120 },
    { name: "marahor", role: "DevOps Associate", company: "Teachmint", package: "Competitive", prev: "Fresher", image: "/placements/Marohar.png", quote: "Transitioning to DevOps was made easy by ByteCode.", hike: 100 },
    { name: "Tejaswar", role: "Software Engineer", company: "Arcitech", package: "Competitive", prev: "Fresher", image: "/placements/Tejaswar.png", quote: "The technical depth covered in the course is impressive.", hike: 100 },
    { name: "Divya", role: "Backend Engineer", company: "Nemali Software Solutions", package: "4 LPA", prev: "Fresher", image: "/placements/Divya.png", quote: "The focus on clean code and architecture was a game changer.", hike: 120 },
    { name: "Rishwitha", role: "Junior Developer", company: "Tech Solutions", package: "3.5 LPA", prev: "Fresher", image: "/placements/Rishwitha Nalgonda.png", quote: "Highly recommend for anyone looking to enter the IT industry.", hike: 100 },
    { name: "Rohan Das", role: "SDE-II", company: "Amazon", package: "45 LPA", prev: "3.5 LPA", image: "https://i.pravatar.cc/150?u=rohan", quote: "The system design modules were the key differentiator.", hike: 240 },
    { name: "Priya Sharma", role: "Data Scientist", company: "Microsoft", package: "38 LPA", prev: "Fresher", image: "https://i.pravatar.cc/150?u=priya", quote: "Mock interviews with actual MSFT engineers helped me kill my nervousness.", hike: 180 },
    { name: "Amit Patel", role: "DevOps Engineer", company: "Adobe", package: "28 LPA", prev: "6 LPA", image: "https://i.pravatar.cc/150?u=amit", quote: "Understanding Kubernetes depth was what got me this offer.", hike: 155 },
    { name: "Sneha Reddy", role: "Product Manager", company: "Uber", package: "35 LPA", prev: "12 LPA", image: "https://i.pravatar.cc/150?u=sneha", quote: "Strategic insights from the course made PM transition seamless.", hike: 190 },
    { name: "Vikram Singh", role: "Backend Lead", company: "Zerodha", package: "42 LPA", prev: "15 LPA", image: "https://i.pravatar.cc/150?u=vikram", quote: "High-scale systems architecture is something you only learn by doing.", hike: 180 },
    { name: "Arjun K.", role: "Full Stack Dev", company: "Cred", package: "26 LPA", prev: "4.5 LPA", image: "https://i.pravatar.cc/150?u=arjun", quote: "Frontend specialization with React & Next.js is top-notch.", hike: 210 },
    { name: "Megha S.", role: "Cloud Architect", company: "Google Cloud", package: "36 LPA", prev: "8 LPA", image: "https://i.pravatar.cc/150?u=megha", quote: "Secured Google Cloud Architect role in just 4 months of prep.", hike: 145 },
    { name: "Sanjay T.", role: "Backend Dev", company: "Netflix", package: "52 LPA", prev: "18 LPA", image: "https://i.pravatar.cc/150?u=sanjay", quote: "Distributed systems training prepared me perfectly for Netflix.", hike: 188 },
    { name: "Karan W.", role: "SDE-1", company: "Razorpay", package: "24 LPA", prev: "Fresher", image: "https://i.pravatar.cc/150?u=karan", quote: "The projects made my resume stand out even as a fresher.", hike: 175 },
    { name: "Nidhi B.", role: "AI Engineer", company: "Meta", package: "48 LPA", prev: "12 LPA", image: "https://i.pravatar.cc/150?u=nidhi", quote: "Cracked Meta's AI team purely on the basis of the capstone project.", hike: 300 },
    { name: "Rahul G.", role: "Security Eng.", company: "Apple", package: "40 LPA", prev: "10 LPA", image: "https://i.pravatar.cc/150?u=rahulg", quote: "Depth provided for Apple's rigorous security rounds was intense.", hike: 290 },
    { name: "Divya L.", role: "UI/UX lead", company: "Canva", package: "30 LPA", prev: "7 LPA", image: "https://i.pravatar.cc/150?u=divya", quote: "Design system training completely changed my product approach.", hike: 320 },
    { name: "Siddharth M.", role: "Machine Learning Eng.", company: "Tesla", package: "55 LPA", prev: "20 LPA", image: "https://i.pravatar.cc/150?u=sid", quote: "The computer vision modules are actually production-grade.", hike: 175 },
    { name: "Anjali P.", role: "Site Reliability Eng.", company: "Stripe", package: "44 LPA", prev: "14 LPA", image: "https://i.pravatar.cc/150?u=anjali", quote: "Foundational SRE concepts here are better than my university degree.", hike: 214 },
    { name: "Varun D.", role: "Lead Architect", company: "Oracle", package: "39 LPA", prev: "12 LPA", image: "https://i.pravatar.cc/150?u=varun", quote: "Oracle interviews are database-heavy; this course covers it all.", hike: 225 },
    { name: "Kavita J.", role: "React Developer", company: "Paypal", package: "22 LPA", prev: "Fresher", image: "https://i.pravatar.cc/150?u=kavita", quote: "The career cell pushed my profile into Paypal's fast-track hiring.", hike: 195 },
    { name: "Rajesh K.", role: "iOS Developer", company: "Spotify", package: "33 LPA", prev: "Fresher", image: "https://i.pravatar.cc/150?u=rajesh", quote: "Mobile systems optimization was something I learned only here.", hike: 200 },
    { name: "Ishita R.", role: "Data Engineer", company: "Snowflake", package: "29 LPA", prev: "5 LPA", image: "https://i.pravatar.cc/150?u=ishita", quote: "ETL pipelines and scale modules are extremely relevant to industry.", hike: 480 },
    { name: "Manish S.", role: "Frontend Lead", company: "Airbnb", package: "47 LPA", prev: "15 LPA", image: "https://i.pravatar.cc/150?u=manish", quote: "Architecture-first approach to frontend is what got me the role.", hike: 210 },
    { name: "Pooja V.", role: "Product Analyst", company: "Walmart", package: "26 LPA", prev: "Fresher", image: "https://i.pravatar.cc/150?u=pooja", quote: "Analytical thinking drills are superior to traditional courses.", hike: 180 },
    { name: "Harish N.", role: "Systems Engineer", company: "Cisco", package: "31 LPA", prev: "10 LPA", image: "https://i.pravatar.cc/150?u=harish", quote: "Networking depth in the devops module is enterprise-grade.", hike: 210 },
    { name: "Simran T.", role: "UI Developer", company: "Flipkart", package: "20 LPA", prev: "3.5 LPA", image: "https://i.pravatar.cc/150?u=simran", quote: "My portfolio got verified by ByteCode leads, which opened doors.", hike: 470 }
];

const RECRUITER_VOICES = [
    { name: "James Wilson", role: "HR Director @ Flipkart", image: "https://i.pravatar.cc/150?u=jwilson", quote: "ByteCode graduates possess a rare architectural depth that slashes our onboarding 40%." },
    { name: "Sarah Jenkins", role: "Tech Lead @ Swiggy", image: "https://i.pravatar.cc/150?u=sjenkins", quote: "We prioritize these candidates for our Core Platform teams due to their systems knowledge." },
    { name: "Michael Chen", role: "SVP Engineering @ Zomato", image: "https://i.pravatar.cc/150?u=mchen", quote: "The problem-solving speed displayed by ByteCode alumni set them apart in our SDE-II rounds." },
    { name: "Anita Rao", role: "Talent Head @ Razorpay", image: "https://i.pravatar.cc/150?u=arao", quote: "Most freshers lack production context. ByteCode freshers are 'Deploy-Ready' on Day 1." },
    { name: "David Miller", role: "Head of Talent @ Amazon", image: "https://i.pravatar.cc/150?u=david", quote: "The curriculum here align perfectly with our Bar Raiser standards." },
    { name: "Elena Gilbert", role: "Engineering Manager @ Meta", image: "https://i.pravatar.cc/150?u=elena", quote: "We find candidates here who actually understand low-level systems and scalability." },
    { name: "Robert Downey", role: "CTO @ Ather Energy", image: "https://i.pravatar.cc/150?u=rob", quote: "Exceptional quality of engineers. The capstone projects are genuinely impressive." },
    { name: "Scarlett J.", role: "HR Head @ Netflix", image: "https://i.pravatar.cc/150?u=scarlett", quote: "ByteCode alumni are among the few who can handle Netflix's freedom and responsibility model." },
    { name: "Chris Evans", role: "SDE Lead @ Google", image: "https://i.pravatar.cc/150?u=chris", quote: "Their focus on algorithmic efficiency and data structures is world-class." }
];

const FAANG_DRILLS = [
    { title: "System Design Drills", icon: <Layers size={24} />, desc: "Weekly deep dives into Netflix, Uber, and WhatsApp architectures." },
    { title: "Mock FANG Floor", icon: <Users size={24} />, desc: "Interviews conducted by engineers currently working at Google, Meta, and Amazon." },
    { title: "Salary Negotiation", icon: <TrendingUp size={24} />, desc: "Expert workshops on counter-offering and decoding equity/stock components." }
];


const getCompanyLogo = (company: string) => {
    const mapping: { [key: string]: string } = {
        'Google': '1',
        'Microsoft': '2',
        'Amazon': '5',
        'Netflix': '4',
        'Adobe': '3',
        'Uber': '6',
        'Meta': '7',
        'Apple': '8'
    };

    if (mapping[company]) {
        return `/CompanyLogos/${mapping[company]}.png`;
    }

    // Deterministic hash to map any company to one of the 29 logos
    let hash = 0;
    for (let i = 0; i < company.length; i++) {
        hash = company.charCodeAt(i) + ((hash << 5) - hash);
    }
    const logoNumber = (Math.abs(hash) % 29) + 1;
    return `/CompanyLogos/${logoNumber}.png`;
};

export default function Placements() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");

    // Calculator State
    const [salary, setSalary] = useState(600000);
    const [experience, setExperience] = useState("1-3 Years");
    const [domain, setDomain] = useState("Full Stack");
    const [projected, setProjected] = useState({ hike: 185, total: 1425000 });

    useEffect(() => {
        let baseMultiplier = domain === "AI / ML" ? 2.5 : domain === "DevOps" ? 2.2 : 2.0;
        let expBonus = experience === "0-1 Years (Fresher)" ? 1 : experience === "1-3 Years" ? 1.5 : experience === "3-5 Years" ? 2 : 2.5;

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
                        TRANSFORMING ENGINEERING CAREERS THROUGH INSTITUTIONAL EXCELLENCE AND FANG-GRADE MENTORSHIP.
                    </motion.p>

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
                            style={{ fontSize: '3.5rem' }}
                        >
                            Elite <span className={styles.heroHighlight}>Network</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className={styles.heroSubtitle}
                        >
                            Advanced outcomes from our institutional ecosystem.
                            Showcasing {SUCCESS_STORIES.length} verified excellence transitions.
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
                                        <img src={story.image} alt={story.name} className={styles.storyImage} />
                                        <div className={styles.verifiedBadge} title="Verified Alumni">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                    <div className={styles.nameHeader}>
                                        <h3 className={styles.storyName}>{story.name}</h3>
                                        <div className={styles.companyBadgeMini}>
                                            <img
                                                src={getCompanyLogo(story.company)}
                                                alt={story.company}
                                                onError={(e: any) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.storyRole}>
                                    {story.role} @ <span style={{ color: '#fff', fontWeight: 700 }}>{story.company}</span>
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
                                    <div className={styles.hikeBadge}>+ <CountUp end={story.hike} suffix="%" duration={3} /> Hike</div>
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
                            <h2 className={styles.heroTitle} style={{ fontSize: '3rem', textAlign: 'left' }}>FANG <span className={styles.heroHighlight}>Intelligence</span></h2>
                            <p className={styles.heroSubtitle} style={{ margin: '0 0 3rem' }}>REVERSE-ENGINEERING THE INTERVIEW PROCESS FOR WORLD-CLASS ENGINEERING ORGANIZATIONS.</p>

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
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>Dynamic Growth <span className={styles.heroHighlight}>Projector</span></h2>
                        <p className={styles.heroSubtitle}>SIMULATE YOUR CAREER TRAJECTORY BASED ON INSTITUTIONAL CURRICULUM DATA.</p>
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
                        <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>Institutional <span className={styles.heroHighlight}>Pathway</span></h2>
                        <p className={styles.heroSubtitle}>SYSTEMATIC PROCESS TO TRANSITION INTO TIER-1 ENGINEERING TEAMS.</p>
                    </div>

                    <div className={styles.roadmapContainer}>
                        <div className={styles.roadmapStep}>
                            <div className={styles.stepNumber}>01</div>
                            <h3 className={styles.stepTitle}>Profile Building</h3>
                            <p className={styles.stepDesc}>WE HELP YOU CRAFT A DEADLY RESUME AND OPTIMIZE YOUR LINKEDIN PROFILE TO ATTRACT RECRUITERS.</p>
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
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className={styles.heroTitle} style={{ fontSize: '3rem' }}>Recruiter <span className={styles.heroHighlight}>Intelligence</span></h2>
                    <p className={styles.heroSubtitle}>WHY TOP COMPANIES PREFER BYTECODE GRADUATES FOR CRITICAL ENGINEERING ROLES.</p>
                </div>

                <div className={styles.horizontalMarquee}>
                    <div className={styles.horizontalTrackSlow}>
                        {[...RECRUITER_VOICES, ...RECRUITER_VOICES].map((rec, i) => (
                            <div key={i} className={styles.recruiterCard} style={{ minWidth: '450px' }}>
                                <div className={styles.recruiterHeader}>
                                    <img src={rec.image} alt={rec.name} className={styles.recruiterImage} />
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
                <h3 style={{ textAlign: 'center', color: '#64748b', marginBottom: '4rem', letterSpacing: '3px', fontSize: '0.9rem', fontWeight: 700 }}>OUR HIRING & ACADEMIC PARTNERS</h3>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...Array(29), ...Array(29)].map((_, i) => (
                            <div key={i} className={styles.partnerLogoWrapper}>
                                <img
                                    src={`/CompanyLogos/${(i % 29) + 1}.png`}
                                    alt={`Partner Logo ${(i % 29) + 1}`}
                                    className={styles.partnerLogoImage}
                                />
                            </div>
                        ))}
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
