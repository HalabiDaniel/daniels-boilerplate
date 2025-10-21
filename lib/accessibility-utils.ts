/**
 * Accessibility utilities and helpers
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's accessibility preferences
 */
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: 'light' as 'light' | 'dark',
  });

  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      });
    };

    // Initial check
    updatePreferences();

    // Set up listeners for changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    reducedMotionQuery.addEventListener('change', updatePreferences);
    highContrastQuery.addEventListener('change', updatePreferences);
    colorSchemeQuery.addEventListener('change', updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences);
      highContrastQuery.removeEventListener('change', updatePreferences);
      colorSchemeQuery.removeEventListener('change', updatePreferences);
    };
  }, []);

  return preferences;
}

/**
 * Hook to announce messages to screen readers
 * @param message - Message to announce
 * @param priority - Priority level for the announcement
 */
export function useScreenReaderAnnouncement() {
  const [announcer, setAnnouncer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or find the live region for announcements
    let liveRegion = document.getElementById('screen-reader-announcements');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'screen-reader-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    setAnnouncer(liveRegion);

    return () => {
      // Clean up on unmount
      const element = document.getElementById('screen-reader-announcements');
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcer) return;

    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Clear the message after a short delay to allow for re-announcements
    setTimeout(() => {
      if (announcer) {
        announcer.textContent = '';
      }
    }, 1000);
  };

  return announce;
}

/**
 * Utility to generate accessible IDs for form elements
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateAccessibleId(prefix: string = 'accessible'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Utility to create ARIA label text for complex UI elements
 * @param baseLabel - Base label text
 * @param context - Additional context information
 * @returns Complete ARIA label
 */
export function createAriaLabel(baseLabel: string, context?: Record<string, unknown>): string {
  if (!context) return baseLabel;

  const contextParts = Object.entries(context)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${value}`);

  return contextParts.length > 0 
    ? `${baseLabel}, ${contextParts.join(', ')}`
    : baseLabel;
}

/**
 * Hook to manage focus restoration after modal/dialog closes
 * @param isOpen - Whether the modal/dialog is open
 * @param restoreElement - Element to restore focus to (defaults to previously focused element)
 */
export function useFocusRestore(isOpen: boolean, restoreElement?: HTMLElement) {
  const [previouslyFocused, setPreviouslyFocused] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element when opening
      setPreviouslyFocused(document.activeElement as HTMLElement);
    } else if (previouslyFocused) {
      // Restore focus when closing
      const elementToFocus = restoreElement || previouslyFocused;
      if (elementToFocus && typeof elementToFocus.focus === 'function') {
        // Use setTimeout to ensure the modal is fully closed before restoring focus
        setTimeout(() => {
          elementToFocus.focus();
        }, 0);
      }
      setPreviouslyFocused(null);
    }
  }, [isOpen, previouslyFocused, restoreElement]);
}

/**
 * Utility to check if an element is visible to screen readers
 * @param element - Element to check
 * @returns true if visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  
  // Check for common ways elements are hidden from screen readers
  if (
    element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true' ||
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    element.hasAttribute('hidden')
  ) {
    return false;
  }

  return true;
}

/**
 * Utility to get the accessible name of an element
 * @param element - Element to get the name for
 * @returns Accessible name string
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label first
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check associated label elements
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent || '';
    }
  }

  // Fall back to text content
  return element.textContent || '';
}

/**
 * Utility to validate color contrast ratios
 * @param foreground - Foreground color (hex, rgb, or hsl)
 * @param background - Background color (hex, rgb, or hsl)
 * @returns Object with contrast ratio and WCAG compliance levels
 */
export function checkColorContrast(foreground: string, background: string) {
  // This is a simplified version - in a real implementation,
  // you'd want to use a proper color contrast library
  
  // Convert colors to RGB and calculate luminance
  const getLuminance = (_color: string): number => {
    // Simplified luminance calculation
    // In practice, you'd want to use a proper color parsing library
    return 0.5; // Placeholder
  };

  const foregroundLuminance = getLuminance(foreground);
  const backgroundLuminance = getLuminance(background);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: contrastRatio,
    wcagAA: contrastRatio >= 4.5,
    wcagAAA: contrastRatio >= 7,
    wcagAALarge: contrastRatio >= 3,
  };
}

/**
 * CSS classes for high contrast mode support
 */
export const HIGH_CONTRAST_CLASSES = {
  button: 'high-contrast:border-2 high-contrast:border-solid',
  input: 'high-contrast:border-2 high-contrast:border-solid',
  focus: 'high-contrast:outline-2 high-contrast:outline-solid high-contrast:outline-offset-2',
  text: 'high-contrast:text-black dark:high-contrast:text-white',
  background: 'high-contrast:bg-white dark:high-contrast:bg-black',
} as const;

/**
 * Utility to combine classes with high contrast support
 * @param baseClasses - Base CSS classes
 * @param highContrastClasses - Additional classes for high contrast mode
 * @returns Combined class string
 */
export function withHighContrast(
  baseClasses: string,
  highContrastClasses?: string
): string {
  return highContrastClasses 
    ? `${baseClasses} ${highContrastClasses}`
    : baseClasses;
}