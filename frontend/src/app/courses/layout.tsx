import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'IT Courses in Hyderabad | Python, Full Stack, AI, Data Science — ByteCode Trainings',
    description: 'Explore job-ready IT courses in Hyderabad: Python Full Stack, AI Full Stack, Data Science, Java, DevOps, and Cyber Security. Start from zero. Get placed in 90 days.',
    openGraph: {
        title: 'IT Courses in Hyderabad | ByteCode Trainings',
        description: 'Job-ready IT courses with 100% placement support in Hyderabad. Python, AI, Full Stack, DevOps, and more.',
        url: 'https://bytecodetrainings.com/courses',
        siteName: 'ByteCode Trainings',
        type: 'website',
    },
    keywords: ['Python course Hyderabad', 'Full Stack course Hyderabad', 'AI course Hyderabad', 'DevOps course Hyderabad', 'IT course freshers'],
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
