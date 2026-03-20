import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Full Stack Developer Course in Hyderabad | Bytecode Trainings',
  description: 'Master AI-driven full stack development. Learn Python, React, NLP, LangChain, LLMs, and Generative AI to build intelligent cloud applications. 100% Placement Assistance.',
  openGraph: {
    title: 'AI Full Stack Developer Course | Bytecode',
    description: 'Learn Python, React, LangChain, and Generative AI at Bytecode Trainings.',
    images: ['/og/ai-full-stack.png']
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "AI Full Stack Developer Course",
    "description": "Master AI-driven full stack development. Learn Python, React, NLP, LangChain, LLMs, and Generative AI to build intelligent cloud applications.",
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
