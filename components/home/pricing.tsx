'use client';

import { useState } from 'react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';
import { Lock } from 'lucide-react';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { HighlightedText } from '@/components/daniels-elements/elements/highlighted-text';
import { Carousel } from '@/components/ui/carousel';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { isSignedIn, user } = useUser();
    const router = useRouter();

    // Fetch user subscription data from Convex
    const userSubscription = useQuery(
        (api as any).users?.getUserByClerkId,
        isSignedIn && user?.id ? { clerkId: user.id } : "skip"
    );

    // Loading state while fetching data
    const isLoadingSubscription = isSignedIn && userSubscription === undefined;

    // Helper function to get plan index
    const getPlanIndex = (planId: string) => {
        return SUBSCRIPTION_PLANS.findIndex(p => p.id === planId);
    };

    // Get current user's plan index
    const currentPlanId = userSubscription?.subscriptionPlanId || 'free';
    const currentPlanIndex = getPlanIndex(currentPlanId);

    // Helper function to determine button text and action
    const getButtonConfig = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
        if (!isSignedIn) {
            return { text: 'Get Started', action: 'signup' };
        }

        const cardPlanIndex = getPlanIndex(plan.id);

        if (cardPlanIndex <= currentPlanIndex) {
            return { text: 'Go to Dashboard', action: 'dashboard' };
        } else {
            return { text: `Upgrade to ${plan.name}`, action: 'upgrade' };
        }
    };

    const handleDashboardRedirect = () => {
        router.push('/dashboard');
    };

    // Handle upgrade button click
    const handleUpgrade = async (planId: string) => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId,
                    billingPeriod: isAnnual ? 'annual' : 'monthly',
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
            setIsProcessing(false);
        }
    };

    return (
        <section id="pricing" className="w-full py-16 md:py-20 bg-background scroll-mt-20">
            <div className="container mx-auto px-8 md:px-12 lg:px-4 max-w-[1200px]">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    {/* Pill */}
                    <PillBadge text="Pricing" />

                    {/* Heading */}
                    <h2
                        className="font-semibold text-3xl md:text-[42px] md:leading-[50px]"
                        style={{
                            letterSpacing: '-1px'
                        }}
                    >
                        Choose the <HighlightedText>perfect plan</HighlightedText> for you
                    </h2>

                    {/* Text */}
                    <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-muted-foreground max-w-[600px]">
                        Whoa, calm down! You saw the pricing section and thought this template might cost money? Relax, it is 100% free. I just added this section to make your life easier… not to scare you!
                    </p>
                </div>

                {/* Monthly/Annual Toggle */}
                <div className="flex justify-center items-center gap-4 mb-12">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-14 h-7 rounded-full transition-colors"
                        style={{
                            backgroundColor: isAnnual ? 'oklch(0.5 0.134 242.749)' : 'oklch(0.391 0.09 240.876)'
                        }}
                    >
                        <div
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Annual
                        <span className="ml-1 text-xs" style={{ color: 'oklch(0.5 0.134 242.749)' }}>
                            (Save 25%)
                        </span>
                    </span>
                </div>

                {/* Pricing Cards - Desktop Grid */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SUBSCRIPTION_PLANS.map((plan) => {
                        const isLocked = plan.locked || false;
                        const isFree = plan.monthlyPrice === 0;
                        
                        return (
                            <div
                                key={plan.id}
                                className={`rounded-2xl p-8 bg-card border ${plan.featured ? 'scale-105' : ''} ${isLocked ? 'opacity-60' : ''} relative flex flex-col`}
                            >
                                {isLocked && (
                                    <div className="absolute top-4 right-4">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}

                                {plan.featured && !isLocked && (
                                    <div
                                        className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold mb-4"
                                        style={{
                                            background: 'oklch(0.5 0.134 242.749)'
                                        }}
                                    >
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2 text-foreground">
                                    {plan.name}
                                </h3>
                                <p className="text-sm mb-6 text-muted-foreground">
                                    {plan.description}
                                </p>

                                <div className="mb-8">
                                    {isFree ? (
                                        <span className="text-4xl font-bold text-foreground">Free</span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold text-foreground">
                                                ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                /{isAnnual ? 'year' : 'month'}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-2">
                                            <svg
                                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                                style={{ color: 'oklch(0.5 0.134 242.749)' }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm text-muted-foreground">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {(() => {
                                    if (isLocked) {
                                        return (
                                            <Button
                                                className="w-full"
                                                disabled
                                            >
                                                Coming Soon
                                            </Button>
                                        );
                                    }

                                    const buttonConfig = getButtonConfig(plan);

                                    if (buttonConfig.action === 'signup') {
                                        // For free plan, redirect to dashboard
                                        if (isFree) {
                                            return (
                                                <SignUpButton 
                                                    mode="modal" 
                                                    forceRedirectUrl="/dashboard"
                                                >
                                                    <Button className="w-full">
                                                        {buttonConfig.text}
                                                    </Button>
                                                </SignUpButton>
                                            );
                                        }
                                        
                                        // For paid plans, redirect to checkout handler with plan info
                                        const checkoutUrl = `/checkout-handler?planId=${plan.id}&billingPeriod=${isAnnual ? 'annual' : 'monthly'}`;
                                        return (
                                            <SignUpButton 
                                                mode="modal" 
                                                forceRedirectUrl={checkoutUrl}
                                            >
                                                <Button className="w-full">
                                                    {buttonConfig.text}
                                                </Button>
                                            </SignUpButton>
                                        );
                                    }

                                    if (buttonConfig.action === 'dashboard') {
                                        return (
                                            <Button
                                                onClick={handleDashboardRedirect}
                                                className="w-full"
                                                disabled={isLoadingSubscription || isProcessing}
                                            >
                                                {buttonConfig.text}
                                            </Button>
                                        );
                                    }

                                    // buttonConfig.action === 'upgrade'
                                    return (
                                        <Button
                                            onClick={() => handleUpgrade(plan.id)}
                                            className="w-full"
                                            disabled={isLoadingSubscription || isProcessing}
                                        >
                                            {buttonConfig.text}
                                        </Button>
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>

                {/* Pricing Cards - Mobile/Tablet Carousel */}
                <div className="lg:hidden">
                    <Carousel
                        slidesPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                        gap={32}
                        showDots={true}
                    >
                        {SUBSCRIPTION_PLANS.map((plan) => {
                            const isLocked = plan.locked || false;
                            const isFree = plan.monthlyPrice === 0;
                            
                            return (
                            <div
                                key={plan.id}
                                className={`rounded-2xl p-8 bg-card border ${plan.featured ? 'lg:scale-105' : ''} ${isLocked ? 'opacity-60' : ''} relative flex flex-col`}
                            >
                                    {isLocked && (
                                        <div className="absolute top-4 right-4">
                                            <Lock className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}

                                    {plan.featured && !isLocked && (
                                        <div
                                            className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold mb-4"
                                            style={{
                                                background: 'oklch(0.5 0.134 242.749)'
                                            }}
                                        >
                                            Most Popular
                                        </div>
                                    )}

                                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm mb-6 text-muted-foreground">
                                        {plan.description}
                                    </p>

                                    <div className="mb-8">
                                        {isFree ? (
                                            <span className="text-4xl font-bold text-foreground">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-foreground">
                                                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    /{isAnnual ? 'year' : 'month'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start gap-2">
                                                <svg
                                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                                    style={{ color: 'oklch(0.5 0.134 242.749)' }}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-muted-foreground">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {(() => {
                                        if (isLocked) {
                                            return (
                                                <Button
                                                    className="w-full"
                                                    disabled
                                                >
                                                    Coming Soon
                                                </Button>
                                            );
                                        }

                                        const buttonConfig = getButtonConfig(plan);

                                        if (buttonConfig.action === 'signup') {
                                            // For free plan, redirect to dashboard
                                            if (isFree) {
                                                return (
                                                    <SignUpButton 
                                                        mode="modal" 
                                                        forceRedirectUrl="/dashboard"
                                                    >
                                                        <Button className="w-full">
                                                            {buttonConfig.text}
                                                        </Button>
                                                    </SignUpButton>
                                                );
                                            }
                                            
                                            // For paid plans, redirect to checkout handler with plan info
                                            const checkoutUrl = `/checkout-handler?planId=${plan.id}&billingPeriod=${isAnnual ? 'annual' : 'monthly'}`;
                                            return (
                                                <SignUpButton 
                                                    mode="modal" 
                                                    forceRedirectUrl={checkoutUrl}
                                                >
                                                    <Button className="w-full">
                                                        {buttonConfig.text}
                                                    </Button>
                                                </SignUpButton>
                                            );
                                        }

                                        if (buttonConfig.action === 'dashboard') {
                                            return (
                                                <Button
                                                    onClick={handleDashboardRedirect}
                                                    className="w-full"
                                                    disabled={isLoadingSubscription || isProcessing}
                                                >
                                                    {buttonConfig.text}
                                                </Button>
                                            );
                                        }

                                        // buttonConfig.action === 'upgrade'
                                        return (
                                            <Button
                                                onClick={() => handleUpgrade(plan.id)}
                                                className="w-full"
                                                disabled={isLoadingSubscription || isProcessing}
                                            >
                                                {buttonConfig.text}
                                            </Button>
                                        );
                                    })()}
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
