import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Python Full Stack Developer Course | Bytecode Trainings',
  description: 'Complete Python Full Stack Developer training featuring Django, REST frameworks, React, and databases. Build enterprise apps and get placed fast.',
  openGraph: {
    title: 'Python Full Stack Development Training | Bytecode',
    description: 'Master Python, Django, REST APIs, and React Frontend development.',
    images: ['/og/python-full-stack.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Python Full Stack Developer Course",
    "description": "Complete Python Full Stack Developer training featuring Django, REST frameworks, React, and databases.",
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
