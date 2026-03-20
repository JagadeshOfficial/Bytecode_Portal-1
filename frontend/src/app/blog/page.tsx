"use client";

import { BLOG_POSTS } from '@/data/blog';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export default function BlogIndexPage() {
    return (
        <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-default)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '1px' }}>
                        TECH INSIGHTS
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif", color: 'var(--text-bright)', marginBottom: '1rem' }}>
                        Bytecode Tech Hub
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
                        Expert advice, deep tech analysis, and high-paying career strategies from our senior industry architects.
                    </p>
                </header>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {BLOG_POSTS.map((post) => (
                        <article key={post.slug} style={{
                            background: 'var(--bg-panel)',
                            border: 'var(--border-faint)',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {post.tags.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.8rem', color: '#a78bfa', background: 'rgba(124,58,237,0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>{tag}</span>
                                ))}
                            </div>
                            
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-bright)' }}>
                                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {post.title}
                                </Link>
                            </h2>

                            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                                {post.description}
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem', borderTop: 'var(--border-faint)', paddingTop: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    <User size={16} /> {post.author}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    <Clock size={16} /> {post.date} • {post.readTime}
                                </div>
                                
                                <Link 
                                    href={`/blog/${post.slug}`} 
                                    style={{ 
                                        marginLeft: 'auto', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        color: '#38bdf8', 
                                        fontWeight: 700,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Read Article <ArrowRight size={18} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
