import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Special mutation for creating the first admin or adding admins via script
 * This bypasses the permission check that requires an existing Full Access admin
 * 
 * ⚠️ WARNING: This should only be used by trusted scripts/processes
 * In production, consider adding additional security measures
 */
export const createAdminDirect = mutation({
  args: {
    clerkId: v.string(),
    userId: v.id("users"),
    email: v.string(),
    name: v.string(),
    accessLevel: v.union(
      v.literal("Full Access"),
      v.literal("Partial Access"),
      v.literal("Limited Access")
    ),
    accountCreatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate required fields
    if (!args.clerkId || !args.userId || !args.email || !args.name) {
      throw new Error("Missing required fields");
    }
    
    // Validate access level
    const validAccessLevels = ["Full Access", "Partial Access", "Limited Access"];
    if (!validAccessLevels.includes(args.accessLevel)) {
      throw new Error("Invalid access level");
    }
    
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }
    
    const now = Date.now();
    
    // Create admin record
    const adminId = await ctx.db.insert("admins", {
      clerkId: args.clerkId,
      userId: args.userId,
      email: args.email,
      name: args.name,
      accessLevel: args.accessLevel,
      accountCreatedAt: args.accountCreatedAt,
      becameAdminAt: now,
      createdAt: now,
      updatedAt: now,
    });
    
    return adminId;
  },
});
