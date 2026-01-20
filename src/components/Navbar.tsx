import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Byte Code Trainings" 
            width={150} 
            height={40} 
            priority
          />
        </Link>

        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.navLink}>Home</Link></li>
          <li><Link href="/courses" className={styles.navLink}>Courses</Link></li>
          <li><Link href="/placements" className={styles.navLink}>Placements</Link></li>
          <li><Link href="/contact" className={styles.navLink}>Contact</Link></li>
        </ul>

        <div className={styles.actions}>
          <Link href="/admin" className={styles.loginBtn}>Portal Login</Link>
        </div>
      </div>
    </nav>
  );
}
