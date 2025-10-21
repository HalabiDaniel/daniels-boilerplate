import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { deleteFile } from '@/lib/cloudinary-service';

/**
 * DELETE /api/delete
 * Handles file deletion from Cloudinary and database
 * Requires authentication via Clerk
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { uploadId } = body;
    
    if (!uploadId) {
      return NextResponse.json(
        { success: false, error: 'Upload ID is required', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Fetch upload record from Convex
    const upload = await convex.query(api.uploads.getUploadById, {
      uploadId: uploadId as Id<"uploads">,
    });

    if (!upload) {
      return NextResponse.json(
        { success: false, error: 'Upload not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Verify user ownership
    if (upload.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Permission denied: You can only delete your own uploads', code: 'PERMISSION_DENIED' },
        { status: 403 }
      );
    }

    // Delete file from Cloudinary
    const deleteResult = await deleteFile(upload.cloudinaryPublicId);

    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, error: deleteResult.error || 'Failed to delete file from Cloudinary', code: 'DELETE_FAILED' },
        { status: 500 }
      );
    }

    // Delete record from Convex
    await convex.mutation(api.uploads.deleteUpload, {
      uploadId: uploadId as Id<"uploads">,
      userId,
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Delete API error:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage, code: 'DELETE_FAILED' },
      { status: 500 }
    );
  }
}
