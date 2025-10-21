/**
 * Responsive utility functions and hooks for breakpoint detection
 */

import { useEffect, useState } from "react";

/**
 * Tailwind CSS default breakpoints
 */
export const BREAKPOINTS = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Hook to detect current breakpoint based on window width
 * @returns Current breakpoint name
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("mobile");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS["2xl"]) setBreakpoint("2xl");
      else if (width >= BREAKPOINTS.xl) setBreakpoint("xl");
      else if (width >= BREAKPOINTS.lg) setBreakpoint("lg");
      else if (width >= BREAKPOINTS.md) setBreakpoint("md");
      else if (width >= BREAKPOINTS.sm) setBreakpoint("sm");
      else setBreakpoint("mobile");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if current viewport is mobile (< lg breakpoint)
 * @returns true if mobile/tablet, false if desktop
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.lg);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

/**
 * Responsive padding configuration for sections
 */
export interface ResponsivePadding {
  mobile: string;
  tablet: string;
  desktop: string;
}

export const SECTION_PADDING: ResponsivePadding = {
  mobile: "px-6",
  tablet: "md:px-8",
  desktop: "lg:px-4",
};

/**
 * Get combined responsive padding classes
 * @returns Tailwind class string for responsive padding
 */
export function getResponsivePadding(): string {
  return `${SECTION_PADDING.mobile} ${SECTION_PADDING.tablet} ${SECTION_PADDING.desktop}`;
}

/**
 * Hook to detect if current viewport is desktop (>= lg breakpoint)
 * Specifically for admin user management layout switching
 * @returns true if desktop, false if mobile/tablet
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.lg);
    };

    // Initial check
    handleResize();
    
    // Add resize listener with debouncing for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isDesktop;
}

/**
 * Hook to detect if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect if user prefers high contrast
 * @returns true if user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}
