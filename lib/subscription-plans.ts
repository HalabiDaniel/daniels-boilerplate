/**
 * Centralized Subscription Plans Configuration
 * 
 * Update the Clerk plan keys here to match your Clerk dashboard configuration.
 * All pricing and plan information is managed from this single file.
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIdMonthly: string | null; // Stripe Price ID for monthly billing
  stripePriceIdAnnual: string | null; // Stripe Price ID for annual billing
  features: string[];
  featured?: boolean;
  locked?: boolean; // For plans that are not yet available
  dashboardImage: string; // Image to show in dashboard
  displayName: string; // Name to show in dashboard membership card
  membershipHeading: string; // Heading to show in billing page card
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Basic',
    displayName: 'Basic User',
    membershipHeading: 'Basic Member',
    description: 'Perfect for individuals and small projects with big dreams',
    monthlyPrice: 0,
    annualPrice: 0,
    stripePriceIdMonthly: null, // Free plan has no Stripe price
    stripePriceIdAnnual: null, // Free plan has no Stripe price
    dashboardImage: '/dashboard-free.png',
    features: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '5GB storage',
      'Community access',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    displayName: 'Pro Member',
    membershipHeading: 'You are a Pro Member!',
    description: 'Best for growing teams and businesses with big plans',
    monthlyPrice: 19,
    annualPrice: 99,
    stripePriceIdMonthly: 'price_1SJDjIGpyRXGYyZBxEep0kvv', // Replace with actual Stripe Price ID
    stripePriceIdAnnual: 'price_1SJDkgGpyRXGYyZBAlk5SDTS', // Replace with actual Stripe Price ID
    dashboardImage: '/dashboard-membership.png',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Team collaboration',
    ],
    featured: true
  },
  {
    id: 'team',
    name: 'Team',
    displayName: 'Team Plan Member',
    membershipHeading: 'You are part of the Team Plan!',
    description: 'For large organizations with custom needs',
    monthlyPrice: 49,
    annualPrice: 499,
    stripePriceIdMonthly: 'price_1SJDoOGpyRXGYyZBSLC0Ux6V', // Replace with actual Stripe Price ID
    stripePriceIdAnnual: 'price_1SJDoqGpyRXGYyZBTzKkvaY8', // Replace with actual Stripe Price ID
    dashboardImage: '/dashboard-membership.png',
    locked: true, // This plan is locked/coming soon
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom solutions',
      'Unlimited storage',
      'Advanced security',
    ]
  }
];

// Helper function to get plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

// Helper function to get default plan (free)
export function getDefaultPlan(): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[0]; // First plan is always the free/default plan
}
