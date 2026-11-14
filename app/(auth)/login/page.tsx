import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signIn } from "@/app/actions/auth";

export const metadata = { title: "Sign in" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; setup?: string; error?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      {sp.setup && <p className="mt-3 rounded-lg bg-sun/60 px-3 py-2 text-sm">Supabase is not configured yet. Add the variables from .env.example.</p>}
      {sp.error && <p className="mt-3 rounded-lg bg-rose/60 px-3 py-2 text-sm">That link is invalid or expired.</p>}
      <div className="mt-6">
        <AuthForm action={signIn} submit="Sign in" next={sp.next}
          fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]} />
      </div>
      <div className="mt-5 flex justify-between text-sm text-muted">
        <Link href="/forgot-password" className="underline">Forgot password?</Link>
        <Link href="/signup" className="underline">Create account</Link>
      </div>
    </>
  );
}
