import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get full user details from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      );
    }

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
    
    if (!primaryEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Combine first and last name from Clerk
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || undefined;

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Try to fetch user from Convex
    let user = await convex.query((api as any).users.getUserByClerkId, {
      clerkId: userId,
    });

    // If user doesn't exist in Convex, create them
    if (!user) {
      console.log(`User ${userId} not found in Convex, creating...`);
      
      await convex.mutation((api as any).users.upsertUser, {
        clerkId: userId,
        email: primaryEmail,
        name: fullName,
        subscriptionPlanId: 'free',
      });

      // Fetch the newly created user
      user = await convex.query((api as any).users.getUserByClerkId, {
        clerkId: userId,
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      user: {
        clerkId: user.clerkId,
        email: user.email,
        subscriptionPlanId: user.subscriptionPlanId,
      }
    });
    
  } catch (error) {
    console.error('Error ensuring user sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
