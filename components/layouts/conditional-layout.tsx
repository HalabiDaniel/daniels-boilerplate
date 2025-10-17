'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import Footer from './footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
