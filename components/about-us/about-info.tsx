'use client';

import React from 'react';
import Image from 'next/image';
import InfoElement from './info-element';
import { Sheet, Router, ShieldUser, Banknote } from 'lucide-react';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { HighlightedText } from '@/components/daniels-elements/elements/highlighted-text';

export default function AboutInfo() {
    // To change the icons, simply add their component names from https://lucide.dev/ in the import statement above first
    const infoItems = [
        {
            icon: ShieldUser,
            title: 'Authentication Ready',
            description: 'Complete user authentication system with Clerk integration out of the box.'
        },
        {
            icon: Banknote,
            title: 'Subscription Management',
            description: 'Built-in payment processing and subscription handling with Stripe.'
        },
        {
            icon: Sheet,
            title: 'Database Included',
            description: 'Convex database setup with real-time sync and type-safe queries.'
        },
        {
            icon: Router,
            title: 'Production Ready',
            description: 'Deploy immediately with optimized builds and best practices included.'
        }
    ];

    return (
        <section className="w-full bg-white dark:bg-transparent">
            <div className="container mx-auto px-6 md:px-8 lg:px-4 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center">
                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        {/* Pill */}
                        <PillBadge text="Why Choose Us" />

                        {/* Heading */}
                        <h2
                            className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white"
                            style={{
                                letterSpacing: '-1px'
                            }}
                        >
                            Everything you need to <HighlightedText>launch fast</HighlightedText>
                        </h2>

                        {/* Description */}
                        <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90">
                            Skip months of setup and configuration. This boilerplate includes all the essential features you need to build and launch your SaaS application quickly.
                        </p>

                        {/* 2x2 Grid of Info Elements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            {infoItems.map((item, index) => (
                                <InfoElement
                                    key={index}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image */}
                    <div className="relative">
                        {/* Background Layer */}
                        <div
                            className="hidden lg:block absolute inset-0 rounded-2xl"
                            style={{
                                backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)',
                                transform: 'translate(20px, 20px)',
                                zIndex: 0
                            }}
                        />
                        {/* Image */}
                        <div className="relative z-10 rounded-2xl overflow-hidden h-[400px] lg:h-[600px]">
                            <Image
                                src="https://res.cloudinary.com/dbactyzwl/image/upload/v1760818881/Untitled_design_3_gmk9c3.png"
                                alt="Team collaboration"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
