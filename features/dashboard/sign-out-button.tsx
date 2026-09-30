"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Signing out..." : "Sign out"}
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
        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Sign out
      </button>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="bf-pop m-auto w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-slate-900/90 p-0 text-white shadow-2xl shadow-black/50 backdrop-blur-xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-7 text-center">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" />
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-brand-400">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <h2 className="relative mt-5 text-lg font-semibold tracking-tight">Sign out of BizFlow?</h2>
          <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
            {userName}, you will need to sign in again to get back to your workspace.
          </p>

          <form action={action} className="relative mt-7 flex gap-3">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
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
