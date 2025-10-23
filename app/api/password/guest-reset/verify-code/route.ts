import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

  // Get IP address for rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  // Check rate limit using database
  const rateLimitKey = `${email.toLowerCase()}:${ip}`;
  const rateLimit = await convex.query(api.verificationCodes.checkRateLimit, {
    key: rateLimitKey,
    action: 'password_reset_verify',
  });
  
  if (!rateLimit.allowed) {
    console.log(`[SECURITY] Rate limit exceeded for password reset verification: ${email} from IP ${ip}`);
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }
  
  // Increment rate limit
  await convex.mutation(api.verificationCodes.incrementRateLimit, {
    key: rateLimitKey,
    action: 'password_reset_verify',
  });

  // Verify the code using database (this also deletes it if valid)
  const verificationResult = await convex.mutation(api.verificationCodes.verifyCode, {
    key: email.toLowerCase(),
    code,
  });
  
  if (!verificationResult.success) {
    console.log(`[SECURITY] Failed password reset verification for ${email}: Invalid code`);
    return NextResponse.json(
      { success: false, error: verificationResult.error || 'Invalid verification code' },
      { status: 400 }
    );
  }

    // Get user from Clerk
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    const user = users.data[0];

    // Reset password
    try {
      await client.users.updateUser(user.id, {
        password: newPassword,
      });

      console.log(`[SECURITY] Password successfully reset for email ${email}`);
      return NextResponse.json(
        { success: true, message: 'Password reset successfully' },
        { status: 200 }
      );
    } catch (error: any) {
      // Check if error is due to compromised password
      if (error.message?.includes('compromised') || error.message?.includes('breached')) {
        return NextResponse.json(
          { success: false, error: 'This password has been compromised. Please choose a different one.' },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Password reset verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
