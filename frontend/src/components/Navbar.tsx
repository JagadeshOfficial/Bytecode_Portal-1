"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Courses', href: '/courses' },
  { name: 'Placements', href: '/placements' },
  { name: 'Contact', href: '/contact' },
];

function NavLinkItem({ item, idx, isHovered, setHoveredPath }: { item: { name: string; href: string }, idx: number, isHovered: boolean, setHoveredPath: (path: string | null) => void }) {
  return (
    <motion.li
      onMouseEnter={() => setHoveredPath(item.href)}
      onMouseLeave={() => setHoveredPath(null)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + idx * 0.1, duration: 0.5 }}
    >
      <Link href={item.href} style={{ textDecoration: 'none' }}>
        <motion.div
          className={styles.navItemPill}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{ position: 'relative' }}
        >
          <span className={styles.linkText}>
            {item.name}
          </span>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                layoutId="nav-underline"
                className={styles.liquidUnderline}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
                  borderRadius: '2px'
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.li>
  );
}



export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className={styles.topBanner}>
        Applications closing for {new Date().toLocaleString('default', { month: 'long' })} Batch! 🚀
      </div>

      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoWrapper}>
          <Hexagon className={styles.techDecoration} size={20} />
          <Image
            src="/logo.png"
            alt="Bytecode"
            width={120}
            height={40}
            className={styles.logoImg}
            priority
          />
          <div className={styles.logoGlow} />
        </Link>

        <ul className={styles.navLinks}>
          {navItems.map((item, idx) => (
            <NavLinkItem
              key={item.href}
              item={item}
              idx={idx}
              isHovered={hoveredPath === item.href}
              setHoveredPath={setHoveredPath}
            />
          ))}
        </ul>


        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className={styles.mobileLinks}>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
