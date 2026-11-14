import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signUp } from "@/app/actions/auth";

export const metadata = { title: "Create account" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Create your workspace</h1>
      <p className="mt-1 text-sm text-muted">Free to start. No card required.</p>
      <div className="mt-6">
        <AuthForm action={signUp} submit="Create account"
          fields={[{ name: "email", label: "Work email", type: "email", autoComplete: "email" }, { name: "password", label: "Password (8+ characters)", type: "password", autoComplete: "new-password" }]} />
      </div>
      <p className="mt-5 text-sm text-muted">Already have an account? <Link href="/login" className="underline">Sign in</Link></p>
    </>
  );
}
