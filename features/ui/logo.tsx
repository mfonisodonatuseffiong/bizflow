export function Logo({ size = 48, animated = false }: { size?: number; animated?: boolean }) {
  return (
    <span
      className="relative flex items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/40"
      style={{ width: size, height: size }}
    >
      {animated ? (
        <>
          <span className="bf-pulse absolute -inset-3 rounded-3xl bg-brand-500/30 blur-xl" />
          <span className="bf-spin absolute -inset-2 rounded-[1.4rem] border-2 border-transparent border-t-brand-400" />
        </>
      ) : null}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative h-1/2 w-1/2"
        aria-hidden="true"
      >
        <path className={animated ? "bf-draw" : ""} d="M3 12h5l2-6 4 12 2-6h5" />
      </svg>
    </span>
  );
}
