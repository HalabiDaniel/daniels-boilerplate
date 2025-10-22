'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SubscriptionDisplayData } from '@/components/admin/subscription-data-table';
import { AutoRenewToggle } from '@/components/admin/auto-renew-toggle';

interface SubscriptionAccordionListProps {
  subscriptions: SubscriptionDisplayData[];
  'aria-label'?: string;
}




export function SubscriptionAccordionList({ subscriptions, 'aria-label': ariaLabel }: SubscriptionAccordionListProps) {
  // Subscriptions are already sorted by the parent component via the hook
  // No need to sort again here since sorting is handled centrally

  return (
    <div 
      className="border rounded-lg"
      role="region"
      aria-label={ariaLabel || `Subscription management list with ${subscriptions.length} subscriptions`}
    >
      <Accordion type="single" collapsible className="w-full">
        {subscriptions.map((subscription) => (
          <AccordionItem 
            key={subscription.id} 
            value={subscription.id} 
            className="border-b last:border-b-0"
          >
            <AccordionTrigger 
              className="px-4 py-3 hover:no-underline focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`View details for ${subscription.fullName}, ${subscription.email}`}
            >
              <div className="flex flex-col items-start text-left flex-1 min-w-0">
                <span className="font-medium text-sm truncate w-full">{subscription.email}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-3" role="group" aria-labelledby={`subscription-${subscription.id}-details`}>
                <h3 id={`subscription-${subscription.id}-details`} className="sr-only">
                  Details for {subscription.fullName}
                </h3>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`subscription-${subscription.id}-name-label`}>
                    Name
                  </p>
                  <p className="text-sm font-medium" aria-labelledby={`subscription-${subscription.id}-name-label`}>
                    {subscription.fullName}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`subscription-${subscription.id}-subscription-label`}>
                    Subscription
                  </p>
                  <p className="text-sm" aria-labelledby={`subscription-${subscription.id}-subscription-label`}>
                    {subscription.subscriptionPlan.displayName}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`subscription-${subscription.id}-enddate-label`}>
                    End Date
                  </p>
                  <p className="text-sm" aria-labelledby={`subscription-${subscription.id}-enddate-label`}>
                    {subscription.currentPeriodEndFormatted}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`subscription-${subscription.id}-autorenew-label`}>
                    Auto Renew
                  </p>
                  <div aria-labelledby={`subscription-${subscription.id}-autorenew-label`}>
                    {subscription.stripeSubscriptionId && subscription.stripeCustomerId ? (
                      <AutoRenewToggle
                        stripeCustomerId={subscription.stripeCustomerId}
                        subscriptionId={subscription.stripeSubscriptionId}
                        initialValue={subscription.autoRenew}
                        disabled={subscription.isCancelledWithRefund}
                      />
                    ) : (
                      <p className="text-sm">{subscription.autoRenew ? 'On' : 'Off'}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1" id={`subscription-${subscription.id}-payment-label`}>
                    Payment
                  </p>
                  <p className="text-sm" aria-labelledby={`subscription-${subscription.id}-payment-label`}>
                    {subscription.paymentAmountFormatted}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
