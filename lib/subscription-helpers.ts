/**
 * Helper functions for subscription management
 */

import { getPlanById, getDefaultPlan, SUBSCRIPTION_PLANS } from './subscription-plans';

// Type for user with public metadata
type UserWithMetadata = {
  publicMetadata?: {
    subscriptionPlan?: string;
    subscriptionExpiry?: string;
  };
} | null | undefined;

/**
 * Get user's current subscription plan
 */
export function getUserPlan(user: UserWithMetadata) {
  if (!user) return getDefaultPlan();
  
  const planId = user.publicMetadata?.subscriptionPlan as string || 'free';
  return getPlanById(planId) || getDefaultPlan();
}

/**
 * Check if user has access to a specific plan or higher
 */
export function hasAccessToPlan(user: UserWithMetadata, requiredPlanId: string): boolean {
  if (!user) return requiredPlanId === 'free';
  
  const userPlanId = user.publicMetadata?.subscriptionPlan as string || 'free';
  
  // Get plan indices
  const userPlanIndex = SUBSCRIPTION_PLANS.findIndex(p => p.id === userPlanId);
  const requiredPlanIndex = SUBSCRIPTION_PLANS.findIndex(p => p.id === requiredPlanId);
  
  // If either plan not found, default to no access
  if (userPlanIndex === -1 || requiredPlanIndex === -1) return false;
  
  // User has access if their plan index is >= required plan index
  return userPlanIndex >= requiredPlanIndex;
}

/**
 * Check if user's subscription is active (not expired)
 */
export function isSubscriptionActive(user: UserWithMetadata): boolean {
  if (!user) return false;
  
  const planId = user.publicMetadata?.subscriptionPlan as string || 'free';
  
  // Free plan is always active
  if (planId === 'free') return true;
  
  const expiryDate = user.publicMetadata?.subscriptionExpiry as string | undefined;
  
  if (!expiryDate) return true; // No expiry means active
  
  return new Date(expiryDate) > new Date();
}

/**
 * Get formatted expiry date string
 */
export function getExpiryDateString(user: UserWithMetadata): string {
  if (!user) return 'No expiry date';
  
  const planId = user.publicMetadata?.subscriptionPlan as string || 'free';
  
  if (planId === 'free') return 'No expiry date';
  
  const expiryDate = user.publicMetadata?.subscriptionExpiry as string | undefined;
  
  if (!expiryDate) return 'Active';
  
  const date = new Date(expiryDate);
  return `Expires ${date.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  })}`;
}
