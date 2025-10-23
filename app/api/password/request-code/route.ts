import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { generateVerificationCode } from '@/lib/verification-codes';
import { resend, isResendConfigured } from '@/lib/resend';
import { getPasswordResetEmailTemplate } from '@/lib/email-templates';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    const userName = user.firstName || 'User';
    
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Generate and store verification code in database
    const code = generateVerificationCode();
    await convex.mutation(api.verificationCodes.setCode, {
      key: userId,
      code,
      type: "password_change" as const,
    });

    // Log security event
    console.log(`[SECURITY] Password change code requested for user ${userId} (${email})`);

    // Send email with code using Resend (if configured)
    if (isResendConfigured && resend) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: email,
          subject: 'Password Change Verification Code',
          html: getPasswordResetEmailTemplate(userName, code),
        });
        console.log(`✅ Verification code sent to ${email}`);
      } catch (emailError: any) {
        console.error('Email sending error:', emailError);
        console.log(`⚠️ Fallback: Password change verification code for ${email}: ${code}`);
      }
    } else {
      // Resend not configured - log to console for development
      console.log('⚠️ RESEND_API_KEY not configured. Email not sent.');
      console.log(`📧 Password change verification code for ${email}: ${code}`);
      console.log('To enable email sending, add RESEND_API_KEY to your .env.local file');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request code error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
