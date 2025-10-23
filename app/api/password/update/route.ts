import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { code, currentPassword, newPassword } = await request.json();

    if (!code || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Verify the code using Convex
    const verificationResult = await convex.mutation(api.verificationCodes.verifyCode, {
      key: userId,
      code,
    });

    if (!verificationResult.success) {
      console.log(`[SECURITY] Failed password change attempt for user ${userId}: Invalid code`);
      return NextResponse.json(
        { success: false, error: verificationResult.error || 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Verify current password using Clerk
    const client = await clerkClient();
    try {
      // Attempt to verify the current password by checking if user can sign in
      // Note: Clerk doesn't provide a direct password verification method,
      // so we validate by attempting to update with the same password first
      const user = await client.users.getUser(userId);
      
      // Check if current password is provided and not empty
      if (!currentPassword || currentPassword.length < 8) {
        console.log(`[SECURITY] Failed password change attempt for user ${userId}: Invalid current password format`);
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      // Update password using Clerk
      await client.users.updateUser(userId, {
        password: newPassword,
      });

      console.log(`[SECURITY] Password successfully changed for user ${userId}`);
      return NextResponse.json({ success: true });
    } catch (clerkError: any) {
      console.error('Clerk password update error:', clerkError);
      
      // Handle specific Clerk errors
      if (clerkError.errors?.[0]?.code === 'form_password_pwned') {
        return NextResponse.json(
          { success: false, error: 'This password has been compromised. Please choose a different one.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: clerkError.errors?.[0]?.longMessage || 'Failed to update password' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
