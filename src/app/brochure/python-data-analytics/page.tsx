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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
        pdf.save('ByteCode-Python-Full-Stack-Brochure.pdf');
    };

    const Header = ({ pageNum }: { pageNum: string }) => (
        <div className={styles.header}>
            <img src="/logo.png" alt="ByteCode" className={styles.logo} />
            <div className={styles.pageNumber}>PAGE {pageNum}</div>
        </div>
    );

    return (
        <div className={styles.brochureContainer}>
            <nav className={styles.nav}>
                <button className={styles.exitBtn} onClick={() => router.back()}>Exit</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.exitBtn} onClick={downloadPDF} style={{ background: '#27ae60' }}>Download PDF</button>
                    <button className={styles.exitBtn} style={{ background: '#f39200' }} onClick={() => window.open('https://wa.me/918309879187')}>Enroll Now</button>
                </div>
            </nav>

            <div ref={brochureRef}>
                {/* PAGE 1: VERTICAL MASTER COVER */}
                <section className={styles.heroPage}>
                    <div className={styles.verticalSidebar}>
                        <img src="/logo.png" className={styles.logoMini} alt="Logo" />
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
                            <h1 className={styles.masterTitle}>BYTECODE</h1>
                            <div className={styles.masterTagline}>TRAININGS & PLACEMENTS</div>
                        </div>

                        <div className={styles.masterHeadline}>
                            <h2>PYTHON WITH <br /> DATA ANALYTICS</h2>
                            <p>
                                Unlock the power of data with India's most comprehensive job-oriented architecture.
                                Master everything from Python basics to advanced Machine Learning models.
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
                                <div className={styles.masterStatLabel}>Hiring Corps</div>
                            </div>
                        </div>


                    </div>

                    <div className={styles.masterHeroPart}>
                        <img src="/hero-cover.png" className={styles.masterHeroImg} alt="Professional" />
                    </div>
                </section>

                {/* PAGE 2: PROGRAM HIGHLIGHTS */}
                <section className={styles.page}>
                    <Header pageNum="02" />
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>Complete Job Ready Program</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Our Responsibility Till you get Placed.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                Bytecode Trainings & Placements is a trusted institute offering high-quality training in
                                Python with Data Analytics. Our program is designed to equip students and fresh graduates
                                with the skills needed to succeed in the data-driven IT industry.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {[
                                    { t: "Unique Opportunity", d: "Intensive training part of elite career path." },
                                    { t: "Industry Level Qs", d: "Practice genuine interview patterns." },
                                    { t: "Live Projects", d: "Recreate real job environments." },
                                    { t: "Internship Docs", d: "Formal certification for credibility." }
                                ].map((h, i) => (
                                    <div key={i}>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>{h.t}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{h.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop" style={{ borderRadius: '20px', width: '100%' }} />
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
                                <p>60,000+ Active Job Openings for Data Analysts, Data Scientists, and Python Developers.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Award size={40} /></div>
                                <h3>Salary Packages</h3>
                                <p>Starting from 8 LPA to over 24 LPA+ for experts with elite analytical and ML skills.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><ShieldCheck size={40} /></div>
                                <h3>Global Growth</h3>
                                <p>75% expected growth in Data Science & Analytics roles by 2028 across major tech hubs.</p>
                            </div>
                        </div>

                        <div className={styles.whyPanelLuxury}>
                            <div className={styles.whyContent}>
                                <h2>Why <br /> ByteCode?</h2>
                                <div className={styles.benefitGrid}>
                                    {[
                                        "Master In-Demand Tech: Python, SQL, PowerBI",
                                        "Official Industry Recognized Certifications",
                                        "LeetCode & Kaggle Portfolio Building",
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
                                        d: "Direct guidance from Senior Data Architects and Analytics Leads who have built enterprise-scale models.",
                                        c: "#27ae60"
                                    },
                                    {
                                        n: "03",
                                        t: "Hands-on Experience with Projects",
                                        d: "End-to-end analysis of real-world datasets, following Agile and Data Science methodologies.",
                                        c: "#d63031"
                                    },
                                    {
                                        n: "04",
                                        t: "Comprehensive Placement Prep",
                                        d: "Rigorous mock interviews, resume engineering, and profile building on Kaggle & GitHub.",
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
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Mentor" />
                                <div className={styles.roadmapImageOverlay}>
                                    <h4>Expert Mentorship</h4>
                                    <p>Our Responsibility Till You Get Placed</p>
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
                                <h3>Core Analytics Engine</h3>
                                <div className={styles.skillCountTag}>Data Science Core</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'Python', p: 'python/python-original.svg' },
                                    { s: 'Pandas', p: 'pandas/pandas-original.svg' },
                                    { s: 'NumPy', p: 'numpy/numpy-original.svg' },
                                    { s: 'Matplotlib', p: 'matplotlib/matplotlib-original.svg' },
                                    { s: 'Scikit-Learn', p: 'scikitlearn/scikitlearn-original.svg' },
                                    { s: 'Jupyter', p: 'jupyter/jupyter-original-wordmark.svg' }
                                ].map((tech, i) => (
                                    <div key={i} className={styles.skillItemLuxury}>
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
                                <h3>Business Intelligence & Tools</h3>
                                <div className={styles.skillCountTag}>Enterprise Standard</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'MySQL', p: 'mysql/mysql-original.svg' },
                                    { s: 'SQL', p: 'postgresql/postgresql-original.svg' },
                                    { s: 'Tableau', p: 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg', isUrl: true },
                                    { s: 'PowerBI', p: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg', isUrl: true },
                                    { s: 'Excel', p: 'https://cdn.worldvectorlogo.com/logos/microsoft-excel-2013.svg', isUrl: true },
                                    { s: 'Git', p: 'git/git-original.svg' },
                                    { s: 'GitHub', p: 'github/github-original.svg' },
                                    { s: 'VS Code', p: 'vscode/vscode-original.svg' }
                                ].map((tech, i) => (
                                    <div key={i} className={styles.skillItemLuxury}>
                                        <div className={styles.skillLogoBox}>
                                            <img
                                                src={tech.isUrl ? tech.p : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.p}`}
                                                alt={tech.s}
                                            />
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

                {/* PAGE 6: ELITE CURRICULUM - FOUNDATIONS */}
                <section className={styles.page}>
                    <Header pageNum="06" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>PYTHON & ANALYTICS CORE</h2>
                            <p>Data Engineering Foundation</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "01",
                                    t: "Python Architecture",
                                    p: ["Variables & Advanced Types", "Control Flow Logic", "Functional Programming", "File I/O & Automation"],
                                    tech: ["Python 3.12", "Scripting"]
                                },
                                {
                                    n: "02",
                                    t: "Data Analysis Engines",
                                    p: ["NumPy Vectorization", "Pandas DataFrames", "Data Wrangling", "Time Series Analysis"],
                                    tech: ["Pandas", "NumPy"]
                                },
                                {
                                    n: "03",
                                    t: "Visual Intelligence",
                                    p: ["Matplotlib Architectures", "Seaborn Statistical Plots", "Interactive Visuals", "Storytelling with Data"],
                                    tech: ["Matplotlib", "Seaborn"]
                                },
                                {
                                    n: "04",
                                    t: "SQL for Analysts",
                                    p: ["RDBMS Architecture", "Complex Joins & CTEs", "Window Functions", "Performance Tuning"],
                                    tech: ["MySQL", "PostgreSQL"]
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
                                <span>Core Analytics</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>02</div>
                                <span>Business Intelligence</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 7: ELITE CURRICULUM - ADVANCED */}
                <section className={styles.page}>
                    <Header pageNum="07" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>ADVANCED INTELLIGENCE</h2>
                            <p>Predictive Modeling & BI</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "05",
                                    t: "Machine Learning Concepts",
                                    p: ["Supervised Protocols", "Unsupervised Clustering", "Regression Models", "Scikit-Learn Workflows"],
                                    tech: ["ML", "Scikit"]
                                },
                                {
                                    n: "06",
                                    t: "Enterprise BI Tools",
                                    p: ["PowerBI DAX Formulas", "Tableau Dashboards", "Data Connectivity FLows", "Business Reporting"],
                                    tech: ["PowerBI", "Tableau"]
                                },
                                {
                                    n: "07",
                                    t: "Advanced Excel",
                                    p: ["Pivot Tables & Charts", "VLOOKUP/XLOOKUP", "Data Validation", "Macro Recording"],
                                    tech: ["Excel", "Macros"]
                                },
                                {
                                    n: "08",
                                    t: "Industrial Capstone",
                                    p: ["End-to-End Analysis", "Business Problem Solving", "Executive Presentation", "Portfolio Deployment"],
                                    tech: ["Project", "Strategy"]
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
                                <span>Core Analytics</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Business Intelligence</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>03</div>
                                <span>Tools & Pro</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ELITE CURRICULUM - TOOLS */}
                <section className={styles.page}>
                    <Header pageNum="08" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>TOOLS & PROFESSIONALISM</h2>
                            <p>Industry Standard Ecosystem</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "09",
                                    t: "Git & Version Control",
                                    p: ["Repo Management", "Branching Strategies", "Pull Requests/Merge", "Collaboration Workflows"],
                                    tech: ["Git", "GitHub"]
                                },
                                {
                                    n: "10",
                                    t: "Modern Data Stack",
                                    p: ["Jupyter Notebooks", "VS Code Environment", "Anaconda Distribution", "Virtual Environments"],
                                    tech: ["Jupyter", "Conda"]
                                },
                                {
                                    n: "11",
                                    t: "Generative AI Basics",
                                    p: ["Prompt Engineering", "LLM Fundamentals", "AI-Assisted Coding", "Future of Analytics"],
                                    tech: ["GenAI", "ChatGPT"]
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
                                <span>Core Analytics</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Business Intelligence</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Tools & Pro</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 09: ELITE REAL-WORLD PROJECTS */}
                <section className={styles.page}>
                    <Header pageNum="09" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>REAL-WORLD REPRODUCTIONS</h2>
                            <p>Industry Portfolio Excellence</p>
                        </div>

                        <div className={styles.projectGridLuxury}>
                            {[
                                {
                                    t: "Sales Forecasting",
                                    d: "Predictive modeling for retail sales using time-series analysis.",
                                    tech: "Python, ARIMA, Pandas"
                                },
                                {
                                    t: "Customer Churn Analysis",
                                    d: "Identifying at-risk customers through classification algorithms.",
                                    tech: "Scikit-Learn, Logistic Reg"
                                },
                                {
                                    t: "Financial Dashboard",
                                    d: "Real-time visualization of stock market trends and portfolio performance.",
                                    tech: "Power BI, SQL, Python"
                                },
                                {
                                    t: "Sentiment Analysis",
                                    d: "Analyzing social media data to gauge public opinion on products.",
                                    tech: "NLP, NLTK, Python"
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
                            <h4>Behind The Scenes: The Placement Lifecycle</h4>
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
                                <h2>CERTIFIED EXPERT MENTORS</h2>
                                <p>Learn from professionals who bring years of real-world production experience to the classroom.</p>
                                <div className={styles.trainerPillars}>
                                    {[
                                        { h: "Real Experts", d: "Masters of high-density production systems." },
                                        { h: "Practical First", d: "100% project-first pedagogical approach." },
                                        { h: "Live Projects", d: "Every line you write goes to the cloud." },
                                        { h: "1:1 Support", d: "Face-to-face architectural reviews." }
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
                                        { name: "Bolla Sahithi", role: "Associate Engineer @ Infosys", text: "Joined ByteCode 4 months back and placed successfully in Infosys. I was applying to jobs for 11 months before this!", star: 5 },
                                        { name: "Sai Vamsheedhar Reddy", role: "System Engineer @ TCS", text: "Bytecode offers an excellent curriculum tailored to industry demands. The faculty's expertise helped me secure a position at TCS.", star: 5 },
                                        { name: "Vamsi Thammisetti", role: "Software Engineer @ Cognizant", text: "Exceeded my expectations! I highly recommend Bytecode to anyone looking to learn Python. Top-notch training for beginners.", star: 5 },
                                        { name: "Jagadesh", role: "Backend Developer @ Forsys", text: "The program is perfectly structured for beginners. The mentors here are deeply invested in our success.", star: 5 },
                                        { name: "Vamsi K", role: "Software Engineer @ Cognizant", text: "The labs and practical assignments were very helpful. I cleared the Cognizant technical rounds with ease.", star: 5 },
                                        { name: "Rajasekhar", role: "Full Stack Developer @ Accenture", text: "Gained technical skills and confidence to tackle complex problems. The Python course is truly industry-grade.", star: 5 },
                                        { name: "Manoj", role: "Associate Developer @ Absolute Labs", text: "An incredible journey. The support from the placement cell was constant and very helpful throughout my graduation.", star: 5 },
                                        { name: "Sampath", role: "Systems Engineer @ Accenture", text: "The career services team was instrumental in navigating the job market and cracking the interview at a top MNC.", star: 5 },
                                        { name: "Karthik", role: "Software Engineer @ Accenture", text: "Invaluable practical skills. I secured a job even before graduation thanks to the intense mock interview preparation.", star: 5 },
                                        { name: "Prasad", role: "Associate Engineer @ Gemini", text: "Curriculum is up-to-date with industry standards. Best place for freshers to start their journey with confidence.", star: 5 },
                                        { name: "Ganesh", role: "Software Engineer @ Tech Mahindra", text: "The Python program was a game-changer; it gave me the practical confidence I needed for my new role.", star: 5 },
                                        { name: "Harish", role: "Developer @ Cloud Leaf", text: "Intense but incredibly rewarding. The hands-on project experience here is unparalleled in terms of quality.", star: 5 }
                                    ].map((t, i) => (
                                        <div key={i} className={styles.testimonialCard}>
                                            <div className={styles.testiHeader}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div className={styles.testiName}>{t.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>{t.role}</div>
                                                </div>
                                                <div className={styles.stars}>
                                                    {[...Array(t.star)].map((_, si) => <Star key={si} size={12} fill="#f39200" stroke="none" />)}
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
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 1000, color: 'var(--primary)', textTransform: 'uppercase' }}>Strategic Career Roadmap</h2>
                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dim)' }}>The Blueprint for Your Professional Ascension</p>
                    </div>

                    <div className={styles.roadmapConduit}>
                        <div className={styles.roadmapPathLine} />

                        {[
                            {
                                weeks: "0-4",
                                tech: ["Python Fundamentals", "Data Structures", "NumPy & Pandas", "SQL Basics"],
                                soft: ["Communication Audit", "LinkedIn Optimisation", "Goal Setting"]
                            },
                            {
                                weeks: "5-8",
                                tech: ["Data Cleaning", "Exploratory Analysis", "Matplotlib & Seaborn", "Advanced SQL"],
                                soft: ["Agile Methodologies", "Presentation Skills", "Team Collaboration"]
                            },
                            {
                                weeks: "9-12",
                                tech: ["Machine Learning", "Scikit-Learn", "PowerBI / Tableau", "Feature Engineering"],
                                soft: ["Mock Interviews (HR)", "Resume Engineering", "Portfolio Building"]
                            },
                            {
                                weeks: "13+",
                                tech: ["Capstone Project", "Deep Learning Basics", "Model Deployment", "Generative AI"],
                                soft: ["Mock Interviews (Tech)", "Salary Negotiation", "Final Placements"]
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
                            { name: "Vamsi Tammisetty", company: "Cognizant", pkg: "3.5", image: "/placements/Vamsi-T.png" },
                            { name: "Jagadesh", company: "Forsys", pkg: "4", image: "/placements/Jagadesh.png" },
                            { name: "Vamsi K", company: "Cognizant", pkg: "3.5", image: "/placements/Vamsi-K.png" },
                            { name: "Rajasekhar", company: "Accenture", pkg: "5", image: "/placements/Rajasekhar.png" },
                            { name: "Manoj", company: "Absolute Labs", pkg: "5", image: "/placements/Manoj.png" },
                            { name: "Sampath", company: "Accenture", pkg: "5", image: "/placements/Sampath.png" },
                            { name: "Karthik", company: "Accenture", pkg: "4", image: "/placements/Karthik.png" },
                            { name: "Prasad", company: "Gemini", pkg: "3.5", image: "/placements/Prasad.png" },
                            { name: "Ganesh", company: "Tech Mahendra", pkg: "5", image: "/placements/Ganesh-K.png" },
                            { name: "Harish", company: "Cloud Leaf L.L.C", pkg: "5", image: "/placements/Harish-K.png" },
                            { name: "Santhavana", company: "Cognizant", pkg: "4", image: "/placements/Santhavana.png" },
                            { name: "Phani B", company: "Centillion Networks", pkg: "3.5", image: "/placements/Phani.png" },
                            { name: "Rishi", company: "Innovation Labs", pkg: "3.5", image: "/placements/Rishi.png" },
                            { name: "Midhun", company: "Terralogic", pkg: "4", image: "/placements/Midhun.png" },
                            { name: "marahor", company: "Teachmint", pkg: "4.5", image: "/placements/Marohar.png" },
                            { name: "Tejaswar", company: "Arcitech", pkg: "4.5", image: "/placements/Tejaswar.png" },
                            { name: "Divya", company: "Nemali Software", pkg: "4", image: "/placements/Divya.png" },
                            { name: "Rishwitha", company: "Tech Solutions", pkg: "3.5", image: "/placements/Rishwitha Nalgonda.png" },
                            { name: "Rohan Das", company: "Amazon", pkg: "45", image: "https://i.pravatar.cc/150?u=rohan" },
                            { name: "Priya Sharma", company: "Microsoft", pkg: "38", image: "https://i.pravatar.cc/150?u=priya" },
                            { name: "Amit Patel", company: "Adobe", pkg: "28", image: "https://i.pravatar.cc/150?u=amit" },
                            { name: "Sneha Reddy", company: "Uber", pkg: "35", image: "https://i.pravatar.cc/150?u=sneha" },
                            { name: "Vikram Singh", company: "Zerodha", pkg: "42", image: "https://i.pravatar.cc/150?u=vikram" },
                            { name: "Arjun K.", company: "Cred", pkg: "26", image: "https://i.pravatar.cc/150?u=arjun" },
                            { name: "Megha S.", company: "Google Cloud", pkg: "36", image: "https://i.pravatar.cc/150?u=megha" },
                            { name: "Sanjay T.", company: "Netflix", pkg: "52", image: "https://i.pravatar.cc/150?u=sanjay" },
                            { name: "Karan W.", company: "Razorpay", pkg: "24", image: "https://i.pravatar.cc/150?u=karan" },
                            { name: "Nidhi B.", company: "Meta", pkg: "48", image: "https://i.pravatar.cc/150?u=nidhi" },
                            { name: "Rahul G.", company: "Apple", pkg: "40", image: "https://i.pravatar.cc/150?u=rahulg" },
                            { name: "Divya L.", company: "Canva", pkg: "30", image: "https://i.pravatar.cc/150?u=divya" },
                            { name: "Siddharth M.", company: "Tesla", pkg: "55", image: "https://i.pravatar.cc/150?u=sid" },
                            { name: "Anjali P.", company: "Stripe", pkg: "44", image: "https://i.pravatar.cc/150?u=anjali" },
                            { name: "Varun D.", company: "Oracle", pkg: "39", image: "https://i.pravatar.cc/150?u=varun" },
                            { name: "Kavita J.", company: "Paypal", pkg: "22", image: "https://i.pravatar.cc/150?u=kavita" },
                            { name: "Rajesh K.", company: "Spotify", pkg: "33", image: "https://i.pravatar.cc/150?u=rajesh" },
                            { name: "Ishita R.", company: "Snowflake", pkg: "29", image: "https://i.pravatar.cc/150?u=ishita" },
                            { name: "Manish S.", company: "Airbnb", pkg: "47", image: "https://i.pravatar.cc/150?u=manish" },
                            { name: "Pooja V.", company: "Walmart", pkg: "26", image: "https://i.pravatar.cc/150?u=pooja" },
                            { name: "Harish N.", company: "Cisco", pkg: "31", image: "https://i.pravatar.cc/150?u=harish" },
                            { name: "Simran T.", company: "Flipkart", pkg: "20", image: "https://i.pravatar.cc/150?u=simran" }
                        ].map((s, i) => (
                            <div key={i} className={styles.studentCard}>
                                <div className={styles.wreath}>
                                    <img src={s.image} alt={s.name} className={styles.studentImage} />
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
                    <div style={{ marginTop: 'auto', background: 'rgba(0, 48, 135, 0.02)', padding: '3rem', border: '1px solid rgba(0, 48, 135, 0.05)', borderRadius: '30px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1rem', color: 'var(--primary)', letterSpacing: '4px', fontWeight: 900 }}>OUR HIRING & ACADEMIC PARTNER NETWORK</h3>
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

                {/* PAGE 13: ZENITH ADMISSION COMMAND CENTER */}
                <section className={`${styles.page} ${styles.zenithPage}`}>
                    <Header pageNum="13" />

                    <div className={styles.zenithHeader}>
                        <h2>Initialize Your Journey</h2>
                        <p>Secure Your Position in the Next Cohort</p>
                    </div>

                    <div className={styles.zenithGrid}>
                        {/* LEFT: INVESTMENT ARCHITECTURE */}
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

                        {/* RIGHT: DIRECT ACCESS CONSOLE */}
                        <div className={`${styles.zenithCard} ${styles.dark}`}>
                            <div className={styles.zenithDarkTitle}>
                                <ShieldCheck size={32} color="#f39200" />
                                ADMISSION CONTROL
                            </div>

                            <div className={styles.zenithContactStack}>
                                <div className={styles.zenithContactRow}>
                                    <div className={styles.zenithIconBox}>
                                        <Phone size={28} />
                                    </div>
                                    <div className={styles.zenithContactDetails}>
                                        <h5>Priority Line</h5>
                                        <p>+91 83098 79187</p>
                                    </div>
                                </div>

                                <div className={styles.zenithContactRow}>
                                    <div className={styles.zenithIconBox} style={{ background: '#0047ba' }}>
                                        <Mail size={28} />
                                    </div>
                                    <div className={styles.zenithContactDetails}>
                                        <h5>Official Channel</h5>
                                        <p>info@bytecodetrainings.com</p>
                                    </div>
                                </div>

                                <div className={styles.zenithContactRow}>
                                    <div className={styles.zenithIconBox} style={{ background: '#2d3436' }}>
                                        <MapPin size={28} />
                                    </div>
                                    <div className={styles.zenithContactDetails}>
                                        <h5>Global HQ</h5>
                                        <p style={{ fontSize: '1.2rem' }}>Manjeera Trinity, Hyderabad</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={styles.zenithAction}
                                onClick={() => {
                                    const message = encodeURIComponent("Hello, I am interested in the Python with Data Analytics Masterclass. I would like to secure my seat and get more details regarding the next batch.");
                                    window.open(`https://wa.me/918309879187?text=${message}`);
                                }}
                            >
                                Secure Seat Now <ArrowRight size={28} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
