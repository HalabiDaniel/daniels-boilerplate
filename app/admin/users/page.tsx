'use client';

import { useState, useRef, useEffect } from 'react';
import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';
import { useIsDesktop } from '@/lib/responsive-utils';
import { UserDataTable } from '@/components/admin/user-data-table';
import { UserAccordionList } from '@/components/admin/user-accordion-list';
import { DeleteUserDialog } from '@/components/admin/delete-user-dialog';
import { SubscriptionFilter, SubscriptionFilterCompact } from '@/components/admin/subscription-filter';
import { SortButtonCompact } from '@/components/admin/sort-button';
import { ErrorBoundary } from '@/components/admin/error-boundary';
import { 
  ErrorCard, 
  EmptyState, 
  NetworkStatus,
  TableSkeleton,
  AccordionSkeleton
} from '@/components/admin/loading-states';
import { useAdminUsers } from '@/lib/hooks/use-admin-users';
import { UserDisplayData } from '@/lib/user-management-utils';
import { 
  enhancedFetch, 
  showErrorToast, 
  showSuccessToast, 
  showWarningToast,
  getUserFriendlyErrorMessage,
  analyzeFetchError
} from '@/lib/error-handling';
import { useScreenReaderAnnouncement, useAccessibilityPreferences } from '@/lib/accessibility-utils';
import { useKeyboardNavigation } from '@/lib/keyboard-navigation';

export default function AdminUsersPage() {
  const isDesktop = useIsDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const announce = useScreenReaderAnnouncement();
  const { prefersHighContrast } = useAccessibilityPreferences();
  
  // Use the custom hook for user management with enhanced error handling
  const {
    filteredUsers,
    filterOptions,
    filter,
    setFilter,
    sort,
    setSort,
    isLoading,
    error,
    networkStatus,
    refreshData,
    retryLoad,
    canRetry,
  } = useAdminUsers();

  // Set up keyboard navigation for the user list
  useKeyboardNavigation(
    containerRef,
    isDesktop ? 'tbody tr' : '[role="button"][aria-expanded]',
    {
      orientation: 'vertical',
      loop: true,
    }
  );

  // Announce changes to screen readers
  useEffect(() => {
    if (filteredUsers && !isLoading && !error) {
      const count = filteredUsers.length;
      const filterText = filter.subscriptionStatus 
        ? ` with ${filterOptions.find(opt => opt.value === filter.subscriptionStatus)?.label || 'selected'} subscription`
        : '';
      
      announce(`${count} user${count !== 1 ? 's' : ''} found${filterText}`);
    }
  }, [filteredUsers, filter.subscriptionStatus, filterOptions, isLoading, error, announce]);

  // State for delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: UserDisplayData | null;
  }>({
    open: false,
    user: null,
  });

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

  const handleDeleteUser = (userToDelete: UserDisplayData) => {
    setDeleteDialog({
      open: true,
      user: userToDelete,
    });
  };

  const handleDeleteConfirm = async (userToDelete: UserDisplayData) => {
    try {
      // Use enhanced fetch with retry logic
      const response = await enhancedFetch('/api/admin/delete-user', {
        method: 'DELETE',
        body: JSON.stringify({
          clerkId: userToDelete.clerkId,
          // Note: Stripe data will be retrieved from Convex during deletion
        }),
      }, {
        maxAttempts: 2, // Limit retries for delete operations
      });

      const result = await response.json();
      
      if (result.success) {
        showSuccessToast(
          'User deleted successfully',
          `${userToDelete.fullName} has been removed from all systems.`
        );
        
        // Refresh the user list
        refreshData();
      } else {
        // Handle partial success cases
        if (result.cleanupResults) {
          const { convex, clerk, stripe } = result.cleanupResults;
          let message = 'User deletion completed with some issues:';
          
          if (!clerk) message += ' Failed to remove from authentication system.';
          if (!stripe && userToDelete.hasStripeData) message += ' Failed to remove from payment system.';
          
          showWarningToast('Partial deletion completed', message);
          
          // Still refresh the data since Convex deletion succeeded
          if (convex) {
            refreshData();
          }
        } else {
          throw new Error(result.error || 'Failed to delete user');
        }
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      
      // Use enhanced error handling
      const enhancedError = error instanceof Error ? 
        analyzeFetchError(error) : 
        new Error('An unexpected error occurred');
      
      showErrorToast(enhancedError, {
        title: 'Failed to delete user',
        showRetry: 'retryable' in enhancedError ? Boolean(enhancedError.retryable) : false,
        onRetry: () => handleDeleteConfirm(userToDelete),
      });
      
      throw error; // Re-throw to let the dialog handle the loading state
    }
  };

  return (
    <AccessControlWrapper requiredPage="/admin/users">
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Admin Users Page Error:', error, errorInfo);
        }}
        showDetails={process.env.NODE_ENV === 'development'}
      >
        {/* Skip to content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>

        <div 
          ref={containerRef}
          className={prefersHighContrast ? 'high-contrast-mode' : ''}
        >
          {/* Page Header */}
          <header className="mb-8">
            <h1 
              id="page-title"
              className="text-3xl font-semibold mb-6" 
              style={{ letterSpacing: '-1px' }}
            >
              Users
            </h1>
            <p className="text-muted-foreground" id="page-description">
              Manage user accounts and subscriptions
            </p>
          </header>

          {/* Network Status Warning */}
          <NetworkStatus 
            isOnline={networkStatus.isOnline}
            onRetry={handleRetry}
            className="mb-6"
          />

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-6">
              {/* Show filter skeleton */}
              <div className="flex items-center gap-4">
                {isDesktop ? (
                  <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
                ) : (
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
                    <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                  </div>
                )}
              </div>
              
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
              title="Failed to load users"
              description={getUserFriendlyErrorMessage(error)}
              error={error}
              onRetry={canRetry ? handleRetry : undefined}
              onGoHome={handleGoHome}
              showDetails={process.env.NODE_ENV === 'development'}
            />
          )}



          {/* Filter Controls */}
          {!isLoading && !error && (
          <section 
            className="mb-6" 
            aria-labelledby="filter-controls-heading"
            role="region"
          >
            <h2 id="filter-controls-heading" className="sr-only">
              Filter and Sort Controls
            </h2>
            
            {/* Desktop Filter */}
            {isDesktop && (
              <div className="flex items-center gap-4" role="toolbar" aria-label="User management controls">
                <SubscriptionFilter
                  value={filter.subscriptionStatus}
                  options={filterOptions}
                  onValueChange={(value) => setFilter({ subscriptionStatus: value })}
                  aria-label="Filter users by subscription status"
                />
              </div>
            )}

            {/* Mobile/Tablet Filter */}
            {!isDesktop && (
              <div className="flex items-center gap-2" role="toolbar" aria-label="User management controls">
                <SubscriptionFilterCompact
                  value={filter.subscriptionStatus}
                  options={filterOptions}
                  onValueChange={(value) => setFilter({ subscriptionStatus: value })}
                  aria-label="Filter users by subscription status"
                />
                <SortButtonCompact
                  sort={sort}
                  onSortChange={setSort}
                  aria-label="Sort users by different criteria"
                />
              </div>
            )}
          </section>
        )}

          {/* Success State - Users Loaded */}
          {!isLoading && !error && filteredUsers && filteredUsers.length > 0 && (
          <main id="main-content" className="space-y-4">
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {filter.subscriptionStatus && ` with ${filterOptions.find(opt => opt.value === filter.subscriptionStatus)?.label || 'selected'} subscription`}
            </div>
            
            {/* Desktop Table View - Hidden on mobile/tablet */}
            {isDesktop && (
              <UserDataTable
                users={filteredUsers}
                sort={sort}
                onSortChange={setSort}
                onDeleteUser={handleDeleteUser}
                aria-label={`User management table with ${filteredUsers.length} users`}
              />
            )}

            {/* Mobile/Tablet Accordion View - Hidden on desktop */}
            {!isDesktop && (
              <UserAccordionList
                users={filteredUsers}
                onDeleteUser={handleDeleteUser}
                aria-label={`User management list with ${filteredUsers.length} users`}
              />
            )}
          </main>
        )}

          {/* Empty State */}
          {!isLoading && !error && filteredUsers && filteredUsers.length === 0 && (
            <main id="main-content" role="main">
              <div className="sr-only" aria-live="polite">
                No users found
              </div>
              <EmptyState
                title="No users found"
                description={
                  filter.subscriptionStatus 
                    ? 'No users match the selected filter criteria.'
                    : 'There are currently no users in the system.'
                }
                action={filter.subscriptionStatus ? {
                  label: 'Clear Filter',
                  onClick: () => setFilter({ subscriptionStatus: null }),
                } : undefined}
                aria-label="Empty state: no users to display"
              />
            </main>
          )}

          {/* Delete User Dialog */}
          <DeleteUserDialog
            user={deleteDialog.user}
            open={deleteDialog.open}
            onOpenChange={(open) => setDeleteDialog({ open, user: open ? deleteDialog.user : null })}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      </ErrorBoundary>
    </AccessControlWrapper>
  );
}