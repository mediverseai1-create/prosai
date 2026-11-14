import { AuthForm } from "@/components/AuthForm";
import { resetPassword } from "@/app/actions/auth";

export const metadata = { title: "Choose a new password" };

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Choose a new password</h1>
      <div className="mt-6">
        <AuthForm action={resetPassword} submit="Update password" fields={[{ name: "password", label: "New password (8+ characters)", type: "password", autoComplete: "new-password" }]} />
      </div>
    </>
  );
}
