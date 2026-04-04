'use client';
import { usePathname } from 'next/navigation';
import BgCanvas from "@/components/BgCanvas";
import CursorWrapper from "@/components/CursorWrapper";
import ScrollObserver from "@/components/ScrollObserver";
import SmoothScroll from "@/components/SmoothScroll";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  return (
    <>
      {!isAuth && (
        <>
          <SmoothScroll />
          <ScrollObserver />
          <CursorWrapper />
          <BgCanvas />
        </>
      )}
      <div className="site-content" id="site-content">
        {children}
      </div>
    </>
  );
}
