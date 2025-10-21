/**
 * File Validation Utilities
 * Provides validation functions for file uploads including type checking,
 * size validation, and file categorization.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type FileCategory = 'image' | 'document' | 'video' | 'audio' | 'other';

/**
 * Common file type groups for easy configuration
 */
export const ALLOWED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ],
  videos: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm'
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac'
  ],
  all: ['*/*']
} as const;

/**
 * Validates if a file's MIME type is in the allowed types list
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types (e.g., ['image/jpeg', 'image/png'])
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): ValidationResult {
  // If all types are allowed, skip validation
  if (allowedTypes.includes('*/*')) {
    return { valid: true };
  }

  const fileType = file.type.toLowerCase();

  // Check if the file's MIME type is in the allowed list
  const isAllowed = allowedTypes.some(type => {
    const normalizedType = type.toLowerCase();
    return fileType === normalizedType;
  });

  if (!isAllowed) {
    const allowedTypesStr = allowedTypes.join(', ');
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${allowedTypesStr}`
    };
  }

  return { valid: true };
}

/**
 * Validates if a file's size is within the maximum allowed size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in megabytes
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number
): ValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const fileSizeBytes = file.size;

  if (fileSizeBytes > maxSizeBytes) {
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB} MB) exceeds maximum allowed size of ${maxSizeMB} MB`
    };
  }

  return { valid: true };
}

/**
 * Categorizes a file based on its MIME type
 * @param mimeType - The MIME type of the file (e.g., 'image/jpeg')
 * @returns FileCategory - The category of the file
 */
export function getFileCategory(mimeType: string): FileCategory {
  const normalizedType = mimeType.toLowerCase();

  if (normalizedType.startsWith('image/')) {
    return 'image';
  }

  if (normalizedType.startsWith('video/')) {
    return 'video';
  }

  if (normalizedType.startsWith('audio/')) {
    return 'audio';
  }

  // Check if it's a document type
  const documentTypes = ALLOWED_FILE_TYPES.documents.map(t => t.toLowerCase());
  if (documentTypes.includes(normalizedType)) {
    return 'document';
  }

  return 'other';
}

/**
 * Validates a file against both type and size constraints
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSizeMB - Maximum file size in megabytes
 * @returns ValidationResult with valid status and optional error message
 */
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): ValidationResult {
  // Validate file type first
  const typeValidation = validateFileType(file, allowedTypes);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // Then validate file size
  const sizeValidation = validateFileSize(file, maxSizeMB);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return { valid: true };
}
