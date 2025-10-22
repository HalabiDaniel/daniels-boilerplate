'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { AutoRenewToggle } from '@/components/admin/auto-renew-toggle';

export interface SubscriptionDisplayData {
  id: string;
  userId: string;
  clerkId: string;
  fullName: string;
  email: string;
  initials: string;
  profilePictureUrl?: string;
  subscriptionPlan: {
    name: string;
    displayName: string;
  };
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: number;
  currentPeriodEndFormatted: string;
  autoRenew: boolean;
  paymentAmount: number;
  billingFrequency: 'monthly' | 'yearly';
  paymentAmountFormatted: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  isCancelledWithRefund?: boolean;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

interface SubscriptionDataTableProps {
  subscriptions: SubscriptionDisplayData[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  'aria-label'?: string;
}

interface SortableHeaderProps {
  field: string;
  label: string;
  currentSort: SortState;
  onSortChange: (sort: SortState) => void;
  className?: string;
}

function SortableHeader({ field, label, currentSort, onSortChange, className }: SortableHeaderProps) {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : 'asc';
  
  const handleClick = () => {
    if (isActive) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      // Set new field with default direction
      onSortChange({
        field,
        direction: 'asc',
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const sortStatus = isActive 
    ? `sorted ${direction === 'asc' ? 'ascending' : 'descending'}`
    : 'not sorted';

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="h-auto p-0 -ml-4 font-medium hover:bg-transparent focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label={`Sort by ${label}, currently ${sortStatus}`}
        aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" aria-hidden="true" />
        )}
      </Button>
    </TableHead>
  );
}



export function SubscriptionDataTable({ 
  subscriptions, 
  sort, 
  onSortChange,
  'aria-label': ariaLabel 
}: SubscriptionDataTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table 
        role="table" 
        aria-label={ariaLabel || `Subscription management table with ${subscriptions.length} subscriptions`}
      >
        <TableHeader>
          <TableRow role="row">
            <SortableHeader
              field="name"
              label="User"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="email"
              label="Email"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="subscription"
              label="Subscription"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <SortableHeader
              field="date"
              label="End Date"
              currentSort={sort}
              onSortChange={onSortChange}
            />
            <TableHead aria-label="Auto Renew">
              Auto Renew
            </TableHead>
            <SortableHeader
              field="amount"
              label="Payment"
              currentSort={sort}
              onSortChange={onSortChange}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow 
              key={subscription.id} 
              role="row"
              aria-rowindex={index + 2} // +2 because header is row 1
            >
              <TableCell role="gridcell">
                <span className="font-medium">{subscription.fullName}</span>
              </TableCell>
              <TableCell role="gridcell" aria-label={`Email: ${subscription.email}`}>
                {subscription.email}
              </TableCell>
              <TableCell role="gridcell" aria-label={`Subscription: ${subscription.subscriptionPlan.displayName}`}>
                <span>{subscription.subscriptionPlan.displayName}</span>
              </TableCell>
              <TableCell role="gridcell" aria-label={`End date: ${subscription.currentPeriodEndFormatted}`}>
                {subscription.currentPeriodEndFormatted}
              </TableCell>
              <TableCell role="gridcell" aria-label={`Auto renew: ${subscription.autoRenew ? 'On' : 'Off'}`}>
                {subscription.stripeSubscriptionId && subscription.stripeCustomerId ? (
                  <AutoRenewToggle
                    stripeCustomerId={subscription.stripeCustomerId}
                    subscriptionId={subscription.stripeSubscriptionId}
                    initialValue={subscription.autoRenew}
                    disabled={subscription.isCancelledWithRefund}
                  />
                ) : (
                  <span>{subscription.autoRenew ? 'On' : 'Off'}</span>
                )}
              </TableCell>
              <TableCell role="gridcell" aria-label={`Payment: ${subscription.paymentAmountFormatted}`}>
                {subscription.paymentAmountFormatted}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
