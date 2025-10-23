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
import { Loader2, Upload, User, Save, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { PasswordResetCard } from './password-reset-card';

export default function MyAccountPage() {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Account deleted successfully. Redirecting...');
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to delete account');
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
        My Account
      </h1>
      <p className="text-muted-foreground mb-8">Manage your account and profile details here.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture Section */}
        <div className="rounded-2xl p-8 bg-card border">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="h-5 w-5 text-primary" />
            <h5 className="text-sm md:text-xl font-semibold text-foreground">
                  Profile Picture
                </h5>
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
            <h5 className="text-sm md:text-xl font-semibold text-foreground">
                  Account Details
                </h5>
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

      {/* Password Reset Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <PasswordResetCard />
      </div>

      {/* Danger Zone Section */}
      <div className="mt-6">
        <Accordion type="single" collapsible className="rounded-2xl bg-card border">
          <AccordionItem value="danger-zone" className="border-none">
            <AccordionTrigger className="px-8 py-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h5 className="text-sm md:text-xl font-semibold text-foreground">
                  Danger Zone: Delete your account
                </h5>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  As per our Privacy Policy, you have the right to request account and data 
                  deletion at any time, ensuring full control over your personal information 
                  and data rights. Deleting your account is permanent and cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Account
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Delete Your Account
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete your account? This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              aria-label="Cancel deletion and close dialog"
              className="px-6 py-3 h-11 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              aria-label={isDeleting ? 'Deleting your account...' : 'Confirm account deletion'}
              className="px-6 py-3 h-11 text-sm font-medium"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                  <span>Deleting account...</span>
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
