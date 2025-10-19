'use client';

import { useState } from 'react';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

// Code templates for each interactive element
export const TOGGLE_SWITCH_CODE = `'use client';

import { useState } from 'react';

export default function ToggleSwitchExample() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.134_242.749)] focus:ring-offset-2 \${
        isEnabled ? 'bg-[oklch(0.5_0.134_242.749)]' : 'bg-gray-300 dark:bg-gray-600'
      }\`}
      role="switch"
      aria-checked={isEnabled}
    >
      <span
        className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }\`}
      />
    </button>
  );
}`;

export const ACCORDION_CODE = `'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function AccordionExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-[#262626] hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
      >
        <span className="font-semibold text-[#262626] dark:text-white">
          What is this accordion component?
        </span>
        <ChevronDown
          className={\`w-5 h-5 text-[#262626] dark:text-white transition-transform duration-300 \${
            isOpen ? 'rotate-180' : ''
          }\`}
        />
      </button>
      <div
        className={\`overflow-hidden transition-all duration-300 ease-in-out \${
          isOpen ? 'max-h-96' : 'max-h-0'
        }\`}
      >
        <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-[#404040] dark:text-white/90">
            This is an accordion component that expands and collapses content with a smooth animation.
            It's perfect for FAQs, feature lists, or any content that needs to be progressively disclosed.
          </p>
        </div>
      </div>
    </div>
  );
}`;

export const ACTION_ELEMENT_CODE = `'use client';

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
}`;

// Component showcases
export function ToggleSwitch() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[oklch(0.5_0.134_242.749)] focus:ring-offset-2 ${
        isEnabled ? 'bg-[oklch(0.5_0.134_242.749)]' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      role="switch"
      aria-checked={isEnabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-[#262626] hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
      >
        <span className="font-semibold text-[#262626] dark:text-white">
          What is this accordion component?
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#262626] dark:text-white transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-[#404040] dark:text-white/90">
            This is an accordion component that expands and collapses content with a smooth animation.
            It&apos;s perfect for FAQs, feature lists, or any content that needs to be progressively disclosed.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ActionElementShowcase() {
  return (
    <div className="space-y-4 max-w-md">
      <Link href="#" className="block group [&:hover_.icon-container]:!bg-[oklch(0.5_0.134_242.749)]">
        <div className="flex items-start gap-4 transition-all duration-300">
          <div
            className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
            }}
          >
            <Mail 
              className="w-8 h-8 text-[#262626] dark:text-white transition-colors duration-300 group-hover:text-white" 
              strokeWidth={1} 
            />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold text-sm text-[oklch(0.145_0_0)] dark:text-white transition-colors duration-300 group-hover:text-[oklch(0.5_0.134_242.749)]">
              Email Us
            </h4>
            <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-[#404040] dark:text-white/90">
              Send us an email and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </Link>

      <Link href="#" className="block group [&:hover_.icon-container]:!bg-[oklch(0.5_0.134_242.749)]">
        <div className="flex items-start gap-4 transition-all duration-300">
          <div
            className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              backgroundColor: 'oklch(0.5 0.134 242.749 / 0.1)'
            }}
          >
            <Phone 
              className="w-8 h-8 text-[#262626] dark:text-white transition-colors duration-300 group-hover:text-white" 
              strokeWidth={1} 
            />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold text-sm text-[oklch(0.145_0_0)] dark:text-white transition-colors duration-300 group-hover:text-[oklch(0.5_0.134_242.749)]">
              Call Us
            </h4>
            <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-[#404040] dark:text-white/90">
              Give us a call during business hours for immediate assistance.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
