'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CheckoutHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();
  const [retryCount, setRetryCount] = useState(0);
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
        // Create checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId,
            billingPeriod,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          
          // If user not found and we haven't retried too many times, retry after delay
          if (error.error === 'User not found in database' && retryCount < 5) {
            console.log(`User not found, retrying in 1 second... (attempt ${retryCount + 1}/5)`);
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              handleCheckout();
            }, 1000);
            return;
          }
          
          throw new Error(error.error || 'Failed to create checkout session');
        }

        const { url } = await response.json();

        // Redirect to Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error('Checkout error:', error);
        setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        
        // After max retries or other errors, redirect to dashboard after showing error
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    };

    handleCheckout();
  }, [isLoaded, isSignedIn, searchParams, router, retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        {errorMessage ? (
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
              {retryCount > 0 
                ? `Setting up your account... (${retryCount}/5)` 
                : 'Preparing your checkout...'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
