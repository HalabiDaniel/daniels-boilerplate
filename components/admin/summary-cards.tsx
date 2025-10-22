'use client';

import { Skeleton } from '@/components/admin/loading-states';

interface SummaryCardsProps {
  totalPayingUsers: number;
  totalMRR: number;
  totalRefunds: number;
  expectedARR: number;
  isLoading: boolean;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  isLoading: boolean;
  'aria-label'?: string;
}

function MetricCard({ label, value, isLoading, 'aria-label': ariaLabel }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-4 md:p-8 bg-card border">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl p-4 md:p-8 bg-card border"
      role="article"
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <div className="space-y-2">
        <p className="text-[14px] font-normal text-muted-foreground dark:text-foreground">{label}</p>
        <h4 className="text-lg md:text-2xl font-semibold text-foreground">
          {value}
        </h4>
      </div>
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SummaryCards({
  totalPayingUsers,
  totalMRR,
  totalRefunds,
  expectedARR,
  isLoading,
}: SummaryCardsProps) {
  return (
    <section 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      aria-labelledby="analytics-heading"
      role="region"
    >
      <h2 id="analytics-heading" className="sr-only">
        Subscription Analytics
      </h2>
      
      <MetricCard
        label="Total Paying Users"
        value={isLoading ? '-' : totalPayingUsers.toLocaleString()}
        isLoading={isLoading}
        aria-label={`Total paying users: ${totalPayingUsers}`}
      />
      
      <MetricCard
        label="Total MRR"
        value={isLoading ? '-' : formatCurrency(totalMRR)}
        isLoading={isLoading}
        aria-label={`Total monthly recurring revenue: ${formatCurrency(totalMRR)}`}
      />
      
      <MetricCard
        label="Total Refunds"
        value={isLoading ? '-' : formatCurrency(totalRefunds)}
        isLoading={isLoading}
        aria-label={`Total refunds: ${formatCurrency(totalRefunds)}`}
      />
      
      <MetricCard
        label="Expected ARR"
        value={isLoading ? '-' : formatCurrency(expectedARR)}
        isLoading={isLoading}
        aria-label={`Expected annual recurring revenue: ${formatCurrency(expectedARR)}`}
      />
    </section>
  );
}
