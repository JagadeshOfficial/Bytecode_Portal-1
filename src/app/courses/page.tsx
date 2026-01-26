"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './courses.module.css';
import { Search, Filter, Clock, Users, Star, BookOpen, ChevronRight, Zap, Code, Database, Cloud, Layers, Terminal, Calendar, AlertCircle, Briefcase, Quote } from 'lucide-react';
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
        seatsLeft: 5
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
        seatsLeft: 12
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
        seatsLeft: 20
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
        seatsLeft: 8
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
        seatsLeft: 15
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
        seatsLeft: 2
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
                            <div className={styles.spotlightBadge}>Most Popular Choice</div>
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

                            <button className={styles.enrollBtn} style={{ width: 'fit-content', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
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
                            <CourseCard key={course.id} course={course} delay={index * 0.1} />
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

            <Footer />
        </main>
    );
}

function CourseCard({ course, delay }: any) {
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
                    <button className={styles.enrollBtn}>View Details</button>
                </div>
            </div>
        </motion.div>
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
