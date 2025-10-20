'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';
import { useSwipe } from '@/lib/hooks/use-swipe';

interface AdminMobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  sidebarContent: React.ReactNode;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-11 w-11 flex-shrink-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function AdminMobileHeader({
  isOpen,
  onToggle,
  onClose,
  sidebarContent,
}: AdminMobileHeaderProps) {
  const pathname = usePathname();

  // Swipe gesture handlers
  const swipeHandlers = useSwipe({
    onSwipeRight: () => {
      if (!isOpen) {
        onToggle();
      }
    },
    onSwipeLeft: () => {
      if (isOpen) {
        onClose();
      }
    },
    threshold: 50,
  });

  // Lock/unlock scroll when sidebar opens/closes
  useEffect(() => {
    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen]);

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Header - Only visible on mobile/tablet */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger Button - Left */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }}
            aria-label="Toggle sidebar"
            className="h-11 w-11 relative z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center">
            <Image
              src="/daniel-logo.png"
              alt="Daniel's Next Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </Link>

          {/* Theme Toggle - Right */}
          <ThemeToggle />
        </div>
      </header>

      {/* Swipe zone for opening sidebar - Left edge */}
      {!isOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 bottom-0 w-8 z-30"
          {...swipeHandlers}
          aria-hidden="true"
        />
      )}

      {/* Backdrop Overlay with swipe support */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
          {...swipeHandlers}
        />
      )}

      {/* Sidebar Slide-in with swipe support */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 z-[60] w-[85%] max-w-[400px] bg-card border-r
          h-[100dvh] max-h-[100dvh]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        {...swipeHandlers}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b min-h-[73px] flex-shrink-0">
          {/* Logo - Far Left */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/daniel-logo.png"
              alt="Daniel's Next Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-base font-semibold font-inter">
              Daniel&apos;s Next
            </span>
          </Link>

          {/* Close Button - Far Right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-11 w-11"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="h-[calc(100%-73px)]">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
