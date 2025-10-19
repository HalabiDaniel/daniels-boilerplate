'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignUpButton, useUser } from '@clerk/nextjs';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { HighlightedText } from '@/components/daniels-elements/elements/highlighted-text';

export default function SideBySide() {
  const { isSignedIn } = useUser();

  return (
    <section className="w-full bg-[#F4F7F3] dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-24 md:space-y-32">
        {/* First Row: Content Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="space-y-6">
            {/* Pill */}
            <PillBadge />

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Launch Smarter, <HighlightedText>Code Faster</HighlightedText>
            </h2>

            {/* Text */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 max-w-[500px]">
              Skip the endless setup and start building immediately. This boilerplate gives you everything you need to move from idea to live product without wasting time on configuration.
            </p>

            {/* Button */}
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button>Get Started</Button>
              </SignUpButton>
            )}
          </div>

          {/* Right Column: Image with Background */}
          <div className="relative">
            {/* Background Layer */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)',
                transform: 'translate(20px, 20px)',
                zIndex: 0
              }}
            />
            {/* Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden">
              <Image
                src="/side-by-side.png"
                alt="Feature showcase"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Second Row: Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Background */}
          <div className="relative order-2 lg:order-1">
            {/* Background Layer */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)',
                transform: 'translate(20px, 20px)',
                zIndex: 0
              }}
            />
            {/* Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden">
              <Image
                src="/side-by-side.png"
                alt="Feature showcase"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Pill */}
            <PillBadge />

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Built for Makers, <HighlightedText>Loved by Teams</HighlightedText>
            </h2>

            {/* Text */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 max-w-[500px]">
              Whether you’re a solo founder or part of a growing team, the clean structure and powerful integrations make collaboration effortless and development seamless.
            </p>

            {/* Button */}
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button>Get Started</Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
