'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { getPlanById, SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { formatExpiryDate } from '@/lib/subscription-helpers';
import { useState } from 'react';
import Image from 'next/image';

export default function BillingPage() {
  const { isSignedIn, user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Fetch user subscription data from Convex
  const userSubscription = useQuery(
    (api as any).users?.getUserByClerkId,
    isSignedIn && user?.id ? { clerkId: user.id } : "skip"
  );

  // Loading state while fetching data
  const isLoading = isSignedIn && userSubscription === undefined;

  // Get current plan details
  const currentPlanId = userSubscription?.subscriptionPlanId || 'free';
  const currentPlan = getPlanById(currentPlanId);
  const isFree = currentPlanId === 'free';

  // Format expiry date
  const expiryText = isFree
    ? 'No expiry date'
    : userSubscription?.currentPeriodEnd
      ? formatExpiryDate(userSubscription.currentPeriodEnd, userSubscription.autoRenew)
      : 'No expiry date';

  // Handle manage subscription button click
  const handleManageSubscription = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create portal session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      alert(error instanceof Error ? error.message : 'Failed to open subscription portal. Please try again.');
      setIsProcessing(false);
    }
  };

  // Handle upgrade to Pro
  const handleUpgrade = async (planId: string, billingPeriod: 'monthly' | 'annual') => {
    setIsUpgrading(true);

    try {
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
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout. Please try again.');
      setIsUpgrading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
        Billing
      </h1>
      <p className="text-muted-foreground mb-6">
        Manage your subscriptions here.
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-8 bg-card border animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="rounded-2xl p-8 bg-card border animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && currentPlan && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Current Plan Status */}
            <div className="rounded-2xl p-8 bg-card border">
              <div className="flex gap-6 items-center">
                {/* Left side: Text content */}
                <div className="flex-1">
                  {/* Pill Badge */}
                  <div
                    className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white mb-4"
                    style={{
                      background: isFree
                        ? 'oklch(0.391 0.09 240.876)' // Light gray for free
                        : 'oklch(0.5 0.134 242.749)'  // Primary blue for paid
                    }}
                  >
                    Current Plan
                  </div>

                  {/* Plan Name */}
                  <h2 className="text-2xl font-bold mb-2 text-foreground">
                    {currentPlan.membershipHeading}
                  </h2>

                  {/* Expiry Date */}
                  <p className="text-sm text-muted-foreground">
                    {expiryText}
                  </p>
                </div>

                {/* Right side: Dashboard Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={currentPlan.dashboardImage}
                    alt={`${currentPlan.name} dashboard`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Subscription Management */}
            <div className="rounded-2xl p-8 bg-card border">
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                Manage Your Subscription
              </h2>

              <p className="text-sm text-muted-foreground mb-6">
                Update payment methods, view invoices, or cancel your subscription.
              </p>

              <Button
                onClick={handleManageSubscription}
                className="w-full text-white"
                disabled={isProcessing || isFree}
              >
                {isProcessing ? 'Loading...' : 'Manage subscription'}
              </Button>
            </div>
          </div>

          {/* Card 3: Upgrade to Pro (Only for free users) */}
          {isFree && (() => {
            const proPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === 'pro');
            if (!proPlan) return null;

            return (
              <div
                className="rounded-2xl p-8 mt-6 text-white"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.5 0.134 242.749) 0%, #262626 100%)'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Upgrade to {proPlan.name}
                    </h2>
                    <p className="text-white/80 mb-4">
                      {proPlan.description}
                    </p>
                    <ul className="space-y-2">
                      {proPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-white/60">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-4">
                    <div className="text-right">
                      <div className="text-4xl font-bold">
                        ${proPlan.monthlyPrice}
                        <span className="text-lg font-normal text-white/80">/mo</span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        or ${proPlan.annualPrice}/year
                      </div>
                    </div>
                    <Button
                      className="bg-white text-black hover:bg-white/90"
                      onClick={() => handleUpgrade('pro', 'monthly')}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? 'Loading...' : 'Upgrade Now'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}