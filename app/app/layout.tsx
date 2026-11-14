import Link from "next/link";
import { Logo } from "@/components/Brand";
import { signOut } from "@/app/actions/auth";
import { requireContext } from "@/lib/session";

const nav = [
  { href: "/app", label: "Overview" },
  { href: "/app/tables", label: "Lead tables" },
  { href: "/app/billing", label: "Billing & usage" },
  { href: "/app/settings", label: "Settings" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireContext();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-card md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4 md:block">
          <Logo href="/app" />
          <p className="hidden pt-4 text-xs text-muted md:block">{ctx.org.name}<br />Plan: {ctx.plan.name}</p>
        </div>
        <nav aria-label="Application" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper">{n.label}</Link>
          ))}
        </nav>
        <form action={signOut} className="hidden px-3 pt-6 md:block">
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-paper">Sign out</button>
        </form>
      </aside>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
