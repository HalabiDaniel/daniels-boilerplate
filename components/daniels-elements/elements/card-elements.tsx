'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Code templates for each card type
export const EMPTY_CARD_CODE = `<div className="rounded-2xl p-8 bg-card border">
  {/* Your content here */}
</div>`;

export const IMAGE_WITH_OFFSET_CODE = `import Image from 'next/image';

<div className="relative">
  {/* Background Layer */}
  <div
    className="absolute inset-0 rounded-2xl bg-primary-alpha-10"
    style={{
      transform: 'translate(20px, 20px)',
      zIndex: 0
    }}
  />
  {/* Image */}
  <div className="relative z-10 rounded-2xl overflow-hidden h-[400px] lg:h-[600px]">
    <Image
      src="public\side-by-side.png"
      alt="Description"
      fill
      className="object-cover"
    />
  </div>
</div>`;

export const PILL_BADGE_CODE = `<div className="inline-block px-3 py-1 rounded-full text-[13px] border-2 bg-primary text-background dark:text-foreground border-background dark:border-foreground">
  Your badge text
</div>`;

export const TESTIMONIAL_CARD_CODE = `import Image from 'next/image';

<div className="rounded-2xl p-6 space-y-6 bg-primary-alpha-50">
  {/* Quote */}
  <p className="text-primary-foreground text-base md:text-[16px] leading-relaxed">
    Your testimonial quote goes here.
  </p>

  {/* Person Info */}
  <div className="flex items-center gap-3">
    {/* Photo Circle */}
    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
      <Image
        src="/person.png"
        alt="Person Name"
        fill
        className="object-cover"
      />
    </div>

    {/* Name and Position */}
    <div>
      <p className="text-primary-foreground font-semibold text-sm">
        Person Name
      </p>
      <p className="text-primary-foreground/70 text-xs">
        Job Title
      </p>
    </div>
  </div>

  {/* Divider */}
  <div className="h-px bg-primary-foreground/20" />

  {/* Metric Section */}
  <div>
    <p className="text-primary-foreground font-bold text-2xl md:text-3xl mb-1">
      50+
    </p>
    <p className="text-primary-foreground/70 text-xs">
      metric description
    </p>
  </div>
</div>`;

export const PRICING_CARD_CODE = `import { Button } from '@/components/ui/button';

<div className="rounded-2xl p-8 bg-card border">
  {/* Optional Featured Badge */}
  <div className="inline-block px-3 py-1 rounded-full text-primary-foreground text-xs font-semibold mb-4 bg-primary">
    Most Popular
  </div>

  <h3 className="text-2xl font-bold mb-2 text-foreground">
    Plan Name
  </h3>
  <p className="text-sm mb-6 text-muted-foreground">
    Plan description
  </p>

  <div className="mb-8">
    <span className="text-4xl font-bold text-foreground">
      $29
    </span>
    <span className="text-sm text-muted-foreground">
      /month
    </span>
  </div>

  <ul className="space-y-3 mb-8">
    <li className="flex items-start gap-2">
      <svg
        className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-muted-foreground">
        Feature 1
      </span>
    </li>
    <li className="flex items-start gap-2">
      <svg
        className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-muted-foreground">
        Feature 2
      </span>
    </li>
  </ul>

  <Button className="w-full">
    Get Started
  </Button>
</div>`;

// Component exports
export function EmptyCard() {
  return (
    <div className="rounded-2xl p-8 bg-card border min-h-[200px] flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Your content here</p>
    </div>
  );
}

export function ImageWithOffset() {
  return (
    <div className="relative max-w-[400px] mx-auto">
      {/* Background Layer */}
      <div
        className="absolute inset-0 rounded-2xl bg-primary-alpha-10"
        style={{
          transform: 'translate(20px, 20px)',
          zIndex: 0
        }}
      />
      {/* Image */}
      <div className="relative z-10 rounded-2xl overflow-hidden h-[300px]">
        <Image
          src="/side-by-side.png"
          alt="Example image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function PillBadge() {
  return (
    <div className="inline-block px-3 py-1 rounded-full text-[13px] border-2 bg-primary text-background dark:text-foreground border-background dark:border-foreground">
      v1.0 available for free
    </div>
  );
}

export function TestimonialCard() {
  return (
    <div className="rounded-2xl p-6 space-y-6 max-w-[400px] bg-primary-alpha-50">
      {/* Quote */}
      <p className="text-primary-foreground text-base md:text-[16px] leading-relaxed">
        I used to spend hours hunting down tiny bugs. Now I just point at this template and poof, the problem solved before I even finish my coffee.
      </p>

      {/* Person Info */}
      <div className="flex items-center gap-3">
        {/* Photo Circle */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="/testimonials.png"
            alt="Alex Morgan"
            fill
            className="object-cover"
          />
        </div>

        {/* Name and Position */}
        <div>
          <p className="text-primary-foreground font-semibold text-sm">
            Alex Morgan
          </p>
          <p className="text-primary-foreground/70 text-xs">
            Freelance Developer
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-primary-foreground/20" />

      {/* Metric Section */}
      <div>
        <p className="text-primary-foreground font-bold text-2xl md:text-3xl mb-1">
          40+
        </p>
        <p className="text-primary-foreground/70 text-xs">
          hours saved on coding in the first day.
        </p>
      </div>
    </div>
  );
}

export function PricingCard() {
  return (
    <div className="rounded-2xl p-8 bg-card border max-w-[400px]">
      {/* Featured Badge */}
      <div className="inline-block px-3 py-1 rounded-full text-primary-foreground text-xs font-semibold mb-4 bg-primary">
        Most Popular
      </div>

      <h3 className="text-2xl font-bold mb-2 text-foreground">
        Professional
      </h3>
      <p className="text-sm mb-6 text-muted-foreground">
        Perfect for growing businesses
      </p>

      <div className="mb-8">
        <span className="text-4xl font-bold text-foreground">
          $29
        </span>
        <span className="text-sm text-muted-foreground">
          /month
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        <li className="flex items-start gap-2">
          <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">
            Unlimited projects
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">
            Priority support
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">
            Advanced analytics
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">
            Custom integrations
          </span>
        </li>
      </ul>

      <Button className="w-full">
        Get Started
      </Button>
    </div>
  );
}
