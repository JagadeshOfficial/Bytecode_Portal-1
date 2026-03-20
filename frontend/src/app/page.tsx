"use client";

import { useRef, useEffect, useState } from 'react';
import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));
const IndustryPartners = dynamic(() => import('@/components/IndustryPartners'));
import { motion, animate, useInView, Variants } from 'framer-motion';
import { Code, Database, Globe, Layers, CheckCircle, ArrowRight, ShieldCheck, BookOpen, Cpu, Server, Lock, Download, TrendingUp, Quote, Star, Linkedin, Twitter, Github, Instagram, Mail, Phone, MapPin, Send, ChevronRight, Zap, Target, Rocket, Lightbulb, Video, Award, Users, X } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getCompanyLogo } from '@/utils/logoUtils';
import { SUCCESS_STORIES } from '@/data/placements';
import CareerQuiz from '@/components/CareerQuiz';
import ReviewCarousel from '@/components/ReviewCarousel';
import FAQSection from '@/components/FAQSection';
import SafeImage from '@/components/SafeImage';

// BEST ANIMATIONS: VARIANT DEFINITIONS
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
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

// Helper to get next Monday's date
const getNextBatchDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7 || 7);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export default function Home() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ title: '', brochureLink: '' });
  const nextBatchDate = getNextBatchDate();

  const handleSyllabusClick = (courseTitle: string, brochureLink: string) => {
    setSelectedCourse({ title: courseTitle, brochureLink });
    setShowLeadModal(true);
  };

  return (
    <main className={styles.main}>
      <Navbar />
      <AnimatedHero />

      {/* ── MASTERCLASS INLINE BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a21caf 100%)',
        padding: '0 1.5rem',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '2rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {/* Left: badge + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '260px' }}>
            {/* Pulse icon */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', flexShrink: 0,
            }}>🎓</div>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.2)', padding: '2px 10px',
                borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800,
                color: 'white', letterSpacing: '1px', marginBottom: '0.35rem',
              }}>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 8px #4ade80',
                  display: 'inline-block',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
                FREE · LIMITED SEATS
              </div>
              <p style={{
                margin: 0, fontWeight: 800, fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                color: 'white', lineHeight: 1.3,
              }}>
                Free 1-Hour Masterclass — How to Land Your First IT Job in 2026
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            href="/contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'white', color: '#4f46e5',
              padding: '0.7rem 1.75rem', borderRadius: '12px',
              fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
          >
            Reserve My Seat →
          </Link>
        </div>
      </div>

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
            <StatItem value={150} suffix="%" label="Average Salary Hike" />
            <StatItem value={18} suffix=" LPA" label="Highest Package" />
            <StatItem value={500} suffix="+" label={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Top IT Hiring Partners <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} /></span>} />
            <StatItem value={95} suffix="%" label="Placement Success Rate" />
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
              We Teach You What Colleges Don't
            </motion.h2>
            <p className={styles.sectionSubtitle}>Real-time training, mentorship by IT experts, and non-stop placement support. Your success is our reputation.</p>
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
              title="Learn from Real IT Professionals"
              desc="Understand concepts easily with our interactive classes, designed especially for beginners."
            />
            <AdvantageCard
              icon={<Target />}
              title="We Guide You at Every Step"
              desc="Got stuck? Our mentors are always available to clear your doubts patiently."
            />
            <AdvantageCard
              icon={<Rocket />}
              title="Build Projects Companies Ask For"
              desc="Stop learning only theory. We make you build real apps that make your resume stand out."
            />
            <AdvantageCard
              icon={<Lightbulb />}
              title="Dedicated Placement Support"
              desc="We schedule interviews for you until you get that precious offer letter."
            />
          </motion.div>
        </div>
      </section>

      {/* CAREER QUIZ */}
      <CareerQuiz />

      {/* 3. VIBRANT CAREER TRACKS */}
      <section className={styles.pCoursesSection} id="courses">
        <div className="container">
          <div className={styles.pSectionHeader}>
            <div className={styles.pBadge}>POPULAR IT COURSES</div>
            <h2 className={styles.pSectionTitle}>Courses Built for Your First IT Job</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Start at <strong style={{ color: '#10b981' }}>&#8377;3,000/month</strong> with 0% EMI &amp; Early-Bird Scholarships Available</p>
          </div>

          <motion.div
            className={styles.pCourseGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CourseCard
              title="AI Full Stack (Zero Coding)"
              desc="The highlight course of the decade. Build secure, scalable applications powered by Agentic AI—no coding required."
              salary="8-15 LPA"
              icon={<Rocket size={24} />}
              image="/ai-course.png"
              tags={['High Demand', 'Gen AI', 'Agentic AI']}
              brochureLink="/brochure/ai-full-stack"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="Python with Data Analytics"
              desc="Learn Python from zero and become a Data Analyst. Perfect for non-IT backgrounds."
              salary="6-8 LPA"
              icon={<Database size={24} />}
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              tags={['Best for Freshers', 'Python', 'SQL', 'Pandas']}
              brochureLink="/brochure/python-data-analytics"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="Python Full Stack"
              desc="Build complete websites using Python. One of the easiest ways to start your software career."
              salary="4-8 LPA"
              icon={<Layers size={24} />}
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"
              tags={['Best for Freshers', 'Python', 'Django', 'React']}
              brochureLink="/brochure/python-full-stack"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="Java Full Stack Mastery"
              desc="The most in-demand skill in IT. We teach Java step-by-step to make you a Full Stack Developer."
              salary="5-10 LPA"
              icon={<Code size={24} />}
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"
              tags={['Best for Freshers', 'Java', 'Spring', 'React']}
              brochureLink="/brochure/java-full-stack"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="Cyber Security"
              desc="Learn to protect systems from hackers. A fast-growing field with massive job opportunities."
              salary="5-9 LPA"
              icon={<ShieldCheck size={24} />}
              image="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80"
              tags={['Best for Freshers', 'Ethical Hacking', 'NetSec', 'SOC']}
              brochureLink="/brochure/cyber-security"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="Data Science"
              desc="Step into the future. Master AI and Data Science with practical, hands-on training."
              salary="6-10 LPA"
              icon={<Cpu size={24} />}
              image="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80"
              tags={['Experienced', 'ML', 'AI', 'TensorFlow']}
              brochureLink="/brochure/data-science-ai"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
            />
            <CourseCard
              title="DevOps with AWS"
              desc="Every IT company needs Cloud experts. Learn AWS and DevOps to secure a high-paying role."
              salary="7-10 LPA"
              icon={<Server size={24} />}
              image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              tags={['Experienced', 'AWS', 'Docker', 'K8s']}
              brochureLink="/brochure/devops-cloud"
              onSyllabusClick={handleSyllabusClick}
              nextBatch={nextBatchDate}
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
            <div className={styles.pBadge}>HOW WE TRANSFORM YOU</div>
            <h2 className={styles.pSectionTitle}>Your Step-by-Step Path to a Software Job</h2>
          </div>
          <div className={styles.roadmapContainer}>
            <div className={styles.roadmapPath}>
              <RoadmapStep num="01" phase="Diagnostic" title="Career Discussion" desc="We talk to you, understand your background, and suggest the right course for your career." icon={<Target size={20} />} />
              <RoadmapStep num="02" phase="Foundation" title="Basics from Scratch" desc="We start from the very basics. No pressure, just clear and simple teaching." icon={<Award size={20} />} />
              <RoadmapStep num="03" phase="Mastery" title="Practical Training" desc="You learn by doing. We help you build live projects to gain actual working experience." icon={<Cpu size={20} />} />
              <RoadmapStep num="04" phase="Readiness" title="Interview Preparation" desc="We train you on how to crack technical rounds, HR interviews, and build a strong resume." icon={<Users size={20} />} />
              <RoadmapStep num="05" phase="Outcome" title="Placement Drives" desc="Attend interviews with our partner companies until you get finally placed!" icon={<Rocket size={20} />} />
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
                    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '120px' }}>
                      <SafeImage
                        src={s.image}
                        name={s.name}
                        alt={`${s.name} placed at ${s.company} after Bytecode Trainings course in Hyderabad`}
                        fill
                        style={{ objectFit: 'cover', borderRadius: '16px' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className={styles.successContent}>
                    <div className={styles.cardTopRow}>
                      <div className={styles.companyLogoBadgeMini}>
                        <div style={{ position: 'relative', width: '60px', height: '24px' }}>
                          <NextImage
                            src={getCompanyLogo(s.company)}
                            alt={`${s.company} hiring partner at Bytecode Trainings`}
                            fill
                            style={{
                              objectFit: 'contain',
                              ...(s.company === 'Innovation Labs' ? { filter: 'brightness(0)' } : {})
                            }}
                            onError={(e: any) => e.target.style.display = 'none'}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.nameHeader}>
                      <h4 className={styles.successName}>{s.name}</h4>
                    </div>
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

      {/* GOOGLE REVIEWS SEO MODULE */}
      <ReviewCarousel />

      {/* FAQ SECTION */}
      <FAQSection />

      <IndustryPartners />
      <Footer />

      {showLeadModal && (
        <LeadCaptureModal
          courseTitle={selectedCourse.title}
          brochureLink={selectedCourse.brochureLink}
          onClose={() => setShowLeadModal(false)}
        />
      )}
    </main>
  );
}

function ReviewCard({ name, role, image, quote, rating }: any) {
  return (
    <motion.div className={styles.reviewCard} variants={fadeInUp}>
      <div className={styles.reviewHeader}>
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

function CourseCard({ title, desc, salary, icon, image, tags, brochureLink, onSyllabusClick, nextBatch }: any) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div className={styles.advCard} variants={fadeInUp}>
      <div className={styles.advCardImage}>
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '200px' }}>
          <NextImage
            src={image}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className={styles.advCardOverlay} />
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div className={styles.advCardBadge} style={{ background: '#10b981', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>JOB GUARANTEED</div>
          <div style={{ background: 'rgba(255,255,255,0.9)', color: '#7c3aed', padding: '0.3rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={10} fill="#7c3aed" /> Next Batch: {nextBatch || 'Soon'}
          </div>
        </div>
      </div>
      <div className={styles.advCardContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
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
          <button onClick={() => onSyllabusClick(title, brochureLink)} className={styles.advBtnPrimary} style={{ display: 'flex', alignItems: 'center' }}><BookOpen size={14} style={{ marginRight: '8px' }} /> View Syllabus</button>
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



const REVIEWS = [
  // PLACED STUDENTS FIRST (From SUCCESS_STORIES + Verified Text Reviews)
  {
    name: "bolla sahithi",
    role: "Associate Engineer @ Infosys",
    image: "https://i.pravatar.cc/150?u=sahithi",
    rating: 5,
    quote: "Joined in Bytecode Trainings 4 months back and placed successfully in Infosys as a Associate Engineer. Applying to jobs for 11 months before this!"
  },
  {
    name: "Sai Vamsheedhar Reddy",
    role: "System Engineer @ TCS",
    image: "/placements/Vamsi-K.png",
    rating: 5,
    quote: "Bytecode offers an excellent curriculum tailored to the demands of the tech industry. The faculty's expertise helped me secure a position at TCS."
  },
  {
    name: "Vamsi Thammisetti",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Vamsi-T.png",
    rating: 5,
    quote: "Exceeded my expectations! I highly recommend Bytecode to anyone looking to learn Java. Top-notch training for beginners."
  },
  {
    name: "Jagadesh",
    role: "Backend Developer @ Forsys",
    image: "/placements/Jagadesh.png",
    rating: 5,
    quote: "The program is perfectly structured for beginners. The mentors here are deeply invested in our success and support us constantly."
  },
  {
    name: "Vamsi K",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Vamsi-K.png",
    rating: 5,
    quote: "The labs and practical assignments were very helpful. I cleared the Cognizant technical rounds with ease thanks to the curriculum."
  },
  {
    name: "Rajasekhar",
    role: "Full Stack Developer @ Accenture",
    image: "/placements/Rajasekhar.png",
    rating: 5,
    quote: "Gained technical skills and the confidence to tackle complex problems at scale. The Java Full Stack course is truly industry-grade."
  },
  {
    name: "Manoj",
    role: "Associate Developer @ Absolute Labs",
    image: "/placements/Manoj.png",
    rating: 5,
    quote: "An incredible journey. The support from the placement cell was constant and very helpful throughout my graduation transition."
  },
  {
    name: "Sampath",
    role: "Systems Engineer @ Accenture",
    image: "/placements/Sampath.png",
    rating: 5,
    quote: "The career services team was instrumental in navigating the job market and cracking the interview at a top MNC like Accenture."
  },
  {
    name: "Karthik",
    role: "Software Engineer @ Accenture",
    image: "/placements/Karthik.png",
    rating: 5,
    quote: "Invaluable practical skills. I secured a job even before graduation thanks to the intense mock interview preparation."
  },

  {
    name: "Ganesh",
    role: "Software Engineer @ Tech Mahindra",
    image: "/placements/Ganesh-K.png",
    rating: 5,
    quote: "The Python with Data Analytics program was a game-changer; it gave me the practical confidence I needed for my new role at Tech Mahindra."
  },
  {
    name: "Harish",
    role: "Developer @ Cloud Leaf L.L.C",
    image: "/placements/Harish-K.png",
    rating: 5,
    quote: "Intense but incredibly rewarding. The hands-on project experience here is unparalleled in terms of quality and depth."
  },
  {
    name: "Santhavana",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Santhavana.png",
    rating: 5,
    quote: "The 1:1 mentorship from industry experts gave me the confidence to handle any technical round at the corporate level."
  },
  {
    name: "Phani B",
    role: "Junior Developer @ Centelon Networks",
    image: "/placements/Phani.png",
    rating: 5,
    quote: "The Java Full Stack bootcamp was challenging and thorough. It helped me secure my dream role as a software engineer."
  },
  {
    name: "Rishi",
    role: "Software Engineer @ Innovation Labs",
    image: "/placements/Rishi.png",
    rating: 5,
    quote: "Excellent training and great placement support. The real-world project simulations were very helpful in understanding production code."
  },
  {
    name: "Midhun",
    role: "Associate Developer @ Terralogic",
    image: "/placements/Midhun.png",
    rating: 5,
    quote: "Within just a month, I've seen a lot of improvements in my communication and soft skills. The 1-on-1 sessions made me job-ready."
  },
  {
    name: "marahor",
    role: "DevOps Associate @ Teachmint",
    image: "/placements/Marohar.png",
    rating: 5,
    quote: "There will be definitely a change while coming to this training and leaving. I saw massive growth in both technical and DevOps aspects."
  },
  {
    name: "Yambadi Tejaswar",
    role: "Software Engineer @ Arcitech",
    image: "/placements/Tejaswar.png",
    rating: 5,
    quote: "Classes are easy to understand, and the trainers explain everything clearly with real-time examples. Practical learning is top focus."
  },
  {
    name: "Divya",
    role: "Backend Engineer @ Nemali Software",
    image: "/placements/Divya.png",
    rating: 5,
    quote: "The real-world projects and system design drills were the key differentiator for me. Cracking the backend role was easy after this."
  },
  {
    name: "Rishwitha",
    role: "Junior Developer @ Tech Solutions",
    image: "/placements/Rishwitha Nalgonda.png",
    rating: 5,
    quote: "I highly recommend Bytecode for anyone looking to enter the IT industry. The career guidance here is truly exceptional."
  },

  // REMAINING STUDENT REVIEWS
  {
    name: "Vivek Kamera",
    role: "Data Analytics Student",
    image: "https://i.pravatar.cc/150?u=vivek",
    rating: 5,
    quote: "The trainers are highly knowledgeable and explain every concept in a very clear way. Highlight is the placement support starting from 60 days!"
  },
  {
    name: "Lakshman Madamanchi",
    role: "Data Analytics Student",
    image: "https://i.pravatar.cc/150?u=lakshman",
    rating: 5,
    quote: "Highly recommended to all confused freshers! Currently enrolled in Data Analytics and the experience has been amazing so far."
  },
  {
    name: "AREPALLI SIDDHARTHA",
    role: "Transformed Graduate",
    image: "https://i.pravatar.cc/150?u=siddhartha",
    rating: 5,
    quote: "I joined Bytecode Trainings where am transforming myself. Got hands-on experience on the real time industry projects."
  },
  {
    name: "Budige Pavani",
    role: "Python Data Analytics",
    image: "https://i.pravatar.cc/150?u=pavani",
    rating: 5,
    quote: "Trainer and mentors are very friendly and everytime available for clearing our doubts. Gained a lot of knowledge in a short period."
  },
  {
    name: "Charan Teja",
    role: "Java Full Stack Developer",
    image: "https://i.pravatar.cc/150?u=charan",
    rating: 5,
    quote: "Provides a great environment for learning. The trainers are experienced and give individual attention to every student. Gained strong knowledge."
  },
  {
    name: "Jagadeswararao Vana",
    role: "Full Stack Student",
    image: "https://i.pravatar.cc/150?u=jv",
    rating: 5,
    quote: "The classes were clear and easy to understand. It's a very good place to learn coding and tech skills for freshers. Very positive experience."
  },
  {
    name: "Praneeth Reddy",
    role: "Technical Graduate",
    image: "https://i.pravatar.cc/150?u=praneeth",
    rating: 5,
    quote: "Concentrates on not only technical training but also communication and interview prep skills. Placement assistance is very helpful!"
  },
  {
    name: "Avalla Sunil",
    role: "IT Career Starter",
    image: "https://i.pravatar.cc/150?u=sunil",
    rating: 5,
    quote: "Perfect place to kickstart your IT career. Trainers explain concepts with real examples making learning super easy. Placement support is excellent."
  },
  {
    name: "Sharook khan Pathan",
    role: "Upskilled Graduate",
    image: "https://i.pravatar.cc/150?u=sharook",
    rating: 5,
    quote: "Staff is very friendly and helpful. They support students throughout the course and answer doubts clearly. Teaching style makes learning easy."
  },
  {
    name: "tharuni Uma",
    role: "Upskilling Professional",
    image: "https://i.pravatar.cc/150?u=tharuni",
    rating: 5,
    quote: "Supportive trainers and practical approach helped me understand projects. Highly recommended for anyone looking to upskill their career."
  },
  {
    name: "Yashwanth Raja",
    role: "Data Analytics Aspirant",
    image: "https://i.pravatar.cc/150?u=yashwanth",
    rating: 5,
    quote: "Best institution to land a job in data analytics. Mentors and trainers are very experienced in their field. Highly recommended!"
  }
];



function LeadCaptureModal({ courseTitle, brochureLink, onClose }: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      course: courseTitle,
      action: 'brochure'
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        router.push(brochureLink);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.modalOverlay} onClick={() => !isSuccess && onClose()}>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={styles.megaDetailModal}
        style={{ padding: '3rem', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modalCloseIcon} onClick={onClose} disabled={isSuccess}><X size={24} /></button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ width: '80px', height: '80px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}
            >
              <ShieldCheck size={40} color="#fff" />
            </motion.div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>Success!</h2>
            <p style={{ color: 'var(--text-dim)' }}>
              Your details have been verified.<br />
              Granting access to brochure...
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--primary)' }}>
                <BookOpen size={28} color="#8b5cf6" />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'Rajdhani', fontWeight: 800 }}>View Syllabus</h2>
              <p style={{ color: 'rgba(148, 163, 184, 1)', fontSize: '0.95rem' }}>Enter your details to verify your eligibility and view the syllabus for {courseTitle}.</p>
            </div>

            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</label>
                <input name="name" type="text" required placeholder="Enter your full name" style={{ width: '100%', padding: '1rem', background: 'var(--bg-subtle)', border: 'var(--border-faint)', color: 'var(--text-bright)', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email Address</label>
                <input name="email" type="email" required placeholder="Enter your email address" style={{ width: '100%', padding: '1rem', background: 'var(--bg-subtle)', border: 'var(--border-faint)', color: 'var(--text-bright)', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Phone Number</label>
                <input name="phone" type="tel" required placeholder="Enter your mobile number" style={{ width: '100%', padding: '1rem', background: 'var(--bg-subtle)', border: 'var(--border-faint)', color: 'var(--text-bright)', borderRadius: '12px', fontSize: '1rem', outline: 'none' }} />
              </div>

              <button type="submit" className={styles.enrollBtn} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'View Syllabus'} <ArrowRight size={18} />
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.8)', marginTop: '1.5rem', opacity: 0.6 }}>
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
