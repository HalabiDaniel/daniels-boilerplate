import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

/**
 * PUT /api/profile
 * Updates user profile information in both Clerk and Convex
 */
export async function PUT(req: NextRequest) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, profilePictureUrl, profilePicturePublicId } = body;

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Update user in Clerk if name is provided
    if (name) {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const clerk = await clerkClient();
      await clerk.users.updateUser(userId, {
        firstName,
        lastName,
      });
    }

    // Update user profile in Convex
    await convex.mutation(api.users.updateUserProfile, {
      clerkId: userId,
      name: name || undefined,
      profilePictureUrl: profilePictureUrl || undefined,
      profilePicturePublicId: profilePicturePublicId || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    let errorMessage = 'Failed to update profile';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}