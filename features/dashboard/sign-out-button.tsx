"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative flex-1 overflow-hidden rounded-xl border border-accent-500/60 bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(231,76,60,0.45)] transition duration-300 hover:bg-accent-600 hover:shadow-[0_0_34px_rgba(231,76,60,0.65)] focus:outline-none focus:ring-2 focus:ring-accent-500/60 focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60"
    >
      <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
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
        className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-500/40"
      >
        Sign out
      </button>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="bf-pop m-auto w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-card p-0 text-white shadow-2xl shadow-black/50 ring-1 ring-accent-500/20 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-7 text-center">
          {/* Coral-to-orange line across the top */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent-600 via-accent-500 to-orange-400"
          />
          {/* Coral glow behind the icon */}
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent-500/30 blur-3xl" />

          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-500/40 bg-accent-500/15 text-accent-500 shadow-[0_0_20px_rgba(231,76,60,0.35)]">
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
          <h2 className="relative mt-5 text-lg font-semibold tracking-tight">
            Sign out of BizFlow?
          </h2>
          <p className="relative mt-2 text-sm leading-relaxed text-slate-300">
            {userName}, you will need to sign in again to get back to your
            workspace.
          </p>

          <form action={action} className="relative mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
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