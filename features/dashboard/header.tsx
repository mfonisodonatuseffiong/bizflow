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
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/70 bg-white/40 px-4 py-3 text-indigo-900 shadow-[0_8px_30px_rgba(124,58,237,0.12)] backdrop-blur-2xl sm:px-6">
      {/* Orange-to-fuchsia-to-indigo line along the bottom edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-fuchsia-500 to-orange-400"
      />

      <div className="flex min-w-0 items-center gap-3">
        {menu}
        <h2 className="truncate text-sm font-semibold text-indigo-900">
          {businessName}
        </h2>
        <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fuchsia-700 ring-1 ring-fuchsia-500/40">
          {role}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          title="No notifications yet"
          aria-label="Notifications"
          className="cursor-not-allowed rounded-xl border border-white/80 bg-white/50 p-2 text-indigo-800/40"
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

        <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 py-1.5 pl-1.5 pr-1.5 shadow-[0_8px_24px_rgba(124,58,237,0.15)] backdrop-blur-xl transition hover:border-fuchsia-400/60 hover:bg-white/75 sm:pr-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-pink-500 text-xs font-bold text-white shadow-[0_6px_16px_rgba(244,114,182,0.5)]">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-indigo-900">
              {userName}
            </p>
            <p className="text-[11px] leading-tight text-indigo-800/70">
              {userEmail}
            </p>
          </div>
        </div>

        <SignOutButton action={logoutAction} userName={userName} />
      </div>
    </header>
  );
}