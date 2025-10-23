'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, KeyRound, ArrowLeft } from 'lucide-react';

export function PasswordResetCard() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Send verification code via API route
      const response = await fetch('/api/password/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setShowOTP(true);
        toast.success('Confirmation code sent to your email');
      } else {
        toast.error(data.error || 'Failed to send confirmation code');
      }
    } catch (error: any) {
      console.error('Password update request error:', error);
      toast.error('Failed to send confirmation code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Verify code and update password via API route
      const response = await fetch('/api/password/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password updated successfully!');
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setCode('');
        setShowOTP(false);
      } else {
        if (data.error?.includes('incorrect')) {
          toast.error('Invalid confirmation code or current password');
        } else if (data.error?.includes('compromised')) {
          toast.error('This password has been compromised. Please choose a different one.');
        } else {
          toast.error(data.error || 'Failed to update password');
        }
      }
    } catch (error: any) {
      console.error('Password verification error:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowOTP(false);
    setCode('');
  };

  return (
    <div className="rounded-2xl p-8 bg-card border relative">
      {/* Back button - only shown when OTP is visible */}
      {showOTP && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleBack}
          disabled={isLoading}
          className="absolute top-6 right-6"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <KeyRound className="h-5 w-5 text-primary" />
        <h5 className="text-sm md:text-xl font-semibold text-foreground">
          Reset Password
        </h5>
      </div>

      {!showOTP ? (
        <form onSubmit={handleRequestCode} className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !currentPassword.trim() || !newPassword.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Code...
              </>
            ) : (
              'Request Confirmation Code'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndUpdate} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              We sent an email to <span className="font-medium text-foreground">{userEmail}</span> containing your one-time confirmation passcode
            </p>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-3 text-center">
                Enter Confirmation Code
              </label>
              <InputOTP
                length={6}
                value={code}
                onChange={setCode}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify & Update Password'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
