// Original decorative scene: rolling hills, a floating lead table and toy-like shapes.
export function HeroScene() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" aria-hidden className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd0ee" />
          <stop offset="0.7" stopColor="#cfeee3" />
          <stop offset="1" stopColor="#bfe3b0" />
        </linearGradient>
      </defs>
      <rect width="1200" height="520" fill="url(#sky)" />
      <path d="M0 330 C 220 250 420 300 640 270 S 1020 220 1200 290 V520 H0Z" fill="#4aa45f" />
      <path d="M0 400 C 260 330 460 380 700 350 S 1040 330 1200 380 V520 H0Z" fill="#1f8a55" />
      <path d="M0 470 C 300 420 560 460 820 435 S 1100 430 1200 450 V520 H0Z" fill="#035d44" />
      {[90, 150, 1010, 1080, 1140].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i % 2 ? 330 : 345})`}>
          <rect x="-3" y="14" width="6" height="16" fill="#0b4a37" />
          <path d="M0 -26 L16 16 H-16Z" fill="#0f7a4b" />
        </g>
      ))}
      {/* floating lead table */}
      <g transform="translate(470 100) rotate(-6)"><g className="float">
        <rect width="250" height="150" rx="16" fill="#fff" />
        <rect width="250" height="30" rx="16" fill="#dff15b" />
        <rect y="16" width="250" height="14" fill="#dff15b" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r} transform={`translate(14 ${48 + r * 24})`}>
            <rect width="70" height="10" rx="5" fill="#d8d6cc" />
            <rect x="86" width="90" height="10" rx="5" fill="#e8e6dd" />
            <rect x="192" width={30 + ((r * 13) % 22)} height="10" rx="5" fill={["#bcd9ff", "#ffd66b", "#ffc9d4", "#dff15b"][r]} />
          </g>
        ))}
      </g></g>
      {/* toy shapes */}
      <circle cx="330" cy="210" r="22" fill="#ff7a50" />
      <circle cx="780" cy="170" r="16" fill="#ffd66b" />
      <circle cx="860" cy="260" r="26" fill="#bcd9ff" />
      <rect x="250" y="270" width="64" height="64" rx="14" fill="#ffc9d4" transform="rotate(12 282 302)" />
      <path d="M930 330 l40 -70 l40 70Z" fill="#7a5cff" />
      <circle cx="700" cy="330" r="12" fill="#16120f" />
    </svg>
  );
}
