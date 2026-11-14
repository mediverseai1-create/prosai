import { requireContext } from "@/lib/session";
import { SettingsForm } from "@/components/SettingsForm";

export const metadata = { title: "Settings" };

export default async function Page() {
  const ctx = await requireContext();
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">Signed in as {ctx.user.email}</p>
      <SettingsForm name={ctx.org.name} icp={ctx.org.icp} />
    </div>
  );
}
