/**
 * User Management Utilities
 * 
 * Utilities for transforming and formatting user data in the admin user management system.
 * These functions handle user display data, subscription status formatting, and other
 * user-related transformations specific to the admin interface.
 */

import { getPlanById, SUBSCRIPTION_PLANS } from './subscription-plans';
import { formatDate } from './date-utils';

// Types for user data transformation
export interface UserWithSubscription {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
  subscriptionPlanId: string;
  subscriptionStatus: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  currentPeriodEnd?: number;
  autoRenew?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserDisplayData {
  id: string;
  clerkId: string;
  initials: string;
  fullName: string;
  displayName: string; // "First L." format
  email: string;
  profilePictureUrl?: string;
  subscriptionPlan: {
    id: string;
    name: string;
    displayName: string;
  };
  subscriptionStatus: string;
  subscriptionStatusDisplay: string;
  currentPeriodEnd?: Date;
  currentPeriodEndFormatted?: string | null;
  accountCreatedAt: Date;
  accountCreatedFormatted: string;
  hasStripeData: boolean;
  hasActiveSubscription: boolean;
}

/**
 * Generates user initials from a name string
 * @param name - User's full name
 * @returns Two-character initials (e.g., "JD" for "John Doe")
 */
export function getUserInitials(name?: string): string {
  if (!name || name.trim() === '') {
    return 'U'; // Default for unnamed users
  }

  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    // First name initial + last name initial
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  // Single name - use first two characters
  return name.substring(0, 2).toUpperCase();
}

/**
 * Formats a user's name for display as "First Name + Last Name Initial"
 * @param name - User's full name
 * @returns Formatted display name (e.g., "John D." for "John Doe")
 */
export function formatUserDisplayName(name?: string): string {
  if (!name || name.trim() === '') {
    return 'Unknown User';
  }

  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastNameInitial = parts[parts.length - 1][0].toUpperCase() + '.';
    return `${firstName} ${lastNameInitial}`;
  }
  
  // Single name - return as is
  return name;
}

/**
 * Gets the full name for a user, with fallback handling
 * @param name - User's name from database
 * @param email - User's email as fallback
 * @returns Full name or email-based name
 */
export function getUserFullName(name?: string, email?: string): string {
  if (name && name.trim() !== '') {
    return name.trim();
  }
  
  if (email) {
    // Extract name from email (before @ symbol) and capitalize
    const emailName = email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  return 'Unknown User';
}

/**
 * Formats subscription status for display
 * @param status - Raw subscription status from database
 * @returns Human-readable status string
 */
export function formatSubscriptionStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'canceled':
      return 'Canceled';
    case 'past_due':
      return 'Past Due';
    case 'trialing':
      return 'Trial';
    case 'incomplete':
      return 'Incomplete';
    default:
      return 'Unknown';
  }
}

/**
 * Gets subscription plan information with fallback handling
 * @param planId - Subscription plan ID
 * @returns Plan information object
 */
export function getSubscriptionPlanInfo(planId: string) {
  const plan = getPlanById(planId);
  
  if (!plan) {
    // Fallback for unknown plan IDs
    return {
      id: planId,
      name: 'Unknown Plan',
      displayName: 'Unknown Plan',
    };
  }
  
  return {
    id: plan.id,
    name: plan.name,
    displayName: plan.displayName,
  };
}

/**
 * Determines if a user has an active subscription
 * @param subscriptionStatus - Current subscription status
 * @param currentPeriodEnd - Subscription end timestamp
 * @param planId - Subscription plan ID
 * @returns Boolean indicating if subscription is active
 */
export function hasActiveSubscription(
  subscriptionStatus: string,
  currentPeriodEnd?: number,
  planId?: string
): boolean {
  // Free plan is always considered "active"
  if (planId === 'free') {
    return true;
  }
  
  // Check if subscription is in an active state
  const isActiveStatus = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
  
  // Check if subscription hasn't expired
  const notExpired = !currentPeriodEnd || currentPeriodEnd > Date.now();
  
  return isActiveStatus && notExpired;
}

/**
 * Formats the subscription period end date for display
 * @param currentPeriodEnd - Unix timestamp of subscription end
 * @param planId - Subscription plan ID
 * @returns Formatted date string or null for free plans
 */
export function formatSubscriptionEndDate(currentPeriodEnd?: number, planId?: string): string | null {
  // Free plans don't have end dates
  if (planId === 'free' || !currentPeriodEnd) {
    return null;
  }
  
  return formatDate(currentPeriodEnd);
}

/**
 * Transforms raw user data into display-optimized format
 * @param user - Raw user data from Convex
 * @returns Transformed user display data
 */
export function transformUserForDisplay(user: UserWithSubscription): UserDisplayData {
  const fullName = getUserFullName(user.name, user.email);
  const planInfo = getSubscriptionPlanInfo(user.subscriptionPlanId);
  const isActive = hasActiveSubscription(
    user.subscriptionStatus,
    user.currentPeriodEnd,
    user.subscriptionPlanId
  );
  
  return {
    id: user._id,
    clerkId: user.clerkId,
    initials: getUserInitials(user.name),
    fullName,
    displayName: formatUserDisplayName(user.name),
    email: user.email,
    profilePictureUrl: user.profilePictureUrl,
    subscriptionPlan: planInfo,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionStatusDisplay: formatSubscriptionStatus(user.subscriptionStatus),
    currentPeriodEnd: user.currentPeriodEnd ? new Date(user.currentPeriodEnd) : undefined,
    currentPeriodEndFormatted: formatSubscriptionEndDate(user.currentPeriodEnd, user.subscriptionPlanId),
    accountCreatedAt: new Date(user.createdAt),
    accountCreatedFormatted: formatDate(user.createdAt),
    hasStripeData: !!(user.stripeCustomerId || user.stripeSubscriptionId),
    hasActiveSubscription: isActive,
  };
}

/**
 * Transforms an array of users for display
 * @param users - Array of raw user data from Convex
 * @returns Array of transformed user display data
 */
export function transformUsersForDisplay(users: UserWithSubscription[]): UserDisplayData[] {
  return users.map(transformUserForDisplay);
}

// Filter and sort utilities

/**
 * Filter options for subscription status
 */
export interface FilterOption {
  value: string | null;
  label: string;
  count?: number;
}

export const SUBSCRIPTION_FILTER_OPTIONS: FilterOption[] = [
  { value: null, label: "All Users" },
  { value: "free", label: "Free Plan" },
  { value: "pro", label: "Pro Plan" },
  { value: "team", label: "Team Plan" },
  { value: "canceled", label: "Canceled" },
  { value: "past_due", label: "Past Due" },
  { value: "trialing", label: "Trial" },
  { value: "incomplete", label: "Incomplete" },
];

/**
 * Sort options for user list
 */
export interface SortOption {
  field: string;
  label: string;
  defaultDirection: 'asc' | 'desc';
}

export const SORT_OPTIONS: SortOption[] = [
  { field: 'name', label: 'Name', defaultDirection: 'asc' },
  { field: 'email', label: 'Email', defaultDirection: 'asc' },
  { field: 'createdAt', label: 'Account Created', defaultDirection: 'desc' },
  { field: 'currentPeriodEnd', label: 'Subscription End', defaultDirection: 'desc' },
  { field: 'subscription', label: 'Subscription Plan', defaultDirection: 'asc' },
];

/**
 * Filters users by subscription status
 * @param users - Array of user display data
 * @param filterValue - Filter value (plan ID or status)
 * @returns Filtered array of users
 */
export function filterUsersBySubscription(
  users: UserDisplayData[],
  filterValue: string | null
): UserDisplayData[] {
  if (!filterValue) {
    return users; // No filter applied
  }
  
  return users.filter(user => {
    // Filter by plan ID
    if (SUBSCRIPTION_PLANS.some(plan => plan.id === filterValue)) {
      return user.subscriptionPlan.id === filterValue;
    }
    
    // Filter by status
    return user.subscriptionStatus === filterValue;
  });
}

/**
 * Sorts users by the specified field and direction
 * @param users - Array of user display data
 * @param field - Field to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted array of users
 */
export function sortUsers(
  users: UserDisplayData[],
  field: string,
  direction: 'asc' | 'desc'
): UserDisplayData[] {
  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (field) {
      case 'name':
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case 'email':
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case 'createdAt':
        aValue = a.accountCreatedAt.getTime();
        bValue = b.accountCreatedAt.getTime();
        break;
      case 'currentPeriodEnd':
        // Handle null values for free plans
        aValue = a.currentPeriodEnd?.getTime() || 0;
        bValue = b.currentPeriodEnd?.getTime() || 0;
        break;
      case 'subscription':
        aValue = a.subscriptionPlan.name.toLowerCase();
        bValue = b.subscriptionPlan.name.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  return sortedUsers;
}

/**
 * Gets filter counts for each subscription type
 * @param users - Array of user display data
 * @returns Updated filter options with counts
 */
export function getFilterOptionsWithCounts(users: UserDisplayData[]): FilterOption[] {
  const counts: Record<string, number> = {};
  
  // Count users by plan and status
  users.forEach(user => {
    const planId = user.subscriptionPlan.id;
    const status = user.subscriptionStatus;
    
    counts[planId] = (counts[planId] || 0) + 1;
    counts[status] = (counts[status] || 0) + 1;
  });
  
  return SUBSCRIPTION_FILTER_OPTIONS.map(option => ({
    ...option,
    count: option.value ? counts[option.value] || 0 : users.length,
  }));
}