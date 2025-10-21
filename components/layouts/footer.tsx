'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignUpButton, useUser } from '@clerk/nextjs';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';

export default function Footer() {
  const { isSignedIn } = useUser();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <footer
      className="w-full pt-32 mt-20"
      style={{
        background: 'oklch(0.293 0.066 243.157)'
      }}
    >
      <div className="container mx-auto px-6 md:px-8 lg:px-4 pb-16">
        {/* Call to Action */}
        <div
          className="rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col items-center text-center space-y-6 mb-16 -mt-48"
          style={{
            background: 'oklch(0.5 0.134 242.749)'
          }}
        >
          {/* Pill */}
          <PillBadge text='Get Started Today'/>

          {/* Heading */}
          <h2 className="font-semibold text-3xl md:text-[42px] md:leading-[52px] text-white">
            Ready to Build Something Amazing?
          </h2>

          {/* Text */}
          <p className="text-base md:text-[16px] md:leading-[28px] font-normal text-white/80 max-w-[500px]">
            Only two developers so far are using this boilerplate… but hey, you could be the third legendary coder to join the speed club.
          </p>

          {/* Get Started Button */}
          {isSignedIn ? (
            <Link href="/dashboard">
              <Button variant="secondary">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="secondary">
                Get Started
              </Button>
            </SignUpButton>
          )}
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-10 lg:grid-cols-20 gap-8 mb-12 text-center md:text-left">
          {/* Column 1 - Logo and Text (20% on desktop) */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <Image
                src="/daniel-logo-white.png"
                alt="Daniel's Next Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-xl font-semibold text-white font-inter">
                Daniel&apos;s Next
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              I just wanted to make my life easier… and thought I would make yours a little easier too.
            </p>
          </div>

          {/* Column 2 - Links (15% on desktop) */}
          <div className="md:col-span-2 lg:col-span-3">
            <h5 className="text-white font-semibold text-sm mb-4">Product</h5>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Links (15% on desktop) */}
          <div className="md:col-span-2 lg:col-span-3">
            <h5 className="text-white font-semibold text-sm mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Links (15% on desktop) */}
          <div className="md:col-span-2 lg:col-span-3">
            <h5 className="text-white font-semibold text-sm mb-4">Resources</h5>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Newsletter (35% on desktop, full width on tablet) */}
          <div className="md:col-span-10 lg:col-span-7">
            <h5 className="text-white font-semibold text-sm mb-4">Sign up to newsletter</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                buttonRef.current?.click();
              }}
              className="w-full rounded-xl p-1.5 flex items-center gap-1 min-h-[50px]"
              style={{
                backgroundColor: 'oklch(0.922 0 0 / 0.1)'
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none min-w-0"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <Button
                ref={buttonRef}
                type="submit"
                className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative bg-primary text-white hover:bg-foreground hover:text-background"
                style={{
                  width: isInputFocused ? '42px' : 'auto',
                  paddingLeft: isInputFocused ? '0' : '24px',
                  paddingRight: isInputFocused ? '0' : '24px',
                  transition: isInputFocused
                    ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    opacity: isInputFocused ? 1 : 0,
                    transition: isInputFocused ? 'opacity 0.15s ease-in-out 0.1s' : 'opacity 0s'
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span
                  className="whitespace-nowrap"
                  style={{
                    opacity: isInputFocused ? 0 : 1,
                    transition: isInputFocused ? 'opacity 0s' : 'opacity 0.15s ease-in-out 0.1s'
                  }}
                >
                  Submit
                </span>
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/20 mb-8"></div>

        {/* Bottom Row - Copyright and Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright - Left Aligned */}
          <p className="text-white/70 text-sm" suppressHydrationWarning>
            © {new Date().getFullYear()} Daniel Halabi. All rights reserved.
          </p>

          {/* Privacy and Terms - Right Aligned */}
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/70 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 text-sm hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
