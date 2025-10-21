'use client';

import { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SORT_OPTIONS } from '@/lib/user-management-utils';
import { SortState } from '@/lib/hooks/use-admin-users';
import { cn } from '@/lib/utils';

interface SortButtonProps {
  /**
   * Current sort state
   */
  sort: SortState;
  
  /**
   * Callback when sort changes
   */
  onSortChange: (sort: SortState) => void;
  
  /**
   * Whether the sort is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom className for styling
   */
  className?: string;
  
  /**
   * Accessible label for the sort button
   */
  'aria-label'?: string;
}

/**
 * SortButton Component
 * 
 * Provides a dropdown for sorting options with direction indicators.
 * Supports both desktop and mobile layouts with consistent styling.
 */
export function SortButton({
  sort,
  onSortChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SortButtonProps) {
  const [open, setOpen] = useState(false);
  
  const currentSortOption = SORT_OPTIONS.find(option => option.field === sort.field);
  const currentLabel = currentSortOption?.label || 'Name';
  
  const handleSortChange = (field: string) => {
    const sortOption = SORT_OPTIONS.find(option => option.field === field);
    const defaultDirection = sortOption?.defaultDirection || 'asc';
    
    if (sort.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new field with default direction
      onSortChange({
        field,
        direction: defaultDirection,
      });
    }
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
    }
  };

  const sortDirection = sort.direction === 'asc' ? 'ascending' : 'descending';

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between min-w-[140px] focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
          aria-label={ariaLabel || `Sort users by ${currentLabel}, currently ${sortDirection}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            <span>Sort: {currentLabel}</span>
          </div>
          {sort.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4 opacity-50" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px]"
        role="menu"
        aria-label="Sort options"
      >
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.field}
            onClick={() => handleSortChange(option.field)}
            className="flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
            role="menuitem"
            aria-label={`Sort by ${option.label}${sort.field === option.field ? `, currently ${sortDirection}` : ''}`}
          >
            <span>{option.label}</span>
            {sort.field === option.field && (
              sort.direction === 'asc' ? (
                <ChevronUp className="h-4 w-4" aria-label="Ascending" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-label="Descending" />
              )
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Compact version of the sort button for mobile layouts
 */
export function SortButtonCompact({
  sort,
  onSortChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SortButtonProps) {
  const [open, setOpen] = useState(false);
  
  const currentSortOption = SORT_OPTIONS.find(option => option.field === sort.field);
  const currentLabel = currentSortOption?.label || 'Name';
  
  const handleSortChange = (field: string) => {
    const sortOption = SORT_OPTIONS.find(option => option.field === field);
    const defaultDirection = sortOption?.defaultDirection || 'asc';
    
    if (sort.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new field with default direction
      onSortChange({
        field,
        direction: defaultDirection,
      });
    }
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
    }
  };

  const sortDirection = sort.direction === 'asc' ? 'ascending' : 'descending';

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
          aria-label={ariaLabel || `Sort users by ${currentLabel}, currently ${sortDirection}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
            <span className="text-sm">Sort</span>
          </div>
          {sort.direction === 'asc' ? (
            <ChevronUp className="h-3 w-3 opacity-50" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="min-w-[160px]"
        role="menu"
        aria-label="Sort options"
      >
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.field}
            onClick={() => handleSortChange(option.field)}
            className="flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
            role="menuitem"
            aria-label={`Sort by ${option.label}${sort.field === option.field ? `, currently ${sortDirection}` : ''}`}
          >
            <span className="text-sm">{option.label}</span>
            {sort.field === option.field && (
              sort.direction === 'asc' ? (
                <ChevronUp className="h-3 w-3" aria-label="Ascending" />
              ) : (
                <ChevronDown className="h-3 w-3" aria-label="Descending" />
              )
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}