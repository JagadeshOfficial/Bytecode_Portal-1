import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Byte Code Trainings"
              width={160}
              height={40}
              priority
            />
          </Link>
        </div>

        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/courses" className={styles.navLink}>Courses</Link></li>
          <li><Link href="/placements" className={styles.navLink}>Placements</Link></li>
          <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
        </ul>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={20} />
          </button>

          <button className={styles.iconBtn} aria-label="Notifications" style={{ position: 'relative' }}>
            <Bell size={20} />
            <span style={{
              position: 'absolute', top: 5, right: 5,
              width: 8, height: 8,
              background: '#ef4444', borderRadius: '50%'
            }} />
          </button>

          <Link href="/login">
            <button className={styles.loginBtn}>Portal Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
