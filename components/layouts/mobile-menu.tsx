"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

export interface NavItem {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  // Handle body scroll lock
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className="fixed inset-y-0 right-0 w-full bg-background z-50 lg:hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header with theme toggle, logo, and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-12 w-12"
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Link href="/" onClick={handleNavClick} className="flex items-center gap-2">
              <Image 
                src="/daniel-logo.png" 
                alt="Daniel's Next Logo" 
                width={32} 
                height={32}
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold text-black dark:text-white font-inter">
                Daniel&apos;s Next
              </span>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              aria-label="Close menu"
              className="h-12 w-12"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Items - Centered */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="text-2xl font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons - Bottom */}
          <div className="p-6 border-t flex flex-col gap-4">
            {isSignedIn ? (
              <Link href="/dashboard" onClick={handleNavClick}>
                <Button variant="outline" className="w-full" size="lg">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in" onClick={handleNavClick}>
                  <Button variant="outline" className="w-full" size="lg">
                    Sign In
                  </Button>
                </Link>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="w-full" size="lg">
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
