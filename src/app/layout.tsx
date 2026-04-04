import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "./home.css";
import "./home2.css";
import BgCanvas from "@/components/BgCanvas";
import CursorWrapper from "@/components/CursorWrapper";
import ScrollObserver from "@/components/ScrollObserver";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Raza Labs — #1 Organic Marketing Network",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${outfit.className} bg-surface text-foreground antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
