import { UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <p className="text-muted-foreground">Welcome to your dashboard!</p>
    </div>
  );
}
