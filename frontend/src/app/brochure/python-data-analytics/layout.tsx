import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Python with Data Analytics Course | Bytecode Trainings',
  description: 'Master Python programming alongside robust Data Analytics tools like Pandas, NumPy, PowerBI, and SQL. Ideal for freshers seeking corporate data roles.',
  openGraph: {
    title: 'Python & Data Analytics Course | Bytecode',
    description: 'Learn Python, PowerBI, SQL, and Exploratory Data Analysis.',
    images: ['/og/python-data-analytics.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Python with Data Analytics Course",
    "description": "Master Python programming alongside robust Data Analytics tools like Pandas, NumPy, PowerBI, and SQL.",
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
