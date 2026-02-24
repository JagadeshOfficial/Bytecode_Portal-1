"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, Hexagon } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Courses', href: '/courses' },
  { name: 'Placements', href: '/placements' },
  { name: 'Contact', href: '/contact' },
];

function NavLinkItem({ item, idx, isHovered, setHoveredPath }: { item: any, idx: number, isHovered: boolean, setHoveredPath: (path: string | null) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(mouseY, [-25, 25], [15, -15]);
  const rotateY = useTransform(mouseX, [-50, 50], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHoveredPath(null);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onMouseEnter={() => setHoveredPath(item.href)}
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
    >
      <Link href={item.href} style={{ textDecoration: 'none' }}>
        <motion.div
          className={styles.navItemPill}
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            x: isHovered ? mouseX : 0,
            y: isHovered ? mouseY : 0,
          }}
          whileHover={{ scale: 1.1, z: 50 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div className={styles.linkTextWrapper}>
            {item.name.split('').map((char: string, i: number) => (
              <motion.span
                key={i}
                className={styles.char}
                animate={{
                  y: isHovered ? [0, -5, 0] : 0,
                  color: isHovered ? 'var(--text-bright)' : 'rgba(255, 255, 255, 0.9)',
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{
                  delay: isHovered ? i * 0.04 : 0,
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div
                  className={styles.pillGlow}
                  layoutId="pillGlow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
                <motion.div
                  layoutId="liquid-underline"
                  className={styles.liquidUnderline}
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  exit={{ width: 0 }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </motion.li>
  );
}

export default function Navbar() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoWrapper}>
          <Hexagon className={styles.techDecoration} size={20} />
          <Image
            src="/logo.png"
            alt="ByteCode"
            width={120}
            height={40}
            className={styles.logoImg}
            priority
          />
          <div className={styles.logoGlow} />
        </div>

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

        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <Search size={18} />
            <div className={styles.iconGlow} />
          </button>
          <button className={styles.iconBtn}>
            <Bell size={18} />
            <div className={styles.notificationDot} />
            <div className={styles.iconGlow} />
          </button>
          <Link href="/login/student">
            <button className={styles.loginBtn}>
              <div className={styles.loginBtnBorder} />
              <div className={styles.loginBtnBg} />
              <span className={styles.loginBtnText}>Portal</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
