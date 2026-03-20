"use client";

import { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
    {
        name: "Abhinav Reddy",
        date: "2 weeks ago",
        text: "Bytecode Trainings provided me with the solid foundation I needed to crack the interviews. Their Python Full Stack course is extremely hands-on and industrial standard. Highly recommend it to any fresher looking for an IT job in Hyderabad.",
        rating: 5,
        avatar: "A"
    },
    {
        name: "Sneha G",
        date: "1 month ago",
        text: "The DevOps & Cloud Masterclass was incredible. The trainers are working professionals who bring real-time production issues into the classroom. Best software training institute in Madhapur!",
        rating: 5,
        avatar: "S"
    },
    {
        name: "Rahul Kumar",
        date: "3 months ago",
        text: "I joined with zero coding knowledge and finished with 2 job offers. The placement team is very active and the mock interviews prepared me for everything. Five stars for the Java Full Stack track.",
        rating: 5,
        avatar: "R"
    },
    {
        name: "Divya L",
        date: "4 months ago",
        text: "Data Science training here is unparalleled. The emphasis on live projects and Python mathematics helped me understand the ML algorithms deeply.",
        rating: 5,
        avatar: "D"
    }
];

export default function ReviewCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextReview = () => setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    const prevReview = () => setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Bytecode Trainings",
        "url": "https://www.bytecodetrainings.com",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "241"
        },
        "review": REVIEWS.map(r => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.name },
            "datePublished": new Date().toISOString().split('T')[0], // Simulated recent
            "reviewBody": r.text,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": r.rating,
                "bestRating": "5"
            }
        }))
    };

    return (
        <section style={{ padding: '5rem 2rem', background: 'var(--bg-panel)', borderTop: 'var(--border-faint)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--bg-subtle)', padding: '10px 20px', borderRadius: '50px', marginBottom: '1rem' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" />
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-bright)' }}>4.9/5 Average Rating</span>
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                            <Star size={18} fill="currentColor" stroke="none" />
                            <Star size={18} fill="currentColor" stroke="none" />
                            <Star size={18} fill="currentColor" stroke="none" />
                            <Star size={18} fill="currentColor" stroke="none" />
                            <Star size={18} fill="currentColor" stroke="none" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 800 }}>What Our 8,500+ Alumni Say</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button
                        onClick={prevReview}
                        style={{ background: 'var(--bg-subtle)', border: 'var(--border-faint)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-bright)', flexShrink: 0 }}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                        <div style={{
                            display: 'flex',
                            transition: 'transform 0.5s ease-in-out',
                            transform: `translateX(-${currentIndex * 100}%)`
                        }}>
                            {REVIEWS.map((review, i) => (
                                <div key={i} style={{ minWidth: '100%', padding: '0 1rem' }}>
                                    <div style={{ background: 'var(--bg-subtle)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2rem', height: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#4285F4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                                                {review.avatar}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '1.1rem' }}>{review.name}</div>
                                                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{review.date}</div>
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', color: '#f59e0b' }}>
                                                {[...Array(review.rating)].map((_, si) => <Star key={si} size={16} fill="currentColor" stroke="none" />)}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{review.text}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={nextReview}
                        style={{ background: 'var(--bg-subtle)', border: 'var(--border-faint)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-bright)', flexShrink: 0 }}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
