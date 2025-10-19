import { AccessControlWrapper } from '@/components/admin/access-control-wrapper';

export default function AdminSettings() {
  return (
    <AccessControlWrapper requiredPage="/admin/settings">
      <div>
        <h1 className="text-3xl font-semibold mb-6" style={{ letterSpacing: '-1px' }}>
          Settings
        </h1>
        <p className="text-muted-foreground">Configure admin dashboard settings</p>
      </div>
    </AccessControlWrapper>
  );
}
