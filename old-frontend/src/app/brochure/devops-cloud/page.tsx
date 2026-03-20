"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, Phone, Mail, MapPin,
    Rocket, Star, Globe, ShieldCheck, Zap,
    FileDown, ExternalLink, ChevronRight, Award,
    Users, Target, BookOpen, Layers, Check, Database, ArrowRight, Cloud, Server, Container
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

export default function DevOpsBrochure() {
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
        pdf.save('ByteCode-DevOps-Cloud-Brochure.pdf');
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
                                { Icon: Cloud, label: "Cloud" },
                                { Icon: Container, label: "DevOps" },
                                { Icon: Server, label: "Infra" },
                                { Icon: ShieldCheck, label: "Security" },
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
                            <h2>DEVOPS & CLOUD <br /> ENGINEERING</h2>
                            <p>
                                Architect the Future. Master AWS, Azure, Google Cloud, Docker, and Kubernetes
                                for Enterprise Scale Infrastructure.
                            </p>
                        </div>

                        <div className={styles.masterStatsGrid}>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>100%</div>
                                <div className={styles.masterStatLabel}>Success Rate</div>
                            </div>
                            <div className={styles.masterStat}>
                                <div className={styles.masterStatValue}>40 LPA+</div>
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
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>Elite Cloud Architect Program</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>Our Responsibility Till you get Placed.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                                Bytecode Trainings offers the market's most comprehensive Cloud Engineering & DevOps course.
                                From setting up Virtual Private Clouds to automating pipelines with CI/CD, we build
                                Cloud Architects ready for Fortune 500 infrastructure.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                {[
                                    { t: "Multi-Cloud", d: "Master AWS & Azure ecosystems." },
                                    { t: "Infrastructure as Code", d: "Automate with Terraform & Ansible." },
                                    { t: "Live Deployments", d: "Manage real production clusters." },
                                    { t: "Certifications", d: "Prepare for AWS/Azure Exams." }
                                ].map((h, i) => (
                                    <div key={i}>
                                        <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>{h.t}</h4>
                                        <p style={{ fontSize: '0.9rem' }}>{h.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" style={{ borderRadius: '20px', width: '100%' }} />
                    </div>
                </section>

                {/* PAGE 3: THE FUTURE */}
                <section className={styles.page}>
                    <Header pageNum="03" />
                    <div className={styles.futurePageWrapper}>
                        <div className={styles.futureHeader}>
                            <h2>BUILD YOUR FUTURE IN CLOUD</h2>
                            <p>Global Market Insights & Career Scope</p>
                        </div>

                        <div className={styles.insightGrid}>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Target size={40} /></div>
                                <h3>Critical Role</h3>
                                <p>Every modern company needs DevOps Engineers to maintain uptime and speed.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><Award size={40} /></div>
                                <h3>Salary Packages</h3>
                                <p>Cloud Architects start from 12 LPA and go up to 45 LPA+ for specialized roles.</p>
                            </div>
                            <div className={styles.insightCard}>
                                <div className={styles.insightIconBox}><ShieldCheck size={40} /></div>
                                <h3>Cloud Boom</h3>
                                <p>50% CAGR in Cloud Computing jobs predicted over the next decade.</p>
                            </div>
                        </div>

                        <div className={styles.whyPanelLuxury}>
                            <div className={styles.whyContent}>
                                <h2>Why <br /> ByteCode?</h2>
                                <div className={styles.benefitGrid}>
                                    {[
                                        "Master AWS, Azure & GCP Fundamentals",
                                        "Hands-on Docker & Kubernetes Clustering",
                                        "Real-time CI/CD with Jenkins & GitLab",
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
                                        src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop"
                                        className={styles.luxuryImage}
                                        alt="Server Room"
                                    />
                                    <div className={styles.achievementTag}>Best Cloud Lab</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.eliteMetricsBar}>
                            {[
                                { Icon: Cloud, value: "Multi", label: "Cloud Ready" },
                                { Icon: Zap, value: "Elite", label: "Tech Stack" },
                                { Icon: Globe, value: "Global", label: "Certified" },
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
                                        t: "Linux & Networking",
                                        d: "Mastering the operating system that powers the internet and core networking concepts.",
                                        c: "#003087"
                                    },
                                    {
                                        n: "02",
                                        t: "Cloud Architecting",
                                        d: "Designing secure, scalable, and high-availability systems on AWS and Azure.",
                                        c: "#27ae60"
                                    },
                                    {
                                        n: "03",
                                        t: "Containerization & Orchestration",
                                        d: "Dockerizing applications and managing massive clusters with Kubernetes.",
                                        c: "#d63031"
                                    },
                                    {
                                        n: "04",
                                        t: "Automation & DevOps",
                                        d: "Implementing CI/CD pipelines, Infrastructure as Code, and Monitoring.",
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
                                <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop" alt="Cloud Ops" />
                                <div className={styles.roadmapImageOverlay}>
                                    <h4>Scale Limitless</h4>
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
                            <p>Master the Tools that Power the Internet</p>
                        </div>

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>Cloud Platforms</h3>
                                <div className={styles.skillCountTag}>Industry Standard</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'AWS', p: 'amazonwebservices/amazonwebservices-original-wordmark.svg' },
                                    { s: 'Azure', p: 'azure/azure-original.svg' },
                                    { s: 'Google Cloud', p: 'googlecloud/googlecloud-original.svg' },
                                    { s: 'Linux', p: 'linux/linux-original.svg' },
                                    { s: 'Bash', p: 'bash/bash-original.svg' },
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

                        <div className={styles.skillCategoryWrap}>
                            <div className={styles.skillCategoryHeader}>
                                <h3>DevOps Tools</h3>
                                <div className={styles.skillCountTag}>Automation Core</div>
                            </div>
                            <div className={styles.skillGrid}>
                                {[
                                    { s: 'Docker', p: 'docker/docker-original.svg' },
                                    { s: 'Kubernetes', p: 'kubernetes/kubernetes-plain.svg' },
                                    { s: 'Terraform', p: 'terraform/terraform-original.svg' },
                                    { s: 'Jenkins', p: 'jenkins/jenkins-original.svg' },
                                    { s: 'Ansible', p: 'ansible/ansible-original.svg' },
                                    { s: 'Git', p: 'git/git-original.svg' },
                                    { s: 'Grafana', p: 'grafana/grafana-original.svg' },
                                    { s: 'Prometheus', p: 'prometheus/prometheus-original.svg' }
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
                            <h2>INFRASTRUCTURE FOUNDATION</h2>
                            <p>SysAdmin & Basic Cloud</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "01",
                                    t: "Linux Administration",
                                    p: ["File System Hierarchy", "User Management & Permissions", "Process Management", "Shell Scripting (Bash)"],
                                    tech: ["Linux", "Bash"]
                                },
                                {
                                    n: "02",
                                    t: "Networking Core",
                                    p: ["OSI Model & TCP/IP", "DNS, DHCP, HTTP/S", "Subnetting & CIDR", "Firewall Configuration"],
                                    tech: ["Network", "Security"]
                                },
                                {
                                    n: "03",
                                    t: "AWS Cloud Basics",
                                    p: ["EC2 Computing", "S3 Storage Classes", "VPC Networking", "IAM Security Policies"],
                                    tech: ["AWS", "VPC"]
                                },
                                {
                                    n: "04",
                                    t: "Version Control",
                                    p: ["Git Commands & Workflow", "GitHub/GitLab", "Branching Strategies", "Pull Requests/Code Review"],
                                    tech: ["Git", "Collab"]
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
                                <span>Infra Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>02</div>
                                <span>Containerization</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 7: ELITE CURRICULUM - CONTAINERS */}
                <section className={styles.page}>
                    <Header pageNum="07" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>CONTAINERS & ORCHESTRATION</h2>
                            <p>Modern Deployment Architecture</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "05",
                                    t: "Docker Mastery",
                                    p: ["Container Lifecycle", "DockerFiles & Images", "Docker Compose", "Multi-stage Builds"],
                                    tech: ["Docker", "Images"]
                                },
                                {
                                    n: "06",
                                    t: "Kubernetes Core",
                                    p: ["Architecture (Master/Worker)", "Pods, Deployments, Services", "ConfigMaps & Secrets", "Namespaces"],
                                    tech: ["K8s", "Cluster"]
                                },
                                {
                                    n: "07",
                                    t: "Advanced K8s",
                                    p: ["Helm Package Manager", "Ingress Controllers", "StatefulSets", "Auto-scaling (HPA/VPA)"],
                                    tech: ["Helm", "Scaling"]
                                },
                                {
                                    n: "08",
                                    t: "Cloud Specific K8s",
                                    p: ["AWS EKS Setup", "Azure AKS Management", "Ingress with Load Balancers", "RBAC & Security"],
                                    tech: ["EKS", "AKS"]
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
                                <span>Infra Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Containerization</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'rgba(0,48,135,0.1)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}>03</div>
                                <span>Automation</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 8: ELITE CURRICULUM - AUTOMATION */}
                <section className={styles.page}>
                    <Header pageNum="08" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>AUTOMATION & CI/CD</h2>
                            <p>DevOps Pipelines & IaC</p>
                        </div>

                        <div className={styles.curriculumGrid}>
                            {[
                                {
                                    n: "09",
                                    t: "CI/CD Pipelines",
                                    p: ["Jenkins Declarative Pipelines", "GitLab CI/CD", "Automated Testing Integration", "Artifact Management (Nexus)"],
                                    tech: ["Jenkins", "CI/CD"]
                                },
                                {
                                    n: "10",
                                    t: "Infrastructure as Code",
                                    p: ["Terraform Providers & State", "Modules & Workspaces", "Ansible Playbooks", "Configuration Management"],
                                    tech: ["Terraform", "Ansible"]
                                },
                                {
                                    n: "11",
                                    t: "Monitoring & Logging",
                                    p: ["Prometheus Metrics", "Grafana Dashboards", "ELK Stack (Elastic)", "CloudWatch Alerts"],
                                    tech: ["Grafana", "ELK"]
                                },
                                {
                                    n: "12",
                                    t: "DevSecOps",
                                    p: ["Static Code Analysis (SonarQube)", "Container Security", "Compliance as Code", "Secret Management"],
                                    tech: ["Security", "SonarQube"]
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
                                <span>Infra Foundation</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={styles.nodeCircle}><Check size={10} /></div>
                                <span>Containerization</span>
                            </div>
                            <div style={{ flex: 1, height: '2px', background: 'var(--primary)', margin: '0 1rem' }} />
                            <div className={styles.progressNode}>
                                <div className={`${styles.nodeCircle} ${styles.active}`}><Check size={10} /></div>
                                <span>Automation</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PAGE 09: ELITE REAL-WORLD PROJECTS */}
                <section className={styles.page}>
                    <Header pageNum="09" />
                    <div className={styles.curriculumUniverse}>
                        <div className={styles.curriculumHeader}>
                            <h2>DEVOPS LIVE PROJECTS</h2>
                            <p>Architecting for Scale</p>
                        </div>

                        <div className={styles.projectGridLuxury}>
                            {[
                                {
                                    t: "Microservices Deployment",
                                    d: "End-to-end deployment of a 10-service e-com app on EKS with Istio mesh.",
                                    tech: "AWS EKS, Istio, Helm"
                                },
                                {
                                    t: "Serverless Pipeline",
                                    d: "Automated CI/CD for Lambda functions using GitHub Actions and Terraform.",
                                    tech: "Lambda, GitHub Actions"
                                },
                                {
                                    t: "Hybrid Cloud Setup",
                                    d: "VPN Tunneling between on-premise datacenter and Azure VNet.",
                                    tech: "Azure, Networking"
                                },
                                {
                                    t: "Zero-Downtime Rollout",
                                    d: "Blue/Green deployment strategy implementation for high-traffic web apps.",
                                    tech: "Jenkins, ArgoCD"
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
                            <h4>The Automation Lifecycle</h4>
                            <div className={styles.journeyGrid}>
                                {[
                                    { s: "Plan", t: "ARCHITECT", d: "Design" },
                                    { s: "Code", t: "INFRASTRUCTURE", d: "Terraform" },
                                    { s: "Build", t: "CI PIPELINE", d: "Jenkins" },
                                    { s: "Run", t: "CD DEPLOY", d: "K8s" }
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
                                <h2>CLOUD ARCHITECT MENTORS</h2>
                                <p>Learn from Senior DevOps Engineers managing massive production clusters.</p>
                                <div className={styles.trainerPillars}>
                                    {[
                                        { h: "Certified Pros", d: "AWS/Azure Solutions Architects." },
                                        { h: "Production Ready", d: "We break things to learn how to fix them." },
                                        { h: "Security First", d: "DevSecOps best practices in every lesson." },
                                        { h: "Cost Optimization", d: "Learn FinOps and cloud economy." }
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
                                    {/* Using generic reviews for now as placeholders, ideally specific to Data Science */}
                                    {[
                                        { name: "Kiran R.", role: "DevOps Engineer @ TCS", text: "The AWS and Kubernetes modules are deep. Helped me switch from Support to DevOps.", star: 5 },
                                        { name: "Sandeep M.", role: "Cloud Engineer @ HCL", text: "Terraform was a game changer. The hands-on labs are brilliant.", star: 5 },
                                        { name: "Vijay K.", role: "SRE @ Mindtree", text: "Understanding the full CI/CD lifecycle helped me clear multiple interviews.", star: 5 },
                                        { name: "Ramya S.", role: "Azure Admin @ Wipro", text: "Best place to learn Cloud in depth. The instructors are very knowledgeable.", star: 5 }
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
                        <p style={{ fontWeight: 700, opacity: 0.7 }}>Your Journey to Cloud Architect</p>
                    </div>

                    <div className={styles.roadmapConduit}>
                        <div className={styles.roadmapPathLine} />

                        {[
                            {
                                weeks: "0-4",
                                tech: ["Linux Administration", "Shell Scripting", "Networking Basics", "Git Version Control"],
                                soft: ["Troubleshooting Mindset", "Documentation", "Communication Basics"]
                            },
                            {
                                weeks: "5-8",
                                tech: ["AWS Solutions Architect", "VPC & Security", "EC2 & S3", "Load Balancers"],
                                soft: ["Architecture Design", "Cost Estimation", "Client Presentation"]
                            },
                            {
                                weeks: "9-12",
                                tech: ["Docker Containers", "Kubernetes Orchestration", "Helm Charts", "Microservices Patterns"],
                                soft: ["System Scalability", "Resilience Planning", "Team Collaboration"]
                            },
                            {
                                weeks: "13+",
                                tech: ["Terraform (IaC)", "Jenkins CI/CD", "Prometheus/Grafana", "DevSecOps"],
                                soft: ["Incident Management", "Mock Interviews", "Salary Negotiation"]
                            }
                        ].map((step, i) => (
                            <div key={i} className={styles.roadmapStepLuxury}>
                                <div className={`${styles.roadmapWing} ${styles.left}`}>
                                    <div className={styles.wingHeader}>
                                        <Server size={16} /> <span>TECHNICAL SKILLS</span>
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
                            { name: "Prasad", company: "Gemini", pkg: "3.5", image: "/placements/Prasad.png" },
                            { name: "Ganesh", company: "Tech Mahindra", pkg: "5.0", image: "/placements/Ganesh-K.png" },
                            { name: "Harish", company: "Cloud Leaf", pkg: "5.0", image: "/placements/Harish-K.png" },
                            { name: "Santhavana", company: "Cognizant", pkg: "4.0", image: "/placements/Santhavana.png" },
                            { name: "Phani B", company: "Centillion", pkg: "3.5", image: "/placements/Phani.png" },
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
                        <p>Secure Your Seat in the Elite DevOps Cohort</p>
                    </div>

                    <div className={styles.zenithGrid}>
                        {/* LEFT: INVESTMENT ARCHITECTURE */}
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
                                    <span>AWS & DevOps Certified Training</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Real Production Cloud Labs</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Unlimited Placement Support (1 Year)</span>
                                </div>
                                <div className={styles.zenithFeature}>
                                    <div className={styles.zenithCheck}><Check size={16} /></div>
                                    <span>Resume & Interview Prep</span>
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
                                        <h4 style={{ fontSize: '3rem', lineHeight: 1, color: '#fff' }}>08</h4>
                                        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>SEATS LEFT</p>
                                    </div>
                                </div>
                            </div>

                            <button className={styles.zenithAction} onClick={() => window.open('https://wa.me/918309879187')}>
                                Secure Your Seat <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
