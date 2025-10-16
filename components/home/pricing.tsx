'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { isSignedIn } = useUser();
    const router = useRouter();

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/dashboard');
        } else {
            router.push('/sign-up');
        }
    };

    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for individuals and small projects with big dreams',
            monthlyPrice: 9,
            annualPrice: 90,
            features: [
                'Up to 5 projects',
                'Basic analytics',
                'Email support',
                '5GB storage',
                'Community access',
                'Community access'
            ]
        },
        {
            name: 'Pro',
            description: 'Best for growing teams and businesses with big plans',
            monthlyPrice: 29,
            annualPrice: 290,
            features: [
                'Unlimited projects',
                'Advanced analytics',
                'Priority support',
                '100GB storage',
                'Team collaboration',
            ],
            featured: true
        },
        {
            name: 'Enterprise',
            description: 'For large organizations with custom needs',
            monthlyPrice: 99,
            annualPrice: 990,
            features: [
                'Everything in Pro',
                'Dedicated support',
                'Custom solutions',
                'Unlimited storage',
                'Advanced security',
                'Community access'
            ]
        }
    ];

    return (
        <section className="w-full py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4 max-w-[1200px]">
                {/* Header Section - Centered */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    {/* Pill */}
                    <div
                        className="inline-block px-3 py-1 rounded-full text-white text-[13px] border-2 border-white"
                        style={{
                            background: 'oklch(0.5 0.134 242.749)'
                        }}
                    >
                        Pricing Plans
                    </div>

                    {/* Heading */}
                    <h2
                        className="font-semibold text-3xl md:text-[42px] md:leading-[50px]"
                        style={{
                            letterSpacing: '-1px'
                        }}
                    >
                        Choose the <span style={{ color: 'oklch(0.5 0.134 242.749)' }}>perfect plan</span> for you
                    </h2>

                    {/* Text */}
                    <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-muted-foreground max-w-[600px]">
                        Start building your dream project today with flexible pricing options that scale with your needs
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

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl p-8 bg-card border ${plan.featured ? 'scale-105' : ''}`}
                        >
                            {plan.featured && (
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
                                <span className="text-4xl font-bold text-foreground">
                                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    /{isAnnual ? 'year' : 'month'}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-8">
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

                            <Button
                                onClick={handleGetStarted}
                                className="w-full text-white"
                            >
                                {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
