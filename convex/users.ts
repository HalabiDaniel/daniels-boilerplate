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
    name: v.optional(v.string()),
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
        name: args.name ?? existingUser.name,
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
        name: args.name,
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

// Mutation: Update user profile (name and profile picture)
export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    profilePicturePublicId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      updates.name = args.name;
    }

    if (args.profilePictureUrl !== undefined) {
      updates.profilePictureUrl = args.profilePictureUrl;
    }

    if (args.profilePicturePublicId !== undefined) {
      updates.profilePicturePublicId = args.profilePicturePublicId;
    }

    await ctx.db.patch(user._id, updates);

    return user._id;
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
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId!))
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

// Query: Get all users for admin management (Admin only)
export const getAllUsersForAdmin = query({
  args: { adminClerkId: v.string() },
  handler: async (ctx, args) => {
    // Validate input
    if (!args.adminClerkId || args.adminClerkId.trim() === "") {
      throw new Error("Invalid admin Clerk ID provided");
    }

    // Verify the requesting user is an admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin) {
      throw new Error("Access denied: Admin privileges required");
    }

    try {
      // Fetch all users with their subscription data
      const users = await ctx.db
        .query("users")
        .order("desc")
        .collect();

      // Sort by creation date (newest first) and return with all necessary data
      const sortedUsers = users.sort((a, b) => b.createdAt - a.createdAt);

      return sortedUsers.map(user => ({
        _id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        subscriptionPlanId: user.subscriptionPlanId,
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodEnd: user.currentPeriodEnd,
        autoRenew: user.autoRenew,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching users for admin:", error);
      throw new Error("Failed to retrieve user data. Please try again.");
    }
  },
});

// Mutation: Delete user completely from Convex (Admin only)
export const deleteUserCompletely = mutation({
  args: {
    userId: v.id("users"),
    adminClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate input parameters
    if (!args.userId) {
      throw new Error("User ID is required");
    }
    
    if (!args.adminClerkId || args.adminClerkId.trim() === "") {
      throw new Error("Invalid admin Clerk ID provided");
    }

    // Verify the requesting user is an admin with appropriate permissions
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.adminClerkId))
      .first();

    if (!admin) {
      throw new Error("Access denied: Admin privileges required");
    }

    // Get the user to be deleted
    const userToDelete = await ctx.db.get(args.userId);
    
    if (!userToDelete) {
      throw new Error("User not found or already deleted");
    }

    // Prevent deletion of admin users (check if user is also an admin)
    const userAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userToDelete.clerkId))
      .first();

    if (userAdmin) {
      throw new Error("Cannot delete user: User has admin privileges. Remove admin access first.");
    }

    // Prevent self-deletion
    if (userToDelete.clerkId === args.adminClerkId) {
      throw new Error("Cannot delete your own user account");
    }

    try {
      // Delete related uploads first (to maintain referential integrity)
      const userUploads = await ctx.db
        .query("uploads")
        .withIndex("by_user_id", (q) => q.eq("userId", userToDelete.clerkId))
        .collect();

      // Delete all user uploads
      for (const upload of userUploads) {
        await ctx.db.delete(upload._id);
      }

      // Store user data for external cleanup before deletion
      const userData = {
        clerkId: userToDelete.clerkId,
        email: userToDelete.email,
        stripeCustomerId: userToDelete.stripeCustomerId,
        stripeSubscriptionId: userToDelete.stripeSubscriptionId,
        profilePicturePublicId: userToDelete.profilePicturePublicId,
      };

      // Delete the user record
      await ctx.db.delete(args.userId);

      // Return user data for external system cleanup
      return {
        success: true,
        deletedUser: userData,
        uploadsDeleted: userUploads.length,
        message: `User ${userToDelete.email} successfully deleted from Convex`,
      };
    } catch (error) {
      console.error("Error during user deletion:", error);
      throw new Error("Failed to delete user from database. Please try again.");
    }
  },
});
