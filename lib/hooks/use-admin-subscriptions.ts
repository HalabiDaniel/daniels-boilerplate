/**
 * Custom hook for managing admin subscription data
 * 
 * This hook provides subscription data fetching, transformation, filtering, and sorting
 * functionality for the admin subscription management interface with comprehensive
 * error handling and retry mechanisms.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import {
  SubscriptionDisplayData,
  filterSubscriptionsByPlan,
  sortSubscriptions,
  getFilterOptionsWithCounts,
  FilterOption,
  SUBSCRIPTION_SORT_OPTIONS,
} from '@/lib/subscription-management-utils';
import { 
  EnhancedError, 
  ErrorType, 
  ErrorSeverity, 
  createEnhancedError
} from '@/lib/error-handling';
import { useNetworkStatus } from '@/lib/hooks/use-network-status';

// State interfaces
export interface FilterState {
  subscriptionPlan: string | null;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SubscriptionAnalytics {
  totalPayingUsers: number;
  totalMRR: number;
  totalRefunds: number;
  expectedARR: number;
}

export interface UseAdminSubscriptionsReturn {
  // Data
  subscriptions: SubscriptionDisplayData[];
  filteredSubscriptions: SubscriptionDisplayData[];
  filterOptions: FilterOption[];
  analytics: SubscriptionAnalytics | undefined;
  
  // State
  filter: FilterState;
  sort: SortState;
  isLoading: boolean;
  error: EnhancedError | null;
  
  // Network status
  networkStatus: {
    isOnline: boolean;
    isConnected: boolean;
  };
  
  // Actions
  setFilter: (filter: FilterState) => void;
  setSort: (sort: SortState) => void;
  refreshData: () => void;
  retryLoad: () => void;
  
  // Utilities
  getTotalSubscriptionCount: () => number;
  getFilteredSubscriptionCount: () => number;
  
  // Error handling
  clearError: () => void;
  canRetry: boolean;
}

/**
 * Custom hook for admin subscription management with enhanced error handling
 */
export function useAdminSubscriptions(): UseAdminSubscriptionsReturn {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const networkStatus = useNetworkStatus({ checkInterval: 30000 });
  
  // Initialize state from URL parameters
  const [filter, setFilterState] = useState<FilterState>(() => ({
    subscriptionPlan: searchParams.get('filter') || null,
  }));
  
  const [sort, setSortState] = useState<SortState>(() => ({
    field: searchParams.get('sortBy') || 'name',
    direction: (searchParams.get('sortDir') as 'asc' | 'desc') || 'asc',
  }));

  // Error handling state
  const [error, setError] = useState<EnhancedError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState<number | null>(null);
  
  // Update URL when filter or sort changes
  const updateURL = useCallback((newFilter: FilterState, newSort: SortState) => {
    const params = new URLSearchParams();
    
    if (newFilter.subscriptionPlan) {
      params.set('filter', newFilter.subscriptionPlan);
    }
    
    if (newSort.field !== 'name') {
      params.set('sortBy', newSort.field);
    }
    
    if (newSort.direction !== 'asc') {
      params.set('sortDir', newSort.direction);
    }
    
    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newURL, { scroll: false });
  }, [router, pathname]);
  
  // Fetch subscriptions from Convex
  const rawSubscriptionsData = useQuery(
    api.subscriptions.getSubscriptionsForAdmin,
    user?.id ? { adminClerkId: user.id } : 'skip'
  );
  
  // Extract subscriptions and analytics from response
  const rawSubscriptions = rawSubscriptionsData?.subscriptions;
  const analytics = rawSubscriptionsData?.analytics;
  
  // Transform raw data into display format
  const subscriptions = useMemo(() => {
    if (!rawSubscriptions) return [];
    // Data is already formatted by Convex query
    return rawSubscriptions as SubscriptionDisplayData[];
  }, [rawSubscriptions]);
  
  // Apply filtering
  const filteredSubscriptions = useMemo(() => {
    let result = subscriptions;
    
    // Apply subscription plan filter
    if (filter.subscriptionPlan) {
      result = filterSubscriptionsByPlan(result, filter.subscriptionPlan);
    }
    
    return result;
  }, [subscriptions, filter]);
  
  // Apply sorting
  const sortedAndFilteredSubscriptions = useMemo(() => {
    return sortSubscriptions(filteredSubscriptions, sort.field, sort.direction);
  }, [filteredSubscriptions, sort]);
  
  // Generate filter options with counts
  const filterOptions = useMemo(() => {
    return getFilterOptionsWithCounts(subscriptions);
  }, [subscriptions]);
  
  // Enhanced error handling for Convex query
  useEffect(() => {
    if (rawSubscriptionsData === null && user?.id) {
      const convexError = createEnhancedError(
        'Failed to load subscription data from database',
        ErrorType.SERVER,
        ErrorSeverity.HIGH,
        { 
          retryable: true,
          details: { source: 'convex', query: 'getSubscriptionsForAdmin' }
        }
      );
      setError(convexError);
    } else if (rawSubscriptionsData !== undefined && rawSubscriptionsData !== null) {
      setError(null);
      setRetryCount(0);
    }
  }, [rawSubscriptionsData, user?.id]);

  // Network-based error handling
  useEffect(() => {
    if (!networkStatus.isOnline && !error) {
      const networkError = createEnhancedError(
        'No internet connection available',
        ErrorType.NETWORK,
        ErrorSeverity.HIGH,
        { retryable: true }
      );
      setError(networkError);
    } else if (networkStatus.isOnline && error?.type === ErrorType.NETWORK) {
      setError(null);
    }
  }, [networkStatus.isOnline, error]);

  // Determine loading state
  const isLoading = rawSubscriptionsData === undefined && !error;
  
  // Action handlers
  const handleSetFilter = useCallback((newFilter: FilterState) => {
    setFilterState(newFilter);
    updateURL(newFilter, sort);
  }, [updateURL, sort]);
  
  const handleSetSort = useCallback((newSort: SortState) => {
    setSortState(newSort);
    updateURL(filter, newSort);
  }, [updateURL, filter]);
  
  const refreshData = useCallback(() => {
    setError(null);
    setRetryCount(0);
    window.location.reload();
  }, []);

  const retryLoad = useCallback(() => {
    const now = Date.now();
    
    if (lastRetryTime && now - lastRetryTime < 2000) {
      return;
    }
    
    setLastRetryTime(now);
    setRetryCount(prev => prev + 1);
    setError(null);
    
    if (error?.type === ErrorType.NETWORK) {
      networkStatus.checkConnectivity().then(isConnected => {
        if (isConnected) {
          refreshData();
        }
      });
    } else {
      refreshData();
    }
  }, [error, lastRetryTime, networkStatus, refreshData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Utility functions
  const getTotalSubscriptionCount = useCallback(() => {
    return subscriptions.length;
  }, [subscriptions]);
  
  const getFilteredSubscriptionCount = useCallback(() => {
    return sortedAndFilteredSubscriptions.length;
  }, [sortedAndFilteredSubscriptions]);
  
  // Determine if retry is possible
  const canRetry = error?.retryable === true && retryCount < 3;

  return {
    // Data
    subscriptions,
    filteredSubscriptions: sortedAndFilteredSubscriptions,
    filterOptions,
    analytics,
    
    // State
    filter,
    sort,
    isLoading,
    error,
    
    // Network status
    networkStatus: {
      isOnline: networkStatus.isOnline,
      isConnected: networkStatus.isConnected,
    },
    
    // Actions
    setFilter: handleSetFilter,
    setSort: handleSetSort,
    refreshData,
    retryLoad,
    
    // Utilities
    getTotalSubscriptionCount,
    getFilteredSubscriptionCount,
    
    // Error handling
    clearError,
    canRetry,
  };
}

/**
 * Hook for managing sort state with URL persistence
 */
export function useSortState(defaultSort: SortState = { field: 'name', direction: 'asc' }) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  
  const toggleSort = useCallback((field: string) => {
    setSort(prevSort => {
      if (prevSort.field === field) {
        return {
          field,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        const sortOption = SUBSCRIPTION_SORT_OPTIONS.find(option => option.field === field);
        return {
          field,
          direction: sortOption?.defaultDirection || 'asc',
        };
      }
    });
  }, []);
  
  return {
    sort,
    setSort,
    toggleSort,
  };
}

/**
 * Hook for managing filter state
 */
export function useFilterState(defaultFilter: FilterState = { subscriptionPlan: null }) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  
  const clearFilter = useCallback(() => {
    setFilter({ subscriptionPlan: null });
  }, []);
  
  const setSubscriptionPlanFilter = useCallback((subscriptionPlan: string | null) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      subscriptionPlan,
    }));
  }, []);
  
  return {
    filter,
    setFilter,
    clearFilter,
    setSubscriptionPlanFilter,
  };
}
