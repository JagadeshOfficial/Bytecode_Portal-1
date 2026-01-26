"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Hexagon, Search, Bell } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper}>
          {/* Tech Decoration */}
          <div style={{ position: 'absolute', top: -5, left: -5, color: 'var(--accent)' }}>
            <Hexagon size={12} fill="currentColor" />
          </div>

          <Link href="/" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Byte Code Trainings"
              width={140}
              height={35}
              priority
            />
          </Link>
        </div>

        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/about" className={styles.navLink}>About</Link></li>
          <li><Link href="/courses" className={styles.navLink}>Courses</Link></li>
          <li><Link href="/placements" className={styles.navLink}>Placements</Link></li>
          <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
        </ul>

        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search">
            <Search size={18} />
          </button>

          <button className={styles.iconBtn} aria-label="Notifications">
            <Bell size={18} />
            <span className={styles.notificationDot} />
          </button>

          <Link href="/login">
            <button className={styles.loginBtn}>Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
