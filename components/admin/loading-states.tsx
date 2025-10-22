'use client';

import { Loader2, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Loading State Components
 * 
 * Consistent loading indicators and states for the admin interface.
 * Provides various loading states with proper accessibility and user feedback.
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingCard({ 
  title = 'Loading...', 
  description,
  size = 'md',
  className 
}: LoadingCardProps) {
  const heightClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96',
  };

  return (
    <div className={cn(
      'flex items-center justify-center border rounded-lg',
      heightClasses[size],
      className
    )}>
      <div className="text-center space-y-3">
        <LoadingSpinner size={size} className="mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorCardProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function ErrorCard({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content.',
  error,
  onRetry,
  onGoHome,
  showDetails = false,
  className,
}: ErrorCardProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={cn(
      'flex items-center justify-center h-64 border rounded-lg',
      className
    )}>
      <div className="text-center space-y-4 max-w-md px-4">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Error details in development */}
        {showDetails && errorMessage && process.env.NODE_ENV === 'development' && (
          <div className="text-left bg-muted p-3 rounded text-xs">
            <p className="font-medium mb-1">Error Details:</p>
            <p className="text-muted-foreground break-words">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome} size="sm">
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex items-center justify-center h-64 rounded-2xl p-8 bg-card border',
      className
    )}>
      <div className="text-center space-y-4 max-w-md">
        {icon && (
          <div className="mx-auto text-muted-foreground">
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          <h5 className="text-base md:text-xl font-normal text-foreground">{title}</h5>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {action && (
          <Button 
            onClick={action.onClick} 
            variant="outline" 
            size="sm"
            className="border-2 border-foreground text-foreground shadow-none hover:bg-foreground hover:text-background"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

interface NetworkStatusProps {
  isOnline: boolean;
  onRetry?: () => void;
  className?: string;
}

export function NetworkStatus({ isOnline, onRetry, className }: NetworkStatusProps) {
  if (isOnline) {
    return null;
  }

  return (
    <div className={cn(
      'bg-destructive/10 border border-destructive/20 rounded-lg p-4',
      className
    )}>
      <div className="flex items-center gap-3">
        <WifiOff className="h-5 w-5 text-destructive flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-destructive">
            No internet connection
          </p>
          <p className="text-xs text-destructive/80">
            Please check your network connection and try again.
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

interface OperationStatusProps {
  isLoading: boolean;
  error?: Error | string | null;
  success?: boolean;
  loadingText?: string;
  errorText?: string;
  successText?: string;
  onRetry?: () => void;
  className?: string;
}

export function OperationStatus({
  isLoading,
  error,
  success,
  loadingText = 'Processing...',
  errorText,
  successText,
  onRetry,
  className,
}: OperationStatusProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <LoadingSpinner size="sm" />
        <span className="text-muted-foreground">{loadingText}</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        <span className="text-destructive flex-1">
          {errorText || errorMessage || 'Operation failed'}
        </span>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  if (success && successText) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <span className="text-green-600">{successText}</span>
      </div>
    );
  }

  return null;
}

/**
 * Skeleton loading components for content placeholders
 */
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn(
      'animate-pulse rounded-md bg-muted',
      className
    )} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-b-0 p-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccordionSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="border rounded-lg">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="border-b last:border-b-0 p-4">
          <div className="flex gap-3 items-center">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}