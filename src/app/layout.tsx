import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import "./home.css";
import "./home2.css";
import BgCanvas from "@/components/BgCanvas";
import CursorWrapper from "@/components/CursorWrapper";
import ScrollObserver from "@/components/ScrollObserver";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-sans" });

import ClientLayout from "@/components/ClientLayout";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://razalabs.com'),
  title: {
    default: "Raza Labs — Content Distribution Network",
    template: "%s | Raza Labs",
  },
  description: "We orchestrate mass content distribution systems that scale brands natively with organic clippers. Explode your reach across all algorithmic platforms.",
  keywords: ["organic marketing", "short form content", "TikTok agency", "content distribution", "creator growth", "views scaling", "organic marketing agency", "content distribution agency", "video clipping service", "viral clipping agency", "short form content agency", "organic growth agency", "content repurposing agency", "video clip distribution", "clipping service for brands", "organic content marketing", "video clipping agency", "viral clips service", "short form video agency", "content clipping network", "mass content distribution", "clip distribution system", "long form to short form content", "repurpose long form video", "video content repurposing service", "TikTok clipping service", "YouTube Shorts clipping agency", "Instagram Reels clipping service", "multi-platform video distribution", "clipper network for brands", "viral short form content service", "organic marketing for AI startups", "content marketing for SaaS brands", "video marketing for AI tools", "grow AI brand organically", "SaaS brand awareness without paid ads", "organic growth for tech brands", "short form content for SaaS", "content distribution for AI companies", "viral marketing for SaaS", "social media growth for AI startups", "how to grow brand organically 2025", "how to get viral clips for my brand", "hire video clippers for brand", "best organic marketing agency for brands", "outsource video clipping", "done for you content distribution", "organic reach growth service", "alternative to paid ads for brand growth", "no ad spend brand growth strategy", "content marketing vs paid advertising", "UGC marketing agency", "clipping service for content creators", "grow YouTube channel with clips", "podcast clipping agency", "repurpose podcast into clips", "content agency for personal brands", "YouTube to TikTok repurposing service", "grow social media organically", "get 1 million views organically", "scale brand to millions of views", "organic impressions at scale", "brand awareness through organic content", "high ROI content marketing", "organic content that converts", "organic marketing agency for startups", "content distribution service USA", "video clipping agency for e-commerce", "viral marketing for mobile apps", "content agency for funded startups", "TikTok growth agency for brands", "best clipping agency for SaaS 2025", "organic social media agency for tech companies", "Raza Labs review", "Raza Labs organic marketing", "Raza Labs clipping agency", "number one organic marketing network", "527 million views marketing agency" ],
  authors: [{ name: "Raza Labs" }],
  openGraph: {
    title: "Raza Labs — Content Distribution Network",
    description: "Build a mass content distribution system to scale your brand with an army of clippers.",
    url: "https://razalabs.com",
    siteName: "Raza Labs",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Raza Labs Core Value",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raza Labs — Content Distribution Network",
    description: "Scale your brand to new heights seamlessly.",
    images: ["/logo.png"],
  },
  icons: {
    icon: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body className={`${outfit.className} bg-surface text-foreground antialiased`}>
        {/* Google Analytics Tag - Replace ID when shipping */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
