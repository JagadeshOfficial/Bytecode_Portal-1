import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Enroll in IT Courses — ByteCode Trainings Hyderabad',
    description: 'Get in touch with ByteCode Trainings, Hyderabad. Enroll in Python, Full Stack, AI, or DevOps courses. Call +91 83098 79187 or WhatsApp us for free counselling.',
    openGraph: {
        title: 'Contact ByteCode Trainings | Free Career Counselling',
        description: 'Call or WhatsApp +91 83098 79187 for free counselling. Enroll in job-ready IT courses in Hyderabad.',
        url: 'https://bytecodetrainings.com/contact',
        siteName: 'ByteCode Trainings',
        type: 'website',
    },
    keywords: ['ByteCode Trainings contact', 'IT course admission Hyderabad', 'free career counselling Hyderabad'],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
