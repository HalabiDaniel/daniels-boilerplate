import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import PageTitle from '@/components/layouts/page-title';
import PasswordResetForm from '@/components/reset-password/password-reset-form';

export default async function ResetPasswordPage() {
  // Check if user is already logged in
  const { userId } = await auth();
  
  // Redirect logged-in users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-[#F4F7F3] dark:bg-neutral-900">
      <PageTitle
        pillText="Password Reset"
        pageTitle="Forgot Your"
        pageTitleHighlighted="Password?"
        description="No worries. Enter your email address and we'll send you a verification code to reset it securely."
      />
      <PasswordResetForm />
    </div>
  );
}
