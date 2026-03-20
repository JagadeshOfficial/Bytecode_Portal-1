import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Science & AI Master Course in Hyderabad | Bytecode Trainings',
  description: 'Master Data Science, Machine Learning, Deep Learning, NLP, and Predictive Analytics. Work on real-time projects and get guaranteed placement support.',
  openGraph: {
    title: 'Data Science & AI Training | Bytecode',
    description: 'Learn ML, Neural Networks, Python, and Analytics from experts.',
    images: ['/og/data-science-ai.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Data Science & AI Master Course",
    "description": "Master Data Science, Machine Learning, Deep Learning, NLP, and Predictive Analytics.",
    "provider": {
      "@type": "Organization",
      "name": "Bytecode Trainings",
      "sameAs": "https://www.bytecodetrainings.com"
    }
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {children}
    </>
  );
}
