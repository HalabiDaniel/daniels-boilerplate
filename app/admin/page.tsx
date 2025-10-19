import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';

export default function AdminDashboard() {
  return (
    <AccessControlWrapper requiredPage="/admin">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Overview of system metrics and activity</p>
      </div>
    </AccessControlWrapper>
  );
}
