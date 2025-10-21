'use client';

import { Button } from '@/components/ui/button';
import { Upload, Loader2, Check, AlertCircle, Cloud, X, FileIcon } from 'lucide-react';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { toast } from 'sonner';
import { validateFile, ALLOWED_FILE_TYPES } from '@/lib/file-validator';
import { OptimizationRules } from '@/lib/cloudinary-service';

/**
 * Props for the UploadButton component
 */
export interface UploadButtonProps {
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  optimizationRules?: OptimizationRules;
  allowedFileTypes?: readonly string[];
  maxSizeMB?: number;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  disabled?: boolean;
}

/**
 * Result of a successful upload operation
 */
export interface UploadResult {
  success: boolean;
  uploadId?: string;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload Button Component
 * Simple upload button with file selection, validation, and upload functionality
 */
export function UploadButton({
  onUploadComplete,
  onUploadError,
  optimizationRules,
  allowedFileTypes = ALLOWED_FILE_TYPES.all,
  maxSizeMB = 10,
  buttonText = 'Upload File',
  buttonVariant = 'default',
  disabled = false,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Triggers the hidden file input when button is clicked
   */
  const handleButtonClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Handles file selection and initiates upload
   */
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Client-side validation
    const validation = validateFile(file, [...allowedFileTypes], maxSizeMB);
    
    if (!validation.valid) {
      const errorMessage = validation.error || 'File validation failed';
      toast.error(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      return;
    }

    // Start upload
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Add optimization rules if provided
      if (optimizationRules) {
        formData.append('optimizationRules', JSON.stringify(optimizationRules));
      }

      // Call upload API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResult = await response.json();

      if (result.success) {
        setUploadSuccess(true);
        toast.success('File uploaded successfully!');
        
        if (onUploadComplete) {
          onUploadComplete(result);
        }

        // Reset success state after 2 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 2000);
      } else {
        const errorMessage = result.error || 'Upload failed';
        toast.error(errorMessage);
        
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Generate accept attribute for file input based on allowed types
   */
  const getAcceptAttribute = () => {
    if (allowedFileTypes.includes('*/*')) {
      return undefined;
    }
    return allowedFileTypes.join(',');
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={getAcceptAttribute()}
        className="hidden"
        aria-label="File input"
      />
      
      <Button
        variant={buttonVariant}
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        aria-label={isUploading ? 'Uploading file' : buttonText}
        className="relative"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : uploadSuccess ? (
          <>
            <Check className="h-4 w-4" />
            Uploaded!
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
    </>
  );
}

/**
 * Showcase component demonstrating UploadButton usage
 */
export function UploadButtonShowcase() {
  const handleUploadComplete = (result: UploadResult) => {
    console.log('Upload complete:', result);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Basic upload button */}
      <UploadButton
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Image upload with optimization */}
      <UploadButton
        buttonText="Upload Image"
        buttonVariant="outline"
        allowedFileTypes={ALLOWED_FILE_TYPES.images}
        maxSizeMB={5}
        optimizationRules={{
          width: 800,
          height: 600,
          quality: 'auto',
          format: 'auto',
          crop: 'limit',
        }}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Document upload */}
      <UploadButton
        buttonText="Upload Document"
        buttonVariant="secondary"
        allowedFileTypes={ALLOWED_FILE_TYPES.documents}
        maxSizeMB={10}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
}

/**
 * Props for the UploadCard component
 */
export interface UploadCardProps {
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  optimizationRules?: OptimizationRules;
  allowedFileTypes?: readonly string[];
  maxSizeMB?: number;
  title?: string;
  description?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

/**
 * Upload Card Component
 * Complete upload interface with drag-and-drop, file preview, and progress tracking
 */
export function UploadCard({
  onUploadComplete,
  onUploadError,
  optimizationRules,
  allowedFileTypes = ALLOWED_FILE_TYPES.all,
  maxSizeMB = 10,
  title = 'Upload File',
  description = 'Drag and drop a file here, or click to select',
  showPreview = true,
  disabled = false,
}: UploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles drag over event
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handles file drop event
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) {
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  /**
   * Triggers the hidden file input when select button is clicked
   */
  const handleSelectClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Handles file input change
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  /**
   * Processes selected file and creates preview if applicable
   */
  const handleFileSelection = (file: File) => {
    // Client-side validation
    const validation = validateFile(file, [...allowedFileTypes], maxSizeMB);

    if (!validation.valid) {
      const errorMessage = validation.error || 'File validation failed';
      toast.error(errorMessage);

      if (onUploadError) {
        onUploadError(errorMessage);
      }

      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  /**
   * Removes selected file and clears preview
   */
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handles file upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Add optimization rules if provided
      if (optimizationRules) {
        formData.append('optimizationRules', JSON.stringify(optimizationRules));
      }

      // Call upload API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResult = await response.json();

      if (result.success) {
        toast.success('File uploaded successfully!');

        if (onUploadComplete) {
          onUploadComplete(result);
        }

        // Clear selected file after successful upload
        handleRemoveFile();
      } else {
        const errorMessage = result.error || 'Upload failed';
        toast.error(errorMessage);

        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage);

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Generate accept attribute for file input based on allowed types
   */
  const getAcceptAttribute = () => {
    if (allowedFileTypes.includes('*/*')) {
      return undefined;
    }
    return allowedFileTypes.join(',');
  };

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={getAcceptAttribute()}
        className="hidden"
        aria-label="File input"
      />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-lg border-2 border-dashed p-8 text-center transition-colors
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }
            ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          onClick={handleSelectClick}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <Cloud className="h-12 w-12 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              {allowedFileTypes.includes('*/*') 
                ? `Max size: ${maxSizeMB}MB`
                : `Allowed types: ${allowedFileTypes.map(t => t.split('/')[1]).join(', ')} (Max ${maxSizeMB}MB)`
              }
            </div>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mt-4 space-y-3">
            {/* File Preview (for images) */}
            {previewUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* File Details */}
            <div className="flex items-start justify-between rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-start space-x-3">
                <FileIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                disabled={isUploading}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={disabled || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Showcase component demonstrating UploadCard usage
 */
export function UploadCardShowcase() {
  const handleUploadComplete = (result: UploadResult) => {
    console.log('Upload complete:', result);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="flex flex-wrap gap-6">
      {/* Basic upload card */}
      <UploadCard
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Image upload card with optimization */}
      <UploadCard
        title="Upload Image"
        description="Upload an image with automatic optimization"
        allowedFileTypes={ALLOWED_FILE_TYPES.images}
        maxSizeMB={5}
        showPreview={true}
        optimizationRules={{
          width: 1920,
          height: 1080,
          quality: 'auto',
          format: 'webp',
          crop: 'fill',
        }}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
}

// Code template for UploadButton
export const UPLOAD_BUTTON_CODE = `'use client';

import { UploadButton } from '@/components/daniels-elements/elements/upload-elements';
import { ALLOWED_FILE_TYPES } from '@/lib/file-validator';

export default function UploadButtonExample() {
  const handleUploadComplete = (result) => {
    console.log('Upload complete:', result);
    // Handle successful upload (e.g., update UI, store URL)
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // Handle upload error
  };

  return (
    <div>
      {/* Basic upload button */}
      <UploadButton
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Image upload with optimization */}
      <UploadButton
        buttonText="Upload Image"
        buttonVariant="outline"
        allowedFileTypes={ALLOWED_FILE_TYPES.images}
        maxSizeMB={5}
        optimizationRules={{
          width: 800,
          height: 600,
          quality: 'auto',
          format: 'auto',
          crop: 'limit',
        }}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Profile picture upload (square, optimized) */}
      <UploadButton
        buttonText="Upload Profile Picture"
        allowedFileTypes={ALLOWED_FILE_TYPES.images}
        maxSizeMB={5}
        optimizationRules={{
          width: 256,
          height: 256,
          quality: 90,
          format: 'auto',
          crop: 'fill',
          gravity: 'face',
        }}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
}`;

// Code template for UploadCard
export const UPLOAD_CARD_CODE = `'use client';

import { UploadCard } from '@/components/daniels-elements/elements/upload-elements';
import { ALLOWED_FILE_TYPES } from '@/lib/file-validator';

export default function UploadCardExample() {
  const handleUploadComplete = (result) => {
    console.log('Upload complete:', result);
    // Handle successful upload (e.g., update UI, store URL)
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // Handle upload error
  };

  return (
    <div>
      {/* Basic upload card */}
      <UploadCard
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Image upload card with optimization */}
      <UploadCard
        title="Upload Image"
        description="Upload an image with automatic optimization"
        allowedFileTypes={ALLOWED_FILE_TYPES.images}
        maxSizeMB={5}
        showPreview={true}
        optimizationRules={{
          width: 1920,
          height: 1080,
          quality: 'auto',
          format: 'webp',
          crop: 'fill',
        }}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {/* Document upload card */}
      <UploadCard
        title="Upload Document"
        description="Upload PDF or Word documents"
        allowedFileTypes={ALLOWED_FILE_TYPES.documents}
        maxSizeMB={10}
        showPreview={false}
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />
    </div>
  );
}`;
