import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query: Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return user;
  },
});

// Query: Get user by Stripe Customer ID
export const getUserByStripeCustomerId = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripe_customer_id", (q) => 
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .first();
    
    return user;
  },
});

// Mutation: Create or update user
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    subscriptionPlanId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
    autoRenew: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        subscriptionPlanId: args.subscriptionPlanId ?? existingUser.subscriptionPlanId,
        stripeCustomerId: args.stripeCustomerId ?? existingUser.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId ?? existingUser.stripeSubscriptionId,
        subscriptionStatus: args.subscriptionStatus as any ?? existingUser.subscriptionStatus,
        currentPeriodEnd: args.currentPeriodEnd ?? existingUser.currentPeriodEnd,
        autoRenew: args.autoRenew ?? existingUser.autoRenew,
        updatedAt: now,
      });
      
      return existingUser._id;
    } else {
      // Create new user with default free plan
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        subscriptionPlanId: args.subscriptionPlanId ?? "free",
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        subscriptionStatus: args.subscriptionStatus as any ?? "active",
        currentPeriodEnd: args.currentPeriodEnd,
        autoRenew: args.autoRenew,
        createdAt: now,
        updatedAt: now,
      });
      
      return userId;
    }
  },
});

// Mutation: Update subscription from webhook
export const updateSubscriptionFromWebhook = mutation({
  args: {
    stripeCustomerId: v.optional(v.string()),
    clerkId: v.optional(v.string()),
    subscriptionPlanId: v.string(),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.string(),
    currentPeriodEnd: v.number(),
    autoRenew: v.boolean(),
  },
  handler: async (ctx, args) => {
    let user = null;

    // Try to find user by Stripe customer ID first
    if (args.stripeCustomerId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_stripe_customer_id", (q) => 
          q.eq("stripeCustomerId", args.stripeCustomerId)
        )
        .first();
    }

    // If not found and we have clerkId, try finding by Clerk ID
    if (!user && args.clerkId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
      
      // If found by clerkId but missing stripeCustomerId, update it
      if (user && args.stripeCustomerId && !user.stripeCustomerId) {
        await ctx.db.patch(user._id, {
          stripeCustomerId: args.stripeCustomerId,
        });
      }
    }

    if (!user) {
      throw new Error(`User not found for Stripe customer ID: ${args.stripeCustomerId} or Clerk ID: ${args.clerkId}`);
    }

    await ctx.db.patch(user._id, {
      subscriptionPlanId: args.subscriptionPlanId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus as any,
      currentPeriodEnd: args.currentPeriodEnd,
      autoRenew: args.autoRenew,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Helper Mutation: Manually link Stripe customer to user (for fixing missing customer IDs)
export const linkStripeCustomer = mutation({
  args: {
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error(`User not found for Clerk ID: ${args.clerkId}`);
    }

    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
      updatedAt: Date.now(),
    });

    return { success: true, userId: user._id };
  },
});

// Query: Check if user has active subscription
export const hasActiveSubscription = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return { hasAccess: false, planId: "free" };
    }

    // Free plan always has access
    if (user.subscriptionPlanId === "free") {
      return { hasAccess: true, planId: "free" };
    }

    // Check if subscription is active and not expired
    const isActive = user.subscriptionStatus === "active" || user.subscriptionStatus === "trialing";
    const notExpired = !user.currentPeriodEnd || user.currentPeriodEnd > Date.now();

    return {
      hasAccess: isActive && notExpired,
      planId: user.subscriptionPlanId,
      status: user.subscriptionStatus,
      expiresAt: user.currentPeriodEnd,
      autoRenew: user.autoRenew,
    };
  },
});
