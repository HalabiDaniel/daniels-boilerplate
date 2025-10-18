import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Manual mutation to fix subscription data for a user
 * Use this in the Convex dashboard to manually update a user's subscription
 */
export const fixUserSubscription = mutation({
  args: {
    clerkId: v.string(),
    subscriptionPlanId: v.string(),
    currentPeriodEnd: v.number(), // Unix timestamp in milliseconds
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
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
      subscriptionPlanId: args.subscriptionPlanId,
      currentPeriodEnd: args.currentPeriodEnd,
      stripeCustomerId: args.stripeCustomerId ?? user.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId ?? user.stripeSubscriptionId,
      subscriptionStatus: (args.subscriptionStatus as any) ?? user.subscriptionStatus,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      userId: user._id,
      message: `Successfully updated subscription for user ${args.clerkId}`,
    };
  },
});
