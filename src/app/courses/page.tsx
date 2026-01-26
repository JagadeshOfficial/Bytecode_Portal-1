"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './courses.module.css';
import { Search, Clock, Users, Star, Zap, Code, Database, Cloud, Layers, Calendar, AlertCircle, Quote, X, ArrowRight, Trophy, Rocket } from 'lucide-react';
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

const SPOTLIGHT_COURSE = {
    title: "AI & Machine Learning Architect",
    desc: "The most comprehensive AI program in the market. Learn from Google DeepMind engineers and build 15+ industrial projects. 100% Placement Guarantee.",
    techStack: ["Python", "TensorFlow", "Generative AI", "LLMs"],
    rating: 4.9,
    students: "5k+",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
};

const CATEGORIES = ["All", "Development", "Data Science", "Cloud", "Security", "Design"];
const PATHS = [
    { title: "Full Stack Dev", desc: "Build complete web apps from scratch.", category: "Development", icon: <Code /> },
    { title: "Master AI", desc: "Analyze data and build intelligent models.", category: "Data Science", icon: <Database /> },
    { title: "Cloud Architect", desc: "Design and deploy scalable cloud systems.", category: "Cloud", icon: <Cloud /> },
];
const PARTNERS = ["Google", "Amazon", "Microsoft", "Netflix", "Meta", "Tesla", "Adobe", "Spotify", "Uber"];
const REVIEWS = [
    { name: "Karthik N.", course: "Java Full Stack", text: "The live mentorship program is a game changer. The instructors are real industry engineers." },
    { name: "Ananya B.", course: "Data Science", text: "I came from a non-tech background, but the structured curriculum helped me crack a Data Analyst role." },
    { name: "Vikram S.", course: "DevOps Master", text: "The hands-on labs for AWS and deployment pipelines were incredibly detailed." },
    { name: "Meera P.", course: "Python Full Stack", text: "The capstone project helped me understand how full-stack apps scale. Best investment." }
];
const VIDEO_PREVIEWS = [
    { title: "Java Full Stack: Microservices", duration: "10:45", thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80", views: "1.2k" },
    { title: "Data Science: Stock Prices", duration: "15:20", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80", views: "950" },
    { title: "DevOps: Kubernetes Deploy", duration: "12:10", thumbnail: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80", views: "2.5k" }
];

export default function Courses() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const filteredCourses = COURSES.filter(course => {
        const matchesCategory = activeCategory === "All" || course.category === activeCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className={styles.main}>
            <Navbar />

            {/* HERO */}
            <section className={styles.heroSection}>
                <div className={styles.heroBg}>
                    <div className={`${styles.orb} ${styles.orb1}`} />
                    <div className={`${styles.orb} ${styles.orb2}`} />
                </div>
                <div className="container">
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

            {/* PARTNERS */}
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

            {/* SPOTLIGHT */}
            <section className={styles.spotlightSection}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={styles.spotlightCard}
                    >
                        <div className={styles.spotlightContent}>
                            <div className={styles.spotlightBadge}>Architectural Pick</div>
                            <h2 className={styles.spotlightTitle}>{SPOTLIGHT_COURSE.title}</h2>
                            <p className={styles.spotlightDesc}>{SPOTLIGHT_COURSE.desc}</p>
                            <div className={styles.spotlightMeta}>
                                <div className={styles.metaItem}><Star size={20} fill="var(--accent)" stroke="none" /> 4.9 Rated</div>
                                <div className={styles.metaItem}><Users size={20} /> 5k+ Engineers</div>
                            </div>
                            <button className={styles.enrollBtn} onClick={() => setSelectedCourse(COURSES[1])}>
                                View Blueprint <ArrowRight size={20} />
                            </button>
                        </div>
                        <div className={styles.spotlightImageWrapper}>
                            <Image src={SPOTLIGHT_COURSE.image} alt="AI" layout="fill" objectFit="cover" className={styles.spotlightImage} />
                        </div>
                    </motion.div>
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
                            <motion.div key={i} whileHover={{ y: -10 }} className={styles.pathCard} onClick={() => setActiveCategory(p.category)}>
                                <div className={styles.pathIcon}>{p.icon}</div>
                                <h3 className={styles.pathTitle}>{p.title}</h3>
                                <p className={styles.pathDesc}>{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEARCH */}
            <section className={styles.searchSection}>
                <div className="container">
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

            {/* COURSE REPOSITORY */}
            <section className={styles.tracksSection}>
                <div className="container">
                    <div className={styles.trackGrid}>
                        {filteredCourses.map((c, i) => (
                            <CourseCard key={c.id} course={c} delay={i * 0.1} onSelect={() => setSelectedCourse(c)} />
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

            {/* CLASSROOM FEED */}
            <section className={styles.videoSection}>
                <div className="container">
                    <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Classroom Intelligence</h2></div>
                    <div className={styles.videoGrid}>
                        {VIDEO_PREVIEWS.map((v, i) => <VideoPreviewCard key={i} {...v} />)}
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section className={styles.reviewsSection}>
                <div className={styles.scrollWrapper}>
                    <div className={styles.reviewsTrack}>
                        {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
                            <div key={i} className={styles.reviewCard}>
                                <Quote size={40} style={{ opacity: 0.1 }} />
                                <p className={styles.reviewText}>{r.text}</p>
                                <div className={styles.reviewerInfo}>
                                    <h4>{r.name}</h4>
                                    <span className={styles.reviewerCourse}>{r.course}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <LiveEnrolls />

            <AnimatePresence>
                {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
            </AnimatePresence>

            <Footer />
        </main>
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
                <div className={styles.cardMeta}>
                    <div className={styles.metaItem}><Clock size={16} /> {course.duration}</div>
                    <div className={styles.metaItem}><Users size={16} /> {course.students}</div>
                    <div className={styles.metaItem} style={{ color: 'var(--accent)' }}><Star size={16} fill="currentColor" /> {course.rating}</div>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{course.price}</span>
                    <button className={styles.enrollBtn} onClick={onSelect}>Register</button>
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

function LiveEnrolls() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ name: "", course: "" });
    useEffect(() => {
        const interval = setInterval(() => {
            setData({ name: "Rohan S.", course: "Java Full Stack" });
            setVisible(true);
            setTimeout(() => setVisible(false), 3000);
        }, 10000);
        return () => clearInterval(interval);
    }, []);
    return (
        <AnimatePresence>
            {visible && (
                <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className={styles.liveToast}>
                    <div className={styles.toastAvatar}>{data.name[0]}</div>
                    <div className={styles.toastContent}>
                        <h4>{data.name} ACTIVE</h4>
                        <p>{data.course} Portal</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
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
                        <div style={{ position: 'relative', height: '300px' }}><Image src={course.image} alt={course.title} layout="fill" objectFit="cover" /></div>
                        <div className={styles.modalPriceSection}>
                            <h2>{course.title}</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{course.duration} Institutional Masterclass</p>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>PROGRAM FEE</span>
                            <h3 style={{ fontSize: '3rem', fontFamily: 'Rajdhani' }}>{course.price}</h3>
                            <button className={styles.modalEnrollBtn} style={{ width: '100%' }}>Initialize Registration</button>
                        </div>
                    </div>
                    <div className={styles.modalMainContent}>
                        <div style={{ display: 'flex' }}>
                            {['overview', 'curriculum', 'tools'].map(t => (
                                <button key={t} className={`${styles.modalTabBtn} ${activeTab === t ? styles.active : ''}`} onClick={() => setActiveTab(t)}>
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className={styles.tabScrollArea}>
                            {activeTab === 'curriculum' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    {course.modules?.map((m: any, i: number) => (
                                        <div key={i} style={{ display: 'flex', gap: '2rem' }}>
                                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.3 }}>0{i + 1}</div>
                                            <div>
                                                <h4 style={{ fontSize: '1.4rem' }}>{m.title}</h4>
                                                <p style={{ color: 'var(--text-dim)' }}>{m.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'overview' && (
                                <div className={styles.overviewText}>
                                    <h3 style={{ marginBottom: '2rem' }}>Architectural Insight</h3>
                                    <p>This program is engineered for extreme career mobility. Beyond coding, you master distributed systems and production scaling.</p>
                                    <ul style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <li>⚡ Industrial Mentorship</li>
                                        <li>⚡ Capstone Projects</li>
                                        <li>⚡ FANG Drills</li>
                                        <li>⚡ Elite Certs</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'tools' && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                    {course.techStack?.map((t: string, i: number) => (
                                        <div key={i} className={styles.techIcon} style={{ padding: '1.5rem 2.5rem' }}>{t}</div>
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
