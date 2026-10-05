import type { Metadata, Viewport } from "next";
import { Anton, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { projects } from "@/data/projects";
import { site } from "@/data/site";

import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

const title = `${site.name} | ${site.role}`;
const description = `${site.description} Explore ${projects.length} projects, from booking platforms and an AI web app to websites for cafes, clinics and studios.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Murali Kumar R",
    "Web Developer",
    "WordPress Developer",
    "Next.js Developer",
    "React",
    "TypeScript",
    "Elementor",
    "Responsive Web Design",
    "Frontend Developer",
    "Developer Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${site.name} Portfolio`,
    title,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${jakarta.variable} ${grotesk.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Background ambient glow & grid */}
        <div className="ambient-glow glow-top-left" aria-hidden="true" />
        <div className="ambient-glow glow-bottom-right" aria-hidden="true" />
        <div className="grid-overlay" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
