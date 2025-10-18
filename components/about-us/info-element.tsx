import React from 'react';
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
      <div
        className="w-16 h-16 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
        }}
      >
        <Icon className="w-8 h-8 text-[#262626] dark:text-white" strokeWidth={1} />
      </div>

      {/* Title */}
      <h4 className="font-semibold text-sm text-[oklch(0.145_0_0)] dark:text-white">
        {title}
      </h4>

      {/* Description */}
      <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-[#404040] dark:text-white/90">
        {description}
      </p>
    </div>
  );
}
