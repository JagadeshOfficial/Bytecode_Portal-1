"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PHONE = "+918309879187";
const WA_URL = `https://wa.me/918309879187?text=${encodeURIComponent("Hi Bytecode! I want to know more about your courses.")}`;

export default function StickyMobileCTA() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show after 2 seconds
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const isDashboard = pathname?.startsWith('/admin') || 
                       pathname?.startsWith('/super-admin') || 
                       pathname?.startsWith('/student') || 
                       pathname?.startsWith('/employee');

    if (isDashboard) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        display: 'flex',
                        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
                        borderTop: '1px solid rgba(124,58,237,0.15)',
                    }}
                    // Only show on mobile via CSS
                    className="sticky-mobile-cta"
                >
                    {/* Call Now */}
                    <a
                        href={`tel:${PHONE}`}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '1rem',
                            background: '#4f46e5',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '1rem',
                            textDecoration: 'none',
                            minHeight: '56px',
                        }}
                    >
                        <Phone size={20} />
                        Call Now
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
