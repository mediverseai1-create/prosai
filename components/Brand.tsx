import Link from "next/link";

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-lg font-bold tracking-tight ${light ? "text-white" : ""}`}>
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-green text-sm text-white">P</span>
      ProsAI
    </Link>
  );
}

const NAV = [
  { href: "/features", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "Company" },
];

// Floating pill navigation. It takes no layout space, so heroes can sit beneath it.
export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 h-0">
      <header className="mx-auto max-w-5xl px-3 pt-3">
        <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.12)]">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-6 text-sm font-medium md:flex">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="hover:text-green">{n.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn hidden sm:inline-flex">Log in</Link>
            <Link href="/signup" className="btn btn-primary">Start free trial</Link>
          </div>
        </div>
        <details className="mt-2 rounded-2xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.12)] md:hidden">
          <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold">Menu</summary>
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-3 text-sm font-medium">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="py-2">{n.label}</Link>)}
            <Link href="/login" className="py-2">Log in</Link>
          </nav>
        </details>
      </header>
    </div>
  );
}

const COLS = [
  { title: "Product", links: [["Workbench", "/features"], ["Pricing", "/pricing"], ["Security", "/security"]] },
  { title: "Solutions", links: [["List cleanup", "/solutions#cleanup"], ["Lead scoring", "/solutions#scoring"], ["Outbound prep", "/solutions#outbound"], ["Inbound triage", "/solutions#inbound"]] },
  { title: "Company", links: [["About", "/about"], ["FAQ", "/#faq"], ["Sign up", "/signup"], ["Log in", "/login"]] },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-green-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">Lead research for revenue teams: import, enrich with readable rules, and get AI assessments grounded in your own data.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold">{c.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              {c.links.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <p className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} ProsAI. An independent product, not affiliated with any other company.
      </p>
    </footer>
  );
}
