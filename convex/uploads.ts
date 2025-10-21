import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Create a new upload record in the database
 */
export const createUpload = mutation({
  args: {
    userId: v.string(),
    filename: v.string(),
    cloudinaryUrl: v.string(),
    cloudinaryPublicId: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    description: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const uploadId = await ctx.db.insert("uploads", {
      userId: args.userId,
      filename: args.filename,
      cloudinaryUrl: args.cloudinaryUrl,
      cloudinaryPublicId: args.cloudinaryPublicId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      description: args.description,
      width: args.width,
      height: args.height,
      createdAt: now,
      updatedAt: now,
    });

    return uploadId;
  },
});

/**
 * Update upload metadata (filename and description)
 */
export const updateUploadMetadata = mutation({
  args: {
    uploadId: v.id("uploads"),
    userId: v.string(),
    filename: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch the upload record
    const upload = await ctx.db.get(args.uploadId);
    
    if (!upload) {
      throw new Error("Upload not found");
    }

    // Verify user ownership
    if (upload.userId !== args.userId) {
      throw new Error("Permission denied: You can only update your own uploads");
    }

    // Build update object with only provided fields
    const updates: {
      filename?: string;
      description?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.filename !== undefined) {
      updates.filename = args.filename;
    }

    if (args.description !== undefined) {
      updates.description = args.description;
    }

    await ctx.db.patch(args.uploadId, updates);
  },
});

/**
 * Delete an upload record from the database
 */
export const deleteUpload = mutation({
  args: {
    uploadId: v.id("uploads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch the upload record
    const upload = await ctx.db.get(args.uploadId);
    
    if (!upload) {
      throw new Error("Upload not found");
    }

    // Verify user ownership
    if (upload.userId !== args.userId) {
      throw new Error("Permission denied: You can only delete your own uploads");
    }

    await ctx.db.delete(args.uploadId);
  },
});

/**
 * Get all uploads for a specific user
 */
export const getUserUploads = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const uploads = await ctx.db
      .query("uploads")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return uploads;
  },
});

/**
 * Get a single upload by ID
 */
export const getUploadById = query({
  args: {
    uploadId: v.id("uploads"),
  },
  handler: async (ctx, args) => {
    const upload = await ctx.db.get(args.uploadId);
    return upload;
  },
});

/**
 * Get uploads for a user filtered by file type
 */
export const getUserUploadsByType = query({
  args: {
    userId: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const uploads = await ctx.db
      .query("uploads")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("fileType"), args.fileType))
      .order("desc")
      .collect();

    return uploads;
  },
});
