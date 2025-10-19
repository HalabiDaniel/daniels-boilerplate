'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { canAccessPage, getUnauthorizedMessage, type AdminPage } from '@/lib/admin-access-control';

interface AccessControlWrapperProps {
  children: React.ReactNode;
  requiredPage: AdminPage;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that checks if the current admin has access to a specific page
 * Redirects to /admin with error message if unauthorized
 */
export function AccessControlWrapper({ 
  children, 
  requiredPage,
  fallback 
}: AccessControlWrapperProps) {
  const { user } = useUser();
  const router = useRouter();

  // Fetch admin data from Convex
  const adminData = useQuery(
    api.admins.getAdminByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Loading state
  const isLoading = user && adminData === undefined;

  // Check access
  const hasAccess = adminData ? canAccessPage(adminData.accessLevel, requiredPage) : false;

  useEffect(() => {
    // Only redirect if we have loaded the data and user doesn't have access
    if (!isLoading && adminData !== undefined && !hasAccess) {
      // Redirect to admin dashboard with error message
      const message = getUnauthorizedMessage(adminData?.accessLevel, requiredPage);
      router.push(`/admin?error=${encodeURIComponent(message)}`);
    }
  }, [isLoading, adminData, hasAccess, requiredPage, router]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if no access
  if (!hasAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            {getUnauthorizedMessage(adminData?.accessLevel, requiredPage)}
          </p>
        </div>
      </div>
    );
  }

  // Render children if access is granted
  return <>{children}</>;
}
