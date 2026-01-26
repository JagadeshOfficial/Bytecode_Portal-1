"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './courses.module.css';
import { Search, Filter, Clock, Users, Star, BookOpen, ChevronRight, Zap, Code, Database, Cloud, Layers, Terminal, Calendar, AlertCircle, Briefcase, Quote, Video, X, Download, ArrowRight, Lock } from 'lucide-react';
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
    },
    {
        id: 4,
        title: "MERN Stack Web Development",
        category: "Development",
        level: "Beginner",
        duration: "4 Months",
        students: "3.5k+",
        rating: 4.6,
        price: "₹25,000",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
        featured: false,
        techStack: ["MongoDB", "Express", "React", "Node.js"],
        startDate: "Feb 20, 2024",
        seatsLeft: 8,
        modules: [
            { title: "Module 1: Modern JavaScript & ES6+", desc: "Arrow functions, Destructuring, Promises, and Async/Await mastery." },
            { title: "Module 2: Frontend with React 18", desc: "Virtual DOM, JSX, Props, State, and High-Performance Components." },
            { title: "Module 3: State Management (Redux)", desc: "Centralized state management with Redux Toolkit and Thunk middleware." },
            { title: "Module 4: Backend with Node.js & Express", desc: "Event loop, File System, Middleware, and building scalable API architectures." },
            { title: "Module 5: Database with MongoDB", desc: "Schema design, Mongoose, Aggregations, and Atlas cloud deployment." },
            { title: "Module 6: Full Stack Security & Auth", desc: "JWT, OAuth2, Bcrypt, and Session management with Passport.js." },
            { title: "Module 7: Project Deployment & Optimization", desc: "Vercel, Heroku, Nginx, and performance profiling for full stack apps." }
        ],
        mentors: ["Full-Stack Lead @ Netlify", "Senior Dev @ Vercel"],
        placements: [
            { name: "Karthik M.", company: "Paytm", role: "Frontend Dev", package: "12 LPA", image: "https://i.pravatar.cc/150?u=karthik" },
            { name: "Deepa L.", company: "Zomato", role: "Full Stack Dev", package: "15 LPA", image: "https://i.pravatar.cc/150?u=deepa" }
        ],
        brochureUrl: "#"
    },
    {
        id: 5,
        title: "Cyber Security & Ethical Hacking",
        category: "Security",
        level: "Advanced",
        duration: "6 Months",
        students: "800+",
        rating: 4.8,
        price: "₹38,000",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
        featured: true,
        techStack: ["Linux", "Python", "Wireshark", "Metasploit"],
        startDate: "Mar 10, 2024",
        seatsLeft: 15,
        modules: [
            { title: "Module 1: Ethical Hacking Fundamentals", desc: "Understanding networking, TCP/IP, and basic security principles." },
            { title: "Module 2: Footprinting & Reconnaissance", desc: "Using Nmap, Shodan, and OSINT techniques to gather intelligence." },
            { title: "Module 3: Vulnerability Analysis", desc: "Scanners, Exploit databases, and identifying system weaknesses." },
            { title: "Module 4: Network Hacking (Wired & Wireless)", desc: "MITM attacks, Packet sniffing with Wireshark, and WPA/WPA2 cracking." },
            { title: "Module 5: System Hacking & Malware", desc: "Privilege escalation, Metasploit, Trojans, and Backdoors." },
            { title: "Module 6: Web App & Cloud Security", desc: "SQL injection, XSS, OWASP Top 10, and AWS S3 bucket security." },
            { title: "Module 7: Digital Forensics & IR", desc: "Incident Response, Evidence handling, and basic log analysis." }
        ],
        mentors: ["Certified Ethical Hacker (CEH)", "Security Lead @ Cisco"],
        placements: [
            { name: "Amit T.", company: "PwC", role: "Security Analyst", package: "14 LPA", image: "https://i.pravatar.cc/150?u=amit" }
        ],
        brochureUrl: "#"
    },
    {
        id: 6,
        title: "UI/UX Design Specialization",
        category: "Design",
        level: "Beginner",
        duration: "3 Months",
        students: "1.5k+",
        rating: 4.7,
        price: "₹20,000",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80",
        featured: false,
        techStack: ["Figma", "Adobe XD", "Prototyping", "Wireframing"],
        startDate: "Feb 25, 2024",
        seatsLeft: 2,
        modules: [
            { title: "Module 1: Intro to Design Thinking", desc: "Understanding the UX process and user-centric design methodologies." },
            { title: "Module 2: Wireframing & Information Architecture", desc: "Creating low-fi sketches and planning user flows." },
            { title: "Module 3: Figma Mastery (UI Design)", desc: "Components, Auto Layout, Variants, and advanced Figma features." },
            { title: "Module 4: Visual Design Systems", desc: "Color theory, Typography, and building scalable Design Systems." },
            { title: "Module 5: Interaction Design (Prototyping)", desc: "High-fidelity prototypes, smart animate, and transitions." },
            { title: "Module 6: Usability Testing", desc: "Gathering user feedback and iterating on design solutions." },
            { title: "Module 7: Portfolio Build", desc: "Building a world-class portfolio with 3 industrial case studies." }
        ],
        mentors: ["Product Designer @ Airbnb", "UX Researcher @ Uber"],
        placements: [
            { name: "Rishab J.", company: "Swiggy", role: "UI Designer", package: "11 LPA", image: "https://i.pravatar.cc/150?u=rishab" }
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
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const PATHS = [
    { title: "Become a Full Stack Dev", desc: "Build complete web apps from scratch.", category: "Development", icon: <Code /> },
    { title: "Master AI & Data", desc: "Analyze data and build intelligent models.", category: "Data Science", icon: <Database /> },
    { title: "Cloud Architect", desc: "Design and deploy scalable cloud systems.", category: "Cloud", icon: <Cloud /> },
];

const PARTNERS = ["Google", "Amazon", "Microsoft", "Netflix", "Meta", "Tesla", "Adobe", "Spotify", "Uber"];

const STORIES = [
    {
        name: "Anjali Gupta",
        role: "SDE-II",
        company: "Google",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
        quote: "The advanced curriculum here is exactly what I faced in my Google interviews. The system design module is world-class."
    },
    {
        name: "David Chen",
        role: "AI Researcher",
        company: "OpenAI",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
        quote: "I went from zero knowledge of LLMs to building my own transformer models. Highly recommended for serious engineers."
    },
    {
        name: "Sarah Williams",
        role: "Cloud Architect",
        company: "AWS",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
        quote: "ByteCode Trainings gave me the hands-on experience with Kubernetes that I couldn't find anywhere else."
    }
];

const VIDEO_PREVIEWS = [
    {
        title: "Java Full Stack: Building Microservices",
        duration: "10:45",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80",
        views: "1.2k"
    },
    {
        title: "Data Science: Predicting Stock Prices",
        duration: "15:20",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
        views: "950"
    },
    {
        title: "DevOps: Deploying to Kubernetes",
        duration: "12:10",
        thumbnail: "https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80",
        views: "2.5k"
    }
];

const REVIEWS = [
    { name: "Karthik N.", course: "Java Full Stack", text: "The live mentorship program is a game changer. The instructors are real industry engineers." },
    { name: "Ananya B.", course: "Data Science", text: "I came from a non-tech background, but the structured curriculum helped me crack a Data Analyst role." },
    { name: "Vikram S.", course: "DevOps Master", text: "The hands-on labs for AWS and deployment pipelines were incredibly detailed. Worth every penny." },
    { name: "Meera P.", course: "Python Full Stack", text: "The capstone project helped me understand how full-stack apps scale. Best investment for my career." }
];

export default function Courses() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLevel, setActiveLevel] = useState("All Levels");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const filteredCourses = COURSES.filter(course => {
        const matchesCategory = activeCategory === "All" || course.category === activeCategory;
        const matchesLevel = activeLevel === "All Levels" || course.level === activeLevel;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesLevel && matchesSearch;
    });

    return (
        <main className={styles.main}>
            <Navbar />

            {/* ADVANCED HERO */}
            <section className={styles.heroSection}>
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
                        Elite Training For <br /> Elite Engineers
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={styles.heroSubtitle}
                    >
                        Join the top 1% of developers. Curriculum reverse-engineered from FANG interviews.
                    </motion.p>
                </div>
            </section>

            {/* PLACEMENT PARTNERS (MARQUEE) */}
            <section className={styles.partnersSection}>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                            <div key={i} className={styles.partnerLogo}>
                                <Briefcase size={28} /> {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLACEMENT STATS (New) */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>150%</span>
                            <span className={styles.statLabel}>Avg Salary Hike</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>40 LPA</span>
                            <span className={styles.statLabel}>Highest Package</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>500+</span>
                            <span className={styles.statLabel}>Hiring Partners</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>95%</span>
                            <span className={styles.statLabel}>Placement Rate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SPOTLIGHT SECTION (1st PREFERENCE) */}
            <section className={styles.spotlightSection}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={styles.spotlightCard}
                    >
                        <div className={styles.spotlightContent}>
                            <div className={styles.spotlightBadge}>Best For You</div>
                            <h2 className={styles.spotlightTitle}>{SPOTLIGHT_COURSE.title}</h2>
                            <p className={styles.spotlightDesc}>{SPOTLIGHT_COURSE.desc}</p>

                            <div className={styles.spotlightMeta}>
                                <div className={styles.metaItem}><Star color="#fbbf24" fill="#fbbf24" /> {SPOTLIGHT_COURSE.rating}/5 Rating</div>
                                <div className={styles.metaItem}><Users /> {SPOTLIGHT_COURSE.students} Enrolled</div>
                            </div>

                            <div className={styles.techStack} style={{ marginBottom: '2rem' }}>
                                {SPOTLIGHT_COURSE.techStack.map((tech, i) => (
                                    <span key={i} className={styles.techIcon} style={{ fontSize: '0.9rem', padding: '6px 12px' }}>
                                        <Code size={14} /> {tech}
                                    </span>
                                ))}
                            </div>

                            <button
                                className={styles.enrollBtn}
                                style={{ width: 'fit-content', padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                                onClick={() => setSelectedCourse(COURSES[0])}
                            >
                                View Program Details
                            </button>
                        </div>
                        <div className={styles.spotlightImageWrapper}>
                            <Image
                                src={SPOTLIGHT_COURSE.image}
                                alt="AI Focus"
                                layout="fill"
                                objectFit="cover"
                                className={styles.spotlightImage}
                            />
                            <div className={styles.cardOverlay} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CHOOSE YOUR PATH (Pathfinder) */}
            <section className={styles.pathSection}>
                <div className="container">
                    <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                        <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>Choose Your Path</h2>
                        <p className={styles.heroSubtitle} style={{ margin: 0, textAlign: 'left' }}>Specialized tracks for every ambition.</p>
                    </div>
                    <div className={styles.pathGrid}>
                        {PATHS.map((path, index) => (
                            <div
                                key={index}
                                className={styles.pathCard}
                                onClick={() => setActiveCategory(path.category)}
                            >
                                <div className={styles.pathIcon}>{path.icon}</div>
                                <h3 className={styles.pathTitle}>{path.title}</h3>
                                <p className={styles.pathDesc}>{path.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SEARCH & FILTER */}
            <section className={styles.searchSection}>
                <div className="container">
                    <div className={styles.searchContainer}>
                        <div className={styles.searchBarWrapper}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                placeholder="Search for courses (e.g. Java, Python...)"
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.filters} style={{ flexWrap: 'wrap' }}>
                            {/* Category Tabs */}
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                            <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>
                            {LEVELS.map(lvl => (
                                <button
                                    key={lvl}
                                    className={`${styles.filterBtn} ${activeLevel === lvl ? styles.active : ''}`}
                                    onClick={() => setActiveLevel(lvl)}
                                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* COURSE TRACKS */}
            <section className={styles.tracksSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            {activeCategory === 'All' ? 'Upcoming Batches' : `${activeCategory} Batches`}
                        </h2>
                        <p className={styles.resultsCount}>{filteredCourses.length} programs available</p>
                    </div>

                    <div className={styles.trackGrid}>
                        {filteredCourses.map((course, index) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                delay={index * 0.1}
                                onSelect={() => setSelectedCourse(course)}
                            />
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
                            <h3>No courses found matching your criteria.</h3>
                            <button
                                className={styles.filterBtn}
                                style={{ marginTop: '1rem', display: 'inline-block' }}
                                onClick={() => { setActiveCategory("All"); setSearchQuery(""); setActiveLevel("All Levels"); }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* EXPERIENCE THE CLASSROOM (VIDEO SECTION) */}
            <section className={styles.videoSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Experience The Classroom</h2>
                        <p className={styles.heroSubtitle} style={{ margin: 0, textAlign: 'left' }}>Watch snippets from our actual live sessions.</p>
                    </div>

                    <div className={styles.videoGrid}>
                        {VIDEO_PREVIEWS.map((video, index) => (
                            <VideoPreviewCard key={index} {...video} />
                        ))}
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES */}
            <section className={styles.successSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Success Stories</h2>
                        <p className={styles.heroSubtitle} style={{ margin: 0, textAlign: 'left' }}>See what our students are achieving.</p>
                    </div>

                    <div className={styles.storyGrid}>
                        {STORIES.map((story, index) => (
                            <motion.div
                                key={index}
                                className={styles.storyCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.storyHeader}>
                                    <img src={story.image} alt={story.name} className={styles.storyAvatar} />
                                    <div className={styles.storyInfo}>
                                        <h3>{story.name}</h3>
                                        <div className={styles.storyRole}>{story.role}</div>
                                        <div className={styles.storyCompany}>@ {story.company}</div>
                                    </div>
                                </div>
                                <p className={styles.storyQuote}>
                                    <Quote className={styles.quoteIcon} />
                                    "{story.quote}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STUDENT REVIEWS (New) */}
            <section className={styles.reviewsSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>What Learners Say</h2>
                        <p className={styles.heroSubtitle} style={{ width: '100%', textAlign: 'left' }}>Real feedback from our alumni.</p>
                    </div>

                    <div className={styles.scrollWrapper}>
                        <div className={styles.reviewsTrack}>
                            {/* 3x Duplication for smooth loop */}
                            {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
                                <div key={i} className={styles.reviewCard}>
                                    <div className={styles.quoteIcon}><Quote size={24} /></div>
                                    <p className={styles.reviewText}>"{review.text}"</p>

                                    <div className={styles.reviewFooter}>
                                        <div className={styles.reviewerInfo}>
                                            <h4>{review.name}</h4>
                                            <span className={styles.reviewerCourse}>{review.course}</span>
                                        </div>
                                        <div className={styles.starRating}>
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} size={14} fill="#fbbf24" stroke="none" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE NOTIFICATIONS */}
            <LiveEnrolls />

            {/* ADVANCED COURSE DETAIL MODAL */}
            <AnimatePresence>
                {selectedCourse && (
                    <CourseDetailModal
                        course={selectedCourse}
                        onClose={() => setSelectedCourse(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}

function CourseDetailModal({ course, onClose }: { course: any, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState('curriculum');
    const [showEnrollForm, setShowEnrollForm] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        setIsSending(true);

        // Simulating "Automatically Sending to Admin Email" without user interaction
        setTimeout(() => {
            console.log("Admission Data sent to admin@bytecode.com");
            window.location.href = `/payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`;
        }, 2000);
    };

    return (
        <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.megaDetailModal}
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.modalCloseIcon} onClick={onClose}><X size={32} /></button>

                <div className={styles.modalSplit}>
                    {/* MODAL LEFT: OVERVIEW */}
                    <div className={styles.modalSidebar}>
                        <div className={styles.modalImageWrapper}>
                            <img src={course.image} alt={course.title} />
                            <div className={styles.modalImageOverlay} />
                        </div>
                        <div className={styles.modalInfoPanel}>
                            <h2 className={styles.modalTitle}>{course.title}</h2>
                            <div className={styles.modalMetaGrid}>
                                <div className={styles.modalMetaItem}><Clock size={18} /> {course.duration}</div>
                                <div className={styles.modalMetaItem}><Users size={18} /> {course.students}</div>
                                <div className={styles.modalMetaItem}><Star size={18} fill="#fbbf24" /> {course.rating}</div>
                            </div>
                            <div className={styles.modalPriceSection}>
                                <span className={styles.modalPriceLabel}>Course Investment</span>
                                <h3 className={styles.modalPriceValue}>{course.price}</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button className={styles.modalEnrollBtn} onClick={() => setShowEnrollForm(true)}>
                                    Enroll into Next Batch <ChevronRight size={18} />
                                </button>
                                <button className={styles.brochureBtn} onClick={() => window.open(course.brochureUrl, '_blank')}>
                                    <Download size={18} /> Download Brochure
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MODAL RIGHT: TABS CONTENT */}
                    <div className={styles.modalMainContent}>
                        <AnimatePresence>
                            {showEnrollForm && (
                                <motion.div
                                    className={styles.enrollFormOverlay}
                                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                    animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                                >
                                    <div className={styles.formGlow} />
                                    <div className={styles.enrollHeader}>
                                        <button className={styles.backBtn} onClick={() => setShowEnrollForm(false)}><ChevronRight style={{ transform: 'rotate(180deg)', width: '16px' }} /> Back to Details</button>
                                        <h3>Quick Admission</h3>
                                        <p>Secure your seat in the upcoming batch.</p>
                                    </div>

                                    <form className={styles.enquiryForm} onSubmit={handleFormSubmit}>
                                        <div className={styles.inputGroup}>
                                            <label>Full Name</label>
                                            <input type="text" placeholder="Enter your full name" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Email Address</label>
                                            <input type="email" placeholder="email@example.com" required />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Phone Number</label>
                                            <input type="tel" placeholder="+91 XXXXX XXXXX" required />
                                        </div>

                                        <button className={styles.submitAdmissionBtn} disabled={isSending}>
                                            {isSending ? (
                                                <span className={styles.sendingNote}>Securing Seat... Sending to Admin</span>
                                            ) : (
                                                <>Proceed to Payment (₹{course.price}) <ArrowRight size={20} /></>
                                            )}
                                        </button>

                                        <div className={styles.secureNote}>
                                            <Lock size={14} /> Your data is encrypted and sent directly to our admission office.
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className={styles.modalTabs}>
                            {['overview', 'curriculum', 'tools', 'placements', 'mentors'].map(tab => (
                                <button
                                    key={tab}
                                    className={`${styles.modalTabBtn} ${activeTab === tab ? styles.active : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className={styles.tabScrollArea}>
                            {activeTab === 'placements' && (
                                <div className={styles.placementsTabContent}>
                                    <h3 className={styles.tabSectionTitle}>Recent Success Stories</h3>
                                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Meet our alumni who recently secured packages up to {course.price === '₹45,000' ? '32' : '24'} LPA.</p>
                                    <div className={styles.placementsGrid}>
                                        {course.placements?.map((p: any, i: number) => (
                                            <div key={i} className={styles.placementMiniCard}>
                                                <img src={p.image} alt={p.name} className={styles.pAvatar} />
                                                <div className={styles.pInfo}>
                                                    <h4>{p.name}</h4>
                                                    <p>{p.role} @ <strong>{p.company}</strong></p>
                                                    <div className={styles.pPackage}>{p.package} Package</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tools' && (
                                <div className={styles.toolsTabContent}>
                                    <h3 className={styles.tabSectionTitle}>Industrial Tools & Stack</h3>
                                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Master these 15+ industry-leading tools used by top product companies.</p>
                                    <div className={styles.toolsCloud}>
                                        {course.techStack?.map((tool: string, i: number) => (
                                            <motion.div
                                                key={i}
                                                className={styles.toolChip}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Layers size={20} />
                                                <span>{tool}</span>
                                            </motion.div>
                                        ))}
                                        {/* Added generic tools for better visuals */}
                                        {['Git', 'Docker', 'Jenkins', 'Postman', 'JIRA', 'AWS'].filter(t => !course.techStack.includes(t)).map((tool: string, i: number) => (
                                            <div key={`extra-${i}`} className={styles.toolChip} style={{ opacity: 0.7 }}>
                                                <Layers size={20} />
                                                <span>{tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'curriculum' && (
                                <div className={styles.curriculumFlow}>
                                    <h3 className={styles.tabSectionTitle}>Advanced 7-Module Curriculum</h3>
                                    {course.modules ? course.modules.map((mod: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            className={styles.moduleCard}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className={styles.moduleNumber}>{i + 1}</div>
                                            <div className={styles.moduleContent}>
                                                <h4>{mod.title}</h4>
                                                <p>{mod.desc}</p>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <p style={{ color: '#94a3b8' }}>Dynamic curriculum is being prepared for this specialized track.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className={styles.overviewText}>
                                    <h3 className={styles.tabSectionTitle}>Program Overview</h3>
                                    <p>This {course.duration} intensive masterclass is designed for serious learners aiming for top-tier product companies. Our curriculum is reverse-engineered from interviews at Google, Amazon, and Microsoft.</p>
                                    <h4 style={{ marginTop: '1.5rem', color: 'white' }}>Built-in Features:</h4>
                                    <ul className={styles.featureList}>
                                        <li>1:1 Mentorship from Industry Experts</li>
                                        <li>Real-world Industrial Capstone Projects</li>
                                        <li>Technical & HR Mock Interviews</li>
                                        <li>Professional Communication & Personality Development</li>
                                        <li>100% Direct Job Referrals in Tier-1 MNCs</li>
                                        <li>Official ByteCode Industry-Vendor Certification</li>
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'mentors' && (
                                <div className={styles.mentorsGrid}>
                                    <h3 className={styles.tabSectionTitle}>Our Specialized Mentors</h3>
                                    {course.mentors?.map((mentor: string, i: number) => (
                                        <div key={i} className={styles.mentorBriefCard}>
                                            <div className={styles.mentorIcon}><Users size={24} /></div>
                                            <span>{mentor}</span>
                                        </div>
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

function CourseCard({ course, delay, onSelect }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={styles.courseCard}
        >
            <div className={styles.cardImageWrapper}>
                <Image
                    src={course.image}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.cardImage}
                />
                <div className={styles.cardOverlay} />
                <span className={styles.cardCategory}>{course.category}</span>
                {course.featured && (
                    <div className={styles.featuredBadge} title="Best Seller">
                        <Zap size={18} fill="currentColor" />
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{course.title}</h3>

                <div className={styles.techStack}>
                    {course.techStack?.slice(0, 4).map((tech: string, i: number) => (
                        <span key={i} className={styles.techIcon}>
                            <Layers size={10} /> {tech}
                        </span>
                    ))}
                </div>

                {/* Batch Info */}
                <div className={styles.batchContainer}>
                    <div className={styles.batchBadge}>
                        <Calendar size={12} /> Starts: {course.startDate}
                    </div>
                    {course.seatsLeft <= 10 && (
                        <div className={styles.seatsBadge}>
                            <AlertCircle size={12} /> Only {course.seatsLeft} Seats Left
                        </div>
                    )}
                </div>

                <div className={styles.cardMeta} style={{ marginTop: '1rem' }}>
                    <div className={styles.metaItem}>
                        <Clock size={16} /> <span>{course.duration}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Users size={16} /> <span>{course.students}</span>
                    </div>
                    <div className={styles.metaItem} style={{ color: '#fbbf24' }}>
                        <Star size={16} fill="currentColor" /> <span>{course.rating}</span>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{course.price}</span>
                    <button className={styles.enrollBtn} onClick={(e) => { e.stopPropagation(); onSelect(); }}>View Details</button>
                </div>
            </div>
        </motion.div>
    )
}

function VideoPreviewCard({ title, duration, thumbnail, views }: any) {
    return (
        <div className={styles.videoCard}>
            <div className={styles.thumbnailWrapper}>
                <img src={thumbnail} alt={title} className={styles.videoThumbnail} />
                <div className={styles.playOverlay}>
                    <div className={styles.playButton}>
                        <div className={styles.playTriangle} />
                    </div>
                </div>
                <span className={styles.videoDuration}>{duration}</span>
            </div>
            <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{title}</h3>
                <span className={styles.videoViews}>{views} watching</span>
            </div>
        </div>
    )
}

function LiveEnrolls() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ name: "", course: "", time: "" });

    const ENROLLS = [
        { name: "Rahul S.", course: "Java Full Stack", time: "Just now" },
        { name: "Sarah M.", course: "Data Science AI", time: "2 mins ago" },
        { name: "Arjun K.", course: "DevOps Master", time: "5 mins ago" },
        { name: "Priya D.", course: "UI/UX Design", time: "12 mins ago" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const random = ENROLLS[Math.floor(Math.random() * ENROLLS.length)];
            setData(random);
            setVisible(true);

            setTimeout(() => setVisible(false), 4000); // Hide after 4s
        }, 7000); // Show every 7s

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={styles.liveToast}
                >
                    <div className={styles.toastAvatar}>{data.name.charAt(0)}</div>
                    <div className={styles.toastContent}>
                        <h4>{data.name} enrolled in</h4>
                        <p>{data.course} • {data.time}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
