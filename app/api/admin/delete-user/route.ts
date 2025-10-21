import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import Stripe from 'stripe';

/**
 * DELETE /api/admin/delete-user
 * Completely deletes a user from all systems (Clerk, Convex, Stripe)
 * Requires Full Access admin authentication
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the requesting user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Convex client to check admin status
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Verify the requesting user is a Full Access admin
    const adminCheck = await convex.query(api.admins.isAdmin, {
      clerkId: userId,
    });
    
    if (!adminCheck.isAdmin || adminCheck.accessLevel !== 'Full Access') {
      return NextResponse.json(
        { error: 'Forbidden: Only Full Access admins can delete users' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { clerkId: targetClerkId } = body;

    // Validate required fields
    if (!targetClerkId) {
      return NextResponse.json(
        { error: 'Missing required field: clerkId' },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (targetClerkId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own user account' },
        { status: 403 }
      );
    }

    // Get the target user from Convex to get the user ID
    const targetUser = await convex.query(api.users.getUserByClerkId, {
      clerkId: targetClerkId,
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize cleanup results tracking
    const cleanupResults = {
      convex: false,
      clerk: false,
      stripe: false,
    };
    
    const errors: string[] = [];
    let deletedUserData: {
      clerkId?: string;
      email?: string;
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
    } | null = null;

    try {
      // Step 1: Delete user from Convex (this also returns user data for external cleanup)
      const convexResult = await convex.mutation(api.users.deleteUserCompletely, {
        userId: targetUser._id,
        adminClerkId: userId,
      });
      
      cleanupResults.convex = true;
      deletedUserData = convexResult.deletedUser;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown Convex error';
      errors.push(`Convex deletion failed: ${errorMessage}`);
      
      // If Convex deletion fails, we can't proceed with other deletions
      return NextResponse.json({
        success: false,
        error: 'User deletion failed at database level',
        details: errors,
        cleanupResults,
      }, { status: 500 });
    }

    // Step 2: Delete user from Clerk
    if (deletedUserData?.clerkId) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(deletedUserData.clerkId);
        cleanupResults.clerk = true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Clerk error';
        errors.push(`Clerk deletion failed: ${errorMessage}`);
      }
    }

    // Step 3: Delete Stripe customer and subscription data
    if (deletedUserData?.stripeCustomerId && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-12-18.acacia',
        });

        // Cancel active subscription if exists
        if (deletedUserData.stripeSubscriptionId) {
          try {
            await stripe.subscriptions.cancel(deletedUserData.stripeSubscriptionId);
          } catch (subError) {
            // Subscription might already be cancelled or not exist, continue with customer deletion
            console.warn('Subscription cancellation warning:', subError);
          }
        }

        // Delete Stripe customer
        await stripe.customers.del(deletedUserData.stripeCustomerId);
        cleanupResults.stripe = true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Stripe error';
        errors.push(`Stripe deletion failed: ${errorMessage}`);
      }
    } else if (deletedUserData?.stripeCustomerId && !process.env.STRIPE_SECRET_KEY) {
      errors.push('Stripe deletion skipped: STRIPE_SECRET_KEY not configured');
    }

    // Determine overall success
    const isFullSuccess = cleanupResults.convex && cleanupResults.clerk && 
                         (cleanupResults.stripe || !deletedUserData?.stripeCustomerId);
    
    const responseStatus = isFullSuccess ? 200 : (cleanupResults.convex ? 207 : 500);
    
    return NextResponse.json({
      success: isFullSuccess,
      message: isFullSuccess 
        ? `User ${deletedUserData?.email} successfully deleted from all systems`
        : 'User deletion completed with some failures',
      cleanupResults,
      errors: errors.length > 0 ? errors : undefined,
      deletedUser: {
        email: deletedUserData?.email,
        clerkId: deletedUserData?.clerkId,
        hadStripeData: !!deletedUserData?.stripeCustomerId,
      },
    }, { status: responseStatus });

  } catch (error) {
    console.error('Delete user API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to delete user: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error during user deletion' },
      { status: 500 }
    );
  }
}