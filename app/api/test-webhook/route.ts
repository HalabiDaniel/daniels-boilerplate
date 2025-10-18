import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/**
 * Test endpoint to manually trigger subscription update
 * This helps debug webhook issues by allowing manual testing
 * 
 * Usage: POST to /api/test-webhook with body:
 * {
 *   "clerkId": "user_xxx",
 *   "stripeCustomerId": "cus_xxx"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, stripeCustomerId } = body;

    if (!clerkId || !stripeCustomerId) {
      return NextResponse.json(
        { error: "Missing clerkId or stripeCustomerId" },
        { status: 400 }
      );
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Check if user exists
    const user = await convex.query((api as any).users.getUserByClerkId, {
      clerkId: clerkId,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in Convex" },
        { status: 404 }
      );
    }

    console.log("Current user data:", user);

    // Link Stripe customer if not already linked
    if (!user.stripeCustomerId || user.stripeCustomerId !== stripeCustomerId) {
      console.log(`Linking Stripe customer ${stripeCustomerId} to user ${clerkId}`);
      await convex.mutation((api as any).users.linkStripeCustomer, {
        clerkId: clerkId,
        stripeCustomerId: stripeCustomerId,
      });
    }

    // Fetch updated user
    const updatedUser = await convex.query((api as any).users.getUserByClerkId, {
      clerkId: clerkId,
    });

    return NextResponse.json({
      success: true,
      message: "Stripe customer linked successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in test webhook:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
