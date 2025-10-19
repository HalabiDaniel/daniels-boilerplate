'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail, Rocket } from 'lucide-react';

// Code templates for each specialized component

export const TEAM_MEMBER_CARD_CODE = `'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface TeamMemberProps {
  profilePicture: string;
  memberName: string;
  memberPosition: string;
  memberEmail: string;
}

export default function TeamMember({
  profilePicture,
  memberName,
  memberPosition,
  memberEmail
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={\`rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center text-center \${
        isHovered ? 'bg-primary' : 'bg-card'
      }\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Picture */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-5">
        <Image
          src={profilePicture}
          alt={memberName}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <h3
        className={\`text-xl font-semibold transition-colors duration-300 \${
          isHovered ? 'text-primary-foreground' : 'text-foreground'
        }\`}
      >
        {memberName}
      </h3>

      {/* Position */}
      <p
        className={\`text-sm transition-colors duration-300 mt-1 \${
          isHovered ? 'text-primary-foreground' : 'text-muted-foreground'
        }\`}
      >
        {memberPosition}
      </p>

      {/* Email Button */}
      <a href={memberEmail} className="w-full mt-5">
        <Button
          className="w-full text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground transition-colors duration-300"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Me
        </Button>
      </a>
    </div>
  );
}`;

export const INFO_ELEMENT_CODE = `import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoElementProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function InfoElement({ icon: Icon, title, description }: InfoElementProps) {
  return (
    <div className="space-y-3">
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary-alpha-10">
        <Icon className="w-8 h-8 text-foreground" strokeWidth={1} />
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm text-foreground">
        {title}
      </h4>

      {/* Description */}
      <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-muted-foreground dark:text-foreground">
        {description}
      </p>
    </div>
  );
}`;

export const NUMBER_COUNTER_CODE = `export default function NumberCounter({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center rounded-2xl p-6 bg-primary-alpha-75 dark:bg-card">
      <div
        className="font-bold text-4xl md:text-[56px] md:leading-[64px] mb-2 text-primary"
        style={{
          letterSpacing: '-1.5px'
        }}
      >
        {number}<span className="text-2xl md:text-3xl relative top-[-0.35em]">+</span>
      </div>
      <div className="text-sm md:text-[15px] text-foreground/80">
        {label}
      </div>
    </div>
  );
}`;

export const MEMBERSHIP_CARD_CODE = `import Image from 'next/image';

interface MembershipCardProps {
  planName: string;
  expiryText: string;
  dashboardImage: string;
}

export default function MembershipCard({ planName, expiryText, dashboardImage }: MembershipCardProps) {
  return (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <Image
          src={dashboardImage}
          alt="Membership"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{planName}</p>
          <p className="text-xs text-muted-foreground">{expiryText}</p>
        </div>
      </div>
    </div>
  );
}`;

export const USER_INITIALS_AVATAR_CODE = `export default function UserInitialsAvatar({ initials }: { initials: string }) {
  return (
    <div className="h-8 w-8 rounded flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0 bg-primary">
      {initials}
    </div>
  );
}`;

// Component showcases

export function TeamMemberCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-xs mx-auto">
      <div
        className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col items-center text-center ${
          isHovered ? 'bg-primary' : 'bg-card'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Profile Picture */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-5">
          <Image
            src="https://res.cloudinary.com/dbactyzwl/image/upload/v1760809701/team2_lin0lq.webp"
            alt="John Doe"
            fill
            className="object-cover"
          />
        </div>

        {/* Name */}
        <h3
          className={`text-xl font-semibold transition-colors duration-300 ${
            isHovered ? 'text-primary-foreground' : 'text-foreground'
          }`}
        >
          John Doe
        </h3>

        {/* Position */}
        <p
          className={`text-sm transition-colors duration-300 mt-1 ${
            isHovered ? 'text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Founder and CEO
        </p>

        {/* Email Button */}
        <a href="mailto:john@example.com" className="w-full mt-5">
          <Button
            className="w-full text-primary-foreground hover:bg-foreground hover:text-muted dark:hover:bg-background dark:hover:text-foreground transition-colors duration-300"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Me
          </Button>
        </a>
      </div>
    </div>
  );
}

export function InfoElement() {
  return (
    <div className="max-w-xs">
      <div className="space-y-3">
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-primary-alpha-10">
          <Rocket className="w-8 h-8 text-foreground" strokeWidth={1} />
        </div>

        {/* Title */}
        <h4 className="font-semibold text-sm text-foreground">
          Fast Development
        </h4>

        {/* Description */}
        <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-muted-foreground dark:text-foreground">
          Build and ship your projects faster with pre-configured components and integrations.
        </p>
      </div>
    </div>
  );
}

export function NumberCounter() {
  return (
    <div className="max-w-xs mx-auto">
      <div className="text-center rounded-2xl p-6 bg-primary-alpha-75 dark:bg-card">
        <div
          className="font-bold text-4xl md:text-[56px] md:leading-[64px] mb-2 text-primary"
          style={{
            letterSpacing: '-1.5px'
          }}
        >
          75<span className="text-2xl md:text-3xl relative top-[-0.35em]">+</span>
        </div>
        <div className="text-sm md:text-[15px] text-foreground/80">
          Custom Components
        </div>
      </div>
    </div>
  );
}

export function MembershipCard() {
  return (
    <div className="max-w-xs mx-auto">
      <div className="border rounded-lg p-3 bg-card">
        <div className="flex items-center gap-3">
          <Image
            src="/dashboard-free.png"
            alt="Membership"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">Free Plan</p>
            <p className="text-xs text-muted-foreground">No expiry</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserInitialsAvatar() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-8 w-8 rounded flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0 bg-primary">
        JD
      </div>
      <div className="h-12 w-12 rounded flex items-center justify-center text-primary-foreground text-lg font-semibold bg-primary">
        JD
      </div>
      <div className="h-16 w-16 rounded flex items-center justify-center text-primary-foreground text-xl font-semibold bg-primary">
        JD
      </div>
    </div>
  );
}
