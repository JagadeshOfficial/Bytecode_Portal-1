"use client";

import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Layers, Award, Users, Repeat, CheckCircle, ArrowRight } from 'lucide-react';
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

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Byte Code Trainings?</h2>
            <p className={styles.sectionSubtitle}>We don't just teach code; we shape careers through a rigorous, industry-vetted curriculum.</p>
          </div>

          <div className={styles.grid}>
            <FeatureCard
              icon={<Code size={28} className="text-blue-400" />}
              title="Full Stack Mastery"
              desc="Deep dive into MERN, Java, and Python ecosystems with hands-on projects."
              delay={0.1}
            />
            <FeatureCard
              icon={<Globe size={28} className="text-cyan-400" />}
              title="Cloud Computing"
              desc="Master AWS, Azure, and Google Cloud to build scalable infrastructure."
              delay={0.2}
            />
            <FeatureCard
              icon={<Database size={28} className="text-purple-400" />}
              title="Data Science"
              desc="Unlock insights with Python, R, and Machine Learning algorithms."
              delay={0.3}
            />
            <FeatureCard
              icon={<Users size={28} className="text-green-400" />}
              title="Industry Mentors"
              desc="Learn directly from developers working at Google, Amazon, and Microsoft."
              delay={0.4}
            />
            <FeatureCard
              icon={<Award size={28} className="text-yellow-400" />}
              title="Certified Excellence"
              desc="Globally recognized certifications to boost your resume value."
              delay={0.5}
            />
            <FeatureCard
              icon={<Layers size={28} className="text-pink-400" />}
              title="Real-time Projects"
              desc="Work on live production servers to gain real-world experience."
              delay={0.6}
            />
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

      {/* Portals Section */}
      <section className={styles.portalsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Access Your World</h2>
            <p className={styles.sectionSubtitle}>Secure portals for every role in the ecosystem.</p>
          </div>

          <div className={styles.portalGrid}>
            <PortalCard title="Student Portal" role="For Learners" href="/student" color="blue" />
            <PortalCard title="Employee Portal" role="For Faculty" href="/employee" color="cyan" />
            <PortalCard title="Admin Portal" role="Institute Control" href="/admin" color="purple" />
          </div>
        </div>
      </section>
    </main>
  );
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
