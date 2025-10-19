'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, X, Edit } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

interface ExpandableUserCardProps {
  userInitials: string;
  userDisplayName: string;
  userFullName: string;
  userEmail: string;
  membershipCard: React.ReactNode;
  adminCard?: React.ReactNode;
  isAdmin?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function ExpandableUserCard({
  userInitials,
  userDisplayName,
  userFullName,
  userEmail,
  membershipCard,
  adminCard,
  isAdmin = false,
  onExpandChange,
}: ExpandableUserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking the logout button in collapsed state
    if (!isExpanded && (e.target as HTMLElement).closest('[data-logout-button]')) {
      return;
    }
    setIsClosing(false);
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const handleClose = () => {
    if (!isExpanded || isClosing) return;
    setIsClosing(true);
    // Wait for faster close animation to finish
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      onExpandChange?.(false);
    }, 150);
  };

  const handleEdit = () => {
    router.push('/dashboard/profile-settings');
  };

  const handleLogout = () => {
    signOut();
  };

  // Close when clicking outside the card while expanded
  useEffect(() => {
    if (!isExpanded) return;
    const onDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (cardRef.current && target && !cardRef.current.contains(target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => document.removeEventListener('mousedown', onDocumentMouseDown);
  }, [isExpanded]);

  return (
    <div 
      ref={cardRef}
      className={`border rounded-lg bg-card transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'h-full flex flex-col' : 'h-auto'
      } ${isExpanded && !isClosing ? 'animate-card-open-up' : ''} ${isClosing ? 'animate-card-close-down' : ''}`}
    >
      {!isExpanded ? (
        // Collapsed state
        <div 
          className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={handleCardClick}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userDisplayName}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Sign out"
              className="h-8 w-8 flex-shrink-0"
              data-logout-button
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>
      ) : (
        // Expanded state
        <div className="h-full p-6 flex flex-col animate-fade-in">
          {/* Header with initials, edit, and close */}
          <div className="flex items-start justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              aria-label="Edit profile"
              className="h-8 w-8 flex-shrink-0"
            >
              <Edit className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            
            <div
              className="h-12 w-12 rounded flex items-center justify-center text-white text-lg font-semibold"
              style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
            >
              {userInitials}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close"
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>

          {/* User info */}
          <div className="text-center mb-4">
            <p className="text-base font-semibold mb-1">{userFullName}</p>
            <p className="text-sm text-muted-foreground break-all">{userEmail}</p>
          </div>

          {/* Membership and admin cards */}
          <div className="space-y-3 mb-4">
            {membershipCard}
            {isAdmin && adminCard}
          </div>

          {/* Flexible spacer between cards and logout */}
          <div className="flex-1" />

          {/* Logout button */}
          <Button
            onClick={handleLogout}
            className="w-full text-white hover:text-white"
            style={{ backgroundColor: 'oklch(0.5 0.134 242.749)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#262626';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.5 0.134 242.749)';
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
