"use client";

import { startTransition, useActionState } from "react";
import {
  updateBusinessNameAction,
  type BusinessNameState,
} from "@/features/settings/actions";

const inputClass =
  "block w-full rounded-xl border border-white/15 bg-brand-700/60 px-3.5 py-2.5 text-base text-white shadow-sm placeholder:text-slate-500 transition focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:text-sm";

export function BusinessNameForm({ name }: { name: string }) {
  const [state, formAction, pending] = useActionState<BusinessNameState, FormData>(
    updateBusinessNameAction,
    { status: "idle" },
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-200">
        Business name
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={name}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="group relative shrink-0 overflow-hidden rounded-xl border border-accent-500/60 bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(231,76,60,0.45)] transition duration-300 hover:bg-accent-600 hover:shadow-[0_0_34px_rgba(231,76,60,0.65)] focus:outline-none focus:ring-2 focus:ring-accent-500/60 focus:ring-offset-2 focus:ring-offset-card disabled:opacity-60"
        >
          <span className="pointer-events-none absolute inset-x-3 top-0 h-1/2 rounded-b-full bg-linear-to-b from-white/30 to-transparent" />
          <span className="relative">{pending ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {state.status === "error" ? (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {state.message}
        </div>
      ) : null}
      {state.status === "success" ? (
        <div
          role="status"
          className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
