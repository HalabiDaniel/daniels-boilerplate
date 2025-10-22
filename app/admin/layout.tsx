'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { LayoutDashboard, Users, CreditCard, BarChart, Shield, Settings, Moon, Sun, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { ExpandableUserCard } from '@/components/layouts/expandable-user-card';
import { AdminMobileHeader } from '@/components/layouts/admin-mobile-header';
import { getPlanById, getDefaultPlan } from '@/lib/subscription-plans';
import { formatDateOnly } from '@/lib/subscription-helpers';

const adminPages = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, minAccess: 'Limited Access' },
  { name: 'Users', href: '/admin/users', icon: Users, minAccess: 'Limited Access' },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, minAccess: 'Partial Access' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart, minAccess: 'Limited Access' },
  { name: 'Admins', href: '/admin/administrators', icon: Shield, minAccess: 'Full Access' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, minAccess: 'Partial Access' },
];

const ACCESS_LEVEL_IMAGES = {
  "Full Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_4_tkhskv.png",
  "Partial Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_5_mgoqws.png",
  "Limited Access": "https://res.cloudinary.com/dbactyzwl/image/upload/v1760829597/Untitled_design_6_hb4omx.png"
};

// Helper function to check if user has access to a page
function hasAccessToPage(userAccessLevel: string, requiredAccess: string): boolean {
  const accessLevels = {
    "Full Access": 3,
    "Partial Access": 2,
    "Limited Access": 1
  };
  
  const userLevel = accessLevels[userAccessLevel as keyof typeof accessLevels] || 0;
  const requiredLevel = accessLevels[requiredAccess as keyof typeof accessLevels] || 0;
  
  // Full Access can access everything
  if (userLevel === 3) return true;
  
  // Partial Access can access everything except Full Access pages
  if (userLevel === 2 && requiredLevel <= 2) return true;
  
  // Limited Access can only access Limited Access pages
  if (userLevel === 1 && requiredLevel === 1) return true;
  
  return false;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-8 w-8 flex-shrink-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [retryCount, setRetryCount] = useState(0);
  const [isUserCardExpanded, setIsUserCardExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch admin data from Convex
  const adminData = useQuery(
    api.admins.getAdminByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Fetch user subscription data from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Loading state
  const isLoading = user && adminData === undefined;
  
  // Error state - if user is loaded but adminData is null after loading
  const hasError = user && adminData === null;

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    // Force re-render to retry the query
    window.location.reload();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return firstName.charAt(0) + lastName.charAt(0) || 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || 'User';
    const lastNameInitial = user.lastName ? user.lastName.charAt(0) + '.' : '';
    return `${firstName} ${lastNameInitial}`;
  };

  const getUserFullName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || 'User';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  const getUserEmail = () => {
    return user?.emailAddresses?.[0]?.emailAddress || 'No email';
  };

  // Filter navigation items based on access level
  const filteredAdminPages = adminPages.filter(page => {
    if (!adminData?.accessLevel) return false;
    return hasAccessToPage(adminData.accessLevel, page.minAccess);
  });

  // Admin access level card component
  const adminCard = isLoading ? (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
          <div className="h-3 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    </div>
  ) : hasError ? (
    <div className="border rounded-lg p-3 bg-card">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-xs font-medium">Failed to load admin data</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          className="w-full h-7 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  ) : adminData ? (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <Image
          src={ACCESS_LEVEL_IMAGES[adminData.accessLevel as keyof typeof ACCESS_LEVEL_IMAGES]}
          alt={adminData.accessLevel}
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{adminData.accessLevel}</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">No Access</p>
          <p className="text-xs text-muted-foreground">Not an admin</p>
        </div>
      </div>
    </div>
  );

  // Get user's subscription plan from Convex data
  const userPlan = convexUser?.subscriptionPlanId
    ? getPlanById(convexUser.subscriptionPlanId) || getDefaultPlan()
    : getDefaultPlan();

  // Format expiry date (just the date without prefix)
  const expiryText = convexUser?.currentPeriodEnd && convexUser.subscriptionPlanId !== 'free'
    ? formatDateOnly(convexUser.currentPeriodEnd)
    : 'No expiry';

  // Membership card
  const membershipCard = (convexUser === undefined || isLoading) ? (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24" />
          <div className="h-3 bg-muted animate-pulse rounded w-20" />
        </div>
      </div>
    </div>
  ) : (
    <div className="border rounded-lg p-3 bg-card">
      <div className="flex items-center gap-3">
        <Image
          src={userPlan.dashboardImage}
          alt="Membership"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{userPlan.displayName}</p>
          <p className="text-xs text-muted-foreground">{expiryText}</p>
        </div>
      </div>
    </div>
  );

  // Sidebar content component (reused in desktop and mobile)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Navigation Pages - Scrollable when needed, Hidden when user card is expanded */}
      {!isUserCardExpanded && (
        <nav className="flex-1 overflow-y-auto px-6 pt-6 space-y-2 min-h-0">
          {isLoading ? (
            // Skeleton loader for navigation
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 bg-muted animate-pulse rounded-md" />
              ))}
            </>
          ) : (
            filteredAdminPages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.href;
              return (
                <Link key={page.href} href={page.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 text-sm font-medium transition-colors ${isActive
                      ? 'text-white pointer-events-none'
                      : 'hover:!bg-transparent dark:hover:text-[oklch(0.5_0.134_242.749)]'
                      }`}
                    style={
                      isActive
                        ? { backgroundColor: 'oklch(0.5 0.134 242.749)' }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {page.name}
                  </Button>
                </Link>
              );
            })
          )}
        </nav>
      )}

      {/* Bottom Section - Always visible at bottom */}
      <div className={`flex-shrink-0 ${isUserCardExpanded ? 'flex-1 flex flex-col p-6' : 'p-6 space-y-3'}`}>
        {/* Admin Access Level Card - Hidden when user card is expanded */}
        {!isUserCardExpanded && adminCard}

        {/* User Card */}
        <div className={isUserCardExpanded ? 'flex-1' : ''}>
          <ExpandableUserCard
            userInitials={getUserInitials()}
            userDisplayName={getUserDisplayName()}
            userFullName={getUserFullName()}
            userEmail={getUserEmail()}
            profilePictureUrl={convexUser?.profilePictureUrl}
            membershipCard={membershipCard}
            adminCard={adminCard}
            isAdmin={!!adminData}
            onExpandChange={setIsUserCardExpanded}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header and Sidebar */}
      <AdminMobileHeader
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onClose={() => setIsMobileSidebarOpen(false)}
        sidebarContent={sidebarContent}
      />

      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <aside className="hidden lg:flex w-[17.5%] min-w-[220px] max-w-[17.5%] rounded-2xl border bg-card m-4 flex-col sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
        {/* Logo and Theme Toggle */}
        <div className="flex items-center justify-between p-6 pb-0">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/daniel-logo.png"
              alt="Daniel's Next Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold font-inter">
              Daniel&apos;s Next
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border mt-6"></div>

        {/* Sidebar Content */}
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pt-24 lg:pt-8 lg:p-8">
        {children}
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
