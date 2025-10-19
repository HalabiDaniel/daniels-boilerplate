'use client';

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
      className="rounded-2xl p-6 bg-card border transition-all duration-300 flex flex-col items-center text-center"
      style={{
        backgroundColor: isHovered ? 'oklch(0.5 0.134 242.749)' : undefined
      }}
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
        className={`text-xl font-semibold transition-colors duration-300 ${
          isHovered ? 'text-white' : 'text-foreground'
        }`}
      >
        {memberName}
      </h3>

      {/* Position */}
      <p
        className={`text-sm transition-colors duration-300 mt-1 ${
          isHovered ? 'text-white' : 'text-muted-foreground'
        }`}
      >
        {memberPosition}
      </p>

      {/* Email Button */}
      <a href={memberEmail} className="w-full mt-5">
        <Button
          className="w-full transition-colors duration-300"
          style={{
            backgroundColor: isHovered ? '#262626' : undefined,
            color: 'white'
          }}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email Me
        </Button>
      </a>
    </div>
  );
}
