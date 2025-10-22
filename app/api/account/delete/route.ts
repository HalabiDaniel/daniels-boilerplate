import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

/**
 * DELETE /api/account/delete
 * Deletes user account completely:
 * 1. Cancels and deletes Stripe subscription
 * 2. Deletes Stripe customer
 * 3. Deletes data from Convex
 * 4. Deletes account from Clerk
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Get user data from Convex
    const convexUser = await convex.query(api.users.getUserByClerkId, {
      clerkId: userId,
    });

    if (!convexUser) {
      return NextResponse.json(
        { success: false, error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Step 1: Cancel and delete Stripe subscription if exists
    if (convexUser.stripeSubscriptionId && convexUser.stripeCustomerId) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        // Cancel the subscription immediately
        await stripe.subscriptions.cancel(convexUser.stripeSubscriptionId);
        
        console.log(`Cancelled Stripe subscription: ${convexUser.stripeSubscriptionId}`);
      } catch (stripeError) {
        console.error('Error cancelling Stripe subscription:', stripeError);
        // Continue with deletion even if Stripe fails
      }
    }

    // Step 2: Delete Stripe customer if exists
    if (convexUser.stripeCustomerId) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        await stripe.customers.del(convexUser.stripeCustomerId);
        
        console.log(`Deleted Stripe customer: ${convexUser.stripeCustomerId}`);
      } catch (stripeError) {
        console.error('Error deleting Stripe customer:', stripeError);
        // Continue with deletion even if Stripe fails
      }
    }

    // Step 3: Delete profile picture from Cloudinary if exists
    if (convexUser.profilePicturePublicId) {
      try {
        const cloudinary = require('cloudinary').v2;
        
        cloudinary.config({
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        await cloudinary.uploader.destroy(convexUser.profilePicturePublicId);
        
        console.log(`Deleted Cloudinary image: ${convexUser.profilePicturePublicId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting Cloudinary image:', cloudinaryError);
        // Continue with deletion even if Cloudinary fails
      }
    }

    // Step 4: Delete user data from Convex (including uploads)
    try {
      await convex.mutation(api.accountDeletion.deleteOwnAccount, {
        clerkId: userId,
      });
      
      console.log(`Deleted user data from Convex: ${userId}`);
    } catch (convexError) {
      console.error('Error deleting from Convex:', convexError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user data from database' },
        { status: 500 }
      );
    }

    // Step 5: Delete account from Clerk (this will also sign out the user)
    try {
      const clerk = await clerkClient();
      await clerk.users.deleteUser(userId);
      
      console.log(`Deleted Clerk user: ${userId}`);
    } catch (clerkError) {
      console.error('Error deleting from Clerk:', clerkError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete account from authentication system' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    
    let errorMessage = 'Failed to delete account';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
