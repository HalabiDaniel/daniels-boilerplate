/**
 * Subscription Plan Filter Component
 * 
 * Provides filtering controls for the subscription management interface.
 * Filters by subscription plan (which subscription users have).
 */

'use client';

import { useState } from 'react';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterOption } from '@/lib/subscription-management-utils';
import { cn } from '@/lib/utils';

interface SubscriptionPlanFilterProps {
  /**
   * Current filter value
   */
  value: string | null;
  
  /**
   * Available filter options with counts
   */
  options: FilterOption[];
  
  /**
   * Callback when filter value changes
   */
  onValueChange: (value: string | null) => void;
  
  /**
   * Whether the filter is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom className for styling
   */
  className?: string;
  
  /**
   * Accessible label for the filter
   */
  'aria-label'?: string;
}

/**
 * SubscriptionPlanFilter Component
 * 
 * Provides a dropdown filter for subscription plans with subscription counts.
 * Supports both desktop and mobile layouts with consistent styling.
 */
export function SubscriptionPlanFilter({
  value,
  options,
  onValueChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SubscriptionPlanFilterProps) {
  const [open, setOpen] = useState(false);
  
  // Find the current selected option
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  // Handle option selection
  const handleSelect = (optionValue: string | null) => {
    onValueChange(optionValue);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between min-w-[180px] focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
          aria-label={ariaLabel || `Filter subscriptions by plan. Currently showing: ${selectedOption?.label || 'All Subscriptions'}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" aria-hidden="true" />
            <span>{selectedOption?.label || 'All Subscriptions'}</span>
            {selectedOption?.count !== undefined && (
              <span className="text-muted-foreground" aria-label={`${selectedOption.count} subscriptions`}>
                ({selectedOption.count})
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="min-w-[200px]"
        role="menu"
        aria-label="Subscription plan filter options"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value || 'all'}
            onClick={() => handleSelect(option.value)}
            className="flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
            role="menuitem"
            aria-label={`Filter by ${option.label}${option.count !== undefined ? `, ${option.count} subscriptions` : ''}`}
          >
            <div className="flex items-center gap-2">
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className="text-muted-foreground text-sm" aria-hidden="true">
                  ({option.count})
                </span>
              )}
            </div>
            {value === option.value && (
              <Check className="h-4 w-4" aria-label="Currently selected" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Compact version of the subscription plan filter for mobile layouts
 */
export function SubscriptionPlanFilterCompact({
  value,
  options,
  onValueChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SubscriptionPlanFilterProps) {
  const [open, setOpen] = useState(false);
  
  // Find the current selected option for accessibility
  const selectedOption = options.find(option => option.value === value) || options[0];
  
  // Handle option selection
  const handleSelect = (optionValue: string | null) => {
    onValueChange(optionValue);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-between focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
          aria-label={ariaLabel || `Filter subscriptions by plan. Currently: ${selectedOption?.label || 'All Subscriptions'}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3" aria-hidden="true" />
            <span className="text-sm">Filter</span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="min-w-[180px]"
        role="menu"
        aria-label="Subscription plan filter options"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value || 'all'}
            onClick={() => handleSelect(option.value)}
            className="flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
            role="menuitem"
            aria-label={`Filter by ${option.label}${option.count !== undefined ? `, ${option.count} subscriptions` : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-muted-foreground text-xs" aria-hidden="true">
                  ({option.count})
                </span>
              )}
            </div>
            {value === option.value && (
              <Check className="h-3 w-3" aria-label="Currently selected" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
