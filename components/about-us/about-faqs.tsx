'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AboutFaqs() {
  const faqs = [
    {
      question: 'What is included in the boilerplate?',
      answer: 'The boilerplate includes authentication with Clerk, database integration with Convex, payment processing with Stripe, email functionality via Resend, file storage with Cloudinary, and a complete UI component library with ShadCN.'
    },
    {
      question: 'Do I need coding experience to use this?',
      answer: 'Yes, this boilerplate is designed for developers with Next.js and React experience. You should be comfortable with TypeScript, React components, and basic web development concepts.'
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Absolutely! This boilerplate is MIT licensed, which means you can use it for personal or commercial projects without any restrictions.'
    },
    {
      question: 'What kind of support is available?',
      answer: 'The boilerplate comes with comprehensive documentation and example implementations. For additional help, you can reach out through our contact page or join our community discussions.'
    },
    {
      question: 'How often is the boilerplate updated?',
      answer: 'We regularly update the boilerplate to keep up with the latest versions of Next.js, React, and all integrated services. Updates include bug fixes, new features, and security improvements.'
    }
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6 lg:pr-4">
            {/* Pill */}
            <div
              className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              FAQs
            </div>

            {/* Title */}
            <h2
              className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1px'
              }}
            >
              Frequently Asked <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>Questions</span>
            </h2>

            {/* Description */}
            <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90">
              Find answers to common questions about Daniel's Next.js boilerplate. If you need more information, feel free to reach out.
            </p>

            {/* Button */}
            <Link href="/contact-us">
              <Button className="text-white">Not enough? Contact us now.</Button>
            </Link>
          </div>

          {/* Right Column - FAQs */}
          <div className="space-y-4 min-w-0">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl px-4 md:px-5 border-none"
                  style={{
                    backgroundColor: 'oklch(0.5 0.134 242.749 / 0.075)'
                  }}
                >
                  <AccordionTrigger className="text-left text-sm md:text-[15px] font-medium text-[oklch(0.145_0_0)] dark:text-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-[15px] md:leading-[26px] text-[#404040] dark:text-white/90">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
