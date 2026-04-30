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
  keywords: ["organic marketing", "short form content", "TikTok agency", "content distribution", "creator growth", "views scaling", "organic marketing agency", "content distribution agency", "video clipping service", "viral clipping agency", "short form content agency", "organic growth agency" ],
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
