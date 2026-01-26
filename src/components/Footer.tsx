"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/logo.png"
                                alt="ByteCode Logo"
                                layout="fill"
                                objectFit="contain"
                                objectPosition="left"
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
                            <Link href="/about">About Us</Link>
                            <Link href="/careers">Careers</Link>
                            <Link href="/placements">Placements</Link>
                            <Link href="/partners">For Partners</Link>
                        </div>
                    </div>

                    {/* Links Column 2 */}
                    <div className={styles.footerCol}>
                        <h4>Resources</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/blog">Blog</Link>
                            <Link href="/events">Events</Link>
                            <Link href="/community">Community</Link>
                            <Link href="/support">Support Center</Link>
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
                    <div>&copy; {new Date().getFullYear()} ByteCode Trainings. All rights reserved.</div>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
