"use client";

import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Layers, Award, Users, Repeat, CheckCircle, ArrowRight, ShieldCheck, BookOpen, CreditCard, Briefcase, FileText, Cpu, Server, Lock, Layout, Video, Target, Rocket, Lightbulb, Download, TrendingUp, Quote, Star, BadgeCheck, Twitter, Linkedin, Github, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <AnimatedHero />

      {/* Hiring Partners Ticker */}
      <section className={styles.partnersSection}>
        <div className="container">
          <h3 className={styles.partnersTitle}>Trusted By Industry Leaders</h3>
          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeTrack}>
              {/* Duplicated for infinite scroll effect */}
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '6rem' }}>
                  <div className={styles.partnerLogo}><Globe /> GOOGLE</div>
                  <div className={styles.partnerLogo}><Database /> MICROSOFT</div>
                  <div className={styles.partnerLogo}><Layers /> AMAZON</div>
                  <div className={styles.partnerLogo}><Code /> NETFLIX</div>
                  <div className={styles.partnerLogo}><Users /> META</div>
                  <div className={styles.partnerLogo}><Award /> TESLA</div>
                  <div className={styles.partnerLogo}><Repeat /> UBER</div>
                  <div className={styles.partnerLogo}><CheckCircle /> ADOBE</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses: Elite Career Tracks */}
      <section className={styles.coursesSection} id="courses">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Master The Future of Tech</h2>
            <p className={styles.sectionSubtitle}>Industry-vetted specialization tracks designed to take you from beginner to top-tier developer.</p>
          </div>

          <div className={styles.courseGrid}>
            <CourseCard
              title="Python with Data Analytics"
              desc="Master Python programming and libraries like Pandas, NumPy, and Matplotlib to derive insights from data."
              salary="₹8-12 LPA"
              icon={<Database size={32} />}
            />
            <CourseCard
              title="Java Full Stack Development"
              desc="Build enterprise-grade applications using Java, Spring Boot, React, and Microservices architecture."
              salary="₹6-14 LPA"
              icon={<Code size={32} />}
            />
            <CourseCard
              title="Python Full Stack Development"
              desc="Become a versatile developer with Python, Django/Flask, and modern frontend frameworks."
              salary="₹6-12 LPA"
              icon={<Layers size={32} />}
            />
            <CourseCard
              title="DevOps & Cloud Engineering"
              desc="Master the art of deployment and scaling with AWS, Docker, Kubernetes, and CI/CD pipelines."
              salary="₹8-18 LPA"
              icon={<Globe size={32} />}
            />
          </div>
        </div>
      </section>

      {/* PROGRAM ADVANTAGE (New Advanced Feature) */}
      <section className={styles.advantageSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>The ByteCode Advantage</h2>
            <p className={styles.sectionSubtitle}>Why top tech companies prefer our graduates.</p>
          </div>

          <div className={styles.advantageGrid}>
            <AdvantageCard
              icon={<Video />}
              title="Live Interactive Classes"
              desc="Join live sessions with industry experts, ask doubts in real-time, and code along with the instructor."
            />
            <AdvantageCard
              icon={<Target />}
              title="1:1 Mentorship"
              desc="Personalized guidance from senior developers at MAANG companies to help you navigate your career path."
            />
            <AdvantageCard
              icon={<Rocket />}
              title="Capstone Projects"
              desc="Build production-grade applications that solve real-world problems and stand out in your portfolio."
            />
            <AdvantageCard
              icon={<Lightbulb />}
              title="Mock Interviews"
              desc="Practice with technical/HR rounds simulated by recruitment managers to boost confidence."
            />
          </div>
        </div>
      </section>

      {/* PLACEMENT STATS (New Advanced Feature) */}
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

      {/* TECH STACK / TOOLS YOU WILL MASTER */}
      <section className={styles.techSection}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>Tools You Will Master</h2>
          </div>
          <div className={styles.techGrid}>
            {/* Java/Spring */}
            <div className={styles.techBadge}><Code /> Java 17</div>
            <div className={styles.techBadge}><Server /> Spring Boot</div>
            <div className={styles.techBadge}><Database /> Hibernate</div>
            {/* Python/Data */}
            <div className={styles.techBadge}><Code /> Python 3.12</div>
            <div className={styles.techBadge}><Database /> Pandas & NumPy</div>
            <div className={styles.techBadge}><Layout /> Tableau</div>
            {/* DevOps/Cloud */}
            <div className={styles.techBadge}><Globe /> AWS Cloud</div>
            <div className={styles.techBadge}><Server /> Docker & K8s</div>
            <div className={styles.techBadge}><Repeat /> Jenkins CI/CD</div>
            <div className={styles.techBadge}><ShieldCheck /> Linux</div>
          </div>
        </div>
      </section>

      {/* DETAILED SYLLABUS BREAKDOWN */}
      <section className={styles.syllabusSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Detailed Curriculum</h2>
            <p className={styles.sectionSubtitle}>A deep dive into what you will learn in each specialization.</p>
          </div>

          <div className={styles.syllabusGrid}>
            {/* Java Full Stack Syllabus */}
            <SyllabusCard
              title="Java Full Stack"
              duration="6 Months"
              modules={[
                "Core Java: OOPs, Collections, Streams, Multithreading",
                "Advanced Java: JDBC, Servlets, JSP",
                "Spring Ecosystem: Spring Boot, MVC, Security, Data JPA",
                "Frontend: HTML5, CSS3, JavaScript, React.js",
                "Database: MySQL, PostgreSQL, MongoDB",
                "Tools: Git, Maven, Postman, JIRA"
              ]}
              tools={['Java', 'Spring', 'React', 'MySQL', 'Git']}
            />

            {/* Python Full Stack Syllabus */}
            <SyllabusCard
              title="Python Tech Stack"
              duration="5 Months"
              modules={[
                "Python Core: Data Types, Functions, OOPs",
                "Web Frameworks: Django (MVT), Flask (Microservices)",
                "Data & AI: NumPy, Pandas Basic, Matplotlib",
                "Frontend: React.js Integration, Redux",
                "Database: SQLite, PostgreSQL",
                "Deployment: Nginx, Gunicorn, Heroku"
              ]}
              tools={['Python', 'Django', 'Flask', 'React', 'PostgreSQL']}
            />

            {/* DevOps & Cloud Syllabus */}
            <SyllabusCard
              title="AWS DevOps Engineering"
              duration="4 Months"
              modules={[
                "Linux Administration & Shell Scripting",
                "AWS Cloud: EC2, S3, IAM, VPC, RDS, Lambda",
                "Containerization: Docker Engine, Compose",
                "Orchestration: Kubernetes, Helm Charts",
                "IaC: Terraform, Ansible",
                "CI/CD: Jenkins Pipelines, GitHub Actions"
              ]}
              tools={['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']}
            />
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className={styles.techSection}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
            <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>Built on Modern Cloud Native Stack</h2>
          </div>
          <div className={styles.techGrid}>
            <div className={styles.techBadge}><Code /> Next.js 14</div>
            <div className={styles.techBadge}><Server /> Spring Boot</div>
            <div className={styles.techBadge}><Database /> MySQL & Firestore</div>
            <div className={styles.techBadge}><Lock /> JWT Security</div>
            <div className={styles.techBadge}><Globe /> AWS Cloud</div>
            <div className={styles.techBadge}><Cpu /> Microservices</div>
          </div>
        </div>
      </section>

      {/* Career Roadmap Section */}
      <section className={styles.roadmapSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Journey to Success</h2>
            <p className={styles.sectionSubtitle}>A proven 4-step path to your dream job in tech.</p>
          </div>

          <div className={styles.timeline}>
            <TimelineStep
              number="01"
              title="Foundation & Logic"
              desc="Master the building blocks of programming with Data Structures and Algorithms."
              align="left"
              color="cyan"
            />
            <TimelineStep
              number="02"
              title="Specialization"
              desc="Pick your track: Full Stack, Data Science, or AI and build profound deep-tech skills."
              align="right"
              color="purple"
            />
            <TimelineStep
              number="03"
              title="Real-world Projects"
              desc="Collaborate on live projects that simulate actual corporate environments."
              align="left"
              color="pink"
            />
            <TimelineStep
              number="04"
              title="Placement & Launch"
              desc="Mock interviews, resume building, and direct referrals to top tech companies."
              align="right"
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Elite Career Tracks */}
      <section className={styles.coursesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Elite Career Tracks</h2>
            <p className={styles.sectionSubtitle}>Specialized programs designed to take you from beginner to industry-ready professional.</p>
          </div>


          <div className={styles.courseGrid}>
            <CourseCard
              title="Python with Data Analytics"
              desc="Master Python programming and libraries like Pandas, NumPy, and Matplotlib to derive insights from data."
              salary="₹8-12 LPA"
              icon={<Database size={32} />}
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
            />
            <CourseCard
              title="Java Full Stack Development"
              desc="Build enterprise-grade applications using Java, Spring Boot, React, and Microservices architecture."
              salary="₹6-14 LPA"
              icon={<Code size={32} />}
              image="https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80"
            />
            <CourseCard
              title="Python Full Stack Development"
              desc="Become a versatile developer with Python, Django/Flask, and modern frontend frameworks."
              salary="₹6-12 LPA"
              icon={<Layers size={32} />}
              image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80"
            />
            <CourseCard
              title="DevOps & Cloud Engineering"
              desc="Master the art of deployment and scaling with AWS, Docker, Kubernetes, and CI/CD pipelines."
              salary="₹8-18 LPA"
              icon={<Globe size={32} />}
              image="https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </section>

      {/* PLACEMENT SUCCESS STORIES */}
      <section className={styles.successSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hall of Fame</h2>
            <p className={styles.sectionSubtitle}>Meet our star performers who cracked top product-based companies.</p>
          </div>

          <div className={styles.scrollWrapper}>
            <div className={styles.scrollTrack}>
              {[...SUCCESS_STORIES, ...SUCCESS_STORIES].map((story, i) => (
                <SuccessStoryCard key={i} {...story} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className={styles.projectsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Build Real-World Applications</h2>
            <p className={styles.sectionSubtitle}>Don't just watch tutorials. Build production-grade apps that get you hired.</p>
          </div>

          <div className={styles.projectGrid}>
            <ProjectCard
              title="E-Commerce Microservices"
              desc="A scalable shopping platform built with Spring Boot, Kafka, and React."
              tags={['Java', 'Spring Boot', 'Microservices', 'React']}
              color="blue"
            />
            <ProjectCard
              title="AI Resume Analyzer"
              desc="Automated CV screening tool using Python, NLP, and OpenAI API."
              tags={['Python', 'FastAPI', 'AI/ML', 'Next.js']}
              color="purple"
            />
            <ProjectCard
              title="Cloud DevOps Pipeline"
              desc="Fully automated CI/CD pipeline using Jenkins, Docker, and AWS."
              tags={['AWS', 'Docker', 'Kubernetes', 'Jenkins']}
              color="cyan"
            />
          </div>
        </div>
      </section>

      {/* EXPERIENCE THE CLASSROOM (VIDEO SECTION) */}
      <section className={styles.videoSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Experience The Classroom</h2>
            <p className={styles.sectionSubtitle}>Watch snippets from our actual live sessions and see how we teach.</p>
          </div>

          <div className={styles.videoGrid}>
            <VideoPreviewCard
              title="Java Full Stack: Building Microservices"
              duration="10:45"
              thumbnail="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"
              views="1.2k"
            />
            <VideoPreviewCard
              title="Data Science: Predicting Stock Prices"
              duration="15:20"
              thumbnail="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              views="950"
            />
            <VideoPreviewCard
              title="DevOps: Deploying to Kubernetes"
              duration="12:10"
              thumbnail="https://images.unsplash.com/photo-1667372393119-c81c0cda0a29?auto=format&fit=crop&q=80"
              views="2.5k"
            />
          </div>
        </div>
      </section>

      {/* STUDENT REVIEWS */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Student Voices</h2>
            <p className={styles.sectionSubtitle}>Hear what our students have to say about their learning experience.</p>
          </div>

          <div className={styles.scrollWrapper}>
            <div className={styles.scrollTrackSlow}>
              {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ... existing code ...

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerTop}>
          {/* Brand Column */}
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span className={styles.logoText}>BYTECODE</span>
              <span className={styles.logoDot}>.</span>
            </div>
            <p className={styles.footerDesc}>
              Empowering the next generation of tech leaders with industry-aligned curriculum and world-class mentorship.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
              <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
              <a href="#" className={styles.socialLink}><Github size={20} /></a>
              <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerLinks}>
            <h4 className={styles.footerHeading}>Platform</h4>
            <ul className={styles.linkList}>
              <li><Link href="#courses">Browse Courses</Link></li>
              <li><Link href="#mentorship">Mentorship</Link></li>
              <li><Link href="#placements">Success Stories</Link></li>
              <li><Link href="#community">Community</Link></li>
            </ul>
          </div>

          {/* Courses */}
          <div className={styles.footerLinks}>
            <h4 className={styles.footerHeading}>Master Tracks</h4>
            <ul className={styles.linkList}>
              <li><Link href="#">Java Full Stack</Link></li>
              <li><Link href="#">Python Data Science</Link></li>
              <li><Link href="#">AWS DevOps</Link></li>
              <li><Link href="#">Web Development</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className={styles.footerContact}>
            <h4 className={styles.footerHeading}>Stay Updated</h4>
            <div className={styles.newsletterBox}>
              <input type="email" placeholder="Enter your email" className={styles.newsInput} />
              <button className={styles.newsBtn}><Send size={18} /></button>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} /> <span>hello@bytecode.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} /> <span>+91 98765 43210</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} /> <span>Hitech City, Hyderabad</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2024 ByteCode Trainings. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

const SUCCESS_STORIES = [
  {
    name: "Aditya Verma",
    role: "SDE-1",
    company: "Amazon",
    package: "24 LPA",
    hike: "150%",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80"
  },
  {
    name: "Priya Sharma",
    role: "Frontend Engineer",
    company: "Microsoft",
    package: "18 LPA",
    hike: "120%",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
  },
  {
    name: "Rohan Gupta",
    role: "Data Analyst",
    company: "Uber",
    package: "22 LPA",
    hike: "200%",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
  },
  {
    name: "Sneha Reddy",
    role: "Cloud Architect",
    company: "Google",
    package: "32 LPA",
    hike: "180%",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
  }
];

const REVIEWS = [
  {
    name: "Karthik N.",
    course: "Java Full Stack",
    review: "The live mentorship program is a game changer. The instructors are real industry engineers who know what's current.",
    rating: 5
  },
  {
    name: "Ananya B.",
    course: "Data Science",
    review: "I came from a non-tech background, but the structured curriculum and support helped me crack a Data Analyst role.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    course: "DevOps Master",
    review: "The hands-on labs for AWS and deployment pipelines were incredibly detailed. Worth every penny.",
    rating: 4
  },
  {
    name: "Meera Patel",
    course: "Python Full Stack",
    review: "The capstone project helped me understand how full-stack apps scale. Best investment for my career.",
    rating: 5
  }
];

function SuccessStoryCard({ name, role, company, package: pkg, hike, image }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={styles.successCard}
    >
      <div className={styles.successHeader}>
        <img src={image} alt={name} className={styles.successImage} />
        <div className={styles.successBadge}>
          <TrendingUp size={14} /> {hike} Hike
        </div>
      </div>
      <div className={styles.successContent}>
        <h3 className={styles.successName}>{name}</h3>
        <p className={styles.successRole}>{role}</p>

        <div className={styles.successDivider} />

        <div className={styles.successMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Company</span>
            <span className={styles.metaValue}>{company}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Package</span>
            <span className={styles.metaValue}>{pkg}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

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

function ReviewCard({ name, course, review, rating, image }: any) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.quoteIcon}>
        <Quote size={32} />
      </div>
      <p className={styles.reviewText}>"{review}"</p>

      <div className={styles.reviewFooter}>
        <div className={styles.reviewerInfo}>
          <h4 className={styles.reviewerName}>{name}</h4>
          <span className={styles.reviewerCourse}>{course}</span>
        </div>
        <div className={styles.starRating}>
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} fill="#fbbf24" stroke="none" />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={styles.featureCard}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
    </motion.div>
  )
}

function TimelineStep({ number, title, desc, align, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={styles.timelineNode}
    >
      <div className={styles.nodeDot} style={{ borderColor: `var(--${color === 'pink' ? 'secondary' : 'primary'})` }}></div>
      <div className={styles.nodeContent}>
        <div className={styles.stepNumber}>{number}</div>
        <h3 className={styles.cardTitle} style={{ fontSize: '1.8rem' }}>{title}</h3>
        <p className={styles.cardDesc}>{desc}</p>
      </div>
    </motion.div>
  )
}

function PortalCard({ title, role, href, color }: any) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className={styles.portalCard}>
        <div className={styles.portalGlow} style={{ background: color === 'blue' ? 'blue' : color === 'cyan' ? 'cyan' : 'purple' }} />
        <div className={styles.portalContent}>
          <div className={styles.portalRole}>{role}</div>
          <div className={styles.portalTitle}>
            {title} <ArrowRight className={styles.arrow} />
          </div>
        </div>
      </div>
    </Link>
  )
}

function ProjectCard({ title, desc, tags, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={styles.projectCard}
    >
      <div className={styles.projectPreview}>
        <div className={styles.projectPreviewOverlay}>
          <button className="px-6 py-2 bg-white text-black font-bold rounded-full transform scale-90 hover:scale-105 transition-transform">
            View Demo
          </button>
        </div>
      </div>
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>{title}</h3>
        <div className={styles.projectTags}>
          {tags.map((tag: string) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <p className={styles.projectDesc}>{desc}</p>
      </div>
    </motion.div>
  )
}

function CourseCard({ title, desc, salary, icon, image }: any) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={styles.courseCard}
    >
      {/* Background Image */}
      <img src={image} alt={title} className={styles.courseBg} />

      {/* Overlay Gradient */}
      <div className={styles.courseOverlay}></div>

      {/* Content */}
      <div className={styles.courseContent}>
        <div className={styles.courseIcon}>
          {icon}
        </div>
        <h3 className={styles.courseTitle}>{title}</h3>
        <p className={styles.courseDesc}>{desc}</p>
        <div className={styles.courseMeta}>
          <span className={styles.salary}><Award size={16} /> Avg: {salary}</span>
          <span className={styles.learnMore}>View Details <ArrowRight size={16} /></span>
        </div>
      </div>
    </motion.div>
  )
}

function ModuleCard({ icon, title, desc }: any) {
  return (
    <div className={styles.moduleCard}>
      <div className={styles.moduleIcon}>{icon}</div>
      <div className={styles.moduleTitle}>{title}</div>
      <div className={styles.moduleDesc}>{desc}</div>
    </div>
  )
}

function SyllabusCard({ title, duration, modules, tools }: any) {
  return (
    <div className={styles.syllabusCard}>
      <div className={styles.syllabusHeader}>
        <h3 className={styles.trackTitle}>{title}</h3>
        <span className={styles.trackDuration}>{duration}</span>
      </div>

      <ul className={styles.moduleList}>
        {modules.map((mod: string, i: number) => (
          <li key={i} className={styles.moduleItem}>
            <CheckCircle size={18} className={styles.moduleCheck} />
            <span className={styles.moduleText}>{mod}</span>
          </li>
        ))}
      </ul>

      <div className={styles.toolGrid}>
        {tools.map((tool: string) => (
          <span key={tool} className={styles.toolItem}>{tool}</span>
        ))}
      </div>

      <div className={styles.syllabusActions}>
        <button className={styles.downloadButton}>
          <Download size={18} /> View Full Curriculum
        </button>
      </div>
    </div>
  )
}

function AdvantageCard({ icon, title, desc }: any) {
  return (
    <div className={styles.advantageCard}>
      <div className={styles.advIcon}>{icon}</div>
      <div className={styles.advTitle}>{title}</div>
      <div className={styles.advDesc}>{desc}</div>
    </div>
  )
}
