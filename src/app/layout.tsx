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

export const metadata: Metadata = {
  title: "Raza Labs — #1 Organic Marketing Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-surface text-foreground antialiased`}>
        <SmoothScroll />
        <ScrollObserver />
        <CursorWrapper />
        <BgCanvas />
        <div className="site-content" id="site-content">
          {children}
        </div>
      </body>
    </html>
  );
}
