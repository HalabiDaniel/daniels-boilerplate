import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';

export default function AdminAnalytics() {
  return (
    <AccessControlWrapper requiredPage="/admin/analytics">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Analytics
        </h1>
        <p className="text-muted-foreground">View platform analytics and insights</p>
      </div>
    </AccessControlWrapper>
  );
}
