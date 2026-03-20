"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, Phone, Mail, MapPin,
    Rocket, Star, Globe, ShieldCheck, Zap,
    FileDown, ExternalLink, ChevronRight, Award,
    Users, Target, BookOpen, Layers, Check, Database, ArrowRight, Brain, Cpu, Bot
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
        'Mphasis': '24',
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

export default function AIFullStackBrochure() {
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
        pdf.save('Bytecode-Data-Science-AI-Brochure.pdf');
    };

    const Header = ({ pageNum }: { pageNum: string }) => (
        <div className={styles.header}>
            <img src="/logo.png" alt="Bytecode" className={styles.logo} />
            <div className={styles.pageNumber}>PAGE {pageNum}</div>
        </div>
    );

    return (
        <div className={styles.brochureContainer}>
            <nav className={styles.nav}>
                <button className={styles.exitBtn} onClick={() => router.back()}>Exit</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.exitBtn} onClick={downloadPDF} style={{ background: '#27ae60' }}>Download PDF</button>
                    <button className={styles.exitBtn} style={{ background: '#f39200' }} onClick={() => router.push('/payment?course=Data+Science&fee=65000')}>Enroll Now</button>
                </div>
            </nav>

            <div ref={brochureRef}>
                {/* PAGE 1: VERTICAL MASTER COVER */}
                <section className={styles.heroPage}>
                    <div className={styles.verticalSidebar}>
                        <img src="/logo.png" className={styles.logoMini} alt="Logo" />
                        <div className={styles.verticalPillars}>
                            {[
                                { Icon: Brain, label: "AI Models" },
                                { Icon: BookOpen, label: "Analytics" },
                                { Icon: Bot, label: "GenAI" },
                                { Icon: ShieldCheck, label: "Research" },
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
                            <h2>AI FULL STACK (Zero Coding) <br /> Masterclass</h2>
                            <p>
                                Master the Future of Intelligence.
                                The highlight course of the decade. Build secure, scalable applications powered by Agentic AI—no coding required.
                            </p>
                        </div>

                        <div className={styles.masterStatsGrid}>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>100%</div>
                                <div className={styles.masterStatLabel}>Success Rate</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>35 LPA+</div>
                                <div className={styles.masterStatLabel}>Highest Pkg</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>500+</div>
                                <div className={styles.masterStatLabel}>Hiring Partners</div>
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
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>Complete AI Career Program</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Zero to employed. We support you the whole way.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                Bytecode Trainings & Placements offers India's most advanced AI Full Stack (Zero Coding) curriculum.
                                Our program transforms beginners into Gen AI Developers and AI Solutions Architects capable of building
                                complex predictive models and Custom GPTs & OpenAI APIs applications.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {[
                                    { t: "Future Ready", d: "Learn Custom GPTs & OpenAI APIs & LLMs." },
                                    { t: "Real Datasets", d: "Work with Real-world & Industry data." },
                                    { t: "Live Projects", d: "Deploy ML models to production." },
                                    { t: "Certification", d: "Global recognition for your skills." }
                                ].map((h, i) => (
                                    <div key={i}>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>{h.t}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{h.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop" style={{ borderRadius: '20px', width: '100%' }} />
                    </div>
                </section>

                {/* PAGE 3: THE FUTURE */}
                <section className={styles.page}>
                    <Header pageNum="03" />
                    <div className={styles.futurePageWrapper}>
                        <div className={styles.futureHeader}>
                            <h2>BUILD YOUR FUTURE IN AI</h2>
                            <p>Global Market Insights & Career Scope</p>
                        </div>

                        <div className={styles.insightGrid}>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Target size={40} /></div>
                                <h3>High Demand</h3>
                                <p>AI & AI Full Stack rules the job market with 40% YoY growth in openings.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Award size={40} /></div>
                                <h3>Salary Packages</h3>
                                <p>Gen AI Developers command premium salaries starting from 10 LPA to 35 LPA+.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><ShieldCheck size={40} /></div>
                                <h3>Global Impact</h3>
                                <p>AI is transforming every industry from Healthcare to Finance worldwide.</p>
                            </div>
                        </div>

                        <div className={styles.whyPanelLuxury}>
                            <div className={styles.whyContent}>
                                <h2>Why <br /> Bytecode?</h2>
                                <div className={styles.benefitGrid}>
                                    {[
                                        "Master GenAI, LLMs & Agentic AI",
                                        "Hands-on with CrewAI & AutoGen",
                                        "Real-world Tasks Guidance",
                                        "Direct Placement Access to 500+ Partners"
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
                                        src="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1200&auto=format&fit=crop"
                                        className={styles.luxuryImage}
                                        alt="AI Laboratory"
                                    />
                                    <div className={styles.achievementTag}>Best AI Curriculum</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.eliteMetricsBar}>
                            {[
                                { Icon: Brain, value: "100%", label: "Research Driven" },
                                { Icon: Zap, value: "Elite", label: "Tech Stack" },
                                { Icon: Globe, value: "Global", label: "Opportunities" },
                                { Icon: Award, value: "Top 1%", label: "Mentors" }
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
                                        t: "Fundamentals & Statistics",
                                        d: "Strong foundation in Python programming, Math, and Statistics essential for AI Full Stack.",
                                        c: "#003087"
                                    },
                                    {
                                        n: "02",
                                        t: "No-Code Development Core",
                                        d: "Mastering supervised and unsupervised learning algorithms and real-world implementation.",
                                        c: "#27ae60"
                                    },
                                    {
                                        n: "03",
                                        t: "Agentic AI & AI",
                                        d: "Neural networks, Autonomous Execution, NLP, and cutting-edge Custom GPTs & OpenAI APIs models.",
                                        c: "#d63031"
                                    },
                                    {
                                        n: "04",
                                        t: "Capstone & Placement",
                                        d: "End-to-end industrial projects, portfolio building, and intensive mock interviews.",
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
                                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop" alt="Analysis" />
                                <div className={styles.roadmapImageOverlay}>
                                    <h4>Data Driven Success</h4>
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
                            <p>Master the Tools driving the AI Revolution</p>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>AI Full Stack Core</h3>
                                <div className={styles.skillCountTag}>10+ Modules</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'Python', p: 'python/python-original.svg' },
                                    { s: 'Zapier', p: 'pandas/pandas-original.svg' },
                                    { s: 'Make.com', p: 'numpy/numpy-original.svg' },
                                    { s: 'Jupyter', p: 'jupyter/jupyter-original.svg' },
                                    { s: 'Scikit-Learn', p: 'scikitlearn/scikitlearn-original.svg' },
                                    { s: 'CrewAI', p: 'tensorflow/tensorflow-original.svg' },
                                    { s: 'AutoGen', p: 'pytorch/pytorch-original.svg' },
                                    { s: 'OpenCV', p: 'opencv/opencv-original.svg' },
                                    { s: 'Matplotlib', p: 'matplotlib/matplotlib-original.svg' },
                                    { s: 'SQL', p: 'mysql/mysql-original.svg' }
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
                                <h3>AI & Cloud Tools</h3>
                                <div className={styles.skillCountTag}>Enterprise Grade</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'AWS', p: 'amazonwebservices/amazonwebservices-original-wordmark.svg' },
                                    { s: 'Docker', p: 'docker/docker-original.svg' },
                                    { s: 'Azure', p: 'azure/azure-original.svg' },
                                    { s: 'Git', p: 'git/git-original.svg' },
                                    { s: 'Linux', p: 'linux/linux-original.svg' },
                                    { s: 'MongoDB', p: 'mongodb/mongodb-original.svg' },
                                    { s: 'Tableau', p: 'tableau/tableau-original.svg' }
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
                    </div>
                </section>

                {/* PAGE 6: ELITE CURRICULUM - FOUNDATION */}
                <section className={styles.page}>
                    <Header pageNum="06" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>DATA FOUNDATION</h2>
                            <p>Statistical & Analytical Mastery</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "01",
                                    t: "Prompt Engineering",
                                    p: ["Variables & Data Types", "Control Structures", "Functions & OOPs", "Exception Handling"],
                                    tech: ["Python", "Logic"]
                                },
                                {
                                    n: "02",
                                    t: "Large Language Models & APIs",
                                    p: ["Linear Algebra Basics", "Probability Distributions", "Hypothesis Testing", "Descriptive Stats"],
                                    tech: ["Math", "Stats"]
                                },
                                {
                                    n: "03",
                                    t: "Workflow Automation",
                                    p: ["Make.com Arrays & Matrices", "Zapier DataFrames", "Data Cleaning/Wrangling", "EDA Techniques"],
                                    tech: ["Zapier", "Make.com"]
                                },
                                {
                                    n: "04",
                                    t: "App Builders (Bubble, FlutterFlow)",
                                    p: ["Matplotlib & Seaborn", "Plotly Interactive Plots", "PowerBI Dashboards", "Storytelling with Data"],
                                    tech: ["Viz", "PowerBI"]
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
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>AI Core Concepts</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>02</div>
                                <span>No-Code Development</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 7: ELITE CURRICULUM - MACHINE LEARNING */}
                <section className={styles.page}>
                    <Header pageNum="07" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>MACHINE LEARNING</h2>
                            <p>Predictive Modeling Core</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "05",
                                    t: "LangChain & LlamaIndex",
                                    p: ["Linear/Logistic Regression", "Decision Trees & Forests", "SVM & KNN", "Model Evaluation (ROC/AUC)"],
                                    tech: ["Sklearn", "ML"]
                                },
                                {
                                    n: "06",
                                    t: "Agentic Frameworks (CrewAI, AutoGen)",
                                    p: ["K-Means Clustering", "Hierarchical Clustering", "PCA & Dimensionality", "Association Rules"],
                                    tech: ["Clustering", "PCA"]
                                },
                                {
                                    n: "07",
                                    t: "RAG Architecture",
                                    p: ["Bagging & Boosting", "XGBoost Mastery", "Gradient Descent", "Hyperparameter Tuning"],
                                    tech: ["XGBoost", "Optimization"]
                                },
                                {
                                    n: "08",
                                    t: "Vector Databases",
                                    p: ["Text Processing (NLTK)", "Bag of Words/TF-IDF", "Sentiment Analysis", "Word Embeddings"],
                                    tech: ["NLP", "NLTK"]
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
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>AI Core Concepts</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>No-Code Development</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>03</div>
                                <span>Agentic AI</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ELITE CURRICULUM - DEEP LEARNING & AI */}
                <section className={styles.page}>
                    <Header pageNum="08" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>DEEP LEARNING & GenAI</h2>
                            <p>Multi-Agent Systems & LLMs</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "09",
                                    t: "Multi-Agent Systems",
                                    p: ["ANN Fundamentals", "Backpropagation", "Activation Functions", "CrewAI/Keras"],
                                    tech: ["DL", "Keras"]
                                },
                                {
                                    n: "10",
                                    t: "Autonomous Execution",
                                    p: ["CNN Architectures", "Object Detection (YOLO)", "Image Processing", "Face Recognition"],
                                    tech: ["CV", "YOLO"]
                                },
                                {
                                    n: "11",
                                    t: "Custom GPTs & OpenAI APIs",
                                    p: ["Transformers (BERT/GPT)", "LLM Architectures", "LangChain Framework", "Prompt Engineering"],
                                    tech: ["GenAI", "LLM"]
                                },
                                {
                                    n: "12",
                                    t: "Production AI Workflows",
                                    p: ["Model Serialization", "Flask/Streamlit UI", "Cloud Deployment (AWS)", "Model Monitoring"],
                                    tech: ["MLOps", "Cloud"]
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
                                </div>
                            ))}
                        </div>

                        <div className={styles.progressStrip}>
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>AI Core Concepts</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>No-Code Development</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Agentic AI</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 09: ELITE REAL-WORLD PROJECTS */}
                <section className={styles.page}>
                    <Header pageNum="09" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>AI CAPSTONE PROJECTS</h2>
                            <p>Build Intelligent Systems</p>
                        </div>

                        <div className={styles.projectGridLuxury}>
                            {[
                                {
                                    t: "Predictive Analytics",
                                    d: "Sales forecasting system using time-series analysis for retail chains.",
                                    tech: "Python, ARIMA, LSTM"
                                },
                                {
                                    t: "Customer Churn AI",
                                    d: "Classification model to predict and prevent user attrition for Telecom.",
                                    tech: "XGBoost, Sklearn"
                                },
                                {
                                    t: "GenAI Chatbot",
                                    d: "Custom LLM-powered assistant using RAG workflow for legal docs.",
                                    tech: "LangChain, OpenAI, Pinecone"
                                },
                                {
                                    t: "Medical Imaging",
                                    d: "CNN based system for detecting anomalies in X-Ray scans.",
                                    tech: "CrewAI, OpenCV"
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
                            <h4>Behind The Scenes: The AI Lifecycle</h4>
                            <div className={styles.journeyGrid}>
                                {[
                                    { s: "Data", t: "COLLECTION", d: "Sourcing" },
                                    { s: "Model", t: "TRAINING", d: "Optimization" },
                                    { s: "Test", t: "VALIDATION", d: "Accuracy" },
                                    { s: "Deploy", t: "PRODUCTION", d: "Live Use" }
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
                                <p>Learn from Gen AI Developers from top product companies.</p>
                                <div className={styles.trainerPillars}>
                                    {[
                                        { h: "Real Scientists", d: "Mentors who build AI models daily." },
                                        { h: "Math + Code", d: "Balanced approach to theory and practice." },
                                        { h: "Real-world Grandmasters", d: "Learn winning strategies." },
                                        { h: "Research Focus", d: "Stay ahead with latest papers." }
                                    ].map((pil, i) => (
                                        <div key={i} className={styles.pillarCard}>
                                            <h4>{pil.h}</h4>
                                            <p>{pil.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <div className={styles.testimonialsBlock}>
                                <h2>STUDENT SUCCESS</h2>
                                <div className={styles.testimonialsHorizontalGrid}>
                                    {/* Using generic reviews for now as placeholders, ideally specific to AI Full Stack */}
                                    {[
                                        { name: "Rahul V.", role: "Data Analyst @ Oracle", text: "The stats foundation was solid. Helped me crack the Oracle interview.", star: 5 },
                                        { name: "Suresh P.", role: "Gen AI Developer @ Cognizant", text: "From zero Python knowledge to a Gen AI Developer. Bytecode made it possible.", star: 5 },
                                        { name: "Anil K.", role: "AI Solutions Architect @ Absolute Labs", text: "The Agentic AI modules are intensive and industry relevant.", star: 5 }
                                    ].map((t, i) => (
                                        <div key={i} className={styles.testimonialCard}>
                                            <div className={styles.testiHeader}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.testiName}>{t.name}</span>
                                                </div>
                                                <div className={styles.stars}>
                                                    {[...Array(t.star)].map((_, si) => <Star key={si} size={12} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '0.5rem' }}>{t.role}</div>
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
                        <h2 style={{ fontSize: '3rem', fontWeight: 1000, color: 'var(--primary)' }}>STRATEGIC CAREER ROADMAP</h2>
                        <p style={{ fontWeight: 700, opacity: 0.7 }}>Your Weekly Journey to Becoming an AI Expert</p>
                    </div>

                    <div className={styles.roadmapConduit}>
                        <div className={styles.roadmapPathLine} />

                        {[
                            {
                                weeks: "0-4",
                                tech: ["Python Fundamentals", "Make.com & Zapier", "App Builders (Bubble, FlutterFlow)", "Exploratory Analysis"],
                                soft: ["Analytical Thinking", "Presentation Skills", "LinkedIn Optimization"]
                            },
                            {
                                weeks: "5-8",
                                tech: ["Statistics & Math", "Supervised ML", "Unsupervised ML", "Model Evaluation"],
                                soft: ["Business Understanding", "Problem Solving", "GitHub Portfolio"]
                            },
                            {
                                weeks: "9-12",
                                tech: ["Agentic AI (ANN/CNN)", "NLP Basics", "Autonomous Execution", "CrewAI/Keras"],
                                soft: ["Project Storytelling", "Research Reading", "Agile Methodology"]
                            },
                            {
                                weeks: "13+",
                                tech: ["Custom GPTs & OpenAI APIs & LLMs", "Cloud Deployment", "Capstone Project", "Mock Interviews"],
                                soft: ["Technical Interviews", "Salary Negotiation", "Resume Engineering"]
                            }
                        ].map((step, i) => (
                            <div key={i} className={styles.roadmapStepLuxury}>
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

                                <div className={styles.roadmapNodeCircle}>
                                    <strong>{step.weeks}</strong>
                                    <span>WEEKS</span>
                                </div>

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

                {/* PAGE 13: ZENITH ADMISSION COMMAND CENTER */}
                <section className={`${styles.page} ${styles.zenithPage}`}>
                    <Header pageNum="13" />

                    <div className={styles.zenithHeader}>
                        <h2>Ready to Start?</h2>
                        <p>Secure your seat in our upcoming batch.</p>
                    </div>

                    <div className={styles.zenithGrid}>
                        {/* LEFT: Course Fee */}
                        <div className={`${styles.zenithCard} ${styles.primary}`}>
                            <div className={styles.zenithDarkTitle}>
                                <div className={styles.zenithIconBox}>
                                    <Zap size={30} />
                                </div>
                                <span>Mastery Investment</span>
                            </div>

                            <div className={styles.zenithPriceLabel}>ONE-TIME PROGRAM FEE</div>
                            <div className={styles.zenithPriceValue}>
                                <span className={styles.zenithOriginalPrice}>₹65,000</span>
                                <span className={styles.zenithFinalPrice}>₹45,000</span>
                            </div>

                            <div className={styles.zenithFeatureList}>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Complete AI Full Stack (Zero Coding) Course</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>6 Months Internship Certificate</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Unlimited Placement Calls (1 Year)</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>AI Capstone Projects (Deployment)</span>
                                </div>
                            </div>

                            <div className={styles.zenithFinanceGrid}>
                                <div className={styles.zenithFinanceItem}>
                                    <FileDown size={20} color="var(--primary)" />
                                    <span>No Cost EMI</span>
                                </div>
                                <div className={styles.zenithFinanceItem}>
                                    <Award size={20} color="var(--primary)" />
                                    <span>Scholarships</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: ACTION MATRIX */}
                        <div className={styles.zenithContactStack}>
                            {/* CONTACT NODES */}
                            <a href="tel:+918309879187" style={{ textDecoration: 'none' }}>
                                <div className={styles.zenithContactRow}>
                                    <div className={styles.zenithIconBox}>
                                        <Phone size={24} />
                                    </div>
                                    <div className={styles.zenithContactDetails}>
                                        <h5>Admissions Hotline</h5>
                                        <p>+91 83098 79187</p>
                                    </div>
                                </div>
                            </a>

                            <div className={styles.zenithContactRow}>
                                <div className={styles.zenithIconBox} style={{ background: '#003087' }}>
                                    <MapPin size={24} />
                                </div>
                                <div className={styles.zenithContactDetails}>
                                    <h5>Campus HQ</h5>
                                    <p>Madhapur, Hyderabad</p>
                                </div>
                            </div>

                            {/* URGENCY TRIGGER */}
                            <div className={`${styles.zenithCard} ${styles.dark}`} style={{ marginTop: 'auto', padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>NEXT COHORT</h4>
                                        <p style={{ color: 'var(--secondary)', fontWeight: 800 }}>Starting Next Week</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h4 style={{ fontSize: '3rem', lineHeight: 1, color: '#fff' }}>06</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>SEATS LEFT</p>
                                    </div>
                                </div>
                            </div>

                            <button className={styles.zenithAction} onClick={() => {
                                const message = encodeURIComponent("Hi Bytecode! I'm interested in the AI Full Stack Developer course. Can you share more details?");
                                window.open(`https://wa.me/918309879187?text=${message}`);
                            }}>
                                Secure Your Seat <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
                <RelatedCourses currentPath="/brochure/ai-full-stack" />
            </div >
        </div >
    );
}
