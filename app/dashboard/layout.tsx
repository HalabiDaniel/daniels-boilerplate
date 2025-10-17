'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut } from 'lucide-react';
import { getUserPlan, getExpiryDateString } from '@/lib/subscription-helpers';

const dashboardPages = [
  { name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Components', href: '/dashboard/components', icon: Package },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Profile Settings', href: '/dashboard/profile-settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Get user's subscription plan using helper
  const userPlan = getUserPlan(user);
  const expiryText = getExpiryDateString(user);

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[17.5%] min-w-[220px] max-w-[17.5%] rounded-2xl border bg-card m-4 p-6 flex flex-col">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
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

        {/* Divider */}
        <div className="w-full h-px bg-border mb-6"></div>

        {/* Navigation Pages */}
        <nav className="flex-1 space-y-2">
          {dashboardPages.map((page) => {
            const Icon = page.icon;
            const isActive = pathname === page.href;
            return (
              <Link key={page.href} href={page.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-sm font-medium transition-colors ${isActive
                    ? 'text-white pointer-events-none'
                    : 'hover:bg-transparent hover:text-[oklch(0.5_0.134_242.749)]'
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

        {/* Bottom Section */}
        <div className="space-y-3">
          {/* Go Back Home Button - Currently disabled*/}
          {/* <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sm hover:bg-transparent hover:text-[oklch(0.5_0.134_242.749)] transition-colors"
            >
              <Home className="h-4 w-4" />
              Go back home
            </Button>
          </Link> */}

          {/* Membership Card */}
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

          {/* User Card */}
          <div className="border rounded-lg p-3 bg-card">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
              >
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                aria-label="Sign out"
                className="h-8 w-8 flex-shrink-0"
              >
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
