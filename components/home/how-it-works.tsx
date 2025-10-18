'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function HowItWorks() {
  const { isSignedIn } = useUser();
  
  const steps = [
    {
      number: 1,
      title: 'Prepare your environment',
      description: 'Clone the GitHub repository, install all dependencies, and plug in your API keys to get everything up and running smoothly.'
    },
    {
      number: 2,
      title: 'Implement your changes',
      description: 'Customize the codebase freely, adjust the design, and add your own features to shape the app exactly how you want it.'
    },
    {
      number: 3,
      title: 'Launch your business',
      description: 'Skip the tedious setup and focus on what matters, building and growing your SaaS. Go live in days, not weeks.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#F4F7F3] dark:bg-neutral-900 scroll-mt-20">
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-16">
        {/* First Section: Steps */}
        <div className="space-y-8">
          {/* Pill */}
          <div className="flex justify-center">
            <div
              className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              How it works
            </div>
          </div>

          {/* Heading */}
          <h2
            className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white text-center"
            style={{
              letterSpacing: '-1px'
            }}
          >
            The <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>step-by-step</span> process
          </h2>

          {/* Description */}
          <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-center max-w-[600px] mx-auto">
            Using Daniel’s Next.js boilerplate is incredibly easy. Just clone the repository, make your changes, and deploy your project in minutes.
          </p>

          {/* Steps Container */}
          <div
            className="rounded-2xl p-8 md:p-12"
            style={{
              backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
            }}
          >
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  {/* Step Column */}
                  <div className="flex-1 space-y-4">
                    {/* Row 1: Title and Pill */}
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-semibold text-xl md:text-2xl text-[oklch(0.145_0_0)] dark:text-white">
                        {step.title}
                      </h4>
                      <div
                        className="px-3 py-1 rounded-full text-white text-[13px] border-2 border-white whitespace-nowrap"
                        style={{
                          background: 'oklch(0.5 0.134 242.749)'
                        }}
                      >
                        STEP {step.number}
                      </div>
                    </div>

                    {/* Row 2: Description */}
                    <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow Column */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center lg:w-12 lg:flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-[#404040] dark:text-white/70" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Second Section: Ready Templates */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%]">
            {/* Left Column: Content */}
            <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center">
              {/* Heading */}
              <h2
                className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white text-left"
                style={{
                  letterSpacing: '-1px'
                }}
              >
                Beautiful Sections Built for Conversion
              </h2>

              {/* Text */}
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-left">
                Daniel’s Next.js boilerplate not only gives you a complete, ready-to-use solution, but also includes a wide selection of custom-built sections with beautiful, high-converting UI designs.
              </p>

              {/* Button */}
              <div className="flex justify-start">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <Button className="text-white">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button className="text-white">Get Started</Button>
                  </SignUpButton>
                )}
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative min-h-[300px] lg:min-h-[400px] pt-8 lg:pt-12">
              <Image
                src="/how-it-works.png"
                alt="How it works"
                fill
                className="object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
