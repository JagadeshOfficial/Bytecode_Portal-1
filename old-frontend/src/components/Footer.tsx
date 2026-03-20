"use client";

import styles from './Footer.module.css';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Instagram, Users, ShieldCheck, UserCog, Building2, Briefcase, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerInfo}>
            <h2>BYTECODE</h2>
            <p className={styles.footerDesc}>
              Architecting the next generation of software engineers through
              world-class curriculum and industry-leading mentorship.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
              <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
              <a href="#" className={styles.socialIcon}><Github size={20} /></a>
              <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/courses">All Courses</Link></li>
              <li><Link href="/placements">Placements</Link></li>
            </ul>
          </div>



          <div>
            <h4 className={styles.footerTitle}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Syllabus PDF</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Legal</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerTitle}>Newsletter</h4>
            <div className={styles.newsletterInput}>
              <input type="email" placeholder="Email" />
              <button className={styles.newsletterBtn}>Join</button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.bottomLeftContent}>
            <p>© 2026 ByteCode Trainings. All rights reserved.</p>
            <div className={styles.dividerVertical}></div>
            <ul className={styles.horizontalLinksBottom}>
              <li><Link href="/login/trainer"><UserCog size={14} /> Faculty</Link></li>
              <li><Link href="/login/hr"><Briefcase size={14} /> HR</Link></li>
              <li><Link href="/login/counselor"><Users size={14} /> Counselor</Link></li>
              <li><Link href="/login/finance"><Building2 size={14} /> Finance</Link></li>
              <li><Link href="/login/admin"><ShieldCheck size={14} /> Admin</Link></li>
              <li><Link href="/login/director"><ShieldCheck size={14} /> Director</Link></li>
            </ul>
          </div>

          <div className={styles.footerSystemStatus}>
            <div className={styles.statusDot} />
            <span>Operational: 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
