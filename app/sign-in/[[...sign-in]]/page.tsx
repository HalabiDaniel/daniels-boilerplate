import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <SignIn />
    </div>
  );
}
