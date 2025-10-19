'use client';

import { CopyButton } from './copy-button';

interface ElementCardProps {
  name: string;
  description: string;
  children: React.ReactNode;
  code: string;
  category?: string;
}

export function ElementCard({
  name,
  description,
  children,
  code,
  category,
}: ElementCardProps) {
  return (
    <div className="w-full rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm transition-colors">
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <CopyButton code={code} elementName={name} />
      </div>
      
      <div className="rounded-md border border-border bg-background p-4 sm:p-6 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
