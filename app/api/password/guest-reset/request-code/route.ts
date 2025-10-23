import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { generateVerificationCode } from '@/lib/verification-codes';
import { resend, isResendConfigured } from '@/lib/resend';
import { getPasswordResetEmailTemplate } from '@/lib/email-templates';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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
    action: 'password_reset',
  });
  
  if (!rateLimit.allowed) {
    console.log(`[SECURITY] Rate limit exceeded for password reset: ${email} from IP ${ip}`);
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }
  
  // Increment rate limit
  await convex.mutation(api.verificationCodes.incrementRateLimit, {
    key: rateLimitKey,
    action: 'password_reset',
  });

  // Check if user exists in Clerk
  const client = await clerkClient();
  const users = await client.users.getUserList({
    emailAddress: [email],
  });

  // Always return the same message to prevent email enumeration
  const successMessage = 'If an account exists with this email, a verification code has been sent.';
  
  if (users.data.length === 0) {
    console.log(`[SECURITY] Password reset requested for non-existent email: ${email}`);
    // Return success to prevent email enumeration
    return NextResponse.json(
      { success: true, message: successMessage },
      { status: 200 }
    );
  }

  const user = users.data[0];
  const userName = user.firstName || 'User';

  // Generate and store verification code in database
  const code = generateVerificationCode();
  await convex.mutation(api.verificationCodes.setCode, {
    key: email.toLowerCase(),
    code,
    type: "password_reset" as const,
  });
  
  console.log(`[SECURITY] Password reset code generated for ${email}`);

    // Send email with code using Resend (if configured)
    if (isResendConfigured && resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: email,
          subject: 'Password Reset Verification Code',
          html: getPasswordResetEmailTemplate(userName, code),
        });
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        console.log(`⚠️ Fallback: Password reset verification code for ${email}: ${code}`);
      }
    } else {
      // Resend not configured - log to console for development
      console.log('⚠️ RESEND_API_KEY not configured. Email not sent.');
      console.log(`📧 Password reset verification code for ${email}: ${code}`);
      console.log('To enable email sending, add RESEND_API_KEY to your .env.local file');
    }

  return NextResponse.json(
    { success: true, message: successMessage },
    { status: 200 }
  );
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
