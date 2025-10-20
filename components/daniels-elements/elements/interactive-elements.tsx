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
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{
        backgroundColor: isEnabled ? 'oklch(0.5 0.134 242.749)' : 'oklch(0.391 0.09 240.876)'
      }}
      role="switch"
      aria-checked={isEnabled}
    >
      <span
        className={\`inline-block h-5 w-5 transform rounded-full bg-white transition-transform \${
          isEnabled ? 'translate-x-8' : 'translate-x-1'
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
    <div className="w-full max-w-2xl border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-primary-alpha-10 cursor-pointer"
      >
        <span className="font-semibold text-foreground">
          What is this accordion component?
        </span>
        <ChevronDown
          className={\`w-5 h-5 text-foreground transition-transform duration-300 \${
            isOpen ? 'rotate-180' : ''
          }\`}
        />
      </button>
      <div
        className={\`overflow-hidden transition-all duration-300 ease-in-out \${
          isOpen ? 'max-h-96' : 'max-h-0'
        }\`}
      >
        <div className="p-4 bg-primary-alpha-10 border-t border-border">
          <p className="text-sm text-foreground">
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
    <Link href={href} className="block group [&:hover_.icon-container]:!bg-primary">
      <div className="flex items-start gap-4 transition-all duration-300">
        {/* Icon Container */}
        <div className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-primary-alpha-10">
          <Icon 
            className="w-8 h-8 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" 
            strokeWidth={1} 
          />
        </div>

        {/* Text Content */}
        <div className="space-y-2 flex-1">
          <h4 className="font-semibold text-sm text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h4>
          <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-muted-foreground dark:text-foreground">
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
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{
        backgroundColor: isEnabled ? 'oklch(0.5 0.134 242.749)' : 'oklch(0.391 0.09 240.876)'
      }}
      role="switch"
      aria-checked={isEnabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          isEnabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-primary-alpha-10 cursor-pointer"
      >
        <span className="font-semibold text-foreground">
          What is this accordion component?
        </span>
        <ChevronDown
          className={`w-5 h-5 text-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-primary-alpha-10 border-t border-border">
          <p className="text-sm text-foreground">
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
      <Link href="#" className="block group [&:hover_.icon-container]:!bg-primary">
        <div className="flex items-start gap-4 transition-all duration-300">
          <div className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-primary-alpha-10">
            <Mail 
              className="w-8 h-8 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" 
              strokeWidth={1} 
            />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold text-sm text-foreground transition-colors duration-300 group-hover:text-primary">
              Email Us
            </h4>
            <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-muted-foreground dark:text-foreground">
              Send us an email and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </Link>

      <Link href="#" className="block group [&:hover_.icon-container]:!bg-primary">
        <div className="flex items-start gap-4 transition-all duration-300">
          <div className="icon-container w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-primary-alpha-10">
            <Phone 
              className="w-8 h-8 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" 
              strokeWidth={1} 
            />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold text-sm text-foreground transition-colors duration-300 group-hover:text-primary">
              Call Us
            </h4>
            <p className="text-xs md:text-[13px] md:leading-[22px] font-normal text-muted-foreground dark:text-foreground">
              Give us a call during business hours for immediate assistance.
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
