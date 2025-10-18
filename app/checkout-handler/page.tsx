'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CheckoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();
  const [status, setStatus] = useState<'syncing' | 'creating-checkout' | 'error'>('syncing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckout = async () => {
      // Wait for Clerk to load
      if (!isLoaded) return;

      // If not signed in, redirect to home
      if (!isSignedIn) {
        router.push('/');
        return;
      }

      // Get plan details from URL
      const planId = searchParams.get('planId');
      const billingPeriod = searchParams.get('billingPeriod') || 'monthly';

      // If no plan specified, redirect to dashboard
      if (!planId) {
        router.push('/dashboard');
        return;
      }

      try {
        // Step 1: Ensure user is synced to Convex database
        setStatus('syncing');
        const syncResponse = await fetch('/api/ensure-user-synced', {
          method: 'POST',
        });

        if (!syncResponse.ok) {
          const error = await syncResponse.json();
          throw new Error(error.error || 'Failed to sync user to database');
        }

        // Step 2: Create checkout session
        setStatus('creating-checkout');
        const checkoutResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            billingPeriod,
          }),
        });

        if (!checkoutResponse.ok) {
          const error = await checkoutResponse.json();
          throw new Error(error.error || 'Failed to create checkout session');
        }

        const { url } = await checkoutResponse.json();

        // Redirect to Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error('Checkout error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        
        // Redirect to dashboard after showing error
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    };

    handleCheckout();
  }, [isLoaded, isSignedIn, searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === 'error' ? (
          <>
            <div className="text-destructive text-lg font-semibold">
              {errorMessage}
            </div>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              {status === 'syncing' 
                ? 'Setting up your account...' 
                : 'Preparing your checkout...'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
