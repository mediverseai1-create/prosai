import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold tracking-tight text-lg">
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm text-white">P</span>
      ProsAI
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn">Sign in</Link>
          <Link href="/signup" className="btn btn-primary">Start free</Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} ProsAI. An independent product, not affiliated with any other company.</p>
        <nav className="flex gap-5" aria-label="Footer">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/login">Sign in</Link>
        </nav>
      </div>
    </footer>
  );
}
