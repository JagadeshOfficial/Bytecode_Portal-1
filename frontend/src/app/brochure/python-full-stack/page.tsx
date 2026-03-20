"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, Phone, Mail, MapPin,
    Rocket, Star, Globe, ShieldCheck, Zap,
    FileDown, ExternalLink, ChevronRight, Award,
    Users, Target, BookOpen, Layers, Check, Database, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './brochure.module.css';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import RelatedCourses from '@/components/RelatedCourses';

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
        'Mphasis': '24', // Corrected to match placement cards if needed, but using existing mapping
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
        'Centelon Networks': '34',
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

const deterministicHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

export default function PythonFullStackBrochure() {
    const router = useRouter();
    const brochureRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!brochureRef.current) return;
        const canvas = await html2canvas(brochureRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Bytecode-Python-Full-Stack-Brochure.pdf');
    };

    const Header = ({ pageNum }: { pageNum: string }) => (
        <div className={styles.header}>
            <Image src="/logo.png" alt="Bytecode" width={120} height={40} className={styles.logo} />
            <div className={styles.pageNumber}>PAGE {pageNum}</div>
        </div>
    );

    return (
        <div className={styles.brochureContainer}>
            <nav className={styles.nav}>
                <button className={styles.exitBtn} onClick={() => router.back()}>Exit</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.exitBtn} onClick={downloadPDF} style={{ background: '#27ae60' }}>Download PDF</button>
                    <button className={styles.exitBtn} style={{ background: '#f39200' }} onClick={() => router.push('/payment?course=Python+Full+Stack&fee=45000')}>Enroll Now</button>
                </div>
            </nav>

            <div ref={brochureRef}>
                {/* PAGE 1: VERTICAL MASTER COVER */}
                <section className={styles.heroPage}>
                    <div className={styles.verticalSidebar}>
                        <Image src="/logo.png" className={styles.logoMini} alt="Logo" width={100} height={30} />
                        <div className={styles.verticalPillars}>
                            {[
                                { Icon: Layers, label: "Technical" },
                                { Icon: Users, label: "Soft Skills" },
                                { Icon: BookOpen, label: "Coding" },
                                { Icon: ShieldCheck, label: "Interview" },
                                { Icon: Target, label: "Placement" }
                            ].map((pillar, i) => (
                                <div key={i} className={styles.verticalPillarItem}>
                                    <div className={styles.verticalPillarCircle}>
                                        <pillar.Icon size={24} />
                                    </div>
                                    <span>{pillar.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.mainVerticalContent}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <div className={styles.pageNumber}>OFFICIAL BROCHURE V2.0</div>
                        </div>

                        <div className={styles.masterBranding}>
                            <h1 className={styles.masterTitle}>Bytecode</h1>
                            <div className={styles.masterTagline}>TRAININGS & PLACEMENTS</div>
                        </div>

                        <div className={styles.masterHeadline}>
                            <h2>PYTHON FULL STACK <br /> ENGINEERING</h2>
                            <p>
                                Ignite your potential with India's most comprehensive job-oriented architecture.
                                Master everything from backend fundamentals to enterprise-grade cloud systems.
                            </p>
                        </div>

                        <div className={styles.masterStatsGrid}>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>100%</div>
                                <div className={styles.masterStatLabel}>Success Rate</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>24 LPA+</div>
                                <div className={styles.masterStatLabel}>Highest Pkg</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>300+</div>
                                <div className={styles.masterStatLabel}>Hiring Partners</div>
                            </div>
                        </div>


                    </div>

                    <div className={styles.masterHeroPart}>
                        <Image src="/hero-cover.png" className={styles.masterHeroImg} alt="Hero" width={800} height={600} />
                    </div>
                </section>

                {/* PAGE 2: PROGRAM HIGHLIGHTS */}
                <section className={styles.page}>
                    <Header pageNum="02" />
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>Your Complete Python Full Stack Journey</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Zero to employed. We support you the whole way.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                Bytecode Trainings & Placements is a trusted institute offering high-quality training in
                                Python Full Stack Development. Our program is designed to equip students and fresh graduates
                                with the skills needed to succeed in the IT industry.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {[
                                    { t: "Beginner Friendly", d: "Start from scratch, no experience needed." },
                                    { t: "Interview Prep", d: "Practice genuine interview patterns." },
                                    { t: "Live Projects", d: "Build a strong portfolio." },
                                    { t: "Internship Certificate", d: "Boost your resume." }
                                ].map((h, i) => (
                                    <div key={i}>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>{h.t}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{h.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop" alt="Cover Image" style={{ borderRadius: '20px', width: '100%' }} width={600} height={400} />
                    </div>
                </section>

                {/* PAGE 3: THE FUTURE */}
                <section className={styles.page}>
                    <Header pageNum="03" />
                    <div className={styles.futurePageWrapper}>
                        <div className={styles.futureHeader}>
                            <h2>BUILD YOUR FUTURE IN TECH</h2>
                            <p>Global Market Insights & Career Scope</p>
                        </div>

                        <div className={styles.insightGrid}>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Target size={40} /></div>
                                <h3>Careers on the Rise</h3>
                                <p>60,000+ Active Job Openings for Django, React, and Full Stack Master Engineers.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Award size={40} /></div>
                                <h3>Salary Packages</h3>
                                <p>Starting from 8 LPA to over 24 LPA+ for developers with elite architectural skills.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><ShieldCheck size={40} /></div>
                                <h3>Global Growth</h3>
                                <p>75% expected growth in Full Stack engineering roles by 2028 across major tech hubs.</p>
                            </div>
                        </div>

                        <div className={styles.whyPanelLuxury}>
                            <div className={styles.whyContent}>
                                <h2>Why <br /> Bytecode?</h2>
                                <div className={styles.benefitGrid}>
                                    {[
                                        "Master In-Demand Tech: Django, React, AWS",
                                        "Official Industry Recognized Certifications",
                                        "LeetCode & GitHub Profile Building",
                                        "Direct Placement Access to 300+ Partners"
                                    ].map((benefit, idx) => (
                                        <div key={idx} className={styles.benefitItem}>
                                            <CheckCircle2 className={styles.checkIcon} size={24} />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.luxuryImageWrapper}>
                                <div className={styles.floatingAura}></div>
                                <div className={styles.luxuryImageFrame}>
                                    <img
                                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                                        className={styles.luxuryImage}
                                        alt="Professional Institutional Environment"
                                    />
                                    <div className={styles.achievementTag}>Best Placements</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.eliteMetricsBar}>
                            {[
                                { Icon: Rocket, value: "100%", label: "Job Ready" },
                                { Icon: Zap, value: "Elite", label: "Tech Stack" },
                                { Icon: Globe, value: "Global", label: "Trained" },
                                { Icon: Award, value: "Top 1%", label: "Curriculum" }
                            ].map((metric, i) => (
                                <div key={i} className={styles.eliteMetricItem}>
                                    <div className={styles.eliteMetricCircle}>
                                        <metric.Icon size={40} />
                                    </div>
                                    <div className={styles.eliteMetricValue}>{metric.value}</div>
                                    <div className={styles.eliteMetricLabel}>{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PAGE 4: ZENITH JOB READINESS PATH */}
                <section className={styles.page}>
                    <Header pageNum="04" />
                    <div className={styles.roadmapPage}>
                        <div className={styles.roadmapHeader}>
                            <h2>100% JOB READINESS PATH</h2>
                            {/* Visual Guarantee Pipeline */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', margin: '1.5rem 0 2rem', padding: '1.2rem', background: 'rgba(0,0,0,0.15)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {[
                                    { step: '1', label: 'Skill Training', color: '#4f46e5' },
                                    { step: '2', label: 'Real Projects', color: '#7c3aed' },
                                    { step: '3', label: 'Resume Build', color: '#0ea5e9' },
                                    { step: '4', label: 'Mock Interviews', color: '#10b981' },
                                    { step: '5', label: 'Job Drive', color: '#f59e0b' },
                                ].map((s, i, arr) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '0 12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: '#fff', boxShadow: `0 0 12px ${s.color}88` }}>{s.step}</div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#cbd5e1', textAlign: 'center', whiteSpace: 'nowrap' }}>{s.label}</span>
                                        </div>
                                        {i < arr.length - 1 && <div style={{ width: '24px', height: '2px', background: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.roadmapSplit}>
                            <div className={styles.roadmapList}>
                                {[
                                    {
                                        n: "01",
                                        t: "Corporate Offline Training",
                                        d: "Intensive in-person learning in a corporate environment designed to simulate real-world office dynamics.",
                                        c: "#003087"
                                    },
                                    {
                                        n: "02",
                                        t: "Industry Mentorship",
                                        d: "Direct guidance from senior architects and engineering leads who have built enterprise-scale systems.",
                                        c: "#27ae60"
                                    },
                                    {
                                        n: "03",
                                        t: "Hands-on Experience with Projects",
                                        d: "End-to-end development of production-ready applications, following Agile and DevOps methodologies.",
                                        c: "#d63031"
                                    },
                                    {
                                        n: "04",
                                        t: "Comprehensive Placement Prep",
                                        d: "Rigorous mock interviews, resume engineering, and profile building on LeetCode & GitHub.",
                                        c: "#f39200"
                                    }
                                ].map((step, i) => (
                                    <div key={i} className={styles.roadmapItem}>
                                        <div className={styles.roadmapBadge} style={{ background: step.c }}>
                                            <span>STEP</span>
                                            <strong>{step.n}</strong>
                                        </div>
                                        <div className={styles.roadmapStepInfo}>
                                            <h3>{step.t}</h3>
                                            <p>{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.roadmapImageFrame}>
                                <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Mentor" width={600} height={400} />
                                <div className={styles.roadmapImageOverlay}>
                                    <h4>Expert Mentorship</h4>
                                    <p>Zero to employed. We support you the whole way.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 5: ADVANCED SKILLS UNIVERSE */}
                <section className={styles.page}>
                    <Header pageNum="05" />
                    <div className={styles.skillsUniverse}>
                        <div className={styles.skillsHeader}>
                            <h2>ELITE TECH STACK & TOOLS</h2>
                            <p>Master 25+ High-Demand Industry Standard Technologies</p>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>Full Stack & Emerging Tech</h3>
                                <div className={styles.skillCountTag}>12 Core Modules</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'Python', p: 'python/python-original.svg' },
                                    { s: 'Django', p: 'django/django-plain.svg' },
                                    { s: 'React', p: 'react/react-original.svg' },
                                    { s: 'Next.js', p: 'nextjs/nextjs-original.svg' },
                                    { s: 'FastAPI', p: 'fastapi/fastapi-original.svg' },
                                    { s: 'HTML5', p: 'html5/html5-original.svg' },
                                    { s: 'CSS3', p: 'css3/css3-original.svg' },
                                    { s: 'JavaScript', p: 'javascript/javascript-original.svg' },
                                    { s: 'TypeScript', p: 'typescript/typescript-original.svg' },
                                    { s: 'Redux', p: 'redux/redux-original.svg' },
                                    { s: 'PostgreSQL', p: 'postgresql/postgresql-original.svg' },
                                    { s: 'Redis', p: 'redis/redis-original.svg' }
                                ].map(tech => (
                                    <div key={tech.s} className={styles.skillItemLuxury}>
                                        <div className={styles.skillLogoBox}>
                                            <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.p}`} alt={tech.s} />
                                        </div>
                                        <div className={styles.skillName}>{tech.s}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>Infra & Architectural Tools</h3>
                                <div className={styles.skillCountTag}>8 Professional Tools</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'AWS', p: 'amazonwebservices/amazonwebservices-original-wordmark.svg' },
                                    { s: 'Docker', p: 'docker/docker-original.svg' },
                                    { s: 'Git', p: 'git/git-original.svg' },
                                    { s: 'GitHub', p: 'github/github-original.svg' },
                                    { s: 'Linux', p: 'linux/linux-original.svg' },
                                    { s: 'Vercel', p: 'vercel/vercel-original.svg' },
                                    { s: 'Jenkins', p: 'jenkins/jenkins-original.svg' },
                                    { s: 'Nginx', p: 'nginx/nginx-original.svg' }
                                ].map(tech => (
                                    <div key={tech.s} className={styles.skillItemLuxury}>
                                        <div className={styles.skillLogoBox}>
                                            <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.p}`} alt={tech.s} />
                                        </div>
                                        <div className={styles.skillName}>{tech.s}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.readinessMasterWrap}>

                            <div className={styles.readinessFeatureBar}>
                                {[
                                    {
                                        i: Globe,
                                        t: "Global Standard",
                                        d: "Architectural patterns used by world-class engineering teams."
                                    },
                                    {
                                        i: ShieldCheck,
                                        t: "Secure Coding",
                                        d: "End-to-end security protocols for production systems."
                                    },
                                    {
                                        i: Users,
                                        t: "Team Mock Prep",
                                        d: "Intensive peer-to-peer interview simulations."
                                    }
                                ].map((feat, i) => (
                                    <div key={i} className={styles.readinessFeatureItem}>
                                        <div className={styles.featureIconCircle}>
                                            <feat.i size={28} />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h5>{feat.t}</h5>
                                            <p>{feat.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 6: ELITE CURRICULUM - FRONTEND */}
                <section className={styles.page}>
                    <Header pageNum="06" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>FRONTEND ARCHITECTURE</h2>
                            <p>Modern Web Ecosystem</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "01",
                                    t: "UI/UX Foundation",
                                    p: ["HTML5 Semantic Tags", "CSS3 Flex & Grid Master", "Responsive Web Design", "Animations (Framer/GSAP)"],
                                    tech: ["HTML5", "CSS3"]
                                },
                                {
                                    n: "02",
                                    t: "JavaScript ES2026+",
                                    p: ["Asynchronous Mechanisms", "Prototypes & Closures", "Modular Architecture", "Build Systems (Vite)"],
                                    tech: ["JS", "TS"]
                                },
                                {
                                    n: "03",
                                    t: "React & Next.js",
                                    p: ["Hooks & Context API", "Server Actions", "App Router Mastery", "SSR & ISR Patterns"],
                                    tech: ["React", "Next.js"]
                                },
                                {
                                    n: "04",
                                    t: "State Management",
                                    p: ["Redux Toolkit Workflow", "TanStack (React Query)", "Zustand Global State", "Real-time WebSockets"],
                                    tech: ["Redux", "Query"]
                                }
                            ].map((mod, i) => (
                                <div key={i} className={styles.moduleCardLuxury}>
                                    <div className={styles.moduleMeta}>
                                        <div className={styles.moduleNumber}>{mod.n}</div>
                                        <div className={styles.moduleTitle}>
                                            <h3>{mod.t}</h3>
                                        </div>
                                    </div>
                                    <ul className={styles.modulePoints}>
                                        {mod.p.map((point, pi) => (
                                            <li key={pi}>
                                                <div className={styles.pointIcon}><ChevronRight size={14} /></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.moduleFooter}>
                                        <div className={styles.moduleTech}>
                                            {mod.tech.map((t, ti) => (
                                                <div key={ti} className={styles.techTagMini}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Frontend Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>02</div>
                                <span>Backend Logic</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 7: ELITE CURRICULUM - BACKEND */}
                <section className={styles.page}>
                    <Header pageNum="07" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>BACKEND MASTERY</h2>
                            <p>Pythonic Engineering</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "05",
                                    t: "Python Core",
                                    p: ["CPython Internals & GIL", "Meta-programming", "Asyncio Mechanics", "Dependency (Poetry)"],
                                    tech: ["Python", "Core"]
                                },
                                {
                                    n: "06",
                                    t: "Django Enterprise",
                                    p: ["ORM Performance Tuning", "Custom Middleware", "DRF Mastery", "JWT & OAuth2 Auth"],
                                    tech: ["Django", "DRF"]
                                },
                                {
                                    n: "07",
                                    t: "High Perf APIs",
                                    p: ["FastAPI Type Safety", "Injection Patterns", "Background Tasks", "Scalable Swagger"],
                                    tech: ["FastAPI", "Async"]
                                },
                                {
                                    n: "08",
                                    t: "System Design",
                                    p: ["Microservices Concepts", "Rate Limiting", "Caching Strategies", "Nginx Configuration"],
                                    tech: ["Architecture"]
                                }
                            ].map((mod, i) => (
                                <div key={i} className={styles.moduleCardLuxury}>
                                    <div className={styles.moduleMeta}>
                                        <div className={styles.moduleNumber}>{mod.n}</div>
                                        <div className={styles.moduleTitle}>
                                            <h3>{mod.t}</h3>
                                        </div>
                                    </div>
                                    <ul className={styles.modulePoints}>
                                        {mod.p.map((point, pi) => (
                                            <li key={pi}>
                                                <div className={styles.pointIcon}><ChevronRight size={14} /></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.moduleFooter}>
                                        <div className={styles.moduleTech}>
                                            {mod.tech.map((t, ti) => (
                                                <div key={ti} className={styles.techTagMini}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Frontend Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Backend Logic</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>03</div>
                                <span>Cloud & Ops</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ELITE CURRICULUM - DATA & OPS */}
                <section className={styles.page}>
                    <Header pageNum="08" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>DATA & DEPLOYMENT</h2>
                            <p>Enterprise Scalability</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "09",
                                    t: "Database Engineering",
                                    p: ["SQL Injection Prevention", "Complex CTEs", "Indexing & Sharding", "Normalization Master"],
                                    tech: ["SQL", "NoSQL"]
                                },
                                {
                                    n: "10",
                                    t: "DevOps Logic",
                                    p: ["Docker Orchestration", "CI/CD Pipelines", "Nginx Proxy", "SSL & Domain Setup"],
                                    tech: ["Docker", "Linux"]
                                },
                                {
                                    n: "11",
                                    t: "Cloud (AWS)",
                                    p: ["EC2 Deployment", "RDS Instance Mgmt", "S3 Storage Service", "Lambda Serverless"],
                                    tech: ["AWS", "Cloud"]
                                },
                                {
                                    n: "12",
                                    t: "Elite Soft Skills",
                                    p: ["Agile/Scrum Teams", "Project Planning", "Mock Prep Mastery", "LinkedIn Engineering"],
                                    tech: ["Industry"]
                                }
                            ].map((mod, i) => (
                                <div key={i} className={styles.moduleCardLuxury}>
                                    <div className={styles.moduleMeta}>
                                        <div className={styles.moduleNumber}>{mod.n}</div>
                                        <div className={styles.moduleTitle}>
                                            <h3>{mod.t}</h3>
                                        </div>
                                    </div>
                                    <ul className={styles.modulePoints}>
                                        {mod.p.map((point, pi) => (
                                            <li key={pi}>
                                                <div className={styles.pointIcon}><ChevronRight size={14} /></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className={styles.moduleFooter}>
                                        <div className={styles.moduleTech}>
                                            {mod.tech.map((t, ti) => (
                                                <div key={ti} className={styles.techTagMini}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Frontend Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Backend Logic</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Cloud & Ops</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 09: ELITE REAL-WORLD PROJECTS */}
                <section className={styles.page}>
                    <Header pageNum="09" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>REAL-WORLD PROJECTS</h2>
                            <p>Build a portfolio that gets you hired.</p>
                        </div>

                        <div className={styles.projectGridLuxury}>
                            {[
                                {
                                    t: "E-Commerce Engine",
                                    d: "High-scale architecture with payment vaulting & intelligent inventory scaling.",
                                    tech: "Django, React, Redis"
                                },
                                {
                                    t: "SaaS CRM Analytics",
                                    d: "Enterprise board featuring real-time lead tracking & predictive visualization.",
                                    tech: "Next.js, FastAPI, PG"
                                },
                                {
                                    t: "Banking Secure Hub",
                                    d: "Military-grade transaction security with multi-sig auth protocols.",
                                    tech: "Python, Docker, AWS"
                                },
                                {
                                    t: "Chat Matrix Sync",
                                    d: "Distributed socket server handling massive concurrent user sync.",
                                    tech: "WebSockets, Redis"
                                }
                            ].map((pj, i) => (
                                <div key={i} className={styles.projectCardLuxury}>
                                    <div className={styles.projectTechHeader}>{pj.tech}</div>
                                    <h3>{pj.t}</h3>
                                    <p>{pj.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.journeyStripLuxury}>
                            <h4>How We Prepare You For Success</h4>
                            <div className={styles.journeyGrid}>
                                {[
                                    { s: "2 Hrs", t: "BUILD FOCUS", d: "Hands-on Code" },
                                    { s: "1 Hr", t: "ALGO MASTER", d: "DSA Challenges" },
                                    { s: "1 Hr", t: "SOFT SKILLS", d: "JAM & Mocks" },
                                    { s: "24/7", t: "MENTORSHIP", d: "Direct Support" }
                                ].map((step, i) => (
                                    <div key={i} className={styles.journeyItem}>
                                        <strong>{step.s}</strong>
                                        <span>{step.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 10: ELITE TRAINER & TESTIMONIALS */}
                <section className={styles.page}>
                    <Header pageNum="10" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.trainerWrapLuxury}>
                            <div className={styles.trainerInfo}>
                                <h2>LEARN FROM THE BEST</h2>
                                <p>Our mentors have years of experience and are dedicated to your success.</p>
                                <div className={styles.trainerPillars}>
                                    {[
                                        { h: "Real Experts", d: "Industry veterans with real-world experience." },
                                        { h: "Practical First", d: "Learn by doing, not just theory." },
                                        { h: "Live Projects", d: "Gain practical, hands-on experience." },
                                        { h: "1:1 Support", d: "Get personalized feedback and guidance." }
                                    ].map((pil, i) => (
                                        <div key={i} className={styles.pillarCard}>
                                            <h4>{pil.h}</h4>
                                            <p>{pil.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.testimonialsBlock}>
                                <h2>STUDENT STORIES</h2>
                                <div className={styles.testimonialsHorizontalGrid}>
                                    {[
                                        { name: "Bolla Sahithi", role: "Associate Engineer @ Infosys", text: "Joined Bytecode 4 months back and placed successfully in Infosys. I was applying to jobs for 11 months before this!", star: 5 },
                                        { name: "Sai Vamsheedhar Reddy", role: "System Engineer @ TCS", text: "Bytecode offers an excellent curriculum tailored to industry demands. The faculty's expertise helped me secure a position at TCS.", star: 5 },
                                        { name: "Vamsi Thammisetti", role: "Software Engineer @ Cognizant", text: "Exceeded my expectations! I highly recommend Bytecode to anyone looking to learn Python. Top-notch training for beginners.", star: 5 },
                                        { name: "Jagadesh", role: "Backend Developer @ Forsys", text: "The program is perfectly structured for beginners. The mentors here are deeply invested in our success.", star: 5 },
                                        { name: "Vamsi K", role: "Software Engineer @ Cognizant", text: "The labs and practical assignments were very helpful. I cleared the Cognizant technical rounds with ease.", star: 5 },
                                        { name: "Rajasekhar", role: "Full Stack Developer @ Accenture", text: "Gained technical skills and confidence to tackle complex problems. The Python course is truly industry-grade.", star: 5 },
                                        { name: "Manoj", role: "Associate Developer @ Absolute Labs", text: "An incredible journey. The support from the placement cell was constant and very helpful throughout my graduation.", star: 5 },
                                        { name: "Sampath", role: "Systems Engineer @ Accenture", text: "The career services team was instrumental in navigating the job market and cracking the interview at a top MNC.", star: 5 },
                                        { name: "Karthik", role: "Software Engineer @ Accenture", text: "Invaluable practical skills. I secured a job even before graduation thanks to the intense mock interview preparation.", star: 5 },

                                        { name: "Ganesh", role: "Software Engineer @ Tech Mahindra", text: "The Python program was a game-changer; it gave me the practical confidence I needed for my new role.", star: 5 },
                                        { name: "Harish", role: "Developer @ Cloud Leaf", text: "Intense but incredibly rewarding. The hands-on project experience here is unparalleled in terms of quality.", star: 5 }
                                    ].map((t, i) => (
                                        <div key={i} className={styles.testimonialCard}>
                                            <div className={styles.testiHeader}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.testiName}>{t.name}</span>
                                                    <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: 700 }}>{t.role}</span>
                                                </div>
                                                <div className={styles.stars}>
                                                    {[...Array(t.star)].map((_, si) => <Star key={si} size={10} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <p className={styles.testiText}>"{t.text}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 11: STRATEGIC CAREER ROADMAP */}
                <section className={styles.page}>
                    <Header pageNum="11" />
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 1000, color: 'var(--primary)', letterSpacing: '-1px' }}>ELITE CAREER ARCHITECTURE</h2>
                        <p style={{ fontWeight: 700, opacity: 0.7 }}>A 12-Week Strategic Evolution from Foundation to FANG-Ready</p>
                    </div>

                    <div className={styles.roadmapConduit}>
                        <div className={styles.roadmapPathLine} />

                        {[
                            {
                                weeks: "1-3", phase: "UI & UX",
                                tech: ["HTML5 & CSS3 Advanced", "JavaScript ES6+ Core", "Responsive Architecture"],
                                soft: ["Profile Assessment", "LinkedIn Mastery", "The Perfect Self-Intro"]
                            },
                            {
                                weeks: "4-6", phase: "BACKEND",
                                tech: ["Core Python Engineering", "OOPs & System Design", "SQL Database Design"],
                                soft: ["ATS Resume Crafting", "Mock Group Discussion", "JAM Session Drills"]
                            },
                            {
                                weeks: "7-9", phase: "FULL STACK",
                                tech: ["Django Framework Mastery", "REST API Development", "React Integration"],
                                soft: ["Professional Emailing", "Tech Vocabulary", "Presentation Excellence"]
                            },
                            {
                                weeks: "10-12", phase: "OPS & LIVE",
                                tech: ["AWS Cloud Deployment", "Docker & CI/CD Ops", "Production Grade Projects"],
                                soft: ["HR Reference Network", "Personal Branding", "Direct Placement Prep"]
                            }
                        ].map((step, i) => (
                            <div key={i} className={styles.roadmapStepLuxury}>
                                {/* Left Wing: Technical Skills */}
                                <div className={`${styles.roadmapWing} ${styles.left}`}>
                                    <div className={styles.wingHeader}>
                                        <Database size={16} /> <span>TECHNICAL SKILLS</span>
                                    </div>
                                    <ul className={styles.wingList}>
                                        {step.tech.map((t, ti) => (
                                            <li key={ti}>{t} <CheckCircle2 size={12} style={{ color: 'var(--secondary)' }} /></li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Center Node */}
                                <div className={styles.roadmapNodeCircle}>
                                    <strong>{step.weeks}</strong>
                                    <span>WEEKS</span>
                                </div>

                                {/* Right Wing: Soft Skills */}
                                <div className={`${styles.roadmapWing} ${styles.right}`}>
                                    <div className={styles.wingHeader}>
                                        <Users size={16} /> <span>INTERVIEW SKILLS</span>
                                    </div>
                                    <ul className={styles.wingList}>
                                        {step.soft.map((s, si) => (
                                            <li key={si}><CheckCircle2 size={12} style={{ color: 'var(--secondary)' }} /> {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}

                        <motion.div
                            className={styles.rocketContainer}
                            animate={{ y: [450, -50], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        >
                            <Rocket color="var(--secondary)" size={40} />
                        </motion.div>
                    </div>
                </section>

                {/* PAGE 12: ELITE PLACEMENT WALL */}
                <section className={styles.page}>
                    <Header pageNum="12" />
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 1000, color: 'var(--primary)', letterSpacing: '-1px' }}>RECENT PLACEMENTS</h2>
                        <p style={{ fontWeight: 700, opacity: 0.7 }}>A Legacy of Success: Real Students, Real Companies, Real Transitions</p>
                    </div>

                    <div className={styles.wreathGrid}>
                        {[
                            { name: "Vamsi T", company: "Cognizant", pkg: "3.5", image: "/placements/Vamsi-T.png" },
                            { name: "Jagadesh", company: "Forsys", pkg: "4.0", image: "/placements/Jagadesh.png" },
                            { name: "Vamsi K", company: "Cognizant", pkg: "3.5", image: "/placements/Vamsi-K.png" },
                            { name: "Rajasekhar", company: "Accenture", pkg: "5.0", image: "/placements/Rajasekhar.png" },
                            { name: "Manoj", company: "Absolute Labs", pkg: "5.0", image: "/placements/Manoj.png" },
                            { name: "Sampath", company: "Accenture", pkg: "5.0", image: "/placements/Sampath.png" },
                            { name: "Karthik", company: "Accenture", pkg: "4.0", image: "/placements/Karthik.png" },

                            { name: "Ganesh", company: "Tech Mahindra", pkg: "5.0", image: "/placements/Ganesh-K.png" },
                            { name: "Harish", company: "Cloud Leaf", pkg: "5.0", image: "/placements/Harish-K.png" },
                            { name: "Santhavana", company: "Cognizant", pkg: "4.0", image: "/placements/Santhavana.png" },
                            { name: "Phani B", company: "Centelon", pkg: "3.5", image: "/placements/Phani.png" },
                            { name: "Rishi", company: "Innovation Labs", pkg: "3.5", image: "/placements/Rishi.png" },
                            { name: "Midhun", company: "Terralogic", pkg: "4.0", image: "/placements/Midhun.png" },
                            { name: "marahor", company: "Teachmint", pkg: "Comp.", image: "/placements/Marohar.png" },
                            { name: "Tejaswar", company: "Arcitech", pkg: "Comp.", image: "/placements/Tejaswar.png" },
                            { name: "Divya", company: "Nemali Software", pkg: "4.0", image: "/placements/Divya.png" },
                            { name: "Rishwitha", company: "Tech Solutions", pkg: "3.5", image: "/placements/Rishwitha Nalgonda.png" },
                            { name: "Rohan Das", company: "Amazon", pkg: "45", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" },
                            { name: "Priya S", company: "Microsoft", pkg: "38", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200" },
                            { name: "Amit Patel", company: "Adobe", pkg: "28", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200" },
                            { name: "Sneha R", company: "Uber", pkg: "35", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200" },
                            { name: "Vikram S", company: "Zerodha", pkg: "42", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200" },
                            { name: "Arjun K", company: "Cred", pkg: "26", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200" },
                            { name: "Megha S", company: "G-Cloud", pkg: "36", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200" },
                            { name: "Sanjay T", company: "Netflix", pkg: "52", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200" },
                            { name: "Karan W", company: "Razorpay", pkg: "24", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" },
                            { name: "Nidhi B", company: "Meta", pkg: "48", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=200" },
                            { name: "Rahul G", company: "Apple", pkg: "40", image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=200" },
                            { name: "Divya L", company: "Canva", pkg: "30", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200" },
                            { name: "Siddharth", company: "Tesla", pkg: "55", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" },
                            { name: "Anjali P", company: "Stripe", pkg: "44", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200" },
                            { name: "Rahul K", company: "TCS", pkg: "7.5", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200" },
                            { name: "Sneha P", company: "Infosys", pkg: "6.8", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200" },
                            { name: "Aditya S", company: "Wipro", pkg: "5.5", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" },
                            { name: "Pooja R", company: "HCLTech", pkg: "8.2", image: "https://images.unsplash.com/photo-1548142813-c348350df2b?q=80&w=200" },
                            { name: "Vikram M", company: "Oracle", pkg: "18", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" },
                            { name: "Ananya G", company: "Swiggy", pkg: "12", image: "https://images.unsplash.com/photo-1590649839149-7fd4981d593f?q=80&w=200" },
                            { name: "Rohan V", company: "Zomato", pkg: "14", image: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=200" },
                            { name: "Kavya S", company: "PhonePe", pkg: "20", image: "https://images.unsplash.com/photo-1596215143922-eedeaba0d91c?q=80&w=200" },
                            { name: "Arjun M", company: "Paytm", pkg: "16", image: "https://images.unsplash.com/photo-1614289371518-722f2615943d?q=80&w=200" },
                            { name: "Ishani D", company: "Capgemini", pkg: "9.5", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200" },
                            { name: "Manish T", company: "LTI", pkg: "8.8", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200" },
                            { name: "Shreya I", company: "Mindtree", pkg: "10", image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d02?q=80&w=200" },
                            { name: "Nikhil B", company: "Deloitte", pkg: "12.5", image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200" },
                            { name: "Tanvi S", company: "KPMG", pkg: "11", image: "https://images.unsplash.com/photo-1607503813978-296a67eed82a?q=80&w=200" },
                            { name: "Sameer K", company: "Postman", pkg: "22", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200" },
                            { name: "Sai Teja", company: "Qualcomm", pkg: "21", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" }
                        ].map((s, i) => (
                            <div key={i} className={styles.studentCard}>
                                <div className={styles.wreath}>
                                    <Image src={s.image} alt={s.name} className={styles.studentImage} width={100} height={100} />
                                    <div className={styles.packageBadge}>
                                        <span>{s.pkg}</span>
                                        <strong>LPA</strong>
                                    </div>
                                </div>
                                <div className={styles.studentInfoMini}>
                                    <h5>{s.name}</h5>
                                    <p>{s.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 'auto', background: 'var(--bg-subtle)', padding: '3rem', border: '1px solid var(--border-faint)', borderRadius: '30px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1rem', color: 'var(--text-bright)', letterSpacing: '4px', fontWeight: 900 }}>OUR HIRING & ACADEMIC PARTNER NETWORK</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2.5rem', alignItems: 'center' }}>
                            {[...Array(54)].map((_, i) => {
                                const id = i + 1;
                                return (
                                    <div key={id} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <img
                                            src={`/CompanyLogos/${id}.${id === 54 ? 'svg' : 'png'}`}
                                            alt="Partner"
                                            style={{ width: '100%', maxWidth: '85px', height: 'auto', transition: '0.3s', cursor: 'pointer' }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* PAGE 14: ZENITH ADMISSION COMMAND CENTER */}
                <section className={`${styles.page} ${styles.zenithPage}`}>
                    <Header pageNum="14" />

                    <div className={styles.zenithHeader}>
                        <h2>Ready to Start?</h2>
                        <p>Secure your seat in our upcoming batch.</p>
                    </div>

                    <div className={styles.zenithGrid}>
                        {/* LEFT: Course Fee */}
                        <div className={`${styles.zenithCard} ${styles.primary}`}>
                            <div className={styles.zenithPriceLabel}>Training Fee</div>
                            <div className={styles.zenithPriceValue}>
                                <span className={styles.zenithOriginalPrice}>₹45,000</span>
                                <span className={styles.zenithFinalPrice}>₹35,000</span>
                            </div>

                            <div className={styles.zenithFeatureList}>
                                {['3 Months Live Training', 'Industrial Internship', '100% Placement Guarantee', 'Lifetime LMS Access', 'Mock Interviews & Resume Building'].map(item => (
                                    <div key={item} className={styles.zenithFeature}>
                                        <div className={styles.zenithCheck}><Check size={16} strokeWidth={4} /></div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.zenithFinanceGrid}>
                                <div className={styles.zenithFinanceItem}>
                                    <Zap size={24} fill="#f39200" stroke="none" />
                                    <span>Zero Cost EMI Available</span>
                                </div>
                                <div className={styles.zenithFinanceItem}>
                                    <Globe size={24} color="#003087" />
                                    <span>Hybrid Classrooms</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Get in Touch */}
                        <div className={`${styles.zenithCard} ${styles.dark}`}>
                            <div className={styles.zenithDarkTitle}>
                                <ShieldCheck size={32} color="#f39200" />
                                Admissions Help
                            </div>

                            <div className={styles.zenithContactStack}>
                                <a href="tel:+918309879187" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={styles.zenithContactRow}>
                                        <div className={styles.zenithIconBox}>
                                            <Phone size={28} />
                                        </div>
                                        <div className={styles.zenithContactDetails}>
                                            <h5>Call Us</h5>
                                            <p>+91 83098 79187</p>
                                        </div>
                                    </div>
                                </a>

                                <a href="mailto:info@bytecodetrainings.com" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={styles.zenithContactRow}>
                                        <div className={styles.zenithIconBox} style={{ background: '#0047ba' }}>
                                            <Mail size={28} />
                                        </div>
                                        <div className={styles.zenithContactDetails}>
                                            <h5>Email Us</h5>
                                            <p>info@Bytecodetrainings.com</p>
                                        </div>
                                    </div>
                                </a>

                                <div className={styles.zenithContactRow}>
                                    <div className={styles.zenithIconBox} style={{ background: '#2d3436' }}>
                                        <MapPin size={28} />
                                    </div>
                                    <div className={styles.zenithContactDetails}>
                                        <h5>Visit Us</h5>
                                        <p style={{ fontSize: '1.2rem' }}>Manjeera Trinity, Hyderabad</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={styles.zenithAction}
                                onClick={() => {
                                    const message = encodeURIComponent("Hello, I am interested in the Python Full Stack Masterclass. I would like to secure my seat and get more details regarding the next batch.");
                                    window.open(`https://wa.me/918309879187?text=${message}`);
                                }}
                            >
                                Secure Seat Now <ArrowRight size={28} />
                            </button>
                        </div>
                    </div>
                </section>
                <RelatedCourses currentPath="/brochure/python-full-stack" />
            </div>
        </div>
    );
}
