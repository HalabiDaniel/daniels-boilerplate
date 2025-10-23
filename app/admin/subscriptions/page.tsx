'use client';

import { useState, useRef, useEffect } from 'react';
import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';
import { ErrorBoundary } from '@/components/admin/error-boundary';
import { SummaryCards } from '@/components/admin/summary-cards';
import { SubscriptionDataTable, SubscriptionDisplayData } from '@/components/admin/subscription-data-table';
import { SubscriptionAccordionList } from '@/components/admin/subscription-accordion-list';

import { SortButtonCompact } from '@/components/admin/sort-button';
import {
  ErrorCard,
  EmptyState,
  NetworkStatus,
  TableSkeleton,
  AccordionSkeleton
} from '@/components/admin/loading-states';
import { useIsDesktop } from '@/lib/responsive-utils';
import { useAdminSubscriptions } from '@/lib/hooks/use-admin-subscriptions';
import {
  getUserFriendlyErrorMessage
} from '@/lib/error-handling';
import { useScreenReaderAnnouncement, useAccessibilityPreferences } from '@/lib/accessibility-utils';
import { useKeyboardNavigation } from '@/lib/keyboard-navigation';

export default function AdminSubscriptionsPage() {
  const isDesktop = useIsDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const announce = useScreenReaderAnnouncement();
  const { prefersHighContrast } = useAccessibilityPreferences();

  // Use the custom hook for subscription management with enhanced error handling
  const {
    filteredSubscriptions,
    analytics: analyticsData,
    sort,
    setSort,
    isLoading,
    error,
    networkStatus,
    refreshData,
    retryLoad,
    canRetry,
  } = useAdminSubscriptions();

  // Set up keyboard navigation for the subscription list
  useKeyboardNavigation(
    containerRef as React.RefObject<HTMLElement>,
    isDesktop ? 'tbody tr' : '[role="button"][aria-expanded]',
    {
      orientation: 'vertical',
      loop: true,
    }
  );

  // Announce changes to screen readers
  useEffect(() => {
    if (filteredSubscriptions && !isLoading && !error) {
      const count = filteredSubscriptions.length;
      announce(`${count} subscription${count !== 1 ? 's' : ''} found`);
    }
  }, [filteredSubscriptions, isLoading, error, announce]);



  const handleRetry = () => {
    if (canRetry) {
      retryLoad();
    } else {
      refreshData();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/admin';
  };



  // Default analytics values
  const analytics = analyticsData || {
    totalPayingUsers: 0,
    totalMRR: 0,
    totalRefunds: 0,
    expectedARR: 0,
  };

  return (
    <AccessControlWrapper requiredPage="/admin/subscriptions">
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Admin Subscriptions Page Error:', error, errorInfo);
        }}
        showDetails={process.env.NODE_ENV === 'development'}
      >
        <div
          ref={containerRef}
          className={prefersHighContrast ? 'high-contrast-mode' : ''}
        >
          {/* Page Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1
                  id="page-title"
                  className="text-3xl font-semibold mb-2"
                  style={{ letterSpacing: '-1px' }}
                >
                  Subscriptions
                </h1>
                <p className="text-muted-foreground" id="page-description">
                  Manage subscription accounts and billing
                </p>
              </div>
            </div>

            {/* Sort Controls - Mobile/Tablet - Below title */}
            {!isLoading && !error && !isDesktop && (
              <div className="flex items-center gap-2 mt-4" role="toolbar" aria-label="Subscription management controls">
                <SortButtonCompact
                  sort={sort}
                  onSortChange={setSort}
                  aria-label="Sort subscriptions by different criteria"
                />
              </div>
            )}
          </header>

          {/* Network Status Warning */}
          <NetworkStatus
            isOnline={networkStatus.isOnline}
            onRetry={handleRetry}
            className="mb-6"
          />

          {/* Summary Cards Section */}
          <SummaryCards
            totalPayingUsers={analytics.totalPayingUsers}
            totalMRR={analytics.totalMRR}
            totalRefunds={analytics.totalRefunds}
            expectedARR={analytics.expectedARR}
            isLoading={isLoading || analyticsData === undefined}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {/* Show appropriate skeleton based on screen size */}
              {isDesktop ? (
                <TableSkeleton rows={8} />
              ) : (
                <AccordionSkeleton items={6} />
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorCard
              title="Failed to load subscriptions"
              description={getUserFriendlyErrorMessage(error)}
              error={error}
              onRetry={canRetry ? handleRetry : undefined}
              onGoHome={handleGoHome}
              showDetails={process.env.NODE_ENV === 'development'}
            />
          )}



          {/* Success State - Subscriptions Loaded */}
          {!isLoading && !error && filteredSubscriptions && filteredSubscriptions.length > 0 && (
            <main id="main-content" className="space-y-4">
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''} found
              </div>

              {/* Desktop Table View - Hidden on mobile/tablet */}
              {isDesktop && (
                <SubscriptionDataTable
                  subscriptions={filteredSubscriptions}
                  sort={sort}
                  onSortChange={setSort}
                  aria-label={`Subscription management table with ${filteredSubscriptions.length} subscriptions`}
                />
              )}

              {/* Mobile/Tablet Accordion View - Hidden on desktop */}
              {!isDesktop && (
                <SubscriptionAccordionList
                  subscriptions={filteredSubscriptions}
                  aria-label={`Subscription management list with ${filteredSubscriptions.length} subscriptions`}
                />
              )}
            </main>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredSubscriptions && filteredSubscriptions.length === 0 && (
            <main id="main-content" role="main">
              <div className="sr-only" aria-live="polite">
                No subscriptions found
              </div>
              <EmptyState
                title="No subscriptions found."
                aria-label="Empty state: no subscriptions to display"
              />
            </main>
          )}

        </div>
      </ErrorBoundary>
    </AccessControlWrapper>
  );
}
