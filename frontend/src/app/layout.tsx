import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Inter } from "next/font/google";
import "./globals.css";

import TopBanner from "@/components/TopBanner";
import BackToTop from "@/components/BackToTop";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://www.bytecodetrainings.com'),
  title: "Bytecode Trainings | Architecting the Future",
  description: "Join the elite career accelerator. Master Full Stack, AI, and DevOps with industry-aligned curriculum.",
  keywords: ["Software Training in Hyderabad", "Full Stack Developer Course", "AI Training", "DevOps Certification", "Best IT Institute"],
  robots: "index, follow",
  alternates: {
    canonical: "/",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@type": "EducationalOrganization",
               "name": "Bytecode Trainings",
               "url": "https://www.bytecodetrainings.com",
               "logo": "https://www.bytecodetrainings.com/logo.png",
               "description": "Elite career accelerator offering Deep-tech courses in Full Stack, AI, and DevOps.",
               "address": {
                 "@type": "PostalAddress",
                 "addressLocality": "Madhapur, Hyderabad",
                 "addressRegion": "Telangana",
                 "addressCountry": "IN"
               },
               "contactPoint": {
                 "@type": "ContactPoint",
                 "telephone": "+91-83098-79187",
                 "contactType": "Admissions"
               }
             })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@type": "BreadcrumbList",
               "itemListElement": [
                 {
                   "@type": "ListItem",
                   "position": 1,
                   "name": "Home",
                   "item": "https://www.bytecodetrainings.com"
                 },
                 {
                   "@type": "ListItem",
                   "position": 2,
                   "name": "Courses",
                   "item": "https://www.bytecodetrainings.com/courses"
                 },
                 {
                   "@type": "ListItem",
                   "position": 3,
                   "name": "Placements",
                   "item": "https://www.bytecodetrainings.com/placements"
                 }
               ]
             })
          }}
        />
        <script src="https://meet.jit.si/external_api.js" async></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${inter.variable}`}>
        <TopBanner />
        <Providers>
          {children}

          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
