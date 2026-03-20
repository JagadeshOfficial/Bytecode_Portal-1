
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Send, Moon, Sun } from 'lucide-react';
import styles from './Footer.module.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <footer className={styles.footer} id="contact" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo.png"
                                alt="Bytecode Logo"
                                width={160}
                                height={45}
                                style={{ objectFit: 'contain' }}
                            />
                        </Link>
                        <p className={styles.brandDesc}>
                            Premium coding bootcamps designed to take you from hello world to hired.
                            Join the top 1% of engineers with our advanced curriculum.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialIcon}><Facebook size={18} /></a>
                            <a href="#" className={styles.socialIcon}><Twitter size={18} /></a>
                            <a href="#" className={styles.socialIcon}><Instagram size={18} /></a>
                            <a href="#" className={styles.socialIcon}><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className={styles.footerCol}>
                        <h4>Company</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/">Home</Link>
                            <Link href="/about">About Us</Link>
                            <Link href="/courses">All Courses</Link>
                            <Link href="/placements">Placements</Link>
                            <Link href="/contact">Contact Us</Link>
                        </div>
                    </div>

                    {/* Links Column 2 */}
                    <div className={styles.footerCol}>
                        <h4>Resources</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/courses">Syllabus</Link>
                            <Link href="/placements">Success Stories</Link>
                            <Link href="/privacy">Privacy Policy</Link>
                            <Link href="/terms">Terms of Service</Link>
                            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Portal</Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className={styles.footerCol}>
                        <h4>Stay Updated</h4>
                        <div className={styles.newsletter}>
                            <p>Get the latest tech trends and course updates.</p>
                            <div className={styles.inputGroup}>
                                <input type="email" placeholder="Enter your email" className={styles.emailInput} />
                                <button className={styles.subscribeBtn}><Send size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div>&copy; {new Date().getFullYear()} Bytecode Trainings. All rights reserved.</div>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={styles.themeToggle}
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

                    <div className={styles.legalLinks}>
                        <Link href="/login" className={styles.portalButton}>Portal</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
