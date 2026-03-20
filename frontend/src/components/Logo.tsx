"use client";

import Link from 'next/link';
import { Code2 } from 'lucide-react';
import styles from './Logo.module.css';

interface LogoProps {
    className?: string;
    showTagline?: boolean;
}

export default function Logo({ className = '', showTagline = true }: LogoProps) {
    return (
        <Link href="/" className={`${styles.logoWrapper} ${className}`}>
            <div className={styles.logoIcon}>
                <Code2 size={24} strokeWidth={2.5} />
            </div>
            <div className={styles.logoText}>
                <span className={styles.brandName}>Bytecode</span>
                {showTagline && <span className={styles.brandTagline}>Trainings</span>}
            </div>
        </Link>
    );
}
