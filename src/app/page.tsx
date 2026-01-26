"use client";

import { useRef, useEffect, useState } from 'react';
import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import IndustryPartners from '@/components/IndustryPartners';
import { motion, animate, useInView } from 'framer-motion';
import { Code, Database, Globe, Layers, CheckCircle, ArrowRight, ShieldCheck, BookOpen, Cpu, Server, Lock, Download, TrendingUp, Quote, Star, Linkedin, Twitter, Github, Instagram, Mail, Phone, MapPin, Send, ChevronRight, Zap, Target, Rocket, Lightbulb, Video } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

// BEST ANIMATIONS: VARIANT DEFINITIONS
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function Counter({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      return controls.stop;
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <AnimatedHero />

      {/* 1. PLACEMENT STATS */}
      <section className={styles.statsSection}>
        <div className="container">
          <motion.div
            className={styles.statsGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StatItem value={150} suffix="%" label="Avg Salary Hike" />
            <StatItem value={40} suffix=" LPA" label="Highest Package" />
            <StatItem value={500} suffix="+" label="Hiring Partners" />
            <StatItem value={95} suffix="%" label="Placement Rate" />
          </motion.div>
        </div>
      </section>

      {/* 2. PROGRAM ADVANTAGE */}
      <section className={styles.advantageSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The ByteCode Advantage
            </motion.h2>
            <p className={styles.sectionSubtitle}>Why top tech companies prefer our graduates.</p>
          </div>

          <motion.div
            className={styles.advantageGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AdvantageCard
              icon={<Video />}
              title="Interactive Live Classes"
              desc="Real-time engagement with experts from world-class tech giants."
            />
            <AdvantageCard
              icon={<Target />}
              title="Personal Mentorship"
              desc="Daily guidance from MAANG developers to accelerate your growth."
            />
            <AdvantageCard
              icon={<Rocket />}
              title="Real-World Projects"
              desc="Build and ship scalable products that companies actually look for."
            />
            <AdvantageCard
              icon={<Lightbulb />}
              title="Elite Job Portal"
              desc="Exclusive access to high-paying roles from our global network."
            />
          </motion.div>
        </div>
      </section>

      {/* 3. VIBRANT CAREER TRACKS */}
      <section className={styles.pCoursesSection} id="courses">
        <div className="container">
          <div className={styles.pSectionHeader}>
            <div className={styles.pBadge}>VIBRANT CAREER TRACKS</div>
            <h2 className={styles.pSectionTitle}>Elite Specializations</h2>
          </div>

          <motion.div
            className={styles.pCourseGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CourseCard
              title="Java Full Stack Mastery"
              desc="The ultimate guide to building enterprise distributed systems at scale."
              salary="14 LPA"
              icon={<Code size={24} />}
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"
              tags={['Java', 'Spring', 'React']}
            />
            <CourseCard
              title="Python with Data Analytics"
              desc="Master data architecture and engineering to drive product intelligence."
              salary="12 LPA"
              icon={<Database size={24} />}
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              tags={['Python', 'SQL', 'Pandas']}
            />
            <CourseCard
              title="Full Stack Python Dev"
              desc="End-to-end modern application development with the world's fastest stack."
              salary="12 LPA"
              icon={<Layers size={24} />}
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"
              tags={['Python', 'Django', 'React']}
            />
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Link href="/courses" className={styles.pSeeMoreBtn}>
              See All Courses <ArrowRight size={22} style={{ marginLeft: '10px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CAREERS ROADMAP */}
      <section className={styles.roadmapSection}>
        <div className="container">
          <div className={styles.pSectionHeader}>
            <div className={styles.pBadge}>BYTECODE INSTITUTIONAL FLOW</div>
            <h2 className={styles.pSectionTitle}>Elite Career Architecture</h2>
          </div>
          <div className={styles.roadmapContainer}>
            <div className={styles.roadmapPath}>
              <RoadmapStep num="01" phase="ADmission" title="Skill Assessment" desc="Custom career mapping & logic evaluation." icon={<Target size={20} />} />
              <RoadmapStep num="02" phase="Phase 1" title="Core Mastery" desc="Data Structures, Algorithms & Logic optimization." icon={<Code size={20} />} />
              <RoadmapStep num="03" phase="Phase 2" title="Tech Specialization" desc="Production-grade development in chosen stacks." icon={<Cpu size={20} />} />
              <RoadmapStep num="04" phase="Phase 3" title="System Design" desc="Architecting scalable enterprise-level capstones." icon={<Layers size={20} />} />
              <RoadmapStep num="05" phase="Placement" title="Global Hiring" desc="MAANG-level mock drills & direct corporate portal." icon={<Rocket size={20} />} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HALL OF FAME */}
      <section className={styles.successSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Placements</h2>
          </div>
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollTrack}>
              {[...SUCCESS_STORIES, ...SUCCESS_STORIES].map((s, i) => (
                <div key={i} className={styles.successCard}>
                  <div className={styles.successHeader}>
                    <img src={s.image} alt={s.name} className={styles.successImage} />
                    <div className={styles.successBadge}><TrendingUp size={12} /> {s.hike}</div>
                  </div>
                  <div className={styles.successContent}>
                    <h4 className={styles.successName}>{s.name}</h4>
                    <p className={styles.successRole}>{s.role} @ {s.company}</p>
                    <div className={styles.metaRow}>Package: <span>{s.package}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. STUDENT REVIEWS */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Student Stories</h2>
          </div>
        </div>
        <div className={styles.reviewsWrapper}>
          <div className={styles.reviewsTrack}>
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </section>

      <IndustryPartners />
      <Footer />
    </main>
  );
}

function ReviewCard({ name, role, image, quote, rating }: any) {
  return (
    <motion.div className={styles.reviewCard} variants={fadeInUp}>
      <div className={styles.reviewHeader}>
        <img src={image} alt={name} className={styles.reviewAvatar} />
        <div className={styles.reviewInfo}>
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
      <div className={styles.reviewRating}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "#f59e0b" : "none"} />
        ))}
      </div>
      <blockquote className={styles.reviewQuote}>{quote}</blockquote>
    </motion.div>
  );
}

function StatItem({ value, suffix, label }: any) {
  return (
    <motion.div className={styles.statItem} variants={fadeInUp}>
      <div className={styles.statGlow} />
      <span className={styles.statValue}><Counter value={value} suffix={suffix} /></span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
}

function AdvantageCard({ icon, title, desc }: any) {
  return (
    <motion.div className={styles.advantageCard} variants={fadeInUp} whileHover={{ y: -8 }}>
      <div className={styles.advIcon}>{icon}</div>
      <h3 className={styles.advTitle}>{title}</h3>
      <p className={styles.advDesc}>{desc}</p>
    </motion.div>
  );
}

function CourseCard({ title, desc, salary, icon, image, tags }: any) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div className={styles.advCard} variants={fadeInUp}>
      <div className={styles.advCardImage}>
        <img src={image} alt={title} />
        <div className={styles.advCardOverlay} />
        <div className={styles.advCardBadge} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#10b981', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>JOB GUARANTEED</div>
      </div>
      <div className={styles.advCardContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ background: '#8b5cf6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{icon}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.25rem' }}>₹{salary}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800 }}>AVG. PACKAGE</div>
          </div>
        </div>
        <h3 className={styles.advCardTitle}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tags.map((t: string) => <span key={t} className={styles.advTag}>{t}</span>)}
        </div>
        <p className={styles.advCardDesc}>{desc}</p>
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className={styles.advBtnPrimary}><Download size={14} style={{ marginRight: '8px' }} /> Syllabus</button>
          <Link href="/courses" style={{ color: '#94a3b8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Explore <ChevronRight size={16} /></Link>
        </div>
      </div>
    </motion.div>
  );
}

function RoadmapStep({ num, title, desc, phase, icon }: any) {
  return (
    <motion.div
      className={styles.roadmapNode}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={styles.nodeMarker}>
        <div className={styles.markerIcon}>{icon}</div>
        <div className={styles.markerNum}>{num}</div>
      </div>
      <div className={styles.nodeInfo}>
        <div className={styles.nodePhase}>{phase}</div>
        <h3 className={styles.nodeTitle}>{title}</h3>
        <p className={styles.nodeDesc}>{desc}</p>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerInfo}>
            <h2>BYTECODE</h2>
            <p className={styles.footerDesc}>
              Architecting the next generation of software engineers through
              world-class curriculum and industry-leading mentorship.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
              <a href="#" className={styles.socialIcon}><Github size={20} /></a>
              <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/courses">All Courses</Link></li>
              <li><Link href="/placements">Placements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Syllabus PDF</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Newsletter</h4>
            <p className={styles.newsletterDesc}>
              Get the latest tech insights and career tips delivered to your inbox.
            </p>
            <div className={styles.newsletterInput}>
              <input type="email" placeholder="Enter your email" />
              <button className={styles.newsletterBtn}>Join</button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 ByteCode Trainings. All rights reserved.</p>
          <div className={styles.footerSystemStatus}>
            <div className={styles.statusDot} />
            <span>Operational: 99.9% Uptime</span>
          </div>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const REVIEWS = [
  {
    name: "Saurav Kumar",
    role: "Full Stack Dev @ Swiggy",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    rating: 5,
    quote: "The curriculum is perfectly aligned with industry requirements. ByteCode helped me bridge the gap between college and a real job."
  },
  {
    name: "Anjali Mehta",
    role: "Data Scientist @ Walmart",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    rating: 5,
    quote: "The 1:1 mentorship was a game changer for me. Having a senior dev from MAANG review my code gave me immense confidence."
  },
  {
    name: "Vikram Singh",
    role: "Software Engineer @ Zomato",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    rating: 5,
    quote: "From logic building to system design, they cover everything. The placement support team is relentless in their efforts."
  },
  {
    name: "Megha Rao",
    role: "Java Backend @ Oracle",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    rating: 5,
    quote: "Joining ByteCode was the best career decision I've made. The hands-on project experience is unparalleled in quality."
  },
  {
    name: "Rahul Deshmukh",
    role: "Product Engineer @ Uber",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    rating: 5,
    quote: "Their focus on fundamentals is what makes them different. I cracked my Uber interview thanks to their DSA masterclass."
  }
];

const SUCCESS_STORIES = [
  { name: "Aditya Verma", role: "SDE-1", company: "Amazon", package: "24 LPA", hike: "150%", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80" },
  { name: "Priya Sharma", role: "Frontend", company: "Microsoft", package: "18 LPA", hike: "120%", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" },
  { name: "Rohan Gupta", role: "Data Analyst", company: "Uber", package: "22 LPA", hike: "200%", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80" }
];
