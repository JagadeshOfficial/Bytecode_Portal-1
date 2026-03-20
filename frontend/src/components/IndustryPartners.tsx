"use client";

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import styles from './IndustryPartners.module.css';

const elitePartners = [
    { id: '1', name: 'Cognizant' }, { id: '2', name: 'Terralogic' }, { id: '3', name: 'Oracle' },
    { id: '4', name: 'Absolute Labs' }, { id: '5', name: 'Forsys' }, { id: '6', name: 'SparxIT' },
    { id: '7', name: 'Algoworks' }, { id: '8', name: 'DXMINDS' }, { id: '9', name: 'Nexgen' },
    { id: '10', name: 'Honeywell' }, { id: '11', name: 'Deloitte' }, { id: '12', name: 'Cisco' },
    { id: '13', name: 'ZenSar' }, { id: '14', name: 'ITC INFOTECH' }, { id: '15', name: 'Hexaware' },
    { id: '16', name: 'HP' }, { id: '17', name: 'Mphasis' }, { id: '18', name: 'Mindtree' },
    { id: '19', name: 'Wipro' }, { id: '21', name: 'Dr. Reddys' }, { id: '22', name: 'Salesforce' },
    { id: '23', name: 'IBM' }, { id: '24', name: 'DXC' }, { id: '25', name: 'Facebook' },
    { id: '26', name: 'AWS' }, { id: '27', name: 'Tech Mahindra' }, { id: '28', name: 'Accenture' },
    { id: '29', name: 'HCLTech' }, { id: '31', name: 'Arcitech' }, { id: '32', name: 'Cloud Leaf' },
    { id: '33', name: 'Teachmint' }, { id: '34', name: 'Centelon' }, { id: '35', name: 'Tech Solutions' },
    { id: '36', name: 'Gemini' }, { id: '37', name: 'Amazon' }, { id: '38', name: 'Microsoft' },
    { id: '39', name: 'Adobe' }, { id: '40', name: 'Uber' }, { id: '41', name: 'Cred' },
    { id: '42', name: 'Zerodha' }, { id: '43', name: 'Netflix' }, { id: '44', name: 'Google' },
    { id: '45', name: 'Apple' }, { id: '46', name: 'Razorpay' }, { id: '47', name: 'Meta' },
    { id: '48', name: 'Canva' }, { id: '49', name: 'Stripe' }, { id: '50', name: 'Walmart' },
    { id: '51', name: 'Flipkart' }, { id: '52', name: 'Airbnb' }, { id: '53', name: 'Nemali' },
    { id: '54', name: 'Innovation Labs' }
];

export default function IndustryPartners() {
    return (
        <section className={styles.partnersSection}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={styles.sectionHeader}
                >
                    <h2 className={styles.title}>Elite Hiring Network</h2>
                    <p className={styles.subtitle}>
                        Our alumni are driving innovation at the world&apos;s leading technology institutions.
                    </p>
                </motion.div>

                <div className={styles.whiteBlock}>
                    {/* Desktop Grid and Row 1 container */}
                    <div className={styles.logoGrid}>
                        {elitePartners.slice(0, 27).map((partner) => {
                            let extension = 'png';
                            if (partner.id === '54') extension = 'svg';
                            if (partner.name === 'Apple') extension = 'jpg';

                            const logoSrc = partner.name === 'Apple'
                                ? '/CompanyLogos/Apple_logo.jpg'
                                : `/CompanyLogos/${partner.id}.${extension}`;

                            return (
                                <motion.div
                                    key={partner.id}
                                    className={styles.partnerCard}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className={styles.partnerLogo}>
                                        <div className={styles.imageWrapper}>
                                            <NextImage
                                                src={logoSrc}
                                                alt={`${partner.name} Logo`}
                                                width={120}
                                                height={60}
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {/* Duplicate for seamless scrolling marquee on mobile (Row 1) */}
                        <div className={styles.marqueeDuplicate}>
                            {elitePartners.slice(0, 27).map((partner) => {
                                let extension = 'png';
                                if (partner.id === '54') extension = 'svg';
                                if (partner.name === 'Apple') extension = 'jpg';

                                const logoSrc = partner.name === 'Apple'
                                    ? '/CompanyLogos/Apple_logo.jpg'
                                    : `/CompanyLogos/${partner.id}.${extension}`;

                                return (
                                    <motion.div
                                        key={`${partner.id}-dup`}
                                        className={styles.partnerCard}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className={styles.partnerLogo}>
                                            <div className={styles.imageWrapper}>
                                                <NextImage
                                                    src={logoSrc}
                                                    alt={`${partner.name} Logo`}
                                                    width={120}
                                                    height={60}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Row 2 container */}
                    <div className={`${styles.logoGrid} ${styles.logoGridReverse}`}>
                        {elitePartners.slice(27).map((partner) => {
                            let extension = 'png';
                            if (partner.id === '54') extension = 'svg';
                            if (partner.name === 'Apple') extension = 'jpg';

                            const logoSrc = partner.name === 'Apple'
                                ? '/CompanyLogos/Apple_logo.jpg'
                                : `/CompanyLogos/${partner.id}.${extension}`;

                            return (
                                <motion.div
                                    key={partner.id}
                                    className={styles.partnerCard}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className={styles.partnerLogo}>
                                        <div className={styles.imageWrapper}>
                                            <NextImage
                                                src={logoSrc}
                                                alt={`${partner.name} Logo`}
                                                width={120}
                                                height={60}
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        {/* Duplicate for seamless scrolling marquee on mobile (Row 2) */}
                        <div className={styles.marqueeDuplicate}>
                            {elitePartners.slice(27).map((partner) => {
                                let extension = 'png';
                                if (partner.id === '54') extension = 'svg';
                                if (partner.name === 'Apple') extension = 'jpg';

                                const logoSrc = partner.name === 'Apple'
                                    ? '/CompanyLogos/Apple_logo.jpg'
                                    : `/CompanyLogos/${partner.id}.${extension}`;

                                return (
                                    <motion.div
                                        key={`${partner.id}-dup`}
                                        className={styles.partnerCard}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className={styles.partnerLogo}>
                                            <div className={styles.imageWrapper}>
                                                <NextImage
                                                    src={logoSrc}
                                                    alt={`${partner.name} Logo`}
                                                    width={120}
                                                    height={60}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
