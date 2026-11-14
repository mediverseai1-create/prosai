import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { forgotPassword } from "@/app/actions/auth";

export const metadata = { title: "Reset password" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <div className="mt-6">
        <AuthForm action={forgotPassword} submit="Send reset link" fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]} />
      </div>
      <p className="mt-5 text-sm"><Link href="/login" className="text-muted underline">Back to sign in</Link></p>
    </>
  );
}
