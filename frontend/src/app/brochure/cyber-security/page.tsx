"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, Phone, Mail, MapPin,
    Rocket, Star, Globe, ShieldCheck, Zap,
    FileDown, ExternalLink, ChevronRight, Award,
    Users, Target, BookOpen, Layers, Check, Database, ArrowRight, Lock, Key, Eye
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

export default function CyberSecurityBrochure() {
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
        pdf.save('Bytecode-Cyber-Security-Brochure.pdf');
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
                    <button className={styles.exitBtn} style={{ background: '#f39200' }} onClick={() => router.push('/payment?course=Cyber+Security&fee=35000')}>Enroll Now</button>
                </div>
            </nav>

            <div ref={brochureRef}>
                {/* PAGE 1: VERTICAL MASTER COVER */}
                <section className={styles.heroPage}>
                    <div className={styles.verticalSidebar}>
                        <Image src="/logo.png" className={styles.logoMini} alt="Logo" width={100} height={30} />
                        <div className={styles.verticalPillars}>
                            {[
                                { Icon: Lock, label: "Security" },
                                { Icon: Eye, label: "VAPT" },
                                { Icon: Key, label: "Access" },
                                { Icon: ShieldCheck, label: "Defense" },
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
                            <h2>CYBER SECURITY & <br /> ETHICAL HACKING</h2>
                            <p>
                                Defend the Digital Frontier. Master Penetration Testing, Network Security,
                                and SOC Operations to become a certified Cyber Warrior.
                            </p>
                        </div>

                        <div className={styles.masterStatsGrid}>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>100%</div>
                                <div className={styles.masterStatLabel}>Success Rate</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>28 LPA+</div>
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
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>Complete Security Program</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Zero to employed. We support you the whole way.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                Bytecode Trainings delivers a cutting-edge Cyber Security curriculum designed for the modern threat landscape.
                                From offensive ethical hacking to defensive SOC operations, we train you to protect enterprise infrastructure.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {[
                                    { t: "Ethical Hacking", d: "Master the art of offense to build better defense." },
                                    { t: "SOC Operations", d: "Monitor and respond to real-time threats." },
                                    { t: "Live Labs", d: "Practice attacks in safe, sandboxed environments." },
                                    { t: "Global Certs", d: "Prepare for CEH, CISSP & CompTIA Security+." }
                                ].map((h, i) => (
                                    <div key={i}>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>{h.t}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{h.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop" alt="Cover Image" style={{ borderRadius: '20px', width: '100%' }} width={600} height={400} />
                    </div>
                </section>

                {/* PAGE 3: THE FUTURE */}
                <section className={styles.page}>
                    <Header pageNum="03" />
                    <div className={styles.futurePageWrapper}>
                        <div className={styles.futureHeader}>
                            <h2>BUILD YOUR FUTURE IN SECURITY</h2>
                            <p>Global Market Insights & Career Scope</p>
                        </div>

                        <div className={styles.insightGrid}>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Target size={40} /></div>
                                <h3>Zero Unemployment</h3>
                                <p>Cybersecurity has 0% unemployment rate with massive talent shortage globally.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Award size={40} /></div>
                                <h3>Salary Packages</h3>
                                <p>Freshers start from 6 LPA, reaching 30 LPA+ quickly with specializations.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><ShieldCheck size={40} /></div>
                                <h3>Digital Guard</h3>
                                <p>As the world goes digital, the need for security professionals explodes.</p>
                            </div>
                        </div>

                        <div className={styles.whyPanelLuxury}>
                            <div className={styles.whyContent}>
                                <h2>Why <br /> Bytecode?</h2>
                                <div className={styles.benefitGrid}>
                                    {[
                                        "Master Kali Linux & Metasploit Framework",
                                        "Hands-on VAPT & Bug Bounty Hunting",
                                        "Real-time SOC Analysis with Splunk",
                                        "Direct Placement Access to MNCs"
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
                                        src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
                                        className={styles.luxuryImage}
                                        alt="Security Ops Center"
                                    />
                                    <div className={styles.achievementTag}>Best Security Lab</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.eliteMetricsBar}>
                            {[
                                { Icon: Lock, value: "100%", label: "Secure" },
                                { Icon: Zap, value: "Elite", label: "Tools" },
                                { Icon: Globe, value: "Global", label: "Scope" },
                                { Icon: Award, value: "Top 1%", label: "Training" }
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
                                        t: "Networking & OS Fundamentals",
                                        d: "Deep dive into Linux, Windows internals, and Networking protocols (TCP/IP, DNS).",
                                        c: "#003087"
                                    },
                                    {
                                        n: "02",
                                        t: "Ethical Hacking Basics",
                                        d: "Information Gathering, Scanning, Enumeration, and Vulnerability Assessment.",
                                        c: "#27ae60"
                                    },
                                    {
                                        n: "03",
                                        t: "Advanced Penetration Testing",
                                        d: "System Hacking, Web App Security, Wireless Hacking, and Social Engineering.",
                                        c: "#d63031"
                                    },
                                    {
                                        n: "04",
                                        t: "SOC & Security Operations",
                                        d: "Log Analysis, Incident Response, SIEM tools, and Blue Teaming strategies.",
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
                                <Image src="https://images.unsplash.com/photo-1549419137-3375c3f7652c?q=80&w=600&auto=format&fit=crop" alt="Hacker" width={600} height={400} />
                                <div className={styles.roadmapImageOverlay}>
                                    <h4>Defend The Future</h4>
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
                            <h2>ELITE SECURITY ARSENAL</h2>
                            <p>Master Industry Standard Attack & Defense Tools</p>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>Offensive Security</h3>
                                <div className={styles.skillCountTag}>Red Team Tools</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'Kali Linux', p: 'linux/linux-original.svg' },
                                    { s: 'Python', p: 'python/python-original.svg' },
                                    { s: 'Metasploit', p: 'metasploit/metasploit-original.svg' }, // Assuming icon, fallback to generic if specific missing
                                    { s: 'Burp Suite', p: 'jenkins/jenkins-original.svg' }, // Placeholder, no burp icon in devicon usually
                                    { s: 'Wireshark', p: 'xd/xd-original.svg' }, // Placeholder
                                    // Using more generic devicons where specific security tools might be missing, 
                                    // relying on text.
                                    { s: 'Nmap', p: 'bash/bash-original.svg' },
                                    { s: 'Bash', p: 'bash/bash-original.svg' }
                                ].map(tech => (
                                    <div key={tech.s} className={styles.skillItemLuxury}>
                                        <div className={styles.skillLogoBox}>
                                            {/* Using generic icons for specialized tools if needed - simple logic */}
                                            <img src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.p}`} alt={tech.s} />
                                        </div>
                                        <div className={styles.skillName}>{tech.s}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>Defensive & Cloud</h3>
                                <div className={styles.skillCountTag}>Blue Team</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'AWS Security', p: 'amazonwebservices/amazonwebservices-original-wordmark.svg' },
                                    { s: 'Azure Sentinel', p: 'azure/azure-original.svg' },
                                    { s: 'Splunk', p: 'splunk/splunk-original-wordmark.svg' }, // May not exist
                                    { s: 'Linux', p: 'linux/linux-original.svg' },
                                    { s: 'Docker', p: 'docker/docker-original.svg' },
                                    { s: 'Python', p: 'python/python-original.svg' }
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
                            <h2>SECURITY FUNDAMENTALS</h2>
                            <p>Systems & Networks</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "01",
                                    t: "Linux for Hackers",
                                    p: ["Kali Directory Structure", "User Permissions & Groups", "Network Configuration", "Bash Scripting"],
                                    tech: ["Linux", "Kali"]
                                },
                                {
                                    n: "02",
                                    t: "Network Essentials",
                                    p: ["OSI & TCP/IP Models", "IP Addressing & Subnetting", "Ports & Protocols", "Wireshark Packet Analysis"],
                                    tech: ["Network", "TCP/IP"]
                                },
                                {
                                    n: "03",
                                    t: "Python for Security",
                                    p: ["Scripting Basics", "Socket Programming", "Developing Port Scanners", "Automating Attacks"],
                                    tech: ["Python", "Scripting"]
                                },
                                {
                                    n: "04",
                                    t: "Cryptography",
                                    p: ["Symmetric/Asymmetric Encryption", "Hashing Algorithms", "PKI Infrastructure", "Steganography"],
                                    tech: ["Crypto", "Safety"]
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
                                <span>Fundamentals</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>02</div>
                                <span>Ethical Hacking</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 7: ELITE CURRICULUM - OFFENSIVE */}
                <section className={styles.page}>
                    <Header pageNum="07" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>ETHICAL HACKING</h2>
                            <p>The Art of Attack</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "05",
                                    t: "Vulnerability Assessment",
                                    p: ["Information Gathering", "Nmap Scanning Techniques", "Nessus Vulnerability Scanning", "Enumeration"],
                                    tech: ["Nmap", "Scan"]
                                },
                                {
                                    n: "06",
                                    t: "System Hacking",
                                    p: ["Metasploit Framework", "Exploit Development", "Privilege Escalation", "Password Cracking"],
                                    tech: ["Exploit", "Metasploit"]
                                },
                                {
                                    n: "07",
                                    t: "Web App Security",
                                    p: ["OWASP Top 10", "SQL Injection", "XSS & CSRF Exploits", "Burp Suite Mastery"],
                                    tech: ["OWASP", "Web"]
                                },
                                {
                                    n: "08",
                                    t: "Advanced Hacking",
                                    p: ["Wireless Network Attacks", "Social Engineering", "DoS/DDoS Attacks", "Evading IDS/Firewalls"],
                                    tech: ["Wifi", "Social"]
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
                                <span>Fundamentals</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Ethical Hacking</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>03</div>
                                <span>Defense SOC</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ELITE CURRICULUM - DEFENSIVE */}
                <section className={styles.page}>
                    <Header pageNum="08" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>DEFENSIVE & SOC</h2>
                            <p>Security Operations Center</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "09",
                                    t: "SOC Operations",
                                    p: ["SOC Architecture", "Incident Response Lifecycle", "Log Management", "Threat Intelligence"],
                                    tech: ["SOC", "Ops"]
                                },
                                {
                                    n: "10",
                                    t: "SIEM Tools",
                                    p: ["Splunk Fundamentals", "Creating Dashboards", "Alerts & Correlation", "Log Analysis"],
                                    tech: ["Splunk", "SIEM"]
                                },
                                {
                                    n: "11",
                                    t: "Cloud Security",
                                    p: ["AWS Security Services", "Azure Sentinel", "Identity Access Mgmt", "Compliance (GDPR/ISO)"],
                                    tech: ["Cloud", "IAM"]
                                },
                                {
                                    n: "12",
                                    t: "Career Preparation",
                                    p: ["Bug Bounty Hunting", "Report Writing", "Mock Interviews", "Resume Engineering"],
                                    tech: ["Career", "Jobs"]
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
                                <span>Fundamentals</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Ethical Hacking</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Defense SOC</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 09: ELITE REAL-WORLD PROJECTS */}
                <section className={styles.page}>
                    <Header pageNum="09" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>SECURITY CAPSTONES</h2>
                            <p>Live Attack & Defense Scenarios</p>
                        </div>

                        <div className={styles.projectGridLuxury}>
                            {[
                                {
                                    t: "Corporate VAPT",
                                    d: "Full penetration testing of a sample corporate network and generating audit reports.",
                                    tech: "Nmap, Metasploit"
                                },
                                {
                                    t: "Android Malware",
                                    d: "Creating and analyzing Android trojans to understand mobile security threats.",
                                    tech: "Android, Reverse Eng."
                                },
                                {
                                    t: "SOC Monitoring",
                                    d: "Setting up Splunk to monitor real-time attacks on a web server.",
                                    tech: "Splunk, Apache"
                                },
                                {
                                    t: "CTF Challenges",
                                    d: "Participating in Capture The Flag competitions to solve security puzzles.",
                                    tech: "Cryptography, Web"
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
                            <h4>The Attack Cycle</h4>
                            <div className={styles.journeyGrid}>
                                {[
                                    { s: "Recon", t: "SCANNING", d: "Discovery" },
                                    { s: "Gain", t: "ACCESS", d: "Exploitation" },
                                    { s: "Maintain", t: "PERSISTENCE", d: "Backdoor" },
                                    { s: "Cover", t: "TRACKS", d: "Logs" }
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
                                <h2>SECURITY EXPERT MENTORS</h2>
                                <p>Learn from Certified Ethical Hackers and CISSP Professionals.</p>
                                <div className={styles.trainerPillars}>
                                    {[
                                        { h: "Certified", d: "Licensed CEH & CISSP Instructors." },
                                        { h: "Red Teamers", d: "Active Bug Bounty Hunters." },
                                        { h: "Lab Driven", d: "90% Practical, 10% Theory." },
                                        { h: "Dark Web", d: "Understanding the underground safely." }
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
                                    {[
                                        { name: "Pradeep K.", role: "Security Analyst @ Wipro", text: "The practical labs on Metasploit were amazing. Helped me clear the CEH exam.", star: 5 },
                                        { name: "Sneha D.", role: "SOC Analyst @ Deloitte", text: "Splunk training was top notch. I use what I learned every day at work.", star: 5 },
                                        { name: "Arun V.", role: "Pen Tester @ Paladion", text: "Best institute for Ethical Hacking in Hyderabad. Real techniques, no fluff.", star: 5 },
                                        { name: "Ravi S.", role: "Security Engineer @ Infosys", text: "From networking basics to advanced exploits, the journey was perfect.", star: 5 }
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
                        <p style={{ fontWeight: 700, opacity: 0.7 }}>Your Path to Certified Ethical Hacker</p>
                    </div>

                    <div className={styles.roadmapConduit}>
                        <div className={styles.roadmapPathLine} />

                        {[
                            {
                                weeks: "0-4",
                                tech: ["Linux Fundamentals", "Networking (TCP/IP)", "Python for Security", "Lab Setup"],
                                soft: ["Ethics of Hacking", "Analytical Thinking", "Reporting Basics"]
                            },
                            {
                                weeks: "5-8",
                                tech: ["Information Gathering", "Vulnerability Scanning", "System Hacking", "Password Cracking"],
                                soft: ["Risk Assessment", "Client Communication", "Problem Solving"]
                            },
                            {
                                weeks: "9-12",
                                tech: ["Web App Security", "Wireless Hacking", "Metasploit Mastery", "Sniffing & Spoofing"],
                                soft: ["Attention to Detail", "Persistence", "Creative Thinking"]
                            },
                            {
                                weeks: "13+",
                                tech: ["SOC Operations", "Splunk/SIEM", "Bug Bounty Hunting", "Mock Interviews"],
                                soft: ["Crisis Management", "Interview Prep", "Resume Building"]
                            }
                        ].map((step, i) => (
                            <div key={i} className={styles.roadmapStepLuxury}>
                                <div className={`${styles.roadmapWing} ${styles.left}`}>
                                    <div className={styles.wingHeader}>
                                        <Lock size={16} /> <span>TECHNICAL SKILLS</span>
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

                {/* PAGE 13: ZENITH ADMISSION COMMAND CENTER */}
                <section className={`${styles.page} ${styles.zenithPage}`}>
                    <Header pageNum="13" />

                    <div className={styles.zenithHeader}>
                        <h2>Ready to Start?</h2>
                        <p>Secure Your Seat in the Cyber Defense Squad</p>
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
                                    <span>Certified Ethical Hacker Training</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>24/7 Virtual Hacking Lab Access</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Unlimited Placement Support (1 Year)</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>CompTIA & CISSP Guidance</span>
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
                                        <h4 style={{ fontSize: '3rem', lineHeight: 1, color: '#fff' }}>05</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>SEATS LEFT</p>
                                    </div>
                                </div>
                            </div>

                            <button className={styles.zenithAction} onClick={() => {
                                const message = encodeURIComponent("Hi Bytecode! I'm interested in the Cyber Security Bootcamp. Can you share more details?");
                                window.open(`https://wa.me/918309879187?text=${message}`);
                            }}>
                                Secure Your Seat <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
                <RelatedCourses currentPath="/brochure/cyber-security" />
            </div>
        </div>
    );
}
