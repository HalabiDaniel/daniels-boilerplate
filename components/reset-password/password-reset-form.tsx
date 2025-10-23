'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { InputOTP } from '@/components/ui/input-otp';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'email' | 'otp' | 'password';

export default function PasswordResetForm() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if email looks valid (has @ and domain with .)
  const isEmailFormatValid = (emailValue: string): boolean => {
    const hasAtSymbol = emailValue.includes('@');
    const parts = emailValue.split('@');
    const hasDomainWithDot = parts.length === 2 && parts[1].includes('.');
    return hasAtSymbol && hasDomainWithDot;
  };

  const shouldShrinkButton = isInputFocused && isEmailFormatValid(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/password/guest-reset/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error('Too many attempts. Please try again later.');
        return;
      }

      if (data.success) {
        setCurrentStep('otp');
        toast.success('Verification code sent to your email');
      } else {
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    // Move directly to password step
    // The actual verification will happen when setting the new password
    setCurrentStep('password');
    toast.info('Please enter your new password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/password/guest-reset/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          code: otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error('Too many attempts. Please try again later.');
        return;
      }

      if (data.success) {
        toast.success('Password reset successfully! You can now sign in.');
        // Reset form
        setEmail('');
        setOtp('');
        setNewPassword('');
        setCurrentStep('email');
      } else {
        if (data.error?.includes('compromised')) {
          toast.error('This password has been compromised. Please choose a different one.');
        } else if (data.error?.includes('Invalid')) {
          toast.error('Invalid verification code. Please try again.');
        } else {
          toast.error(data.error || 'Failed to reset password');
        }
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setOtp('');
    setNewPassword('');
    setCurrentStep('email');
  };

  return (
    <section className="w-full -mt-16 md:-mt-20 relative z-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-4 py-8 md:py-12">
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-200 dark:border-gray-800">
          {/* Left Column: Form */}
          <div className="p-8 md:p-12 space-y-6 relative bg-chart-5">
            {/* Heading with Back Button */}
            <div className="flex items-center justify-between">
              <h2
                className="font-semibold text-2xl md:text-[42px] md:leading-[50px] text-white text-left"
                style={{
                  letterSpacing: '-1px'
                }}
              >
                Password Reset
              </h2>

              {/* Back button - only shown after email step */}
              {currentStep !== 'email' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="text-white hover:bg-white/20 shrink-0"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Multi-Step Form */}
            <div className="space-y-10">
              {/* Step 1: Email */}
              <div className="space-y-3">
                <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 text-left">
                  Step 1. Enter your email address to receive a verification code.
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  className={`w-full rounded-xl p-1.5 flex items-center gap-1 min-h-[50px] transition-opacity ${currentStep === 'email' ? 'opacity-100' : 'opacity-50'
                  }`}
                style={{
                  backgroundColor: 'oklch(0.922 0 0 / 0.1)'
                }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={currentStep !== 'email' || isLoading}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/70 outline-none min-w-0 disabled:cursor-not-allowed"
                  onFocus={() => {
                    if (currentStep === 'email') {
                      setIsInputFocused(true);
                    }
                  }}
                  onBlur={() => setIsInputFocused(false)}
                />
                <Button
                  ref={buttonRef}
                  type="submit"
                  disabled={currentStep !== 'email' || isLoading}
                  className="shrink-0 overflow-hidden h-[42px] flex items-center justify-center text-sm relative bg-primary text-white hover:bg-foreground hover:text-background disabled:opacity-50"
                  style={{
                    width: shouldShrinkButton ? '42px' : 'auto',
                    paddingLeft: shouldShrinkButton ? '0' : '24px',
                    paddingRight: shouldShrinkButton ? '0' : '24px',
                    transition: shouldShrinkButton
                      ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: shouldShrinkButton ? 1 : 0,
                      transition: shouldShrinkButton ? 'opacity 0.15s ease-in-out 0.1s' : 'opacity 0s'
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span
                    className="whitespace-nowrap"
                    style={{
                      opacity: shouldShrinkButton ? 0 : 1,
                      transition: shouldShrinkButton ? 'opacity 0s' : 'opacity 0.15s ease-in-out 0.1s'
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Request Code'}
                  </span>
                </Button>
                </form>
              </div>

              {/* Step 2: OTP */}
              {(currentStep === 'otp' || currentStep === 'password') && (
                <div className="space-y-3">
                  <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 text-left">
                    Step 2. Enter the 6-digit code sent to your email.
                  </p>
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className={`transition-opacity ${currentStep === 'otp' ? 'opacity-100' : 'opacity-50'}`}>
                      <InputOTP
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={currentStep !== 'otp' || isLoading}
                      />
                    </div>

                  {currentStep === 'otp' && (
                    <Button
                      type="submit"
                      disabled={otp.length !== 6}
                      className="w-full"
                    >
                      Continue
                    </Button>
                    )}
                  </form>
                </div>
              )}

              {/* Step 3: New Password */}
              {currentStep === 'password' && (
                <div className="space-y-3">
                  <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white/90 text-left">
                    Step 3. Create a new secure password for your account.
                  </p>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 text-sm rounded-lg bg-white/20 text-white placeholder:text-white/70 outline-none border-0 focus:ring-0"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!newPassword.trim() || newPassword.length < 8 || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Resetting Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Image with Quote */}
          <div className="relative min-h-[400px] lg:min-h-[600px]">
            <Image
              src="https://res.cloudinary.com/dbactyzwl/image/upload/v1760818881/Untitled_design_3_gmk9c3.png"
              alt="Password Reset"
              fill
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

            {/* Quote Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-2">
              <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-white">
                "Security is not just a feature, it's a fundamental right. We're here to help you regain access to your account safely."
              </p>
              <p className="text-xs md:text-sm font-semibold text-white">
                Security Team
              </p>
              <p className="text-[11px] md:text-xs font-light text-white/80">
                Daniel's Next
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
