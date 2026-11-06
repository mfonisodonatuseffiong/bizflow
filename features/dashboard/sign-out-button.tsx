"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex-1 overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(109,40,217,0.45)] ring-1 ring-white/40 transition duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(109,40,217,0.65)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:ring-offset-2 focus:ring-offset-pink-100 disabled:opacity-60 disabled:hover:scale-100"
    >
      <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/35 to-transparent" />
      <span className="relative">{pending ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}

export function SignOutButton({
  action,
  userName,
}: {
  action: () => Promise<void>;
  userName: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="rounded-xl border border-white/80 bg-white/60 px-3.5 py-2 text-sm font-semibold text-indigo-900 shadow-[0_6px_18px_rgba(124,58,237,0.15)] backdrop-blur-xl transition duration-300 hover:border-fuchsia-400/60 hover:bg-white/85 hover:text-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
      >
        Sign out
      </button>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="bf-pop m-auto w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl border border-white/80 bg-pink-100/95 p-0 text-indigo-900 shadow-[0_25px_70px_rgba(109,40,217,0.4)] backdrop-blur-2xl backdrop:bg-indigo-900/30 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-7 text-center">
          {/* Orange-to-fuchsia-to-indigo line across the top */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-orange-400 via-fuchsia-500 to-indigo-500"
          />
          {/* Fuchsia glow behind the icon */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-fuchsia-400/40 blur-3xl" />

          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-pink-500 text-white shadow-[0_8px_24px_rgba(244,114,182,0.55)]">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <h2 className="relative mt-5 text-lg font-semibold tracking-tight text-indigo-900">
            Sign out of BizFlow?
          </h2>
          <p className="relative mt-2 text-sm leading-relaxed text-indigo-800/80">
            {userName}, you will need to sign in again to get back to your
            workspace.
          </p>

          <form action={action} className="relative mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="flex-1 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:border-fuchsia-400/60 hover:bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
            >
              Stay signed in
            </button>
            <ConfirmButton />
          </form>
        </div>
      </dialog>
    </>
  );
}