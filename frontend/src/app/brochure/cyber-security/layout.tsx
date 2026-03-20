import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cyber Security Bootcamp in Hyderabad | Bytecode Trainings',
  description: 'Become a certified Cyber Security expert. Hands-on training in Ethical Hacking, Network Defense, Penetration Testing, and Vulnerability Assessment. Enroll now!',
  openGraph: {
    title: 'Cyber Security Certification Course | Bytecode',
    description: 'Master ethical hacking and network defense with hands-on labs.',
    images: ['/og/cyber-security.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Cyber Security Bootcamp",
    "description": "Become a certified Cyber Security expert. Hands-on training in Ethical Hacking, Network Defense, Penetration Testing, and Vulnerability Assessment.",
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
