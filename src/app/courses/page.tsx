"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import styles from './courses.module.css';
import { Search, Clock, Users, Star, Zap, Code, Database, Cloud, Layers, Calendar, AlertCircle, Quote, X, ArrowRight, Trophy, Rocket, Download, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

const COURSES = [
    {
        id: 1,
        title: "Java Full Stack Masterclass",
        category: "Development",
        level: "Intermediate",
        duration: "6 Months",
        students: "2.5k+",
        rating: 4.8,
        price: "₹35,000",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80",
        featured: true,
        techStack: ["Java", "Spring Boot", "React", "MySQL"],
        startDate: "Feb 12, 2024",
        seatsLeft: 5,
        modules: [
            { title: "Module 1: Java Core & OOPS Mastery", desc: "Master basic Java, OOPS, Collections, and Exception Handling with 50+ coding challenges." },
            { title: "Module 2: Advanced Java & Design Patterns", desc: "Java 17 features, Multithreading, Lambdas, and Creational/Structural Design Patterns." },
            { title: "Module 3: Database & ORM (Hibernat/JPA)", desc: "Relational modeling, Advanced SQL queries, and JPA entity management with Hibernate." },
            { title: "Module 4: Spring Boot 3 Engine", desc: "Building REST APIs, Spring Security, JWT authentication, and Spring Data JPA integration." },
            { title: "Module 5: Frontend with React & Next.js", desc: "Hooks, Context API, Redux Toolkit, and building responsive dashboards for Java backends." },
            { title: "Module 6: Supercharge with Microservices", desc: "Spring Cloud, Eureka, API Gateway, Circuit Breaker, and Distributed Tracing." },
            { title: "Module 7: Industrial DevOps & AWS Deployment", desc: "Docker, Kubernetes, Jenkins CI/CD pipelines, and AWS EC2/RDS deployment." }
        ],
        mentors: ["Ex-Google Engineer", "Senior Architect @ Oracle"],
        placements: [
            { name: "Rahul S.", company: "Amazon", role: "SDE-1", package: "24 LPA", image: "https://i.pravatar.cc/150?u=rahul" },
            { name: "Priya D.", company: "Microsoft", role: "Backend Dev", package: "18 LPA", image: "https://i.pravatar.cc/150?u=priya" }
        ],
        brochureUrl: "#"
    },
    {
        id: 2,
        title: "Data Science & AI with Python",
        category: "Data Science",
        level: "Advanced",
        duration: "8 Months",
        students: "1.8k+",
        rating: 4.9,
        price: "₹45,000",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
        featured: true,
        techStack: ["Python", "TensorFlow", "Pandas", "PyTorch"],
        startDate: "Feb 15, 2024",
        seatsLeft: 12,
        modules: [
            { title: "Module 1: Advanced Python for Data Science", desc: "NumPy, Pandas, Matplotlib, and high-performance computing with Python." },
            { title: "Module 2: Statistical Foundations", desc: "Probability, Hypothesis Testing, Bayesean Stats, and Data Distribution analysis." },
            { title: "Module 3: Machine Learning Algorithms", desc: "Regression, Classification, Clustering, Random Forests, and GBMs with Scikit-Learn." },
            { title: "Module 4: Deep Learning Foundations", desc: "Neural Networks, CNNs for Vision, and RNNs for Sequential data using TensorFlow." },
            { title: "Module 5: Natural Language Processing (NLP)", desc: "Tokenization, Transformers, BERT, and Sentiment analysis." },
            { title: "Module 6: Generative AI & LLMs", desc: "Fine-tuning GPT models, RAG architecture, and Building AI Agents with LangChain." },
            { title: "Module 7: Production AI & MLOps", desc: "Deploying models to AWS/Azure, Model monitoring, and scaling AI pipelines." }
        ],
        mentors: ["AI Researcher @ Meta", "Data Scientist @ Amazon"],
        placements: [
            { name: "Arjun K.", company: "Google", role: "AI Engineer", package: "32 LPA", image: "https://i.pravatar.cc/150?u=arjun" },
            { name: "Sneha V.", company: "Uber", role: "Data Scientist", package: "22 LPA", image: "https://i.pravatar.cc/150?u=sneha" }
        ],
        brochureUrl: "#"
    },
    {
        id: 3,
        title: "DevOps & Cloud Engineering",
        category: "Cloud",
        level: "Advanced",
        duration: "5 Months",
        students: "1.2k+",
        rating: 4.7,
        price: "₹40,000",
        image: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80",
        featured: false,
        techStack: ["AWS", "Docker", "Kubernetes", "Jenkins"],
        startDate: "Mar 01, 2024",
        seatsLeft: 20,
        modules: [
            { title: "Module 1: Linux & Scripting", desc: "Advanced Linux commands, Shell Scripting, and Cron Jobs for automation." },
            { title: "Module 2: AWS Infrastructure (IAS)", desc: "EC2, S3, VPC, IAM, and RDS setup with high availability." },
            { title: "Module 3: Infrastructure as Code (Terraform)", desc: "Provisioning AWS resources with Terraform HCL and State management." },
            { title: "Module 4: Containerization with Docker", desc: "Writing Dockerfiles, Networking, Volumes, and Docker Compose." },
            { title: "Module 5: Kubernetes Orchestration", desc: "K8s Architecture, Pods, Deployments, Services, and Helm Charts." },
            { title: "Module 6: CI/CD Pipelines (Jenkins/Actions)", desc: "Building automated pipelines for test and deployment." },
            { title: "Module 7: Cloud Monitoring & Logging", desc: "Prometheus, Grafana, ELK Stack, and CloudWatch." }
        ],
        mentors: ["Cloud Architect @ AWS", "DevOps Lead @ Netflix"],
        placements: [
            { name: "Vikram R.", company: "Oracle", role: "DevOps Engineer", package: "20 LPA", image: "https://i.pravatar.cc/150?u=vikram" },
            { name: "Nisha P.", company: "Adobe", role: "Cloud Security", package: "26 LPA", image: "https://i.pravatar.cc/150?u=nisha" }
        ],
        brochureUrl: "#"
    }
];

const STORIES = [
    {
        name: "Anjali Gupta",
        role: "SDE-II",
        company: "Google",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        quote: "The advanced curriculum here is exactly what I faced in my Google interviews. The system design module is world-class.",
        package: "45 LPA"
    },
    {
        name: "David Chen",
        role: "AI Researcher",
        company: "OpenAI",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        quote: "I went from zero knowledge of LLMs to building my own transformer models. Highly recommended for serious engineers.",
        package: "62 LPA"
    },
    {
        name: "Sarah Williams",
        role: "Cloud Architect",
        company: "AWS",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        quote: "ByteCode Trainings gave me the hands-on experience with Kubernetes that I couldn't find anywhere else.",
        package: "38 LPA"
    }
];

const CATEGORIES = ["All", "Development", "Data Science", "Cloud", "Security", "Design"];
const PATHS = [
    { title: "Full Stack Dev", desc: "Build complete web apps from scratch.", category: "Development", icon: <Code /> },
    { title: "Master AI", desc: "Analyze data and build intelligent models.", category: "Data Science", icon: <Database /> },
    { title: "Cloud Architect", desc: "Design and deploy scalable cloud systems.", category: "Cloud", icon: <Cloud /> },
];
const PARTNERS = ["Google", "Amazon", "Microsoft", "Netflix", "Meta", "Tesla", "Adobe", "Spotify", "Uber"];
const VIDEO_PREVIEWS = [
    { title: "Java Full Stack: Microservices", duration: "10:45", thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80", views: "1.2k" },
    { title: "Data Science: Stock Prices", duration: "15:20", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80", views: "950" },
    { title: "DevOps: Kubernetes Deploy", duration: "12:10", thumbnail: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80", views: "2.5k" }
];

export default function Courses() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const filteredCourses = COURSES.filter(course => {
        const matchesCategory = activeCategory === "All" || course.category === activeCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className={styles.main}>
            <div
                className={styles.mouseGlow}
                style={{ left: mousePos.x, top: mousePos.y }}
            />
            <Navbar />

            {/* HERO */}
            <section className={styles.heroSection}>
                <div className={styles.floatingIcons}>
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ top: '20%', left: '10%' }} className={styles.floatIcon}><Code size={40} /></motion.div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }} style={{ top: '60%', left: '15%' }} className={styles.floatIcon}><Database size={32} /></motion.div>
                    <motion.div animate={{ y: [0, -25, 0] }} transition={{ duration: 6, repeat: Infinity }} style={{ top: '30%', right: '10%' }} className={styles.floatIcon}><Cloud size={48} /></motion.div>
                    <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ top: '70%', right: '15%' }} className={styles.floatIcon}><ShieldCheck size={36} /></motion.div>
                </div>
                <div className={styles.heroBg}>
                    <div className={`${styles.orb} ${styles.orb1}`} />
                    <div className={`${styles.orb} ${styles.orb2}`} />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.heroTitle}
                    >
                        Elite Training <br /> For Tech Architects
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={styles.heroSubtitle}
                    >
                        PRODUCTION-GRADE CURRICULUM REVERSE-ENGINEERED FROM FANG ENGINEERING FLOORS.
                    </motion.p>
                </div>
            </section>

            {/* STATS */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <StatItem value="150%" label="Avg Salary Hike" />
                        <StatItem value="40 LPA" label="Highest Package" />
                        <StatItem value="500+" label="Hiring Partners" />
                        <StatItem value="95%" label="Placement Rate" />
                    </div>
                </div>
            </section>

            {/* SEARCH & COURSE REPOSITORY - MOVED UP AS "ONE AFTER ANOTHER" */}
            <section className={styles.searchSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Course Repository</h2>
                            <p className={styles.heroSubtitle} style={{ textAlign: 'left', margin: 0 }}>EXPLORE OUR TOTAL CURRICULUM MODULES ONE AFTER ANOTHER.</p>
                        </div>
                    </div>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchBarWrapper}>
                            <Search size={24} className="text-secondary" />
                            <input
                                type="text"
                                placeholder="Search Repository..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.filters}>
                            {CATEGORIES.map(c => (
                                <button key={c} className={`${styles.filterBtn} ${activeCategory === c ? styles.active : ''}`} onClick={() => setActiveCategory(c)}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tracksSection}>
                <div className="container">
                    <div className={styles.trackGrid}>
                        {filteredCourses.map((c, i) => (
                            <TiltCard key={c.id}>
                                <CourseCard course={c} delay={i * 0.1} onSelect={() => setSelectedCourse(c)} />
                            </TiltCard>
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '10rem' }}>
                            <AlertCircle size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                            <h2>No Access Modules Found</h2>
                            <button className={styles.filterBtn} onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>Reset Filter</button>
                        </div>
                    )}
                </div>
            </section>

            {/* SPOTLIGHT */}
            <section className={styles.spotlightSection}>
                <div className="container">
                    <TiltCard>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.spotlightCard}
                        >
                            <div className={styles.spotlightContent}>
                                <div className={styles.spotlightBadge}>Architectural Pick</div>
                                <h2 className={styles.spotlightTitle}>AI & Machine Learning Architect</h2>
                                <p className={styles.spotlightDesc}>The most comprehensive AI program in the market. Learn from Google DeepMind engineers and build 15+ industrial projects.</p>
                                <div className={styles.spotlightMeta}>
                                    <div className={styles.metaItem}><Star size={20} fill="var(--accent)" stroke="none" /> 4.9 Rated</div>
                                    <div className={styles.metaItem}><Users size={20} /> 5k+ Engineers</div>
                                </div>
                                <button className={styles.enrollBtn} onClick={() => setSelectedCourse(COURSES[1])}>
                                    View Blueprint <ArrowRight size={20} />
                                </button>
                            </div>
                            <div className={styles.spotlightImageWrapper}>
                                <Image src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80" alt="AI" layout="fill" objectFit="cover" className={styles.spotlightImage} />
                            </div>
                        </motion.div>
                    </TiltCard>
                </div>
            </section>

            {/* PATHS */}
            <section className={styles.pathSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Institutional Pathways</h2>
                            <p className={styles.heroSubtitle} style={{ textAlign: 'left', margin: 0 }}>PRE-CONSTRUCTED TRACKS FOR RAPID GROWTH.</p>
                        </div>
                    </div>
                    <div className={styles.pathGrid}>
                        {PATHS.map((p, i) => (
                            <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} className={styles.pathCard} onClick={() => setActiveCategory(p.category)}>
                                <div className={styles.pathIcon}>{p.icon}</div>
                                <h3 className={styles.pathTitle}>{p.title}</h3>
                                <p className={styles.pathDesc}>{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLASSROOM FEED */}
            <section className={styles.videoSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Classroom Intelligence</h2></div>
                    <div className={styles.videoGrid}>
                        {VIDEO_PREVIEWS.map((v, i) => <VideoPreviewCard key={i} {...v} />)}
                    </div>
                </div>
            </section>

            {/* PARTNERS - MOVED DOWN FROM STARTING */}
            <section className={styles.partnersSection}>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
                            <div key={i} className={styles.partnerLogo}>
                                <Trophy size={24} /> {p}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STUDENT STORIES */}
            <section className={styles.reviewsSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Verification Dossier</h2>
                            <p className={styles.heroSubtitle} style={{ textAlign: 'left', margin: 0 }}>REAL RESULTS FROM OUR ELITE ALUMNI NETWORK.</p>
                        </div>
                    </div>
                </div>
                <div className={styles.scrollWrapper}>
                    <div className={styles.reviewsTrack}>
                        {[...STORIES, ...STORIES].map((s, i) => (
                            <div key={i} className={styles.reviewCard}>
                                <div className={styles.storyHeader}>
                                    <div className={styles.storyAvatarWrap}>
                                        <Image src={s.image} alt={s.name} width={60} height={60} className={styles.storyAvatar} />
                                    </div>
                                    <div className={styles.storyInfo}>
                                        <h4>{s.name}</h4>
                                        <p>{s.role} @ {s.company}</p>
                                    </div>
                                    <div className={styles.storyPackage}>{s.package}</div>
                                </div>
                                <div className={styles.quoteWrapper}>
                                    <Quote size={48} className={styles.quoteIcon} />
                                </div>
                                <p className={styles.reviewText}>{s.quote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            <AnimatePresence>
                {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
            </AnimatePresence>

            <Footer />
        </main>
    );
}

function TiltCard({ children }: { children: React.ReactNode }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function onMouseMove(event: any) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}

function StatItem({ value, label }: any) {
    return (
        <motion.div className={styles.statItem} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
        </motion.div>
    );
}

function CourseCard({ course, delay, onSelect }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay }} className={styles.courseCard}>
            <div className={styles.cardImageWrapper}>
                <Image src={course.image} alt={course.title} layout="fill" objectFit="cover" className={styles.cardImage} />
                <span className={styles.cardCategory}>{course.category}</span>
                {course.featured && <div className={styles.featuredBadge}><Zap size={18} fill="currentColor" /></div>}
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{course.title}</h3>
                <div className={styles.techStack}>
                    {course.techStack?.slice(0, 3).map((t: string, i: number) => (
                        <span key={i} className={styles.techIcon}><Layers size={12} /> {t}</span>
                    ))}
                </div>
                <div className={styles.batchContainer}>
                    <div className={styles.batchBadge}><Calendar size={14} /> {course.startDate}</div>
                    {course.seatsLeft <= 10 && <div className={styles.seatsBadge}><Rocket size={14} /> {course.seatsLeft} LEFT</div>}
                </div>
                <div className={styles.cardMeta} style={{ perspective: 'none' }}>
                    <div className={styles.metaItem}><Clock size={16} /> {course.duration}</div>
                    <div className={styles.metaItem}><Users size={16} /> {course.students}</div>
                    <div className={styles.metaItem} style={{ color: 'var(--accent)' }}><Star size={16} fill="currentColor" /> {course.rating}</div>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{course.price}</span>
                    <button className={styles.enrollBtn} onClick={onSelect}>Enroll Now</button>
                </div>
            </div>
        </motion.div>
    );
}

function VideoPreviewCard({ title, duration, thumbnail, views }: any) {
    return (
        <div className={styles.videoCard}>
            <div className={styles.thumbnailWrapper}>
                <img src={thumbnail} alt={title} className={styles.videoThumbnail} />
                <div className={styles.playOverlay}>
                    <div className={styles.playButton}><div className={styles.playTriangle} /></div>
                </div>
                <span className={styles.videoDuration}>{duration}</span>
            </div>
            <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{title}</h3>
                <span className={styles.videoViews}>{views} ACTIVE</span>
            </div>
        </div>
    );
}



function CourseDetailModal({ course, onClose }: any) {
    const [activeTab, setActiveTab] = useState('curriculum');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.modalOverlay} onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className={styles.megaDetailModal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseIcon} onClick={onClose}><X size={32} /></button>
                <div className={styles.modalSplit}>
                    <div className={styles.modalSidebar}>
                        <div className={styles.modalImageWrapper}>
                            <Image src={course.image} alt={course.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className={styles.modalPriceSection}>

                            <h2 style={{ fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>{course.title}</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{course.duration} Institutional Masterclass</p>
                            <span style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>PROGRAM FEE</span>
                            <h3 style={{ fontSize: '2.5rem', fontFamily: 'Rajdhani', margin: '0.5rem 0 1.5rem' }}>{course.price}</h3>
                            <button className={styles.modalEnrollBtn} style={{ width: '100%', padding: '1.2rem' }}>Enroll Now</button>

                            <button className={styles.downloadBtn} style={{ width: '100%' }}>
                                <Download size={18} /> Download Curriculum
                            </button>
                        </div>
                    </div>
                    <div className={styles.modalMainContent}>
                        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                            {['overview', 'curriculum', 'mentors', 'placements', 'tools'].map(t => (
                                <button key={t} className={`${styles.modalTabBtn} ${activeTab === t ? styles.active : ''}`} onClick={() => setActiveTab(t)}>
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className={styles.tabScrollArea} style={{ marginTop: 0 }}>
                            {activeTab === 'curriculum' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {course.modules?.map((m: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                                        >
                                            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--primary)', opacity: 0.2, width: '40px' }}>0{i + 1}</div>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: '#fff' }}>{m.title}</h4>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>{m.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {[1, 2, 3].map((ext) => (
                                        <div key={ext} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: 0.6 }}>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--primary)', opacity: 0.2, width: '40px' }}>0{course.modules?.length + ext}</div>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Industrial Capstone Project {ext}</h4>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Deploying production-ready applications with full CI/CD integration and monitoring.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'mentors' && (
                                <div className={styles.mentorGrid}>
                                    {course.mentors?.map((mentor: string, i: number) => (
                                        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.mentorCard}>
                                            <div className={styles.mentorAvatar}>{mentor[0]}</div>
                                            <div>
                                                <h4 style={{ color: '#fff' }}>{mentor}</h4>
                                                <p style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700 }}>VERIFIED MENTOR</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'placements' && (
                                <div className={styles.placementGrid}>
                                    {course.placements?.map((p: any, i: number) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.placementMiniCard}>
                                            <div className={styles.miniAvatar}>
                                                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div className={styles.miniInfo}>
                                                <h5>{p.name}</h5>
                                                <p>{p.role} @ {p.company}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 900 }}>Package: {p.package}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'overview' && (
                                <div className={styles.overviewText}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Architectural Insight</h3>
                                    <p>This program is engineered for extreme career mobility. Beyond coding, you master distributed systems and production scaling.</p>
                                    <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className={styles.techIcon}><ShieldCheck size={16} /> Industrial Mentorship</div>
                                        <div className={styles.techIcon}><Rocket size={16} /> Capstone Projects</div>
                                        <div className={styles.techIcon}><Zap size={16} /> FANG Drills</div>
                                        <div className={styles.techIcon}><Trophy size={16} /> Elite Certs</div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'tools' && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {course.techStack?.map((t: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.1, color: 'var(--secondary)' }}
                                            className={styles.techIcon}
                                            style={{ padding: '0.8rem 1.5rem', cursor: 'default' }}
                                        >
                                            {t}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
