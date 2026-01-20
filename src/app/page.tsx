import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={`${styles.title} animate-fade-in`}>
            Launch Your Tech Career with <br /> Byte Code Trainings
          </h1>
          <p className={styles.subtitle}>
            The premier institute for full-stack development, cloud computing, and placement assistance. Master the skills that top companies are hiring for.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/courses" className="btn btn-primary">Explore Courses</Link>
            <Link href="/student" className="btn btn-outline">Student Portal</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <div className={styles.icon}>📚</div>
              <h3 className={styles.cardTitle}>Expert Curriculum</h3>
              <p className={styles.cardText}>Designed by industry experts to cover the latest technologies and frameworks.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>💻</div>
              <h3 className={styles.cardTitle}>Hands-on Learning</h3>
              <p className={styles.cardText}>Real-world projects, hackathons, and internship opportunities.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>🚀</div>
              <h3 className={styles.cardTitle}>100% Placement Support</h3>
              <p className={styles.cardText}>Resume building, mock interviews, and direct referrals to top tech companies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Access Section */}
      <section className={styles.portals}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Access Your Portal</h2>
          <div className={styles.portalGrid}>
            <Link href="/admin" className={styles.portalCard}>
              <div className={styles.icon}>🛡️</div>
              <div className={styles.portalRole}>Admin Portal</div>
              <p className={styles.cardText}>Manage institute, employees, and finances.</p>
            </Link>

            <Link href="/employee" className={styles.portalCard}>
              <div className={styles.icon}>👨‍🏫</div>
              <div className={styles.portalRole}>Employee Portal</div>
              <p className={styles.cardText}>Manage classes, content, and leave requests.</p>
            </Link>

            <Link href="/student" className={styles.portalCard}>
              <div className={styles.icon}>🎓</div>
              <div className={styles.portalRole}>Student Portal</div>
              <p className={styles.cardText}>Access courses, assignments, and placements.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
