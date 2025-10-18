import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  // Get the headers
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;
  const client = await clerkClient();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    switch (eventType) {
      case 'user.created':
        // Create user in Convex when they sign up
        const { id: clerkId, email_addresses } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        if (clerkId && primaryEmail) {
          await convex.mutation((api as any).users.upsertUser, {
            clerkId,
            email: primaryEmail,
            subscriptionPlanId: 'free',
          });
        }
        break;

      case 'user.updated':
        // Update user email if it changed
        const { id: userId, email_addresses: updatedEmails } = evt.data;
        const updatedPrimaryEmail = updatedEmails?.[0]?.email_address;

        if (userId && updatedPrimaryEmail) {
          await convex.mutation((api as any).users.upsertUser, {
            clerkId: userId,
            email: updatedPrimaryEmail,
          });
        }
        break;

      case 'subscription.created':
      case 'subscription.updated':
        // Update user metadata with subscription info
        const { user_id, plan_id, expires_at } = evt.data;
        
        await client.users.updateUserMetadata(user_id, {
          publicMetadata: {
            subscriptionPlan: plan_id,
            subscriptionExpiry: expires_at,
          },
        });
        break;

      case 'subscription.deleted':
        // Downgrade user to free plan
        const { user_id: subUserId } = evt.data;
        
        await client.users.updateUserMetadata(subUserId, {
          publicMetadata: {
            subscriptionPlan: 'free',
            subscriptionExpiry: null,
          },
        });
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
