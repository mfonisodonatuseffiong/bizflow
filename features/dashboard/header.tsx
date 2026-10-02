import { logoutAction } from "@/features/auth/login";
import { SignOutButton } from "@/features/dashboard/sign-out-button";

export function Header({
  businessName,
  role,
  userName,
  userEmail,
  menu,
}: {
  businessName: string;
  role: string;
  userName: string;
  userEmail: string;
  menu?: React.ReactNode;
}) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-surface/85 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-xl sm:px-6">
      {/* Coral-to-orange line along the bottom edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-accent-500 to-orange-400"
      />

      <div className="flex min-w-0 items-center gap-3">
        {menu}
        <h2 className="truncate text-sm font-semibold text-white">
          {businessName}
        </h2>
        <span className="rounded-full bg-accent-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-400 ring-1 ring-accent-500/40">
          {role}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          title="No notifications yet"
          aria-label="Notifications"
          className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 p-2 text-slate-500"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0" />
          </svg>
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card py-1.5 pl-1.5 pr-1.5 shadow-md shadow-black/20 transition hover:border-accent-500/50 sm:pr-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-accent-500 to-orange-400 text-xs font-bold text-white shadow-[0_0_14px_rgba(231,76,60,0.45)]">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-white">
              {userName}
            </p>
            <p className="text-[11px] leading-tight text-slate-300">
              {userEmail}
            </p>
          </div>
        </div>

        <SignOutButton action={logoutAction} userName={userName} />
      </div>
    </header>
  );
}