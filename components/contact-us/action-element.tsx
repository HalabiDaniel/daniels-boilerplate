'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ActionElementProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export default function ActionElement({ icon: Icon, title, description, href }: ActionElementProps) {
  return (
    <Link href={href} className="block group [&:hover_.icon-container]:!bg-[oklch(0.5_0.134_242.749)]">
      <div className="flex items-start gap-4 transition-all duration-300">
        {/* Icon Container */}
        <div
          className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
          }}
        >
          <Icon 
            className="w-8 h-8 text-[#262626] dark:text-white transition-colors duration-300 group-hover:text-white" 
            strokeWidth={1} 
          />
        </div>

        {/* Text Content */}
        <div className="space-y-2 flex-1">
          <h4 className="font-semibold text-sm text-[oklch(0.145_0_0)] dark:text-white transition-colors duration-300 group-hover:text-[oklch(0.5_0.134_242.749)]">
            {title}
          </h4>
          <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-[#404040] dark:text-white/90">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
