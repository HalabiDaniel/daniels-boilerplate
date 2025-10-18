import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { getPlanById } from '@/lib/subscription-plans';

// Initialize Stripe (use account's default API version)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Parse request body
    const body = await req.json();
    const { planId, billingPeriod } = body;

    // Validate plan ID and billing period
    if (!planId || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing planId or billingPeriod' },
        { status: 400 }
      );
    }

    if (billingPeriod !== 'monthly' && billingPeriod !== 'annual') {
      return NextResponse.json(
        { error: 'Invalid billingPeriod. Must be "monthly" or "annual"' },
        { status: 400 }
      );
    }

    // Get plan from subscription-plans.ts
    const plan = getPlanById(planId);
    
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // Get the appropriate Stripe price ID
    const priceId = billingPeriod === 'monthly' 
      ? plan.stripePriceIdMonthly 
      : plan.stripePriceIdAnnual;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Plan does not have a Stripe price ID configured' },
        { status: 400 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Fetch user from Convex by Clerk ID
    const user = await convex.query((api as any).users.getUserByClerkId, {
      clerkId: userId,
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer with Clerk metadata
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          clerkId: userId,
        },
      });
      customerId = customer.id;

      // Save the Stripe customer ID to Convex
      await convex.mutation((api as any).users.upsertUser, {
        clerkId: userId,
        email: user.email,
        stripeCustomerId: customerId,
      });

      console.log(`Created and saved Stripe customer ${customerId} for user ${userId}`);
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        clerkId: userId,
        planId: planId,
      },
      subscription_data: {
        metadata: {
          clerkId: userId,
          planId: planId,
        },
      },
    });

    // Return checkout session URL
    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
