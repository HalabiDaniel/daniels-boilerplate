'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

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
            <div
              className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              Feature Highlight
            </div>

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Build faster with <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>modern tools</span>
            </h2>

            {/* Text */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 max-w-[500px]">
              Everything you need to ship your next project quickly. Pre-configured with the best tools and practices to help you focus on what matters most.
            </p>

            {/* Button */}
            <Button className="text-white">Get Started</Button>
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
                src="/side-by-side-1.jpg"
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
                src="/side-by-side-2.jpg"
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
            <div
              className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              Another Feature
            </div>

            {/* Heading */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Scale with <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>confidence</span>
            </h2>

            {/* Text */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 max-w-[500px]">
              Built on a solid foundation with best practices baked in. From authentication to database management, everything is ready to scale with your business.
            </p>

            {/* Button */}
            <Button className="text-white">Get Started</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
