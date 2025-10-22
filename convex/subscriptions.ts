import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Subscription Management Queries for Admin Dashboard
 * 
 * These queries support the /admin/subscriptions page with:
 * - Fetching all users with paid subscriptions (active and inactive)
 * - Analytics calculations (total paying users, MRR, refunds, ARR)
 * - Filtering by subscription plan
 * - Sorting by name, email, subscription, and date fields
 */

// Query: Get all subscriptions with analytics for admin
export const getSubscriptionsForAdmin = query({
  args: { 
    adminClerkId: v.string(),
    filterByPlan: v.optional(v.string()), // Filter by subscription plan ID
    sortBy: v.optional(v.string()), // "name", "email", "subscription", "date", "amount"
    sortOrder: v.optional(v.string()), // "asc" or "desc"
  },
  handler: async (ctx, args) => {
    // Validate admin access
    if (!args.adminClerkId || args.adminClerkId.trim() === "") {
      throw new Error("Invalid admin Clerk ID provided");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin) {
      throw new Error("Access denied: Admin privileges required");
    }

    try {
      // Fetch all users
      const allUsers = await ctx.db
        .query("users")
        .collect();

      // Filter to only users with paid subscriptions (not free plan)
      let paidUsers = allUsers.filter(user => 
        user.subscriptionPlanId !== "free" && user.subscriptionPlanId !== undefined
      );

      // Apply plan filter if specified
      if (args.filterByPlan && args.filterByPlan !== "all") {
        paidUsers = paidUsers.filter(user => 
          user.subscriptionPlanId === args.filterByPlan
        );
      }

      // Calculate analytics
      const analytics = await calculateAnalytics(ctx, paidUsers);

      // Get all refunds to check which subscriptions have been refunded
      const allRefunds = await ctx.db.query("refunds").collect();
      const refundedSubscriptions = new Set(
        allRefunds.map((r: any) => r.stripeSubscriptionId)
      );

      // Format subscription data for display
      const subscriptions = paidUsers.map(user => formatSubscriptionData(user, refundedSubscriptions));

      // Apply sorting
      const sortedSubscriptions = sortSubscriptions(
        subscriptions, 
        args.sortBy || "name", 
        args.sortOrder || "asc"
      );

      return {
        subscriptions: sortedSubscriptions,
        analytics,
      };
    } catch (error) {
      console.error("Error fetching subscriptions for admin:", error);
      throw new Error("Failed to retrieve subscription data. Please try again.");
    }
  },
});

// Query: Get subscription analytics only (for summary cards)
export const getSubscriptionAnalytics = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    // Validate admin access
    if (!args.adminClerkId || args.adminClerkId.trim() === "") {
      throw new Error("Invalid admin Clerk ID provided");
    }

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin) {
      throw new Error("Access denied: Admin privileges required");
    }

    try {
      // Fetch all users
      const allUsers = await ctx.db
        .query("users")
        .collect();

      // Filter to only users with paid subscriptions
      const paidUsers = allUsers.filter(user => 
        user.subscriptionPlanId !== "free" && user.subscriptionPlanId !== undefined
      );

      return await calculateAnalytics(ctx, paidUsers);
    } catch (error) {
      console.error("Error fetching subscription analytics:", error);
      throw new Error("Failed to retrieve analytics data. Please try again.");
    }
  },
});

// Helper function to calculate analytics
async function calculateAnalytics(ctx: any, paidUsers: any[]) {
  const totalPayingUsers = paidUsers.length;
  
  // Calculate MRR (Monthly Recurring Revenue)
  // Only count active subscriptions for MRR
  let totalMRR = 0;
  const activeUsers = paidUsers.filter(user => 
    user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing"
  );

  activeUsers.forEach(user => {
    const amount = getMonthlyAmount(user.subscriptionPlanId);
    totalMRR += amount;
  });

  // Calculate total refunds from refunds table
  const refunds = await ctx.db.query("refunds").collect();
  const totalRefunds = refunds.reduce((sum: number, refund: any) => sum + refund.amount, 0);

  // Calculate expected ARR (Annual Recurring Revenue)
  const expectedARR = totalMRR * 12;

  return {
    totalPayingUsers,
    totalMRR,
    totalRefunds,
    expectedARR,
  };
}

// Helper function to get monthly amount for a subscription plan
function getMonthlyAmount(planId: string): number {
  // Map plan IDs to monthly amounts
  // These should match the subscription-plans.ts configuration
  const planPrices: Record<string, number> = {
    'pro': 19,
    'team': 49,
  };

  return planPrices[planId] || 0;
}

// Helper function to format subscription data for display
function formatSubscriptionData(user: any, refundedSubscriptions: Set<string>) {
  // Get user initials
  const initials = user.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  // Format payment amount with frequency suffix
  const monthlyAmount = getMonthlyAmount(user.subscriptionPlanId);
  const paymentAmountFormatted = `$${monthlyAmount}/mo`;

  // Format current period end date
  const currentPeriodEndFormatted = user.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return {
    id: user._id,
    userId: user._id,
    clerkId: user.clerkId,
    fullName: user.name || 'Unknown',
    email: user.email,
    initials,
    profilePictureUrl: user.profilePictureUrl,
    subscriptionPlan: {
      name: user.subscriptionPlanId,
      displayName: getPlanDisplayName(user.subscriptionPlanId),
    },
    subscriptionStatus: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
    currentPeriodEndFormatted,
    autoRenew: user.autoRenew ?? false,
    paymentAmount: monthlyAmount,
    billingFrequency: 'monthly' as const,
    paymentAmountFormatted,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripeCustomerId: user.stripeCustomerId,
    isCancelledWithRefund: !user.autoRenew && user.stripeSubscriptionId && refundedSubscriptions.has(user.stripeSubscriptionId),
  };
}

// Helper function to get plan display name
function getPlanDisplayName(planId: string): string {
  const planNames: Record<string, string> = {
    'pro': 'Pro',
    'team': 'Team',
  };

  return planNames[planId] || planId;
}

// Helper function to sort subscriptions
function sortSubscriptions(
  subscriptions: any[], 
  sortBy: string, 
  sortOrder: string
): any[] {
  const sorted = [...subscriptions];

  sorted.sort((a, b) => {
    let compareA: any;
    let compareB: any;

    switch (sortBy) {
      case 'name':
        compareA = a.fullName.toLowerCase();
        compareB = b.fullName.toLowerCase();
        break;
      case 'email':
        compareA = a.email.toLowerCase();
        compareB = b.email.toLowerCase();
        break;
      case 'subscription':
        compareA = a.subscriptionPlan.displayName.toLowerCase();
        compareB = b.subscriptionPlan.displayName.toLowerCase();
        break;
      case 'date':
        compareA = a.currentPeriodEnd || 0;
        compareB = b.currentPeriodEnd || 0;
        break;
      case 'amount':
        compareA = a.paymentAmount;
        compareB = b.paymentAmount;
        break;
      default:
        compareA = a.fullName.toLowerCase();
        compareB = b.fullName.toLowerCase();
    }

    if (compareA < compareB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (compareA > compareB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
}
