import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DevOps & Cloud Master Course in Hyderabad | Bytecode Trainings',
  description: 'Learn AWS, Azure, Docker, Kubernetes, Jenkins, and CI/CD automation. The complete Cloud and DevOps certification course for elite IT careers.',
  openGraph: {
    title: 'DevOps & Cloud Engineering Course | Bytecode',
    description: 'Master Cloud computing, AWS, Docker, and CI/CD pipelines.',
    images: ['/og/devops-cloud.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "DevOps & Cloud Master Course",
    "description": "Learn AWS, Azure, Docker, Kubernetes, Jenkins, and CI/CD automation. The complete Cloud and DevOps certification course.",
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
