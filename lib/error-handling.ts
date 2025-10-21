/**
 * Error Handling Utilities
 * 
 * Comprehensive error handling utilities for network errors, retry mechanisms,
 * and user-friendly error message generation.
 */

import { toast } from 'sonner';

// Error types for categorization
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Enhanced error interface
export interface EnhancedError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  code?: string | number;
  details?: Record<string, unknown>;
  retryable?: boolean;
  timestamp: number;
}

/**
 * Creates an enhanced error with additional metadata
 */
export function createEnhancedError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  options: {
    code?: string | number;
    details?: Record<string, unknown>;
    retryable?: boolean;
    cause?: Error;
  } = {}
): EnhancedError {
  const error = new Error(message) as EnhancedError;
  error.type = type;
  error.severity = severity;
  error.code = options.code;
  error.details = options.details;
  error.retryable = options.retryable ?? isRetryableError(type);
  error.timestamp = Date.now();
  
  if (options.cause) {
    error.cause = options.cause;
  }
  
  return error;
}

/**
 * Determines if an error type is generally retryable
 */
export function isRetryableError(type: ErrorType): boolean {
  switch (type) {
    case ErrorType.NETWORK:
    case ErrorType.SERVER:
      return true;
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
    case ErrorType.VALIDATION:
    case ErrorType.CLIENT:
      return false;
    default:
      return false;
  }
}

/**
 * Network connectivity detection
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private _isOnline: boolean = typeof window !== 'undefined' ? navigator.onLine : true;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  private handleOnline = () => {
    this._isOnline = true;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    this._isOnline = false;
    this.notifyListeners(false);
  };

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => listener(isOnline));
  }

  addListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Tests actual network connectivity by making a request
   */
  async testConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Retry configuration interface
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  jitter: true,
};

/**
 * Retry mechanism with exponential backoff
 */
export class RetryManager {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
  }

  /**
   * Executes a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    options: {
      shouldRetry?: (error: Error, attempt: number) => boolean;
      onRetry?: (error: Error, attempt: number) => void;
      onFinalFailure?: (error: Error, attempts: number) => void;
    } = {}
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Check if we should retry
        const shouldRetry = options.shouldRetry 
          ? options.shouldRetry(lastError, attempt)
          : this.defaultShouldRetry(lastError, attempt);
        
        if (!shouldRetry || attempt === this.config.maxAttempts) {
          if (options.onFinalFailure) {
            options.onFinalFailure(lastError, attempt);
          }
          throw lastError;
        }
        
        // Call retry callback
        if (options.onRetry) {
          options.onRetry(lastError, attempt);
        }
        
        // Wait before retrying
        await this.delay(attempt);
      }
    }
    
    throw lastError!;
  }

  private defaultShouldRetry(error: Error, attempt: number): boolean {
    // Don't retry on last attempt
    if (attempt >= this.config.maxAttempts) {
      return false;
    }
    
    // Check if error is retryable
    if ('retryable' in error && error.retryable === false) {
      return false;
    }
    
    // Check error type
    if ('type' in error) {
      return isRetryableError((error as EnhancedError).type);
    }
    
    // Default: retry on network-like errors
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('timeout');
  }

  private async delay(attempt: number): Promise<void> {
    let delay = Math.min(
      this.config.baseDelay * Math.pow(this.config.backoffFactor, attempt - 1),
      this.config.maxDelay
    );
    
    // Add jitter to prevent thundering herd
    if (this.config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

/**
 * Analyzes fetch errors and creates enhanced errors
 */
export function analyzeFetchError(error: Error, response?: Response): EnhancedError {
  // Network errors
  if (error.message.includes('fetch') || error.name === 'TypeError') {
    return createEnhancedError(
      'Network connection failed. Please check your internet connection.',
      ErrorType.NETWORK,
      ErrorSeverity.HIGH,
      { retryable: true, cause: error }
    );
  }
  
  // Response-based errors
  if (response) {
    switch (response.status) {
      case 401:
        return createEnhancedError(
          'Authentication required. Please sign in again.',
          ErrorType.AUTHENTICATION,
          ErrorSeverity.HIGH,
          { code: 401, retryable: false }
        );
      
      case 403:
        return createEnhancedError(
          'Access denied. You do not have permission to perform this action.',
          ErrorType.AUTHORIZATION,
          ErrorSeverity.MEDIUM,
          { code: 403, retryable: false }
        );
      
      case 404:
        return createEnhancedError(
          'The requested resource was not found.',
          ErrorType.CLIENT,
          ErrorSeverity.MEDIUM,
          { code: 404, retryable: false }
        );
      
      case 422:
        return createEnhancedError(
          'Invalid data provided. Please check your input.',
          ErrorType.VALIDATION,
          ErrorSeverity.MEDIUM,
          { code: 422, retryable: false }
        );
      
      case 429:
        return createEnhancedError(
          'Too many requests. Please wait a moment and try again.',
          ErrorType.SERVER,
          ErrorSeverity.MEDIUM,
          { code: 429, retryable: true }
        );
      
      case 500:
      case 502:
      case 503:
      case 504:
        return createEnhancedError(
          'Server error occurred. Please try again in a moment.',
          ErrorType.SERVER,
          ErrorSeverity.HIGH,
          { code: response.status, retryable: true }
        );
      
      default:
        return createEnhancedError(
          `Request failed with status ${response.status}`,
          ErrorType.SERVER,
          ErrorSeverity.MEDIUM,
          { code: response.status, retryable: response.status >= 500 }
        );
    }
  }
  
  // Generic error
  return createEnhancedError(
    error.message || 'An unexpected error occurred',
    ErrorType.UNKNOWN,
    ErrorSeverity.MEDIUM,
    { cause: error }
  );
}

/**
 * Enhanced fetch wrapper with error handling and retry
 */
export async function enhancedFetch(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<Response> {
  const retryManager = new RetryManager(retryConfig);
  const networkMonitor = NetworkMonitor.getInstance();
  
  return retryManager.execute(
    async () => {
      // Check network connectivity
      if (!networkMonitor.isOnline) {
        throw createEnhancedError(
          'No internet connection. Please check your network.',
          ErrorType.NETWORK,
          ErrorSeverity.HIGH,
          { retryable: true }
        );
      }
      
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        
        if (!response.ok) {
          throw analyzeFetchError(new Error(`HTTP ${response.status}`), response);
        }
        
        return response;
      } catch (error) {
        if (error instanceof Error && 'type' in error) {
          throw error; // Already an enhanced error
        }
        throw analyzeFetchError(error as Error);
      }
    },
    {
      onRetry: (error, attempt) => {
        console.warn(`Request failed, retrying (${attempt}/${retryConfig?.maxAttempts || DEFAULT_RETRY_CONFIG.maxAttempts}):`, error.message);
      },
    }
  );
}

/**
 * User-friendly error message generator
 */
export function getUserFriendlyErrorMessage(error: Error | EnhancedError): string {
  if ('type' in error) {
    const enhancedError = error as EnhancedError;
    
    switch (enhancedError.type) {
      case ErrorType.NETWORK:
        return 'Connection problem. Please check your internet and try again.';
      
      case ErrorType.AUTHENTICATION:
        return 'Please sign in to continue.';
      
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      
      case ErrorType.SERVER:
        return 'Server is temporarily unavailable. Please try again in a moment.';
      
      default:
        return enhancedError.message || 'Something went wrong. Please try again.';
    }
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Toast notification helper for errors
 */
export function showErrorToast(error: Error | EnhancedError, options: {
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
} = {}) {
  const message = getUserFriendlyErrorMessage(error);
  const isRetryable = 'retryable' in error ? error.retryable : false;
  
  toast.error(options.title || 'Error', {
    description: message,
    action: (isRetryable && options.showRetry && options.onRetry) ? {
      label: 'Retry',
      onClick: options.onRetry,
    } : undefined,
  });
}

/**
 * Success toast helper
 */
export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
  });
}

/**
 * Warning toast helper
 */
export function showWarningToast(message: string, description?: string) {
  toast.warning(message, {
    description,
  });
}