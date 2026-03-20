"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BackToTop() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isDashboard = pathname?.startsWith('/admin') || 
                       pathname?.startsWith('/super-admin') || 
                       pathname?.startsWith('/student') || 
                       pathname?.startsWith('/employee');

    if (isDashboard) return null;

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '24px',
                        zIndex: 999,
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'var(--bg-panel)',
                        border: '1px solid rgba(124,58,237,0.25)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--primary)',
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: 'var(--primary)', color: 'white' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ChevronUp size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
