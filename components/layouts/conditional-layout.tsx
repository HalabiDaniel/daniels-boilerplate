'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { InnerHeader } from './inner-header';
import Footer from './footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isHomePage = pathname === '/';

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      {isHomePage ? <Header /> : <InnerHeader />}
      {children}
      <Footer />
    </>
  );
}
