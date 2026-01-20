"use client";

import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Code, Database, Globe, Layers, Award, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ overflowX: 'hidden' }}>
      <Navbar />
      <AnimatedHero />

      {/* Features Grid with Bento Box Design */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Why Byte Code Trainings?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>We don't just teach code; we shape careers.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            gridAutoRows: 'minmax(200px, auto)'
          }}>
            <FeatureCard
              icon={<Code size={32} className="text-blue-400" />}
              title="Full Stack Mastery"
              desc="Deep dive into MERN, Java, and Python ecosystems with hands-on projects."
              delay={0.1}
            />
            <FeatureCard
              icon={<Globe size={32} className="text-cyan-400" />}
              title="Cloud Computing"
              desc="Master AWS, Azure, and Google Cloud to build scalable infrastructure."
              delay={0.2}
            />
            <FeatureCard
              icon={<Database size={32} className="text-purple-400" />}
              title="Data Science"
              desc="Unlock insights with Python, R, and Machine Learning algorithms."
              delay={0.3}
            />
            <FeatureCard
              icon={<Users size={32} className="text-green-400" />}
              title="Industry Mentors"
              desc="Learn directly from developers working at Google, Amazon, and Microsoft."
              delay={0.4}
            />
            <FeatureCard
              icon={<Award size={32} className="text-yellow-400" />}
              title="Certified Excellence"
              desc="Globally recognized certifications to boost your resume value."
              delay={0.5}
            />
            <FeatureCard
              icon={<Layers size={32} className="text-pink-400" />}
              title="Real-time Projects"
              desc="Work on live production servers to gain real-world experience."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Access Your World</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Secure portals for every role in the ecosystem.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
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
      className="glass-panel"
      style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{
        width: 60, height: 60,
        borderRadius: '1rem',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '0.5rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  )
}

function PortalCard({ title, role, href, color }: any) {
  const gradient = {
    blue: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    cyan: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    purple: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
  }[color as string] || 'gray';

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel"
        style={{
          padding: '3rem 2rem',
          borderRadius: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
          background: gradient
        }} />
        <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{role}</p>
      </motion.div>
    </Link>
  )
}
