import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Java Full Stack Developer Course | Bytecode Trainings',
  description: 'Comprehensive Java Full Stack training featuring Advanced Java, Spring Boot, Microservices, Hibernate, and Angular/React. Top-rated institute in Hyderabad.',
  openGraph: {
    title: 'Java Full Stack Development Training | Bytecode',
    description: 'Learn Core/Advanced Java, Spring Boot, and Microservices.',
    images: ['/og/java-full-stack.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Java Full Stack Developer Course",
    "description": "Comprehensive Java Full Stack training featuring Advanced Java, Spring Boot, Microservices, Hibernate, and Angular/React.",
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
