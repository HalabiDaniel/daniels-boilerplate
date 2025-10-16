'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Pick a plan',
      description: 'Go through each of your options, taking note of which check the boxes of your needs.'
    },
    {
      number: 2,
      title: 'Implement changes',
      description: 'Identify areas for improvement using our detailed insights. Refine your content with ease.'
    },
    {
      number: 3,
      title: 'Monitor progress',
      description: 'Our real-time updates and alerts keep you informed. Watch your ecommerce venture thrive.'
    }
  ];

  return (
    <section className="w-full bg-[#F4F7F3] dark:bg-neutral-900">
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
            Our <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>step-by-step</span> approach
          </h2>

          {/* Description */}
          <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-center max-w-[600px] mx-auto">
            With concepts in hand, we meticulously design, refining every detail to align with your vision and objectives.
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
                <>
                  {/* Step Column */}
                  <div key={step.number} className="flex-1 space-y-4">
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
                    <div key={`arrow-${index}`} className="flex items-center justify-center lg:w-12 lg:flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-[#404040] dark:text-white/70" />
                    </div>
                  )}
                </>
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
              {/* Pill */}
              <div
                className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white self-start"
                style={{
                  background: 'oklch(0.5 0.134 242.749)'
                }}
              >
                Ready Templates
              </div>

              {/* Heading */}
              <h2
                className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white text-left"
                style={{
                  letterSpacing: '-1px'
                }}
              >
                Essentials to power your website creation
              </h2>

              {/* Text */}
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-left">
                Getting started is a breeze, regardless of your level of experience. Let us automate your tasks.
              </p>

              {/* Button */}
              <div className="flex justify-start">
                <Button className="text-white">Get Started</Button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative min-h-[300px] lg:min-h-[400px] pt-8 lg:pt-12">
              <Image
                src="/how-it-works.jpg"
                alt="How it works"
                fill
                className="object-cover object-right-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
