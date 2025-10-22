'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';

interface AutoRenewToggleProps {
  stripeCustomerId: string;
  subscriptionId: string;
  initialValue: boolean;
  disabled?: boolean;
}

export function AutoRenewToggle({ 
  stripeCustomerId,
  subscriptionId, 
  initialValue, 
  disabled = false
}: AutoRenewToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get real-time data from Convex
  const userData = useQuery(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });
  
  // Use Convex data if available, otherwise fall back to initial value
  const isEnabled = userData?.autoRenew ?? initialValue;

  const handleToggle = async () => {
    if (disabled || isUpdating) return;

    const newValue = !isEnabled;
    setIsUpdating(true);

    try {
      const response = await fetch('/api/admin/toggle-auto-renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          autoRenew: newValue,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        // Convex will automatically update via real-time subscription
      } else {
        throw new Error(result.error || 'Failed to update auto-renew');
      }
    } catch (error) {
      console.error('Failed to toggle auto-renew:', error);
      toast.error('Failed to update auto-renew status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isUpdating}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        backgroundColor: isEnabled ? 'oklch(0.5 0.134 242.749)' : 'oklch(0.391 0.09 240.876)'
      }}
      role="switch"
      aria-checked={isEnabled}
      aria-label={`Auto-renew ${isEnabled ? 'enabled' : 'disabled'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          isEnabled ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
