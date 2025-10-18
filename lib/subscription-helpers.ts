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

/**
 * Get plan ID from Stripe price ID
 */
export function getPlanIdFromPriceId(priceId: string): string | null {
  for (const plan of SUBSCRIPTION_PLANS) {
    if (plan.stripePriceIdMonthly === priceId || plan.stripePriceIdAnnual === priceId) {
      return plan.id;
    }
  }
  return null;
}

/**
 * Format subscription expiry date with proper wording based on autoRenew
 * @param timestamp - Unix timestamp in milliseconds
 * @param autoRenew - Whether subscription auto-renews or expires
 * @returns Formatted string like "Renews on..." or "Expires on..."
 */
export function formatExpiryDate(timestamp: number, autoRenew?: boolean): string {
  // Check if timestamp is valid
  if (!timestamp || isNaN(timestamp)) {
    return 'Invalid date';
  }

  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // If autoRenew is false, subscription expires
  // If autoRenew is true or undefined (default), subscription renews
  const prefix = autoRenew === false ? 'Expires on' : 'Renews on';

  return `${prefix} ${formattedDate}`;
}

/**
 * Format subscription expiry date for sidebar (dd/mm/yyyy format)
 * @param timestamp - Unix timestamp in milliseconds
 * @param autoRenew - Whether subscription auto-renews or expires
 * @returns Formatted string like "Renews dd/mm/yyyy" or "Expires dd/mm/yyyy"
 */
export function formatExpiryDateShort(timestamp: number, autoRenew?: boolean): string {
  // Check if timestamp is valid
  if (!timestamp || isNaN(timestamp)) {
    return 'Invalid date';
  }

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  // If autoRenew is false, subscription expires
  // If autoRenew is true or undefined (default), subscription renews
  const prefix = autoRenew === false ? 'Expires' : 'Renews';

  return `${prefix} ${formattedDate}`;
}

/**
 * Check if user can upgrade to plan
 */
export function canUpgradeToPlan(
  currentPlanId: string,
  targetPlanId: string
): boolean {
  const currentIndex = SUBSCRIPTION_PLANS.findIndex(p => p.id === currentPlanId);
  const targetIndex = SUBSCRIPTION_PLANS.findIndex(p => p.id === targetPlanId);
  return targetIndex > currentIndex;
}

/**
 * Get human-readable subscription status
 */
export function getSubscriptionStatusText(
  status: string,
  currentPeriodEnd?: number,
  autoRenew?: boolean
): string {
  const now = Date.now();
  const isExpired = currentPeriodEnd && currentPeriodEnd < now;

  switch (status) {
    case 'active':
      if (isExpired) return 'Expired';
      if (autoRenew === false) return 'Cancels at period end';
      return 'Active';
    case 'trialing':
      return 'Trial';
    case 'canceled':
      if (isExpired) return 'Expired';
      return 'Cancelled (access until period end)';
    case 'past_due':
      return 'Payment failed';
    case 'incomplete':
      return 'Payment incomplete';
    default:
      return status;
  }
}

/**
 * Check if subscription has active access (even if cancelled)
 */
export function hasActiveAccess(
  status: string,
  currentPeriodEnd?: number
): boolean {
  const now = Date.now();
  const notExpired = !currentPeriodEnd || currentPeriodEnd > now;

  // Active and trialing subscriptions have access if not expired
  // Canceled subscriptions have access until period end
  return (status === 'active' || status === 'trialing' || status === 'canceled') && notExpired;
}
