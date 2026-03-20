"use client";

import Link from 'next/link';

const RELATED_LINKS = [
    { title: "Python Full Stack", href: "/brochure/python-full-stack", color: "#8b5cf6" },
    { title: "Java Full Stack", href: "/brochure/java-full-stack", color: "#6366f1" },
    { title: "Data Science & AI", href: "/brochure/data-science-ai", color: "#06b6d4" },
    { title: "AI Full Stack", href: "/brochure/ai-full-stack", color: "#d946ef" },
    { title: "DevOps & Cloud", href: "/brochure/devops-cloud", color: "#10b981" },
    { title: "Cyber Security", href: "/brochure/cyber-security", color: "#22c55e" },
    { title: "Python Data Analytics", href: "/brochure/python-data-analytics", color: "#f59e0b" },
];

export default function RelatedCourses({ currentPath }: { currentPath: string }) {
    // Filter out the current course so it doesn't link to itself
    const filteredLinks = RELATED_LINKS.filter(link => !link.href.includes(currentPath)).slice(0, 4);

    return (
        <section style={{
            padding: '4rem 2rem 6rem',
            background: '#0a0a0f',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
        }}>
            <h3 style={{
                color: 'white',
                marginBottom: '2rem',
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: "'Rajdhani', sans-serif"
            }}>
                Explore Related Tech Programs
            </h3>
            <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {filteredLinks.map(link => (
                    <Link
                        key={link.title}
                        href={link.href}
                        style={{
                            color: link.color,
                            textDecoration: 'none',
                            padding: '0.75rem 1.5rem',
                            background: `rgba(255,255,255,0.03)`,
                            border: `1px solid ${link.color}33`,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${link.color}15`;
                            e.currentTarget.style.borderColor = link.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `rgba(255,255,255,0.03)`;
                            e.currentTarget.style.borderColor = `${link.color}33`;
                        }}
                    >
                        {link.title}
                    </Link>
                ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
                <Link href="/courses" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', fontSize: '0.9rem' }}>
                    View all courses
                </Link>
            </div>
        </section>
    );
}
