'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, CreditCard, Settings, Moon, Sun } from 'lucide-react';
import { getPlanById, getDefaultPlan } from '@/lib/subscription-plans';
import { formatDateOnly } from '@/lib/subscription-helpers';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ExpandableUserCard } from '@/components/layouts/expandable-user-card';
import { DashboardMobileHeader } from '@/components/layouts/dashboard-mobile-header';
import { Toaster } from '@/components/ui/sonner';

const dashboardPages = [
  { name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Components', href: '/dashboard/components', icon: Package },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Profile Settings', href: '/dashboard/profile-settings', icon: Settings },
];

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isUserCardExpanded, setIsUserCardExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch user subscription data from Convex
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Mutation to create user if they don't exist
  const upsertUser = useMutation(api.users.upsertUser);

  // Create user in Convex if they don't exist (fallback for webhook)
  useEffect(() => {
    if (user && convexUser === null) {
      // User is signed in but doesn't exist in Convex
      const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
      if (primaryEmail) {
        upsertUser({
          clerkId: user.id,
          email: primaryEmail,
          subscriptionPlanId: 'free',
        }).catch(console.error);
      }
    }
  }, [user, convexUser, upsertUser]);

  // Get user's subscription plan from Convex data
  const userPlan = convexUser?.subscriptionPlanId
    ? getPlanById(convexUser.subscriptionPlanId) || getDefaultPlan()
    : getDefaultPlan();

  // Format expiry date (just the date without prefix)
  const expiryText = convexUser?.currentPeriodEnd && convexUser.subscriptionPlanId !== 'free'
    ? formatDateOnly(convexUser.currentPeriodEnd)
    : 'No expiry';

  // Loading state
  const isLoading = user && convexUser === undefined;

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

  // Membership card component
  const membershipCard = isLoading ? (
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
          {dashboardPages.map((page) => {
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
          })}
        </nav>
      )}

      {/* Bottom Section - Always visible at bottom */}
      <div className={`flex-shrink-0 ${isUserCardExpanded ? 'flex-1 flex flex-col p-6' : 'p-6 space-y-3'}`}>
        {/* Membership Card - Hidden when user card is expanded */}
        {!isUserCardExpanded && membershipCard}

        {/* User Card */}
        <div className={isUserCardExpanded ? 'flex-1' : ''}>
          <ExpandableUserCard
            userInitials={getUserInitials()}
            userDisplayName={getUserDisplayName()}
            userFullName={getUserFullName()}
            userEmail={getUserEmail()}
            profilePictureUrl={convexUser?.profilePictureUrl}
            membershipCard={membershipCard}
            isAdmin={false}
            onExpandChange={setIsUserCardExpanded}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Header and Sidebar */}
      <DashboardMobileHeader
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onClose={() => setIsMobileSidebarOpen(false)}
        sidebarContent={sidebarContent}
      />

      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <aside className="hidden lg:flex w-[17.5%] min-w-[220px] max-w-[17.5%] rounded-2xl border bg-card m-4 flex-col">
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
      <main className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8">
        {children}
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
