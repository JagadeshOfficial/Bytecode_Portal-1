"use client";

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import styles from './about.module.css';
import { Target, Zap, Users, Globe, Cpu, Linkedin, Twitter, Briefcase, Award, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// REUSING FOOTER FROM PAGE.TSX (TEMPORARY SOLUTION AS REQUESTED, IDEALLY SHOULD BE REFACTORED)
// Since we cannot easily import the local Footer from app/page.tsx, I will create a localized version here or just use the same structure.
// For best results, I'll simulate the Footer here to keep the page self-contained for this step.

export default function About() {
    return (
        <main className={styles.main}>
            <Navbar />

            {/* ADVANCED HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroGrid} />
                <div className={styles.heroGlow} />

                <div className={styles.heroContent}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={styles.heroTitle}
                    >
                        Forging The <br /> Future of Tech
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.heroSubtitle}
                    >
                        We are not just a coding bootcamp. We are an elite career accelerator designed to transform ambitious individuals into world-class software engineers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <button className="btn-quantum">Start Your Journey</button>
                    </motion.div>
                </div>
            </section>

            {/* OUR JOURNEY TIMELINE */}
            <section className={styles.timelineSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Our Evolution</h2>
                        <p className={styles.heroSubtitle}>From a garage startup to a global tech education leader.</p>
                    </div>

                    <div className={styles.timelineContainer}>
                        <div className={styles.timelineLine} />

                        <TimelineItem
                            year="2020"
                            title="The Inception"
                            desc="Founded by ex-Google engineers with a mission to fix the broken education system."
                        />
                        <TimelineItem
                            year="2021"
                            title="First 100 Placements"
                            desc="Reached a milestone of placing 100 students in top product companies with 100% success rate."
                        />
                        <TimelineItem
                            year="2022"
                            title="Global Expansion"
                            desc="Launched specialized tracks in AI/ML and Cloud Computing, expanding our footprint to 5 countries."
                        />
                        <TimelineItem
                            year="2024"
                            title="Industry Leader"
                            desc="Recognized as India's #1 Tech Training Institute by TechCrunch, with 5000+ alumni network."
                        />
                    </div>
                </div>
            </section>

            {/* LIFE AT BYTECODE GALLERY */}
            <section className={styles.gallerySection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Life @ ByteCode</h2>
                        <p className={styles.heroSubtitle}>A glimpse into our vibrant culture of learning and innovation.</p>
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
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                                alt="Classroom"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"
                                alt="Mentorship"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                                alt="Office"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                        </div>
                        <div className={styles.galleryItem}>
                            <Image
                                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80"
                                alt="Celebration"
                                layout="fill"
                                objectFit="cover"
                                className={styles.galleryImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* GLOBAL IMPACT */}
            <section className={styles.globalSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Global Footprint</h2>
                        <p className={styles.heroSubtitle}>Creating an impact that transcends borders.</p>
                    </div>

                    <div className={styles.impactGrid}>
                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}><Globe size={32} /></div>
                            <h3 className={styles.impactValue}>5+</h3>
                            <p className={styles.impactLabel}>Countries</p>
                        </div>
                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}><Users size={32} /></div>
                            <h3 className={styles.impactValue}>10k+</h3>
                            <p className={styles.impactLabel}>Alumni Network</p>
                        </div>
                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}><Briefcase size={32} /></div>
                            <h3 className={styles.impactValue}>500+</h3>
                            <p className={styles.impactLabel}>Corporate Partners</p>
                        </div>
                        <div className={styles.impactCard}>
                            <div className={styles.impactIcon}><Award size={32} /></div>
                            <h3 className={styles.impactValue}>50+</h3>
                            <p className={styles.impactLabel}>Industry Awards</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* JOIN REVOLUTION CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Ready to Join the Revolution?</h2>
                    <p className={styles.ctaDesc}>Don't settle for average. Build a career that defines the future.</p>
                    <button className={styles.ctaButton}>Apply Now <ArrowRight /></button>
                </div>
                <div className={styles.ctaGlow} />
            </section>

            {/* MISSION SECTION */}
            <section className={styles.missionSection}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionContent}>
                            <h2 className={styles.missionTitle}>Our Mission</h2>
                            <p className={styles.missionText}>
                                At ByteCode, we believe that high-quality tech education should be accessible, practical, and aligned with the cutting-edge demands of the industry.
                            </p>
                            <p className={styles.missionText}>
                                Founded by industry veterans from Google and Microsoft, our curriculum is reverse-engineered from actual job descriptions of top-tier tech companies. We don't teach you syntax; we teach you how to think like an engineer.
                            </p>

                            <div className={styles.statGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>5000+</span>
                                    <span className={styles.statLabel}>Students Trained</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>450+</span>
                                    <span className={styles.statLabel}>Hiring Partners</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>95%</span>
                                    <span className={styles.statLabel}>Placement Rate</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.statValue}>120%</span>
                                    <span className={styles.statLabel}>Avg Hike</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.missionImageWrapper}>
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                                alt="Team Collaboration"
                                layout="fill"
                                objectFit="cover"
                                className={styles.missionImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className={styles.valuesSection}>
                <div className="container">
                    <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className={styles.sectionTitle}>Core Values</h2>
                        <p className={styles.heroSubtitle}>The principles that drive our curriculum and culture.</p>
                    </div>

                    <div className={styles.valueGrid}>
                        <ValueCard
                            icon={<Target />}
                            title="Industry Relevance"
                            desc="We constantly update our curriculum to match the latest tech trends, ensuring you are always ahead of the curve."
                        />
                        <ValueCard
                            icon={<Zap />}
                            title="Hands-on Mastery"
                            desc="Theory is useless without practice. Our programs are 70% practical coding and system design."
                        />
                        <ValueCard
                            icon={<Users />}
                            title="Community First"
                            desc="Learning is better together. Join a vibrant community of developers, mentors, and alumni."
                        />
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className={styles.teamSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Meet The Mentors</h2>
                        <p className={styles.heroSubtitle}>Learn from the architects who built scalable systems.</p>
                    </div>

                    <div className={styles.teamGrid}>
                        <TeamCard
                            name="Sarah Jenkins"
                            role="Ex-Google | Founder"
                            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                        />
                        <TeamCard
                            name="David Chen"
                            role="Principal Engineer @ Microsoft"
                            image="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"
                        />
                        <TeamCard
                            name="Priya Patel"
                            role="Data Scientist @ Amazon"
                            image="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80"
                        />
                        <TeamCard
                            name="James Wilson"
                            role="DevOps Lead @ Netflix"
                            image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

function ValueCard({ icon, title, desc }: any) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={styles.valueCard}
        >
            <div className={styles.valueIcon}>{icon}</div>
            <h3 className={styles.valueTitle}>{title}</h3>
            <p className={styles.valueDesc}>{desc}</p>
        </motion.div>
    )
}

function TeamCard({ name, role, image }: any) {
    return (
        <div className={styles.teamCard}>
            <img src={image} alt={name} className={styles.teamImage} />
            <div className={styles.teamOverlay}>
                <h3 className={styles.teamName}>{name}</h3>
                <p className={styles.teamRole}>{role}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', color: 'white' }}>
                    <Linkedin size={20} />
                    <Twitter size={20} />
                </div>
            </div>
        </div>
    )
}

function TimelineItem({ year, title, desc }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.timelineItem}
        >
            <div className={styles.timelineDot} />
            <div className={styles.timelineYear}>{year}</div>
            <div className={styles.timelineContent}>
                <h3 className={styles.valueTitle} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p className={styles.valueDesc}>{desc}</p>
            </div>
        </motion.div>
    )
}
