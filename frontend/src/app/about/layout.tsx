import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About ByteCode Trainings | Best IT Training Institute in Hyderabad',
    description: 'Learn about ByteCode Trainings — Hyderabad\'s top-rated IT training institute. Expert mentors, 100% job placement support, and 500+ students placed in top companies.',
    openGraph: {
        title: 'About ByteCode Trainings | Best IT Training Institute in Hyderabad',
        description: 'Hyderabad\'s top IT training institute with 500+ placements and 100% job guarantee programs.',
        url: 'https://bytecodetrainings.com/about',
        siteName: 'ByteCode Trainings',
        type: 'website',
    },
    keywords: ['IT training Hyderabad', 'software training institute', 'Python course Hyderabad', 'job guarantee course'],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
