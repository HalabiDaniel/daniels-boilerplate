import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()), // User's full name
    profilePictureUrl: v.optional(v.string()), // Cloudinary URL for profile picture
    profilePicturePublicId: v.optional(v.string()), // Cloudinary public ID for deletion
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

  uploads: defineTable({
    userId: v.string(),                     // Clerk user ID
    filename: v.string(),                   // Original or user-edited filename
    cloudinaryUrl: v.string(),              // Full Cloudinary URL
    cloudinaryPublicId: v.string(),         // Cloudinary public ID for deletion
    fileType: v.string(),                   // MIME type (image/jpeg, application/pdf, etc.)
    fileSize: v.number(),                   // File size in bytes
    description: v.optional(v.string()),    // Optional user description
    width: v.optional(v.number()),          // Image width (if applicable)
    height: v.optional(v.number()),         // Image height (if applicable)
    createdAt: v.number(),                  // Unix timestamp
    updatedAt: v.number(),                  // Unix timestamp
  })
    .index("by_user_id", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_file_type", ["fileType"]),

  refunds: defineTable({
    userId: v.id("users"),                  // Reference to users table
    clerkId: v.string(),                    // Clerk user ID
    stripeCustomerId: v.string(),           // Stripe customer ID
    stripeSubscriptionId: v.string(),       // Stripe subscription ID
    stripeRefundId: v.string(),             // Stripe refund ID
    stripeChargeId: v.string(),             // Stripe charge ID that was refunded
    amount: v.number(),                     // Refund amount in dollars
    reason: v.string(),                     // Refund reason
    adminClerkId: v.string(),               // Admin who processed the refund
    refundType: v.union(
      v.literal("immediate"),
      v.literal("end_of_period")
    ),
    createdAt: v.number(),                  // Unix timestamp
  })
    .index("by_user_id", ["userId"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_stripe_customer_id", ["stripeCustomerId"])
    .index("by_created_at", ["createdAt"]),

  verificationCodes: defineTable({
    key: v.string(),                        // Email or userId (unique identifier)
    code: v.string(),                        // 6-digit verification code
    type: v.union(
      v.literal("password_reset"),
      v.literal("password_change")
    ),
    expiresAt: v.number(),                  // Unix timestamp
    attempts: v.number(),                    // Number of verification attempts
    createdAt: v.number(),                  // Unix timestamp
  })
    .index("by_key", ["key"])
    .index("by_expires_at", ["expiresAt"]),

  rateLimits: defineTable({
    key: v.string(),                        // email:ip combination
    action: v.string(),                      // Action being rate limited (e.g., "password_reset")
    count: v.number(),                       // Number of attempts
    resetTime: v.number(),                   // Unix timestamp when limit resets
    createdAt: v.number(),                  // Unix timestamp
  })
    .index("by_key", ["key"])
    .index("by_reset_time", ["resetTime"]),
});
