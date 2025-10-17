'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
        Billing
      </h1>
      <p className="text-muted-foreground mb-6">
        You've been redirected here after signing up. To complete your subscription, please go back to the pricing section and click the upgrade button for your desired plan.
      </p>
      <Button onClick={() => router.push('/#pricing')} className="text-white">
        Go to Pricing
      </Button>
    </div>
  );
}