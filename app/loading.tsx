import { Logo } from "@/features/ui/logo";
import { Wordmark } from "@/features/ui/wordmark";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-pink-200 px-6 text-indigo-900"
    >
      {/* Peach sorbet background with drifting glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-linear-to-br from-orange-200 via-pink-200 to-violet-300"
      >
        <div className="bf-blob-a absolute -left-32 -top-32 h-[40rem] w-[40rem] rounded-full bg-yellow-300/70 blur-[110px]" />
        <div className="bf-blob-b absolute -right-32 top-1/4 h-[38rem] w-[38rem] rounded-full bg-sky-300/70 blur-[110px]" />
        <div className="bf-blob-c absolute -bottom-32 left-1/4 h-[36rem] w-[36rem] rounded-full bg-fuchsia-300/70 blur-[110px]" />
      </div>

      {/* Glass card */}
      <div className="relative w-full max-w-sm">
        <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-linear-to-br from-orange-300/60 via-fuchsia-300/50 to-sky-300/60 blur-3xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/45 px-8 py-12 text-center shadow-[0_20px_60px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
          {/* Accent line on top */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />

          {/* Logo with glowing rings */}
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <svg
              className="bf-spin-slow pointer-events-none absolute inset-0 h-full w-full text-fuchsia-500"
              viewBox="0 0 160 160"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle
                cx="80"
                cy="80"
                r="76"
                strokeOpacity="0.35"
                strokeDasharray="3 8"
              />
              <circle cx="80" cy="80" r="58" strokeOpacity="0.25" />
              <circle cx="156" cy="80" r="4" fill="currentColor" stroke="none" />
              <circle
                cx="22"
                cy="80"
                r="3"
                fill="currentColor"
                stroke="none"
                opacity="0.6"
              />
            </svg>

            <span className="bf-ripple pointer-events-none absolute h-24 w-24 rounded-full border border-fuchsia-500/50" />
            <span className="bf-ripple pointer-events-none absolute h-24 w-24 rounded-full border border-fuchsia-500/50 [animation-delay:1.07s]" />

            <div className="bf-float relative">
              <Logo size={72} animated />
            </div>
          </div>

          {/* Name */}
          <div className="mt-6">
            <Wordmark tone="dark" className="text-2xl" />
          </div>

          {/* Shimmering progress bar */}
          <div className="mx-auto mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-white/70">
            <div className="bf-shimmer-text h-full w-full rounded-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-orange-400" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-indigo-800/70">
            Loading your workspace
          </p>
        </div>
      </div>

      <span className="sr-only">Loading BizFlow</span>
    </div>
  );
}