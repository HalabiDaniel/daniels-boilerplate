'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Hero1() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [email, setEmail] = useState('');
  const { isSignedIn } = useUser();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <section
        className="w-full min-h-[500px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[650px] bg-[#F4F7F3] dark:bg-neutral-900 relative pb-32"
      >
        <div className="container mx-auto px-4 py-18 flex items-center justify-center gap-8">
          {/* Left side image */}
          <div className="hidden lg:block relative w-[20%] h-[300px]">
            <Image
              src="/hero-img-1-1.png"
              alt="Hero decoration left"
              fill
              className="object-contain"
            />
          </div>

          {/* Content wrapper with max-width */}
          <div className="w-full max-w-[720px] flex flex-col items-center text-center space-y-6">
            {/* Pill */}
            <div
              className="px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
              style={{
                background: 'oklch(0.5 0.134 242.749)'
              }}
            >
              v1.0 available for free
            </div>

            {/* H1 */}
            <h1
              className="font-semibold text-3xl md:text-[52px] md:leading-[62px] text-[oklch(0.145_0_0)] dark:text-white"
              style={{
                letterSpacing: '-1.35px'
              }}
            >
              Your Friendly Neighborhood Next.js <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>Boilerplate</span>
            </h1>

            {/* P */}
            <p className="text-base md:text-[16px] md:leading-[28px] font-normal text-[#404040] dark:text-white max-w-[450px]">
              A personal boilerplate created by Daniel Halabi to facilitate building Next.js websites quickly and efficiently.
            </p>

            {/* Input with Button or Dashboard Button */}
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button className="text-white">Go to Dashboard</Button>
              </Link>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  buttonRef.current?.click();
                }}
                className="w-full max-w-[450px] bg-[oklch(0.922_0_0)] dark:bg-[#262626] rounded-xl p-1.5 flex items-center gap-1"
              >
                <input
                  type="email"
                  placeholder="Add your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[#262626] dark:text-white placeholder:text-[#262626] dark:placeholder:text-white/70 outline-none"
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                />
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  signInForceRedirectUrl="/dashboard"
                  initialValues={{ emailAddress: email }}
                >
                  <Button
                    ref={buttonRef}
                    type="button"
                    className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative text-white"
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
                      Get Started
                    </span>
                  </Button>
                </SignUpButton>
              </form>
            )}
          </div>

          {/* Right side image */}
          <div className="hidden lg:block relative w-[20%] h-[300px]">
            <Image
              src="/hero-img-1-2.png"
              alt="Hero decoration right"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
}
