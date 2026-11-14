// Small product visuals using clearly labelled sample data.
const ROWS = [
  { name: "Ada Lovelace", company: "Analytical Co", domain: "analytical.example", score: 85, fit: "high" },
  { name: "Grace Hopper", company: "Compiler Labs", domain: "compilerlabs.example", score: 70, fit: "medium" },
  { name: "Alan Turing", company: "Enigma Works", domain: "enigmaworks.example", score: 45, fit: "unclear" },
  { name: "Katherine J.", company: "Orbit Dynamics", domain: "orbitdyn.example", score: 60, fit: "medium" },
];
const FIT: Record<string, string> = { high: "bg-lime", medium: "bg-sun", unclear: "bg-line", low: "bg-rose" };

export function TableMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white text-sm shadow-sm">
      <div className="grid grid-cols-[1.2fr_1.2fr_1.3fr_.6fr_.7fr] gap-2 bg-paper px-4 py-2 text-xs font-semibold text-muted">
        <span>Name</span><span>Company</span><span>Domain</span><span>Score</span><span>AI fit</span>
      </div>
      {ROWS.map((r) => (
        <div key={r.name} className="grid grid-cols-[1.2fr_1.2fr_1.3fr_.6fr_.7fr] items-center gap-2 border-t border-line px-4 py-2.5">
          <span className="truncate font-medium">{r.name}</span><span className="truncate">{r.company}</span>
          <span className="truncate text-muted">{r.domain}</span><span className="font-semibold">{r.score}</span>
          <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold text-black ${FIT[r.fit]}`}>{r.fit}</span>
        </div>
      ))}
      <p className="border-t border-line bg-paper px-4 py-2 text-xs text-muted">Sample data for illustration</p>
    </div>
  );
}

export function ScoreMock() {
  const items = [["Seniority: Director (+25)", 25], ["Valid-looking email (+20)", 20], ["Company domain known (+15)", 15], ["Company name present (+10)", 10]] as const;
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-sm shadow-sm">
      <div className="flex items-baseline justify-between"><b className="text-lg">Ada Lovelace</b><span className="text-3xl font-bold">70</span></div>
      <ul className="mt-4 space-y-2">
        {items.map(([t, n]) => (
          <li key={t}><div className="flex justify-between"><span>{t}</span></div><div className="mt-1 h-2 rounded-full bg-paper"><div className="h-2 rounded-full bg-green" style={{ width: `${n * 3.6}%` }} /></div></li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">Sample data for illustration</p>
    </div>
  );
}

export function ResearchMock() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-sm shadow-sm">
      <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-semibold text-black">fit: high</span>
      <p className="mt-3 font-medium">Director of Revenue Ops at a company with a known domain and a valid email; matches the ICP&apos;s seniority requirement.</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted"><li>Title matches the target persona</li><li>Enrichment score is 70</li><li>Company size is not in the data</li></ul>
      <p className="mt-3 rounded-xl bg-paper p-3 italic">&ldquo;Hi Ada, saw you lead revenue operations at Analytical Co…&rdquo;</p>
      <p className="mt-3 text-xs text-muted">Sample output. Real results use your rows and ICP.</p>
    </div>
  );
}

export function ExportMock() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 font-mono text-xs shadow-sm">
      <p className="text-muted">prosai-export.csv</p>
      <p className="mt-2 break-all">name,email,company,domain,score,ai_fit,ai_opener</p>
      <p className="mt-1 break-all">Ada Lovelace,ada@analytical.example,Analytical Co,analytical.example,85,high,&quot;Hi Ada…&quot;</p>
      <p className="mt-1 break-all">Grace Hopper,grace@compilerlabs.example,Compiler Labs,compilerlabs.example,70,medium,&quot;Hi Grace…&quot;</p>
      <p className="mt-3 font-sans text-muted">Sample data for illustration</p>
    </div>
  );
}
