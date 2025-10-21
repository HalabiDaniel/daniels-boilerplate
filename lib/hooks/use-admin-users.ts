/**
 * Custom hook for managing admin user data
 * 
 * This hook provides user data fetching, transformation, filtering, and sorting
 * functionality for the admin user management interface with comprehensive
 * error handling and retry mechanisms.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import {
  UserDisplayData,
  transformUsersForDisplay,
  filterUsersBySubscription,
  sortUsers,
  getFilterOptionsWithCounts,
  FilterOption,
  SORT_OPTIONS,
} from '@/lib/user-management-utils';
import { 
  EnhancedError, 
  ErrorType, 
  ErrorSeverity, 
  createEnhancedError
} from '@/lib/error-handling';
import { useNetworkStatus } from '@/lib/hooks/use-network-status';

// State interfaces
export interface FilterState {
  subscriptionStatus: string | null;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface UseAdminUsersReturn {
  // Data
  users: UserDisplayData[];
  filteredUsers: UserDisplayData[];
  filterOptions: FilterOption[];
  
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
  getTotalUserCount: () => number;
  getFilteredUserCount: () => number;
  
  // Error handling
  clearError: () => void;
  canRetry: boolean;
}

/**
 * Custom hook for admin user management with enhanced error handling
 * @returns User data and management functions
 */
export function useAdminUsers(): UseAdminUsersReturn {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const networkStatus = useNetworkStatus({ checkInterval: 30000 }); // Check every 30s
  
  // Initialize state from URL parameters
  const [filter, setFilterState] = useState<FilterState>(() => ({
    subscriptionStatus: searchParams.get('filter') || null,
  }));
  
  const [sort, setSortState] = useState<SortState>(() => ({
    field: searchParams.get('sortBy') || 'createdAt',
    direction: (searchParams.get('sortDir') as 'asc' | 'desc') || 'desc',
  }));

  // Error handling state
  const [error, setError] = useState<EnhancedError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState<number | null>(null);
  
  // Update URL when filter or sort changes
  const updateURL = useCallback((newFilter: FilterState, newSort: SortState) => {
    const params = new URLSearchParams();
    
    if (newFilter.subscriptionStatus) {
      params.set('filter', newFilter.subscriptionStatus);
    }
    
    if (newSort.field !== 'createdAt') {
      params.set('sortBy', newSort.field);
    }
    
    if (newSort.direction !== 'desc') {
      params.set('sortDir', newSort.direction);
    }
    
    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newURL, { scroll: false });
  }, [router, pathname]);
  
  // Fetch users from Convex with retry key for manual refresh
  const rawUsers = useQuery(
    api.users.getAllUsersForAdmin,
    user?.id ? { adminClerkId: user.id } : 'skip'
  );
  
  // Transform raw data into display format
  const users = useMemo(() => {
    if (!rawUsers) return [];
    return transformUsersForDisplay(rawUsers);
  }, [rawUsers]);
  
  // Apply filtering
  const filteredUsers = useMemo(() => {
    let result = users;
    
    // Apply subscription filter
    if (filter.subscriptionStatus) {
      result = filterUsersBySubscription(result, filter.subscriptionStatus);
    }
    
    return result;
  }, [users, filter]);
  
  // Apply sorting
  const sortedAndFilteredUsers = useMemo(() => {
    return sortUsers(filteredUsers, sort.field, sort.direction);
  }, [filteredUsers, sort]);
  
  // Generate filter options with counts
  const filterOptions = useMemo(() => {
    return getFilterOptionsWithCounts(users);
  }, [users]);
  
  // Enhanced error handling for Convex query
  useEffect(() => {
    if (rawUsers === null && user?.id) {
      // Convex query failed
      const convexError = createEnhancedError(
        'Failed to load user data from database',
        ErrorType.SERVER,
        ErrorSeverity.HIGH,
        { 
          retryable: true,
          details: { source: 'convex', query: 'getAllUsersForAdmin' }
        }
      );
      setError(convexError);
    } else if (rawUsers !== undefined && rawUsers !== null) {
      // Query succeeded, clear any previous errors
      setError(null);
      setRetryCount(0);
    }
  }, [rawUsers, user?.id]);

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
      // Network came back, clear network errors
      setError(null);
    }
  }, [networkStatus.isOnline, error]);

  // Determine loading state
  const isLoading = rawUsers === undefined && !error;
  
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
    // Force a re-render by reloading the page
    window.location.reload();
  }, []);

  const retryLoad = useCallback(() => {
    const now = Date.now();
    
    // Prevent rapid retries (minimum 2 seconds between attempts)
    if (lastRetryTime && now - lastRetryTime < 2000) {
      return;
    }
    
    setLastRetryTime(now);
    setRetryCount(prev => prev + 1);
    setError(null);
    
    // For network errors, check connectivity first
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
  const getTotalUserCount = useCallback(() => {
    return users.length;
  }, [users]);
  
  const getFilteredUserCount = useCallback(() => {
    return sortedAndFilteredUsers.length;
  }, [sortedAndFilteredUsers]);
  
  // Determine if retry is possible
  const canRetry = error?.retryable === true && retryCount < 3;

  return {
    // Data
    users,
    filteredUsers: sortedAndFilteredUsers,
    filterOptions,
    
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
    getTotalUserCount,
    getFilteredUserCount,
    
    // Error handling
    clearError,
    canRetry,
  };
}

/**
 * Hook for managing sort state with URL persistence (optional enhancement)
 * @param defaultSort - Default sort configuration
 * @returns Sort state and setter
 */
export function useSortState(defaultSort: SortState = { field: 'createdAt', direction: 'desc' }) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  
  const toggleSort = useCallback((field: string) => {
    setSort(prevSort => {
      if (prevSort.field === field) {
        // Same field - toggle direction
        return {
          field,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // Different field - use default direction
        const sortOption = SORT_OPTIONS.find(option => option.field === field);
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
 * @param defaultFilter - Default filter configuration
 * @returns Filter state and setter
 */
export function useFilterState(defaultFilter: FilterState = { subscriptionStatus: null }) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  
  const clearFilter = useCallback(() => {
    setFilter({ subscriptionStatus: null });
  }, []);
  
  const setSubscriptionFilter = useCallback((subscriptionStatus: string | null) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      subscriptionStatus,
    }));
  }, []);
  
  return {
    filter,
    setFilter,
    clearFilter,
    setSubscriptionFilter,
  };
}