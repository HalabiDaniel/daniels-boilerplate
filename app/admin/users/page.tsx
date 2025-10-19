import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';

export default function AdminUsers() {
  return (
    <AccessControlWrapper requiredPage="/admin/users">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Users
        </h1>
        <p className="text-muted-foreground">Manage user accounts and subscriptions</p>
      </div>
    </AccessControlWrapper>
  );
}
