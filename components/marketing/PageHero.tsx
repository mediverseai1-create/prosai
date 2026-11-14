import Link from "next/link";

export function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="bg-green px-4 pb-20 pt-36 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="display mt-4 max-w-4xl text-5xl md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-white/75">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-accent btn-lg">Start free trial →</Link>
          <Link href="/pricing" className="btn btn-cream btn-lg">View pricing</Link>
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title }: { title: string }) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4">
      <div className="rounded-[2rem] bg-green px-6 py-16 text-center text-white md:py-24">
        <h2 className="display mx-auto max-w-3xl text-4xl md:text-5xl">{title}</h2>
        <Link href="/signup" className="btn btn-accent btn-lg mt-8">Start free trial →</Link>
      </div>
    </section>
  );
}
