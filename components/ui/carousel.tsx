'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';

export interface CarouselProps {
  children: React.ReactNode[];
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  showDots?: boolean;
  className?: string;
  equalizeHeights?: boolean;
}

export function Carousel({
  children,
  slidesPerView = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 32,
  showDots = true,
  className = '',
  equalizeHeights = true,
}: CarouselProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Determine slides to show based on breakpoint
  const getSlidesToShow = useCallback(() => {
    if (currentBreakpoint === 'desktop') return slidesPerView.desktop || 3;
    if (currentBreakpoint === 'tablet') return slidesPerView.tablet || 2;
    return slidesPerView.mobile || 1;
  }, [currentBreakpoint, slidesPerView]);

  const options: EmblaOptionsType = {
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const setViewportRef = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    // Pass through to Embla's ref
    // @ts-ignore - emblaRef is a callback ref
    emblaRef(node);
  }, [emblaRef]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Handle breakpoint changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCurrentBreakpoint('desktop');
      } else if (width >= 768) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('mobile');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const slidesToShow = getSlidesToShow();
  
  // Group children into slides based on slidesToShow
  const slides: React.ReactNode[][] = [];
  for (let i = 0; i < children.length; i += slidesToShow) {
    slides.push(children.slice(i, i + slidesToShow));
  }

  // Equalize slide heights across all slides
  const applyEqualHeights = useCallback(() => {
    if (!equalizeHeights) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const items = viewport.querySelectorAll<HTMLElement>('.carousel-item');
    if (!items.length) return;

    let maxHeight = 0;
    items.forEach((el) => {
      el.style.minHeight = '';
      el.style.height = '';
    });

    items.forEach((el) => {
      const h = el.offsetHeight;
      if (h > maxHeight) maxHeight = h;
    });

    items.forEach((el) => {
      el.style.minHeight = `${maxHeight}px`;
    });
  }, [equalizeHeights]);

  useEffect(() => {
    if (!equalizeHeights) return;
    // Run after render
    const id = requestAnimationFrame(applyEqualHeights);

    const viewport = viewportRef.current;
    if (viewport && 'ResizeObserver' in window) {
      // Observe each item for content changes
      const ro = new ResizeObserver(() => {
        applyEqualHeights();
      });
      resizeObserverRef.current = ro;
      const items = viewport.querySelectorAll<HTMLElement>('.carousel-item');
      items.forEach((el) => ro.observe(el));
    }

    const handleResize = () => applyEqualHeights();
    window.addEventListener('resize', handleResize);

    // Re-apply on Embla re-initialization
    if (emblaApi) {
      emblaApi.on('reInit', applyEqualHeights);
      emblaApi.on('select', applyEqualHeights);
    }

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', handleResize);
      if (emblaApi) {
        emblaApi.off('reInit', applyEqualHeights);
        emblaApi.off('select', applyEqualHeights);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [applyEqualHeights, emblaApi, equalizeHeights, slidesToShow, currentBreakpoint, children]);

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-x-hidden overflow-y-visible" ref={setViewportRef}>
        <div className="flex" style={{ gap: `${gap}px` }}>
          {slides.map((slideGroup, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-[0_0_100%] min-w-0"
              style={{ gap: `${gap}px` }}
            >
              <div 
                className="grid"
                style={{ 
                  gridTemplateColumns: `repeat(${slidesToShow}, 1fr)`,
                  gap: `${gap}px`,
                  gridAutoRows: '1fr'
                }}
              >
                {slideGroup.map((child, childIndex) => (
                  <div key={childIndex} className="min-w-0 flex carousel-item">
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      {showDots && slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'w-8'
                  : 'w-2'
              }`}
              style={{
                backgroundColor: index === selectedIndex 
                  ? 'oklch(0.5 0.134 242.749)' 
                  : 'oklch(0.391 0.09 240.876)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
