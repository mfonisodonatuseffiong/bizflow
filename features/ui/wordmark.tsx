import { Unbounded } from "next/font/google";

const display = Unbounded({ subsets: ["latin"], display: "swap" });

export function Wordmark({
  className = "",
  wave = false,
}: {
  className?: string;
  wave?: boolean;
}) {
  return (
    <span
      className={`${display.className} relative inline-block font-extrabold tracking-tighter ${className}`}
    >
      <span className="text-white">Biz</span>
      <span className="bf-shimmer bg-linear-to-r from-brand-400 via-teal-200 to-brand-400 bg-clip-text text-transparent">
        Flow
      </span>
      {wave ? (
        <svg
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute -bottom-3 left-0 h-3 w-full text-brand-400"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="bf-draw"
            pathLength={40}
            d="M2 8 C 30 0, 50 12, 80 6 S 130 0, 160 6 S 190 10, 198 4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
    </span>
  );
}
