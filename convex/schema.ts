import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    subscriptionPlanId: v.string(), // References SUBSCRIPTION_PLANS[].id
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing"),
      v.literal("incomplete")
    ),
    currentPeriodEnd: v.optional(v.number()), // Unix timestamp
    autoRenew: v.optional(v.boolean()), // Whether subscription renews or expires at currentPeriodEnd
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_stripe_customer_id", ["stripeCustomerId"])
    .index("by_email", ["email"]),
  
  admins: defineTable({
    clerkId: v.string(),              // Clerk user ID
    userId: v.id("users"),            // Reference to users table
    email: v.string(),                // Admin email
    name: v.string(),                 // Admin full name
    accessLevel: v.union(
      v.literal("Full Access"),
      v.literal("Partial Access"),
      v.literal("Limited Access")
    ),
    accountCreatedAt: v.number(),     // Unix timestamp from users table
    becameAdminAt: v.number(),        // Unix timestamp when promoted to admin
    createdAt: v.number(),            // Record creation timestamp
    updatedAt: v.number(),            // Record update timestamp
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_user_id", ["userId"])
    .index("by_access_level", ["accessLevel"])
    .index("by_email", ["email"]),
});
