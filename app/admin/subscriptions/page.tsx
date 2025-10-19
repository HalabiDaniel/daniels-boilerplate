import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';

export default function AdminSubscriptions() {
  return (
    <AccessControlWrapper requiredPage="/admin/subscriptions">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Subscriptions
        </h1>
        <p className="text-muted-foreground">Monitor and manage subscription plans</p>
      </div>
    </AccessControlWrapper>
  );
}
