/**
 * Keyboard navigation utilities for accessibility
 */

import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard navigation for lists and tables
 * @param containerRef - Reference to the container element
 * @param itemSelector - CSS selector for focusable items
 * @param options - Configuration options
 */
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  itemSelector: string,
  options: {
    loop?: boolean; // Whether to loop from last to first item
    orientation?: 'vertical' | 'horizontal' | 'both';
    onActivate?: (element: HTMLElement) => void; // Called when Enter/Space is pressed
  } = {}
) {
  const { loop = true, orientation = 'vertical', onActivate } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;

    const items = Array.from(
      containerRef.current.querySelectorAll(itemSelector)
    ) as HTMLElement[];

    if (items.length === 0) return;

    const currentIndex = items.findIndex(item => 
      item === document.activeElement || item.contains(document.activeElement as Node)
    );

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) {
            nextIndex = loop ? 0 : items.length - 1;
          }
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = loop ? items.length - 1 : 0;
          }
        }
        break;

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) {
            nextIndex = loop ? 0 : items.length - 1;
          }
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = loop ? items.length - 1 : 0;
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;

      case 'Enter':
      case ' ':
        if (onActivate && currentIndex >= 0) {
          event.preventDefault();
          onActivate(items[currentIndex]);
        }
        break;

      default:
        return;
    }

    if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < items.length) {
      items[nextIndex].focus();
    }
  }, [containerRef, itemSelector, loop, orientation, onActivate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, containerRef]);
}

/**
 * Hook to trap focus within a container (useful for modals)
 * @param containerRef - Reference to the container element
 * @param isActive - Whether focus trapping is active
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus the first element when trap becomes active
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerRef, isActive]);
}

/**
 * Hook to handle escape key for closing modals/dropdowns
 * @param onEscape - Callback function to call when Escape is pressed
 * @param isActive - Whether the escape handler is active
 */
export function useEscapeKey(
  onEscape: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onEscape, isActive]);
}

/**
 * Utility to get all focusable elements within a container
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Utility to check if an element is currently visible and focusable
 * @param element - The element to check
 * @returns true if the element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled') || element.getAttribute('tabindex') === '-1') {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  return true;
}