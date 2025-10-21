/**
 * Network Status Hook
 * 
 * Provides real-time network connectivity monitoring and status.
 * Integrates with the NetworkMonitor utility for consistent network detection.
 */

import { useState, useEffect, useCallback } from 'react';
import { NetworkMonitor } from '@/lib/error-handling';

export interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastChecked: number | null;
  isChecking: boolean;
}

export interface UseNetworkStatusReturn extends NetworkStatus {
  checkConnectivity: () => Promise<boolean>;
  refresh: () => void;
}

/**
 * Hook for monitoring network connectivity status
 * 
 * @param options Configuration options
 * @returns Network status and utilities
 */
export function useNetworkStatus(options: {
  checkOnMount?: boolean;
  checkInterval?: number;
} = {}): UseNetworkStatusReturn {
  const { checkOnMount = true, checkInterval } = options;
  
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isConnected: navigator.onLine,
    lastChecked: null,
    isChecking: false,
  });

  const networkMonitor = NetworkMonitor.getInstance();

  // Check actual connectivity (not just browser online status)
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    setStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const isConnected = await networkMonitor.testConnectivity();
      const now = Date.now();
      
      setStatus(prev => ({
        ...prev,
        isConnected,
        lastChecked: now,
        isChecking: false,
      }));
      
      return isConnected;
    } catch {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        lastChecked: Date.now(),
        isChecking: false,
      }));
      
      return false;
    }
  }, [networkMonitor]);

  // Refresh status
  const refresh = useCallback(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  // Listen to browser online/offline events
  useEffect(() => {
    const handleOnlineStatusChange = (isOnline: boolean) => {
      setStatus(prev => ({ ...prev, isOnline }));
      
      // If we come back online, check actual connectivity
      if (isOnline) {
        checkConnectivity();
      } else {
        setStatus(prev => ({ ...prev, isConnected: false }));
      }
    };

    const removeListener = networkMonitor.addListener(handleOnlineStatusChange);
    
    return removeListener;
  }, [networkMonitor, checkConnectivity]);

  // Initial connectivity check
  useEffect(() => {
    if (checkOnMount) {
      checkConnectivity();
    }
  }, [checkOnMount, checkConnectivity]);

  // Periodic connectivity checks
  useEffect(() => {
    if (!checkInterval) return;

    const interval = setInterval(() => {
      // Only check if we think we're online
      if (status.isOnline) {
        checkConnectivity();
      }
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkInterval, status.isOnline, checkConnectivity]);

  return {
    ...status,
    checkConnectivity,
    refresh,
  };
}

/**
 * Hook for handling network-dependent operations
 * 
 * @param operation The operation to perform
 * @param options Configuration options
 * @returns Operation state and controls
 */
export function useNetworkOperation<T>(
  operation: () => Promise<T>,
  options: {
    retryOnReconnect?: boolean;
    showOfflineMessage?: boolean;
  } = {}
) {
  const { retryOnReconnect = true } = options;
  const networkStatus = useNetworkStatus();
  
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    lastAttempt: number | null;
  }>({
    data: null,
    error: null,
    isLoading: false,
    lastAttempt: null,
  });

  const execute = useCallback(async () => {
    if (!networkStatus.isOnline) {
      const error = new Error('No internet connection available');
      setState(prev => ({ ...prev, error, isLoading: false }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await operation();
      setState({
        data: result,
        error: null,
        isLoading: false,
        lastAttempt: Date.now(),
      });
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
        lastAttempt: Date.now(),
      }));
      throw error;
    }
  }, [operation, networkStatus.isOnline]);

  // Auto-retry when network comes back online
  useEffect(() => {
    if (
      retryOnReconnect &&
      networkStatus.isOnline &&
      networkStatus.isConnected &&
      state.error &&
      !state.isLoading
    ) {
      // Only retry if the last attempt was when we were offline
      const wasOfflineError = state.error.message.includes('connection') ||
                             state.error.message.includes('network') ||
                             state.error.message.includes('fetch');
      
      if (wasOfflineError) {
        execute();
      }
    }
  }, [
    networkStatus.isOnline,
    networkStatus.isConnected,
    state.error,
    state.isLoading,
    retryOnReconnect,
    execute,
  ]);

  return {
    ...state,
    execute,
    retry: execute,
    networkStatus,
  };
}