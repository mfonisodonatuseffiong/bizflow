export function AuthBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-teal-400/15 blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <pattern id="bf-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M56 0H0V56"
              strokeWidth="1"
              style={{ stroke: "var(--color-brand-400)" }}
              strokeOpacity="0.18"
            />
          </pattern>

          <radialGradient id="bf-fade" cx="50%" cy="45%" r="70%">
            <stop offset="0" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask id="bf-mask">
            <rect width="1440" height="900" fill="url(#bf-fade)" />
          </mask>

          <linearGradient id="bf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--color-brand-400)" }} stopOpacity="0" />
            <stop offset="0.5" style={{ stopColor: "var(--color-brand-400)" }} stopOpacity="0.95" />
            <stop offset="1" style={{ stopColor: "var(--color-brand-500)" }} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#bf-grid)" mask="url(#bf-mask)" />

        <g stroke="url(#bf-line)" strokeWidth="1.6" strokeLinecap="round">
          <path d="M-40 700 C 240 560, 420 820, 700 640 S 1180 420, 1480 520" />
          <path d="M-40 560 C 220 420, 460 640, 720 480 S 1200 260, 1480 360" strokeOpacity="0.7" />
          <path d="M-40 420 C 260 300, 480 500, 760 340 S 1200 140, 1480 220" strokeOpacity="0.45" />
        </g>

        <g style={{ fill: "var(--color-brand-400)" }}>
          <circle cx="700" cy="640" r="12" opacity="0.15" />
          <circle cx="700" cy="640" r="4" />
          <circle cx="720" cy="480" r="10" opacity="0.15" />
          <circle cx="720" cy="480" r="3.5" />
          <circle cx="1010" cy="435" r="9" opacity="0.15" />
          <circle cx="1010" cy="435" r="3" />
        </g>
      </svg>
    </div>
  );
}
