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
    { name: "Sai Kumar", role: "Systems Engineer", company: "TCS", package: "3.36 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Sai+Kumar&background=random", quote: "ByteCode helped me start my career with a strong foundation.", hike: 100 },
    { name: "Jagadesh", role: "Backend Developer", company: "Forsys", package: "4 LPA", prev: "Fresher", image: "/placements/Jagadesh.png", quote: "Practical projects gave me the edge during technical rounds.", hike: 120 },
    { name: "Venkatesh Y.", role: "Systems Engineer", company: "Infosys", package: "3.6 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Venkatesh+Y&background=random", quote: "The structured curriculum helped me crack the interview easily.", hike: 130 },
    { name: "Vamsi K", role: "Software Engineer", company: "Cognizant", package: "3.5 LPA", prev: "Fresher", image: "/placements/Vamsi-K.png", quote: "Step-by-step guidance made my transition into tech very smooth.", hike: 100 },
    { name: "Lakshmi Prasanna", role: "Project Engineer", company: "Wipro", package: "3.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Lakshmi+Prasanna&background=random", quote: "I am very happy with the placement support and guidance.", hike: 110 },
    { name: "Rajasekhar", role: "Full Stack Developer", company: "Accenture", package: "5 LPA", prev: "Fresher", image: "/placements/Rajasekhar.png", quote: "Direct mentorship from industry experts is invaluable.", hike: 150 },
    { name: "Srinivas Rao", role: "Software Engineer", company: "HCLTech", package: "4.25 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Srinivas+Rao&background=random", quote: "Good curriculum and mentors really made a difference.", hike: 140 },
    { name: "Manoj", role: "Associate Developer", company: "Absolute Labs", package: "5 LPA", prev: "Fresher", image: "/placements/Manoj.png", quote: "The platform's recursive training approach is truly unique.", hike: 150 },
    { name: "Ravi Teja", role: "Associate Software Engineer", company: "Tech Mahindra", package: "3.25 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Ravi+Teja&background=random", quote: "Got placed within 3 months of joining the course.", hike: 115 },
    { name: "Sampath", role: "Systems Engineer", company: "Accenture", package: "5 LPA", prev: "Fresher", image: "/placements/Sampath.png", quote: "Focusing on core fundamentals was the key to my success.", hike: 150 },
    { name: "Anusha Reddy", role: "App Development Assoc", company: "Accenture", package: "4.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Anusha+Reddy&background=random", quote: "Mock interviews were very helpful in boosting my confidence.", hike: 150 },
    { name: "Karthik", role: "Software Engineer", company: "Accenture", package: "4 LPA", prev: "Fresher", image: "/placements/Karthik.png", quote: "Mock interviews prepared me for exactly what to expect.", hike: 120 },
    { name: "Sai Krishna", role: "Programmer Analyst", company: "Cognizant", package: "4.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Sai+Krishna&background=random", quote: "The real-world projects gave me a lot of confidence.", hike: 125 },
    { name: "Prasad", role: "Associate Engineer", company: "Gemini", package: "3.5 LPA", prev: "Fresher", image: "/placements/Prasad.png", quote: "A great place for freshers to start their software journey.", hike: 100 },
    { name: "Bhanu Prakash", role: "Analyst", company: "Capgemini", package: "4.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Bhanu+Prakash&background=random", quote: "Thanks to the entire ByteCode team for this opportunity.", hike: 125 },
    { name: "Ganesh", role: "Software Engineer", company: "Tech Mahendra", package: "5 LPA", prev: "Fresher", image: "/placements/Ganesh-K.png", quote: "Curriculum is perfectly aligned with what the industry needs.", hike: 150 },
    { name: "Nagarjuna K.", role: "Graduate Trainee", company: "LTIMindtree", package: "5.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Nagarjuna+K&background=random", quote: "Excellent teaching and career support.", hike: 160 },
    { name: "Harish", role: "Developer", company: "Cloud Leaf L.L.C", package: "5 LPA", prev: "Fresher", image: "/placements/Harish-K.png", quote: "The hands-on assignments helped me understand complex concepts.", hike: 150 },
    { name: "Haritha G.", role: "Associate Professional", company: "DXC Technology", package: "4.2 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Haritha+G&background=random", quote: "Very supportive faculty and detailed coursework.", hike: 135 },
    { name: "Santhavana", role: "Software Engineer", company: "Cognizant", package: "4 LPA", prev: "Fresher", image: "/placements/Santhavana.png", quote: "I constant support from recruiters made a huge difference.", hike: 120 },
    { name: "Shiva Kumar", role: "Software Engineer Trainee", company: "Hexaware", package: "6.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Shiva+Kumar&background=random", quote: "I learned a lot here and it paid off.", hike: 180 },
    { name: "Phani B", role: "Junior Developer", company: "Centillion Networks", package: "3.5 LPA", prev: "Fresher", image: "/placements/Phani.png", quote: "The real-world project simulations were very helpful.", hike: 100 },
    { name: "Vamsi Krishna", role: "Associate Engineer", company: "Virtusa", package: "5.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Vamsi+Krishna&background=random", quote: "Good environment to learn and grow.", hike: 170 },
    { name: "Rishi", role: "Software Engineer", company: "Innovation Labs", package: "3.5 LPA", prev: "Fresher", image: "/placements/Rishi.png", quote: "Excellent training and great placement support.", hike: 100 },
    { name: "Swathi M.", role: "Engineer", company: "Tata Elxsi", package: "7.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Swathi+M&background=random", quote: "My dream job came true thanks to the team.", hike: 200 },
    { name: "Midhun", role: "Associate Developer", company: "Terralogic", package: "4 LPA", prev: "Fresher", image: "/placements/Midhun.png", quote: "I am grateful for the mentorship I received here.", hike: 120 },
    { name: "Naresh Babu", role: "Software Developer", company: "Happiest Minds", package: "6.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Naresh+Babu&background=random", quote: "Very professional training and placement process.", hike: 190 },
    { name: "marahor", role: "DevOps Associate", company: "Teachmint", package: "Competitive", prev: "Fresher", image: "/placements/Marohar.png", quote: "Transitioning to DevOps was made easy by ByteCode.", hike: 100 },
    { name: "Sravani P.", role: "Trainee Software Eng", company: "Mphasis", package: "4.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Sravani+P&background=random", quote: "Placement team is very good and helpful.", hike: 125 },
    { name: "Tejaswar", role: "Software Engineer", company: "Arcitech", package: "Competitive", prev: "Fresher", image: "/placements/Tejaswar.png", quote: "The technical depth covered in the course is impressive.", hike: 100 },
    { name: "Karthik Goud", role: "Software Engineer", company: "Cyient", package: "3.8 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Karthik+Goud&background=random", quote: "I improved my coding skills significantly.", hike: 118 },
    { name: "Divya", role: "Backend Engineer", company: "Nemali Software Solutions", package: "4 LPA", prev: "Fresher", image: "/placements/Divya.png", quote: "The focus on clean code and architecture was a game changer.", hike: 120 },
    { name: "Manasa V.", role: "Junior Engineer", company: "Zensar", package: "4.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Manasa+V&background=random", quote: "A truly transformational learning journey.", hike: 150 },
    { name: "Rishwitha", role: "Junior Developer", company: "Tech Solutions", package: "3.5 LPA", prev: "Fresher", image: "/placements/Rishwitha Nalgonda.png", quote: "Highly recommend for anyone looking to enter the IT industry.", hike: 100 },
    { name: "Pavan Kalyan", role: "Technical Associate", company: "Sonata Software", package: "4.0 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Pavan+Kalyan&background=random", quote: "Highly recommended platform for freshers.", hike: 130 },
    { name: "Gopi Chand", role: "Software Engineer", company: "ValueLabs", package: "5.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Gopi+Chand&background=random", quote: "Everything was perfect, from training to placement.", hike: 175 },
    { name: "Renuka Devi", role: "Associate Consultant", company: "Kellton", package: "3.5 LPA", prev: "Fresher", image: "https://ui-avatars.com/api/?name=Renuka+Devi&background=random", quote: "Thank you to the team for all the support.", hike: 110 }
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
        'Cognizant': '1',
        'Terralogic': '2',
        'Oracle': '3',
        'Absolute Labs': '4',
        'AbsoluteLabs': '4',
        'Forsys': '5',
        'SparxIT': '6',
        'Algoworks': '7',
        'DXMINDS': '8',
        'Nexgen': '9',
        'Honeywell': '10',
        'Deloitte': '11',
        'Cisco': '12',
        'ZenSar Technologies': '13',
        'ZenSar': '13',
        'ITC INFOTECH': '14',
        'Hexaware Technologies': '15',
        'HP': '16',
        'Mphasis': '17',
        'Mindtree': '18',
        'Wipro': '19',
        'DXC Technology': '24',
        'Dr. Reddy\'s': '21',
        'Salesforce': '22',
        'IBM': '23',
        'Facebook': '25',
        'AWS': '26',
        'Tech Mahindra': '27',
        'Tech Mahendra': '27',
        'Accenture': '28',
        'HCLTech': '29',
        'HCL': '29',
        'Arcitech': '31',
        'Cloud Leaf L.L.C': '32',
        'CloudLeaf': '32',
        'Teachmint': '33',
        'Centillion Networks': '34',
        'Centelon': '34',
        'Tech Solutions': '35',
        'Gemini': '36',
        'Amazon': '37',
        'Microsoft': '38',
        'Adobe': '39',
        'Uber': '40',
        'Cred': '41',
        'Zerodha': '42',
        'Netflix': '43',
        'Google Cloud': '44',
        'Google': '44',
        'Apple': '45',
        'Razorpay': '46',
        'Meta': '47',
        'Canva': '48',
        'Stripe': '49',
        'Walmart': '50',
        'Flipkart': '51',
        'Airbnb': '52',
        'Snowflake': '46',
        'PayPal': '51',
        'Nemali Software Solutions': '53',
        'Innovation Labs': '54'
    };

    const normalized = company.trim();
    const logoId = mapping[normalized] || String((Math.abs(deterministicHash(normalized)) % 54) + 1);
    const extension = logoId === '54' ? 'svg' : 'png';

    return `/CompanyLogos/${logoId}.${extension}`;
};

// Helper for hash
const deterministicHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
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
                                                style={story.company === 'Innovation Labs' ? { filter: 'brightness(0)' } : {}}
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
                <div className={styles.ambientGlow} style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }} />
                <h3 style={{ textAlign: 'center', color: '#64748b', marginBottom: '4rem', letterSpacing: '3px', fontSize: '0.9rem', fontWeight: 700, position: 'relative', zIndex: 5 }}>OUR HIRING & ACADEMIC PARTNERS</h3>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...Array(54), ...Array(54)].map((_, i) => {
                            const logoNumber = (i % 54) + 1;
                            const extension = logoNumber === 54 ? 'svg' : 'png';
                            return (
                                <div key={i} className={styles.partnerLogoWrapper}>
                                    <img
                                        src={`/CompanyLogos/${logoNumber}.${extension}`}
                                        alt={`Partner Logo ${logoNumber}`}
                                        className={styles.partnerLogoImage}
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
