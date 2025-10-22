import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST /api/admin/toggle-auto-renew
 * Toggles auto-renew on/off for a subscription
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate the requesting user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify admin status
    const adminCheck = await convex.query(api.admins.isAdmin, {
      clerkId: userId,
    });

    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { subscriptionId, autoRenew } = body;

    if (!subscriptionId || typeof autoRenew !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !autoRenew,
    });

    // Update Convex database
    const stripeCustomerId = subscription.customer as string;
    const user = await convex.query((api as any).users.getUserByStripeCustomerId, {
      stripeCustomerId,
    });

    if (user) {
      await convex.mutation((api as any).users.updateSubscriptionFromWebhook, {
        stripeCustomerId,
        subscriptionPlanId: user.subscriptionPlanId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: autoRenew ? 'active' : 'canceled',
        currentPeriodEnd: user.currentPeriodEnd,
        autoRenew,
      });
    }

    return NextResponse.json({
      success: true,
      autoRenew,
      message: autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled',
    });

  } catch (error) {
    console.error('Error toggling auto-renew:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update auto-renew status' },
      { status: 500 }
    );
  }
}
