import type { Metadata } from "next";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "B-EMS | Bytecode Employee Management System",
  description: "Enterprise-grade CRM and HRMS for Bytecode employees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

