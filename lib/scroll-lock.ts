/**
 * Utility functions for locking and unlocking body scroll
 * Used when modals or mobile menus are open
 */

/**
 * Get the width of the scrollbar to prevent layout shift
 * @returns Scrollbar width in pixels
 */
function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

/**
 * Lock body scroll and prevent layout shift
 */
export function lockScroll(): void {
  if (typeof document === "undefined") return;
  
  const scrollbarWidth = getScrollbarWidth();
  document.body.style.overflow = "hidden";
  
  // Prevent layout shift by adding padding equal to scrollbar width
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

/**
 * Unlock body scroll and restore normal state
 */
export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}
