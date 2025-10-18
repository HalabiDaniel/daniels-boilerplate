import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

// Initialize Stripe (use account's default API version)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found in request headers");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  console.log(`Received webhook event: ${event.type}`);

  // Parse webhook event type and handle accordingly
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Error processing webhook event ${event.type}:`, errorMessage);
    console.error(`Full error:`, err);
    return NextResponse.json(
      { error: `Webhook processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Helper: normalize current period end (ms) across Stripe API versions
function getCurrentPeriodEndMsFromSubscription(subscription: Stripe.Subscription): number | null {
  const topLevel = (subscription as any).current_period_end;
  const itemLevel = (subscription as any).items?.data?.[0]?.current_period_end;
  const seconds = typeof topLevel === "number" ? topLevel : typeof itemLevel === "number" ? itemLevel : undefined;
  if (typeof seconds !== "number") return null;
  return seconds * 1000;
}

// Handler for checkout.session.completed event
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Processing checkout.session.completed", session.id);

  try {
    // Extract customer ID and clerk ID from session
    const customerId = session.customer as string;
    const clerkId = session.metadata?.clerkId;
    
    if (!customerId) {
      console.error("Missing customer ID in checkout session");
      return;
    }

    // Link the Stripe customer to the Clerk user if we have the clerkId
    if (clerkId) {
      console.log(`Linking Stripe customer ${customerId} to Clerk user ${clerkId}`);
      const user = await convex.query((api as any).users.getUserByClerkId, {
        clerkId: clerkId,
      });

      if (user && !user.stripeCustomerId) {
        await convex.mutation((api as any).users.linkStripeCustomer, {
          clerkId: clerkId,
          stripeCustomerId: customerId,
        });
        console.log(`Successfully linked customer ${customerId} to user ${clerkId}`);
      }
    }

    // Note: The subscription details will be handled by customer.subscription.created event
    console.log(`Checkout completed for customer ${customerId}. Waiting for subscription.created event.`);
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error;
  }
}

// Handler for customer.subscription.created event
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.created", subscription.id);

  try {
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const clerkId = subscription.metadata?.clerkId;

    if (!customerId || !priceId) {
      console.error("Missing customer or price ID in subscription");
      return;
    }

    // Determine plan ID from price ID
    const { getPlanIdFromPriceId } = await import("@/lib/subscription-helpers");
    let planId = getPlanIdFromPriceId(priceId);

    // Fallback to metadata if price ID lookup fails
    if (!planId && subscription.metadata?.planId) {
      planId = subscription.metadata.planId;
    }

    if (!planId) {
      console.error("Could not determine plan ID from price or metadata");
      return;
    }

    // Extract current period end from subscription (convert to milliseconds)
    const currentPeriodEnd = getCurrentPeriodEndMsFromSubscription(subscription);
    if (currentPeriodEnd == null) {
      console.error("Missing current_period_end on subscription; cannot update Convex");
      return;
    }
    
    // Determine if subscription will auto-renew (not canceled at period end)
    const autoRenew = !(subscription as any).cancel_at_period_end;

    console.log(`Subscription created - ID: ${subscription.id}, Plan: ${planId}, Period End: ${currentPeriodEnd} (${new Date(currentPeriodEnd).toISOString()}), Auto-renew: ${autoRenew}`);

    // Ensure the user has the stripeCustomerId saved, then update subscription
    await ensureUserLinked(clerkId, customerId);
    await updateConvexSubscription({
      stripeCustomerId: customerId,
      clerkId,
      subscriptionPlanId: planId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      currentPeriodEnd,
      autoRenew,
    });

    console.log(`Successfully created subscription for customer ${customerId}`);
  } catch (error) {
    console.error("Error handling customer.subscription.created:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.updated", subscription.id);

  try {
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const clerkId = subscription.metadata?.clerkId;

    if (!customerId || !priceId) {
      console.error("Missing customer or price ID in subscription");
      return;
    }

    // Determine plan ID from price ID
    const { getPlanIdFromPriceId } = await import("@/lib/subscription-helpers");
    let planId = getPlanIdFromPriceId(priceId);
    if (!planId && subscription.metadata?.planId) {
      planId = subscription.metadata.planId;
    }
    if (!planId) {
      console.error("Could not determine plan ID from price or metadata");
      return;
    }

    // Extract current period end from subscription (convert to milliseconds)
    const currentPeriodEnd = getCurrentPeriodEndMsFromSubscription(subscription);
    if (currentPeriodEnd == null) {
      console.error("Missing current_period_end on subscription; cannot update Convex");
      return;
    }
    
    // Determine if subscription will auto-renew (not canceled at period end)
    const autoRenew = !(subscription as any).cancel_at_period_end;

    // Note: subscription.status will be "canceled" if user canceled but still has access until period end
    // The cancel_at_period_end flag indicates if it will cancel at the end of the period
    console.log(`Subscription status: ${subscription.status}, cancel_at_period_end: ${(subscription as any).cancel_at_period_end}, Period End: ${currentPeriodEnd} (${new Date(currentPeriodEnd).toISOString()}), Auto-renew: ${autoRenew}`);

    // Ensure link and update subscription details in Convex
    await ensureUserLinked(clerkId, customerId);
    await updateConvexSubscription({
      stripeCustomerId: customerId,
      clerkId,
      subscriptionPlanId: planId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: (subscription as any).cancel_at_period_end ? "canceled" : subscription.status,
      currentPeriodEnd,
      autoRenew,
    });

    console.log(`Successfully updated subscription ${subscription.id}`);
  } catch (error) {
    console.error("Error handling customer.subscription.updated:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.deleted", subscription.id);

  try {
    const customerId = subscription.customer as string;

    if (!customerId) {
      console.error("Missing customer ID in subscription");
      return;
    }

    // Downgrade user to free plan
    await convex.mutation((api as any).users.updateSubscriptionFromWebhook, {
      stripeCustomerId: customerId,
      subscriptionPlanId: "free",
      stripeSubscriptionId: "",
      subscriptionStatus: "canceled",
      currentPeriodEnd: 0,
      autoRenew: false,
    });

    console.log(`Successfully downgraded customer ${customerId} to free plan`);
  } catch (error) {
    console.error("Error handling customer.subscription.deleted:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Processing invoice.payment_succeeded", invoice.id);

  try {
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
    const subscriptionId = typeof (invoice as any).subscription === 'string' 
      ? (invoice as any).subscription 
      : (invoice as any).subscription?.id;

    if (!customerId || !subscriptionId) {
      console.error("Missing customer or subscription ID in invoice");
      return;
    }

    // Retrieve the subscription to get updated details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    const clerkId = subscription.metadata?.clerkId as string | undefined;

    if (!priceId) {
      console.error("No price ID found in subscription");
      return;
    }

    // Determine plan ID from price ID
    const { getPlanIdFromPriceId } = await import("@/lib/subscription-helpers");
    let planId = getPlanIdFromPriceId(priceId);
    if (!planId && subscription.metadata?.planId) {
      planId = subscription.metadata.planId as string;
    }
    if (!planId) {
      console.error("Could not determine plan ID from price or metadata");
      return;
    }

    // Extract current period end from subscription (convert to milliseconds)
    const currentPeriodEnd = getCurrentPeriodEndMsFromSubscription(subscription);
    if (currentPeriodEnd == null) {
      console.error("Missing current_period_end on subscription; cannot update Convex");
      return;
    }
    
    // Determine if subscription will auto-renew (not canceled at period end)
    const autoRenew = !((subscription as any).cancel_at_period_end as boolean);

    console.log(`Payment succeeded - Subscription renewed until ${new Date(currentPeriodEnd).toISOString()}, Auto-renew: ${autoRenew}`);

    // Ensure link and update subscription with new period end and active status
    await ensureUserLinked(clerkId, customerId);
    await updateConvexSubscription({
      stripeCustomerId: customerId,
      clerkId,
      subscriptionPlanId: planId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      currentPeriodEnd,
      autoRenew,
    });

    console.log(`Successfully renewed subscription ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling invoice.payment_succeeded:", error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Processing invoice.payment_failed", invoice.id);

  try {
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
    const subscriptionId = typeof (invoice as any).subscription === 'string' 
      ? (invoice as any).subscription 
      : (invoice as any).subscription?.id;

    if (!customerId || !subscriptionId) {
      console.error("Missing customer or subscription ID in invoice");
      return;
    }

    // Retrieve the subscription to get current details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    const clerkId = subscription.metadata?.clerkId as string | undefined;

    if (!priceId) {
      console.error("No price ID found in subscription");
      return;
    }

    // Determine plan ID from price ID
    const { getPlanIdFromPriceId } = await import("@/lib/subscription-helpers");
    let planId = getPlanIdFromPriceId(priceId);
    if (!planId && subscription.metadata?.planId) {
      planId = subscription.metadata.planId as string;
    }
    if (!planId) {
      console.error("Could not determine plan ID from price or metadata");
      return;
    }

    // Extract current period end from subscription (convert to milliseconds)
    const currentPeriodEnd = getCurrentPeriodEndMsFromSubscription(subscription);
    if (currentPeriodEnd == null) {
      console.error("Missing current_period_end on subscription; cannot update Convex");
      return;
    }
    
    // Determine if subscription will auto-renew (not canceled at period end)
    const autoRenew = !((subscription as any).cancel_at_period_end as boolean);

    console.log(`Payment failed - Period End: ${currentPeriodEnd} (${new Date(currentPeriodEnd).toISOString()}), Auto-renew: ${autoRenew}`);

    // Ensure link and update subscription status to past_due
    await ensureUserLinked(clerkId, customerId);
    await updateConvexSubscription({
      stripeCustomerId: customerId,
      clerkId,
      subscriptionPlanId: planId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "past_due",
      currentPeriodEnd,
      autoRenew,
    });

    console.log(`Successfully updated subscription ${subscriptionId} to past_due`);
  } catch (error) {
    console.error("Error handling invoice.payment_failed:", error);
    throw error;
  }
}

// Helper: ensure Convex user is linked to Stripe customer
async function ensureUserLinked(clerkId: string | undefined, customerId: string) {
  try {
    if (!clerkId) return;
    const user = await convex.query((api as any).users.getUserByClerkId, {
      clerkId,
    });
    if (user && !user.stripeCustomerId) {
      console.log(`Linking Stripe customer ${customerId} to Clerk user ${clerkId}`);
      await convex.mutation((api as any).users.linkStripeCustomer, {
        clerkId,
        stripeCustomerId: customerId,
      });
    }
  } catch (e) {
    console.error("Failed to ensure user is linked to Stripe customer", e);
  }
}

// Helper: update Convex subscription with optional retry if user isn't linked yet
async function updateConvexSubscription(
  args: {
    stripeCustomerId: string;
    clerkId?: string;
    subscriptionPlanId: string;
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    currentPeriodEnd: number;
    autoRenew: boolean;
  }
) {
  try {
    // Only send fields accepted by deployed Convex validator (no clerkId)
    await convex.mutation((api as any).users.updateSubscriptionFromWebhook, {
      stripeCustomerId: args.stripeCustomerId,
      subscriptionPlanId: args.subscriptionPlanId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus,
      currentPeriodEnd: args.currentPeriodEnd,
      autoRenew: args.autoRenew,
    });
    console.log("Successfully updated subscription in Convex");
  } catch (err: any) {
    const message = (err && err.message) || String(err);
    const missingUser = message.includes("User not found");
    console.error("Error updating subscription:", message);
    if (missingUser && args.clerkId) {
      console.warn("User not found. Attempting to link by clerkId and retry...");
      await ensureUserLinked(args.clerkId, args.stripeCustomerId);
      // Retry the mutation
      await convex.mutation((api as any).users.updateSubscriptionFromWebhook, {
        stripeCustomerId: args.stripeCustomerId,
        subscriptionPlanId: args.subscriptionPlanId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        subscriptionStatus: args.subscriptionStatus,
        currentPeriodEnd: args.currentPeriodEnd,
        autoRenew: args.autoRenew,
      });
      return;
    }
    throw err;
  }
}
