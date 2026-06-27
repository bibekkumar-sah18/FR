import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Digital Wealth Management",
  description: "Futuristic fintech banking app powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen pb-16 md:pb-0`}>
        <div className="max-w-md mx-auto min-h-screen bg-secondary/10 relative shadow-2xl overflow-hidden border-x border-border/10">
          {children}
        </div>
      </body>
    </html>
  );
}
