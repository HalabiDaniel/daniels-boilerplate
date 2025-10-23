import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set a verification code for a key (email or userId)
export const setCode = mutation({
  args: {
    key: v.string(),
    code: v.string(),
    type: v.union(v.literal("password_reset"), v.literal("password_change")),
    expiresInMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { key, code, type, expiresInMs = 10 * 60 * 1000 } = args;
    
    // Delete any existing code for this key
    const existingCode = await ctx.db
      .query("verificationCodes")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    
    if (existingCode) {
      await ctx.db.delete(existingCode._id);
    }
    
    // Create new verification code
    await ctx.db.insert("verificationCodes", {
      key,
      code,
      type,
      expiresAt: Date.now() + expiresInMs,
      attempts: 0,
      createdAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Verify a code and increment attempts
export const verifyCode = mutation({
  args: {
    key: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { key, code } = args;
    
    const verificationCode = await ctx.db
      .query("verificationCodes")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    
    if (!verificationCode) {
      return { success: false, error: "Invalid or expired verification code" };
    }
    
    // Check if expired
    if (Date.now() > verificationCode.expiresAt) {
      await ctx.db.delete(verificationCode._id);
      return { success: false, error: "Verification code has expired" };
    }
    
    // Check attempts (max 5 attempts per code)
    if (verificationCode.attempts >= 5) {
      await ctx.db.delete(verificationCode._id);
      return { success: false, error: "Too many failed attempts" };
    }
    
    // Increment attempts
    await ctx.db.patch(verificationCode._id, {
      attempts: verificationCode.attempts + 1,
    });
    
    // Verify code
    if (verificationCode.code.trim() !== code.trim()) {
      return { success: false, error: "Invalid verification code" };
    }
    
    // Success - delete the code
    await ctx.db.delete(verificationCode._id);
    return { success: true };
  },
});

// Clean up expired codes (called periodically)
export const cleanupExpiredCodes = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredCodes = await ctx.db
      .query("verificationCodes")
      .withIndex("by_expires_at")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();
    
    for (const code of expiredCodes) {
      await ctx.db.delete(code._id);
    }
    
    return { deleted: expiredCodes.length };
  },
});

// Rate limiting functions
export const checkRateLimit = query({
  args: {
    key: v.string(),
    action: v.string(),
    maxAttempts: v.optional(v.number()),
    windowMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { key, action, maxAttempts = 10, windowMs = 3600000 } = args;
    const now = Date.now();
    
    const rateLimit = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", `${key}:${action}`))
      .first();
    
    if (!rateLimit || now > rateLimit.resetTime) {
      return { allowed: true, remaining: maxAttempts - 1 };
    }
    
    if (rateLimit.count >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }
    
    return { allowed: true, remaining: maxAttempts - rateLimit.count - 1 };
  },
});

export const incrementRateLimit = mutation({
  args: {
    key: v.string(),
    action: v.string(),
    maxAttempts: v.optional(v.number()),
    windowMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { key, action, maxAttempts = 10, windowMs = 3600000 } = args;
    const now = Date.now();
    const fullKey = `${key}:${action}`;
    
    const rateLimit = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", fullKey))
      .first();
    
    if (!rateLimit || now > rateLimit.resetTime) {
      // Create new rate limit entry
      if (rateLimit) {
        await ctx.db.delete(rateLimit._id);
      }
      
      await ctx.db.insert("rateLimits", {
        key: fullKey,
        action,
        count: 1,
        resetTime: now + windowMs,
        createdAt: now,
      });
      
      return { allowed: true, remaining: maxAttempts - 1 };
    }
    
    if (rateLimit.count >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }
    
    // Increment count
    await ctx.db.patch(rateLimit._id, {
      count: rateLimit.count + 1,
    });
    
    return { allowed: true, remaining: maxAttempts - rateLimit.count - 1 };
  },
});

// Clean up expired rate limits (called periodically)
export const cleanupExpiredRateLimits = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredLimits = await ctx.db
      .query("rateLimits")
      .withIndex("by_reset_time")
      .filter((q) => q.lt(q.field("resetTime"), now))
      .collect();
    
    for (const limit of expiredLimits) {
      await ctx.db.delete(limit._id);
    }
    
    return { deleted: expiredLimits.length };
  },
});
