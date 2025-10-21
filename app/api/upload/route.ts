import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { uploadFile, OptimizationRules } from '@/lib/cloudinary-service';
import { validateFile, ALLOWED_FILE_TYPES } from '@/lib/file-validator';

/**
 * POST /api/upload
 * Handles file uploads to Cloudinary with optional optimization rules
 * Requires authentication via Clerk
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided', code: 'INVALID_FILE' },
        { status: 400 }
      );
    }

    // Extract metadata and options from FormData
    const allowedTypesStr = formData.get('allowedTypes') as string | null;
    const maxSizeMBStr = formData.get('maxSizeMB') as string | null;
    const optimizationRulesStr = formData.get('optimizationRules') as string | null;
    const description = formData.get('description') as string | null;
    const folder = formData.get('folder') as string | null;

    // Parse allowed types (default to all images)
    let allowedTypes: string[] = [...ALLOWED_FILE_TYPES.images];
    if (allowedTypesStr) {
      try {
        allowedTypes = JSON.parse(allowedTypesStr);
      } catch (e) {
        return NextResponse.json(
          { success: false, error: 'Invalid allowedTypes format', code: 'INVALID_FILE' },
          { status: 400 }
        );
      }
    }

    // Parse max size (default to 10MB)
    const maxSizeMB = maxSizeMBStr ? parseFloat(maxSizeMBStr) : 10;

    // Validate file
    const validation = validateFile(file, allowedTypes, maxSizeMB);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error, code: 'INVALID_FILE' },
        { status: 400 }
      );
    }

    // Parse optimization rules if provided
    let optimizationRules: OptimizationRules | undefined;
    if (optimizationRulesStr) {
      try {
        optimizationRules = JSON.parse(optimizationRulesStr);
      } catch (e) {
        return NextResponse.json(
          { success: false, error: 'Invalid optimizationRules format', code: 'INVALID_FILE' },
          { status: 400 }
        );
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await uploadFile(buffer, {
      folder: folder || undefined,
      optimizationRules,
      resourceType: 'auto',
    });

    if (!uploadResult.success || !uploadResult.url || !uploadResult.publicId) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'Upload failed', code: 'UPLOAD_FAILED' },
        { status: 500 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Create upload record in Convex
    const uploadId = await convex.mutation(api.uploads.createUpload, {
      userId,
      filename: file.name,
      cloudinaryUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
      fileType: file.type,
      fileSize: uploadResult.bytes || file.size,
      description: description || undefined,
      width: uploadResult.width,
      height: uploadResult.height,
    });

    return NextResponse.json({
      success: true,
      uploadId,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage, code: 'UPLOAD_FAILED' },
      { status: 500 }
    );
  }
}
