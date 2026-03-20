"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IndustryPartners from '@/components/IndustryPartners';
import { motion, Variants } from 'framer-motion';
import styles from './about.module.css';
import {
    Target,
    Zap,
    Users,
    Globe,
    Cpu,
    Briefcase,
    Award,
    ArrowRight,
    ShieldCheck,
    Microscope,
    Terminal,
    Boxes,
    Rocket,
    Code2,
    Layers,
    Network,
    Trophy
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

export default function About() {
    return (
        <main className={styles.main}>
            <Navbar />

            {/* 1. INSTITUTIONAL HERO */}
            <section className={styles.heroSection}>
                <div className={styles.heroGrid} />
                <div className={styles.heroGlow} />

                <div className={styles.heroContent}>
                    <motion.div
                        className={styles.heroBadge}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Zap size={14} className="text-primary" />
                        Welcome to Bytecode Trainings
                    </motion.div>

                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <span className={styles.titleMain}>Bridging the Gap Between</span>
                        <span className={styles.titleGradient}>College and IT Jobs</span>
                    </motion.h1>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        We saw thousands of talented graduates struggling to clear technical rounds because they lacked practical exposure. Bytecode was started with one mission: to build your skills and get you placed.
                    </motion.p>

                    <motion.div
                        className={styles.heroActions}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link href="/courses" className={styles.primaryBtn}>
                            Explore Courses <ArrowRight size={18} />
                        </Link>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Link href="/contact" className={styles.secondaryBtn}>
                                Talk to a Mentor
                            </Link>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>🗣️ Speak in English or Telugu</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. CAREER ARCHITECTURE (The Pillars) */}
            <section className={styles.architectureSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>Our Core Philosophy</span>
                        <h2 className={styles.sectionTitle}>How We Guarantee Your Success</h2>
                    </div>

                    <motion.div
                        className={styles.archGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <ArchCard
                            icon={<Terminal size={28} />}
                            title="Industry-Relevant Syllabus"
                            desc="We only teach what IT companies are actively testing in their interviews right now."
                        />
                        <ArchCard
                            icon={<Layers size={28} />}
                            title="Practical Real-World Projects"
                            desc="Stop writing basic code. We help you build live projects that make your resume stand out."
                        />
                        <ArchCard
                            icon={<ShieldCheck size={28} />}
                            title="100% Placement Assistance"
                            desc="We don't just teach; we prepare your resume, conduct mock interviews, and schedule drives for you."
                        />
                        <ArchCard
                            icon={<Network size={28} />}
                            title="Continuous Mentorship"
                            desc="Got a doubt? Our experienced mentors are always available to guide you patiently."
                        />
                    </motion.div>
                </div>
            </section>

            {/* 3. PERFORMANCE ECOSYSTEM */}
            <section className={styles.performanceSection}>
                <div className="container">
                    <div className={styles.perfWrapper}>
                        <div className={styles.perfContent}>
                            <motion.h2
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                Our Teaching <br /> Approach
                            </motion.h2>

                            <div className={styles.perfList}>
                                <PerfItem
                                    icon={<Cpu />}
                                    title="Beginner-Friendly Classes"
                                    desc="Never coded before? No problem. We explain complex technical concepts in simple, easy-to-understand language."
                                />
                                <PerfItem
                                    icon={<Code2 />}
                                    title="Daily Doubt Clearances"
                                    desc="We know learning to code can be hard. We offer daily sessions just to clear your doubts patiently."
                                />
                                <PerfItem
                                    icon={<Globe />}
                                    title="Interview Preparation"
                                    desc="We conduct regular mock interviews to remove your fear and build your confidence for the real thing."
                                />
                            </div>
                        </div>

                        <div className={styles.perfVisual}>
                            <motion.div
                                className={styles.visualCore}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Boxes size={80} />
                            </motion.div>

                            <div className={styles.floatingLabels}>
                                <motion.div
                                    className={styles.fLabel}
                                    style={{ top: '10%', right: '10%' }}
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    Docker / K8s
                                </motion.div>
                                <motion.div
                                    className={styles.fLabel}
                                    style={{ bottom: '20%', left: '5%' }}
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    System Design
                                </motion.div>
                                <motion.div
                                    className={styles.fLabel}
                                    style={{ top: '40%', left: '20%' }}
                                    animate={{ x: [0, 20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                >
                                    Distributed Systems
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. LIFE AT Bytecode (Preserved Gallery) */}
            <section className={styles.gallerySection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>The Bytecode Family</span>
                        <h2 className={styles.sectionTitle}>Student Experience</h2>
                    </div>

                    <div className={styles.galleryGrid}>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80"
                                alt="Hackathon"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Coding Competitions</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                                alt="Classroom"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Interactive Classrooms</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"
                                alt="Mentorship"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Personalized Mentorship</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                                alt="Office"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Team Projects</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80"
                                alt="Celebration"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Celebrating Offer Letters!</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. INSTITUTIONAL DNA */}
            <section className={styles.dnaSection}>
                <div className="container">
                    <div className={styles.dnaGrid}>
                        <motion.div
                            className={styles.dnaContent}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className={styles.dnaTag}>OUR MISSION</span>
                            <h2 className={styles.dnaTitle}>Why We Started Bytecode</h2>
                            <p className={styles.dnaDesc}>
                                We understand the pressure of finding an IT job after graduation. We noticed that massive talent in two Telugu states was being wasted simply due to a lack of proper guidance. Our mission is to take you from a complete beginner to a confident software engineer, no matter your educational background.
                            </p>

                            <div className={styles.dnaStats}>
                                <div className={styles.dnaStat}>
                                    <h2>5K+</h2>
                                    <p>Elite Alumni</p>
                                </div>
                                <div className={styles.dnaStat}>
                                    <h2>500+</h2>
                                    <p>Hiring Partners</p>
                                </div>
                                <div className={styles.dnaStat}>
                                    <h2>24L</h2>
                                    <p>Avg Package</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className={styles.dnaVisual}>
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                                alt="Founders"
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.dnaImage}
                            />
                            <div className={styles.dnaOverlay} />
                        </div>
                    </div>
                </div>
            </section>

            <IndustryPartners />

            {/* 6. CALL TO ACTION */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <motion.h2
                            className={styles.ctaTitle}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                        >
                            Start Your IT <br /> Journey Today
                        </motion.h2>
                        <p className={styles.ctaDesc}>
                            Stop worrying about your career gap or non-IT background. Let us help you take the first step towards a high-paying software job.
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/courses" className={styles.ctaBtnPrim}>
                                Browse Our Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ArchCard({ icon, title, desc }: any) {
    return (
        <motion.div
            className={styles.archCard}
            variants={itemVariants}
        >
            <div className={styles.archIcon}>{icon}</div>
            <h3 className={styles.archTitle}>{title}</h3>
            <p className={styles.archDesc}>{desc}</p>
            <div className={styles.cardGlow} />
        </motion.div>
    );
}

function PerfItem({ icon, title, desc }: any) {
    return (
        <div className={styles.perfItem}>
            <div className={styles.perfIcon}>{icon}</div>
            <div className={styles.perfText}>
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
        </div>
    );
}
