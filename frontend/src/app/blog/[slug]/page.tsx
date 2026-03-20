import { BLOG_POSTS } from '@/data/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Bytecode Tech Insights`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
        }
    };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Bytecode Trainings",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.bytecodetrainings.com/CompanyLogos/logo.png"
            }
        },
        "datePublished": "2026-03-15T08:00:00+08:00",
        "dateModified": "2026-03-15T08:00:00+08:00"
    };

    return (
        <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-default)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            
            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#a78bfa', textDecoration: 'none', marginBottom: '3rem', fontWeight: 600 }}>
                    <ArrowLeft size={16} /> Back to Tech Insights
                </Link>

                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {post.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>{tag}</span>
                        ))}
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 900, fontFamily: "'Rajdhani', sans-serif", color: 'var(--text-bright)', lineHeight: 1.1, marginBottom: '2rem' }}>
                        {post.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                {post.author.charAt(0)}
                            </div>
                            <div style={{ color: 'var(--text-bright)', fontWeight: 600 }}>{post.author}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                            <Calendar size={16} /> {post.date}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                            <Clock size={16} /> {post.readTime}
                        </div>
                    </div>
                </header>

                <div 
                    style={{ 
                        fontSize: '1.2rem', 
                        lineHeight: 1.8, 
                        color: 'var(--text-dim)', 
                        gap: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                <div style={{ marginTop: '5rem', padding: '3rem', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '24px', border: '1px solid rgba(124, 58, 237, 0.2)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--text-bright)', marginBottom: '1rem' }}>Ready to master these skills?</h3>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '1.1rem' }}>Join the next batch of our elite placement-driven masterclasses.</p>
                    <Link href="/courses" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>
                        View Our Curriculum
                    </Link>
                </div>
            </article>

            <Footer />
        </main>
    );
}
