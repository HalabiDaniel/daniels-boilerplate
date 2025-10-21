'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { UploadButton, UploadResult } from '@/components/daniels-elements/elements/upload-elements';
import { ALLOWED_FILE_TYPES } from '@/lib/file-validator';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2, Upload, User, Save } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch user data from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Initialize name field when user data loads
  React.useEffect(() => {
    if (user && !name) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setName(fullName);
    }
  }, [user, name]);

  const handleProfilePictureUpload = async (result: UploadResult) => {
    if (!result.success || !result.url) {
      toast.error('Failed to upload profile picture');
      return;
    }

    setIsUploadingImage(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profilePictureUrl: result.url,
          profilePicturePublicId: result.publicId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Profile picture update error:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleProfilePictureError = (error: string) => {
    toast.error(error);
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return firstName.charAt(0) + lastName.charAt(0) || 'U';
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
        Profile Settings
      </h1>
      <p className="text-muted-foreground mb-8">Manage your account and profile details here.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture Section */}
        <div className="rounded-2xl p-8 bg-card border">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile Picture</h2>
          </div>

          <div className="text-center space-y-6">
            {/* Current Profile Picture */}
            <div className="flex justify-center">
              {convexUser?.profilePictureUrl ? (
                <Image
                  src={convexUser.profilePictureUrl}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-full object-cover border-4 border-border"
                />
              ) : (
                <div
                  className="h-32 w-32 rounded-full flex items-center justify-center text-white text-4xl font-semibold border-4 border-border"
                  style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
                >
                  {getUserInitials()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP (Max 5MB)
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center">
              <UploadButton
                buttonText={isUploadingImage ? "Updating..." : "Upload New Picture"}
                buttonVariant="default"
                allowedFileTypes={ALLOWED_FILE_TYPES.images}
                maxSizeMB={5}
                disabled={isUploadingImage}
                optimizationRules={{
                  width: 256,
                  height: 256,
                  quality: 90,
                  format: 'auto',
                  crop: 'fill',
                  gravity: 'face',
                }}
                onUploadComplete={handleProfilePictureUpload}
                onUploadError={handleProfilePictureError}
              />
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="rounded-2xl p-8 bg-card border">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile Details</h2>
          </div>

          <form onSubmit={handleNameUpdate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                disabled={isUpdatingProfile}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.emailAddresses?.[0]?.emailAddress || ''}
                className="w-full px-4 py-2.5 rounded-md border border-border bg-muted text-muted-foreground cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            <Button
              type="submit"
              disabled={isUpdatingProfile || !name.trim()}
              className="w-full"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating Profile...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
