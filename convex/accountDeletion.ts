import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Mutation: Delete user's own account from Convex
 * This is called after Stripe and Clerk cleanup is complete
 */
export const deleteOwnAccount = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is an admin - prevent self-deletion if admin
    const isAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (isAdmin) {
      throw new Error("Admin accounts cannot be deleted through this method. Please contact support.");
    }

    // Delete all user uploads
    const userUploads = await ctx.db
      .query("uploads")
      .withIndex("by_user_id", (q) => q.eq("userId", args.clerkId))
      .collect();

    for (const upload of userUploads) {
      await ctx.db.delete(upload._id);
    }

    // Delete all refund records associated with this user
    const userRefunds = await ctx.db
      .query("refunds")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .collect();

    for (const refund of userRefunds) {
      await ctx.db.delete(refund._id);
    }

    // Delete the user record
    await ctx.db.delete(user._id);

    return {
      success: true,
      uploadsDeleted: userUploads.length,
      refundsDeleted: userRefunds.length,
    };
  },
});
