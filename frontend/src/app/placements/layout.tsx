import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Placements | 500+ Students Placed in Top Companies — ByteCode Trainings Hyderabad',
    description: 'See our placement success: 500+ students placed at companies like TCS, Infosys, Wipro, and startups. Average salary ₹4–8 LPA. ByteCode Trainings, Hyderabad.',
    openGraph: {
        title: 'Placements | ByteCode Trainings Hyderabad',
        description: '500+ students placed. Average ₹4–8 LPA starting salary. Check our wall of fame.',
        url: 'https://bytecodetrainings.com/placements',
        siteName: 'ByteCode Trainings',
        type: 'website',
    },
    keywords: ['IT placements Hyderabad', 'software job placement institute', '100% placement guarantee Hyderabad'],
};

export default function PlacementsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
