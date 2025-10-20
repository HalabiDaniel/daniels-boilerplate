'use client';

import React, { useState } from 'react';
import TeamMember from './team-member';
import { PillBadge } from '@/components/daniels-elements/elements/card-elements';
import { HighlightedText } from '@/components/daniels-elements/elements/highlighted-text';

export default function AboutTeam() {
    const teamMembers = [
        {
            profilePicture: 'https://res.cloudinary.com/dbactyzwl/image/upload/v1760809701/team2_lin0lq.webp',
            memberName: 'John Doe',
            memberPosition: 'Founder and CEO',
            memberEmail: 'mailto:john@example.com'
        },
        {
            profilePicture: 'https://res.cloudinary.com/dbactyzwl/image/upload/v1760809700/team1_nmtzsc.webp',
            memberName: 'Jane Smith',
            memberPosition: 'Chief Technology Officer',
            memberEmail: 'mailto:jane@example.com'
        },
        {
            profilePicture: 'https://res.cloudinary.com/dbactyzwl/image/upload/v1760809700/team4_qlefol.webp',
            memberName: 'Mike Johnson',
            memberPosition: 'Head of Design',
            memberEmail: 'mailto:mike@example.com'
        },
        {
            profilePicture: 'https://res.cloudinary.com/dbactyzwl/image/upload/v1760809701/team3_f9wyvo.webp',
            memberName: 'Sarah Williams',
            memberPosition: 'Lead Developer',
            memberEmail: 'mailto:sarah@example.com'
        }
    ];

    return (
        <section className="w-full bg-[#F4F7F3] dark:bg-neutral-900">
            <div className="container mx-auto px-6 md:px-8 lg:px-4 py-12 md:py-16 space-y-6">
                {/* Pill */}
                <div className="flex justify-center">
                    <PillBadge text="Our Team" />
                </div>

                {/* Heading */}
                <h2
                    className="font-semibold text-3xl md:text-[42px] md:leading-[50px] text-[oklch(0.145_0_0)] dark:text-white text-center"
                    style={{
                        letterSpacing: '-1px'
                    }}
                >
                    Meet the <HighlightedText>talented team</HighlightedText>
                </h2>

                {/* Description */}
                <p className="text-sm md:text-[15px] md:leading-[26px] font-normal text-[#404040] dark:text-white/90 text-center max-w-[600px] mx-auto">
                    Our dedicated team of professionals is committed to delivering exceptional results and innovative solutions for your business.
                </p>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                    {teamMembers.map((member, index) => (
                        <TeamMember
                            key={index}
                            profilePicture={member.profilePicture}
                            memberName={member.memberName}
                            memberPosition={member.memberPosition}
                            memberEmail={member.memberEmail}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
