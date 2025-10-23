import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <SignIn />
        <p className="text-sm text-muted-foreground">
          Forgot your password?{" "}
          <Link href="/reset-password" className="text-primary hover:underline font-medium">
            Reset it here
          </Link>
        </p>
      </div>
    </div>
  );
}
