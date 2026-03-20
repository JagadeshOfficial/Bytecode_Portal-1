"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IndustryPartners from '@/components/IndustryPartners';
import { motion } from 'framer-motion';
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
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
                        The ByteCode Institution
                    </motion.div>

                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <span className={styles.titleMain}>Architecting</span>
                        <span className={styles.titleGradient}>Elite Careers</span>
                    </motion.h1>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        We operate at the frontier of technical education, reverse-engineering
                        production-grade engineering into a transformative career architecture.
                    </motion.p>

                    <motion.div
                        className={styles.heroActions}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <Link href="/courses" className={styles.primaryBtn}>
                            Institutional Portal <ArrowRight size={18} />
                        </Link>
                        <Link href="/contact" className={styles.secondaryBtn}>
                            Consult an Advisor
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. CAREER ARCHITECTURE (The Pillars) */}
            <section className={styles.architectureSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>The Foundation</span>
                        <h2 className={styles.sectionTitle}>Four Pillars of Excellence</h2>
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
                            title="Elite Curriculum"
                            desc="Reverse-engineered from job descriptions of MAANG and global Tier-1 startups."
                        />
                        <ArchCard
                            icon={<Layers size={28} />}
                            title="System Design"
                            desc="Moving beyond syntax to architectural thinking and production-grade scalability."
                        />
                        <ArchCard
                            icon={<ShieldCheck size={28} />}
                            title="Career Shield"
                            desc="Institutional placement guarantee backed by a network of 500+ global hiring partners."
                        />
                        <ArchCard
                            icon={<Network size={28} />}
                            title="Global Network"
                            desc="Lifetime access to an elite brotherhood of engineers operating in top tech hubs."
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
                                Advanced Training <br /> Ecosystem
                            </motion.h2>

                            <div className={styles.perfList}>
                                <PerfItem
                                    icon={<Cpu />}
                                    title="Quantum Labs"
                                    desc="High-performance computing clusters for AI, Cloud simulation, and heavy backend loads."
                                />
                                <PerfItem
                                    icon={<Code2 />}
                                    title="Neural Feedback"
                                    desc="Proprietary AI-driven code reviews that identify logical fallacies in real-time."
                                />
                                <PerfItem
                                    icon={<Globe />}
                                    title="Live Staging"
                                    desc="Deploy your capstone projects to enterprise-grade production environments."
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

            {/* 4. LIFE AT BYTECODE (Preserved Gallery) */}
            <section className={styles.gallerySection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionBadge}>Culture & Innovation</span>
                        <h2 className={styles.sectionTitle}>Life @ ByteCode</h2>
                    </div>

                    <div className={styles.galleryGrid}>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80"
                                alt="Hackathon"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Annual Mega Hackathon</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                                alt="Classroom"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Institutional Labs</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"
                                alt="Mentorship"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>1:1 Mentorship Flow</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                                alt="Office"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Collaborative Sprints</div>
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80"
                                alt="Celebration"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                            <div className={styles.imageCaption}>Placement Celebrations</div>
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
                            <span className={styles.dnaTag}>0x42595445434f4445</span>
                            <h2 className={styles.dnaTitle}>Our DNA</h2>
                            <p className={styles.dnaDesc}>
                                Founded by industry veterans from Google and Microsoft, our
                                mission is to bridge the chasm between academic theory and
                                enterprise-grade engineering. We don't just teach code;
                                we architect engineers.
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
                                layout="fill"
                                objectFit="cover"
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
                            Become a <br /> Tech Architect
                        </motion.h2>
                        <p className={styles.ctaDesc}>
                            The industry doesn't need more programmers. It needs more
                            engineers who can solve complex distributed problems.
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/courses" className={styles.ctaBtnPrim}>
                                Institutional Portal
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
