import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get admin record by Clerk ID
 * Returns the admin record if found, null otherwise
 */
export const getAdminByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    return admin;
  },
});

/**
 * Check if a user is an admin and return their access level
 * Returns { isAdmin: boolean, accessLevel?: string, adminRecord?: object }
 */
export const isAdmin = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!admin) {
      return { isAdmin: false };
    }
    
    return {
      isAdmin: true,
      accessLevel: admin.accessLevel,
      adminRecord: admin,
    };
  },
});

/**
 * Get all admin records sorted by becameAdminAt (most recent first)
 * Includes user information from users table reference
 */
export const getAllAdmins = query({
  handler: async (ctx) => {
    const admins = await ctx.db
      .query("admins")
      .order("desc")
      .collect();
    
    // Sort by becameAdminAt descending (most recent first)
    const sortedAdmins = admins.sort((a, b) => b.becameAdminAt - a.becameAdminAt);
    
    // Fetch user information for each admin
    const adminsWithUserInfo = await Promise.all(
      sortedAdmins.map(async (admin) => {
        const user = await ctx.db.get(admin.userId);
        return {
          ...admin,
          user,
        };
      })
    );
    
    return adminsWithUserInfo;
  },
});

/**
 * Create a new admin record
 * Validates required fields and access level values
 * Only Full Access admins can create new admins
 */
export const createAdmin = mutation({
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
    currentUserClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the current user has Full Access permission
    const currentUserAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.currentUserClerkId))
      .first();
    
    if (!currentUserAdmin || currentUserAdmin.accessLevel !== "Full Access") {
      throw new Error("Only Full Access admins can create new admin accounts");
    }
    
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

/**
 * Update an admin's access level
 * Validates to prevent self-modification
 */
export const updateAdminAccessLevel = mutation({
  args: {
    adminId: v.id("admins"),
    newAccessLevel: v.union(
      v.literal("Full Access"),
      v.literal("Partial Access"),
      v.literal("Limited Access")
    ),
    currentUserClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the admin record to update
    const adminToUpdate = await ctx.db.get(args.adminId);
    
    if (!adminToUpdate) {
      throw new Error("Admin not found");
    }
    
    // Prevent self-modification
    if (adminToUpdate.clerkId === args.currentUserClerkId) {
      throw new Error("Cannot modify your own access level");
    }
    
    // Validate new access level
    const validAccessLevels = ["Full Access", "Partial Access", "Limited Access"];
    if (!validAccessLevels.includes(args.newAccessLevel)) {
      throw new Error("Invalid access level");
    }
    
    // Verify the current user has Full Access permission
    const currentUserAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.currentUserClerkId))
      .first();
    
    if (!currentUserAdmin || currentUserAdmin.accessLevel !== "Full Access") {
      throw new Error("Only Full Access admins can modify access levels");
    }
    
    // Update the admin record
    await ctx.db.patch(args.adminId, {
      accessLevel: args.newAccessLevel,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

/**
 * Delete an admin record
 * Validates to prevent last Full Access admin deletion and self-deletion
 */
export const deleteAdmin = mutation({
  args: {
    adminId: v.id("admins"),
    currentUserClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the admin record to delete
    const adminToDelete = await ctx.db.get(args.adminId);
    
    if (!adminToDelete) {
      throw new Error("Admin not found");
    }
    
    // Prevent self-deletion
    if (adminToDelete.clerkId === args.currentUserClerkId) {
      throw new Error("Cannot delete your own admin account");
    }
    
    // Verify the current user has Full Access permission
    const currentUserAdmin = await ctx.db
      .query("admins")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.currentUserClerkId))
      .first();
    
    if (!currentUserAdmin || currentUserAdmin.accessLevel !== "Full Access") {
      throw new Error("Only Full Access admins can delete admin accounts");
    }
    
    // If deleting a Full Access admin, check if they're the last one
    if (adminToDelete.accessLevel === "Full Access") {
      const fullAccessAdmins = await ctx.db
        .query("admins")
        .withIndex("by_access_level", (q) => q.eq("accessLevel", "Full Access"))
        .collect();
      
      if (fullAccessAdmins.length <= 1) {
        throw new Error("Cannot delete the last Full Access administrator");
      }
    }
    
    // Delete the admin record
    await ctx.db.delete(args.adminId);
    
    return { success: true };
  },
});
