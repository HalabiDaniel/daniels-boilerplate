import cloudinary from './cloudinary-config';
import { UploadApiResponse } from 'cloudinary';

/**
 * Optimization rules for file uploads
 */
export interface OptimizationRules {
  width?: number;
  height?: number;
  quality?: 'auto' | number; // 1-100 or 'auto'
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  crop?: 'fill' | 'fit' | 'scale' | 'limit';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Options for uploading files to Cloudinary
 */
export interface UploadOptions {
  folder?: string;
  optimizationRules?: OptimizationRules;
  resourceType?: 'image' | 'raw' | 'video' | 'auto';
}

/**
 * Result of a successful upload operation
 */
export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

/**
 * Result of a delete operation
 */
export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Builds a transformation string from optimization rules
 * Converts OptimizationRules to Cloudinary transformation parameters
 */
export function buildTransformationString(rules: OptimizationRules): Record<string, any> {
  const transformation: Record<string, any> = {};

  if (rules.width) {
    transformation.width = rules.width;
  }

  if (rules.height) {
    transformation.height = rules.height;
  }

  if (rules.quality) {
    transformation.quality = rules.quality;
  }

  if (rules.format) {
    transformation.fetch_format = rules.format;
  }

  if (rules.crop) {
    transformation.crop = rules.crop;
  }

  if (rules.gravity) {
    transformation.gravity = rules.gravity;
  }

  return transformation;
}

/**
 * Uploads a file to Cloudinary with optional optimization rules
 * @param fileBuffer - The file buffer to upload
 * @param options - Upload options including folder and optimization rules
 * @returns Promise with upload result
 */
export async function uploadFile(
  fileBuffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Build upload options
    const uploadOptions: Record<string, any> = {
      resource_type: options.resourceType || 'auto',
    };

    // Add folder if specified
    if (options.folder) {
      uploadOptions.folder = options.folder;
    }

    // Apply optimization rules if provided
    if (options.optimizationRules) {
      const transformation = buildTransformationString(options.optimizationRules);
      if (Object.keys(transformation).length > 0) {
        uploadOptions.transformation = transformation;
      }
    }

    // Upload to Cloudinary using upload_stream
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    let errorMessage = 'Failed to upload file to Cloudinary';
    if (error instanceof Error) {
      errorMessage = `Upload failed: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Deletes a file from Cloudinary using its public ID
 * @param publicId - The Cloudinary public ID of the file to delete
 * @returns Promise with delete result
 */
export async function deleteFile(publicId: string): Promise<DeleteResult> {
  try {
    if (!publicId) {
      return {
        success: false,
        error: 'Public ID is required for deletion',
      };
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: `Deletion failed: ${result.result}`,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    
    let errorMessage = 'Failed to delete file from Cloudinary';
    if (error instanceof Error) {
      errorMessage = `Delete failed: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
