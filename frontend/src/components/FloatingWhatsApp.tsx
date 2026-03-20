"use client";

import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FloatingWhatsApp() {
    const phoneNumber = "918309879187";
    const message = "Hi Bytecode! I am confused about which course to take. Can a Career Expert guide me?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const [showTooltip, setShowTooltip] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile
        setIsMobile(window.innerWidth <= 768);
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);

        // Auto-hide tooltip after 10 seconds
        const timer = setTimeout(() => setShowTooltip(false), 10000);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1.5
            }}
            style={{
                position: 'fixed',
                // On mobile, raise higher to avoid the 5-second popup
                bottom: isMobile ? '80px' : '30px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
            }}
            onHoverStart={() => setShowTooltip(true)}
            onHoverEnd={() => setShowTooltip(false)}
        >
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            marginRight: '12px',
                            backgroundColor: '#ffffff',
                            padding: isMobile ? '10px 12px' : '12px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            color: '#1e293b',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: 600,
                            pointerEvents: 'none',
                            position: 'relative',
                            border: '1px solid #e2e8f0',
                            maxWidth: isMobile ? '200px' : 'none',
                        }}
                    >
                        Confused where to start? <br />
                        <span style={{ color: '#25D366', fontSize: '12px' }}>Chat with our Career Expert</span>

                        {/* Right Triangle Pointer */}
                        <div style={{
                            position: 'absolute',
                            right: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 0,
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderLeft: '6px solid #ffffff',
                            filter: 'drop-shadow(2px 0px 1px rgba(0,0,0,0.05))'
                        }}></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    // Slightly smaller on mobile for better ergonomics
                    width: isMobile ? '54px' : '60px',
                    height: isMobile ? '54px' : '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    flexShrink: 0,
                }}
            >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382C17.119 14.205 15.396 13.359 15.078 13.254C14.76 13.149 14.53 13.096 14.3 13.431C14.07 13.766 13.417 14.524 13.223 14.754C13.029 14.984 12.835 15.019 12.482 14.843C12.129 14.666 10.992 14.293 9.646 13.093C8.583 12.146 7.865 10.976 7.653 10.606C7.441 10.236 7.63 10.039 7.807 9.863C7.966 9.705 8.16 9.458 8.337 9.247C8.514 9.035 8.567 8.876 8.69 8.629C8.814 8.383 8.761 8.172 8.673 7.996C8.584 7.82 7.865 6.058 7.566 5.353C7.274 4.666 6.98 4.761 6.786 4.761C6.609 4.761 6.415 4.755 6.221 4.755C6.027 4.755 5.709 4.825 5.444 5.108C5.179 5.39 4.438 6.077 4.438 7.47C4.438 8.863 5.462 10.203 5.604 10.397C5.745 10.591 7.616 13.468 10.482 14.706C11.164 15.001 11.696 15.177 12.11 15.309C12.921 15.567 13.666 15.531 14.253 15.443C14.908 15.346 16.267 14.622 16.55 13.829C16.832 13.036 16.832 12.348 16.744 12.189C16.656 12.03 16.426 11.942 16.073 11.765ZM12.041 21.785C10.264 21.785 8.598 21.329 7.135 20.533L6.822 20.347L3.064 21.332L4.081 17.655L3.877 17.331C2.989 15.917 2.52 14.27 2.52 12.57C2.52 7.322 6.791 3.051 12.041 3.051C14.584 3.051 16.974 4.041 18.771 5.839C20.57 7.637 21.56 10.027 21.56 12.57C21.56 17.822 17.29 22.089 12.043 21.785H12.041Z" />
                </svg>
            </motion.a>
        </motion.div>
    );
}
