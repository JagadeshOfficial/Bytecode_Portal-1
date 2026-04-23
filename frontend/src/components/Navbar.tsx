"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Info, 
  BookOpen, 
  Award, 
  Phone, 
  Menu, 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Home', href: '/', icon: <Home size={18} /> },
  { name: 'About', href: '/about', icon: <Info size={18} /> },
  { name: 'Courses', href: '/courses', icon: <BookOpen size={18} /> },
  { name: 'Placements', href: '/placements', icon: <Award size={18} /> },
  { name: 'Contact', href: '/contact', icon: <Phone size={18} /> },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className={styles.navContainer}>
        {/* Logo Section */}
        <Link href="/" className={styles.logoWrapper}>
          <Image
            src="/logo.png"
            alt="Bytecode Trainings"
            width={140}
            height={45}
            className={styles.logoImg}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navItems.map((item, idx) => (
              <li 
                key={item.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={styles.navLi}
              >
                <Link href={item.href} className={styles.navLink}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navName}>{item.name}</span>
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="nav-glow"
                      className={styles.navHoverGlow}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Section */}
        <div className={styles.navActions}>
          <Link href="/courses" className={styles.ctaBtn}>
            <span>Join Now</span>
            <ChevronRight size={16} />
          </Link>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.png"
                  alt="Bytecode Trainings"
                  width={120}
                  height={40}
                  className={styles.logoImg}
                />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeBtn}>
                <X size={28} />
              </button>
            </div>

            <ul className={styles.mobileLinks}>
              {navItems.map((item, idx) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className={styles.mobileIcon}>{item.icon}</span>
                    {item.name}
                    <ChevronRight size={18} className={styles.mobileArrow} />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className={styles.mobileFooter}>
              <Link href="/courses" className={styles.mobileCta} onClick={() => setIsMobileMenuOpen(false)}>
                Start Learning Today
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
